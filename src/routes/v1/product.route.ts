


import { validate } from "../../modules/validate";
import { productController,productValidation } from "../../modules/product";
import express,{ Router } from "express";
import { auth } from "../../modules/auth";
import upload from "../../modules/multer/upload";

const router:Router = express.Router()
router.post('/',auth('manageProducts'),upload.single('imagen'),validate(productValidation.createProduct),productController.createProduct);
router.get('/',express.json(),auth('getProducts'),validate(productValidation.getProducts),productController.getProducts);
router.get('/:productId',express.json(),auth('getProducts'),validate(productValidation.getProduct),productController.getProduct);
router.patch('/:productId',upload.single('imagen'),auth('manageProducts'),validate(productValidation.updateProduct),productController.updateProduct);
router.delete('/:productId',express.json(),auth('manageProducts'),validate(productValidation.deleteProduct),productController.deleteProduct)



export default router