import { Router } from "express";
import { uploader } from "../utils.js";
import ProductManager from "../class/productManager.js";
import { __dirname } from "../utils.js";
import validateProduct from "../middlewares/validateProduct.js";

const router = Router();

const productManager = new ProductManager(__dirname + "/data/product.json");

router.post("/", uploader.single("thumbnails"), validateProduct, async (req, res) => {
  const newProduct = req.body;

  if (req.file) newProduct.thumbnails = req.file.path;
  await productManager.addProduct(newProduct);

  res.status(201).json({ ...newProduct });
});

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const listProducts = await productManager.getProductList();

  let listProductsFiltered = listProducts.slice(0, limit);

  res.status(200).json(listProductsFiltered);
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const listProducts = await productManager.getProductList();
  const indexProduct = productManager.getIndexById(pid);

  if (indexProduct == -1) {
    res.status(404).json({ error: 'No existe un producto con ese id' });
  } else {
    res.status(200).json({ ...listProducts[indexProduct] });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  let isDelete = await productManager.deleteProduct(pid);
  if (isDelete) {
    res.status(200).json({ message: "Producto borrado exitosamente" });
  } else {
    res.status(404).json({ error: 'No existe un producto con ese id' });
  }
});

router.put("/:pid", uploader.single("thumbnails"), validateProduct, async (req, res) => {
  const { pid } = req.params;
  const productChanged = req.body;

  if (req.file) productChanged.thumbnails = req.file.path;
  
  let product = await productManager.changeProduct(pid, productChanged);

  if (product) {
    res.status(200).json({ ...product });
  } else {
    res.status(404).json({ error: 'No existe un producto con ese id' });
  }
});

export default router;