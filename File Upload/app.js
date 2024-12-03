const express = require('express')
require('ejs')
const multer = require('multer')
const mongoose = require('mongoose')



const app = express()
const port = 4000

app.listen(port, ()=>{
    console.log('Port running on',port)
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use('/uploads', express.static('uploads'));


mongoose.connect("mongodb+srv://subhinkrishna:Intelligent%40369@clustersks.oyjlntc.mongodb.net/?retryWrites=true&w=majority&appName=Clustersks").then(()=>console.log('Mongodb Connected successfully!')).catch((e)=>console.log('Error found on mongodb connection: '+e))
const productSchema = mongoose.Schema({
    title: {type: String, required: true, unique: true},
    img: {type: String, required: true}
})

const productModel = mongoose.model('Intern_Products',productSchema)



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Save the file to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);  // Append timestamp to filename
    }
})

const upload = multer({ storage: storage })

app.get('/', (req, res)=>{
    res.render('home')
})

app.post('/fileupload', upload.single('img1'), async (req, res)=>{
    try{
        const productTitle = req.body.product
        const productImage = req.file.path


        const newProduct = new productModel({
            title: productTitle,
            img: productImage 
        })
        await newProduct.save()
        return res.render('success', {message: 'Product saved succesfully!'})
    }
    catch(err){
        console.log('Error in uploading File: ',err)
        return res.render('fail', {message: 'Failed to save Product!'})
    }
})