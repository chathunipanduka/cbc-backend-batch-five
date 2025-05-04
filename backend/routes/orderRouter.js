import express from 'express';
import { createOrder } from '../controllers/orderController.js';

const orderRoutes = express.Router();

orderRoutes.post("/", createOrder);

export default orderRoutes;