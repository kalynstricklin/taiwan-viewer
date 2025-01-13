"use client"

import React, {useEffect, useRef, useState} from "react";
import '../../style/map.css';
import "leaflet/dist/leaflet.css"
import L from "leaflet";
import {useAppDispatch} from "@/lib/state/Hooks";
import MjpegView from 'osh-js/source/core/ui/view/video/MjpegView.js';
import VideoDataLayer from "osh-js/source/core/ui/layer/VideoDataLayer";
interface VideoProps{
    videoStream: any;
}
export default function VideoComponent(props: VideoProps) {

    useEffect(() => {
        let videoView = new MjpegView({
            container: "video-container",
            css: "video-mjpeg",
            name: "video",
            keepRatio: true,
            showTime: true,
            layers: [
                new VideoDataLayer({
                    dataSourceId: props.videoStream.id,
                    getFrameData: (rec: any) => rec.videoFrame,
                    getTimestamp: (rec: any) => rec.timestamp
                })
            ]
        })
    }, []);

    return (
        <div id="video-container" style={{width: '100%', height: '900px'}}></div>
    );
}