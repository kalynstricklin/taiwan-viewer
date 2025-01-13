"use client"

import React, {useEffect, useRef, useState} from "react";
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
export default function MapComponent(props: MapProps) {
    const mapRef = useRef(null);

    const [features, setFeatures] = useState(props.stationArray);
    const [observations, setObservations] = useState(null);

    var defaultIcon = L.icon({
        iconUrl: '/mapMarker.svg',
        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    })

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

        const sidebar = L.control.sidebar({
            autopan: false,
            closeButton: true,
            container: 'sidebar',
            position: 'left',
        }).addTo(mapRef.current);

        //loop through foi and if it has coordinates plot them on map
        features.forEach((foi: any)=>{

            console.log('fois', foi)

            //add marker for foi that have coordinates :p
            if (foi.features.properties.geometry && foi.features.properties.geometry?.coordinates) {

                const [longitude, latitude] = foi.features.properties.geometry.coordinates;

                // console.log("coordinate", foi.features.properties.geometry.coordinates);
                if (latitude && longitude) {

                    const marker = L.marker([latitude, longitude],{icon: defaultIcon});
                    marker.bindPopup(`<b>Station ID:</b> ${foi.features.properties.properties.name} <br> <b>Coordinates:</b> ${latitude}, ${longitude} <br>`).addTo(mapRef.current);

                    let obs: {[key: string] : {value: any; timeStamp: string}[]} = {};


                    if(foi.datastreams.length > 0) {
                        foi.datastreams.map(async (ds: any) => {
                            try {
                                const observations = await fetchObservations(ds);

                                //check if observations exists
                                if (observations && observations.length > 0) {
                                    //loop through observations and get the name and value and add it to an array with the same key
                                    observations.forEach((ob: any) => {
                                        console.log('observation', ob);
                                        let resultName = Object.keys(ob.result)[0];
                                        let resultVal = Object.values(ob.result)[0];
                                        let resultTimestamp = ob.resultTime;

                                        if (!obs[resultName]) {
                                            obs[resultName] = [];
                                        }
                                        obs[resultName].push({value: resultVal, timeStamp: resultTimestamp});
                                        // console.log('ob result', resultName, resultVal)
                                    });
                                    // obs.push(...observations);
                                }
                            } catch
                                (error: any) {
                                console.warn("error during obs fetch,", error)
                            }


                            console.log("obs", obs);

                        });
                    }

                    // sidebar.addPanel({
                    //     id: 'home',
                    //     tab: '<i class="fa fa-info"></i>',
                    //     title: `Station ${foi.features.properties.properties.name} Details`,
                    //
                    // });
                    //
                    // sidebar.open('home');
                    // });

                    marker.on('click', function() {
                        // Create a parent div for the chart container
                        var parent = document.createElement('div');
                        parent.id = 'chart-container';
                        parent.style.width = '500px';
                        parent.style.height = 'auto';

                        // Loop through observation keys and create a chart for each
                        Object.keys(obs).forEach((key) => {
                            // Get labels and values for charts based on observation keys
                            const data = obs[key];
                            const labels = data.map((o) => o.timeStamp);
                            const values = data.map((o) => o.value);
                            console.log('chart data!', labels, "values:", values);

                            var div = document.createElement('div');
                            div.id = `chart-${key}`;
                            div.style.width = '400px';
                            div.style.height = '300px';


                            var canvas = document.createElement('canvas');
                            canvas.id = `canvas-${key}`;
                            div.appendChild(canvas);

                            parent.appendChild(div);

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
                            };

                            new Chart(canvas.getContext('2d'), {
                                type: 'line',
                                data: initChartData,
                                options: chartOptions,
                            });
                        });

                        marker.bindPopup(parent).openPopup();
                    });





                }
            }
        })


    }, [features]);

    const createChartDiv = ()=>{
        const chartDiv = document.createElement('div');
        chartDiv.classList.add('chart-container');
    }

    async function fetchObservations(ds: any){
        try{
            const obsCol =  await ds.searchObservations(new ObservationFilter(), 10000);
            const obs = await obsCol.nextPage();
            return obs;
        }catch(error: any){
            console.warn('error fetching obs', error);
            return null;
        }
    }



    return (
        <div>
            <div id="map" style={{width: '100%', height: '900px'}}>
                <div id="sidebar" className="leaflet-sidebar collapsed bg-light">
                   <div className="sidebar-tabs">
                       <ul role="tablist">
                           <li><a href="#home" role="tab"><i className="fa fa-bars"></i></a></li>
                       </ul>
                   </div>

                    <div className="leaflet-sidebar-content">
                        <div className="sidebar-pane" id="home">
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
}


