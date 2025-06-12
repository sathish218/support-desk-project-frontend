import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const BASE_URL = "https://sathish07-support-desk-project.hf.space"; // Local backend


const EmployeeRequests = () => {
  const { email: routeEmail } = useParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const loggedInUserEmail = storedUser?.email;
  const loggedInUserRole = storedUser?.role;

  const token = localStorage.getItem('token');
  const url = routeEmail
    ? `${BASE_URL}/api/requests?email=${routeEmail}`
    : `${BASE_URL}/api/requests`;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Expected JSON response, but got ' + contentType);
        }

        const data = await response.json();
        console.log(data);

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        setRequests(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [url, token]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'priority', headerName: 'Priority', width: 130 },
    { field: 'message', headerName: 'Message', width: 300 },
    { field: 'status', headerName: 'Status', width: 130 },
   {
  field: 'createdAt',
  headerName: 'Created At',
  width: 200}
  // valueGetter: (params) => {
  //   const rawValue = params.value;

  //   // Remove microseconds: keep only 3 digits after dot (milliseconds)
  //   const cleanedValue = rawValue?.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.(\d{3})\d*$/, '$1.$2');

  //   const date = new Date(cleanedValue);

  //   return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  // }

  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        {loggedInUserRole === 'IT-Support'
          ? routeEmail
            ? `Requests for ${routeEmail}`
            : 'All Requests'
          : 'Your Requests'}
      </Typography>

      {loggedInUserRole === 'IT-Support' && (
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          ← Back to User List
        </Button>
      )}

      <Paper elevation={3} sx={{ height: 500, p: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography textAlign="center" mt={4} color="error">
            {error}
          </Typography>
        ) : requests.length === 0 ? (
          <Typography textAlign="center" mt={4}>
            No requests found.
          </Typography>
        ) : (
          <DataGrid
            rows={requests.map((req, index) => ({
              id: req.id ?? index + 1,
              ...req,
            }))}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            autoHeight
            sx={{
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f9f9f9',
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default EmployeeRequests;



// re_RxuhQ2xr_HBYsTbZ2RWD2ioJnF9pp8Thp



// re_4six1fAh_BCuCg6sBGTALVYj6CAWiHQAz
