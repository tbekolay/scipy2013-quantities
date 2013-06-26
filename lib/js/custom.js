function make_table(id, data, properties, columns) {
    function get_prop(d) {
        var out = d;
        for (var i = 0; i < properties.length; i++) {
            out = out[properties[i]];
        }
        return out;
    }

    if (typeof columns === 'undefined') {
        columns = ['Name'];
        var d = get_prop(data[0]);
        for (var prop in d) {
            if (d.hasOwnProperty(prop)) {
                columns.push(prop);
            }
        }
    }

    var table = d3.select(id).append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // Header
    thead.append("tr").selectAll("th")
        .data(columns)
      .enter().append("th")
        .sort(function(a, b) { return stringCompare(a, b); })
        .classed("static-col", function(d) { return d === 'Name'; })
        .text(function(d) { return d; });

    // Rows
    var rows = tbody.selectAll("tr")
        .data(data)
      .enter().append("tr")
        .sort(function(a, b) { return stringCompare(a['name'], b['name']); });

    // Cells
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                if (column === 'Name') { var value = row['name']; }
                else { var value = get_prop(row)[column]; }
                return {column: column, value: value};
            });})
      .enter().append("td")
        .sort(function(a, b) { return stringCompare(a.column, b.column); })
        .classed("static-col", function(d) { return d.column === 'Name'; })
        .html(function(d) {
            if (typeof d.value === 'boolean') {
                if (d.value) { return "<span class='yes'></span>"; }
                else { return "<span class='no'></span>"; }
            }
            return d.value;
        });
}

function make_barchart(id, json) {
    // function get_prop(d) {
    //     var out = d;
    //     for (var i = 0; i < properties.length; i++) {
    //         out = out[properties[i]];
    //     }
    //     return out;
    // }

    // function get_val(d) {
    //     var data = get_prop(d);
    //     if (data.hasOwnProperty('np_rel')) {
    //         return data.np_rel;
    //     } else {
    //         return data.mean;
    //     }
    // }

    // var margin = {top: 20, right: 20, bottom: 30, left: 40},
    //     width = 960 - margin.left - margin.right,
    //     height = 500 - margin.top - margin.bottom;

    // var x = d3.scale.ordinal()
    //     .rangeRoundBands([0, width], .1);

    // var y = d3.scale.linear()
    //     .range([height, 0]);

    // var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("left");

    // var yAxis = d3.svg.axis()
    //     .scale(y)
    //     .orient("top");
    //     // .tickFormat(formatPercent);

    // var svg = d3.select(id).append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x.domain(data.map(function(d) { return d.name; }));
    // y.domain([0, d3.max(data, function(d) { return get_val(d); })]);

    // var yText = get_prop(data[0]).hasOwnProperty('np_rel') ?
    //     "Time (relative to NumPy)" : "Time (milliseconds)";

    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //     .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text(yText);

    // svg.selectAll(".bar")
    //     .data(data)
    //   .enter().append("rect")
    //     .attr("class", "bar")
    //     .attr("y", function(d) { return x(d.name); })
    //     .attr("height", x.rangeBand())
    //     .attr("x", function(d) { return 0; })
    //     .attr("width", function(d) { return y(get_val(d)); });
    function get_prop(d) {
        var out = d;
        for (var i = 0; i < properties.length; i++) {
            out = out[properties[i]];
        }
        return out;
    }

    var speed = ['make', 'ops', 'ufunc'];
    var colors = ['green', 'red', 'blue'];
    var data = [];

    for (var i = 0; i < speed.length; i++) {
        var series = {};
        series.key = speed[i];
        series.color = colors[i];
        series.values = [];
        json.forEach(function(d) {
            var dd = d.speed[speed[i]];
            var val = dd.hasOwnProperty('np_rel') ?
                dd.np_rel : dd.mean;
            series.values.push({label: d.name, value: val});
        });
        data.push(series);
    }

    nv.addGraph(function() {
        var chart = nv.models.multiBarHorizontalChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .margin({top: 30, right: 50, bottom: 50, left: 100})
            .showValues(true)
            .tooltips(false)
            .showControls(false);

        chart.yAxis
            .tickFormat(d3.format('.0f'));

        d3.select(id + ' svg')
            .datum(data)
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function stringCompare(a, b) {
    if (typeof a === 'undefined') { return 1; }
    if (typeof b === 'undefined') { return -1; }
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a > b ? 1 : a == b ? 0 : -1;
}

Reveal.addEventListener('ready', function(event) {
    d3.json('results.json', function(error, json) {
        if (error) return console.warn(error);
        make_table("#facts", json, ['facts'],
                   ['Name', 'Implementation', 'PyPI'] );
        make_table("#syntax", json, ['syntax']);

        compat = [
            'unary_ops',
            'binary_same_ops', 'binary_compatible_ops',
            'binary_different_ops', 'inplace_same_ops',
            'inplace_compatible_ops', 'inplace_different_ops',
            'unary_ufuncs', 'binary_same_ufuncs',
            'binary_compatible_ufuncs', 'binary_different_ufuncs',
            'syntax', 'other_numpy',
        ]

        for (var i = 0; i < compat.length; i++) {
            make_table("#compatibility-" + compat[i], json,
                       ['compatibility', compat[i]]);
        }

        make_barchart("#speed", json);
    });
});
