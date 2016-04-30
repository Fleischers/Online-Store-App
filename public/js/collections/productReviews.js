define([
    'backbone',
    'models/productReview'], function (Backbone, Model) {

    var Collection = Backbone.Collection.extend({
        model: Model,
        url  : '/productReviews/',

        initialize: function (options) {

        }
    });

    return Collection;
});
