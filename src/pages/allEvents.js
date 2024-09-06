import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Box,
  Menu,
  MenuItem,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#e0f2f1', // Light teal for background
      paper: '#ffffff', // White for paper elements
    },
    text: {
      primary: '#004d40', // Dark teal for primary text
      secondary: '#00796b', // Medium teal for secondary text
    },
    primary: {
      main: '#004d40', // Dark teal for primary elements
    },
    secondary: {
      main: '#00796b', // Medium teal for secondary elements
    },
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'collapse', // Ensure borders are visible
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #004d40', // Dark teal border for table cells
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#00796b', // Medium teal for table head background
          color: '#ffffff', // White text color in table head
        },
      },
    },
  },
});

function ContestList() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContest, setSelectedContest] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/contests');
        setContests(response.data);
        setFilteredContests(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  useEffect(() => {
    setFilteredContests(
      contests.filter((contest) =>
        contest.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, contests]);

  const handleMenuOpen = (event, contest) => {
    setAnchorEl(event.currentTarget);
    setSelectedContest(contest);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContest(null);
  };

  const handleUpdate = () => {
    // Handle update logic here
    handleMenuClose();
  };

  const handleDelete = () => {
    // Handle delete logic here
    handleMenuClose();
  };

  if (loading) return <CircularProgress color="secondary" />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth={false}
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" color="text.primary" mt={4}>
            Contest List
          </Typography>
          <Tooltip title="Add New Contest">
            <IconButton
              color="primary"
              aria-label="add contest"
              href="/add-contest"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1, // Adjust border radius if needed
              border: '1px solid #00796b', // Medium teal border
              '&:hover fieldset': {
                borderColor: '#004d40', // Dark teal border on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#004d40', // Dark teal border on focus
              },
            },
          }}
        />

        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="contest table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContests.length ? (
                filteredContests.map((contest) => (
                  <TableRow key={contest.id}>
                    <TableCell>
                      {contest.imageUrl ? (
                        <img
                          src={contest.imageUrl}
                          alt={contest.name}
                          style={{ width: '100px', height: 'auto' }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </TableCell>
                    <TableCell>{contest.name}</TableCell>
                    <TableCell>{contest.description}</TableCell>
                    <TableCell>
                      {new Date(contest.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more actions"
                        onClick={(event) => handleMenuOpen(event, contest)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No contests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleUpdate}>Update</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Container>
    </ThemeProvider>
  );
}

export default ContestList;
