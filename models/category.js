var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name       : {
        type: String,
        required: true
    },
    description: {type: String},
    created    : {
        type   : Date,
        default: Date.now
    },
    image      : {type: String},
    products   : [{
        type: Schema.Types.ObjectId,
        ref : 'product'
    }]
});

module.exports = mongoose.model('category', CategorySchema);