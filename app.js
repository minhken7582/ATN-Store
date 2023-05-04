const express = require('express')
const { ObjectId } = require('mongodb')
const app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

const url = 'mongodb+srv://minhng2332:12345654321@cluster0.2jblh.mongodb.net/test'
const MongoClient = require('mongodb').MongoClient

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/addProduct',(req,res)=>{
    res.render('addProduct')
})
app.post('/addProduct',async (req,res)=>{
    const name = req.body.txtName
    const price = Number.parseFloat(req.body.txtPrice)
    const picURL = req.body.txtPic
    await addProduct(name,price,picURL)
    res.redirect('/')

})
async function addProduct(name,price,picURL){
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATN")
    return await dbo.collection("products").insertOne({'name':name,'price': price,'picture': picURL})
}

app.get('/findAll',async (req,res)=>{
    const results = await findAllProduct()
    res.render('view',{'results':results})
})

async function findAllProduct(){
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATN")
    return await dbo.collection('products').find({}).toArray()
}
app.get('/delete/:id',async (req,res)=>{
    const id = req.params.id
    await deleteProduct(id)
    res.redirect('/')
})
app.get('/edit/:id',async (req,res)=>{
    const id = req.params.id
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATN")
    var ObjectId = require('mongodb').ObjectId
    const product = await dbo.collection('products').findOne({_id: new ObjectId(id)})
    res.render('edit',{'product':product})
                        
})
app.post('/editProduct',async (req,res)=>{
    const id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL = req.body.txtPic
    let product = {
        'name': name,
        'price': price,
        'picture': picURL,
    }
    var ObjectId = require('mongodb').ObjectId
    let client= await MongoClient.connect(url)
    let dbo = client.db("ATN")
    await dbo.collection("products").
            updateOne({_id:new ObjectId(id)},{$set : product})
    res.redirect('/findAll')

})
async function deleteProduct(id){
     let client = await MongoClient.connect(url);
     let dbo = client.db("ATN")
     var ObjectId = require('mongodb').ObjectId
     await dbo.collection('products').deleteOne({_id: new ObjectId(id)})
}


const PORT =process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log('server is up at ' + PORT)
})