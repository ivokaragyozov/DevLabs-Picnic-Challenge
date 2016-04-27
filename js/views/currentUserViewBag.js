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