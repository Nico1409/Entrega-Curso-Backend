import fs from 'node:fs'

class productManager {
    constructor(path){
        this.path = path
        this.productList = []
    }

    async getProductList(){
      const list =  await fs.promises.readFile(this.path,"utf-8")
      this.productList = [...JSON.parse(list).products]
      return [...this.productList]
    }

    async addProduct(product){
        await this.getProductList();

        this.productList.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify({products:[...this.productList]}))
    }
}

export default productManager