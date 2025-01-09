/*
 * Copyright (c) 2024.  Botts Innovative Research, Inc.
 * All Rights Reserved
 */

import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";
import {randomUUID} from "osh-js/source/core/utils/Utils";
import System from "osh-js/source/core/sweapi/system/System.js";
import DataStream from "osh-js/source/core/sweapi/datastream/DataStream.js";
import DataStreams from "osh-js/source/core/sweapi/datastream/DataStreams.js";
import {INode} from "@/lib/data/osh/Node";
import {Mode} from "osh-js/source/core/datasource/Mode";
import {EventType} from "osh-js/source/core/event/EventType";

import {
    isGammaDatastream,
    isNeutronDatastream,
    isOccupancyDatastream,
    isTamperDatastream, isThresholdDatastream,
    isVideoDatastream
} from "./Utilities";

class ILaneMeta {
    id: string;
    name: string;
    label: string;
    systemIds: string[];

}

export class LaneMeta implements ILaneMeta {
    id: string;
    name: string;
    label: string;
    systemIds: string[];


    constructor(name: string, systemIds: string[]) {
        this.id = "lane" + randomUUID();
        this.name = name;
        this.label = name.replace(" ", "_").toLowerCase();
        this.systemIds = systemIds;
    }
}

export class LaneMapEntry {
    systems: typeof System[];
    datastreams: typeof DataStream[];
    datasources: any[];
    datasourcesBatch: any[];
    datasourcesRealtime: any[];
    parentNode: INode;
    laneSystem: typeof System;
    private adjDs: string;
    adjControlStreamId: string;
    laneName: string;

    constructor(node: INode) {
        this.systems = [];
        this.datastreams = [];
        this.datasources = [];
        this.datasourcesBatch = [];
        this.datasourcesRealtime = [];
        this.parentNode = node;
        this.laneName = undefined
    }

    setLaneSystem(system: typeof System) {
        this.laneSystem = system;
    }

    addSystem(system: any) {
        this.systems.push(system);
    }

    addSystems(systems: any[]) {
        this.systems.push(...systems);
    }

    addDatastream(datastream: any) {
        this.datastreams.push(datastream);
    }

    addDatastreams(datastreams: any[]) {
        this.datastreams.push(...datastreams);
    }

    addDatasource(datasource: any) {
        this.datasources.push(datasource);
    }

    addDatasources(datasources: any[]) {
        this.datasources.push(...datasources);
    }
    setLaneName(name: string){
        this.laneName = name;
    }

    async getAdjudicationDatastream(dsId: string) {
        let isSecure = this.parentNode.isSecure;
        let url = this.parentNode.getConnectedSystemsEndpoint(true);
        console.log("[ADJ-log] Creating Adjudication Datastream: ", this, url);
        let dsApi = new DataStreams({
            // streamProtocol: isSecure ? "https" : "http",
            endpointUrl: `${url}`,
            tls: isSecure,
            connectorOpts: {
                username: this.parentNode.auth.username,
                password: this.parentNode.auth.password
            }
        });
        let datastream = await dsApi.getDataStreamById(dsId);
        console.log("[ADJ-log] Adjudication Datastream: ", datastream);
        return datastream;
    }

    resetDatasources() {
        for (let ds of this.datasourcesRealtime) {
            ds.disconnect();
        }
        for (let ds of this.datasourcesBatch) {
            ds.disconnect();
        }
    }

    addDefaultSWEAPIs() {
        // TODO: Verify that this doesn't negatively impact the app's visual usage
        this.resetDatasources();

        let rtArray = [];
        let batchArray = [];

        for (let dsObj of this.datastreams) {

            let dsRT = new SweApi(`rtds - ${dsObj.properties.name}`, {
                protocol: dsObj.networkProperties.streamProtocol,
                endpointUrl: dsObj.networkProperties.endpointUrl,
                resource: `/datastreams/${dsObj.properties.id}/observations`,
                tls: dsObj.networkProperties.tls,
                responseFormat: isVideoDatastream(dsObj) ? 'application/swe+binary' : 'application/swe+json',
                mode: Mode.REAL_TIME,
                connectorOpts: {
                    username: this.parentNode.auth.username,
                    password: this.parentNode.auth.password
                }
            });

            let dsBatch = new SweApi(`batchds - ${dsObj.properties.name}`, {
                protocol: dsObj.networkProperties.streamProtocol,
                endpointUrl: dsObj.networkProperties.endpointUrl,
                resource: `/datastreams/${dsObj.properties.id}/observations`,
                tls: dsObj.networkProperties.tls,
                responseFormat: isVideoDatastream(dsObj) ? 'application/swe+binary' : 'application/swe+json',
                mode: Mode.BATCH,
                connectorOpts: {
                    username: this.parentNode.auth.username,
                    password: this.parentNode.auth.password
                },
                startTime: "2020-01-01T08:13:25.845Z",
                endTime: "2055-01-01T08:13:25.845Z",
                // endTime: new Date((new Date().getTime() - 1000000)).toISOString()

            });

            // this.datasources.push([dsRT, dsBatch]);
            rtArray.push(dsRT);
            batchArray.push(dsBatch);
        }
        this.datasourcesRealtime = rtArray;
        this.datasourcesBatch = batchArray;
    }

    createReplaySweApiFromDataStream(datastream: typeof DataStream, startTime: string, endTime: string) {
        return new SweApi(`rtds-${datastream.properties.id}`, {
            protocol: datastream.networkProperties.streamProtocol,
            endpointUrl: datastream.networkProperties.endpointUrl,
            resource: `/datastreams/${datastream.properties.id}/observations`,
            tls: datastream.networkProperties.tls,
            responseFormat: isVideoDatastream(datastream) ? 'application/swe+binary' : 'application/swe+json',
            mode: Mode.REPLAY,
            connectorOpts: {
                username: this.parentNode.auth.username,
                password: this.parentNode.auth.password
            },
            startTime: startTime,
            endTime: endTime
        });
    }

