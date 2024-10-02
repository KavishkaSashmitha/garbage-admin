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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function ContestList() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContest, setSelectedContest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editContest, setEditContest] = useState({
    id: '',
    name: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/contests');

        // Convert Firestore timestamps to JavaScript Date objects
        const contestsWithDates = response.data.map((contest) => ({
          ...contest,
          expiryDate: contest.expiryDate
            ? new Date(contest.expiryDate.seconds * 1000)
            : null, // Check if expiryDate exists
        }));

        setContests(contestsWithDates);
        setFilteredContests(contestsWithDates);
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
    setEditContest({
      id: selectedContest.id,
      name: selectedContest.name,
      description: selectedContest.description,
      // Format date to 'YYYY-MM-DD' for date input
      date:
        selectedContest.expiryDate instanceof Date &&
        !isNaN(selectedContest.expiryDate)
          ? selectedContest.expiryDate.toISOString().split('T')[0]
          : '',
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/contests/${selectedContest.id}`
      );
      setContests(
        contests.filter((contest) => contest.id !== selectedContest.id)
      );
    } catch (err) {
      console.error('Error deleting contest', err);
    }
    handleMenuClose();
  };

  const handleEditChange = (e) => {
    setEditContest({ ...editContest, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      // Constructing the edited contest data
      const filteredEditContest = {
        ...editContest,
        createdAt: new Date(editContest.date).getTime() / 1000, // Convert back to Firestore format
      };

      const response = await axios.put(
        `http://localhost:3000/contests/${editContest.id}`,
        filteredEditContest
      );

      const updatedContests = contests.map((contest) =>
        contest.id === response.data.id ? response.data : contest
      );
      setContests(updatedContests);
    } catch (err) {
      console.error('Error updating contest', err);
    }
    setOpenDialog(false);
  };

  if (loading) return <CircularProgress color="secondary" />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" mt={4}>
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
        sx={{ mb: 2 }}
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
                    {new Date(
                      contest.createdAt?._seconds * 1000
                    ).toLocaleDateString()}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Contest</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={editContest.name}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            value={editContest.description}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            label="Date"
            name="expiryDate"
            type="date"
            fullWidth
            value={editContest.createdAt}
            onChange={handleEditChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ContestList;
