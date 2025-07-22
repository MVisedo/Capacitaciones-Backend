import mongoose from "mongoose";
import { IProductModel, IProductDoc } from "./product.interfaces";
import { toJSON } from "../toJSON";
import { paginate } from "../paginate";


const productSchema = new mongoose.Schema<IProductDoc,IProductModel>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    imagen: {
      type: String,
      required: true,
    },
    user: {
      type: String,
    },
    precio: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true,
  }
);
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model<IProductDoc,IProductModel>('Product', productSchema);

export default Product;