//Used to visualize all parts of the app

var app = app || {};

app.currentUserViewBag = (function () {
    var chart;

    //Used to visualize the left part of the app
    function showPossibleChoices(selector, data) {
        $.get('templates/possible-choices.html', function(templ) {
            var renderedHtml = Mustache.render(templ, data);
            $(selector).html(renderedHtml);

            //When the user write something in any of the input in the left
            $("[name='input']").on('input', function (event) {

                //Check if the number you have entered in the input is correct
                var value = $(this).val();
                if (value.length > 1 || (!/^\d+$/.test(value) && value != "") || value.substring(0, 1) == "0") {
                    alert("Можеш да въведеш само естествено число по-малко от 10!");
                    if (value.length > 1) this.value = value.substring(0, 1);
                    else this.value = "";
                }

                //Tell to the app.js to update the data
                Sammy(function () {
                    this.trigger('updateData');
                });
            });
        });
    };

    //Used to visualize the right part of the app
    function showAllUsersInfo(selector, data) {

        //Get the template and render it with the information
        $.get('templates/all-users-info.html', function (templ) {
            var renderedHtml = Mustache.render(templ, data);
            $(selector).html(renderedHtml);
        });
    };

    //Used to visualize the chart
    function showChart(selector, data) {

        //Check if chart exists and if so clears it
        if (chart) chart.destroy();

        //Create the chart with the given information
        chart = new Chart($('#chart'), { type: 'line', data: data, options: { lineTension: 0 } });
    };

    return {
        load: function () {
            return {
                showPossibleChoices: showPossibleChoices,
                showAllUsersInfo: showAllUsersInfo,
                showChart: showChart
            };
        }
    };
}());