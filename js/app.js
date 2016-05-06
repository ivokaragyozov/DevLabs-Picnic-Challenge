//Used when the app is started or some new info is uploaded

var app = app || {};

(function () {

    //Used to control the routes of the app
    var router = Sammy(function () {
        var requester = app.requester.load('http://picnic-challenge.herokuapp.com'),
            selectorLeftSide = '#left-side',
            selectorRightSide = '#right-side',
            selectorChart = '#chart';

        var currentUserModel = app.currentUserModel.load(requester);

        var currentUserViewBag = app.currentUserViewBag.load();

        var currentUserController = app.currentUserController.load(currentUserModel, currentUserViewBag);

        //When the app is loaded for the first time
        this.get('#/', function () {
            currentUserController.loadLeftSide(selectorLeftSide);
            currentUserController.loadRightSide(selectorRightSide);
            currentUserController.loadChart(selectorChart);
        });

        //When the app trigger "updateData" 
        this.bind('updateData', function (ev) {
            currentUserController.updateData(selectorRightSide, selectorChart);
        });
    });

    //Run the app when it's loaded for the first time
    router.run('#/');
}());