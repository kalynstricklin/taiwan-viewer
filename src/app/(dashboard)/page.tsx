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
    const observations = new Observations(networkOpts);

    useEffect(()=>{
        let station: Station[] = [];

        if(stationsList === null || stationsList.length == 0){
            async function fetchFois(){
                const allFoiCol = await features.searchFeaturesOfInterest(undefined, 99999);
                const allFois = await allFoiCol.nextPage();

                // console.log("FOIs", allFois);

                for (let index = 0; index < 30; index++) {
                    fetchDataStreamsFromFoi(allFois[index]);
                }

            }
            async function fetchDataStreamsFromFoi(foi: typeof FeatureOfInterest) {
                const dsCol = await datastreams.searchDataStreams(new DataStreamFilter({ foi: foi.properties.id }), 10000);
                const ds = await dsCol.nextPage();

                // console.log("ds", ds)

                const st: Station ={
                    features: foi,
                    datastreams: ds,
                }
                station.push(st);
            }

            // async function fetchObservations(){
            //     const obsCol = await observations.searchObservations(new ObservationFilter(), 1000);
            //     const obs = await obsCol.nextPage();
            //
            //     console.log("obss", obs)
            // }
            fetchFois();

            // fetchObservations();
            setStationsList(station);
        }


    }, []);

    console.log("StationList", stationsList)


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
                {/*<Grid item xs={5} spacing={2}>*/}
                {/*    {*/}
                {/*        selectedPoint ? (*/}
                {/*            <>*/}
                {/*                <Typography variant="h6">Point selected</Typography>*/}
                {/*                /!*<EventDetails selectedPoint={selectedPoint}/>*!/*/}
                {/*            </>*/}
                {/*        ) : (*/}
                {/*            <Paper variant='outlined' sx={{height: "100%", padding: "10px"}}>*/}
                {/*                <Typography variant="h6">Select a point on the map to view details!</Typography>*/}

                {/*                <VideoComponent stationSelected={stationsList}/>*/}
                {/*            </Paper>*/}
                {/*        )*/}
                {/*    }*/}

                {/*</Grid>*/}
            </Grid>
        </Grid>
    );
}


