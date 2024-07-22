import fs from "node:fs";

class productManager {
  constructor(path) {
    this.path = path;
    this.cartList = [];
  }

  async getCartList() {
    if (!fs.existsSync(this.path)) {
      const initialContent = { carts: [] };
      await fs.promises.writeFile(this.path, JSON.stringify(initialContent));
    }

    const list = await fs.promises.readFile(this.path, "utf-8");
    this.cartList = JSON.parse(list).carts;
    return [...this.cartList];
  }

  getCartIndexById(cid) {
    return this.cartList.findIndex((item) => item.id == cid);
  }

  async saveData() {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify({ carts: [...this.cartList] })
    );
  }

  generateUniqueId() {
    if (this.cartList.length === 0) {
      return 1;
    }
    const lastCartId = this.cartList[this.cartList.length - 1].id;

    return lastCartId + 1;
  }

  async addCart(newCart) {
    await this.getCartList();

    newCart.id = this.generateUniqueId();

    this.cartList.push(newCart);

    await this.saveData();
    return newCart;
  }

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
      cart.products.push({ product: parseInt(pid), qty: 1 });
    } else {
      cart.products[productIndex].qty += 1;
    }

    await this.saveData();
    return cart;
  }
}

export default productManager;
