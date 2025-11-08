import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  Button
} from '@mui/material';
import { Memory, Savings, TrendingDown } from '@mui/icons-material';
import { getOptimizationData } from '../services/api';

function ResourceOptimization() {
  const [optimizations, setOptimizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getOptimizationData();
      setOptimizations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch optimization data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSavings = () => {
    const total = optimizations.reduce((acc, opt) => ({
      cpu: acc.cpu + opt.cpuSaving,
      memory: acc.memory + opt.memorySaving,
      count: acc.count + 1
    }), { cpu: 0, memory: 0, count: 0 });

    return {
      cpu: total.cpu,
      memory: total.memory,
      averageCpuPercent: total.count > 0 ? 
        optimizations.reduce((acc, opt) => acc + opt.cpuSavingPercent, 0) / total.count : 0,
      averageMemoryPercent: total.count > 0 ? 
        optimizations.reduce((acc, opt) => acc + opt.memorySavingPercent, 0) / total.count : 0
    };
  };

  const totalSavings = calculateTotalSavings();

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Resource Optimization
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingDown color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Avg CPU Saving
                  </Typography>
                  <Typography variant="h4">
                    {totalSavings.averageCpuPercent.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Memory color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Avg Memory Saving
                  </Typography>
                  <Typography variant="h4">
                    {totalSavings.averageMemoryPercent.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Savings color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Total CPU Saved
                  </Typography>
                  <Typography variant="h4">
                    {totalSavings.cpu}m
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Memory color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Total Memory Saved
                  </Typography>
                  <Typography variant="h4">
                    {totalSavings.memory}MB
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Container Optimization Recommendations
            </Typography>
            <Button variant="outlined" onClick={fetchData}>
              Refresh
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pod/Container</TableCell>
                  <TableCell>Namespace</TableCell>
                  <TableCell>Current CPU</TableCell>
                  <TableCell>Suggested CPU</TableCell>
                  <TableCell>Current Memory</TableCell>
                  <TableCell>Suggested Memory</TableCell>
                  <TableCell>CPU Saving</TableCell>
                  <TableCell>Memory Saving</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {optimizations.map((optimization, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {optimization.pod}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {optimization.container}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{optimization.namespace}</TableCell>
                    <TableCell>{optimization.currentCpu}m</TableCell>
                    <TableCell>{optimization.suggestedCpu}m</TableCell>
                    <TableCell>{optimization.currentMemory}MB</TableCell>
                    <TableCell>{optimization.suggestedMemory}MB</TableCell>
                    <TableCell>
                      <Chip 
                        label={`${optimization.cpuSavingPercent}%`}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${optimization.memorySavingPercent}%`}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" color="primary">
                        Apply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ResourceOptimization;