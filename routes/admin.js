var express = require("express");
const productHelpers = require("../helpers/product-helpers");
var router = express.Router();
const adminHelpers = require("../helpers/admin-helpers");

/* GET users listing. */

router.get("/", (req, res) => {
  res.render("admin/admin-dashboard", { admin: true });
});

router.get("/admin-signup", (req, res) => {
  res.render("admin/admin-signup", { admin: true });
});
router.post("/admin-signup", (req, res) => {
  adminHelpers.doAdminSignup(req.body).then((response) => {
    console.log(response);
    res.redirect("/admin/admin-login");
    req.session.admin = response.admin;
    req.session.admin.loggedIn = true;

    // res.redirect("/");
  });
});

// // router.get('/',(req,res)=>{
// //   res.render('admin/admin-login')
// // })

router.get("/admin-login", (req, res) => {
  res.render("admin/admin-login", { admin: true });
});
router.post("/admin-login", (req, res) => {
  adminHelpers.doAdminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.admin;
      req.session.admin.loggedIn = true;

      productHelpers.getAllProducts().then((products) => {
        //console.log(products);
        res.render("admin/view-products", { admin: true, products });
      });
    } else {
      req.session.adminLoginErr = "Invalid Admin Username or Password";
      res.redirect("/admin/admin-login");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

router.get("/", function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    console.log(products);
    res.render("admin/view-products", { admin: true, products });
  });
});

router.get("/add-product", function (req, res) {
  res.render("admin/add-product");
});
// router.get("/all-orders", function (req, res) {
//   res.render("admin/all-orders");
// });

router.get("/all-orders", async (req, res) => {
  let orders = await adminHelpers.getAllOrders();
  res.render("admin/all-orders", { admin: true, orders });
});

router.get("/view-users", (req, res) => {
  adminHelpers.getAllUsers().then((users) => {
    //console.log(products);
    res.render("admin/view-users", { admin: true, users });
  });
});

router.post("/add-product", function (req, res) {
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        productHelpers.getAllProducts().then((products) => {
          //console.log(products);
          res.render("admin/view-products", { admin: true, products });
        });
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/delete-product/:id", (req, res) => {
  let proId = req.params.id;
  //console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    productHelpers.getAllProducts().then((products) => {
      //console.log(products);
      res.render("admin/view-products", { admin: true, products });
    });
  });
});

router.get("/edit-product/:id", async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id);
  //console.log(product);
  res.render("admin/edit-product", { product, admin: true });
});

router.post("/edit-product/:id", (req, res) => {
  //console.log(req.params.id);
  let id = req.params.id;
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    productHelpers.getAllProducts().then((products) => {
      //console.log(products);
      res.render("admin/view-products", { admin: true, products });
    });
    if (req.files.Image) {
      let image = req.files.Image;
      image.mv("./public/product-images/" + id + ".jpg");
    }
  });
});

module.exports = router;
