"use client";

import {Box, Grid, Icon, Paper, Typography} from "@mui/material";
import MapComponent from "@/app/_components/maps/MapComponent";
import {useEffect, useState} from "react";
import Systems from "osh-js/source/core/sweapi/system/Systems.js";
import DataStreams from "osh-js/source/core/sweapi/datastream/DataStreams.js";
import DataStreamFilter from "osh-js/source/core/sweapi/datastream/DataStreamFilter.js";
import SystemFilter from "osh-js/source/core/sweapi/system/SystemFilter.js";
import FeaturesOfInterest from "osh-js/source/core/sweapi/featureofinterest/FeatureOfInterests.js";
import FeatureOfInterestFilter from "osh-js/source/core/sweapi/featureofinterest/FeatureOfInterestFilter.js";
import LineChart from "@/app/_components/baseComp/LineChart";
import DataTable from "../_components/baseComp/DataTable";


export default function DashboardPage() {


    // const networkOpts = {
    //     endpointUrl: `192.168.1.69:8282/sensorhub/api`,
    //     tls: false,
    //     connectorOpts: {
    //         username: 'admin',
    //         password: 'admin',
    //     }
    // };
    //
    // const systems = new Systems(networkOpts);
    // const datastreams = new DataStreams(networkOpts);
    // const samplingFeatures = new FeaturesOfInterest(networkOpts);
    //
    // console.log("sampling features", samplingFeatures)
    // console.log("sys", systems)
    //
    // useEffect(() => {
    //     async function fetchSys(){
    //
    //         // const availFoiCol = await samplingFeatures.searchFeaturesOfInterest(new FeatureOfInterestFilter(), 10);
    //         // const availFoi = await availFoiCol.nextPage();
    //         // console.log('FOI:' + availFoi);
    //
    //
    //         const availSysCol = await systems.searchSystems(new SystemFilter(),4566);
    //         const availSys = await availSysCol.nextPage();
    //         console.log(availSys);
    //
    //         const station1 = availSys[287];
    //
    //         const station1SubsysCol = await station1.searchMembers();
    //         const station1Subsys = await station1SubsysCol.nextPage();
    //         console.log(station1Subsys);
    //
    //
    //
    //         // if(datastreams != undefined){
    //         //     const allDatastreamsCol = await datastreams.searchDataStreams(new DataStreamFilter({q: ""}),100);
    //         //
    //         //     console.log("all ds col", await allDatastreamsCol.nextPage())
    //         //
    //         //     // const allDs = await allDatastreamsCol.nextPage();
    //         //
    //         //     // const filteredDs = allDs.filter((ds: any)=> ds.properties.observedProperties[0].definition.includes('http://www.opengis.net/def/property/OGC/0/SensorLocation') )
    //         //
    //         //     // console.log('filteredDs:', filteredDs);
    //         // }
    //     }
    //
    //
    //     fetchSys();
    //
    // }, []);




    const [selectedPoint, setSelectedPoint] = useState(null);

    const handlePointMarker = (point:any) =>{
        setSelectedPoint(point);
    }


    return (

        <Grid container spacing={2} direction={"column"}>
            <Grid item container spacing={2} style={{flexBasis: '66.66%', flexGrow: 0, flexShrink: 0}}>
                <Grid item xs={7}>
                    <Paper variant='outlined' sx={{height: "100%"}}>
                        <MapComponent/>
                    </Paper>
                </Grid>
                <Grid item xs={5}>
                    <Paper variant='outlined' sx={{height: "100%", padding: "10px"}}>

                        <Typography variant="h5">Station ID: C0A880</Typography>
                        <Typography variant="subtitle1" >Coordinates: 21.966757 120.81027</Typography>


                        <Paper variant="outlined" sx={{ height: "250px", padding: '10px' }}>
                            <LineChart />
                        </Paper>

                        <div style={{ height: "250px", padding: '10px' }}>
                            <DataTable/>
                        </div>



                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
}


{/*{*/}
{/*    selectedPoint ? (*/}
{/*        <>*/}
{/*            <Typography variant="h6">Station ID: {selectedPoint.name}</Typography>*/}
{/*            <Typography variant="body1">Coordinates: {selectedPoint.lat}, {selectedPoint.lon}</Typography>*/}

{/*            <LineChart ds={selectedPoint.data}/>*/}

{/*            <DataTable/>*/}


{/*        </>*/}
{/*    ) : (*/}
{/*        <Typography variant="h6" style={{text-align: 'center'}}>Select a point on the map to view details!</Typography>*/}
{/*    )*/}
{/*}*/}