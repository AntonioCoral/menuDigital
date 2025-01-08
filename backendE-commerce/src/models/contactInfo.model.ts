import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/connection'

interface ContactInfoAttributes {
  id: number;
  phoneNumber: string;
  ubication: string;
  openedTime: string;
  bankAccount: string;
  clabe: string;
  bankName: string;
  accountHolder: string;
}

interface ContactInfoCreationAttributes extends Optional<ContactInfoAttributes, 'id'> {}

class ContactInfo extends Model<ContactInfoAttributes, ContactInfoCreationAttributes> implements ContactInfoAttributes {
  public id!: number;
  public phoneNumber!: string;
  public ubication!: string;
  public openedTime!: string;
  public bankAccount!: string;
  public clabe!: string;
  public bankName!: string;
  public accountHolder!: string;
}

ContactInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ubication: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    openedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankAccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clabe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountHolder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'ContactInfo',
    tableName: 'contact_info',
  }
);

export default ContactInfo;
