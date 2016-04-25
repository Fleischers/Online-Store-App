define([
    'backbone'
], function (Backbone) {

    return Backbone.Router.extend({

        view: null,

        routes: {
            'myApp'                                           : 'homepageRouter',
            'myApp/chat'                                      : 'chatRouter',
            'myApp/cart'                                      : 'cartRouter',
            'myApp/forgotPass'                                : 'forgotPassRouter',
            'myApp/resetPass/:id'                             : 'resetPassRouter',
            'myApp/:content(/q=:query)(/p=:page)(/c=:count)'  : 'storeContentRouter',
            'myApp/:content/:id'                              : 'storeItemRouter',
            'myApp/:content/account/:id'                      : 'userRouter',
            'myApp/users/create'                              : 'usersCreationRouter',
            'myAdmin'                                         : 'adminPageRouter',
            'myAdmin/logchat'                                 : 'logChatRouter',
            'myAdmin/chat'                                    : 'adminChatRouter',
            'myAdmin/:content(/q=:query)(/p=:page)(/c=:count)': 'adminContentRouter',
            'myAdmin/:content/create'                         : 'creationRouter',
            'myAdmin/:content/:id'                            : 'itemRouter'
        },

        initialize: function (options) {
            this.channel = options.channel;

            this.channel.on('customEvent', function (a, b, c) {
                console.log(a, b, c);
            });
        },

        chatRouter: function () {
            this.pageRouter.call();
            var self;
            var viewUrl;



            self = this;
            viewUrl = 'views/chat/chat';

            require([viewUrl], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});
            })
        },

        cartRouter: function () {
            this.pageRouter.call();
            var self;
            var viewUrl;

            self = this;
            viewUrl = 'views/orders/create';

            require([
                viewUrl
            ], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});
            });
        },

        logChatRouter: function () {
            var self;
            var viewUrl;
            this.adminRouter.call();

            self = this;
            viewUrl = 'views/chat/login';

            require([viewUrl], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});
            })
        },

        adminChatRouter: function () {
            var self;
            var viewUrl;
            this.adminRouter.call();

            self = this;
            viewUrl = 'views/chat/adchat';

            require([viewUrl], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});
            })
        },

        homepageRouter: function () {
            var self;
            var viewUrl;
            this.pageRouter.call();

            self = this;
            viewUrl = 'views/navigation/homepage';

            require([
                viewUrl
            ], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});
            });
        },

        storeContentRouter: function (content, query, page, count) {
            var self;
            var viewUrl;
            var collectionUrl;
            this.pageRouter.call();

            self = this;
            collectionUrl = 'collections/' + content;
            viewUrl = 'views/' + content + '/listStore';

            function viewCreator() {
                collection = this;

                require([
                    viewUrl
                ], function (View) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new View({
                        collection: collection,
                        channel   : self.channel
                    });
                });
            }

            require([
                collectionUrl
            ], function (Collection) {
                var collection = new Collection();

                query = query || '';
                page = page || 1;
                count = count || 12;

                collection.fetch({
                    reset: true,
                    data : {
                        page  : page,
                        count : count,
                        filter: query
                    }
                });
                collection.on('reset', viewCreator, collection)
            });
        },

        storeItemRouter: function (content, id) {
            var self;
            var viewUrl;
            this.pageRouter.call();

            self = this;

            if (content == 'users') {
                viewUrl = 'views/' + content + '/' + 'create';
            } else {
                viewUrl = 'views/' + content + '/' + content + 'Store';
            }

            require([
                viewUrl
            ], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({
                    id     : id,
                    channel: self.channel
                });
            });

        },

        userRouter: function (content, id) {
            var self;
            var viewUrl;
            this.pageRouter.call();

            self = this;
            viewUrl = 'views/' + content + '/' + content;

            require([
                viewUrl
            ], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({
                    id     : id,
                    channel: self.channel
                });
            });

        },

        usersCreationRouter: function () {
            var self;
            var viewUrl;
            this.pageRouter.call();

            self = this;
            viewUrl = 'views/users/create';

            require([
                viewUrl
            ], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});
            });

        },

        adminPageRouter: function () {
            var self;
            var viewUrl;

            this.adminRouter.call();

            self = this;
            viewUrl = 'views/navigation/admin';

            require([viewUrl], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});

            })
        },

        forgotPassRouter: function () {
            var self;
            var viewUrl;
            self = this;
            viewUrl = 'views/users/forgotPass';

            require([viewUrl], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }
                self.view = new CreateView({channel: self.channel});
            })
        },

        resetPassRouter: function (id) {
            var self;
            var viewUrl;

            self = this;
            viewUrl = 'views/users/resetPass';

            require([viewUrl], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }
                self.view = new CreateView({
                    channel: self.channel,
                    id     : id
                });
            })
        },

        adminContentRouter: function (content, query, page, count) {
            var self;
            var viewUrl;
            var collectionUrl;

            this.adminRouter.call();

            self = this;
            collectionUrl = 'collections/' + content;
            viewUrl = 'views/' + content + '/list';

            if (content == 'home') {

                viewUrl = 'views/navigation/adminhome';
                require([
                    viewUrl
                ], function (CreateView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }

                    self.view = new CreateView({});
                });
                return self.view;
            }

            function viewCreator() {
                collection = this;

                require([
                    viewUrl
                ], function (View) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new View({
                        collection: collection,
                        channel   : self.channel
                    });
                });
            }

            require([
                collectionUrl
            ], function (Collection) {
                collection = new Collection();

                query = query || '';
                page = page || 1;
                count = count || 12;

                collection.fetch(
                    {
                        reset: true,
                        data : {
                            page  : page,
                            count : count,
                            filter: query
                        }
                    });
                collection.on('reset', viewCreator, collection)
            });
        },

        creationRouter: function (content) {
            var self;
            var viewUrl;

            this.adminRouter.call();

            self = this;
            viewUrl = 'views/' + content + '/create';

            require([
                viewUrl
            ], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});
            });

        },

        itemRouter: function (content, id) {
            var self;
            var viewUrl;

            this.adminRouter.call();

            self = this;
            viewUrl = 'views/' + content + '/' + content;

            require([
                viewUrl
            ], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({
                    id     : id,
                    channel: self.channel
                });
            });

        },

        pageRouter: function () {
            var self;
            var viewUrl;

            self = this;
            viewUrl = 'views/navigation/navBar';

            require([
                viewUrl
            ], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});
            });
        },

        adminRouter: function () {
            var self;
            var viewUrl;

            self = this;
            viewUrl = 'views/navigation/adminNav';

            require([viewUrl], function (CreateView) {
                if (self.view) {
                    self.view.undelegateEvents();
                }

                self.view = new CreateView({channel: self.channel});
            })
        },

        default: function () {
            console.log('I\'m in default');
        }
    });
});
