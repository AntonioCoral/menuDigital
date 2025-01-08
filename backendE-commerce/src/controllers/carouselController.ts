import { CarouselImage } from './../models/carouselImage.model';
import { Request, Response } from 'express';



// Obtener imágenes por sección (carousel o home)
export const getImagesBySection = async (req: Request, res: Response) => {
  const { section } = req.params;

  if (!['carousel', 'home'].includes(section)) {
    return res.status(400).json({ message: 'Sección inválida' });
  }

  try {
    const images = await CarouselImage.findAll({ where: { section } });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener imágenes', error });
  }
};


// Agregar una nueva imagen al carrusel
export const addImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, imageUrl } = req.body;
    const newImage = await CarouselImage.create({ title, description, imageUrl });
    res.status(201).json({ message: 'Imagen agregada correctamente', newImage });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar la imagen', error });
  }
};

// Actualizar una imagen del carrusel
export const updateImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, isActive } = req.body;

    const [updatedRows] = await CarouselImage.update(
      { title, description, imageUrl, isActive },
      { where: { id: +id } }
    );

    if (!updatedRows) {
      res.status(404).json({ message: 'Imagen no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Imagen actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la imagen', error });
  }
};

// Eliminar una imagen del carrusel
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedRows = await CarouselImage.destroy({ where: { id: +id } });

    if (!deletedRows) {
      res.status(404).json({ message: 'Imagen no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la imagen', error });
  }
};

export const addImageWithSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, section } = req.body;
    const imageUrl = req.file ? req.file.filename : '';

    const newImage = await CarouselImage.create({
      title,
      description,
      imageUrl,
      section,
    });

    res.status(201).json({ message: 'Imagen agregada correctamente', newImage });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar la imagen', error });
  }
};



export const uploadCarouselImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No se proporcionó ninguna imagen.' });
    return;
  }

  try {
    // Ruta relativa de la imagen (URL para acceder desde el cliente)
    const imageUrl = req.file ? req.file.filename : '';

    // Opcional: Guarda la URL en la base de datos
    const newImage = await CarouselImage.create({
      title: req.body.title || 'Sin título', // Campo opcional para un título
      description: req.body.description || 'Sin descripción', // Campo opcional para una descripción
      imageUrl: imageUrl,
    });

    res.status(200).json({
      message: 'Imagen subida con éxito.',
      data: newImage, // Retorna la imagen subida con los detalles
    });
  } catch (error) {
    console.error('Error al guardar la imagen en la base de datos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};