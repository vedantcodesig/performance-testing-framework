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
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { TrendingUp, Psychology, Timeline } from '@mui/icons-material';
import { getPrioritizationData, getTestPlan } from '../services/api';

function TestPrioritization() {
  const [prioritizationData, setPrioritizationData] = useState(null);
  const [testPlan, setTestPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prioritizationResponse, testPlanResponse] = await Promise.all([
        getPrioritizationData(),
        getTestPlan()
      ]);
      setPrioritizationData(prioritizationResponse.data);
      setTestPlan(testPlanResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch prioritization data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        AI Test Prioritization
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    APFD Improvement
                  </Typography>
                  <Typography variant="h4">
                    {prioritizationData?.apfdImprovement}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Psychology color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Model Type
                  </Typography>
                  <Typography variant="h6">
                    {prioritizationData?.modelType}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Timeline color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" variant="body2">
                    Commits Analyzed
                  </Typography>
                  <Typography variant="h4">
                    {prioritizationData?.totalCommitsAnalyzed}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feature Importance
              </Typography>
              <List>
                {prioritizationData?.featureImportance?.map((feature, index) => (
                  <ListItem key={feature.feature} divider={index < prioritizationData.featureImportance.length - 1}>
                    <ListItemText 
                      primary={feature.feature}
                      secondary={`Importance: ${(feature.importance * 100).toFixed(1)}%`}
                    />
                    <LinearProgress 
                      variant="determinate" 
                      value={feature.importance * 100}
                      sx={{ width: 100, height: 8, borderRadius: 4 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prioritized Test Plan (Top 20)
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Priority</TableCell>
                      <TableCell>Test Case</TableCell>
                      <TableCell>Failure Prob</TableCell>
                      <TableCell>Risk Level</TableCell>
                      <TableCell>Duration (s)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testPlan.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell>
                          <Chip label={`#${test.priority}`} size="small" color="primary" />
                        </TableCell>
                        <TableCell>{test.testCase}</TableCell>
                        <TableCell>{(test.failureProbability * 100).toFixed(1)}%</TableCell>
                        <TableCell>
                          <Chip 
                            label={test.riskLevel} 
                            color={getRiskColor(test.riskLevel)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{test.estimatedDuration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TestPrioritization;