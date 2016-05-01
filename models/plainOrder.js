var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlainOrderSchema = new Schema({
    products     : [{
        name : String,
        price: String
    }],
    itemsQuantity: [{
        type: String
    }],
    totalPrice   : {type: String},
    customerInfo : [{
        firstName: String,
        lastName : String,
        phone    : String,
        address  : String,
        email    : String
    }],
    created      : {
        type   : Date,
        default: Date.now
    },
    comment      : {type: String},
    status       : {
        type   : String,
        default: 'Abandoned'
    },
    emailSent    : {
        type   : Boolean,
        default: false
    }
});

module.exports = mongoose.model('plainOrder', PlainOrderSchema);
