import React, { useState } from 'react';
import {
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Speed as PerformanceIcon,
  PriorityHigh as PrioritizationIcon,
  AutoAwesome as OptimizationIcon,  // Changed from Optimization
  AccountTree as PipelineIcon,      // Changed from Pipeline
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;  // Width of our sidebar

// Navigation menu items
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Performance Tests', icon: <PerformanceIcon />, path: '/performance' },
  { text: 'Test Prioritization', icon: <PrioritizationIcon />, path: '/prioritization' },
  { text: 'Resource Optimization', icon: <OptimizationIcon />, path: '/optimization' },
  { text: 'Pipeline Status', icon: <PipelineIcon />, path: '/pipeline' },
];

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // Check if mobile

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar content
  const drawer = (
    <div>
      {/* Sidebar header */}
      <Toolbar sx={{ backgroundColor: 'primary.dark' }}>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
          CI/CD Suite
        </Typography>
      </Toolbar>
      {/* Navigation list */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);  // Navigate to the page
              if (isMobile) {
                setMobileOpen(false);  // Close drawer on mobile after selection
              }
            }}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          {/* Hamburger menu for mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Advanced CI/CD & Performance Engineering Suite
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            v1.0.0
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        {children}  {/* This is where our page content goes */}
      </Box>
    </Box>
  );
}

export default Layout;