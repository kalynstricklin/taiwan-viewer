"use client";

import {Box, Grid, Icon, InputBase, Paper, Typography, styled} from "@mui/material";
import MapComponent from "@/app/_components/baseComp/MapComponent";
import React, {useEffect, useState} from "react";
import DataStreams from "osh-js/source/core/sweapi/datastream/DataStreams.js";
import DataStreamFilter from "osh-js/source/core/sweapi/datastream/DataStreamFilter.js";
import FeaturesOfInterest from "osh-js/source/core/sweapi/featureofinterest/FeatureOfInterests.js";
import FeatureOfInterest from "osh-js/source/core/sweapi/featureofinterest/FeatureOfInterest.js";
import Observations from "osh-js/source/core/sweapi/observation/observations.js";
import ObservationFilter from "osh-js/source/core/sweapi/observation/ObservationFilter.js";


export interface Station{
    features: typeof FeatureOfInterest;
    datastreams: typeof DataStreams;

}

export default function DashboardPage() {

    const [stationsList, setStationsList]=useState<Station[]| null>(null);

    const networkOpts = {
        endpointUrl:    `localhost:8282/sensorhub/api`,
        // endpointUrl: `192.168.1.69:8282/sensorhub/api`,
        tls: false,
        connectorOpts: {
            username: 'admin',
            password: 'admin',
        }
    };

    const datastreams = new DataStreams(networkOpts);
    const features = new FeaturesOfInterest(networkOpts);


    useEffect(()=>{
        let station: Station[] = [];

        if(stationsList === null || stationsList.length == 0){
            async function fetchFois(){
                const allFoiCol = await features.searchFeaturesOfInterest(undefined, 999999);
                const allFois = await allFoiCol.nextPage();

                // console.log("FOs", allFois);

                for (let index = 0; index < 1000; index++) {
                    await fetchDataStreamsFromFoi(allFois[index]);
                }

            }
            async function fetchDataStreamsFromFoi(foi: typeof FeatureOfInterest) {
                const dsCol = await datastreams.searchDataStreams(new DataStreamFilter({ foi: foi.properties.id }), 999999);
                const ds = await dsCol.nextPage();



                const st: Station ={
                    features: foi,
                    datastreams: ds,
                }
                station.push(st);
            }

            fetchFois();
            setStationsList(station);
        }


    }, []);

    // console.log("StationList", stationsList)


    // const [selectedPoint, setSelectedPoint] = useState(null);
    //
    // const handleMarkerSelection = (selection: any) =>{
    //     console.log("selected marker", selection)
    //     setSelectedPoint(selection);
    // }


    // async function translate(text, source = 'auto', target = 'en') {
    //     try {
    //         const res = await fetch("https://libretranslate.com/translate", {
    //             method: "POST",
    //             body: JSON.stringify({ q: text, source, target }),
    //             headers: { "Content-Type": "application/json" },
    //         });
    //         const data = await res.json();
    //         return data.translatedText || text;
    //     } catch (error) {
    //         console.error("Translation error:", error);
    //         return text;
    //     }
    // }



    return (

        <Grid container spacing={2} direction={"column"}>
            <Grid item container spacing={2} style={{flexBasis: '66.66%', flexGrow: 0, flexShrink: 0}}>
                <Grid item xs={12}>
                    <Paper variant='outlined' sx={{height: "100%"}}>
                        <MapComponent stationArray={stationsList}/>
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
}


