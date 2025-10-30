import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
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

export default function ChangePasswordModal({ open, handleClose, userId }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement actual password change logic with old password verification
      await api.put(`/users/${userId}`, { password: newPassword });
      toast.success('Password changed successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to change password.');
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
