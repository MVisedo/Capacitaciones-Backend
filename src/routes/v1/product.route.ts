


import { validate } from "../../modules/validate";
import { productController,productValidation } from "../../modules/product";
import express,{ Router } from "express";
import { auth } from "../../modules/auth";

const router:Router = express.Router()
router.post('/',auth('manageProducts'),validate(productValidation.createProduct),productController.createProduct);
router.get('/',auth('getProducts'),validate(productValidation.getProducts),productController.getProducts);
router.get('/:productId',auth('getProducts'),validate(productValidation.getProduct),productController.getProduct);
router.patch('/:productId',auth('manageProducts'),validate(productValidation.updateProduct),productController.updateProduct);
router.delete('/:productId',auth('manageProducts'),validate(productValidation.deleteProduct),productController.deleteProduct)



export default router