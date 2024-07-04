import express from 'express'
import ProductsRoute from './routes/products.routes.js'


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/products', ProductsRoute)



app.listen(8080,()=>{
    console.log('servidor ON')
})