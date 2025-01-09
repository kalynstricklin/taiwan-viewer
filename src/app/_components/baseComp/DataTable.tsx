"use client"

import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {ITableData, TableData, TableDataCollection} from "../../../../types/new-types";
import { Box } from '@mui/material';
import CustomToolbar from "@/app/_components/CustomToolbar";

export default function DataTable(props:{
    // tableData: TableDataCollection
}){

    // const data = props.tableData;

    const columns: GridColDef<ITableData>[] = [
        {
            field: 'siteName',
            headerName: 'Site Name',
            type: 'string'
        },
        {
            field: 'extLowTemperature',
            headerName: 'Low Temperature',
            valueFormatter: (value) => {
                return typeof value === 'number' ? value : 0;
            }
        },
        {
            field: 'extHighTemperature',
            headerName: 'High Temperature',
            valueFormatter: (value) => {
                return typeof value === 'number' ? value : 0;
            }
        },
        {
            field: 'precipitation',
            headerName: 'Precipitation',
            valueFormatter: (value) => {
                return typeof value === 'number' ? value : 0;
            }
        },
        {
            field: 'peakGustTime',
            headerName: 'Peak Gust Time',
            valueFormatter: (value) => {
                return typeof value === 'number' ? value : 0;
            }
        },
        {
            field: 'peakGustDirection',
            headerName: 'Peak Gust Direction',
            type: 'string'
        },
        {
            field: 'airTemperature',
            headerName: 'Air Temperature',
            valueFormatter: (value) => {
                return typeof value === 'number' ? value : 0;
            }
        },
    ];



    const rows: TableData[] = [
        { id: 1, siteName: '1', extLowTemperature: 3, extHighTemperature: 5, precipitation: 10, peakGustTime: 32, peakGustDirection: "North", airTemperature: 55,},
        { id: 2, siteName: '1', extLowTemperature: 3, extHighTemperature: 5, precipitation: 10, peakGustTime: 32, peakGustDirection: "North", airTemperature: 55,},
        { id: 3, siteName: '1', extLowTemperature: 3, extHighTemperature: 5, precipitation: 10, peakGustTime: 32, peakGustDirection: "North", airTemperature: 55,},
        { id: 4, siteName: '1', extLowTemperature: 3, extHighTemperature: 5, precipitation: 10, peakGustTime: 32, peakGustDirection: "North", airTemperature: 55,},
        { id: 5, siteName: '1', extLowTemperature: 3, extHighTemperature: 5, precipitation: 10, peakGustTime: 32, peakGustDirection: "North", airTemperature: 55,},
        { id: 6, siteName: '1', extLowTemperature: 3, extHighTemperature: 5, precipitation: 10, peakGustTime: 32, peakGustDirection: "North", airTemperature: 55,},
        { id: 7, siteName: '1', extLowTemperature: 3, extHighTemperature: 5, precipitation: 10, peakGustTime: 32, peakGustDirection: "North", airTemperature: 55,},
        { id: 8, siteName: '1', extLowTemperature: 3, extHighTemperature: 5, precipitation: 10, peakGustTime: 32, peakGustDirection: "North", airTemperature: 55,},
        { id: 9, siteName: '1', extLowTemperature: 3, extHighTemperature: 5, precipitation: 10, peakGustTime: 32, peakGustDirection: "North", airTemperature: 55,},
    ];


    return(
        <Box sx={{height: 500, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 20,
                        },
                    },
                }}
                pageSizeOptions={[20]}
                slots={{toolbar: CustomToolbar}}
                autosizeOnMount
                autosizeOptions={{
                    expand: true,
                    includeOutliers: true,
                    includeHeaders: false,
                }}
            />
        </Box>
    );
}