    createBatchSweApiFromDataStream(datastream: typeof DataStream, startTime: string, endTime: string) {
        return new SweApi(`batchds-${datastream.properties.id}`, {
            protocol: datastream.networkProperties.streamProtocol,
            endpointUrl: datastream.networkProperties.endpointUrl,
            resource: `/datastreams/${datastream.properties.id}/observations`,
            tls: datastream.networkProperties.tls,
            responseFormat: isVideoDatastream(datastream) ? 'application/swe+binary' : 'application/swe+json',
            mode: Mode.BATCH,
            connectorOpts: {
                username: this.parentNode.auth.username,
                password: this.parentNode.auth.password
            },
            startTime: startTime,
            endTime: endTime
        });
    }

    findDataStreamByName(nameFilter: string): typeof DataStream {
        let ds: typeof DataStream = this.datastreams.find((ds) => ds.properties.name.includes(nameFilter))
        return ds;
    }

    lookupSystemIdFromDataStreamId(dsId: string): string {
        let stream: typeof DataStream = this.datastreams.find((ds) => ds.id === dsId);
        return this.systems.find((sys) => sys.properties.id === stream.properties["system@id"]).properties.id;
    }

    findDataStreamByObsProperty(obsProperty: string){
        let stream: typeof DataStream = this.datastreams.find((ds)=> {
            // console.log("FIND ds props", ds)
            let hasProp = ds.properties.observedProperties.some((prop: any)=> prop.definition === obsProperty)

            return hasProp;
        });
        return stream;
    }


    addControlStreamId(id: string) {
        this.adjControlStreamId = id;
    }
}

export class LaneDSColl {
    occRT: typeof SweApi[];
    occBatch: typeof SweApi[];
    gammaRT: typeof SweApi[];
    gammaBatch: typeof SweApi[];
    neutronRT: typeof SweApi[];
    neutronBatch: typeof SweApi[];
    tamperRT: typeof SweApi[];
    tamperBatch: typeof SweApi[];
    locRT: typeof SweApi[];
    locBatch: typeof SweApi[];
    gammaTrshldBatch: typeof SweApi[];
    gammaTrshldRT: typeof SweApi[];
    connectionRT: typeof SweApi[];
    videoRT: typeof SweApi[];
    adjRT: typeof SweApi[];
    adjBatch: typeof SweApi[];


    constructor() {
        this.occRT = [];
        this.occBatch = [];
        this.gammaRT = [];
        this.gammaBatch = [];
        this.neutronRT = [];
        this.neutronBatch = [];
        this.tamperRT = [];
        this.tamperBatch = [];
        this.locBatch = [];
        this.locRT = [];
        this.gammaTrshldBatch = [];
        this.gammaTrshldRT = [];
        this.connectionRT = [];
        this.videoRT = [];
        this.adjRT = [];
        this.adjBatch = [];
    }

    getDSArray(propName: string): typeof SweApi[] {
        // @ts-ignore
        return this[propName];
    }

    addDS(propName: string, ds: typeof SweApi) {
        let dsArr = this.getDSArray(propName);
        if (dsArr.some((d) => d.name == ds.name)) {
            return;
        } else {
            dsArr.push(ds);
        }
    }

    addSubscribeHandlerToAllBatchDS(handler: Function) {
        for (let ds of this.occBatch) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.gammaBatch) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.neutronBatch) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.tamperBatch) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.locBatch) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.occBatch) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.gammaTrshldBatch) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.adjBatch) {
            ds.subscribe(handler, [EventType.DATA]);
        }

    }

    addSubscribeHandlerToAllRTDS(handler: Function) {
        for (let ds of this.occRT) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.gammaRT) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.neutronRT) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.tamperRT) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.locRT) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.gammaTrshldRT) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.connectionRT) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.videoRT) {
            ds.subscribe(handler, [EventType.DATA]);
        }
        for (let ds of this.adjRT) {
            ds.subscribe(handler, [EventType.DATA]);
        }
    }

    [key: string]: typeof SweApi[] | Function;

    addSubscribeHandlerToALLDSMatchingName(dsCollName: string, handler: Function) {
        for (let ds of this[dsCollName] as typeof SweApi[]) {
            ds.subscribe(handler, [EventType.DATA]);
        }
    }

    connectAllDS() {
        for (let ds of this.occRT) {
            ds.connect();
        }
        for (let ds of this.occBatch) {
            ds.connect();
        }
        for (let ds of this.gammaRT) {
            ds.connect();
        }
        for (let ds of this.gammaBatch) {
            ds.connect();
        }
        for (let ds of this.neutronRT) {
            ds.connect();
        }
        for (let ds of this.neutronBatch) {
            ds.connect();
        }
        for (let ds of this.tamperRT) {
            ds.connect();
        }
        for (let ds of this.tamperBatch) {
            ds.connect();
        }
        for (let ds of this.locRT) {
            ds.connect();
        }
        for (let ds of this.locBatch) {
            ds.connect();
        }
        for (let ds of this.gammaTrshldBatch) {
            ds.connect();
        }
        for (let ds of this.gammaTrshldRT) {
            ds.connect();
        }
        for (let ds of this.connectionRT) {
            ds.connect();
        }
        for (let ds of this.videoRT) {
            ds.connect();
        }
        // console.info("Connecting all datasources of:", this);
    }
}