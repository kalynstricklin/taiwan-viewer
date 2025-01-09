import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {enableMapSet} from "immer";
import {LaneMapEntry, LaneMeta} from "@/lib/data/oscar/LaneCollection";
import {RootState} from "@/lib/state/Store";

enableMapSet();

export interface IOSCARClientState {
    currentUser: string,
    quickActions: [],

    // This should move to a separate slice
    lanes: LaneMeta[],
    alertTimeoutSeconds: number,
    laneMap: Map<string, LaneMapEntry>,
    shouldForceAlarmTableDeselect: boolean,
}

const initialState: IOSCARClientState = {
    currentUser: 'testuser',
    quickActions: [],
    lanes: [],
    alertTimeoutSeconds: 10,
    laneMap: new Map<string, LaneMapEntry>(),
    shouldForceAlarmTableDeselect: false,
}


export const Slice = createSlice({
    name: 'ClientStateSlice',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<string>) => {
            state.currentUser = action.payload;
        },
        setQuickActions: (state, action: PayloadAction<[]>) => {
            state.quickActions = action.payload;
        },
        setLanes: (state, action: PayloadAction<LaneMeta[]>) => {
            state.lanes = action.payload;
        },
        setAlertTimeoutSeconds: (state, action: PayloadAction<number>) => {
            state.alertTimeoutSeconds = action.payload;
        },
        setLaneMap: (state, action: PayloadAction<Map<string, LaneMapEntry>>) => {
            state.laneMap = action.payload;
        },
        setShouldForceAlarmTableDeselect: (state, action: PayloadAction<boolean>) => {
            console.log(`Setting shouldForceAlarmTableDeselect to ${action.payload}`);
            state.shouldForceAlarmTableDeselect = action.payload;
        },
        toggleShouldForceAlarmTableDeselect: (state) => {
            state.shouldForceAlarmTableDeselect = !state.shouldForceAlarmTableDeselect;
        }
    }
})

export const {
    setCurrentUser,
    setQuickActions,
    setLanes,
    setAlertTimeoutSeconds,
    setLaneMap,
    setShouldForceAlarmTableDeselect,
    toggleShouldForceAlarmTableDeselect
} = Slice.actions;

export const selectCurrentUser = (state: RootState) => state.oscarClientSlice.currentUser;
export const selectLanes = (state: RootState) => state.oscarClientSlice.lanes;
export const selectLaneByName = (laneName: string) => (state: RootState) => {
    // console.info("Lane Name should be: ", laneName, state.oscarClientSlice.lanes);
    return state.oscarClientSlice.lanes.find((lane: { name: string }) => lane.name === laneName);
};
export const selectLaneById = (laneId: string) => (state: RootState) => {
    return state.oscarClientSlice.lanes.find((lane: { id: string }) => lane.id === laneId);
};
export const selectLaneMap = (state: RootState) => state.oscarClientSlice.laneMap;
export const selectLaneView = (state: RootState) => state.oscarClientSlice.laneView;
export const selectShouldForceAlarmTableDeselect = (state: RootState) => state.oscarClientSlice.shouldForceAlarmTableDeselect;


// Compound Selectors
/*export const selectSystemIdsOfLane = (laneId: string) => createSelector(
    [selectLaneById(laneId)],
    (lane) => lane.systemIds
);*/

/*export const selectSystemsOfLane = (laneId: string) => createSelector(
    [selectSystemIdsOfLane(laneId), selectSystems],
    (systemIds, systems) => {
        return systems.filter((system: { id: any; }) => systemIds.includes(system.id));
    }
);*/

/*
export const selectDatastreamsOfLane = (laneId: string) => createSelector(
    [selectSystemsOfLane(laneId), selectDatastreams],
    (systems, datastreams) => {
        // console.log("Found these systems:", systems);
        let datastreamsArr: IDatastream[] = [];
        for (let ds of datastreams.values()) {
            if (systems.find((system: { id: any; }) => system.id === ds.parentSystemId)) {
                datastreamsArr.push(ds);
            }
        }
        return datastreamsArr;
    });
*/


export default Slice.reducer;
