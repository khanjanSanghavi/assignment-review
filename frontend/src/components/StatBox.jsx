import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatBox({ title, value, icon }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: '50%' }}>
        {icon}
      </Box>
    </Card>
  );
}
