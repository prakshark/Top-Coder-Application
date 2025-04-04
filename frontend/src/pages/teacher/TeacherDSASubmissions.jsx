import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Link,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

/**
 * TeacherDSASubmissions Component
 * 
 * This component displays a table of all students with their DSA (Data Structures and Algorithms)
 * profile information including LeetCode and CodeChef profiles.
 * 
 * Features:
 * - Displays student information in a table format
 * - Shows LeetCode and CodeChef profile links
 * - Includes search functionality to filter students
 * - Shows loading state while fetching data
 * - Handles and displays errors appropriately
 * - Responsive design for different screen sizes
 */
const TeacherDSASubmissions = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Fetch student data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teacher/student-details', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Set assignments first
        setAssignments(response.data.data.assignments || []);

        // Process students with LeetCode stats
        const studentsWithStats = await Promise.all(
          (response.data.data.students || []).map(async (student) => {
            if (!student || !student.leetcodeUsername) {
              return student;
            }
            try {
              const statsResponse = await axios.get(`http://localhost:5000/api/student/rankings/${student._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              });
              return {
                ...student,
                leetcodeStats: statsResponse.data.data.leetcode
              };
            } catch (err) {
              console.error(`Error fetching LeetCode stats for ${student.name}:`, err);
              return {
                ...student,
                leetcodeStats: null
              };
            }
          })
        );
        
        setStudents(studentsWithStats);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    if (!student) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      (student.name?.toLowerCase() || '').includes(searchLower) ||
      (student.email?.toLowerCase() || '').includes(searchLower) ||
      (student.phone?.toLowerCase() || '').includes(searchLower) ||
      (student.leetcodeUsername?.toLowerCase() || '').includes(searchLower) ||
      (student.codechefUsername?.toLowerCase() || '').includes(searchLower)
    );
  });

  // Filter assignments based on search query
  const filteredAssignments = assignments.filter(assignment => {
    if (!assignment) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      (assignment.title?.toLowerCase() || '').includes(searchLower) ||
      (assignment.description?.toLowerCase() || '').includes(searchLower) ||
      (assignment.difficulty?.toLowerCase() || '').includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          DSA Management
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View and manage student DSA profiles and assignments
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Student Profiles" />
        <Tab label="Assignments" />
      </Tabs>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search ${activeTab === 0 ? 'students' : 'assignments'} by name, description, or difficulty...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Content based on active tab */}
      {activeTab === 0 ? (
        // Students Table
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>LeetCode Profile</TableCell>
                <TableCell>LeetCode Stats</TableCell>
                <TableCell>CodeChef Profile</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    {student.leetcodeUsername ? (
                      <Link
                        href={`https://leetcode.com/${student.leetcodeUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textDecoration: 'none' }}
                      >
                        {student.leetcodeUsername}
                      </Link>
                    ) : (
                      <Chip label="Not Added" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {student.leetcodeStats ? (
                      <Box>
                        <Typography variant="body2">
                          Ranking: #{student.leetcodeStats.ranking || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          Total Solved: {student.leetcodeStats.total?.count || 0}
                        </Typography>
                        <Typography variant="body2">
                          Easy: {student.leetcodeStats.easy?.count || 0}
                          {' | '}
                          Medium: {student.leetcodeStats.medium?.count || 0}
                          {' | '}
                          Hard: {student.leetcodeStats.hard?.count || 0}
                        </Typography>
                      </Box>
                    ) : (
                      <Chip label="No Stats" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {student.codechefUsername ? (
                      <Link
                        href={`https://www.codechef.com/users/${student.codechefUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textDecoration: 'none' }}
                      >
                        {student.codechefUsername}
                      </Link>
                    ) : (
                      <Chip label="Not Added" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {student.leetcodeUsername && student.codechefUsername ? (
                      <Chip label="Complete" color="success" size="small" />
                    ) : (
                      <Chip label="Incomplete" color="warning" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Assignments Table
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Deadline</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={assignment.difficulty} 
                      color={
                        assignment.difficulty?.toLowerCase() === 'easy' ? 'success' :
                        assignment.difficulty?.toLowerCase() === 'medium' ? 'warning' : 'error'
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{formatDate(assignment.uploadDate)}</TableCell>
                  <TableCell>{formatDate(assignment.deadline)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Results Message */}
      {((activeTab === 0 && filteredStudents.length === 0) || 
        (activeTab === 1 && filteredAssignments.length === 0)) && (
        <Box mt={4} textAlign="center">
          <Typography variant="body1" color="text.secondary">
            No {activeTab === 0 ? 'students' : 'assignments'} found matching your search criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default TeacherDSASubmissions; 