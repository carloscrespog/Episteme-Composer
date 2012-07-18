/**
 * This script has been custom develop for episteme's project.
 * Developed by Gsi
 */
jQuery(function ($) {

    /* Hide element container until it has to be shown */
//    $('#element-container').hide();


    /* Load data service when submiting the form */
    $("form#skills-selection").submit(function () {

        $.ajax({
            url: "./data/mock/data.js",
            dataType: 'json',
            data: $(this).serialize()
        }).success(function (data) { serviceCall(data) });

        return false; //prevent default
    })



    /**
     * Attach hover events -mouseenter, mouseleave- to result cards so the 
     * corresponding serie is highlighted in the chart when they are hovered.
     * 
     * Event used has namespace so they can safely removed if needed.
     * It has been used on function to bind them because these cards are 
     * dinamically created from the data read from the service.
     */
    $("#report-container").on("mouseenter.radarchart", ".matching-report", function(){
        p1.spiderhighlight($(this).index('.matching-report'), 0, "plothover");
    });
    $("#report-container").on("mouseleave.radarchart", ".matching-report", function(){
        p1.spiderunhighlight($(this).index('.matching-report'), 0);
    });

    /**
     * This removes the reports. This is used by other scripts so it should 
     * be mantained
     */
    $('#main-content').bind('clear.reports', function() {
        $(this).find('#report-container .matching-report').remove();
    });
    /**
     * This removes the chart. This is used by other scripts so it should 
     * be used
     */
    $('#main-content').bind('clear.chart', function(){
        $(this).find('#matching-chart').children().empty();
    });

    /* Create variables used to print radar chart */
    var p1;  // This is needed for highlighting
    /* Set options of the radar chart */
    var options = {
              series: {
                  spider: {
                      active: true,
                      highlight: {
                          mode: "area",
                          opacity: 0.5
                      },
                      legs: {
                          data: [{
                              label: "0"
                          }, {
                              label: "1"
                          }, {
                              label: "2"
                          }, {
                              label: "3"
                          }, {
                              label: "4"
                          }],
                          legScaleMax: 0,
                          legScaleMin: 0,
                          legStartAngle: -90,
                          font: "13px verdana",
                          fillStyle: "#999"
                      },
                      spiderSize: 0.9,
                      legMin: 0,
                      legMax: 100,
                      scaleMode: "all" //leg, all, static
                  },
                  lines: {
                      show: true,
                      fill: true,
                      fillColor: "rgba(255, 55, 55, 0.8)"
                  }
              },
              grid: {
                  hoverable: true,
                  clickable: true,
                  tickColor: "rgba(0,0,0,0.2)",
                  backgroundColor: "red",
                  mode: "radar"
              },
              legend: {
                  container: "#matching-chart-legend"
              }
    };

    /**
     * Make ajax call to the service by serializing the form data.
     * Then parse the received data and generate the result cards and show them.
     * While doing so it gathers the information requiered to show the data in 
     * a radar chart.
     * Finally it uses those data to generate the radar chart and shows it.
     *
     * The data is as shown:
     *
     * {"offer": 
     *    [{"skill":"Base de datos SQL", "level":"Intermedio"}, 
     *     {"skill":"JavaScript", "level":"Experto"}, 
     *     {"skill":"Java", "level":"Avanzado"}],
     *  "candidates":
     *    [{"company":"UPM", "global_value":0.9, 
     *      "results" : [{"skill":"Oracle", "level":"Experto", "value":1}, 
     *                   {"skill":"VBScript", "level":"Intermedio", "value":0.55}, 
     *                   {"skill":"VisualBasic", "level":"Avanzado", "value":0.7}]}]
     *  }
     */
    function serviceCall(data) {

        // show chart to allow the pluggin calculate the dimensions
        $('#element-container').show();
        $('#matching-chart').show();
        // clear container
        //$("#report-container").html("");
        //$("#report-container .matching-report").remove();
        $('#main-content').trigger('clear.reports');

        // initialize variables
        var series = new Array(); // it will store data for the plot
        var labels = new Array();

        // read the offer and generate the html
        var offer = "<ol>"
        var offer_rq = data.offer;
        for (var rq in offer_rq) {
            var req = offer_rq[rq];
            offer = offer + '<li><span class="skill">' + req.skill + '</span><span class="level">' + req.level + '</span></li>';
            labels.push({label: req.skill});
        }
        offer = offer + "</ol>";
        /* place the offer */
        $('#matching-search-criteria').html(offer);
        
        //options.series.spider.legs.data = labels;

        /* Read the candidates */
        var candidates_array = data.candidates;
        for (var candidate in candidates_array) {

            var company = candidates_array[candidate]; // the Object
            var company_name = company.company;
            var company_global = Math.round(company.global_value * 1000)/10; // use percentaje
            var results = company.results;

            var ser_values = new Array(); // the current serie data
            var report = '<div class="matching-report"> \
                <h3> \
                  <span title="' + company_name + '" class="name">' + company_name + '</span> \
                  <span class="value">' + company_global + '%</span> \
                  <div class="clear"></div> \
                </h3>'; // the report shown

            /* iterate over the current candidate results */
            for (var index in results) {
                var result = results[index]; // the Object
                var percent = Math.round(result.value * 1000)/10;

                report = report + '<div class="skill-level-closure"><span class="skill">' + result.skill + '</span><span class="level">' + result.level + '</span><span class="matching">' + percent + '%</span></div>';

                /* Push current result to data series */
                ser_values.push([index, percent]);
            }

            /* Close report tag and append before the ofher results */
            report = report + '</div>';
            $("#report-container").append($(report));

            /* Store current candidate results */
            series.push({
                "label": company_name,
                "data": ser_values,
                "spider": {
                    "show": true
                }
            });
        }

        p1 = $.plot($("#matching-chart-placeholder"), series, options);
    }

});
