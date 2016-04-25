define([
    'backbone',
    'underscore',
    'models/user',
    'text!templates/user/forgotPass.html'
], function (Backbone, _, User, adminTemplate) {
    var $thisEl;
    var userEmail;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(adminTemplate),

        events: {
            'click #sendKeyBtn': 'onSendKey'
        },

        initialize: function (opt) {
            this.channel = opt.channel;
            this.render();
        },

        onSendKey: function (e) {
            $thisEl = this.$el;

            e.stopPropagation();
            //e.preventDefault();

            userEmail = $thisEl.find('#email').val();
            this.model = new User({
                email: userEmail
            });

            this.model.urlRoot = '/users/forgotPass';

            this.model.save(null, {
                wait    : true,
                validate: false,
                success : function (model) {
                    console.log(model);
                    $('form').hide();
                    $('#checkEmail').show();
                    //console.log(model.attributes.success);
                    //console.log('-- LoggedIn with id' + model.attributes.success + ' ----');
                    //Backbone.history.navigate('#myAdmin/home', {trigger: true});
                },
                error   : function (model, xhr) {
                    alert(xhr.statusText);
                }
            });
        },

        render: function () {
            this.$el.html(this.template());
        }
    });
});
