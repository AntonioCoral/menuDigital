"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carouselController_1 = require("../controllers/carouselController");
const upload_1 = __importDefault(require("../middlewares/upload"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/:section', authMiddleware_1.authenticate, carouselController_1.getImagesBySection);
router.post('/upload', authMiddleware_1.authenticate, upload_1.default.single('file'), carouselController_1.addImageWithSection);
// Actualizar una imagen por ID
router.put('/:id', authMiddleware_1.authenticate, carouselController_1.updateImage);
// Eliminar una imagen por ID
router.delete('/:id', authMiddleware_1.authenticate, carouselController_1.deleteImage);
exports.default = router;
