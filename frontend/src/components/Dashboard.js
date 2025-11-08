import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Speed as PerformanceIcon,
  Timeline as TimelineIcon,
  Memory as ResourceIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getDashboardStats } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data);

      // Generate sample time series data for charts
      const now = new Date();
      const perfData = [];
      const resData = [];
      
      // Generate 7 days of sample data
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        perfData.push({
          date: date.toLocaleDateString(),
          latency: Math.random() * 100 + 20,
          throughput: Math.random() * 1000 + 500
        });

        resData.push({
          date: date.toLocaleDateString(),
          cpu: Math.random() * 50 + 20,
          memory: Math.random() * 60 + 30
        });
      }

      setPerformanceData(perfData);
      setResourceData(resData);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data. Make sure the backend server is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  // StatCard component for displaying metrics
  const StatCard = ({ title, value, subtitle, icon, color, progress, unit }) => (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box flex={1}>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {value}{unit}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {subtitle}
            </Typography>
          </Box>
          <Box color={color} sx={{ fontSize: 48 }}>
            {icon}
          </Box>
        </Box>
        {progress !== undefined && (
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mt: 2, height: 6, borderRadius: 3 }}
            color={progress > 80 ? 'error' : progress > 60 ? 'warning' : 'success'}
          />
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchDashboardData} startIcon={<RefreshIcon />}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Troubleshooting Steps:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography variant="body2">
                  Make sure the backend server is running
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Open PowerShell and run: <code>cd backend; python app.py</code>
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Backend should be running on: http://localhost:5000
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Check that port 5000 is not being used by another application
                </Typography>
              </li>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Performance Engineering Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
        >
          Refresh
        </Button>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Real-time monitoring of CI/CD pipeline performance, test prioritization, and resource optimization
      </Alert>

      {/* Key Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="P95 Latency"
            value={stats?.performance.p95Latency}
            subtitle="Last Performance Run"
            icon={<PerformanceIcon fontSize="inherit" />}
            color={stats?.performance.p95Latency > 50 ? 'error' : 'success'}
            progress={Math.min((stats?.performance.p95Latency / 50) * 100, 100)}
            unit="ms"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="APFD Improvement"
            value={stats?.prioritization.apfdImprovement}
            subtitle="Test Prioritization"
            icon={<TimelineIcon fontSize="inherit" />}
            color="primary"
            progress={stats?.prioritization.apfdImprovement}
            unit="%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resource Savings"
            value={stats?.optimization.resourceSavings}
            subtitle="Kubernetes Optimization"
            icon={<ResourceIcon fontSize="inherit" />}
            color="secondary"
            progress={stats?.optimization.resourceSavings}
            unit="%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pipeline Success"
            value={stats?.pipeline.successRate}
            subtitle="Last 30 builds"
            icon={stats?.pipeline.lastBuildStatus === 'success' ? 
              <SuccessIcon fontSize="inherit" /> : <ErrorIcon fontSize="inherit" />}
            color={stats?.pipeline.lastBuildStatus === 'success' ? 'success' : 'error'}
            progress={stats?.pipeline.successRate}
            unit="%"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#37474f" />
                  <XAxis dataKey="date" stroke="#b0bec5" />
                  <YAxis yAxisId="left" stroke="#b0bec5" />
                  <YAxis yAxisId="right" orientation="right" stroke="#b0bec5" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#132f4c', border: 'none' }}
                  />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#00bcd4" 
                    name="Latency (ms)" 
                    strokeWidth={2}
                    dot={{ fill: '#00bcd4' }}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="throughput" 
                    stroke="#ff4081" 
                    name="Throughput (req/s)" 
                    strokeWidth={2}
                    dot={{ fill: '#ff4081' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resource Utilization
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resourceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#37474f" />
                  <XAxis dataKey="date" stroke="#b0bec5" />
                  <YAxis stroke="#b0bec5" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#132f4c', border: 'none' }}
                  />
                  <Bar dataKey="cpu" fill="#00bcd4" name="CPU %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="memory" fill="#ff4081" name="Memory %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Status */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip 
                  icon={<PerformanceIcon />} 
                  label="Performance Testing" 
                  color={stats?.performance.p95Latency <= 50 ? 'success' : 'error'} 
                  variant="outlined" 
                />
                <Chip 
                  icon={<TimelineIcon />} 
                  label="Test Prioritization" 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<ResourceIcon />} 
                  label="Resource Optimization" 
                  color="secondary" 
                  variant="outlined" 
                />
                <Chip 
                  icon={stats?.pipeline.lastBuildStatus === 'success' ? <SuccessIcon /> : <ErrorIcon />} 
                  label="Pipeline" 
                  color={stats?.pipeline.lastBuildStatus === 'success' ? 'success' : 'error'} 
                  variant="outlined" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;