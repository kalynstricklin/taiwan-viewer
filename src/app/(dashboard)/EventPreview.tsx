"use client";

import { Box, IconButton, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import Image from "next/image";
import { useEffect, useState } from 'react';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AdjudicationSelect from '../_components/AdjudicationSelect';
import { SelectedEvent } from 'types/new-types';

export default function EventPreview(props: {
  event?: SelectedEvent;
}) {
  const [selectedEvent, setSelectedEvent] = useState(
    props.event && props.event.startTime && props.event.endTime ? props.event : null
  );

  const handleAdjudication = (value: string) => {
    console.log(value); // Print adjudication code value
  }

  useEffect(() => {
    setSelectedEvent(props.event);  // Update selected event on change
  }, [])

  return (
    <Box>
      {selectedEvent ? (
        <Stack p={1} display={"flex"}>
          <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Typography variant="h6">Occupancy ID</Typography>
              <IconButton aria-label="expand">
                <OpenInFullRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
            <IconButton aria-label="close">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
          <AdjudicationSelect onSelect={handleAdjudication} />
          <TextField
            id="outlined-multiline-static"
            label="Notes"
            multiline
            rows={4}
          />
        </Stack>
      ) : (
        <Image src={"/SiteMap.png"} alt="Site Map" width={0} height={0} sizes={"100vw"} style={{ width: "100%", height: "100%", padding: 10 }} />
      )}
    </Box>
  );
}