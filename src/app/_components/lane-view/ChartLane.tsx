"use client"


import {Grid} from "@mui/material";
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";
import React, {useCallback, useEffect, useRef, useState} from "react";
import CurveLayer from "osh-js/source/core/ui/layer/CurveLayer";
import ChartJsView from "osh-js/source/core/ui/view/chart/ChartJsView";

export class ChartInterceptProps {
    laneName: string;
    gammaDatasources: typeof SweApi[];
    neutronDatasources: typeof SweApi[];
    occDatasources: typeof SweApi[];
    thresholdDatasources: typeof SweApi[];
    setChartReady: Function;
}

export default function ChartLane(props: ChartInterceptProps){


    const [chartsReady, setChartsReady] = useState<boolean>(false);
    const [viewReady, setViewReady] = useState<boolean>(false);
    const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false);

    const gammaChartBaseId = "chart-view-gamma";
    const neutronChartBaseId = "chart-view-neutron";

    const [gammaChartID, setGammaChartID] = useState<string>("");
    const [neutronChartID, setNeutronChartID] = useState<string>("");

    const [thresholdCurve, setThresholdCurve] = useState<typeof CurveLayer>();
    const [sigmaCurve, setSigmaCurve] = useState<typeof CurveLayer>();
    const [gammaCurve, setGammaCurve] = useState<typeof CurveLayer>();
    const [neutronCurve, setNeutronCurve] = useState<typeof CurveLayer>();

    const gammaChartViewRef = useRef<typeof ChartJsView | null>(null);
    const neutronChartViewRef = useRef<typeof ChartJsView | null>(null);


    const createCurveLayers = useCallback(() =>{

        if(props.thresholdDatasources.length > 0){
            const tCurve = new CurveLayer({
                dataSourceIds: props.thresholdDatasources.map((ds) => ds.id),
                name: "Gamma Threshold",
                // backgroundColor: "#ab47bc",
                // lineColor: '#ab47bc',
                xLabel: 'Time',
                yLabel: 'CPS',

                getValues: (rec: any, timestamp: any) => ({x: timestamp, y: rec.threshold}),

            });
            setThresholdCurve(tCurve);

            const sCurve = new CurveLayer({
                dataSourceIds: props.thresholdDatasources.map((ds) => ds.id),
                name: "Sigma",
                backgroundColor: "#ab47bc",
                lineColor: '#ab47bc',
                xLabel: 'Time',
                yLabel: 'CPS',

                getValues: (rec: any, timestamp: any) => ({x: timestamp, y: rec.sigma}),

            });
            setSigmaCurve(sCurve);

            const timeCurve = new CurveLayer({
                dataSourceIds: props.thresholdDatasources.map((ds) => ds.id),
                getValues: () => {
                    return {x: 0}
                },
                name: "Current Time"
            });
        }

        if(props.gammaDatasources.length > 0){
            console.log(props.gammaDatasources)
            const gCurve = new CurveLayer({
                dataSourceIds: props.gammaDatasources.map((ds) => ds.id),
                name: "Gamma Plot",
                backgroundColor: "#f44336",
                lineColor: "#f44336",
                xLabel: 'Time',
                yLabel: 'CPS',
                maxValues: 100,
                getValues: (rec: any, timestamp: any) => {
                    if (rec.gammaGrossCount !== undefined) {
                        return { x: timestamp, y: rec.gammaGrossCount };
                    }
                    else if (rec.gammaCount1 !== undefined) {
                        return { x: timestamp, y: rec.gammaCount1 };
                    }
                },

            });
            setGammaCurve(gCurve);

            console.log(gCurve)
        }

        if(props.neutronDatasources.length > 0){
            const nCurve = new CurveLayer({
                dataSourceIds: props.neutronDatasources.map((ds) => ds.id),
                name: 'Neutron Plot',
                backgroundColor: "#29b6f6",
                lineColor: '#29b6f6',
                xLabel: 'Time',
                yLabel: 'CPS',
                maxValues: 100,
                getValues: (rec: any, timestamp: any) => {
                    if(rec.neutronGrossCount !== undefined){
                        return {x: timestamp, y: rec.neutronGrossCount}
                    }
                    else if(rec.neutronCount1 !== undefined){
                        return {x: timestamp, y: rec.neutronCount1 }
                    }
                },

            });
            setNeutronCurve(nCurve);
        }

    },[props]);

    const checkForMountableAndCreateCharts = useCallback(() => {

        if (!gammaChartViewRef.current && !isReadyToRender && thresholdCurve || gammaCurve || sigmaCurve) {
            console.log("Creating Gamma Chart:", thresholdCurve, gammaCurve);

            const container = document.getElementById(gammaChartID);
            let layers: any[] =[];
            if(thresholdCurve && gammaCurve && sigmaCurve){
                layers.push(thresholdCurve)
                layers.push(gammaCurve)
                layers.push(sigmaCurve)

            }else if(gammaCurve && !thresholdCurve && !sigmaCurve){
                layers.push(gammaCurve)
            }

            if (container) {
                gammaChartViewRef.current = new ChartJsView({
                    container: gammaChartID,
                    layers: layers,
                    css: "chart-view",
                });
                setViewReady(true);
            }
        }

        if (!neutronChartViewRef.current && !isReadyToRender && neutronCurve) {
            console.log("Creating Neutron Chart:", neutronCurve);

            const containerN = document.getElementById(neutronChartID);
            if (containerN) {
                neutronChartViewRef.current = new ChartJsView({
                    container: neutronChartID,
                    layers: [neutronCurve],
                    css: "chart-view",
                });
                setViewReady(true);
            }
        }
    }, [thresholdCurve, gammaCurve, neutronCurve, isReadyToRender]);

    const checkReadyToRender = useCallback(() => {
        if (chartsReady && viewReady) {
            setIsReadyToRender(true);
        } else {
            setIsReadyToRender(false);
        }
    }, [chartsReady, viewReady]);

    useEffect(() => {
        checkForMountableAndCreateCharts();
    }, [checkForMountableAndCreateCharts]);

    useEffect(() => {
        if (checkForProvidedDataSources()) {
            createCurveLayers();
        }
    }, [props]);


    useEffect(() => {
        checkReadyToRender();
    }, [chartsReady, viewReady]);

    useEffect(() => {
        if (isReadyToRender) {
            console.log("Chart is ready to render");
            props.setChartReady(true);
        }
    }, [isReadyToRender]);

    const updateChartElIds = useCallback(() => {

        setGammaChartID(gammaChartBaseId);
        setNeutronChartID(neutronChartBaseId);

    }, []);

    useEffect(() => {
        updateChartElIds();
    }, [props]);

    const checkForProvidedDataSources = useCallback(() => {
        console.log("[CI] Checking for provided data sources...");
        if (!props.gammaDatasources || !props.neutronDatasources || !props.thresholdDatasources) {
            console.warn("No DataSources provided for ChartTimeHighlight");
            return false;
        } else {
            return true;
        }
    }, [props.gammaDatasources, props.neutronDatasources, props.thresholdDatasources]);


    return (
        <Grid container direction="row" marginTop={2} marginLeft={1} spacing={3}>
            <Grid item xs>
                <div id={gammaChartID} style={{
                    marginBottom: 50,
                    height: '85%',
                }}></div>
            </Grid>
            <Grid item xs>
                <div id={neutronChartID} style={{
                    marginBottom: 50,
                    height: '85%',
                }}></div>
            </Grid>
        </Grid>
    );
};