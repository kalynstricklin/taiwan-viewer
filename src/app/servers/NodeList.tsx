/*
 * Copyright (c) 2024.  Botts Innovative Research, Inc.
 * All Rights Reserved
 */

import {useSelector} from "react-redux";
import {selectNodes, removeNode} from "@/lib/state/OSHSlice";
import {RootState} from "@/lib/state/Store";
import {Box, Button, Card, ListSubheader, Stack} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {INode} from "@/lib/data/osh/Node";
import {SpaceBarRounded} from "@mui/icons-material";
import {Span} from "next/dist/server/lib/trace/tracer";
import {useAppDispatch} from "@/lib/state/Hooks";

interface NodeListProps {
    modeChangeCallback?: (editMode: boolean, editNode: INode) => void
}

export default function NodeList({modeChangeCallback}: NodeListProps) {
    const dispatch = useAppDispatch();
    const nodes = useSelector((state: RootState) => selectNodes(state));

    const setEditNode = (editNode: INode) => {
        modeChangeCallback(true, editNode);
    }

    const deleteNode = (nodeID: number) => {
        dispatch(removeNode(nodeID));
        modeChangeCallback(false, null);
    }

    return (
        <Box sx={{width: '100%'}}>
            <p>Nodes:</p>
            {nodes.length === 0 ? (
                <p>No Nodes</p>
            ) : (
                <List>
                    {nodes.map((node: INode) => (
                        <Card key={node.id}>
                            <ListItem sx={{m: 0}}>
                                <ListItemText primary={node.name} secondary={node.address}/>
                                <Button variant="contained" size={"small"} color="primary" sx={{m: 1}}
                                        onClick={() => setEditNode(node)}>Edit</Button>
                                <Button variant="contained" size={"small"} color="secondary" sx={{m: 1}}
                                        onClick={() => deleteNode(node.id)}>Delete</Button>
                            </ListItem>
                        </Card>
                    ))}
                </List>
            )}
        </Box>
    )
}
