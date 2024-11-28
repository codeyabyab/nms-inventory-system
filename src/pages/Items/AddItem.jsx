import {
    Button,
    Grid,
    TextField,
    Autocomplete,
    Tooltip,
    IconButton,
    Typography,
    Box,
    Paper,
    TablePagination,
  } from "@mui/material";
  import React, { useEffect, useState, useRef, Fragment } from "react";
  import api, {
    fetchUnitsForPurchase,
    createPurchaseRequest,
    fetchSubCategoriesList,
  } from "../../config/api";
  import { Delete, Add } from "@mui/icons-material";
  import ConfirmationButtons from "../../components/ConfirmationButtons";
  import {
    centerContents,
    hiddenOnDesktop,
    hiddenOnMobile,
    marginTopInMobileAndPc,
  } from "../../components/style";
  import SnackBar from "../../components/SnackBar";
  import { addItemPaper, purchaseRequestPaper } from "../../components/customizedComponentStyle";
  
  
  const AddItem = () => {
    const [units, setUnits] = useState([]);
    const [confirmationButtons, setConfirmationButtons] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(20);
    const [items, setItems] = useState(
      JSON.parse(localStorage.getItem("item")) || [{
          itemName: "",
          price: "",
          unitId: "",
          categoryId: "",
          quantity: "",
        },]
    );
  
    const resetItems = () => {
      setItems([
        {
          itemName: "",
          price: "",
          unitId: "",
          categoryId: "",
          quantity: "",
        },
      ]);
      localStorage.removeItem("item");
    };
  
    const handlePageClick = (page) => {
      setCurrentPage(page);
    };
  
    const handleChangeRowsPerPage = (event) => {
      const newRowsPerPage = event.target.value;
      setPerPage(newRowsPerPage);
      setCurrentPage(0);
    };
  
    const returnIndex = (index) => {
      return perPage * (currentPage + 1) - perPage + index;
    };
  
    const [snackBarInitialValue, setSnackBarInitialValue] = useState({
      openSnackbar: false,
      snackbarSeverity: "success",
      snackbarMessage: "",
    });
  
    const snackBarData = (open, severity, message) => {
      setSnackBarInitialValue((prevValue) => ({
        ...prevValue,
        snackbarMessage: message,
        snackbarSeverity: severity,
        openSnackbar: open,
      }));
      setTimeout(() => {
        setSnackBarInitialValue((prevValue) => ({
          ...prevValue,
          openSnackbar: false,
        }));
      }, 3000);
    };
  
    const handleSave = () => {
      setConfirmationButtons(true);
    };
  
    const fetchUnits = async () => {
      const response = await fetchUnitsForPurchase();
      if (response.ok) {
        setUnits(response.data.units);
      }
    };
  
    const fetchSubCategories = async () => {
      const response = await fetchSubCategoriesList();
      if (response.ok) {
        setSubCategories(response.data.categories);
      }
    };
  
    useEffect(() => {
      fetchUnits();
      fetchSubCategories();
    }, []);
  
    const handleAddClick = () => {
      setItems([
        ...items,
        {
          itemName: "",
          price: "",
          unitId: "",
          categoryId: "",
          quantity: "",
          status: false,
        },
      ]);
    };
  
    const handleRemoveClick = (index) => {
      const newPurchases = [...items];
      newPurchases.splice(index, 1);
      setItems(newPurchases);
    };
  
    const handlePurchaseUpdate = (index, field, value) => {
      const updatedItems = {
        ...items[index],
        [field]: field === "itemName"
        ? value.replace(/\b\w/g, (c) => c.toUpperCase())
        : value,
      };
  
      const updatedItemsList = [...items];
      updatedItemsList[index] = updatedItems;
      setItems(updatedItemsList);
      localStorage.setItem("item", JSON.stringify(updatedItemsList));
    };
  
    const handleSaveClick = async (event) => {
      setIsLoading(true);
      event.preventDefault();
      const response = await api.post("/api/item/add",{
        items,
      });
      if (response.ok) {
        setConfirmationButtons(false);
        snackBarData(true, "success", response.data.message);
        setIsLoading(false);
        resetItems();
      } else {
        setIsLoading(false);
        setConfirmationButtons(false);
        snackBarData(true, "error", response.data.error);
      }
    };
  
    const paperRef = useRef(null);
  
    useEffect(() => {
      if (paperRef.current) {
        paperRef.current.scrollTop = paperRef.current.scrollHeight;
      }
    }, [items]);
  
    return (
      <Fragment>
        <Box sx={marginTopInMobileAndPc} padding={1}>
          <Paper sx={{ borderRadius: "20px" }}>
            <Paper sx={addItemPaper} ref={paperRef}>
              {isLoading ? (
                <LoadingPage />
              ) : (
                <Box>
                  {items
                    .slice(currentPage * perPage, (currentPage + 1) * perPage)
                    .map((item, index) => (
                      <Fragment key={index}>
                        <Box
                          sx={{ ...centerContents, marginTop: index > 0 ? 2 : 0 }}
                        >
                          <Typography marginRight={1}>
                            {returnIndex(index + 1)}
                          </Typography>
                          <Paper
                            sx={{
                              width: "100%",
                              gap: "2",
                            }}
                          >
                            <Grid
                              container
                              marginTop={1}
                              padding={2}
                              paddingBottom={0}
                            >
                              <Grid
                                container
                                item
                                spacing={1}
                                xs={12}
                                md={11}
                                lg={11}
                              >
                                <Grid item marginBottom={1} xs={12} md={6} lg={4}>
                                <TextField
                                    size="small"
                                    label="Item Name"
                                    value={item.itemName}
                                    fullWidth
                                    onChange={(event) =>
                                      handlePurchaseUpdate(
                                        returnIndex(index),
                                        "itemName",
                                        event.target.value
                                      )
                                    }
                                  />
                                </Grid>
  
                                <Grid item marginBottom={1} xs={12} md={6} lg={4}>
                                  <Autocomplete
                                    options={subCategories}
                                    fullWidth
                                    getOptionLabel={(option) => option.name}
                                    value={
                                      subCategories.find(
                                        (option) =>
                                          option.id === item.categoryId
                                      ) || { name: "", value: "" }
                                    }
                                    onChange={(event, newValue) => {
                                      handlePurchaseUpdate(
                                        returnIndex(index),
                                        "categoryId",
                                        newValue ? newValue.id : ""
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        label={"Category"}
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </Grid>
  
                                <Grid item marginBottom={1} xs={12} md={6} lg={4}>
                                  <TextField
                                    size="small"
                                    label="Estimated Price"
                                    value={item.price}
                                    fullWidth
                                    onChange={(e) =>
                                      handlePurchaseUpdate(
                                        returnIndex(index),
                                        "price",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Grid>
  
                                <Grid item marginBottom={1} xs={12} md={6} lg={4}>
                                  <TextField
                                    size="small"
                                    label="Quantity"
                                    value={item.quantity}
                                    fullWidth
                                    onChange={(e) =>
                                      handlePurchaseUpdate(
                                        returnIndex(index),
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Grid>
  
                                <Grid item marginBottom={1} xs={12} md={6} lg={4}>
                                  <Autocomplete
                                    size="small"
                                    fullWidth
                                    options={units}
                                    getOptionLabel={(option) => option.name}
                                    value={
                                      units.find(
                                        (option) => option.id === item.unitId
                                      ) || {
                                        name: "",
                                        value: "",
                                      }
                                    }
                                    onChange={(event, newValue) => {
                                      handlePurchaseUpdate(
                                        returnIndex(index),
                                        "unitId",
                                        newValue ? newValue.id : ""
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        label={"Unit"}
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </Grid>
  
                                <Grid
                                  item
                                  marginBottom={1}
                                  xs={10}
                                  sm={11}
                                  md={6}
                                  lg={4}
                                >
                                  <TextField
                                    size="small"
                                    label="Amount"
                                    value={(
                                      item.price * item.quantity
                                    ).toFixed(2)}
                                    fullWidth
                                    disabled={true}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  marginBottom={1}
                                  xs={2}
                                  sm={1}
                                  md={6}
                                  lg={4}
                                  sx={hiddenOnDesktop}
                                >
                                  <Tooltip title="Remove Item">
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleRemoveClick(returnIndex(index))
                                      }
                                      style={{
                                        visibility:
                                          items.length === 1
                                            ? "hidden"
                                            : "visible",
                                      }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </Grid>
                              </Grid>
  
                              <Grid
                                container
                                alignItems={"center"}
                                item
                                xs={12}
                                md={11}
                                lg={1}
                              >
                                <Grid
                                  item
                                  xs={1}
                                  md={1}
                                  lg={5}
                                  sx={hiddenOnMobile}
                                >
                                  <Tooltip title="Remove Item">
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleRemoveClick(returnIndex(index))
                                      }
                                      style={{
                                        visibility:
                                          items.length === 1
                                            ? "hidden"
                                            : "visible",
                                      }}
                                      sx={{
                                        mb: 4,
                                        "&:hover": {
                                          background: "none",
                                        },
                                      }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </Grid>
  
                                {returnIndex(index) === items.length - 1 && (
                                  <Grid item xs={1} md={1} lg={6}>
                                    <Tooltip title="Add Row">
                                      <Button
                                        size="small"
                                        color="info"
                                        variant="contained"
                                        onClick={handleAddClick}
                                        sx={{
                                          mb: 4,
                                          "&:hover": {
                                            background: "none",
                                          },
                                        }}
                                      >
                                        <Add />
                                      </Button>
                                    </Tooltip>
                                  </Grid>
                                )}
                              </Grid>
                            </Grid>
                          </Paper>
                        </Box>
                      </Fragment>
                    ))}
                  <Grid container spacing={1}></Grid>
                </Box>
              )}
            </Paper>
  
            <TablePagination
              component={Box}
              count={items.length || 0}
              page={currentPage}
              onPageChange={(event, page) => handlePageClick(page)}
              rowsPerPage={perPage}
              onRowsPerPageChange={(event) => handleChangeRowsPerPage(event)}
              labelRowsPerPage="Per Page"
              rowsPerPageOptions={[10, 20, 30]}
            />
          </Paper>
        </Box>
       
        <Grid container paddingLeft={1} paddingRight={1} paddingBottom={1}>
       
          <Grid item xs={12} md={6} sx={hiddenOnMobile}></Grid>
          <Grid item xs={12} md={6}>
            {confirmationButtons ? (
              <ConfirmationButtons
                loading={isLoading}
                save={(event) => handleSaveClick(event)}
                onClose={() => setConfirmationButtons(false)}
              />
            ) : (
              <Button
                color="success"
                variant="contained"
                onClick={(event) => handleSave()}
                sx={{ float: "right", marginLeft: "10px" }}
              >
                Save
              </Button>
              
            )}
          </Grid>
        </Grid>
           
        
  
        {/* -------------SNACKBAR-------------- */}
        <SnackBar
          open={snackBarInitialValue.openSnackbar}
          severity={snackBarInitialValue.snackbarSeverity}
          message={snackBarInitialValue.snackbarMessage}
        />
      </Fragment>
    );
  };
  
  export default AddItem;
  