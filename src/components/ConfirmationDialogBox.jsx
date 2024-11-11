import React, { Fragment, useState } from "react";
import {
  Button, Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography
} from "@mui/material";

const ConfirmationDialogBox = ({ open, onClose, save, id, value }) => {

  const [textFieldValue, setTextFieldValue] = useState('');

  const handleReset = () => {
    setTextFieldValue("");
  };

  const handleTextFieldChange = (event) => {
    const text = event.target.value;
    setTextFieldValue(text);
    value(text);
  };
  const characterCount = textFieldValue.length;
  const remainingCharacters = 50 - characterCount;

  return (
    <Fragment>
      <Dialog open={open} fullWidth maxWidth={"xs"}>
        <DialogContent>
          <Typography textAlign="center">
            Do you want to proceed?
          </Typography>
          {id === "delete" &&
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label={`Add REMARKS to proceed (${characterCount}/50)`}
              variant="outlined"
              value={textFieldValue}
              onChange={handleTextFieldChange}
              onBlur={handleReset}
              sx={{ mt: 2 }}
            />
          }
        </DialogContent>
        <DialogActions>
          

          <Button
            variant="contained"
            color={id == "logout" ? "error" : "success"}
            onClick={save}
            fullWidth
          >
            {id == "logout" ? "Logout" : "Confirm"}
          </Button>
          <Button
            variant="text"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
export default ConfirmationDialogBox;
