import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { Box, TextField, Typography } from "@mui/material";
import { fetchLineChartData } from "../../config/api";

const LineChart = () => {
  const startDate = new Date();
  const endDate = new Date();

  startDate.setDate(startDate.getDate() - 7);
  const startDefaultDate = startDate.toISOString().substr(0, 10);

  const endDefaultDate = endDate.toISOString().substr(0, 10);

  const [dateChange, setDateChange] = useState({
    start_date: startDefaultDate,
    end_date: endDefaultDate,
  });

  const [lineChartData, setLineChartData] = useState([]);

  const handleDate = (e, field) => {
    setDateChange((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const fetchData = async () => {
    const params = {
      start_date: dateChange.start_date,
      end_date: dateChange.end_date,
    };
    const res = await fetchLineChartData(params);
    if (res.ok) {
      setLineChartData(res.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dateChange]);

  const getOption = () => {
    const categories = [
      ...new Set(lineChartData.map((purchase) => purchase.category_name)),
    ];

    const seriesData = categories.map((category) => {
      const data = lineChartData
        .filter((purchase) => purchase.category_name === category)
        .map((purchase) => ({
          value: purchase.cost,
          date: purchase.updated_at,
          purchase_number: purchase.purchase_number,
        }));

      return {
        name: category,
        type: "line",
        data: data,
      };
    });

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          if (params.length > 0) {
            const { seriesName, value, data } = params[0];
            const formattedDate = new Date(data.date).toLocaleDateString();
            const formattedValue = new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(value);
            const purchaseNumber = data.hasOwnProperty("purchase_number")
              ? `Purchase Number: PO-${data.purchase_number}`
              : "";
            return ` ${seriesName}<br/> ${purchaseNumber}<br/> Total Cost: ${formattedValue}<br/>Date of Purchase: ${formattedDate}`;
          }
          return "";
        },
      },
      legend: {
        data: categories,
        selectedMode: "single",
      },
      xAxis: {
        type: "category",
        axisLabel: {
          formatter: "",
        },
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
      series: seriesData,
    };

    return option;
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={2}
        sx={{ gap: "10px" }}
      >
        <TextField
          id="start-date-picker"
          label="Start Date"
          type="date"
          value={dateChange.start_date}
          onChange={(e) => handleDate(e, "start_date")}
          InputLabelProps={{
            shrink: true,
            style: {
              color: "#000000",
              marginTop: "-5px",
            },
          }}
          inputProps={{
            style: {
              color: "#000000",
              width: "130px",
              height: "5px",
              border: "solid 1px #000000",
            },
          }}
        />
        <Typography>to</Typography>
        <TextField
          id="end-date-picker"
          label="End Date"
          type="date"
          value={dateChange.end_date}
          onChange={(e) => handleDate(e, "end_date")}
          InputLabelProps={{
            shrink: true,
            style: {
              color: "#000000",
              marginTop: "-5px",
            },
          }}
          inputProps={{
            style: {
              color: "#000000",
              width: "130px",
              height: "5px",
              border: "solid 1px #000000",
            },
          }}
        />
      </Box>
      <ReactEcharts option={getOption()} className="line-chart" />
    </Box>
  );
};

export default LineChart;
