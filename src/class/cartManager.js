import fs from "node:fs";

class productManager {
  constructor(path) {
    this.path = path;
    this.cartList = [];
  }

  async getCartList() {
    try {
      // Verificar si el archivo existe
      await fs.promises.access(this.path);
    } catch (error) {
      // Si el archivo no existe, crearlo con un contenido inicial
      const initialContent = { carts: [] };
      await fs.promises.writeFile(this.path, JSON.stringify(initialContent));
    }

    // Leer el archivo
    const list = await fs.promises.readFile(this.path, "utf-8");
    this.cartList = JSON.parse(list).carts;
    return [...this.cartList];
  }

  //Funcion para encontrar index de un producto mediante id
  getCartIndexById(cid) {
    return this.cartList.findIndex((item) => item.id == cid);
  }

  //Funcion para guardar actualizar datos en "product.json"
  async saveData() {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify({ carts: [...this.cartList] })
    );
  }

  //Funcion para generar id autoincremental
  generateUniqueId() {
    if (this.cartList.length === 0) {
      return 1;
    }
    const lastCartId = this.cartList[this.cartList.length - 1].id;

    return lastCartId + 1;
  }
  // Añade un carrito al listado
  async addCart(newCart) {
    await this.getCartList();

    newCart.id = this.generateUniqueId();

    this.cartList.push(newCart);

    await this.saveData();
    return newCart;
  }
  //Agrega un producto a un carrito
  async addProductInCart(cid, pid) {
    await this.getCartList();

    const cartIndex = this.getCartIndexById(cid);

    if (cartIndex === -1) {
      return;
    }

    const cart = this.cartList[cartIndex];
    const productIndex = cart.products.findIndex(
      (item) => item.product === parseInt(pid)
    );

    if (productIndex === -1) {
      // Si el producto no está en el carrito, agregarlo con qty 1
      cart.products.push({ product: parseInt(pid), qty: 1 });
    } else {
      // Si el producto ya está en el carrito, incrementar la cantidad
      cart.products[productIndex].qty += 1;
    }

    await this.saveData();
    return cart;
  }
}

export default productManager;
