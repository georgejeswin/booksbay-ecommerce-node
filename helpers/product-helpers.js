var db = require("../config/connection");
var collection = require("../config/collections");
var objectId = require("mongodb").ObjectID;
const { response } = require("express");
const { ObjectID } = require("mongodb");
const { PRODUCT_COLLECTION } = require("../config/collections");

module.exports = {
  addProduct: (product, callback) => {
    console.log(product);

    db.get()
      .collection("product")
      .insertOne(product)
      .then((data) => {
        callback(data.ops[0]._id);
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  getSingleProduct: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: ObjectID(proId) })
        .then((product) => {
          resolve(product);
          console.log(proId);
        });
    });
  },
  getCategories: (category) => {
    return new Promise((resolve, reject) => {
      let products = db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ Category: category })
        .toArray();
      resolve(products);
      console.log(category);
    });
  },

  // getSingleProduct:(proId)=>{
  //     return new Promise(async(resolve,reject)=>{
  //         let product=await db.get().collection(collection.PRODUCT_COLLECTION).find({_id:objectId(proId)}).toArray()
  //         resolve(product)
  //     })
  // },

  deleteProduct: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .removeOne({ _id: objectId(proId) })
        .then((response) => {
          resolve(response);
          //console.log(response);
        });
    });
  },
  getProductDetails: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: ObjectID(proId) })
        .then((product) => {
          resolve(product);
        });
    });
  },
  updateProduct: (proId, proDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: ObjectID(proId) },
          {
            $set: {
              Name: proDetails.Name,
              Description: proDetails.Description,
              Price: proDetails.Price,
              Category: proDetails.Category,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
};
