const Brand = require("../../models/brandSchema.js");
const Product = require("../../models/productSchema.js");

const loadBrandPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page -1)*limit;
        const brandData = await Brand.find({}).sort({createdAt:-1}).skip(skip).limit(limit);
        const totalBrands = await Brand.countDocuments();
        const totalPages = Math.ceil(totalBrands/limit);
        const reverseBrand = brandData.reverse();
        res.render("brands", {
            data: reverseBrand,
            currentPage:page,
            totalPages:totalPages,
            totaalBrands:totalBrands
        })
    } catch (error) {
        res.redirect("/pageerror");
        console.log("error while loadin brand",error.message)
    }
}

const addBrand = async (req, res) => {
    try {
        const brandName = req.body.name.trim();  // Trim the spaces

        // Check if the brand name is empty
        if (!brandName) {
            const brandData = await Brand.find({}).sort({ createdAt: -1 }).limit(3);
            const totalBrands = await Brand.countDocuments();
            const totalPages = Math.ceil(totalBrands / 3);
            return res.render("brands", {
                errorMessage: "Brand name cannot be empty or just spaces",
                data: brandData,
                currentPage: 1,
                totalPages: totalPages,
                totalBrands: totalBrands
            });
        }

        // Check if the brand already exists
        const findBrand = await Brand.findOne({ brandName });
        if (findBrand) {
            const brandData = await Brand.find({}).sort({ createdAt: -1 }).limit(3);
            const totalBrands = await Brand.countDocuments();
            const totalPages = Math.ceil(totalBrands / 3);
            return res.render("brands", {
                errorMessage: "Brand with this name already exists!",
                data: brandData,
                currentPage: 1,
                totalPages: totalPages,
                totalBrands: totalBrands
            });
        }

        // If validation passes, save the new brand
        const image = req.file.filename;
        const newBrand = new Brand({
            brandName: brandName,
            brandImage: image
        });
        await newBrand.save();

        res.redirect("/admin/brands");

    } catch (error) {
        console.log("Error while adding brand:", error);
        res.redirect("/Pageerror");
    }
};




const unblockBrand = async (req, res) => {
    try {
        const id = req.query.id;

        // Update the isListed property to false
        await Brand.updateOne({_id:id}, { isBlocked: false });

        res.redirect("/admin/brands");
    } catch (error) {
        console.error("Error while unlisting category:", error);
        res.status(500).send("Server Error");
    }
};

// List Category
const blockBrand = async (req, res) => {
    try {
        const id = req.query.id;

        // Update the isListed property to true
        await Brand.updateOne({_id:id}, { isBlocked: true });

        res.redirect("/admin/brands");
    } catch (error) {
        console.error("Error while listing category:", error);
        res.status(500).send("Server Error");
    }
};

const deleteBrand = async (req, res) => {
    const { id } = req.query; // Get the brand ID from the query parameter
  
    try {
      // Find and delete the brand by ID
      const brand = await Brand.findByIdAndDelete(id);
      
      if (!brand) {
        // Brand not found
        return res.redirect('/admin/brands');
      }
  
      // Optionally, delete the brand image from the file system
      const fs = require('fs');
      const path = `./public/uploads/re-image/${brand.brandImage}`;
  
      // Delete the brand image file if it exists
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
  
      // Redirect back to the brands page after deletion
      res.redirect('/admin/brands');
    } catch (err) {
      console.error(err);
      res.redirect('/admin/brands');
    }
  };
module.exports = {
    loadBrandPage,
    addBrand,
    blockBrand,
    unblockBrand,
    deleteBrand
}