
import e from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";
export async function createOrder(req, res) {
  if(req.user == null) {
    res.status(403).json({
      message: "Please login and try again."
    });
    return;
  }

  const orderInfo=req.body;

  if (orderInfo.name==null){
    orderInfo.name=req.user.firstName+" "+req.user.lastName;
  }

  let orderID="CBC00001"

  const lastOrder = await Order.find().sort({ date: -1 }).limit(1);

  if (lastOrder.length > 0) {
    const lastOrderID = lastOrder[0].orderID;
    const lastOrderNumberString=lastOrderID.replace("CBC", "");
    const lastOrderNumber = parseInt(lastOrderNumberString);
    const neworderNumber = lastOrderNumber + 1;
    const newOrderNumberString = String(neworderNumber).padStart(5, "0");
    orderID = "CBC" + newOrderNumberString;
  }


  try{
    let total = 0;
    let labelledTotal = 0;
    const products = [];

    for (let i = 0; i < orderInfo.products.length; i++) {

      const item = await Product.findOne({ productID: orderInfo.products[i].productID });
      if (item == null) {
        res.status(404).json({
          message: "Product with productID " + orderInfo.products[i].productID + " not found.",
        });
        return;
      }

      if(item.isAvailable == false) {
        res.status(404).json({
          message: "Product with productID " + orderInfo.products[i].productID + " is not available right now.",
        });
        return;
      }

      products [i] = {
        productInfo: {
          productID: item.productID,
          name: item.name,
          altNames: item.altNames,
          description: item.description,
          images: item.images,
          labelledPrice: item.labelledPrice,
          price: item.price,
        },
        quantity: orderInfo.products[i].qty,
      };

      total += (item.price * orderInfo.products[i].qty);
      labelledTotal += (item.labelledPrice * orderInfo.products[i].qty);


    }



    const order = new Order({
    orderID: orderID,
    name: orderInfo.name,
    phone: orderInfo.phone,
    address: orderInfo.address,
    email: req.user.email,
    // total: 0,
    products: products,
    total: total,
    labelledTotal: labelledTotal,
  });


    const createdOrder = await order.save()
    res.status(200).json({
      message: "Order placed successfully.",
      order: createdOrder,
    });

  }catch(err){
    res.status(500).json({
      message: "Failed to place order.",
      error: err,
    });
  }
}