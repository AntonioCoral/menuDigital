import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '../db/connection';
import { syncDatabase } from '.';
import productRoutes from '../routes/productRoutes';
import categoryRoutes from '../routes/categoryRoutes';
import ProductOption from '../routes/productOptions';
import path from 'path';

dotenv.config();

class Server {
  private app: express.Application;
  private port: string;
  private server: http.Server;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '4500';
    this.server = http.createServer(this.app);

    this.middlewares();
    this.routes();
    this.listen();
    this.dbConnect();
  }

   listen() {
    syncDatabase().then(() =>{
    this.server.listen(this.port, () => {
      console.log('Aplicación corriendo en el puerto:', this.port);
    })
    });
  }

  private routes() {
    this.app.get('/', (req: Request, res: Response) => {
      res.json({ msg: 'API trabajando' });
    });

    // Define una ruta o controlador para '/api/productos'
    this.app.use('/api/productos', (req: Request, res: Response) => {
      res.json({ msg: 'Ruta de productos' });
        
        });
        //Rutas para categorias y productos
        this.app.use('/api/products', productRoutes);
        this.app.use('/api/categories', categoryRoutes);
        this.app.use('/api/productOptions', ProductOption); // Rutas de opciones de precios
    }

  private middlewares(){
    this.app.use(express.json());
    this.app.use(cors());


    // Servir archivos estáticos desde la carpeta 'uploads'
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  }

  async dbConnect() {
    try {
        await db.authenticate();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.log(error);
        console.log('Error al intentar conectarse a la base de datos');
    }
}

}

export default Server;
