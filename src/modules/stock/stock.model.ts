import mongoose from "mongoose";
import { IStockDoc, IStockModel } from "./stock.interfaces";
import { toJSON } from "../toJSON";
import { paginate } from "../paginate";

const stockSchema = new mongoose.Schema<IStockDoc,IStockModel>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min:0
    },
  },
  {
    timestamps: true,
  }
);
stockSchema.plugin(toJSON);
stockSchema.plugin(paginate);

const Stock = mongoose.model<IStockDoc,IStockModel>('Stock',stockSchema);

export default Stock;