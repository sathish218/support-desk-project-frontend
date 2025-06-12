import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "role", headerName: "Role", width: 150 },
];

const List = () => {
  const [users, setUsers] = useState([]);
  const [activeRole, setActiveRole] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "https://sathish07-support-desk-project.hf.space"; // Local backend


  // Fetch users by role endpoint ("employees" or "it-support")
  const fetchUsers = async (roleEndpoint) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/users/${roleEndpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
      }

      const data = await res.json();

      // Add 'id' property for DataGrid
      const formattedData = data.map((user, index) => ({
        id: index + 1,
        ...user,
      }));

      setUsers(formattedData);
      setActiveRole(roleEndpoint);
    } catch (error) {
      console.error(error);
      setUsers([]);
      setActiveRole(roleEndpoint);
    }
  };

  // Navigate to employee requests page on row click (only for employees)
  const handleRowClick = (params) => {
    if (params.row.role === "employee") {
      // encodeURIComponent to safely pass email in URL
      navigate(`/employee/${encodeURIComponent(params.row.email)}`);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={() => fetchUsers("employees")}>
          Show Employees
        </Button>
        <Button variant="contained" onClick={() => fetchUsers("it-support")}>
          Show IT Support
        </Button>
      </Stack>

      {users.length > 0 ? (
        <DataGrid
          rows={users}
          columns={columns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          onRowClick={handleRowClick}
          sx={{ cursor: "pointer" }}
        />
      ) : activeRole ? (
        <Typography>No users found for role: {activeRole}</Typography>
      ) : (
        <Typography>Click a button above to load users.</Typography>
      )}
    </Box>
  );
};

export default List;
