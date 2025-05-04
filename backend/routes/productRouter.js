import express from 'express';
import { deleteProduct, getProductByID, getProducts, saveProduct, updateProduct } from '../controllers/productController.js';


const productRoutes=express.Router();

productRoutes.get("/", getProducts);
productRoutes.post("/", saveProduct);
productRoutes.delete("/:productID", deleteProduct);
productRoutes.put("/:productID",updateProduct );
productRoutes.get("/:productID", getProductByID); // Assuming you want to fetch a product by ID

export default productRoutes;