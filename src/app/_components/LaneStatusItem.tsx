"use client";


import Paper from '@mui/material/Paper';
import {Stack, Tooltip, Typography} from '@mui/material';
import AlarmIcon from '@mui/icons-material/NotificationsActive';
import TamperIcon from '@mui/icons-material/ReportProblem';
import FaultIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OfflineIcon from '@mui/icons-material/ReportOff'
import React from "react";


export default function LaneStatusItem(props: {
    id: number;
    name: string;
    isOnline: boolean;
    isAlarm: boolean;
    isTamper: boolean;
    isFault: boolean;

}) {

    return (
        <Paper key={props.id} variant='outlined' sx={{ cursor: 'pointer', padding: 1,   backgroundColor: (props.isAlarm ? "errorHighlight" : props.isTamper ? "secondaryHighlight" : (props.isTamper && props.isAlarm) ? "secondaryHighlight" : "unknown" ) }}

        >
            <Stack direction={"row"} spacing={1}>

                    <Typography variant="body1">{props.name}</Typography>

                    {props.isAlarm &&
                        <Tooltip title={'Alarm'} arrow placement="top">
                            <AlarmIcon sx={{color: '#FFFFFF'}}/>
                        </Tooltip>}

                    {props.isFault &&
                        <Tooltip title={'Fault'} arrow placement="top">
                            <FaultIcon color="info"/>
                        </Tooltip>
                    }

                    {props.isTamper &&
                        <Tooltip title={'Tamper'} arrow placement="top">
                            <TamperIcon sx={{color: "#FFFFFF" }}/>
                        </Tooltip>
                    }

                    {!props.isAlarm && !props.isTamper && !props.isFault && props.isOnline && (
                        <Tooltip title={'All Clear'} arrow placement="top">
                            <CheckCircleIcon color="success"/>
                        </Tooltip>
                    )}
                    {!props.isOnline &&
                        <Tooltip title={'Offline'} arrow placement="top">
                            <OfflineIcon color="error"/>
                        </Tooltip>
                    }

            </Stack>
        </Paper>
    );
}