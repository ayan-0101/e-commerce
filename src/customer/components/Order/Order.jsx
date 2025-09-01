import React, { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Typography,
  FormGroup,
  Box,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import OrderCard from "./OrderCard";

const Order = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const orderStatus = [
    { label: "On The Way", value: "on_the_way" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Returned", value: "returned" },
  ];

  const orders = [
    {
      id: 1,
      name: "Men Slim Mid Rise Black Jeans",
      size: "M",
      price: 1099,
      deliveryDate: "Mar 03",
      status: "Your Item Has Been Delivered",
      image:
        "https://m.media-amazon.com/images/I/61SDTiZdvHL._AC_UL640_FMwebp_QL65_.jpg",
    },
    {
      id: 2,
      name: "Women Bodycon Yellow Dress",
      size: "M",
      price: 499,
      deliveryDate: "Mar 03",
      status: "Your Item Has Been Delivered",
      image:
        "https://m.media-amazon.com/images/I/61SDTiZdvHL._AC_UL640_FMwebp_QL65_.jpg",
    },
    {
      id: 3,
      name: "Women Skater Yellow Dress",
      size: "M",
      price: 1099,
      deliveryDate: "Mar 03",
      status: "Your Item Has Been Delivered",
      image:
        "https://m.media-amazon.com/images/I/61SDTiZdvHL._AC_UL640_FMwebp_QL65_.jpg",
    },
    {
      id: 4,
      name: "Yellow Mirrorwork Net Readymade Lehenga",
      size: "M",
      price: 11999,
      deliveryDate: "Mar 03",
      status: "Your Item Has Been Delivered",
      image:
        "https://m.media-amazon.com/images/I/61SDTiZdvHL._AC_UL640_FMwebp_QL65_.jpg",
    },
  ];

  const handleFilterChange = (value) => {
    setSelectedFilters(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const FilterCard = () => (
    <Card
      elevation={1}
      sx={{
        height: 'fit-content',
        position: { md: 'sticky' },
        top: { md: 20 }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'text.primary'
          }}
        >
          Filter
        </Typography>

        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              mb: 2,
              color: 'text.secondary'
            }}
          >
            Order Status
          </Typography>

          <FormGroup>
            {orderStatus.map((status) => (
              <FormControlLabel
                key={status.value}
                control={
                  <Checkbox
                    checked={selectedFilters.includes(status.value)}
                    onChange={() => handleFilterChange(status.value)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.primary">
                    {status.label}
                  </Typography>
                }
                sx={{
                  mb: 1,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem'
                  }
                }}
              />
            ))}
          </FormGroup>
        </Box>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <Container maxWidth="sm" sx={{ py: 2, px: 2 }}>
        {/* Mobile: Filter at top */}
        <FilterCard />

        {/* Orders Title */}
        <Box sx={{ my: 3, textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1
            }}
          >
            My Orders
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {orders.length} orders found
          </Typography>
        </Box>

        {/* Orders List */}
        <Box>
          {orders.map((order) => (
            <Box key={order.id} sx={{ mb: 2 }}>
              <OrderCard order={order} />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Desktop: Filter card on left */}
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <FilterCard />
        </Box>

        {/* Desktop: Orders on right */}
        <Box sx={{ flex: 1 }}>
          {/* Orders Title */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1
              }}
            >
              My Orders
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {orders.length} orders found
            </Typography>
          </Box>

          {/* Orders List */}
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {orders.map((order) => (
              <Box key={order.id} sx={{ mb: 2 }}>
                <OrderCard order={order} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
export default Order;