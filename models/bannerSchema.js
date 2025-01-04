const mongoose = require("mongoose");
const { Schema } = mongoose

const bannerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    }],
    addedOn: {
        type: Date,
        default: Date.now
    },
    image: {
        type: [String],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
});


const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner