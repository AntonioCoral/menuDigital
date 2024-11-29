"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("../db/connection"));
const _1 = require(".");
const productRoutes_1 = __importDefault(require("../routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("../routes/categoryRoutes"));
const productOptions_1 = __importDefault(require("../routes/productOptions"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '4500';
        this.server = http_1.default.createServer(this.app);
        this.middlewares();
        this.routes();
        this.listen();
        this.dbConnect();
    }
    listen() {
        (0, _1.syncDatabase)().then(() => {
            this.server.listen(this.port, () => {
                console.log('Aplicación corriendo en el puerto:', this.port);
            });
        });
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.json({ msg: 'API trabajando' });
        });
        // Define una ruta o controlador para '/api/productos'
        this.app.use('/api/productos', (req, res) => {
            res.json({ msg: 'Ruta de productos' });
        });
        //Rutas para categorias y productos
        this.app.use('/api/products', productRoutes_1.default);
        this.app.use('/api/categories', categoryRoutes_1.default);
        this.app.use('/api/productOptions', productOptions_1.default); // Rutas de opciones de precios
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        // Servir archivos estáticos desde la carpeta 'uploads'
        this.app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('Conexión exitosa a la base de datos');
            }
            catch (error) {
                console.log(error);
                console.log('Error al intentar conectarse a la base de datos');
            }
        });
    }
}
exports.default = Server;
