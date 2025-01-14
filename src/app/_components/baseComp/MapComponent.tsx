"use client"

import React, {useEffect, useMemo, useRef, useState} from "react";
import '../../style/map.css';
import "leaflet/dist/leaflet.css"
import L from "leaflet";
import {Chart} from "chart.js";
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

} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend
)
interface MapProps{
    stationArray: any;
}

// <div className="App" style={{ flex: 1, flexDirection: 'row'}}>
//     {obsArray.map((obs, index) => (
//         <img key={index} src={obs.result["即時影像"]} alt={`Data from observation ${obs.id}`} />
//     ))}
// </div>
export default function MapComponent(props: MapProps) {
    const mapRef = useRef(null);

    const [features, setFeatures] = useState(props.stationArray);

    var defaultIcon = L.icon({
        iconUrl: '/mapMarker.svg',
        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    })

    var videoIcon = L.icon({
        iconUrl: '/video.svg',
        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    })
    const [sidebarPanelId, setSidebarPanelId] = useState<any | null>(null);

    useEffect(()=>{
        setFeatures(props.stationArray);

        //if map exists return
        if(mapRef.current) return;

        //if no map create one!
        mapRef.current = L.map('map').setView([23.69781, 120.960515], 8);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapRef.current);
    },[]);


    useEffect(() => {
        //if no map or no FOI return
        if (!mapRef.current || !features || features.length === 0) return;

        console.log('featur', features)
        const sidebar = L.control.sidebar({container: 'sidebar'}).addTo(mapRef.current);

        //loop through foi and if it has coordinates plot them on map
        features.forEach((foi: any)=>{

            //add marker for foi that have coordinates :p
            if (foi.features.properties.geometry && foi.features.properties.geometry?.coordinates) {

                const [longitude, latitude] = foi.features.properties.geometry.coordinates;

                if (latitude && longitude) {

                    if(foi.datastreams.length > 0) {

                        let marker = L.marker([latitude, longitude],{icon: defaultIcon});

                        marker.bindPopup(`<b>Station ID:</b> ${foi.features.properties.properties.name} <br> <b>Coordinates:</b> ${latitude}, ${longitude} <br>`).addTo(mapRef.current);

                        let chartObs: {[key: string] : {name: any; value: any; timeStamp: string}[]} = {};

                        foi.datastreams.map(async (ds: any) => {
                            try {
                                const observations = await fetchObservations(ds);

                                //check if observations exists
                                if (observations && observations.length > 0) {

                                    //loop through observations and get the name and value and add it to an array with the same key
                                    observations.forEach((ob: any) => {
                                        console.log('ob', ob);


                                        let datastreamName = ds.properties.name;
                                        console.log('datastream name', datastreamName)
                                        let resultName = Object.keys(ob.result)[0];
                                        let resultVal = Object.values(ob.result)[0];
                                        let resultTimestamp = ob.resultTime;

                                        if (!chartObs[resultName]) {
                                            chartObs[resultName] = [];
                                        }
                                        chartObs[resultName].push({name: datastreamName, value: resultVal, timeStamp: resultTimestamp});

                                    });
                                }
                            } catch
                                (error: any) {
                                console.warn("error during obs fetch,", error)
                            }
                        });



                        marker.on('click', function() {

                            if(sidebarPanelId){
                                sidebar.removePanel(sidebarPanelId);
                            }

                            var parent = document.createElement('div');
                            parent.id = 'observation-container';
                            parent.style.width = '500px';
                            parent.style.height = 'auto';


                            // Loop through observation keys and create a chart or table!
                            Object.keys(chartObs).forEach((key) => {

                                // Get labels and values for charts based on observation keys
                                const data = chartObs[key];
                                if(data && data.length > 0){

                                    const name = data[0].name;

                                    const labels = data.map((o) => o.timeStamp);
                                    const values = data.map((o) => o.value);


                                    if(key === 'status' || key === 'pollutant'){

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
                                        data.forEach((val, index)=>{
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
                                    else if(key === '即時影像'){

                                        const video = data[0].value;
                                        if(video){
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
                                                title:{
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

                            const panelId = 'home-' + foi.features.properties.properties.name;

                            sidebar.addPanel({
                                id: 'observation',
                                tab: foi.features.properties.properties.name,
                                title: "Station ${foi.features.properties.properties.name} Details",
                                pane: parent
                            });
                            setSidebarPanelId(panelId);
                            sidebar.open('observation');
                        });



                    }
                }
            }
        });
    }, [features]);


    //function to fetch observatgions on current foi datastreams
    async function fetchObservations(ds: any){
        try{
            const obsCol =  await ds.searchObservations(new ObservationFilter(), 100000);
            const obs = await obsCol.nextPage();
            return obs;
        }catch(error: any){
            console.warn('error fetching obs', error);
            return null;
        }
    }

    return (
        <div>
            <div id="map" style={{width: '100%', height: '1000px'}}>
                <div id="sidebar" className="leaflet-sidebar collapsed bg-light">
                    <div className="sidebar-tabs">
                        <ul role="tablist">
                            <li><a href="#home" role="tab"><i className="fa fa-bars"></i></a></li>
                        </ul>
                    </div>

                    {/*<div className="leaflet-sidebar-content">*/}
                    {/*    <div className="leaflet-sidebar-pane" id="observation">*/}

                    {/*    </div>*/}

                    {/*</div>*/}
                </div>
            </div>

        </div>

    );
}