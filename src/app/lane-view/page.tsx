"use client";

import { Grid, Paper, Stack, Typography } from "@mui/material";
import BackButton from "../_components/BackButton";
import { useSearchParams } from 'next/navigation'
import LaneStatus from "../_components/lane-view/LaneStatus";
import Media from "../_components/lane-view/Media";
import AlarmTable from "../_components/lane-view/AlarmTable";
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";
import {LaneDSColl, LaneMapEntry} from "@/lib/data/oscar/LaneCollection";
import {DataSourceContext} from "@/app/contexts/DataSourceContext";
import {START_TIME} from "@/lib/data/Constants";
import Table2 from "@/app/_components/event-table/TableType2";
import {useSelector} from "react-redux";
import {selectLaneMap} from "@/lib/state/OSCARClientSlice";
import {RootState} from "@/lib/state/Store";


export default function LaneViewPage() {

    const laneMap = useSelector((state: RootState) => selectLaneMap(state))
    const searchParams = useSearchParams();
    const currentLane = searchParams.get("name");
    const [filteredLaneMap, setFilteredLaneMap] = useState<Map<string, LaneMapEntry>>(null);

    console.log("Lane name:", currentLane)
    let newMap = new Map<string, LaneMapEntry>();
    newMap.set(currentLane, laneMap.get(currentLane));

    useEffect(()=>{

    },[laneMap])

    return (
        <Stack spacing={2} direction={"column"}>
          <Grid item spacing={2}>
            <BackButton/>
          </Grid>
          <Grid item spacing={2}>
            <Typography variant="h4">Lane View</Typography>
          </Grid>
          <Grid item container spacing={2} sx={{ width: "100%" }}>
            <Paper variant='outlined' sx={{ width: "100%"}}>
              <LaneStatus laneName={currentLane}/>
            </Paper>
          </Grid>
          <Grid item container spacing={2} sx={{ width: "100%" }}>
            <Paper variant='outlined' sx={{ width: "100%" }}>
              <Media laneName={currentLane} />
            </Paper>
          </Grid>
          <Grid item container spacing={2} sx={{ width: "100%" }}>
            <Paper variant='outlined' sx={{ width: "100%" }}>
              {/*<AlarmTable laneName={currentLane} />*/}
                <Table2 tableMode={'eventlog'} laneMap={newMap} viewLane viewSecondary viewAdjudicated viewMenu/>
            </Paper>
          </Grid>
        </Stack>
  );
}
