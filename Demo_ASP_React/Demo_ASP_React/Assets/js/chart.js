Highcharts.setOptions({
    colors: ['#50B432', '#ED561B', '#058DC7']
});
Highcharts.chart('column-chart', {
    chart: {
        type: 'column'
    },
    title: {
        text: false
    },
    exporting: {
        enabled: false
    },
    credits: false,
    xAxis: {
        categories: [
            'Bổ sung tư pháp',
            'Chứng thực',
            'Hộ tịch',
            'Nuôi con nuôi',
            'Quốc tịch',
            'Trợ giúp pháp lý',
            'Giáo dục pháp luật'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: null
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
        series: {
            marker: {
                enabled: false
            }
        }
    },
    series: [{
        name: 'Đúng hạn',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6]

    }, {
        name: 'Trễ hạn',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0]

    }, {
        name: 'Tỷ lệ đúng hạn',
        type: 'spline',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0]

    }]
});
//Spark line chart
$(function () {
    renderSparkLineChart('sparkline-chart1');
    renderSparkLineChart('sparkline-chart2');
});
function renderSparkLineChart(renderTo) {
    var sparkOptions = {
        title: {
            text: null
        },
        exporting: {
            enabled: false
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        credits: false,
        chart: {
            renderTo: renderTo,
            width: 80,
            height: 20,
            type: 'area',
            margin: [2, 0, 2, 0],
            style: {
                overflow: 'visible'
            },
            skipClone: true,
            backgroundColor: '#F7F7F7'
        },
        yAxis: {
            endOnTick: false,
            startOnTick: false,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickPositions: [0]
        },
        xAxis: {
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            startOnTick: false,
            endOnTick: false,
            tickPositions: []
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: false
        }
    };

    var t = new Highcharts.Chart(sparkOptions);

    t.addSeries({
        data: [7, 30,13, 16, 5]
    });
}
//pie chart
Highcharts.chart('pie-chart', {
    chart: {
        backgroundColor: '#F7F7F7',
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: '',
        align: 'center',
        verticalAlign: 'middle',
        y: 40
    },
    exporting: {
        enabled: false
    },
    credits: false,
    tooltip: {
        pointFormat: '{name}: <b>{point.percentage:.1f}%</b>'
    },    
    plotOptions: {
        pie: {            
            size:95,
            dataLabels:false,
            startAngle: 0,
            endAngle: 360
        }
    },
    series: [{
        type: 'pie',
        name: '',
        innerSize: '50%',
        data: [
            ['Hài lòng', 30],
            ['Bình thường', 40],
            ['Không hài lòng', 30]
        ]
    }]
});
