/*
 * Copyright (c) 2024.  Botts Innovative Research, Inc.
 * All Rights Reserved
 */

// starts with lane, followed by 1 or more digits, ends after digit(s)
import {LaneMapEntry, LaneMeta} from "@/lib/data/oscar/LaneCollection";
import {System as OSCARSystem} from "@/lib/data/osh/Systems";
import {ISystem} from "@/lib/data/osh/Systems";
import {randomUUID} from "osh-js/source/core/utils/Utils";
import Systems from "osh-js/source/core/sweapi/system/Systems.js";
import System from "osh-js/source/core/sweapi/system/System.js";
import SystemFilter from "osh-js/source/core/sweapi/system/SystemFilter.js";
import {OSHSliceWriterReader} from "@/lib/data/state-management/OSHSliceWriterReader";
import DataStream from "osh-js/source/core/sweapi/datastream/DataStream.js";
import DataStreamFilter from "osh-js/source/core/sweapi/datastream/DataStreamFilter.js";

const LANEREGEX = /^lane\d+$/;

export interface INode {
    id: string,
    name: string,
    address: string,
    port: number,
    oshPathRoot: string,
    sosEndpoint: string,
    csAPIEndpoint: string,
    csAPIConfigEndpoint: string,
    isSecure: boolean,
    auth: { username: string, password: string } | null,
    isDefaultNode: boolean

    getConnectedSystemsEndpoint(noProtocolPrefix: boolean): string,

    getBasicAuthHeader(): any,

    fetchSystems(): Promise<any>,

    fetchLanes(): Promise<{ systems: ISystem[]; lanes: LaneMeta[] }>,

    fetchSystemsTK(): Promise<any[]>,

    fetchLaneSystemsAndSubsystems(): Promise<Map<string, LaneMapEntry>>,

    fetchDatastreamsTK(laneMap: Map<string, LaneMapEntry>): void,

    insertSubSystem(systemJSON: any, parentSystemId: string): Promise<string>

    insertObservation(observationJSON: any, datastreamId: string): Promise<string>

    fetchControlStreams(): Promise<any>
}

export interface NodeOptions {
    name: string,
    address: string,
    port: number,
    oshPathRoot?: string,
    sosEndpoint?: string,
    csAPIEndpoint?: string,
    csAPIConfigEndpoint?: string,
    auth?: { username: string, password: string } | null,
    isSecure?: boolean,
    isDefaultNode?: boolean
}

export class Node implements INode {
    id: string;
    name: string;
    address: string;
    port: number;
    oshPathRoot: string;
    sosEndpoint: string;
    csAPIEndpoint: string;
    csAPIConfigEndpoint: string;
    isSecure: boolean;
    auth: { username: string, password: string } | null = null;
    isDefaultNode: boolean;

    constructor(options: NodeOptions) {
        this.id = "node-" + randomUUID();
        this.name = options.name;
        this.address = options.address;
        this.port = options.port;
        this.oshPathRoot = options.oshPathRoot || '/sensorhub';
        this.sosEndpoint = options.sosEndpoint || '/sos';
        this.csAPIEndpoint = options.csAPIEndpoint || '/api';
        this.csAPIConfigEndpoint = options.csAPIConfigEndpoint || '/configs';
        this.auth = options.auth || null;
        this.isSecure = options.isSecure || false;
        this.isDefaultNode = options.isDefaultNode || false;
    }

    getConnectedSystemsEndpoint(noProtocolPrefix: boolean = false) {
        let protocol = this.isSecure ? 'https' : 'http';
        // return `${protocol}://${this.address}:${this.port}${this.oshPathRoot}${this.csAPIEndpoint}`;
        // console.log("NODE TEST GET CSAPI ENDPOINT", this);
        return noProtocolPrefix ? `${this.address}:${this.port}${this.oshPathRoot}${this.csAPIEndpoint}`
            : `${protocol}://${this.address}:${this.port}${this.oshPathRoot}${this.csAPIEndpoint}`;
    }

