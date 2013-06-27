function make_table(id, data, properties, columns) {
    function get_prop(d) {
        var out = d;
        for (var i = 0; i < properties.length; i++) {
            out = out[properties[i]];
        }
        return out;
    }

    var sort = typeof columns === 'undefined';
    if (typeof columns === 'undefined') {
        columns = [];
        var d = get_prop(data[0]);
        for (var prop in d) {
            if (d.hasOwnProperty(prop)) {
                columns.push(prop);
            }
        }
    }

    var nameTable = d3.select(id).append("table")
        .classed("static", true);
    nameTable.append("thead").append("tr").selectAll("th")
        .data(['Name'])
      .enter().append("th")
        .text(function(d) { return d; });
    var nameRows = nameTable.append("tbody").selectAll("tr")
        .data(data)
      .enter().append("tr")
        .sort(function(a, b) { return stringCompare(a['name'], b['name']); });
    nameRows.selectAll("td")
        .data(function(row) { return [{column: 'Name', value: row['name']}] })
      .enter().append("td")
        .text(function (d) { return d.value; });

    var table = d3.select(id).append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // Header
    var th = thead.append("tr").selectAll("th")
        .data(columns)
      .enter().append("th")
        .text(function(d) { return d; });

    if (sort) { th.sort(function(a, b) { return stringCompare(a, b); }) }

    // Rows
    var rows = tbody.selectAll("tr")
        .data(data)
      .enter().append("tr")
        .sort(function(a, b) { return stringCompare(a['name'], b['name']); });

    // Cells
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: get_prop(row)[column]};
            });})
      .enter().append("td")
        .classed("static-col", function(d) { return d.column === 'Name'; })
        .html(function(d) {
            if (typeof d.value === 'boolean') {
                if (d.value) { return "<span class='yes'></span>"; }
                else { return "<span class='no'></span>"; }
            }
            return d.value;
        });

    if (sort) {
        cells.sort(function(a, b) {
            return stringCompare(a.column, b.column); })
    }

}

function make_barchart(id, json) {
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
            .margin({top: 30, right: 50, bottom: 30, left: 180})
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
                   ['Implementation', 'LOC', 'First release', 'Most recent release', 'PyPI'] );
        make_table("#syntax", json, ['syntax']);

        compat = [
            'unary_ops',
            'binary_same_ops', 'binary_compatible_ops',
            'binary_different_ops', 'unary_ufuncs', 'binary_same_ufuncs',
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
