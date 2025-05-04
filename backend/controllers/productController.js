import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProducts(req,res){
  try {
    if (isAdmin(req)){
        const products = await Product.find()
        res.json(products)
    }else{
        const products = await Product.find({isAvailable:true})
        res.json(products)
    }

    
}catch (err) {
    res.json({
        message: "Failed to fetch products",
        error: err
    })
  }
}

export function saveProduct(req,res){
    if (!isAdmin(req)){
        res.status(403).json({
            message: "You are not authorized to add products."
        })
        return
    }

      console.log(req.body);

      const product = new Product(
          req.body
      )

      product.save().then(()=>{
          res.json({
              message:"Product added successfully"
          })
      }).catch(()=>{
          res.json({
              message:"Failed to add Product"
          })
      })
      
  }

  export async function deleteProduct(req,res){
    if (!isAdmin(req)){
        res.status(403).json({
            message: "You are not authorized to delete products."
        })
        return
    }
    try{
        await Product.deleteOne({productID: req.params.productID})
        res.json({
            message:"Product deleted successfully"
        })
    }catch(err){
        res.status(500).json({
            message:"Failed to delete Product",
            error: err
        })
    }
  }

  export async function updateProduct(req,res){
    if (!isAdmin(req)){
        res.status(403).json({
            message: "You are not authorized to update products."
        })
        return
    }

    const productID = req.params.productID
    const updatingData = req.body
    try{
        await Product.updateOne(
            {productID: productID},
            updatingData
        )
        res.json({
            message:"Product updated successfully"
        })

    }catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            error: err
        })
    }
    
  }

  export async function getProductByID(req,res){
    const productID = req.params.productID

    try{
        const product = await Product.findOne({productID: productID})
        if (product == null){
            res.status(404).json({
                message:"Product not found"
            })
            return
        }
        if (product.isAvailable){
            res.json(product)
            return
        }else{
            if (!isAdmin(req)){
                res.status(403).json({
                    message:"Product not available"
                })
                return
            }else{
                res.json(product)
            }
        }

    }catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            error: err
        })
    }


  }
