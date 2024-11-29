import { ProductOptionAttributes } from './../interfaces/interfaces';
import { Request, Response } from 'express';
import Product from '../models/Producto';
import Category from '../models/Categoria';
import { Op, fn, col } from 'sequelize'; // Importar directamente desde 'sequelize'
import sequelize from 'sequelize';
import ProductOption from '../models/ProductOption';

export const createProduct = async (req: Request, res: Response) => {
  const { name, cost, price, stock, barcode, categoryId, productId } = req.body;
  const image = req.file ? req.file.filename : '';

  try {
      const newProduct = await Product.create({
          name,
          cost,
          price,
          stock,
          barcode,
          image,
          categoryId,
          productId
      }, {
          
      });

      

      res.status(201).json(newProduct);
  } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ msg: 'Error creating product', error });
  }
};

// Crear múltiples productos (importación masiva)
export const createProductsBulk = async (req: Request, res: Response) => {
  const products = req.body; // Se espera un array de productos

  try {
    const newProducts = await Product.bulkCreate(products);

    res.status(201).json(newProducts);
  } catch (error) {
    console.error('Error creating products:', error);
    res.status(500).json({ msg: 'Error creating products', error });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del producto a actualizar
  const { name, cost, price, stock, barcode, categoryId } = req.body;
  let options = req.body.options;
  
  // Verifica si las opciones están en formato string, si es así, conviértelas a un array
  if (typeof options === 'string') {
    try {
      options = JSON.parse(options);
    } catch (error) {
      console.error('Error parsing options:', error);
      return res.status(400).json({ msg: 'Error al procesar las opciones' });
    }
  }

  const image = req.file ? req.file.filename : undefined;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Actualizar el producto principal
    const updatedProduct = await product.update({
      name,
      cost,
      price,
      stock,
      barcode,
      image,
      categoryId,
    });

    if (Array.isArray(options)) {
      console.log('Opciones recibidas:', options);  // Comprobamos que ahora sí recibimos un array

      const existingOptions = await ProductOption.findAll({ where: { productId: id } });

      // Actualizar o crear nuevas opciones
      for (const option of options) {
        const existingOption = existingOptions.find(opt => opt.description === option.description);

        if (existingOption) {
          await existingOption.update({
            description: option.description,
            price: option.price,
          });
        } else {
          await ProductOption.create({
            description: option.description,
            price: option.price,
            productId: Number(id),
          });
        }
      }

      // Eliminar opciones que ya no existen
      const optionDescriptions = options.map(opt => opt.description);
      const optionsToDelete = existingOptions.filter(opt => !optionDescriptions.includes(opt.description));

      for (const option of optionsToDelete) {
        await option.destroy();
      }
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ msg: 'Error al actualizar el producto', error });
  }
};





// Obtener todos los productos
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: ProductOption,
        as: 'options'
      }]
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching products', error });
  }
};

// Obtener productos por categoría con paginación
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    // Paginación: page (página actual) y limit (productos por página)
    const page = parseInt(req.query.page as string) || 1; // Página por defecto: 1
    const limit = parseInt(req.query.limit as string) || 6; // Productos por página por defecto: 10

    // Calcula el desplazamiento (offset) para la consulta
    const offset = (page - 1) * limit;

    // Realiza la consulta paginada
    const { count, rows: products } = await Product.findAndCountAll({
      where: { categoryId },
      include: [{
        model: ProductOption,
        as: 'options'
      }],
      limit,
      offset
    });

    // Devuelve los productos junto con información de la paginación
    res.json({
      products,
      totalItems: count, // Total de productos en la categoría
      totalPages: Math.ceil(count / limit), // Número total de páginas
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching products by category', error });
  }
};


export const getProductsBySearch = async (req: Request, res: Response) => {
  const query = req.query.query; // asumiendo que el parámetro de búsqueda se pasa como ?query=valor

  // Asegúrate de que 'query' es una cadena y no está vacía
  if (typeof query !== 'string' || !query) {
    return res.status(400).json({ msg: 'El parámetro de búsqueda es requerido y debe ser una cadena.' });
  }

  try {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          // Buscar por nombre (insensible a mayúsculas/minúsculas)
          sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), {
            [Op.like]: `%${query.toLowerCase()}%`,
          }),
          // Buscar por código de barras
          {
            barcode: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
      include: [
        {
          model: ProductOption,
          as: 'options',
        },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ msg: 'Error al buscar productos', error });
  }
};

