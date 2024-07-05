import { Router } from "express";
import CartManager from "../class/cartManager.js";
import { __dirname } from "../utils.js";
import validateCart from "../middlewares/validateCart.js";

const router = Router();

const cartManager = new CartManager(__dirname + "/data/cart.json");

router.post("/", validateCart, async (req, res) => {
  const newCart = req.body;

  let cart = await cartManager.addCart(newCart);

  res.status(201).json({ ...cart });
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const listCarts = await cartManager.getCartList();
  const indexProduct = cartManager.getCartIndexById(cid);

  if (indexProduct == -1) {
    res.status(404).json({ error: "No existe un carrito con ese id" });
  } else {
    res.status(200).json({ ...listCarts[indexProduct] });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await cartManager.addProductInCart(cid,pid);

    if(cart) res.status(201).json({ ...cart });
    else res.status(404).json({ error: "No existe un carrito con ese id" });
    
  });
  

export default router;
