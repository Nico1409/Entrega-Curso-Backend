import { Router } from "express";
import CartManager from "../class/cartManager.js";
import ProductManager from "../class/productManager.js";
import { __dirname } from "../utils.js";

const productManager = new ProductManager(__dirname + "/data/product.json");


const router = Router();

router.get('/', async (req, res) => {
    const listProducts = await productManager.getProductList();
    res.render('home',{products:listProducts})
})

export default router;