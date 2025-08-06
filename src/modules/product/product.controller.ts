import httpStatus from "http-status";
import { catchAsync, pick } from "../utils";
import { productService } from ".";
import { Request, Response } from "express";
import { ApiError } from "../errors";
import mongoose from "mongoose";
import { IOptions } from "../paginate/paginate";



export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  if (req.file) {
  data.imagen = req.file.path; 
  }

  const product = await productService.createProduct(data);
  res.status(httpStatus.CREATED).send({product});
});


export const getProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.getProductById(new mongoose.Types.ObjectId(req.params['productId']));
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send(product);
  }
});


export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'precio']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const data = req.body;

    if (req.file) {
    data.imagen = req.file.path;
    }

    const product = await productService.updateProductById(new mongoose.Types.ObjectId(req.params['productId']), data);
    res.send(product);
  }
});


export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    await productService.deleteProductById(new mongoose.Types.ObjectId(req.params['productId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