    // getSOSEndpoint(noProtocolPrefix: boolean = false) {
    //     let protocol = this.isSecure ? 'https' : 'http';
    //     // return `${protocol}://${this.address}:${this.port}${this.oshPathRoot}${this.csAPIEndpoint}`;
    //     console.log("NODE TEST GET CSAPI ENDPOINT", this);
    //     return noProtocolPrefix ? `${this.address}:${this.port}${this.oshPathRoot}${this.sosEndpoint}`
    //         : `${protocol}://${this.address}:${this.port}${this.oshPathRoot}${this.sosEndpoint}`;
    // }
    //
    // getEndpoint(noProtocolPrefix: boolean = false) {
    //     let protocol = this.isSecure ? 'https' : 'http';
    //     // return `${protocol}://${this.address}:${this.port}${this.oshPathRoot}${this.csAPIEndpoint}`;
    //     console.log("NODE TEST GET CSAPI ENDPOINT", this);
    //     return noProtocolPrefix ? `${this.address}:${this.port}${this.oshPathRoot}/admin`
    //         : `${protocol}://${this.address}:${this.port}${this.oshPathRoot}/admin`;
    // }

    getConfigEndpoint() {
        // let protocol = this.isSecure ? 'https' : 'http';
        return `${this.address}:${this.port}${this.oshPathRoot}${this.csAPIConfigEndpoint}`;
    }

    getBasicAuthHeader() {
        const encoded = btoa(`${this.auth.username}:${this.auth.password}`);
        return {"Authorization": `Basic ${encoded}`};
    }

