import { Request, Response } from 'express';
import ContactInfo from '../models/contactInfo.model';

// Obtener la información de contacto
export const getContactInfo = async (req: Request, res: Response) => {
  try {
    const contactInfo = await ContactInfo.findOne({ where: {}, order: [['id', 'DESC']] });
    res.status(200).json(contactInfo || {});
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la información de contacto', error });
  }
};

// Actualizar o crear la información de contacto
export const updateContactInfo = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, ubication, openedTime, bankAccount, clabe, bankName, accountHolder } = req.body;

    const [contactInfo] = await ContactInfo.findOrCreate({
      where: {},
      defaults: { phoneNumber, ubication, openedTime, bankAccount, clabe, bankName, accountHolder },
    });

    await contactInfo.update({ phoneNumber, ubication, openedTime, bankAccount, clabe, bankName, accountHolder });

    res.status(200).json({ message: 'Información de contacto actualizada', contactInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la información de contacto', error });
  }
};
