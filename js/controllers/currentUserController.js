//Used to control all the actions in the app

var app = app || {};

app.currentUserController = (function () {
    function CurrentUserController(model, viewBag) {
        this.model = model;
        this.viewBag = viewBag;
    }

    //Used to load the left part of the app when it is started for the first time
    CurrentUserController.prototype.loadLeftSide = function (selector) {
        var _this = this;

        this.model.getAllProducts()
            .then(function (results) {
                var data = {
                    products: []
                };

                results.data.forEach(function (product) {
                    data.products.push({
                        name: product.name,
                        _id: product.id
                    });
                });

                _this.viewBag.showLeftSide(selector, data);
            });
    };

    //Used to load the right side part of the app when it is started for the first time
    CurrentUserController.prototype.loadRightSide = function (selector) {
        var _this = this,
            productsById = [];

        this.model.getAllProducts()
            .then(function (results) {
                results.data.forEach(function (product) {
                    productsById[product.id] = {
                        _id: product.id, 
                        name: product.name,
                        price: product.price,
                        totalCost: 0,
                        count: 0,
                        yourCount: 0,
                        yourCost: 0
                    };
                });

                _this.model.getAllOrders()
                    .then(function (results) {
                        var data = {
                            products: productsById,
                            totalCost: 0,
                            yourTotalCost: 0
                        };

                        results.data.forEach(function (order) {
                            order.items.forEach(function (item) {
                                data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                                data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                            });
                        });

                        data.products.shift();

                        data.products.forEach(function (product) {
                            data.totalCost = data.totalCost + product.totalCost;
                            product.totalCost = product.totalCost.toFixed(2);
                            product.price = product.price.toFixed(2);
                        });

                        data.totalCost = data.totalCost.toFixed(2);
                        _this.viewBag.showRightSide(selector, data);
                    });
            });
    };

    //Used to load the chart in the bottom of the page when the app is started for the first time
    CurrentUserController.prototype.loadChart = function (selector) {
        var _this = this,
            productsById = [],
            users = new Object();

        this.model.getAllProducts()
            .then(function (results) {
                results.data.forEach(function (product) {
                    productsById[product.id] = {
                        _id: product.id,
                        name: product.name,
                        price: product.price,
                        totalCost: 0,
                        count: 0
                    };

                });

                _this.model.getAllOrders()
                    .then(function (results) {
                        results.data.forEach(function (order) {
                            users[order.user_id] = 1;
                            order.items.forEach(function (item) {
                                productsById[item.product_id].count = productsById[item.product_id].count + item.quantity;
                            });
                        });

                        var countOfUsers = Object.keys(users).length;

                        var dataForChart = {
                            labels: [],
                            datasets: [
                                {
                                    label: "Информация за всички потребители",
                                    fill: true,
                                    lineTension: 0,
                                    backgroundColor: "rgba(128,128,128,0.4)",
                                    borderColor: "rgba(128,128,128,1)",
                                    pointBorderColor: "rgba(128,128,128,1)",
                                    pointBackgroundColor: "#fff",
                                    pointBorderWidth: 1,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: "rgba(128,128,128,1)",
                                    pointHoverBorderColor: "rgba(128,128,128,1)",
                                    pointHoverBorderWidth: 2,
                                    data: []
                                }
                            ]
                        };

                        productsById.forEach(function (product) {
                            dataForChart.labels.push(product.name);
                            dataForChart.datasets[0].data.push(product.count / countOfUsers);
                        });

                        _this.viewBag.showChart(selector, dataForChart, { scaleStartValue: 0 });
                    });
            });
    };

    //Used to update the chart and the right part of the app when some new info is uploaded
    CurrentUserController.prototype.updateData = function (selectorRightSide, selectorChart) {
        var _this = this,
            productsById = [], 
            users = new Object();

        this.model.getAllProducts()
            .then(function (results) {
                results.data.forEach(function (product) {
                    productsById[product.id] = {
                        _id: product.id,
                        name: product.name,
                        price: product.price,
                        totalCost: 0,
                        count: 0,
                        yourCount: 0,
                        yourCost: 0
                    };

                });

                _this.model.getAllOrders()
                    .then(function (results) {
                        var data = {
                            products: productsById,
                            totalCost: 0,
                            yourTotalCost: 0
                        };

                        results.data.forEach(function (order) {
                            order.items.forEach(function (item) {
                                data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                                data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                            });
                            users[order.user_id] = 1;
                        });

                        var countOfUsers = Object.keys(users).length;
                        var currentUserProducts = [{}];

                        $("[name='input']").each(function (i, obj) {
                            if ($(this).val()) {
                                productsById[$(this).parent().attr('product-id')].count = productsById[$(this).parent().attr('product-id')].count + parseInt($(this).val());
                                productsById[$(this).parent().attr('product-id')].yourCount = parseInt($(this).val());
                                productsById[$(this).parent().attr('product-id')].totalCost = productsById[$(this).parent().attr('product-id')].totalCost + $(this).val() * productsById[$(this).parent().attr('product-id')].price;
                                productsById[$(this).parent().attr('product-id')].yourCost = productsById[$(this).parent().attr('product-id')].yourCost + $(this).val() * productsById[$(this).parent().attr('product-id')].price;
                                currentUserProducts.push({ count: parseInt($(this).val()) });
                            }
                            else {
                                currentUserProducts.push({ count: 0 });
                            }
                        });

                        var dataForChart = {
                            labels: [],
                            datasets: [
                                
                                {
                                    label: "Информация за всички потребители",
                                    fill: true,
                                    lineTension: 0, 
                                    backgroundColor: "rgba(128,128,128,0.4)",
                                    borderColor: "rgba(128,128,128,1)",
                                    pointBorderColor: "rgba(128,128,128,1)",
                                    pointBackgroundColor: "#fff",
                                    pointBorderWidth: 1,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: "rgba(128,128,128,1)",
                                    pointHoverBorderColor: "rgba(128,128,128,1)",
                                    pointHoverBorderWidth: 2,
                                    data: []
                                }, 
                                {
                                    label: "Информация за текущия потребител",
                                    fill: true,
                                    lineTension: 0, 
                                    backgroundColor: "rgba(135,206,250,0.4)",
                                    borderColor: "rgba(135,206,250,1)",
                                    pointBorderColor: "rgba(135,206,250,1)",
                                    pointBackgroundColor: "#fff",
                                    pointBorderWidth: 1,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: "rgba(135,206,250,1)",
                                    pointHoverBorderColor: "rgba(135,206,250,1)",
                                    pointHoverBorderWidth: 2,
                                    data: []
                                }
                            ]
                        };

                        currentUserProducts.shift();

                        productsById.forEach(function (product) {
                            dataForChart.labels.push(product.name);
                            dataForChart.datasets[0].data.push(product.count / countOfUsers);
                        });
                        currentUserProducts.forEach(function (product) {
                            dataForChart.datasets[1].data.push(product.count);
                        });

                        _this.viewBag.showChart(selectorChart, dataForChart)

                        data.products.shift();

                        data.products.forEach(function (product) {
                            data.totalCost = data.totalCost + product.totalCost;
                            data.yourTotalCost = data.yourTotalCost + product.yourCost;
                            product.totalCost = product.totalCost.toFixed(2);
                            product.price = product.price.toFixed(2);
                            product.yourCost = product.yourCost.toFixed(2);
                        });

                        data.totalCost = data.totalCost.toFixed(2);
                        data.yourTotalCost = data.yourTotalCost.toFixed(2);
                        _this.viewBag.showRightSide(selectorRightSide, data);
                    });
            });
    };

    return {
        load: function (model, viewBag) {
            return new CurrentUserController(model, viewBag);
        }
    };
}());