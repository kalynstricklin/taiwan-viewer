"use client"

import '../../style/map.css';
import "leaflet/dist/leaflet.css"
import ChartJsView from "osh-js/source/core/ui/view/chart/ChartJsView";
import CurveLayer from "osh-js/source/core/ui/layer/CurveLayer";
import {useState} from "react";
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";

interface LineChartProps{
    ds: typeof SweApi;
}
export default function LineChart() {
// export default function LineChart(props: LineChartProps) {

    const chartBaseId = "chart-view";
    const [chartID, setChartID] = useState<string>(chartBaseId);

    let curveLayer = new CurveLayer({
        datasourceId: ["props.ds.id"],
        getValues: (rec: any) => ({x: rec.resultTime, y: rec.precipitation}),
        name: "Line Chart",
        backgroundColor: "#2195f2",
        lineColor: '#2195f2',
        // maxValues: 25,
        yLabel: 'Value',
        borderWidth: 1,
    });


    const lineChart = new ChartJsView({
        type: 'line',
        container: chartID,
        layers: {

        },
        css: "chart-view-lane-view",
        options:{
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Line Chart',
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    align: 'center',
                    position: 'top',

                },
                legend: {
                    display: true,
                    align: 'center',
                    position: 'bottom',
                }
            },
            autoPadding: true,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y:{
                    title:{
                        display: true,
                        text: 'Value',

                    },
                    display: true,
                    position: 'left',
                    align: 'center',
                    ticks: {

                    },
                    grid: {display: false, beginAtZero: false}

                },
            },
        },
    });

    return (
        <div id={chartID} style={{height: '100%', padding: '10px'}}>
        </div>
    );
}