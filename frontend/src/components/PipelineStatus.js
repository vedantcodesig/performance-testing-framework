import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Schedule,
  PlayArrow,
  Stop
} from '@mui/icons-material';
import { getPipelineStatus } from '../services/api';

function PipelineStatus() {
  const [pipelineStatus, setPipelineStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getPipelineStatus();
      setPipelineStatus(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch pipeline status');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle color="success" />;
      case 'failed': return <Error color="error" />;
      case 'running': return <PlayArrow color="primary" />;
      case 'scheduled': return <Schedule color="warning" />;
      default: return <Stop color="disabled" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'running': return 'primary';
      case 'scheduled': return 'warning';
      default: return 'default';
    }
  };

  if (loading && !pipelineStatus) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Pipeline Status
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Pipeline Status
              </Typography>
              
              {pipelineStatus && (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(pipelineStatus.lastBuild.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Build"
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Build ID: {pipelineStatus.lastBuild.id}
                          </Typography>
                          <Typography variant="body2">
                            Triggered by: {pipelineStatus.lastBuild.triggeredBy}
                          </Typography>
                          <Typography variant="body2">
                            Duration: {Math.floor(pipelineStatus.lastBuild.duration / 60)}m {pipelineStatus.lastBuild.duration % 60}s
                          </Typography>
                          <Typography variant="body2">
                            Pipeline: {pipelineStatus.lastBuild.pipeline}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip 
                      label={pipelineStatus.lastBuild.status.toUpperCase()}
                      color={getStatusColor(pipelineStatus.lastBuild.status)}
                    />
                  </ListItem>
                  <Divider />
                  
                  <ListItem>
                    <ListItemIcon>
                      <Schedule color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Queue Status"
                      secondary={`${pipelineStatus.queueLength} builds waiting`}
                    />
                    <Chip 
                      label={`${pipelineStatus.queueLength} in queue`}
                      color="info"
                      variant="outlined"
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <PlayArrow color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Active Builds"
                      secondary={`${pipelineStatus.activeBuilds} currently running`}
                    />
                    <Chip 
                      label={`${pipelineStatus.activeBuilds} active`}
                      color="primary"
                      variant="outlined"
                    />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h2" color="primary" gutterBottom>
                  {pipelineStatus?.successRate}%
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Success Rate
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Last 30 builds
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Build Distribution:
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="caption">Success</Typography>
                  <Typography variant="caption">
                    {Math.round((pipelineStatus?.successRate || 0) / 100 * 30)} builds
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={pipelineStatus?.successRate || 0}
                  color="success"
                  sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="caption">Failed</Typography>
                  <Typography variant="caption">
                    {30 - Math.round((pipelineStatus?.successRate || 0) / 100 * 30)} builds
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={100 - (pipelineStatus?.successRate || 0)}
                  color="error"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Alert severity="info">
                Pipeline monitoring is active. Real Jenkins integration can be added by connecting to your Jenkins instance API.
              </Alert>
              
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Next Steps: Connect to your Jenkins instance by updating the backend API endpoints 
                  to point to your Jenkins server and adding authentication.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PipelineStatus;