    async fetchSystems(): Promise<any> {
        const response = await fetch(`${this.getConnectedSystemsEndpoint()}/systems`, {
            headers: {
                ...this.getBasicAuthHeader(),
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.items;
        } else {
            throw new Error(`Failed to fetch systems from node @: ${this.getConnectedSystemsEndpoint()}`);
        }
    }

    async fetchConfig() {
        return
    }

    async fetchDataStreams() {
        // fetch data streams from the server with CSAPI
        const response = await fetch(`${this.getConnectedSystemsEndpoint()}/datastreams`, {
            headers: {
                ...this.getBasicAuthHeader()
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.items;
        } else {
            throw new Error(`Failed to fetch systems from node @: ${this.getConnectedSystemsEndpoint()}`);
        }
    }

    async fetchLanes(): Promise<{ systems: ISystem[]; lanes: LaneMeta[] }> {
        let fetchedLanes: LaneMeta[] = [];
        let fetchedSystems: ISystem[] = [];
        // first, fetch the systems
        const systems_arr = await this.fetchSystems();
        // console.log("Systems:", systems_arr);
        for (let system of systems_arr) {
            // console.log("System:", system);
            const newSystem = new System(system.id, system.properties.uid, system.properties.name, this, null);
            // console.log("New System:", newSystem);
            fetchedSystems.push(newSystem);
            const uidSplit = system.properties.uid.split(":");
            // Test for lane signature in uid
            if (system.properties.uid.includes("urn:osh:system:")) {
                // console.info("Found System matching lane signature");
                const newLaneName = system.properties.name;
                // Fetch subsystems
                const subsystems = await newSystem.fetchSubsystems();
                fetchedSystems.push(...subsystems);
                let systemIds = subsystems.map((subsystem: any) => subsystem.id);
                systemIds.unshift(newSystem.id);
                // Create a new LaneMeta object
                let newLaneMeta = new LaneMeta(newLaneName, systemIds);
                // console.info("New Lane Created:", newLaneMeta);
                fetchedLanes.push(newLaneMeta);
            }
        }
        // console.log("LaneFetched these objects:", fetchedLanes, fetchedSystems);
        return {lanes: fetchedLanes, systems: fetchedSystems};
    }

    async fetchLaneSystemsAndSubsystems(): Promise<Map<string, LaneMapEntry>> {

        // check if node is reachable first
        let isReachable = OSHSliceWriterReader.checkForEndpoint(this);
        if (!isReachable) {
            // console.warn("Node is not reachable, check endpoint properties");
            return new Map<string, LaneMapEntry>();
        }

        let systems = await this.fetchSystemsTK();
        let laneMap = new Map<string, LaneMapEntry>();

        // console.log("TK Systems retrieved!!!!:", systems);

        // filter into lanes
        for (let system of systems) {
            // console.log("TK System:", system.properties?.properties?.uid);
            if (system.properties?.properties?.uid.includes("sta")) {
                // console.log("TK Found lane system:", system);
                // let laneName = system.properties.properties.uid.split(":").pop();
                let stationName = system.properties.properties.name;

                if (laneMap.has(stationName)) {
                    laneMap.get(stationName).systems.push(system);
                    laneMap.get(stationName).setLaneSystem(system);
                } else {
                    let tLaneEntry = new LaneMapEntry(this);
                    tLaneEntry.setLaneName(stationName);
                    laneMap.set(stationName, tLaneEntry);
                    // console.log("TK LaneMap:", laneMap, laneName);
                    let entry = laneMap.get(stationName);
                    entry.addSystem(system);
                    entry.setLaneSystem(system);
                }

                let subsystems = await system.searchMembers();
                while (subsystems.hasNext()) {
                    let subsystemResults = await subsystems.nextPage();
                    laneMap.get(stationName).addSystems(subsystemResults);
                }
            }
        }

        return laneMap;
    }

    async fetchSystemsTK(): Promise<any[]> {
        let systemsApi = new Systems({
            endpointUrl: `${this.address}:${this.port}${this.oshPathRoot}${this.csAPIEndpoint}`,
            tls: this.isSecure,
            connectorOpts: this.auth
        });

        let searchedSystems = await systemsApi.searchSystems(new SystemFilter(), 100);
        let availableSystems = [];

        while (searchedSystems.hasNext()) {
            let systems = await searchedSystems.nextPage();
            availableSystems.push(...systems);
        }

        if (availableSystems.length > 0) {
            // console.log("Systems from TK:", availableSystems);
            return availableSystems;
        } else {
            throw new Error("No systems found, check endpoint properties");
        }
    }

    async fetchDatastreamsTK(laneMap: Map<string, LaneMapEntry>) {
        for (const [laneName, laneEntry] of laneMap) {
            try {
                const datastreams = await laneEntry.laneSystem.searchDataStreams(undefined, 100);
                while (datastreams.hasNext()) {
                    const datastreamResults = await datastreams.nextPage();
                    laneEntry.addDatastreams(datastreamResults);
                }
            } catch (error) {
                // console.error(`Error fetching datastreams for system ${laneEntry.laneSystem.id}:`, error);
            }
        }
    }

    fetchDatasourcesTK() {

    }


    async insertObservation(observationJSON: any, datastreamId: string): Promise<string> {
        let ep: string = `${this.getConnectedSystemsEndpoint()}/datastreams/${datastreamId}/observations`;
        // console.log("[ADJ] Inserting Observation: ", ep, this);

        const response = await fetch(ep, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(observationJSON),
            headers: {
                ...this.getBasicAuthHeader(),
                'Content-Type': 'application/sml+json'
            }
        });

        if (response.ok) {
            // console.log("[NODE] Observation Inserted: ", response);
            let obsId = response.headers.get("Location").split("/").pop();
            return obsId;
        } else {
            console.warn("[Node] Error inserting Observation: ", response);
        }
    }

    insertSubSystem(systemJSON: any, parentSystemId: string): Promise<string> {
        return Promise.resolve("");
    }

    async fetchControlStreams() {
        // have to use manual request due to osh-js having the wrong resource location
        let ep = `${this.getConnectedSystemsEndpoint(false)}/controlstreams`
        let response = await fetch(ep, {
            method: "GET",
            headers: {
                ...this.getBasicAuthHeader(),
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            let json = await response.json();
            // console.log("Control Streams", json['items']);
            return json['items']
        } else {
            console.warn("Error getting Control Streams")
            return []
        }
    }
}
