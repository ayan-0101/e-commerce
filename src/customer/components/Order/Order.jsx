import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import OrderCard from "./OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../../State/Order/Action";

const Order = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.order); 
  const { loading, orders = [], error } = orderState || {};
  
  useEffect(() => {
    dispatch(getOrderHistory()); 
  }, [dispatch]);

  const orderStatus = [
    { label: "On The Way", value: "on_the_way" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Returned", value: "returned" },
  ];

  const handleFilterChange = (value) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const FilterCard = () => (
    <Card elevation={1} sx={{ height: "fit-content", position: { md: "sticky" }, top: { md: 20 } }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "text.primary" }}>
          Filter
        </Typography>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, color: "text.secondary" }}>
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
                sx={{ mb: 1, "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
              />
            ))}
          </FormGroup>
        </Box>
      </CardContent>
    </Card>
  );

  const filteredOrders = orders.orders.filter((o) => {
    if (selectedFilters.length === 0) return true;
    const status = (o.orderStatus || o.status || "").toString().toLowerCase();
    return selectedFilters.some((f) => status.includes(f));
  });

  // loading / error / empty handling
  const content = () => {
    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;

    if (error) return <Typography color="error" sx={{ textAlign: "center", py: 4 }}>{String(error)}</Typography>;

    if (!orders || orders.length === 0)
      return <Typography sx={{ textAlign: "center", py: 4 }}>No orders found</Typography>;

    return (
      <Box>
        {(filteredOrders.length ? filteredOrders : []).map((orderItem) => (
          <Box key={orderItem._id ?? orderItem.id ?? Math.random()} sx={{ mb: 2 }}>
            <OrderCard order={orderItem} />
          </Box>
        ))}
      </Box>
    );
  };

  if (isMobile) {
    return (
      <Container maxWidth="sm" sx={{ py: 2, px: 2 }}>
        <FilterCard />
        <Box sx={{ my: 3, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
            My Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {orders?.length ?? 0} orders found
          </Typography>
        </Box>
        {content()}
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <FilterCard />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
              My Orders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {orders?.length ?? 0} orders found
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 800, mx: "auto" }}>{content()}</Box>
        </Box>
      </Box>
    </Container>
  );
};
export default Order;
