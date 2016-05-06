//Used to get info about products and orders of the other users

var app = app || {};

app.currentUserModel = (function () {
    function CurrentUserModel(requester) {
        this.requester = requester;
    }


    //Used to get info about all products
    CurrentUserModel.prototype.getAllProducts = function () {
        //Get the requester url -  http://picnic-challenge.herokuapp.com/products
        var requestUrl = this.requester.baseUrl + '/products';

        return this.requester.get(requestUrl);
    };

    //Used to get info about all the orders of the other users
    CurrentUserModel.prototype.getAllOrders = function () {
        //Get the request url -  http://picnic-challenge.herokuapp.com/orders
        var requestUrl = this.requester.baseUrl + '/orders';

        return this.requester.get(requestUrl);
    };

    return {
        load: function (requester) {
            return new CurrentUserModel(requester);
        }
    };
}());