﻿//Used to control all the actions in the app

var app = app || {};

app.currentUserController = (function () {
    function CurrentUserController(model, viewBag) {
        this.model = model;
        this.viewBag = viewBag;
    }

    //Used to load the left part of the app when it is started for the first time
    CurrentUserController.prototype.loadPossibleChoices = function (selector) {
        var data = {
            products: []
        };

        //Check if products information is already loaded
        if (sessionStorage && sessionStorage.getItem('productsInfo')) {
            
            //Get the information from the session storage instead of taking it again from the database
            data.products = JSON.parse(sessionStorage.getItem('productsInfo'));

            //Visualizes the left side
            this.viewBag.showPossibleChoices(selector, data);
        } else {
            var _this = this;

            //Get the information about all the products from the database
            this.model.getAllProducts()
                .then(function (results) {

                    //Put the information in the data object
                    results.data.forEach(function (product) {
                        data.products.push({
                            name: product.name,
                            id: product.id
                        });
                    });

                    //Put the information in the sessionStorage so it would not be taken again from the database
                    sessionStorage.setItem('productsInfo', JSON.stringify(results.data));

                    //Visualizes the left side
                    _this.viewBag.showPossibleChoices(selector, data);
                });
        }
    };

    //Used to load the right side part of the app when it is started for the first time
    CurrentUserController.prototype.loadAllUsersInfo = function (selector) {

        var productsById = [];

        if (sessionStorage && sessionStorage.getItem('productsInfo')) {

            var products = JSON.parse(sessionStorage.getItem('productsInfo'));

            products.forEach(function (product) {
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

            if (sessionStorage && sessionStorage.getItem('ordersInfo')) {

                var data = {
                    products: productsById,
                    totalCost: 0,
                    yourTotalCost: 0
                };

                var orders = JSON.parse(sessionStorage.getItem('ordersInfo'));

                orders.forEach(function (order) {
                    order.items.forEach(function (item) {
                        data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                        data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                    });
                });

                //Remove the first element of the object, because it's empty
                data.products.shift();

                //Make calculations about total cost per product and total cost at all
                data.products.forEach(function (product) {
                    data.totalCost = data.totalCost + product.totalCost;

                    //Fix the double values to 2 digits after the decimal point
                    product.totalCost = product.totalCost.toFixed(2);

                    //Fix the double values to 2 digits after the decimal point
                    product.price = product.price.toFixed(2);
                });

                //Fix the double values to 2 digits after the decimal point
                data.totalCost = data.totalCost.toFixed(2);

                //Visualizes the right side
                this.viewBag.showAllUsersInfo(selector, data);

            } else {

                //Get information about all orders from the database
                this.model.getAllOrders()
                    .then(function (results) {
                        var data = {
                            products: productsById,
                            totalCost: 0,
                            yourTotalCost: 0
                        };

                        //Put the information about the orders in the data object
                        results.data.forEach(function (order) {
                            order.items.forEach(function (item) {
                                data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                                data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                            });
                        });

                        sessionStorage.setItem('ordersInfo', JSON.stringify(results.data));

                        //Remove the first element of the object, because it's empty
                        data.products.shift();

                        //Make calculations about total cost per product and total cost at all
                        data.products.forEach(function (product) {
                            data.totalCost = data.totalCost + product.totalCost;

                            //Fix the double values to 2 digits after the decimal point
                            product.totalCost = product.totalCost.toFixed(2);

                            //Fix the double values to 2 digits after the decimal point
                            product.price = product.price.toFixed(2);
                        });

                        //Fix the double values to 2 digits after the decimal point
                        data.totalCost = data.totalCost.toFixed(2);

                        //Visualizes the right side
                        this.viewBag.showAllUsersInfo(selector, data);

                    });
            }

        } else {
            var _this = this;

            //Get information about all products from the database
            this.model.getAllProducts()
                .then(function (results) {

                    //Put the information in the productsById object 
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

                    if (sessionStorage && sessionStorage.getItem('ordersInfo')) {

                        var data = {
                            products: productsById,
                            totalCost: 0,
                            yourTotalCost: 0
                        };

                        var orders = JSON.parse(sessionStorage.getItem('ordersInfo'));

                        //Put the information about the orders in the data object
                        orders.forEach(function (order) {
                            order.items.forEach(function (item) {
                                data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                                data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                            });
                        });

                        //Remove the first element of the object, because it's empty
                        data.products.shift();

                        //Make calculations about total cost per product and total cost at all
                        data.products.forEach(function (product) {
                            data.totalCost = data.totalCost + product.totalCost;

                            //Fix the double values to 2 digits after the decimal point
                            product.totalCost = product.totalCost.toFixed(2);

                            //Fix the double values to 2 digits after the decimal point
                            product.price = product.price.toFixed(2);
                        });

                        //Fix the double values to 2 digits after the decimal point
                        data.totalCost = data.totalCost.toFixed(2);

                        //Visualizes the right side
                        _this.viewBag.showAllUsersInfo(selector, data);

                    } else {

                        //Get information about all orders from the database
                        _this.model.getAllOrders()
                            .then(function (results) {
                                var data = {
                                    products: productsById,
                                    totalCost: 0,
                                    yourTotalCost: 0
                                };

                                //Put the information about the orders in the data object
                                results.data.forEach(function (order) {
                                    order.items.forEach(function (item) {
                                        data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                                        data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                                    });
                                });

                                //Remove the first element of the object, because it's empty
                                data.products.shift();

                                //Make calculations about total cost per product and total cost at all
                                data.products.forEach(function (product) {
                                    data.totalCost = data.totalCost + product.totalCost;

                                    //Fix the double values to 2 digits after the decimal point
                                    product.totalCost = product.totalCost.toFixed(2);

                                    //Fix the double values to 2 digits after the decimal point
                                    product.price = product.price.toFixed(2);
                                });

                                //Fix the double values to 2 digits after the decimal point
                                data.totalCost = data.totalCost.toFixed(2);

                                //Visualizes the right side
                                _this.viewBag.showAllUsersInfo(selector, data);
                            });

                    }

                });
        }
    };

    //Used to load the chart in the bottom of the page when the app is started for the first time
    CurrentUserController.prototype.loadChart = function (selector) {

        var productsById = [],
            users = new Object();


        if (sessionStorage && sessionStorage.getItem('productsInfo')) {

            var products = JSON.parse(sessionStorage.getItem('productsInfo'));

            products.forEach(function (product) {
                productsById[product.id] = {
                    _id: product.id,
                    name: product.name,
                    price: product.price,
                    totalCost: 0,
                    count: 0
                };
            });

            if (sessionStorage && sessionStorage.getItem('ordersInfo')) {

                var orders = JSON.parse(sessionStorage.getItem('ordersInfo'));

                orders.forEach(function (order) {
                    users[order.user_id] = 1;
                    order.items.forEach(function (item) {
                        productsById[item.product_id].count = productsById[item.product_id].count + item.quantity;
                    });
                });

                var countOfUsers = Object.keys(users).length;

                //This is the date needed for the chart
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


                //Visualizes the chart
                this.viewBag.showChart(selector, dataForChart, { scaleStartValue: 0 });

            } else {

                var _this = this;

                //Get information about all orders from the database
                this.model.getAllOrders()
                    .then(function (results) {

                        //Put the information in the productsById and count the number of the users
                        results.data.forEach(function (order) {
                            users[order.user_id] = 1;
                            order.items.forEach(function (item) {
                                productsById[item.product_id].count = productsById[item.product_id].count + item.quantity;
                            });
                        });

                        sessionStorage.setItem('ordersInfo', JSON.stringify(results.data));

                        var countOfUsers = Object.keys(users).length;

                        //This is the date needed for the chart
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


                        //Visualizes the chart
                        _this.viewBag.showChart(selector, dataForChart, { scaleStartValue: 0 });
                    });

            }

        } else {

            var _this = this;

            this.model.getAllProducts()
            .then(function (results) {

                //Put the information in the productsById object
                results.data.forEach(function (product) {
                    productsById[product.id] = {
                        _id: product.id,
                        name: product.name,
                        price: product.price,
                        totalCost: 0,
                        count: 0
                    };

                });

                sessionStorage.setItem('productsInfo', JSON.stringify(results.data));

                if (sessionStorage && sessionStorage.getItem('ordersInfo')) {

                    var orders = JSON.parse(sessionStorage.getItem('ordersInfo'));

                    orders.forEach(function (order) {
                        users[order.user_id] = 1;
                        order.items.forEach(function (item) {
                            productsById[item.product_id].count = productsById[item.product_id].count + item.quantity;
                        });
                    });

                    var countOfUsers = Object.keys(users).length;

                    //This is the date needed for the chart
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


                    //Visualizes the chart
                    _this.viewBag.showChart(selector, dataForChart, { scaleStartValue: 0 });

                } else {

                    //Get information about all orders from the database
                    _this.model.getAllOrders()
                        .then(function (results) {

                            //Put the information in the productsById and count the number of the users
                            results.data.forEach(function (order) {
                                users[order.user_id] = 1;
                                order.items.forEach(function (item) {
                                    productsById[item.product_id].count = productsById[item.product_id].count + item.quantity;
                                });
                            });

                            sessionStorage.setItem('ordersInfo', JSON.stringify(results.data));

                            var countOfUsers = Object.keys(users).length;

                            //This is the date needed for the chart
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


                            //Visualizes the chart
                            _this.viewBag.showChart(selector, dataForChart, { scaleStartValue: 0 });
                        });

                }

            });

        }
    };

    //Used to update the chart and the right part of the app when some new info is uploaded
    CurrentUserController.prototype.updateData = function (selectorAllUsersInfo, selectorChart) {
        var productsById = [], 
            users = new Object();

        if (sessionStorage && sessionStorage.getItem('productsInfo')) {

            var products = JSON.parse(sessionStorage.getItem('productsInfo'));

            products.forEach(function (product) {
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

            if (sessionStorage && sessionStorage.getItem('ordersInfo')) {

                var data = {
                    products: productsById,
                    totalCost: 0,
                    yourTotalCost: 0
                };

                var orders = JSON.parse(sessionStorage.getItem('ordersInfo'));

                orders.forEach(function (order) {
                    order.items.forEach(function (item) {
                        data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                        data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                    });
                    users[order.user_id] = 1;
                });

                var countOfUsers = Object.keys(users).length;
                var currentUserProducts = [{}];

                //Get informations for the current user from the inputs in the left part
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

                //This is the data needed for the chart
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

                //Remove the first element of the object, because it's empty
                currentUserProducts.shift();

                //Fill the dataForChart object with information about all other users
                productsById.forEach(function (product) {
                    dataForChart.labels.push(product.name);
                    dataForChart.datasets[0].data.push(product.count / countOfUsers);
                });
                //Fill the dataForChart object with information about the current user
                currentUserProducts.forEach(function (product) {
                    dataForChart.datasets[1].data.push(product.count);
                });

                //Visualizes the chart
                this.viewBag.showChart(selectorChart, dataForChart)

                //Remove the first element of the object, because it's empty
                data.products.shift();

                //Calculates the totalCost and other calculations about the current user
                data.products.forEach(function (product) {
                    data.totalCost = data.totalCost + product.totalCost;
                    data.yourTotalCost = data.yourTotalCost + product.yourCost;

                    //Fix the double values to 2 digits after the decimal point
                    product.totalCost = product.totalCost.toFixed(2);

                    //Fix the double values to 2 digits after the decimal point
                    product.price = product.price.toFixed(2);

                    //Fix the double values to 2 digits after the decimal point
                    product.yourCost = product.yourCost.toFixed(2);
                });

                //Fix the double values to 2 digits after the decimal point
                data.totalCost = data.totalCost.toFixed(2);

                //Fix the double values to 2 digits after the decimal point
                data.yourTotalCost = data.yourTotalCost.toFixed(2);

                //Vizualizes the right part
                this.viewBag.showAllUsersInfo(selectorAllUsersInfo, data);

            } else {

                var _this = this;

                //Get information about all orders from the database
                this.model.getAllOrders()
                    .then(function (results) {
                        var data = {
                            products: productsById,
                            totalCost: 0,
                            yourTotalCost: 0
                        };

                        //Put the information in the data object and count the users
                        results.data.forEach(function (order) {
                            order.items.forEach(function (item) {
                                data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                                data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                            });
                            users[order.user_id] = 1;
                        });

                        sessionStorage.setItem('ordersInfo', JSON.stringify(results.data));

                        var countOfUsers = Object.keys(users).length;
                        var currentUserProducts = [{}];

                        //Get informations for the current user from the inputs in the left part
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

                        //This is the data needed for the chart
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

                        //Remove the first element of the object, because it's empty
                        currentUserProducts.shift();

                        //Fill the dataForChart object with information about all other users
                        productsById.forEach(function (product) {
                            dataForChart.labels.push(product.name);
                            dataForChart.datasets[0].data.push(product.count / countOfUsers);
                        });
                        //Fill the dataForChart object with information about the current user
                        currentUserProducts.forEach(function (product) {
                            dataForChart.datasets[1].data.push(product.count);
                        });

                        //Visualizes the chart
                        _this.viewBag.showChart(selectorChart, dataForChart)

                        //Remove the first element of the object, because it's empty
                        data.products.shift();

                        //Calculates the totalCost and other calculations about the current user
                        data.products.forEach(function (product) {
                            data.totalCost = data.totalCost + product.totalCost;
                            data.yourTotalCost = data.yourTotalCost + product.yourCost;

                            //Fix the double values to 2 digits after the decimal point
                            product.totalCost = product.totalCost.toFixed(2);

                            //Fix the double values to 2 digits after the decimal point
                            product.price = product.price.toFixed(2);

                            //Fix the double values to 2 digits after the decimal point
                            product.yourCost = product.yourCost.toFixed(2);
                        });

                        //Fix the double values to 2 digits after the decimal point
                        data.totalCost = data.totalCost.toFixed(2);

                        //Fix the double values to 2 digits after the decimal point
                        data.yourTotalCost = data.yourTotalCost.toFixed(2);

                        //Vizualizes the right part
                        _this.viewBag.showAllUsersInfo(selectorAllUsersInfo, data);
                    });

            }

        } else {

            var _this = this;

            //Get information about all products from the database
            this.model.getAllProducts()
                .then(function (results) {

                    //Put the information in the productsById object
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

                    sessionStorage.setItem('productsInfo', JSON.stringify(results.data));

                    if (sessionStorage && sessionStorage.getItem('ordersInfo')) {

                        var data = {
                            products: productsById,
                            totalCost: 0,
                            yourTotalCost: 0
                        };

                        var orders = JSON.parse(sessionStorage.getItem('ordersInfo'));

                        orders.forEach(function (order) {
                            order.items.forEach(function (item) {
                                data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                                data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                            });
                            users[order.user_id] = 1;
                        });

                        var countOfUsers = Object.keys(users).length;
                        var currentUserProducts = [{}];

                        //Get informations for the current user from the inputs in the left part
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

                        //This is the data needed for the chart
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

                        //Remove the first element of the object, because it's empty
                        currentUserProducts.shift();

                        //Fill the dataForChart object with information about all other users
                        productsById.forEach(function (product) {
                            dataForChart.labels.push(product.name);
                            dataForChart.datasets[0].data.push(product.count / countOfUsers);
                        });
                        //Fill the dataForChart object with information about the current user
                        currentUserProducts.forEach(function (product) {
                            dataForChart.datasets[1].data.push(product.count);
                        });

                        //Visualizes the chart
                        _this.viewBag.showChart(selectorChart, dataForChart)

                        //Remove the first element of the object, because it's empty
                        data.products.shift();

                        //Calculates the totalCost and other calculations about the current user
                        data.products.forEach(function (product) {
                            data.totalCost = data.totalCost + product.totalCost;
                            data.yourTotalCost = data.yourTotalCost + product.yourCost;

                            //Fix the double values to 2 digits after the decimal point
                            product.totalCost = product.totalCost.toFixed(2);

                            //Fix the double values to 2 digits after the decimal point
                            product.price = product.price.toFixed(2);

                            //Fix the double values to 2 digits after the decimal point
                            product.yourCost = product.yourCost.toFixed(2);
                        });

                        //Fix the double values to 2 digits after the decimal point
                        data.totalCost = data.totalCost.toFixed(2);

                        //Fix the double values to 2 digits after the decimal point
                        data.yourTotalCost = data.yourTotalCost.toFixed(2);

                        //Vizualizes the right part
                        _this.viewBag.showAllUsersInfo(selectorAllUsersInfo, data);

                    } else {

                        //Get information about all orders from the database
                        _this.model.getAllOrders()
                            .then(function (results) {
                                var data = {
                                    products: productsById,
                                    totalCost: 0,
                                    yourTotalCost: 0
                                };

                                //Put the information in the data object and count the users
                                results.data.forEach(function (order) {
                                    order.items.forEach(function (item) {
                                        data.products[item.product_id].count = data.products[item.product_id].count + item.quantity;
                                        data.products[item.product_id].totalCost = data.products[item.product_id].totalCost + data.products[item.product_id].price * item.quantity;
                                    });
                                    users[order.user_id] = 1;
                                });

                                sessionStorage.setItem('ordersInfo', JSON.stringify(results.data));

                                var countOfUsers = Object.keys(users).length;
                                var currentUserProducts = [{}];

                                //Get informations for the current user from the inputs in the left part
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

                                //This is the data needed for the chart
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

                                //Remove the first element of the object, because it's empty
                                currentUserProducts.shift();

                                //Fill the dataForChart object with information about all other users
                                productsById.forEach(function (product) {
                                    dataForChart.labels.push(product.name);
                                    dataForChart.datasets[0].data.push(product.count / countOfUsers);
                                });
                                //Fill the dataForChart object with information about the current user
                                currentUserProducts.forEach(function (product) {
                                    dataForChart.datasets[1].data.push(product.count);
                                });

                                //Visualizes the chart
                                _this.viewBag.showChart(selectorChart, dataForChart)

                                //Remove the first element of the object, because it's empty
                                data.products.shift();

                                //Calculates the totalCost and other calculations about the current user
                                data.products.forEach(function (product) {
                                    data.totalCost = data.totalCost + product.totalCost;
                                    data.yourTotalCost = data.yourTotalCost + product.yourCost;

                                    //Fix the double values to 2 digits after the decimal point
                                    product.totalCost = product.totalCost.toFixed(2);

                                    //Fix the double values to 2 digits after the decimal point
                                    product.price = product.price.toFixed(2);

                                    //Fix the double values to 2 digits after the decimal point
                                    product.yourCost = product.yourCost.toFixed(2);
                                });

                                //Fix the double values to 2 digits after the decimal point
                                data.totalCost = data.totalCost.toFixed(2);

                                //Fix the double values to 2 digits after the decimal point
                                data.yourTotalCost = data.yourTotalCost.toFixed(2);

                                //Vizualizes the right part
                                _this.viewBag.showAllUsersInfo(selectorAllUsersInfo, data);
                            });

                    }

                });

        }
    };

    return {
        load: function (model, viewBag) {
            return new CurrentUserController(model, viewBag);
        }
    };
}());