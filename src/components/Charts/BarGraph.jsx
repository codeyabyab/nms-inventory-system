import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { Button, Box, Grid } from "@mui/material";
import { buttonRightBarGraph } from "../style";
import {
  fetchWeeklySpendings,
  fetchMonthlySpendings,
  fetchAnnualSpendings,
} from "../../config/api";

const BarGraph = () => {
  const [categoryWeeklyCost, setCategoryWeeklyCost] = useState([]);
  const [categoryMonthlyCost, setCategoryMonthlyCost] = useState([]);
  const [categoryWAnnualyCost, setCategoryAnnualyCost] = useState([]);

  const weeklyData = {
    categories: categoryWeeklyCost.map((category) => category.name),
    series: [
      {
        color: ["#6f2da8", "#ff4545", "#ff7300"],
        data: categoryWeeklyCost.map((item) => item.total_cost),
      },
    ],
  };

  const monthlyData = {
    categories: categoryMonthlyCost.map((category) => category.name),
    series: [
      {
        color: ["#6f2da8", "#ff4545", "#ff7300"],
        data: categoryMonthlyCost.map((item) => item.total_cost),
      },
    ],
  };

  const annualData = {
    categories: categoryWAnnualyCost.map((category) => category.name),
    series: [
      {
        color: ["#6f2da8", "#ff4545", "#ff7300"],
        data: categoryWAnnualyCost.map((item) => item.total_cost),
      },
    ],
  };

  const getCategoryWeeklyCost = async () => {
    const response = await fetchWeeklySpendings();
    if (response.ok) {
      setCategoryWeeklyCost(response.data.categoryWeekly);
    }
  };

  const getCategoryMonthlyCost = async () => {
    const response = await fetchMonthlySpendings();
    if (response.ok) {
      setCategoryMonthlyCost(response.data.categoryMonthly);
    }
  };

  const getCategoryAnnualyCost = async () => {
    const response = await fetchAnnualSpendings();
    if (response.ok) {
      setCategoryAnnualyCost(response.data.categoryAnnualy);
    }
  };

  useEffect(() => {
    getCategoryWeeklyCost();
    getCategoryMonthlyCost();
    getCategoryAnnualyCost();
  }, []);

  const [selectedFilter, setSelectedFilter] = useState("weekly");
  const selectedData =
    selectedFilter === "weekly"
      ? weeklyData
      : selectedFilter === "monthly"
      ? monthlyData
      : annualData;

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const options = {
    xAxis: {
      type: "category",
      data: selectedData.categories,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => {
          const formattedValue = Number.isInteger(value)
            ? value >= 1000000000000
              ? (value / 1000000000000).toFixed(0) + "T"
              : value >= 1000000000
              ? (value / 1000000000).toFixed(0) + "B"
              : value >= 1000000
              ? (value / 1000000).toFixed(0) + "M"
              : value >= 1000
              ? (value / 1000).toFixed(0) + "K"
              : value
            : value >= 1000000000000
            ? (value / 1000000000000).toFixed(1) + "T"
            : value >= 1000000000
            ? (value / 1000000000).toFixed(1) + "B"
            : value >= 1000000
            ? (value / 1000000).toFixed(1) + "M"
            : value >= 1000
            ? (value / 1000).toFixed(1) + "K"
            : value;

          return "₱" + formattedValue;
        },
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        let categoryName = params[0].name;
        let value = params[0].value;
        let formattedValue = new Intl.NumberFormat("en-PH").format(value);
        return `${categoryName} | Total Expenses: ₱${formattedValue}`;
      },
    },

    series: selectedData.series.map((s) => ({
      name: s.name,
      type: "bar",
      data: s.data,
      itemStyle: {
        color: (params) => s.color[params.dataIndex % s.color.length],
      },
    })),
  };

  return (
    <Box sx={buttonRightBarGraph}>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item>
          <Button
            variant={selectedFilter === "weekly" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("weekly")}
          >
            This Week
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedFilter === "monthly" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("monthly")}
          >
            This Month
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedFilter === "annual" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("annual")}
          >
            This Year
          </Button>
        </Grid>
      </Grid>
      <ReactEcharts option={options} />
    </Box>
  );
};
export default BarGraph;
