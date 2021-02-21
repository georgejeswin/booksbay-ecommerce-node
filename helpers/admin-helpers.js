var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("express");

module.exports = {
  doAdminSignup: (adminData) => {
    return new Promise(async (resolve, reject) => {
      adminData.Password = await bcrypt.hash(adminData.Password, 12);
      db.get()
        .collection(collection.ADMIN_COLLECTION)
        .insertOne(adminData)
        .then((data) => {
          resolve(data.ops[0]);
        });
    });
  },

  doAdminLogin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ Email: adminData.Email });
      if (admin) {
        bcrypt.compare(adminData.Password, admin.Password).then((status) => {
          if (status) {
            console.log("Admin login success");
            response.admin = admin;
            response.status = true;
            resolve(response);
          } else {
            console.log("Admin login failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("login failed");
        resolve({ status: false });
      }
    });
  },
  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      // console.log(userId);
      let orders = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find()
        .toArray();
      // console.log(orders);
      resolve(orders);
    });
  },
  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find()
        .toArray();
      resolve(users);
    });
  },
};

//     doAdminLogin:(adminData)=>{

//         return new Promise(async(resolve,reject)=>{
//             loginStatus = false
//             let response={}
//             let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:adminData.Email})
//             if(admin){

//             }
//         })
//     }

// }
