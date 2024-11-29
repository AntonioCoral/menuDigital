// src/models/Categoria.ts
import { Model, DataTypes } from 'sequelize';
import db from '../db/connection';
import { ICategory } from '../interfaces/interfaces';  // Asegúrate de importar la interfaz

class Category extends Model<ICategory> implements ICategory {
  public id!: number;
  public name!: string;
}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'Category',
});

export default Category;
