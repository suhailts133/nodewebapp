const Category = require("../../models/categorySchema.js");

const categoryInfo = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });  // Sorting by createdAt in descending order
        res.render("category", { categories });  // Passing the categories to the view
    } catch (error) {
        console.error("Error while loading categories: ", error);
    }
};

const loadAddCategory =  async (req, res) => {
    try {
        res.render("addCategory")
    } catch (error) {
        console.log("error loading Category page",error.message)
    }
}

const addCategory = async (req, res) => {
    const { name, description } = req.body;

    // Trim the inputs to remove extra spaces
    const trimmedName = name?.trim();
    const trimmedDescription = description?.trim();

    // Check for empty values or only spaces
    if (!trimmedName || !trimmedDescription) {
        return res.render("addCategory", {
            error: "Name and description cannot be empty or spaces only.",
            name,
            description
        });
    }

    try {
        const existingCategory = await Category.findOne({ name: trimmedName });
        if (existingCategory) {
            return res.render("addCategory", {
                error: "Category already exists.",
                name,
                description
            });
        }

        const newCategory = new Category({
            name: trimmedName,
            description: trimmedDescription
        });

        await newCategory.save();
        return res.redirect("/admin/category");
    } catch (error) {
        console.error("Error while adding new category:", error.message);
        return res.status(500).render("addCategory", {
            error: "Internal server error.",
            name,
            description
        });
    }
};

const unlistCategory = async (req, res) => {
    try {
        const categoryId = req.query.id;

        // Update the isListed property to false
        await Category.findByIdAndUpdate(categoryId, { isListed: false });

        res.redirect("/admin/category");
    } catch (error) {
        console.error("Error while unlisting category:", error);
        res.status(500).send("Server Error");
    }
};

// List Category
const listCategory = async (req, res) => {
    try {
        const categoryId = req.query.id;

        // Update the isListed property to true
        await Category.findByIdAndUpdate(categoryId, { isListed: true });

        res.redirect("/admin/category");
    } catch (error) {
        console.error("Error while listing category:", error);
        res.status(500).send("Server Error");
    }
};



const LoadEditCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the category details from the database
        const category = await Category.findById(id);

        if (!category) {
            return res.redirect('/admin/category');
        }

        res.render('editCategory', { category });
    } catch (error) {
        console.error("Error fetching category for editing:", error);
        res.status(500).send("An error occurred while fetching category details.");
    }
};

const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Validate fields
        if (!name.trim() || !description.trim()) {
            return res.render('admin/editCategory', {
                error: "Name and description cannot be empty or spaces only.",
                category: { _id: id, name, description },
            });
        }

        // Check if the category already exists (excluding the current one)
        const existingCategory = await Category.findOne({
            name: name.trim(),
            _id: { $ne: id },
        });

        if (existingCategory) {
            return res.render('admin/editCategory', {
                error: "A category with this name already exists.",
                category: { _id: id, name, description },
            });
        }

        // Update the category
        await Category.findByIdAndUpdate(id, {
            name: name.trim(),
            description: description.trim(),
        });

        res.redirect('/admin/category');
    } catch (error) {
        console.error("Error editing category:", error);
        res.status(500).send("An error occurred while editing the category.");
    }
};

module.exports = {
    categoryInfo,
    loadAddCategory,
    addCategory,
    unlistCategory,
    listCategory,
    LoadEditCategory,
    editCategory
}

