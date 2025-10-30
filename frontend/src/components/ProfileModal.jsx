import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
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

export default function ProfileModal({ open, handleClose, view, owners }) {
  const [formData, setFormData] = useState({});
  // guard against undefined view to avoid calling slice on undefined
  const itemName = typeof view === 'string' && view.length > 0 ? view.slice(0, -1) : '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (view === 'Users') {
        const { address, ...rest } = formData;
        response = await api.post('/users', { ...rest, add: address, role: 'USER' });
      } else if (view === 'Owners') {
        const { address, ...rest } = formData;
        response = await api.post('/users', { ...rest, add: address, role: 'OWNER' });
      } else if (view === 'Stores') {
        const { address, name, ownerId } = formData;
        response = await api.post('/stores', { name, add: address, OwnerID: ownerId });
      }
      toast.success(`${itemName || 'Item'} added successfully!`);
      handleClose();
    } catch (error) {
      toast.error(`Failed to add ${itemName || 'item'}.`);
      console.error(error);
    }
  };

  const renderFormFields = () => {
    if (view === 'Users' || view === 'Owners') {
      return (
        <>
          <TextField name="name" label="Name" fullWidth margin="normal" onChange={handleChange} />
          <TextField name="email" label="Email" fullWidth margin="normal" onChange={handleChange} />
          <TextField name="address" label="Address" fullWidth margin="normal" onChange={handleChange} />
          <TextField name="password" label="Password" type="password" fullWidth margin="normal" onChange={handleChange} />
        </>
      );
    }
    if (view === 'Stores') {
      return (
        <>
          <TextField name="name" label="Name" fullWidth margin="normal" onChange={handleChange} />
          <TextField name="address" label="Address" fullWidth margin="normal" onChange={handleChange} />
          <FormControl fullWidth margin="normal">
            <InputLabel id="owner-select-label">Owner</InputLabel>
            <Select
              labelId="owner-select-label"
              name="ownerId"
              value={formData.ownerId || ''}
              onChange={handleChange}
            >
              {owners && owners.map(owner => (
                <MenuItem key={owner.id} value={owner.id}>{owner.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      );
    }
    return null;
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Add {itemName || 'Item'}
        </Typography>
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit</Button>
        </form>
      </Box>
    </Modal>
  );
}