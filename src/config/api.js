import { create } from "apisauce";

const api = create({
  baseURL: "",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.addRequestTransform((request) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  request.headers.Authorization = `Bearer ${token}`;
});

api.addResponseTransform((response) => {
  if (!response.ok) {
    localStorage.removeItem("ACCESS_TOKEN");
  }
});

// Dashboard
export const fetchItemsOnStock = () => api.get("/api/dashboard/items/on-stock");
export const fetchItemsOutOfStock = () =>
  api.get("/api/dashboard/items/out-of-stock");
export const fetchPendingRequests = () =>
  api.get("/api/dashboard/purchase/pending");
export const fetchApprovedOrders = () =>
  api.get("/api/dashboard/purchase/approved");
export const fetchWeeklySpendings = () => api.get("/api/dashboard/weekly/cost");
export const fetchMonthlySpendings = () =>
  api.get("/api/dashboard/monthly/cost");
export const fetchAnnualSpendings = () =>
  api.get("/api/dashboard/annualy/cost");
export const fetchLineChartData = (params) =>
  api.get("/api/dashboard/linechart-data", params);

// Menu
export const fetchMenuList = () => api.get("/api/menus");
export const updateMenu = (values) => api.put("/api/menus/update", values);

// Items
export const fetchItemsList = (params) =>
  api.get(`/api/item-list?${params.toString()}`);
export const fetchCategoriesList = () => api.get("/api/categories-list");
export const fetchSubCategoriesList = (category) =>
  api.get(`/api/sub-categories-list?category=${category}`);
export const updateSingleItem = () => api.get("/api/items/items/use");
export const updateMultipleItems = (values) =>
  api.put("/api/items/quantity/multiple", values);
export const fetchItemsForPurchase = (values) =>
  api.get(`/api/items-list/for-purchase?categoryId=${values}`);
export const updateItemQuantity = (values) =>
  api.put("/api/items/quantity", values);
export const fetchReportsList = (params) =>
  api.get(`/api/logs-list?${params.toString()}`);
export const updateItemDetails = (values) =>
  api.put("/api/items/update", values);

// Categories
export const fetchCategoryAndSubcategory = (params) =>
  api.get(`/api/category/get?${params.toString()}`, params);
export const createCategory = (values) =>
  api.post("/api/category/create", values);
export const fetchCategory = () => api.get("/api/category");
export const updateCategorySubCategory = (values) =>
  api.put("/api/category/subcategory/update", values);
export const fetchCategoryForRepurchase = (id) =>
  api.get(`/api/sub-categories-list/for-repurchase?categoryId=${id}`);

// Units
export const fetchUnit = (params) => api.get(`/api/units?${params.toString()}`);
export const fetchUnitsForPurchase = () =>
  api.get("/api/units-list/for-purchase");
export const createUnit = (name, unit_abbreviation) =>
  api.post("/api/units/create", name, unit_abbreviation);
export const updateUnit = (id, name, unit_abbreviation) =>
  api.put("/api/units/update", id, name, unit_abbreviation);
export const fetchUnitsforItems = () => api.get("/api/units/get");

// Requests
export const fetchPurchaseRequests = (params) =>
  api.get(`/api/purchase-requests?${params.toString()}`);
export const createPurchaseRequest = (purchases) =>
  api.post("/api/create-purchase-request", purchases);
export const fetchPurchasesForRequests = (purchaseId) =>
  api.get(`/api/purchase-list/for-purchase/${purchaseId}`, purchaseId);
export const updatePurchaseRequest = (values) =>
  api.put("/api/update-purchase-request", values);
export const rejectPurchaseRequest = (values) =>
  api.put("/api/reject-purchase-request", values);

// Orders
export const fetchPurchaseOrders = (params) =>
  api.get(`/api/purchase-orders?${params.toString()}`);
export const fetchPurchaseOrderById = (purchaseId) =>
  api.get(`/api/purchase-list/for-purchase-order/${purchaseId}`);
export const fetchPurchaseOrderList = (purchaseId) =>
  api.get(`/api/purchase-list/purchase-order/${purchaseId}`);
export const fetchReceiptForOrders = (purchaseId) =>
  api.get(`/api/receipt-list/purchase-order/${purchaseId}`);
export const updatePurchaseOrder = (values) =>
  api.put("/api/update-purchase-order", values);
export const cancelPurchaseOrder = (values) =>
  api.put("/api/cancel-purchase-order", values);

// Users HTTP request
export const getUser = () => api.get("/api/user");
export const getUserTheme = (theme) => api.put("/api/user/theme", theme);
export const fetchUsers = (params) =>
  api.get(`/api/user/list?${params.toString()}`);
export const createUsers = (values) => api.post("/api/user/create", values);
export const editUsers = (values) => api.put("/api/user/edit", values);
export const editUserProfile = (userDetails, passwordDetails) =>
  api.put("/api/user/update", userDetails, passwordDetails);
export const deactivateUser = (id) => api.post("/api/user/deactivate", id);
export const reactivateUser = (id) => api.post("/api/user/reactivate", id);

export default api;
