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
} from '@mui/material';

function ContestList() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/contests');
        setContests(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Contest List
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="contest table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contests.map((contest) => (
              <TableRow key={contest.id}>
                <TableCell>
                  {contest.imageUrl ? (
                    <img
                      src="`http://localhost:3000/${contest.imageUrl}`"
                      alt={contest.name}
                      style={{ width: '100px', height: 'auto' }}
                    />
                  ) : (
                    'No Image'
                  )}
                </TableCell>
                <TableCell>{contest.name}</TableCell>
                <TableCell>{contest.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ContestList;
