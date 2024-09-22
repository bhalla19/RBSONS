const express = require('express');
const router = express.Router()
const productModel = require('../models/Products');
const Joi = require('joi');
const bodyParser = require('body-parser'); 
const multer = require("multer")
// const upload = multer({dest : "uploads/"});

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

router.get('/Products', (req, res) => {
    res.render('addingProducts')
})

router.post('/Products', upload.single('image') ,async (req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            richDescription: Joi.string().required(),
            // image: Joi.string(),
            countInStock: Joi.number().required(),
            // images: Joi.string(),
            brand: Joi.string().required(),
            price: Joi.number().required(),
            category:Joi.string().required(),
            // dateCreated: Joi.date()
        })
        const result = schema.validate(req.body)
        // console.log(result)
        const imagePath = req.file.path
        req.body.image = imagePath
        const product = new productModel({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            countInStock: req.body.countInStock,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category:req.body.category
            // dateCreated: req.body.dateCreated
        })
        const productlisted = await product.save()
        res.send("Done")
    }
    catch (error) {
        res.status(400).send(error)
        console.log(error)
    }

})

module.exports = router