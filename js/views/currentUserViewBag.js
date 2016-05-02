//Used to visualize all parts of the app

var app = app || {};

app.currentUserViewBag = (function () {
    var chart;

    //Used to visualize the left part of the app
    function showLeftSide(selector, data) {
        $.get('templates/left-side.html', function(templ) {
            var renderedHtml = Mustache.render(templ, data);
            $(selector).html(renderedHtml);

            $("[name='input']").on('input', function (event) {

                //Check if the number you have entered in the input is correct
                var value = $(this).val();
                if (value.length > 1 || (!/^\d+$/.test(value) && value != "") || value.substring(0, 1) == "0") {
                    alert("Можеш да въведеш само естествено число по-малко от 10!");
                    if (value.length > 1) this.value = value.substring(0, 1);
                    else this.value = "";
                }

                //Tell to the app to update the data
                Sammy(function () {
                    this.trigger('updateData');
                });
            });
        });
    };

    //Used to visualize the right part of the app
    function showRightSide(selector, data) {
        $.get('templates/right-side.html', function (templ) {
            var renderedHtml = Mustache.render(templ, data);
            $(selector).html(renderedHtml);
        });
    };

    //Used to visualize the chart
    function showChart(selector, data) {
        if(chart) chart.destroy();
        chart = new Chart($('#chart'), { type: 'line', data: data, options: { lineTension: 0 } });
    };

    return {
        load: function () {
            return {
                showLeftSide: showLeftSide,
                showRightSide: showRightSide,
                showChart: showChart
            };
        }
    };
}());