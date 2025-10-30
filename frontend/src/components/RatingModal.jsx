import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Slider, Button } from '@mui/material';
import api from '../utils/apiCalling';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function RatingModal({ open, handleClose, storeId }) {
  const [rating, setRating] = useState(0);
  const [existingRating, setExistingRating] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (open) {
      const fetchRating = async () => {
        try {
          const res = await api.get(`/ratings/${user.id}/${storeId}`);
          setRating(res.data.rating);
          setExistingRating(res.data.rating);
        } catch (error) {
          setRating(0);
          setExistingRating(null);
        }
      };
      fetchRating();
    }
  }, [open, storeId, user.id]);

  const handleSubmit = async () => {
    try {
      if (existingRating) {
        await api.put(`/ratings/${user.id}/${storeId}`, { rating });
        toast.success('Rating updated successfully');
      } else {
        await api.post('/ratings', { userId: user.id, storeId, rating });
        toast.success('Rating submitted successfully');
      }
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {existingRating ? 'Update your rating' : 'Rate this store'}
        </Typography>
        <Slider
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={5}
        />
        <Button onClick={handleSubmit} variant="contained" color={existingRating ? 'primary' : 'secondary'}>
          {existingRating ? 'Update' : 'Submit'}
        </Button>
      </Box>
    </Modal>
  );
}
