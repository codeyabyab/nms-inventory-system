import { React, Fragment } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { EditRounded, Add, Search } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import SnackBar from "../../components/SnackBar";
import UpdateCatAndSubcatDialog from "../../components/Categories/UpdateCatAndSubCatDialog";
import AddCatAndSubcatDialog from "../../components/Categories/AddCatAndSubcatDialog";
import DialogBox from "../../components/DialogBox";
import CircularProgress from "@mui/material/CircularProgress";
import CustomToolbar from "../../components/CustomToolbar";
import { useNavigate } from "react-router-dom";
import { fetchCategoryAndSubcategory } from "../../config/api";
import { largePaperSize } from "../../components/style";

const Categories = () => {
  const [categorySubcategory, setCategorySubCategory] = useState([]);
  const [openDialogBox, setOpenDialogBox] = useState(false); //Open DialogBox
  const [dialogType, setDialogType] = useState(); //set dialogBox type
  const [editCatandSub, setEditCatandSub] = useState([]);

  //PAGINATION
  const [totalItems, setTotalItems] = useState(null);

  const [initialValue, setInitialValue] = useState({
    searchValue: "",
    pagination: {
      page: 0,
      pageSize: 10,
    },
  });

  const [snackBarInitialValue, setSnackBarInitialValue] = useState({
    openSnackbar: false,
    snackbarSeverity: "success",
    snackbarMessage: "",
  });

  //Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const [debouncedSearchItem, setDebouncedSearchItem] = useState("");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchItem(initialValue.searchValue);
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [initialValue.searchValue]);

  //handleClick for Category
  const handleOpenSubCategory = (type) => {
    setOpenDialogBox(true);
    setDialogType(type);
  };

  //Snack Bar
  const handleSnackbar = (open, severity, message) => {
    setSnackBarInitialValue((prevValue) => ({
      ...prevValue,
      openSnackbar: open,
      snackbarSeverity: severity,
      snackbarMessage: message,
    }));

    setTimeout(() => {
      setSnackBarInitialValue((prevValue) => ({
        ...prevValue,
        openSnackbar: false,
      }));
    }, 3000);
  };

  const handleUpdateSubCategory = (rowData, type) => {
    const editCategoryandSubcategory = [];

    const category = rowData.row.category;
    editCategoryandSubcategory.category = category;

    const subCategory = rowData.row.subCategory;
    editCategoryandSubcategory.subCategory = subCategory;

    setEditCatandSub(editCategoryandSubcategory);
    setOpenDialogBox(true);
    setDialogType(type);
  };

  const navigate = useNavigate();


  const handleClose = () => {
    setOpenDialogBox(false);
    CategoryAndSubCategoryData();
  };

  const CategoryAndSubCategoryData = async () => {
    setDataFetched(false);
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set("page", initialValue.pagination.page + 1);
    params.set("perPage", initialValue.pagination.pageSize);
    params.set("search", initialValue.searchValue);

    const categoryAndSubcategoryResponse = await fetchCategoryAndSubcategory(
      params
    );
    if (categoryAndSubcategoryResponse.ok) {
      setCategorySubCategory(
        categoryAndSubcategoryResponse.data.categories.data
      );
      setTotalItems(categoryAndSubcategoryResponse.data.categories.total);
      setDataFetched(true);
      setIsLoading(false);
    } 
  };

  useEffect(() => {
    CategoryAndSubCategoryData();
    setDataFetched(true);
    setIsLoading(false);
  }, [
    initialValue.pagination.pageSize,
    initialValue.pagination.page,
    debouncedSearchItem,
  ]);

  //Search Category and Subcategory
  const handleSearchChange = (event) => {
    setInitialValue((prevValue) => ({
      ...prevValue,
      searchValue: event.target.value,
    }));
  };

  const handlePaginationModelChange = (newPagination) => {
    setInitialValue((prevValue) => ({
      ...prevValue,
      pagination: newPagination,
    }));
  };

  const columnsCategoryAndSubCategory = [
    {
      field: "category",
      headerName: "Category",
      headerClassName: "headercolor",
      flex: 1,
      type: "text",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "subCategory",
      headerName: "Subcategory",
      headerClassName: "headercolor",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
  ];

  columnsCategoryAndSubCategory.push({
    field: "action",
    headerName: "Action",
    sortable: false,
    headerAlign: "center",
    headerClassName: "headercolor",
    flex: 1,
    renderCell: (cellValues) => {
      return (
        <Box sx={{ margin: "auto" }}>
            <Tooltip title="Update Category or Subcategory">
              <IconButton
                color="info"
                onClick={(e) => {
                  handleUpdateSubCategory(
                    cellValues,
                    "Update Category or Subcategory"
                  );
                }}
              >
                <EditRounded />
              </IconButton>
            </Tooltip>
        </Box>
      );
    },
  });

  return (
    <Fragment>
      {/* HEADERNAME COLOR */}
      <Fragment>
        {/* ----BUTTON ADD CATEGORY------------------- */}
        <Paper sx={{ borderRadius: "20px" }}>
          <CustomToolbar>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <Button
                  color="info"
                  variant="contained"
                  onClick={() =>
                    handleOpenSubCategory("Add Category or Sub Category")
                  }
                >
                  <Add /> Add Category or Subcategory
                </Button>
              </Grid>
              <Grid item xs={12} sm={7} md={5}></Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  value={initialValue.searchValue}
                  onChange={handleSearchChange}
                  id="Search Category and Subcategory"
                  type="Search"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  label="Search Category or Sub-Category"
                  size="small"
                />
              </Grid>
            </Grid>
          </CustomToolbar>
          <Box>
            <Paper sx={largePaperSize}>
              <DataGrid
                sx={{
                  border: 0,
                }}
                rows={categorySubcategory}
                columns={columnsCategoryAndSubCategory}
                rowCount={totalItems || 0}
                paginationModel={initialValue.pagination}
                paginationMode="server"
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[10, 25, 50, 75, 100]}
                loading={isLoading && !dataFetched}
                overlay={
                  isLoading &&
                  !dataFetched && <CircularProgress color="loading" />
                }
              />
            </Paper>
          </Box>
        </Paper>
        {/* --DIALOG BOX--*/}
        <DialogBox
          open={openDialogBox}
          maxWidth="md"
          onClose={handleClose}
          title={dialogType}
        >
          {dialogType == "Add Category or Sub Category" ? (
            <AddCatAndSubcatDialog
              snackBarData={handleSnackbar}
              onClose={handleClose}
            />
          ) : (
            <UpdateCatAndSubcatDialog
              data={editCatandSub}
              snackBarData={handleSnackbar}
              onClose={handleClose}
            />
          )}
        </DialogBox>
        {/* -------------SNACKBAR-------------- */}
        <SnackBar
          open={snackBarInitialValue.openSnackbar}
          severity={snackBarInitialValue.snackbarSeverity}
          message={snackBarInitialValue.snackbarMessage}
        />
      </Fragment>
    </Fragment>
  );
};
export default Categories;
