"use client"

import React, {useEffect, useRef, useState} from "react";
import '../../style/map.css';
import "leaflet/dist/leaflet.css"
import L from "leaflet";
import {useAppDispatch} from "@/lib/state/Hooks";
import {Box, Paper, Typography} from "@mui/material";
import DataTable from "@/app/_components/baseComp/DataTable";

interface EventDetailsProp{
    selectedPoint: any;
}


export default function EventDetails(props: EventDetailsProp) {


    return (
        <Paper variant='outlined' sx={{height: "100%", padding: "10px"}}>
            <Typography variant="h5">Station ID: {props.selectedPoint.name}</Typography>
            <Typography variant="subtitle1">Coordinates: {props.selectedPoint.lat}, {props.selectedPoint.lon}</Typography>

            <Box style={{maxHeight: '100vh', overflow: 'auto'}}>
                <Paper variant="outlined" sx={{ height: "250px", padding: '10px' }}>
                    <Typography variant="subtitle1" >VIDEOOOOO</Typography>
                </Paper>


                <Paper variant="outlined" sx={{ height: "250px", padding: '10px' }}>
                    {/*<LineChart />*/}
                </Paper>

                <div style={{ height: "250px"}}>
                    <DataTable/>
                </div>
            </Box>
        </Paper>
    );
}