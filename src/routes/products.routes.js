import {Router} from 'express'
import ProductManager from '../class/productManager.js'
import { __dirname } from '../utils.js'

const router = Router()

const productManager = new ProductManager(__dirname + '/data/product.json')


router.post('/', async (req, res)=>{
    const newProduct = req.body
    console.log(newProduct)
   await productManager.addProduct(newProduct)

    res.status(201).json({message: 'Producto Añadido!'})
})

router.get('/', async (req, res)=>{
    const listProducts =  await productManager.getProductList()

    res.status(200).json(listProducts)
})


export default router