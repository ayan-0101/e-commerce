import { Step, StepLabel, Stepper, Box } from '@mui/material';
import React from 'react';

const OrderTracking = ({ activeStep }) => {
  const steps = [
    "Placed",
    "Order Confirmed", 
    "Shipped",
    "Out For Delivery",
    "Delivered"
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: 'white',
      p: { xs: 2, md: 3 },
      borderRadius: 2,
      boxShadow: 1
    }}>
      <Stepper 
        activeStep={activeStep - 1} 
        alternativeLabel
        sx={{
          '& .MuiStepConnector-line': {
            borderTopWidth: 2,
          },
          '& .MuiStepIcon-root': {
            fontSize: '1.5rem',
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: '#7c3aed',
          },
          '& .MuiStepIcon-root.Mui-active': {
            color: '#7c3aed',
          },
          '& .MuiStepLabel-label': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 500,
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OrderTracking;