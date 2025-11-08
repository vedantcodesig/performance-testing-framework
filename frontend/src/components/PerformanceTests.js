import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { PlayArrow, Stop, Refresh, BarChart } from '@mui/icons-material';
import { getPerformanceTests, startPerformanceTest, stopPerformanceTest, getTestResults } from '../services/api';

function PerformanceTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [testConfig, setTestConfig] = useState({
    name: '',
    users: 100,
    duration: '5m'
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await getPerformanceTests();
      setTests(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch performance tests');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    try {
      setError(null);
      await startPerformanceTest(testConfig);
      setStartDialogOpen(false);
      fetchTests();
    } catch (err) {
      setError('Failed to start performance test');
    }
  };

  const handleStopTest = async () => {
    try {
      setError(null);
      await stopPerformanceTest();
      fetchTests();
    } catch (err) {
      setError('Failed to stop performance test');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'primary';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getSLAColor = (slaStatus) => {
    return slaStatus === 'PASS' ? 'success' : 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Performance Testing
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Controls
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => setStartDialogOpen(true)}
              disabled={tests.some(test => test.status === 'running')}
            >
              Start New Test
            </Button>
            <Button
              variant="outlined"
              startIcon={<Stop />}
              onClick={handleStopTest}
              disabled={!tests.some(test => test.status === 'running')}
            >
              Stop Test
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchTests}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test History
          </Typography>
          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Test Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Users</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>P95 Latency</TableCell>
                    <TableCell>Failure Rate</TableCell>
                    <TableCell>SLA Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={test.status} 
                          color={getStatusColor(test.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{test.users}</TableCell>
                      <TableCell>{test.duration}</TableCell>
                      <TableCell>
                        {test.p95Latency ? `${test.p95Latency}ms` : '-'}
                      </TableCell>
                      <TableCell>
                        {test.failureRate ? `${test.failureRate}%` : '-'}
                      </TableCell>
                      <TableCell>
                        {test.slaStatus ? (
                          <Chip 
                            label={test.slaStatus} 
                            color={getSLAColor(test.slaStatus)}
                            size="small"
                          />
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(test.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={startDialogOpen} onClose={() => setStartDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start Performance Test</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Test Name"
              value={testConfig.name}
              onChange={(e) => setTestConfig({...testConfig, name: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Number of Users"
              value={testConfig.users}
              onChange={(e) => setTestConfig({...testConfig, users: parseInt(e.target.value)})}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Test Duration</InputLabel>
              <Select
                value={testConfig.duration}
                label="Test Duration"
                onChange={(e) => setTestConfig({...testConfig, duration: e.target.value})}
              >
                <MenuItem value="1m">1 Minute</MenuItem>
                <MenuItem value="5m">5 Minutes</MenuItem>
                <MenuItem value="10m">10 Minutes</MenuItem>
                <MenuItem value="30m">30 Minutes</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleStartTest} 
            variant="contained"
            disabled={!testConfig.name}
          >
            Start Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PerformanceTests;