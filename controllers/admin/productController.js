const Product = require("../../models/productSchema.js");
const Brand = require("../../models/brandSchema.js");
const Category = require("../../models/categorySchema.js");
const User = require("../../models/userSchema.js");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { model } = require("mongoose");


const getProductAddPage = async (req, res) => {
    try {
        const  category = await Category.find({isListed:true})
        const brand = await Brand.find({isBlocked:false})
        res.render("product-add", {
            cat:category,
            brand:brand
        })
    } catch (error) {
        res.redirect("/pageerror")
        console.log("error while loadin add product page",error.message) 
    }
}

const addProducts = async (req, res) => {
    try {
        const products = req.body;

        // Check if the product already exists
        const productExists = await Product.findOne({
            productName: products.productName,
        });

        if (productExists) {
            return res.status(400).json("Product already exists");
        }

        const images = [];
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const originalImagePath = req.files[i].path;

                // Generate a unique path for the resized image
                const resizedImagePath = path.join(
                    "public",
                    "uploads",
                    "product-images",
                    `resized-${Date.now()}-${req.files[i].filename}`
                );

                try {
                    // Resize the image and save it to the new path
                    await sharp(originalImagePath)
                        .resize({ width: 440, height: 440 })
                        .toFile(resizedImagePath);

                    // Add the resized image filename to the images array
                    images.push(`resized-${Date.now()}-${req.files[i].filename}`);

                    // Optional: Delete the original image to save storage space
                    fs.unlinkSync(originalImagePath);
                } catch (err) {
                    console.error("Error resizing or deleting image:", err);
                    return res.status(500).json({ message: "Failed to process image" });
                }
            }
        }

        // Find the category by name
        const category = await Category.findOne({ name: products.category });
        if (!category) {
            return res.status(400).json("Invalid category name");
        }

        // Create a new product
        const newProduct = new Product({
            productName: products.productName,
            description: products.description,
            brand: products.brand,
            category: category._id,
            regularPrice: products.regularPrice,
            salePrice: products.salePrice,
            createdAt: new Date(),
            quantity: products.quantity,
            size: products.size,
            color: products.color,
            productImage: images, // Array of resized image filenames
            status: "Available",
        });

        // Save the product to the database
        await newProduct.save();

        // Redirect to the admin addProducts page
        return res.redirect("/admin/addProducts");
    } catch (error) {
        console.error("Error while saving product:", error);
        return res.redirect("/admin/pageerror");
    }
};

module.exports = {
    getProductAddPage,
    addProducts
}