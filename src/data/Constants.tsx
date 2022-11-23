/*
 * Copyright (c) 2022.  Botts Innovative Research, Inc.
 * All Rights Reserved
 *
 * opensensorhub/osh-viewer is licensed under the
 *
 * Mozilla Public License 2.0
 * Permissions of this weak copyleft license are conditioned on making available source code of licensed
 * files and modifications of those files under the same license (or in certain cases, one of the GNU licenses).
 * Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.
 * However, a larger work using the licensed work may be distributed under different terms and without
 * source code for files added in the larger work.
 *
 */

// Playback States========================================================
export enum PlaybackState {
    PLAY,
    PAUSE,
    STOP
}

// Observable Types ========================================================
export enum ObservableType {

    PLI = 'PLI',
    VIDEO = 'VIDEO',
    IMAGE = 'IMAGE',
    DRAPING = 'DRAPING',
    LOB = 'LOB',
    AOI = "AOI",
    CHART = 'CHART',
    TARGET = 'TARGET',
    SIGINT = 'SIGINT'
}

export const DEFAULT_TIME_ID: string = "INDETERMINATE | REALTIME";
export const REALTIME_START: string = "now";
export const REALTIME_END: string = "...";
export const REALTIME_FUTURE_END: string = "2999-12-31T23:59:59.000Z";

export enum TimeScale {

    HOURS = "H",
    MINUTES = "M",
    SECONDS = "S"
}

export function asMillis(scale: TimeScale): number {

    let millis: number = 1000;

    switch(scale) {
        case TimeScale.HOURS:
            millis = 3600000;
            break;
        case TimeScale.MINUTES:
            millis = 60000;
            break;
        case TimeScale.SECONDS:
        default:
            break;
    }

    return millis;
}

export enum Service {
    API = "/sensorhub/api",
    SOS = "/sensorhub/sos",
    SPS = "/sensorhub/sps",
    DISCOVERY = "/sensorhub/discovery"
}

export const DEFAULT_SOS_ENDPOINT:Service = Service.SOS;
export const DEFAULT_SPS_ENDPOINT:Service = Service.SPS;
export const DEFAULT_API_ENDPOINT:Service = Service.API;

export enum Protocols {
    HTTP = "http",
    HTTPS = "https",
    WS = "ws",
    WSS = "wss"
}