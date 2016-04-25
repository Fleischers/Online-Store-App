var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name          : {
        type    : String,
        required: true
    },
    price        : {
        type    : Number,
        required: true
    },
    description  : {type: String},
    created      : {
        type   : Date,
        default: Date.now
    },
    statusEnabled: {type: Boolean},
    image        : {
        type   : String,
        default: 'images/products/default.jpg'
    },
    manufacturer : {type: String},
    categories   : [{
        type: Schema.Types.ObjectId,
        ref : 'category'
    }],
    productReviews: [{
        type: Schema.Types.ObjectId,
        ref : 'productReview'
    }]
});

ProductSchema.plugin(deepPopulate);

module.exports = mongoose.model('product', ProductSchema);