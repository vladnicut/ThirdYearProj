function firstView() {
    document.getElementById('visualisation1').style.display = 'block';
    document.getElementById('visualisation2').style.display = 'none';

    var margin = {top: 20, right: 20, bottom: 30, left: 115},
        width = 1100 - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // setup x 
    var xValue = function(d) { return d.timestamp; }, 
        xScale = d3.time.scale().range([0, width]), 
        xMap = function(d) { return xScale(xValue(d)); }, 
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function(d) { return d.event; }, 
        yScale = d3.scale.ordinal().rangeRoundBands([height, 0], .1),
        yMap = function(d) { return yScale(yValue(d)); },
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // setup fill color
    var cValue = function(d) { return d.type; },
        color = d3.scale.category10();

    // add the graph canvas to the body of the webpage
    var svg = d3.select(".chart")   
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // load data
    d3.csv("uploads/" + csv_folder + "/" + csv_filename, function(error, data) {
        
        // initialize empty sequence
        var sequence = "";

        // change string (from CSV) into number format
        data.forEach(function(d) {
            sequence += (d.event + " ");
            d.timestamp = new Date(+d.timestamp);
        });

        console.log(sequence);
        $('#event_sequence').val(sequence);

        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([new Date(+data[1].timestamp), new Date(+data[data.length - 1].timestamp)]);
        yScale.domain(data.map(function(d) { return d.event; }));

        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
        .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Timestamp");

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Event");

        // draw dots
        svg.selectAll(".dot")
            .data(data)
        .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) { return color(cValue(d)); });

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; })
    });

    setTimeout(function () {saveAsPng("svg_chart");}, 100);
}

function secondView() {
    document.getElementById('visualisation2').style.display = 'block';
    document.getElementById('visualisation1').style.display = 'none';

    var cValue = function(d) { return d.type; },
        color = d3.scale.category10();

    d3.csv("uploads/" + csv_folder + "/" + csv_filename, function(error, data) {
        var my_data = [];
        var startDate = new Date(+data[1].timestamp);
        var endDate = new Date(+data[data.length - 1].timestamp);
        data.forEach(function (d) {
            var inserted = false;

            for (var key in my_data) {
                if (my_data[key].name === d.event) {
                    my_data[key].dates.push(new Date(+d.timestamp));
                    inserted = true;
                }
            }

            if (!inserted) my_data.push({ name: d.event, dates: [new Date(+d.timestamp)], type: d.type });
        });

        var eventDropsChart = d3.chart.eventDrops()
            .width(1300)
            .eventLineColor(function(d) { return color(cValue(d)); })
            .start(startDate)
            .end(endDate);
        d3.select('#eventdrops_chart')
            .datum(my_data)
            .call(eventDropsChart);
    });

    setTimeout(function () {saveAsPng("eventdrops_chart");}, 100);
}
