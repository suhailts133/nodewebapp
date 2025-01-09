const User = require("../../models/userSchema.js");

const customerInfo = async (req, res) => {
    try {
        let search = "";
        if (req.query.search) {
            search = req.query.search;
        }
        let page = parseInt(req.query.page) || 1; // Ensure page is an integer
        const limit = 3;

        const userData = await User.find({
            isAdmin: false,
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } }, // Case-insensitive search
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();

        const count = await User.countDocuments({
            isAdmin: false,
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        });

        const totalPages = Math.ceil(count / limit);

        res.render("customers", {
            data: userData,
            totalPages,
            currentPage: page,
            search, // Pass the search term here
        });
    } catch (error) {
        console.error("Error fetching customer data:", error);
        res.status(500).send("Internal Server Error");
    }
};


const customerBlocked = async (req,res) => {
    try {
        let id = req.query.id;
        await User.updateOne({_id:id}, {$set:{isBlocked:true}})
        res.redirect("/admin/users")
    } catch (error) {
        res.redirect("/pageerror")
        console.log("error while blocking user")
    }
}

const customerUnBlocked = async (req,res) => {
    try {
        let id = req.query.id;
        await User.updateOne({_id:id}, {$set:{isBlocked:false}})
        res.redirect("/admin/users")
    } catch (error) {
        res.redirect("/pageerror")
        console.log("error while unblocking user")
    }
}


module.exports = {
    customerInfo,
    customerBlocked,
    customerUnBlocked
}