//Used to make the AJAX requests to the database.

var app = app || {};

app.requester = (function () {
    function Requester(baseUrl) {
        this.baseUrl = baseUrl;
    }

    Requester.prototype.get = function (url) {
        return makeRequest("GET", url);
    }

    function makeRequest(method, url) {
        var defer = Q.defer();

        $.ajax({
            method: method,
            url: url,
            success: function (data) {
                defer.resolve(data);
            },
            error: function (error) {
                defer.reject(error);
            }
        });

        return defer.promise;
    }

    return {
        load: function (baseUrl) {
            return new Requester(baseUrl);
        }
    };
}());