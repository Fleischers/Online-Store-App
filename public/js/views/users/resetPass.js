define([
    'backbone',
    'underscore',
    'models/user',
    'text!templates/user/resetPass.html'
], function (Backbone, _, User, adminTemplate){
    var $thisEl;
    var pass;
    var pass2;

    return Backbone.View.extend({

        el: '#container',

        template: _.template(adminTemplate),

        events: {
          'click #submitBtn' : 'onSubmit'
        },

        initialize: function (opt) {
            this.channel = opt.channel;
            this.id = opt.id;
            console.log('content initialized');
            this.render();
        },

        onSubmit: function(e){
             $thisEl = this.$el;

            e.stopPropagation();
            e.preventDefault();

             pass = $thisEl.find('#pass').val();
             pass2 = $thisEl.find('#pass2').val();
            if(pass != pass2) {
                alert('Passwords mismatch');
                return false;
            }
            
            this.model = new User({
                pass: pass,
                resetPassCode: this.id
            });

            this.model.urlRoot = '/users/resetPass';

            this.model.save(null, {
                wait    : true,
                validate: false,
                success : function (model) {

                    //console.log(model);
                    //console.log(model.attributes.success);
                    //console.log('-- LoggedIn with id' + model.attributes.success + ' ----');
                    Backbone.history.navigate('#myApp', {trigger: true});
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
