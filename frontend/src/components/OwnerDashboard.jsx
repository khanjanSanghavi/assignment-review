import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import api from '../utils/apiCalling';
import { toast } from 'react-toastify';
import ChangePasswordModal from './ChangePasswordModal';

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // TODO: Replace with actual owner ID from authentication context
  const ownerId = '654a7e1c-6d8a-4f8a-9b0a-1c6d8a4f8a9b'; // Hardcoded for Testing Owner
  const userId = '654a7e1c-6d8a-4f8a-9b0a-1c6d8a4f8a9b'; // Hardcoded for testing User ID

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeRes = await api.get(`/stores/${ownerId}`);
        if (storeRes.data && storeRes.data.length > 0) {
          setStore(storeRes.data[0]); // Assuming one store per owner
          const ratingsRes = await api.get(`/ratings/${storeRes.data[0].id}`);
          setRatings(ratingsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch store data', error);
        toast.error('Failed to load store data.');
      }
    };
    fetchStoreData();
  }, [ownerId]);

  const handleChangePasswordClick = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  if (!store) {
    return (
      <Box sx={{ py: 4 }}>
        <Container>
          <Typography variant="h4" sx={{ mb: 1 }}>Owner Dashboard</Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>Loading store data...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Typography variant="h4" sx={{ mb: 1 }}>Owner Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Manage your store and view ratings</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                  My Store
                </Typography>
                <Typography variant="h6">{store.name}</Typography>
                <Typography color="text.secondary">{store.address}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Overall Rating: {store.overallRating.toFixed(1)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                  Recent Ratings
                </Typography>
                {ratings.length === 0 ? (
                  <Typography>No ratings yet.</Typography>
                ) : (
                  ratings.map(rating => (
                    <Box key={rating.id} sx={{ mb: 2 }}>
                      <Typography variant="body1">Rating: {rating.rating}/5</Typography>
                      <Typography color="text.secondary">{rating.comment}</Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={handleChangePasswordClick}>Change Password</Button>
        </Box>
      </Container>
      <ChangePasswordModal
        open={isPasswordModalOpen}
        handleClose={handleClosePasswordModal}
        userId={userId}
      />
    </Box>
  );
}
