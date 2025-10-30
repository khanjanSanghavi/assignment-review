import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

export default function StoreCard({ store, handleOpenModal }) {
  return (
    <Card sx={{ mb: 2, backgroundColor: '#1e1e1e' }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ color: '#00a0b2' }}>
          {store.name}
        </Typography>
        <Typography sx={{ mb: 1.5, color: '#b3b3b3' }}>
          {store.address}
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => handleOpenModal(store.id)}>
          Rate Store
        </Button>
      </CardContent>
    </Card>
  );
}
