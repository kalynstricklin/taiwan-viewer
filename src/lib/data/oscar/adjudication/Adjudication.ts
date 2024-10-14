import {randomUUID} from "osh-js/source/core/utils/Utils";
import {INode, Node} from "@/lib/data/osh/Node";

export interface IAdjudicationData {
    time: string,
    id: string;
    username: string
    feedback: string
    adjudicationCode: string
    isotopes: string
    secondaryInspectionStatus: string
    filePaths: string
    occupancyId: string
    alarmingSystemUid: string,
    vehicleId?: string
}

export default class AdjudicationData {
    id: string;
    username: string
    feedback: string
    adjudicationCode: string
    isotopes: string
    secondaryInspectionStatus: string
    filePaths: string
    occupancyId: string
    alarmingSystemUid: string
    vehicleId?: string

    constructor(properties: IAdjudicationData) {
        Object.assign(this, properties);
        this.id = randomUUID();
    }
}

export class AdjudicationCommand {
    setAdjudicated: boolean;
    observationId: string;

    constructor(obsId: string, setAdjudicated: true) {
        this.observationId = obsId;
        this.setAdjudicated = setAdjudicated;
    }

    getJsonString() {
        return JSON.stringify(
            {
                "params": {
                    'observationId': this.observationId,
                    'setAdjudicated': this.setAdjudicated
                }
            })
    }
}

export function createAdjudicationObservation(data: IAdjudicationData, resultTime: string): any {
    let obs = {
        "phenomenonTime": resultTime,
        "result": {
            "time": new Date(resultTime).getTime(),
            // "id": data.id,
            "username": data.username,
            "feedback": data.feedback,
            "adjudicationCode": data.adjudicationCode,
            "isotopes": data.isotopes,
            "secondaryInspectionStatus": data.secondaryInspectionStatus,
            "filePaths": data.filePaths,
            "occupancyId": data.occupancyId,
            "alarmingSystemUid": data.alarmingSystemUid
        }
    }
    // return obs
    return JSON.stringify(obs, ['phenomenonTime', 'result', 'time', 'id', 'username', 'feedback', 'adjudicationCode', 'isotopes', 'secondaryInspectionStatus', 'filePaths', 'occupancyId', 'alarmingSystemUid'], 2);
}

export async function sendSetAdjudicatedCommand(node: INode, controlStreamId: string, command: AdjudicationCommand | string) {
    let ep = node.getConnectedSystemsEndpoint(false) + `/controlstreams/${controlStreamId}/commands`
    let response = await fetch(ep, {
        method: "POST",
        headers: {
            ...node.getBasicAuthHeader(),
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: command instanceof AdjudicationCommand ? command.getJsonString() : command
    })
    if (response.ok) {
        let json = await response.json();
        console.log("ADJ Command Response", json)
    } else {
        console.warn("[ADJ] adj command failed", response)
    }
}

export function generateCommandJSON(observationId: string, setAdjudicated: boolean) {
    return JSON.stringify({
        "params": {
            'observationId': observationId,
            'setAdjudicated': setAdjudicated
        }
    })
}

export async function findObservationIdBySamplingTime(node: INode, datastreamId: string, samplingTime: string) {
    let ep = node.getConnectedSystemsEndpoint(false) + `/datastreams/${datastreamId}/observations?` + `resultTime=${samplingTime}`;
    let response = await fetch(ep, {
        method: 'GET',
        headers: {
            ...node.getBasicAuthHeader(),
            'Content-Type': 'sml+json'
        },
        mode: "cors"
    })
    if (response.ok) {
        // Yes, this IS a sketchy way to do this. Working on a change to Tables that is an actual fix
        let json = await response.json()
        console.log("Observations Found", json)
        return json.items[0]
    } else {
        console.log("Response Failed", response)
        return false
    }
}
