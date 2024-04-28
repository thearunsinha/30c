import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/ProductModel.js";

//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc Fetch single product by ID
//@route GET /api/products/:id
//@access Public
const getProductByID = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

export { getProducts, getProductByID };
