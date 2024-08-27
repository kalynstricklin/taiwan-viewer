import { Box, Paper, Typography } from "@mui/material";
import EventTable from "../_components/EventTable";
import { EventTableData } from "types/new-types";

const testData: EventTableData[] = [
  { id: '1', secondaryInspection: false, laneId: '1', occupancyId: '1', startTime: 'XX:XX:XX AM', endTime: 'XX:XX:XX AM', maxGamma: 25642, status: 'Gamma', }
];

export default function EventLogPage() {
  return (
    <Box>
      <Typography variant="h4">Event Log</Typography>
      <br />
      <Paper variant='outlined' sx={{ height: "100%" }}>
        <EventTable data={testData} viewSecondary viewMenu viewLane />
      </Paper>
    </Box>
  );
}