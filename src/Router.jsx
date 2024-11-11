import { useState, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Categories from "./pages/Categories/Categories"

import Loading from "./pages/Loading/Loading";
import NotFound from "./pages/NotFound/NotFound"


const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard/>
      },
      // {
      //   path: "/items",
      //   element: {Items}
      // },
      // {
      //   path: "/item/add",
      //   element: {addItems}
      // },
      {
        path: "/categories",
        element: <Categories/>
      },
      // {
      //   path: "/units",
      //   element: {Units}
      // },
      // {
      //   path: "/purchase-requests",
      //   element: {PurchaseRequests}
      // },
      // {
      //   path: "/purchase-orders",
      //   element: {PurchaseOrders}
      // },
      // {
      //   path: "/users",
      //   element: {Users}
      // },
      // {
      //   path: "/roles-and-permissions",
      //   element: {RolesAndPermissions}
      // },
      // {
      //   path: "/request-data-grid",
      //   element: {RequestDatagrid}
      // },
      // {
      //   path: "/orders-data-grid",
      //   element: {ViewPurchaseOrders}
      // },
      // {
      //   path: "/report-list",
      //   element: {Report}
      // },
      // {
      //   path: "/create-requests",
      //   element: {CreatePurchaseRequest}
      // },
      // {
      //   path: "/menus",
      //   element: {Menus}
      // },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;
