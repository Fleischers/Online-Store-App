var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductReviewSchema = new Schema({
    postedBy: {
        type: Schema.Types.ObjectId,
        ref : 'user'
    },
    description: {type: String},
    created: {
        type   : Date,
        default: Date.now
    },
    product: {
        type: Schema.Types.ObjectId,
        ref : 'product'
    }
});

module.exports = mongoose.model('productReview', ProductReviewSchema);