import React, { useState, useEffect } from 'react';
import { ThemeProvider, Container, TextField, Box, Typography, Button, AppBar, Toolbar, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';
import api from '../utils/apiCalling';
import StoreCard from './StoreCard';
import RatingModal from './RatingModal';
import ProfileModal from './ProfileModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserLandingPage() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const res = await api.get('/stores');
        setStores(res.data);
        setFilteredStores(res.data);
      } catch (error) {
        console.error('Failed to fetch stores', error);
        setError('Failed to load stores. Please try again later.');
        toast.error('Failed to load stores.');
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const newFilteredStores = stores.filter(store =>
      store.name.toLowerCase().includes(lowercasedSearch) ||
      store.address.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredStores(newFilteredStores);
  }, [search, stores]);

  const handleOpenRatingModal = (storeId) => {
    setSelectedStore(storeId);
    setRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setSelectedStore(null);
    setRatingModalOpen(false);
  };

  const handleOpenProfileModal = () => {
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, User!
          </Typography>
          <Button color="inherit" onClick={handleOpenProfileModal}>Profile</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <TextField
          label="Search by name or address"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
        />
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
        )}
        {!loading && !error && filteredStores.length === 0 && (
          <Typography align="center" sx={{ mt: 4 }}>
            No stores found.
          </Typography>
        )}
        {!loading && !error && filteredStores.length > 0 && (
          <Box>
            {filteredStores.map(store => (
              <StoreCard key={store.id} store={store} handleOpenModal={handleOpenRatingModal} />
            ))}
          </Box>
        )}
        {selectedStore && (
          <RatingModal
            open={ratingModalOpen}
            handleClose={handleCloseRatingModal}
            storeId={selectedStore}
          />
        )}
        <ProfileModal
          open={profileModalOpen}
          handleClose={handleCloseProfileModal}
        />
        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
}
