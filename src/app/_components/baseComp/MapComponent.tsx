import React, { useEffect, useState, useRef } from "react";
import '../../style/map.css';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Chart } from "chart.js";
import ObservationFilter from "osh-js/source/core/sweapi/observation/ObservationFilter.js";
import "leaflet-sidebar-v2";
import "leaflet-sidebar-v2/css/leaflet-sidebar.min.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend
);

interface MapProps {
    stationArray: any;
}

export default function MapComponent(props: MapProps) {
    const mapRef = useRef(null);
    const [features, setFeatures] = useState(props.stationArray);
    const createdTabs = useRef<Set<string>>(new Set());

    const defaultIcon = L.icon({
        iconUrl: '/mapMarker.svg',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    });

    useEffect(() => {
        setFeatures(props.stationArray);

        if (mapRef.current) return;

        mapRef.current = L.map('map').setView([23.69781, 120.960515], 8);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapRef.current);
    }, []);

    useEffect(() => {
        if (!mapRef.current || !features || features.length === 0) return;

        const sidebar = L.control.sidebar({ container: 'sidebar', position: 'right' }).addTo(mapRef.current);

        features.forEach((foi: any) => {

            if (foi.features.properties.geometry?.coordinates) {
                const [longitude, latitude] = foi.features.properties.geometry.coordinates;

                if (latitude && longitude) {
                    if (foi.datastreams.length > 0) {

                        let marker = L.marker([latitude, longitude], { icon: defaultIcon });

                        marker.bindPopup(`<b>Station ID:</b> ${foi.features.properties.properties.name} <br> <b>Coordinates:</b> ${latitude}, ${longitude}`).addTo(mapRef.current);

                        let chartObs: { [key: string]: { name: any; value: any; timeStamp: string }[] } = {};


                        foi.datastreams.map(async (ds: any) => {
                            try {
                                const observations = await fetchObservations(ds);
                                if (observations && observations.length > 0) {
                                    observations.forEach((ob: any) => {
                                        let datastreamName = ds.properties.name;
                                        let resultName = Object.keys(ob.result)[0];
                                        let resultVal = Object.values(ob.result)[0];
                                        let resultTimestamp = ob.resultTime;


                                        // if(resultName === '即時影像'){
                                        //     let subStr = "http://dfm.swcb.gov.tw"
                                        //     let  string = resultVal.toString();
                                        //     console.log('resultVal', string.includes(subStr));
                                        //
                                        //     if(string.includes(subStr)){
                                        //         return;
                                        //     }
                                        //
                                        // }

                                        if (!chartObs[resultName]) {
                                            chartObs[resultName] = [];
                                        }
                                        chartObs[resultName].push({ name: datastreamName, value: resultVal, timeStamp: resultTimestamp });

                                    });
                                }
                            } catch (error: any) {
                                console.warn("error during obs fetch", error)
                            }
                        });



                        marker.on('click', function () {

                            // if chartobs is null or empty close the sidebar.
                            if(chartObs === null || Object.keys(chartObs).length === 0){
                                sidebar.close();
                                return;
                            }



                            const panelId = foi.features.properties.properties.name;

                            const parent = document.createElement('div');
                            parent.id = `observation-container-`+ panelId;
                            parent.style.width = '450px';
                            parent.style.height = 'auto';
                            //check if tab exists
                            if (createdTabs.current.has(panelId)) {
                                sidebar.open(panelId);
                                return;
                            }

                            sidebar.addPanel({
                                id: panelId,
                                tab: panelId,
                                title: `Station ${panelId} Details`,
                                pane: parent
                            });
                            createdTabs.current.add(panelId);

                            // Loop through observation keys and create a chart or table or video
                            Object.keys(chartObs).forEach((key) => {
                                console.log('chartobs', chartObs)
                                const data = chartObs[key];
                                if (data && data.length > 0) {
                                    const name = data[0].name;

                                    const labels = data.map((o) => o.timeStamp);
                                    const values = data.map((o) => o.value);

                                    //these charts are just dates, they dont seem relevant for this
                                    if(key === 'dailyextremelowairtemperaturetime' || key === 'dailyextremehighairtemperaturetime'){
                                        sidebar.close();
                                        return;
                                    }

                                    if (key === 'status' || key === 'pollutant') {

                                        var tableDiv = document.createElement('div');
                                        tableDiv.id = `chart-${key}`;
                                        tableDiv.style.width = '400px';
                                        tableDiv.style.height = 'auto';

                                        var table = document.createElement('table');
                                        table.id = `table-${key}`;
                                        tableDiv.appendChild(table);
                                        parent.appendChild(tableDiv);

                                        var thead = document.createElement('thead');
                                        var headerRow = document.createElement('tr');

                                        var thKey = document.createElement('th');
                                        thKey.textContent = 'Observation';
                                        var thTimestamp = document.createElement('th');
                                        thTimestamp.textContent = 'Timestamp';
                                        var thVal = document.createElement('th');
                                        thVal.textContent = 'Value';

                                        headerRow.appendChild(thKey);
                                        headerRow.appendChild(thTimestamp);
                                        headerRow.appendChild(thVal);

                                        thead.appendChild(headerRow);
                                        table.appendChild(thead);

                                        var tableBody = document.createElement('tbody');
                                        data.forEach((val, index) => {

                                            if(val.value === ""){
                                                return;
                                            }
                                            var row = document.createElement('tr');
                                            var tdKey = document.createElement('td');
                                            tdKey.textContent = key;
                                            var tdTimestamp = document.createElement('td');
                                            tdTimestamp.textContent = val.timeStamp;
                                            var tdValue = document.createElement('td');
                                            tdValue.textContent = val.value;

                                            row.appendChild(tdKey);
                                            row.appendChild(tdTimestamp);
                                            row.appendChild(tdValue);

                                            tableBody.appendChild(row);
                                        });
                                        table.appendChild(tableBody);
                                    }
                                    else if(key === '即時影像' || key === "視訊監測影格照片 - 視訊監測影格照片" || key === "視訊監測影格照片"){

                                        const video = data[0].value;

                                        if(video && video.includes('.jpg')){

                                            var videoDiv = document.createElement('div');
                                            videoDiv.id = `video-container`;
                                            videoDiv.style.width = '400px';
                                            videoDiv.style.height = 'auto';

                                            var vid = document.createElement('img');
                                            vid.style.width = '400px';
                                            vid.style.height = 'auto';
                                            vid.src= video;

                                            videoDiv.appendChild(vid);
                                            parent.appendChild(videoDiv);
                                        }else {
                                            sidebar.close();
                                            return;
                                        }
                                    }
                                    else{

                                        var chartDiv = document.createElement('div');
                                        chartDiv.id = `chart-${key}`;
                                        chartDiv.style.width = '400px';
                                        chartDiv.style.height = '300px';

                                        var canvas = document.createElement('canvas');
                                        canvas.id = `canvas-${key}`;
                                        chartDiv.appendChild(canvas);

                                        parent.appendChild(chartDiv);

                                        const initChartData = {
                                            labels: labels,
                                            datasets: [
                                                {
                                                    label: key,
                                                    data: values,
                                                    borderColor: 'blue',
                                                    borderWidth: 1,
                                                },
                                            ],
                                        };

                                        const chartOptions = {
                                            maintainAspectRatio: false,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: name
                                                }
                                            }
                                        };

                                        new Chart(canvas.getContext('2d'), {
                                            type: 'line',
                                            data: initChartData,
                                            options: chartOptions,
                                        });
                                    }
                                }

                            });

                            sidebar.open(panelId);
                        });
                    }
                }
            }
        });
    }, [features]);


    async function fetchObservations(ds: any) {
        try {
            const obsCol = await ds.searchObservations(new ObservationFilter(), 10000);
            const obs = await obsCol.nextPage();
            return obs;
        } catch (error: any) {
            console.warn('error fetching obs', error);
            return null;
        }
    }

    return (
        <div>
            <div id="map" style={{ width: '100%', height: '1000px' }}>
                <div id="sidebar" className="leaflet-sidebar collapsed bg-light">
                    <div className="leaflet-sidebar-tabs">

                    </div>
                </div>
            </div>
        </div>
    );
}
