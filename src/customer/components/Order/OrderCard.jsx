import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    if (status.toLowerCase().includes('delivered')) return 'success';
    if (status.toLowerCase().includes('cancelled')) return 'error';
    if (status.toLowerCase().includes('returned')) return 'warning';
    return 'info';
  };

  return (
    <Card 
      elevation={1}
      sx={{ 
        display: 'flex',
        p: 2,
        bgcolor: 'white',
        borderRadius: 2,
        '&:hover': {
          boxShadow: 2,
        },
        transition: 'all 0.2s ease-in-out'
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        sx={{
          width: { xs: 80, sm: 100 },
          height: { xs: 80, sm: 100 },
          objectFit: 'cover',
          borderRadius: 1.5,
          flexShrink: 0
        }}
        image={order.image}
        alt={order.name}
      />

      {/* Product Details */}
      <CardContent sx={{ flex: 1, p: 0, pl: 2, '&:last-child': { pb: 0 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          height: '100%'
        }}>
          {/* Left Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500,
                  mb: 1,
                  lineHeight: 1.3,
                  color: 'text.primary',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {order.name}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 2, fontSize: '0.8rem' }}
              >
                Size: <strong>{order.size}</strong>
              </Typography>
            </Box>

            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 0.5,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                ₹{order.price.toLocaleString()}
              </Typography>

              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                Expected Delivery: {order.deliveryDate}
              </Typography>
            </Box>
          </Box>

          {/* Right Content - Status */}
          <Box sx={{ 
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'flex-start' },
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            ml: { sm: 2 },
            mt: { xs: 2, sm: 0 }
          }}>
            <Chip
              label={order.status}
              color={getStatusColor(order.status)}
              variant="outlined"
              size="small"
              sx={{ 
                fontSize: '0.7rem',
                fontWeight: 500,
                px: 1,
                height: 28
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;