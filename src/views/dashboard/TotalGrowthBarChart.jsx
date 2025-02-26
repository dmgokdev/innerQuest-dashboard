import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { apiGet } from 'services/useAuth';
import apiurl from 'constant/apiurl';

// Initial Chart Data
const initialChartData = {
  height: 480,
  type: 'bar',
  options: {
    chart: {
      id: 'bar-chart',
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      type: 'category',
      categories: []
    },
    legend: {
      show: true,
      fontFamily: `'Roboto', sans-serif`,
      position: 'bottom',
      offsetX: 20,
      labels: { useSeriesColors: false },
      markers: { width: 16, height: 16, radius: 5 },
      itemMargin: { horizontal: 15, vertical: 8 }
    },
    fill: { type: 'solid' },
    dataLabels: { enabled: false },
    grid: { show: true }
  },
  series: []
};

const TotalGrowthBarChart = ({ isLoading }) => {
  const [chartData, setChartData] = useState(initialChartData);
  const theme = useTheme();

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;
  const textPrimary = theme.palette.text.primary;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const fetchChartData = async () => {
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}users/dashboard`;
        const response = await apiGet(URL, {}, token);

        if (response?.data?.payload?.earnings?.length) {
          const { categories, earnings } = response.data.payload.earnings[0];
          console.log(categories, earnings);

          const numericEarnings = earnings.map((amount) => parseFloat(amount.replace('$', '')));

          const updatedChartData = {
            ...initialChartData,
            options: {
              ...initialChartData.options,
              colors: [primary200, primaryDark, secondaryMain, secondaryLight],
              xaxis: { ...initialChartData.options.xaxis, categories },
              yaxis: {
                labels: {
                  style: { colors: [textPrimary] }
                }
              },
              grid: { borderColor: divider },
              tooltip: { theme: 'light' },
              legend: { labels: { colors: grey500 } }
            },
            series: [
              {
                name: 'Monthly Earnings',
                data: numericEarnings
              }
            ]
          };

          setChartData(updatedChartData);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchChartData();
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Growth</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">
                        {chartData.series[0]?.data?.reduce((acc, value) => acc + value, 0).toFixed(2) || '$0.00'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                '& .apexcharts-menu.apexcharts-menu-open': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              <Chart {...chartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
