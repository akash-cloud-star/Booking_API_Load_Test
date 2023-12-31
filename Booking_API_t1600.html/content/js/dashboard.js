/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 88.64583333333333, "KoPercent": 11.354166666666666};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.56375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.645, 500, 1500, "Get Update"], "isController": false}, {"data": [0.5703125, 500, 1500, "Delete"], "isController": false}, {"data": [0.75125, 500, 1500, "Create Booking"], "isController": false}, {"data": [0.599375, 500, 1500, "Update"], "isController": false}, {"data": [0.7259375, 500, 1500, "Get Booking"], "isController": false}, {"data": [0.090625, 500, 1500, "Create Token"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9600, 1090, 11.354166666666666, 4325.431041666673, 0, 59806, 491.0, 29252.9, 33488.899999999994, 46771.729999999996, 133.50763496787474, 53.58821869002586, 40.48297429978027], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Update", 1600, 290, 18.125, 1338.7543750000002, 0, 52538, 316.0, 687.0, 984.0, 40620.62, 23.78439446418219, 10.2937332069168, 4.963787446485113], "isController": false}, {"data": ["Delete", 1600, 383, 23.9375, 1803.3512499999997, 0, 53174, 314.5, 1081.9, 1226.9499999999998, 46412.66, 23.905572986702524, 7.083382942066337, 5.455165961639025], "isController": false}, {"data": ["Create Booking", 1600, 33, 2.0625, 2473.7868750000007, 0, 54456, 450.5, 917.9000000000001, 27604.599999999995, 47158.670000000006, 23.843230757767678, 11.713947591461142, 10.80895553144326], "isController": false}, {"data": ["Update", 1600, 255, 15.9375, 2992.456249999998, 0, 54292, 350.0, 1157.7000000000012, 32710.799999999985, 48973.65, 23.706513364546907, 10.12919528888609, 10.70446601541664], "isController": false}, {"data": ["Get Booking", 1600, 108, 6.75, 2719.4556249999996, 0, 53204, 353.0, 760.9000000000001, 31216.099999999962, 45231.98, 23.66268837718325, 10.80827664917846, 4.938387466354615], "isController": false}, {"data": ["Create Token", 1600, 21, 1.3125, 14624.78187500001, 1160, 59806, 2600.0, 34672.600000000006, 37322.5, 51426.81, 22.88329519450801, 6.954041225686499, 6.15297225847397], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: restful-booker.herokuapp.com", 126, 11.559633027522937, 1.3125], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (restful-booker.herokuapp.com)", 1, 0.09174311926605505, 0.010416666666666666], "isController": false}, {"data": ["403/Forbidden", 552, 50.642201834862384, 5.75], "isController": false}, {"data": ["404/Not Found", 358, 32.84403669724771, 3.7291666666666665], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 53, 4.862385321100917, 0.5520833333333334], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9600, 1090, "403/Forbidden", 552, "404/Not Found", 358, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: restful-booker.herokuapp.com", 126, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 53, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (restful-booker.herokuapp.com)", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get Update", 1600, 290, "404/Not Found", 262, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: restful-booker.herokuapp.com", 27, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["Delete", 1600, 383, "403/Forbidden", 336, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: restful-booker.herokuapp.com", 28, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 11, "404/Not Found", 8, "", ""], "isController": false}, {"data": ["Create Booking", 1600, 33, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: restful-booker.herokuapp.com", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 13, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (restful-booker.herokuapp.com)", 1, "", "", "", ""], "isController": false}, {"data": ["Update", 1600, 255, "403/Forbidden", 216, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: restful-booker.herokuapp.com", 27, "404/Not Found", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 4, "", ""], "isController": false}, {"data": ["Get Booking", 1600, 108, "404/Not Found", 80, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: restful-booker.herokuapp.com", 25, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 3, "", "", "", ""], "isController": false}, {"data": ["Create Token", 1600, 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 21, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
