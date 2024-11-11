import React, { Fragment } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { hiddenOnDesktop, rightContents } from "./style";

const ConfirmationDialogBox = ({ onClose, save, loading }) => {
  return (
    <Fragment>
      <Grid container spacing={1} sx={rightContents}>
        <Grid item xs={4} md={9}>
          <Typography fontWeight={"Bold"}>Do you want to proceed?</Typography>
        </Grid>
        <Grid item xs={4} md={1.5}>
          <Button
            fullWidth
            variant="contained"
            disabled={loading}
            onClick={onClose}
          >
            No
          </Button>
        </Grid>
        <Grid item xs={4} md={1.5}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            disabled={loading}
            onClick={save}
          >
            Yes
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};
export default ConfirmationDialogBox;
