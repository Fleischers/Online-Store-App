# Online Store App

  - Configure Enviroment variables with 'NODE_ENV=development' or 'NODE_ENV=production'
  - Install required modules: npm install && bower install`
  - Open MongoDB connection
  - Run server.js with NodeJS

### Isert valid user into database:

```sh
db.collections.users.insert({

    "_id" : ObjectId("571e592435d442ac08da8db4"),
    "firstName" : "Jean",
    "lastName" : "Marina",
    "email" : "a@gmail.com",
    "hashedPassword" : "928aba0eaf95dc668b6039efe85cf62553ed6915",
    "salt" : "0.39572623861022294",
    "phone" : "+380630119454",
    "verified" : true,
    "productReview" : [],
    "orders" : [],
    "baned" : false,
    "created" : ISODate("2016-04-25T17:51:32.237Z"),
    "role" : 0,
    "__v" : 0,
    "sms" : 539076,
    "avatar" : "images/avatars/571e592435d442ac08da8db4.jpeg",
    "address" : "Ushgorod",
    "birthday" : ISODate("1900-09-05T00:00:00.000Z")

});
```
### Online Store

Insertet user has credentials for LogIn:

                                  e-mail - a@gmail.com
                                     password - 1111
                                    role = 0 ("admin")
, so has access to admin page


 - Open http://localhost:3000/#myAdmin in browser and log in.
 - Test creating product categories: http://localhost:3000/#myAdmin/categories (create 3 simple categories: Music, Clothes, Other)
 - Test updating categories by clicking category name
 - Create some products and add to categories

 - Open http://localhost:3000/#myApp in browser and test both app parts

NOTE: when creating user insert Twilio verificated phone number. Otherwise, LogIn SMS verification works not properly

### If you have any questions about my project feel free to contact me via email: androsovani@gmail.com
									
