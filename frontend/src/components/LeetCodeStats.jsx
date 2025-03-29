import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Link,
  CircularProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const LeetCodeStats = ({ data }) => {
  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Prepare data for the chart
  const chartData = [
    {
      name: 'Easy',
      solved: data.easy.count,
      submissions: data.easy.submissions
    },
    {
      name: 'Medium',
      solved: data.medium.count,
      submissions: data.medium.submissions
    },
    {
      name: 'Hard',
      solved: data.hard.count,
      submissions: data.hard.submissions
    },
    {
      name: 'Total',
      solved: data.total.count,
      submissions: data.total.submissions
    }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          LeetCode Statistics
        </Typography>
        <Link
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: 'none' }}
        >
          View Profile
        </Link>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box height={400}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" label={{ value: 'Solved', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Submissions', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="solved" name="Solved" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="submissions" name="Submissions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Current Ranking
            </Typography>
            <Typography variant="h3" color="primary">
              #{data.ranking}
            </Typography>
          </Box>
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body1">
              Total Solved: {data.total.count}
            </Typography>
            <Typography variant="body1">
              Total Submissions: {data.total.submissions}
            </Typography>
            <Typography variant="body1">
              Easy: {data.easy.count} ({data.easy.submissions} submissions)
            </Typography>
            <Typography variant="body1">
              Medium: {data.medium.count} ({data.medium.submissions} submissions)
            </Typography>
            <Typography variant="body1">
              Hard: {data.hard.count} ({data.hard.submissions} submissions)
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LeetCodeStats; 