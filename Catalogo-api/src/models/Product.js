import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    price: {type: Number, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    imagesUrl: [{type: String}]}
, {timestamps: true});

const Product = mongoose.model("Product", productSchema);
export default Product;