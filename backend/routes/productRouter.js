import express from 'express';
import { deleteProduct, getProducts, saveProduct } from '../controllers/productController.js';


const productRoutes=express.Router();

productRoutes.get("/", getProducts);
productRoutes.post("/", saveProduct);
productRoutes.delete("/:productID", deleteProduct);

export default productRoutes;