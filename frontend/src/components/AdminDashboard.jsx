import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, Tabs, Tab, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import StatBox from './StatBox';
import api from '../utils/apiCalling';
import ProfileModal from './ProfileModal';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [view, setView] = useState(0); // 0: users, 1: owners, 2: stores
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, storeRes] = await Promise.all([
        api.get('/users'),
        api.get('/stores'),
      ]);
      setUsers(userRes.data.user);
      setStores(storeRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const userCount = users.filter(u => u.role === 'USER').length;
  const ownerCount = users.filter(u => u.role === 'OWNER').length;
  const storeCount = stores.length;

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
  ];

  const getData = () => {
    switch (view) {
      case 0:
        return users.filter(u => u.role === 'USER');
      case 1:
        return users.filter(u => u.role === 'OWNER');
      case 2:
        return stores;
      default:
        return [];
    }
  };

  const handleChange = (event, newValue) => {
    setView(newValue);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchData(); // Refetch data after closing the modal
  };

  const getTitle = () => {
    switch (view) {
      case 0:
        return 'Users';
      case 1:
        return 'Owners';
      case 2:
        return 'Stores';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Typography variant="h4" sx={{ mb: 1 }}>Admin Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Overview of your platform</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatBox title="Users" value={userCount} icon={<PeopleIcon />} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatBox title="Owners" value={ownerCount} icon={<PersonIcon />} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatBox title="Stores" value={storeCount} icon={<StoreIcon />} />
          </Grid>
        </Grid>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{getTitle()}</Typography>
            <Button variant="contained" onClick={handleModalOpen}>Add {getTitle()}</Button>
          </Box>
          <Tabs value={view} onChange={handleChange} centered>
            <Tab label="Users" />
            <Tab label="Owners" />
            <Tab label="Stores" />
          </Tabs>
          <Box sx={{ height: 400, width: '100%', mt: 2 }}>
            <DataGrid
              rows={getData()}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          </Box>
        </Paper>
      </Container>
      <ProfileModal open={modalOpen} handleClose={handleModalClose} view={getTitle()} owners={users.filter(u => u.role === 'OWNER')} />
    </Box>
  );
}
