import express from 'express'
import handlebars from "express-handlebars"
import ProductsRoute from './routes/products.routes.js'
import ProductManager from "./class/productManager.js";
import CartsRoute from './routes/carts.routes.js'
import HomeRoute from './routes/home.routes.js'
import RealTimeProductsRoute from './routes/realTimeProducts.routes.js'
import { __dirname } from "./utils.js";
import {Server} from "socket.io"

const app = express()

const productManager = new ProductManager(__dirname + "/data/product.json");

app.engine("handlebars", handlebars.engine())
app.set('views', __dirname + '/views');
app.set('view engine','handlebars');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
app.use('/api/products', ProductsRoute)
app.use('/api/carts', CartsRoute)
app.use('/realtimeproducts', RealTimeProductsRoute)
app.use('/', HomeRoute)

const httpServer = app.listen(8080, () => {
    console.log('Conectado')
})

const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket) => {
    console.log('id socket: ',socket.id)

    async function updateProducts() {
        try {
            const productsList = await productManager.getProductList();
            socket.emit("updateProducts", productsList);
          } catch (err) {
            console.error(err);
          }
    }
    updateProducts()

    socket.on('addProduct', async(Product)=>{
        try {
            await productManager.addProduct(Product)
            updateProducts()
        } catch (err) {
            console.log(err)
        }
    });

    socket.on('deleteProduct', async(ProductId)=>{

        try {
            await productManager.deleteProduct(ProductId)
            updateProducts()
        } catch (err) {
            console.log(err)
        }
    });
})

