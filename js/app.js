//Used when the app is started or some new info is uploaded

var app = app || {};

(function () {
    var router = Sammy(function () {
        var requester = app.requester.load('http://picnic-challenge.herokuapp.com'),
            selectorLeftSide = '#left-side',
            selectorRightSide = '#right-side',
            selectorChart = '#chart';

        var currentUserModel = app.currentUserModel.load(requester);

        var currentUserViewBag = app.currentUserViewBag.load();

        var currentUserController = app.currentUserController.load(currentUserModel, currentUserViewBag);

        this.get('#/', function () {
            currentUserController.loadLeftSide(selectorLeftSide);
            currentUserController.loadRightSide(selectorRightSide);
            currentUserController.loadChart(selectorChart);
        });

        this.bind('updateData', function (ev) {
            currentUserController.updateData(selectorRightSide, selectorChart);
        });
    });

    router.run('#/');
}());