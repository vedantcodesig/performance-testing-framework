import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PerformanceTests from './components/PerformanceTests';
import TestPrioritization from './components/TestPrioritization';
import ResourceOptimization from './components/ResourceOptimization';
import PipelineStatus from './components/PipelineStatus';

// Create a dark theme for our app
const theme = createTheme({
  palette: {
    mode: 'dark',  // Dark mode
    primary: {
      main: '#00bcd4',  // Cyan color
      light: '#33c9dc',
      dark: '#008394',
    },
    secondary: {
      main: '#ff4081',  // Pink color
      light: '#ff79b0',
      dark: '#c60055',
    },
    background: {
      default: '#0a1929',  // Dark blue
      paper: '#132f4c',    // Slightly lighter blue for cards
    },
    text: {
      primary: '#ffffff',   // White text
      secondary: '#b0bec5', // Light gray text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
  },
  shape: {
    borderRadius: 8,  // Rounded corners
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline provides consistent CSS baseline */}
      <CssBaseline />
      {/* Router handles navigation between pages */}
      <Router>
        {/* Layout provides common structure (header, sidebar) */}
        <Layout>
          {/* Routes define which component to show for each URL */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/performance" element={<PerformanceTests />} />
            <Route path="/prioritization" element={<TestPrioritization />} />
            <Route path="/optimization" element={<ResourceOptimization />} />
            <Route path="/pipeline" element={<PipelineStatus />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;