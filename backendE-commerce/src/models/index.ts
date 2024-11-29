import db from '../db/connection';
import Category from './Categoria';
import Product from './Producto';
import ProductOption from './ProductOption';

Category.hasMany(Product, { as: 'product', foreignKey: 'categoryId' });


Product.belongsTo(Category, { foreignKey: 'categoryId' });


// Un Producto tiene muchas Opciones de Producto
Product.hasMany(ProductOption, { foreignKey: 'productId', as: 'options' });
ProductOption.belongsTo(Product, { foreignKey: 'productId' });




const syncDatabase = async () => {
  try {
    await db.sync({ alter: true }); // Cambia a { force: true } si deseas eliminar y volver a crear las tablas
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { Category, Product,ProductOption, syncDatabase };
