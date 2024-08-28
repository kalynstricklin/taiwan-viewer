"use client"
import { Box, Paper, Typography } from "@mui/material";
import EventTable from "../_components/EventTable";
import {EventTableData, SelectedEvent} from "../../../types/new-types";
import Table from "@/app/_components/Table";


//todo: make page size 800+
export default function EventLogPage() {
    return (
    <Box >
      <Typography variant="h4">Event Log</Typography>
      <br />
      <Paper variant='outlined' sx={{ height: "100%" }}>
          <Table isEventLog onRowSelect= {() =>{}} />
      </Paper>
    </Box>
  );
}