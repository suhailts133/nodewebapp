const express = require("express");
const adminController = require("../controllers/admin/adminController.js");
const customerController = require("../controllers/admin/customerController.js");
const categoryController = require("../controllers/admin/categoryController.js");
const brandController = require("../controllers/admin/brandController.js")
const productController = require("../controllers/admin/productController.js")
const {adminAuth} = require("../middlewares/auth.js")
const router = express.Router();
const multer = require("multer");
const storage = require("../helpers/multer.js")
const uploads = multer({storage:storage});
const uploadProduct = multer({storage:storage.storageForProducts})

router.get("/pageerror", adminController.pageError)
router.get("/login", adminController.loadLogin)
router.post("/login", adminController.login)
router.get("/dashboard", adminAuth,adminController.loadDashboard)
router.get("/logout", adminAuth,adminController.logout)

router.get("/users", adminAuth, customerController.customerInfo)
router.get("/blockCustomer", adminAuth, customerController.customerBlocked)
router.get("/unBlockCustomer", adminAuth, customerController.customerUnBlocked)

router.get("/category", adminAuth, categoryController.categoryInfo)
router.get("/addCategory", adminAuth, categoryController.loadAddCategory)
router.post("/addCategory", adminAuth, categoryController.addCategory)
router.get("/listCategory",adminAuth, categoryController.listCategory);
router.get("/unlistCategory", adminAuth,categoryController.unlistCategory);
router.get('/editCategory/:id',adminAuth, categoryController.LoadEditCategory);
router.post('/editCategory/:id',adminAuth, categoryController.editCategory);

router.get("/brands", adminAuth, brandController.loadBrandPage)
router.post("/addBrand", adminAuth,uploads.single("image"), brandController.addBrand)
router.get("/unblockBrand",adminAuth, brandController.unblockBrand);
router.get("/blockBrand",adminAuth, brandController.blockBrand);
router.get('/deleteBrand', adminAuth, brandController.deleteBrand);

router.get("/addProducts", adminAuth, productController.getProductAddPage);
router.post("/addProducts", adminAuth, uploadProduct.array("images",4),productController.addProducts);

module.exports = router