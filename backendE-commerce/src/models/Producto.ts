import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Category from '../models/Categoria';

const Product = db.define('Product', {
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ProductOptions', // Asegúrate de que esto coincide con el nombre de la tabla en la base de datos
        key: 'id'
      }
    },
  name: {
    type: DataTypes.STRING
  },
  cost: {
    type: DataTypes.DOUBLE
  },
  price: {
    type: DataTypes.DOUBLE
  },
  stock: {
    type: DataTypes.DOUBLE
  },
  image: {
    type: DataTypes.STRING
  },
  barcode: {
    type: DataTypes.STRING
  }
});


export default Product;
