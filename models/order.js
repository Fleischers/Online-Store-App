var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    products     : [{
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }],
    itemsQuantity: [{
        type    : Number,
        required: true,
        default : 1
    }],
    totalPrice   : {type: Number},
    customerInfo : [{
        type    : Schema.Types.ObjectId,
        ref     : 'user',
        required: true
    }],
    created      : {
        type   : Date,
        default: Date.now
    },
    comment      : {type: String},
    status       : {
        type   : String,
        default: 'Abandoned'
    }
});

module.exports = mongoose.model('order', OrderSchema);