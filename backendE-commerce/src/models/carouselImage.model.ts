import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection';  // Asegúrate de que esta importación es correcta
import db from '../db/connection';

export class CarouselImage extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public imageUrl!: string;
  public isActive!: boolean;
}

CarouselImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    section: {
      type: DataTypes.ENUM('carousel', 'home'),
      allowNull: false,
      defaultValue: 'carousel',
    },
  },
  {
    sequelize: db,
    modelName: 'CarouselImage',
    tableName: 'carousel_images', // Opcional: define el nombre de la tabla
    timestamps: true, // Crea columnas createdAt y updatedAt automáticamente
  }
);

export default CarouselImage;
