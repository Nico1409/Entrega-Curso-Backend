import fs from "node:fs";

class productManager {
  constructor(path) {
    this.path = path;
    this.productList = [];
  }

  //Funcion para generar id autoincremental
  generateUniqueId() {
    if (this.productList.length === 0) {
      return 1;
    }
    const lastProductId = this.productList[this.productList.length - 1].id;

    return lastProductId + 1;
  }

  //Funcion para encontrar index de un producto mediante id
  getIndexById(pid) {
    return this.productList.findIndex((item) => item.id == pid);
  }

  //Funcion para guardar actualizar datos en "product.json"
  async saveData() {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify({ products: [...this.productList] })
    );
  }

  //Funcion para actualizar productList y retornar los productos del archivo "product.json"
  async getProductList() {
    try {
      // Verificar si el archivo existe
      await fs.promises.access(this.path);
    } catch (error) {
      // Si el archivo no existe, crearlo con un contenido inicial
      const initialContent = { products: [] };
      await fs.promises.writeFile(this.path, JSON.stringify(initialContent));
    }

    const list = await fs.promises.readFile(this.path, "utf-8");
    this.productList = [...JSON.parse(list).products];
    return [...this.productList];
  }

  //Funcion para agregar un producto
  async addProduct(product) {
    await this.getProductList();

    product.id = this.generateUniqueId();

    this.productList.push(product);

    await this.saveData();
    return this.productList[product];
  }

  //Funcion para borrar un producto mediante id
  async deleteProduct(pid) {
    await this.getProductList();

    let indexToDelete = this.getIndexById(pid);
    if (indexToDelete == -1) return false;
    else {
      this.productList.splice(indexToDelete, 1);
      await this.saveData();
      return true;
    }
  }

  //Funcion para modificar un producto mediante id
  async changeProduct(pid, productChanged) {
    await this.getProductList();
    let indexToChange = this.getIndexById(pid);

    if (indexToChange == -1) return;
    else {
      Object.assign(this.productList[indexToChange], productChanged);
        if(!productChanged.thumbnails) delete this.productList[indexToChange].thumbnails
      await this.saveData();
      return this.productList[indexToChange];
    }
  }
}

export default productManager;
