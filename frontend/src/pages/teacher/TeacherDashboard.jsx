import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PeopleIcon from '@mui/icons-material/People';
import ComputerIcon from '@mui/icons-material/Computer';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TableChartIcon from '@mui/icons-material/TableChart';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import QuizIcon from '@mui/icons-material/Quiz';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Contest Calendar',
      icon: <CalendarIcon sx={{ fontSize: 40 }} />,
      path: 'https://competitiveprogramming.info/calendar',
      color: '#1976d2',
      external: true
    },
    {
      title: 'Create Assignment',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/create-assignment',
      color: '#1976d2'
    },
    {
      title: 'Check Assignment Status',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/assignment-status',
      color: '#2e7d32'
    },
    {
      title: 'Student DSA Profiles',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/student-profiles',
      color: '#ed6c02'
    },
    {
      title: 'Student Development Profiles',
      icon: <ComputerIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/dev-profiles',
      color: '#9c27b0'
    },
    {
      title: 'Student Performance Report',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/performance-report',
      color: '#d32f2f'
    },
    {
      title: 'Attendance',
      icon: <EventAvailableIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/attendance',
      color: '#0288d1'
    },
    {
      title: 'Generate Insights with Excel',
      icon: <TableChartIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/excel-insights',
      color: '#00796b'
    },
    {
      title: 'Upload Result as Excel',
      icon: <UploadFileIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/upload-results',
      color: '#673ab7'
    },
    {
      title: 'View Test Results',
      icon: <QuizIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/test-results',
      color: '#f57c00'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 200,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 3
                }
              }}
              onClick={() => card.external ? window.open(card.path, '_blank') : navigate(card.path)}
            >
              <Box sx={{ color: card.color, mb: 2 }}>
                {card.icon}
              </Box>
              <Typography 
                variant="h6" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  color: 'text.primary'
                }}
              >
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TeacherDashboard; 