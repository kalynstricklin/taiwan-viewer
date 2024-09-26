
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";
import PointMarkerLayer from "osh-js/source/core/ui/layer/PointMarkerLayer";

/**
 * Interface for Event Table data
 */
export interface IEventTableData {
  id: number; // Unique ID for event
  secondaryInspection?: boolean;  // Whether or not there has been a secondary inspection performed
  laneId: string; // Lane ID
  occupancyId: string;  // Occupancy ID
  startTime: string;  // Start time of occupancy/event
  endTime: string;  // End time of occupancy/event
  maxGamma?: number; // Max gamma count
  maxNeutron?: number; // Max neutron count
  status: string; // Alarm status -> enum?
  adjudicatedUser?: string; // User ID that adjudicated event
  adjudicatedCode?: number; // Adjudication code for event
}

/**
 * Event type to make request for more details
 * Requires start and end time of event
 */
type SelectedEvent = {
  startTime: string;
  endTime: string;
}

export type LaneStatusType = {
    id: number;
    name: string;
    status: string;
}


export interface LaneWithLocation{
  laneName: string,
  locationSources: typeof SweApi[],
  status: string
}


export interface LaneStatusItem {
  laneName: string,
  gammaSources: typeof SweApi[],
  neutronSources: typeof SweApi[],
  tamperSources: typeof SweApi[]
}
