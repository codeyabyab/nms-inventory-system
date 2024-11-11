import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import LineChart from "../../components/Charts/LineChart";
import BarGraph from "../../components/Charts/BarGraph";
import CustomCard from "../../components/CustomCard";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    itemsOnStock: "",
    itemsOutOfStock: "",
    pendingRequests: "",
    approvedOrders: "",
  });

  const fetchData = async () => {
    const [
      itemsOnStockResponse,
      itemsOutOfStockResponse,
      pendingRequestsResponse,
      approvedOrdersResponse,
    ] = await Promise.all([
      fetchItemsOnStock(),
      fetchItemsOutOfStock(),
      fetchPendingRequests(),
      fetchApprovedOrders(),
    ]);
    const newDashboardData = {};

    if (itemsOnStockResponse.ok) {
      newDashboardData.itemsOnStock = itemsOnStockResponse.data.count;
    }

    if (itemsOutOfStockResponse.ok) {
      newDashboardData.itemsOutOfStock = itemsOutOfStockResponse.data.count;
    }

    if (pendingRequestsResponse.ok) {
      newDashboardData.pendingRequests = pendingRequestsResponse.data;
    }

    if (approvedOrdersResponse.ok) {
      newDashboardData.approvedOrders = approvedOrdersResponse.data;
    }

    setDashboardData((prevData) => ({ ...prevData, ...newDashboardData }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Fragment>
      <Box
        sx={{
          marginTop: {
            xs: "70px",
            md: "0",
          },
        }}
      >
        <Typography fontWeight={"bold"} fontSize="large">
          Welcome, Tester!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography>On Stock Items</Typography>
                <Typography variant="h4" textAlign="center">
                  {dashboardData.itemsOnStock ? dashboardData.itemsOnStock : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography>Out of Stock Items</Typography>
                <Typography variant="h4" textAlign="center">
                  {dashboardData.itemsOutOfStock
                    ? dashboardData.itemsOutOfStock
                    : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography>Pending Requests</Typography>
                <Typography variant="h4" textAlign="center">
                  {dashboardData.pendingRequests
                    ? dashboardData.pendingRequests
                    : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography>Orders to be Reviewed</Typography>
                <Typography variant="h4" textAlign="center">
                  {dashboardData.approvedOrders
                    ? dashboardData.approvedOrders
                    : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomCard>
              <Typography fontWeight="bold" color="text.tertiary">
                Expenditure Summary
              </Typography>
              <BarGraph />
            </CustomCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomCard>
              <Typography fontWeight="bold" color="text.tertiary">
                Expenditure Trend
              </Typography>
              <LineChart />
            </CustomCard>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default Dashboard;
