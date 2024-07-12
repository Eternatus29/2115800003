import { Router } from "express";
import { getProductsByCategory, getProductById } from "../controllers/products.controller.js";


const router = Router()

router.route('/categories/:categoryname/products').get(getProductsByCategory);
router.route('/categories/:categoryname/products/:productid').post(getProductById);

export default router;