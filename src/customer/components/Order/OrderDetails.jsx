// OrderDetails.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddressCard from '../AddressCard/AddressCard';
import OrderTracking from './OrderTracking';
import OrderItemCard from './OrderItemCard';

const OrderDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const orderItems = [
    {
      id: 1,
      name: "Men Slim Mid Rise Black Jeans",
      color: "pink",
      size: "M",
      price: 1099,
      seller: "linaria",
      image: "https://m.media-amazon.com/images/I/61SDTiZdvHL._AC_UL640_FMwebp_QL65_.jpg",
    },
    {
      id: 2,
      name: "Women Bodycon Yellow Dress",
      color: "pink",
      size: "M",
      price: 499,
      seller: "FALTOOO FASHION",
      image: "https://m.media-amazon.com/images/I/61SDTiZdvHL._AC_UL640_FMwebp_QL65_.jpg",
    },
    {
      id: 3,
      name: "Women Skater Yellow Dress",
      color: "pink",
      size: "M",
      price: 1099,
      seller: "Tokyo Talkies",
      image: "https://m.media-amazon.com/images/I/61SDTiZdvHL._AC_UL640_FMwebp_QL65_.jpg",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'left' }}>
        {/* Header with Cancel Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Order Details
          </Typography>
          <Button 
            variant="outlined" 
            color="error"
            sx={{ 
              textTransform: 'uppercase',
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 3
            }}
          >
            CANCEL ORDER
          </Button>
        </Box>

        {/* Order Tracking */}
        <Box sx={{ mb: 4 }}>
          <OrderTracking activeStep={3} />
        </Box>

        {/* Delivery Address */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Delivery Address
          </Typography>
          <AddressCard />
        </Box>

        {/* Order Items */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Order Items
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {orderItems.map((item) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderDetails;