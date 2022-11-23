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

import Draggable from "react-draggable";
import {Paper, PaperProps} from "@mui/material";
import React from "react";

const DraggablePaperComponent = (props: PaperProps) => {

    return (
        <Draggable handle="#draggable-dialog-title">
            <Paper {...props} />
        </Draggable>
    );
}

export default DraggablePaperComponent;