// marker.on('click', () => {

// document.getElementById('chart-container').innerHTML = '';

// let obs: {[key: string] : {value: any; timeStamp: string}[]} = {};
//
//
// if(foi.datastreams.length > 0){
//     foi.datastreams.map(async (ds: any)=>{
//         // console.log("filter", await fetchObservations(ds));
//         try{
//             const observations = await fetchObservations(ds);
//
//             //check if observations exists
//             if(observations && observations.length > 0){
//                 //loop through observations and get the name and value and add it to an array with the same key
//                 observations.forEach((ob: any)=>{
//                     let resultName =  Object.keys(ob.result)[0];
//                     let resultVal =  Object.values(ob.result)[0];
//                     let resultTimestamp = ob.resultTime;
//
//                     if(!obs[resultName]){
//                         obs[resultName] = [];
//                     }
//                     obs[resultName].push({value: resultVal, timeStamp: resultTimestamp});
//                     // console.log('ob result', resultName, resultVal)
//                 });
//                 // obs.push(...observations);
//             }
//
//
//             console.log("obs", obs)
//             //loop through obs and create a chart
//             Object.keys(obs).forEach((key: any) =>{
//
//                 console.log("key", key)
//                 const data = obs[key];
//
//                 const labels = data.map((o: any) => o.timeStamp)
//                 const values =   data.map((o: any) => o.value)
//
//                 //create chart container for each chart based on key
//                 const chartId = `chart-${key}`;
//                 const chartContainer = document.createElement(`canvas`);
//                 chartContainer.id = chartId;
//
//
//
//                 //create charts
//                 console.log('creating chart', chartId)
//
//                 const chart = createLineChart(chartId, labels, values, key);
//                 document.getElementById('chart-container').appendChild(chartContainer);
//
//
//             })
//
//
//
//             setObservations(obs);
//
//         }catch(error: any){
//             console.warn("error during obs fetch,", error)
//         }
//     });
// }



// marker.addTo(mapRef.current);




//    function getDsContent(ds: any){
//         // console.log("dss", ds)
//
//         if(ds && ds.length > 0){
//
//         }
//
//
//
//         return (
//             `
//             `
//         )
//     }
//
//     function getStationContent(foiSelected: any, latitude: any, longitude: any) {
//         let imgSrc = '';
//         let foiDS = foiSelected.datastreams;
//
//         // console.log("selected foi dsss", foiSelected.datastreams)
//
//
//         // <img src="` + imgSrc + `"/>
//         return (
//             `<b>Station ID:</b> ${foiSelected.features.properties.properties.name} <br> <b>Coordinates:</b> ${latitude}, ${longitude} <br>`
//         )
//
//     }



// marker.on('click', (e: any) =>{
//
//
// });

//loop through obs and create a chart
// Object.keys(obs).forEach((key: any) => {
//
//     console.log("obs key", key)
//
//     //create chart div
//     var popupContent = document.createElement('div');
//     popupContent.classList.add('chart-container');
//
//
//     //create chart container for each chart based on key
//     const chartId = `chart-${key}`;
//
//     var canvas = document.createElement('canvas');
//     canvas.id = chartId;
//
//     // get labels and values for charts based on observations key
//     const data = obs[key];
//
//     const labels = data.map((o: any) => o.timeStamp)
//     const values = data.map((o: any) => o.value)
//
//
//     var ctx = canvas.getContext('2d');
//     //create charts
//     // console.log('creating chart', chartId)
//
//     popupContent.appendChild(canvas);
//
//     createLineChart(ctx, labels, values, key);
//     // var popup = e.target.getPopup();
//     // var chart_div = document.getElementById(chartId);
//     // popup.setContent(chart_div);
//
// });