"use client"

import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import PointMarkerLayer from "osh-js/source/core/ui/layer/PointMarkerLayer";
import LeafletView from "osh-js/source/core/ui/view/map/LeafletView";

import Box from "@mui/material/Box";
import '../../style/map.css';

import "leaflet/dist/leaflet.css"

import Systems from 'osh-js/source/core/sweapi/system/Systems';
import SystemFilter from "osh-js/source/core/sweapi/system/SystemFilter";
import DataStreamFilter from "osh-js/source/core/sweapi/datastream/DataStreamFilter";
import System from "osh-js/source/core/sweapi/system/System";
import DataStreams from "osh-js/source/core/sweapi/datastream/DataStreams";
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource"
import DataSynchronizer from 'osh-js/source/core/timesync/DataSynchronizer'
import {Mode} from 'osh-js/source/core/datasource/Mode';

import FeaturesOfInterest from "osh-js/source/core/sweapi/featureofinterest/FeatureOfInterests.js";
import FeatureOfInterestFilter from "osh-js/source/core/sweapi/featureofinterest/FeatureOfInterestFilter.js";

export default function MapComponent() {

    const leafletViewRef = useRef<typeof LeafletView | null>(null);
    const mapcontainer: string = "mapcontainer";

    const [isInit, setIsInt] = useState(false);


    const networkOpts = {
        endpointUrl: `192.168.1.69:8282/sensorhub/api`,
        tls: false,
        connectorOpts: {
            username: 'admin',
            password: 'admin',
        }
    };


    const systems = new Systems(networkOpts);
    const datastreams = new DataStreams(networkOpts);
    const samplingFeatures = new FeaturesOfInterest(networkOpts);


    useEffect(() => {

        async function fetchSystems() {
            const availableSystemsCollection = await systems.searchSystems(new SystemFilter(),4885);
            const availableSystems = await availableSystemsCollection.nextPage();
            console.log(availableSystems);

            const lane1 = availableSystems.filter((sys: any) => sys.properties.id === "n193hf1emj38a");

            // const lane1 = availableSystems[4]; // Get whichever lane, filter by "properties.properties.uid" to ensure it matches "urn:osh:system:lane"

            console.log("Lane 1", lane1)

            const lane1SubsystemsCollection = await lane1[0].searchMembers(); // Returns collection of subsystems of the lane
            const lane1Subsystems = await lane1SubsystemsCollection.nextPage();
            console.log(lane1Subsystems);

            if(samplingFeatures != undefined) {

                const availFoiCol = await samplingFeatures.searchFeaturesOfInterest(new FeatureOfInterestFilter(), 10);
                console.log('availFOiCo', availFoiCol);
                const availFoi = await availFoiCol.nextPage();
                console.log('FOI:' + availFoi);
            }



        // Retrieve certain drivers from
            // const rpmDriver = lane1Subsystems.find((system: typeof System) => system.properties.properties.uid.startsWith("urn:osh:sensor:rapiscan"));

            // Retrieve ALL Datastreams from a system
            // const rpmDatastreamsCollection = await rpmDriver.searchDataStreams(undefined, /*pageSize = */30); // Get all datastreams
            // // Filter by observed property, this yields only the "Occupancy" Datastream
            // const rpmOccupancyStreamsCollection = await rpmDriver.searchDataStreams(new DataStreamFilter({ observedProperty: ["http://www.opengis.net/def/occupancy"] }))

            // const occupancyDatastream = (await rpmOccupancyStreamsCollection.nextPage())[0];

            // You can directly subscribe to a datastreams observations
            // occupancyDatastream.streamObservations(undefined, (message: any) => {
            //   console.log(message);
            // });

            // Or create a SweApi for videostream observations
            // const process = availableSystems.find((system: typeof System) => system.properties.properties.uid.includes("urn:osh:sensor:"));
            // console.log("Process: ")
            // console.log(process)
            // const processDatastreamsCol = await process.searchDataStreams(undefined, 50);
            // const processDatastreams = await processDatastreamsCol.nextPage();
            // console.log("Process datastreams: ")
            // console.log(processDatastreams)
            // const videoDatastreamsCol = await videoDriver.searchDataStreams(new DataStreamFilter({ ObservationFilter: ["http://www.opengis.net/def/Video"] }));

            // Get all datastreams from a node paginated for whatever size
            // if(datastreams !== undefined) {
            //     const allDatastreamsCol = await datastreams.searchDataStreams(new DataStreamFilter({
            //         q: "urn:osh:sta:sensor:移動式設備坐標:227",
            //     }), /*pageSize = */100);
            //     const allDatastreams = await allDatastreamsCol.nextPage();
            //     const filteredDatastreams = allDatastreams.filter((ds: any) => ds.properties.observedProperties[0].definition.includes(""));
            //     console.log(filteredDatastreams);
            // }
        }

        fetchSystems();

    }
    , []);

    useEffect(() => {

        if (!leafletViewRef.current && !isInit) {
            let view = new LeafletView({
                container: mapcontainer,
                layers: [],

                autoZoomOnFirstMarker: true
            });
            console.log('new view created')
            leafletViewRef.current = view;
            setIsInt(true);
        }

    }, [isInit]);

    // useEffect(() => {
    //     if(locationList && locationList.length > 0 && isInit){
    //         locationList.forEach((location) => {
    //             location.locationSources.forEach((loc: any) => {
    //                 let newPointMarker = new PointMarkerLayer({
    //                     name: location.stationName,
    //                     dataSourceId: loc.id,
    //                     getLocation: (rec: any) => {
    //                         return ({x: rec.location.lon, y: rec.location.lat, z: rec.location.alt})
    //                     },
    //                     label: `<div class='popup-text-lane'>` + location.stationName + `</div>`,
    //                     markerId: () => this.getId(),
    //                     icon: '/default.svg',
    //                     iconColor: 'rgba(0,0,0,1.0)',
    //                     // getIcon: {
    //                     //     dataSourceIds: [loc.getId()],
    //                         // handler: function (rec: any) {
    //                         //     if (location.status === 'Alarm') {
    //                         //         return  '/alarm.svg';
    //                         //     } else if (location.status.includes('Fault')) {
    //                         //         return  '/fault.svg';
    //                         //     } else{
    //                         //         return '/default.svg'
    //                         //     }
    //                         // }
    //                     // },
    //                     labelColor: 'rgba(255,255,255,1.0)',
    //                     labelOutlineColor: 'rgba(0,0,0,1.0)',
    //                     labelSize: 20,
    //                     iconAnchor: [16, 16],
    //                     labelOffset: [-5, -15],
    //                     iconSize: [16, 16],
    //                     // description: getContent(location.status, location.statioName),
    //                 });
    //                 leafletViewRef.current?.addLayer(newPointMarker);
    //             });
    //             location.locationSources.map((src: any) => src.connect());
    //         });
    //     }
    //
    // }, [locationList, isInit]);


    /***************content in popup************/
    // function getContent(status: string, laneName: string) {
    //
    //     return (
    //         `<div id='popup-data-layer' class='point-popup'><hr/>
    //             <h3 class='popup-text-status'>Status: ${status}</h3>
    //             <button onClick='location.href="./lane-view?name=${laneName}"' class="popup-button" type="button">VIEW LANE</button>
    //         </div>`
    //     );
    // }

    return (
        <Box id="mapcontainer" style={{width: '100%', height: '900px'}}></Box>
    );
}