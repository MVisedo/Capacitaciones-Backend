import { auth } from "@/modules/auth";
import { stockController, stockValidation } from "@/modules/stock";
import { validate } from "@/modules/validate";
import express,{ Router } from "express";

const router:Router = express.Router()
router.post('/',auth('manageStock'),validate(stockValidation.createStock),stockController.createStock);
router.get('/:productId',auth('getStock'),validate(stockValidation.getStock),stockController.getStock);
router.patch('/:productId',auth('manageStock'),validate(stockValidation.updateStock),stockController.updateStock);
router.delete('/:productId',auth('manageStock'),validate(stockValidation.deleteStock),stockController.deleteStock)



export default router