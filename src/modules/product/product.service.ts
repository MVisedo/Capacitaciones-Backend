import mongoose from "mongoose";
import { IProduct, IProductDoc } from "./product.interfaces";
import Product from "./product.model";
import { UpdateUserBody } from "../user/user.interfaces";
import { ApiError } from "../errors";
import httpStatus from "http-status";
import { IOptions, QueryResult } from "../paginate/paginate";
import { publishToExchange } from '../rabbit/rabbit.publisher';
import  fs  from "fs";






/**
 * Create a product
 * @param {IProduct} productBody
 * @returns {Promise<IProductDoc>}
 */
export const createProduct = async (productBody: IProduct): Promise<IProductDoc> => {
  const id = new mongoose.Types.ObjectId(); 

  const productWithId = {
    ...productBody,
    _id: id,
  };

  
  await publishToExchange('productAndUser.product.created', productWithId);

 
  return Product.create(productWithId);
};


/**
 * Get product by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProductDoc | null>}
 */
export const getProductById = async (id: mongoose.Types.ObjectId): Promise<IProductDoc | null> => Product.findById(id);


  /**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const products = await Product.paginate(filter, options);
  return products;
};

  /**
   * Update product by id
   * @param {mongoose.Types.ObjectId} productId
   * @param {UpdateProductBody} updateBody
   * @returns {Promise<IProductDoc | null>}
   */
  export const updateProductById = async (
    productId: mongoose.Types.ObjectId,
    updateBody: UpdateUserBody
  ): Promise<IProductDoc | null> => {
    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    try {
      fs.unlinkSync(product.imagen);
    } catch (error) {
      console.error("No se pudo eliminar la imagen vinculada al producto")
    }
    
    Object.assign(product, updateBody);
    await product.save();

    await publishToExchange('productAndUser.product.updated', {productId,updateBody});

    return product;
  };

  /**
   * Delete product by id
   * @param {mongoose.Types.ObjectId} productId
   * @returns {Promise<IProductDoc | null>}
   */
  export const deleteProductById = async (productId: mongoose.Types.ObjectId): Promise<IProductDoc | null> => {
    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    try {
      fs.unlinkSync(product.imagen);
    } catch (error) {
      console.error("No se pudo eliminar la imagen vinculada al producto")
    }
    await product.deleteOne();
    await publishToExchange('productAndUser.product.deleted',productId);
    return product;
  };