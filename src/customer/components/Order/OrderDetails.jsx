// OrderDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { api } from "../../../ApiConfig/apiConfig"; // adjust path to your api helper
import AddressCard from "../AddressCard/AddressCard";
import OrderTracking from "./OrderTracking";
import OrderItemCard from "./OrderItemCard";

const OrderDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams(); // supports route /order/:orderId
  const [searchParams] = useSearchParams(); // supports ?order_id=<id>

  const [order, setOrder] = useState(location.state?.order ?? null);
  const [shippingAddress, setShippingAddress] = useState(
    // if location.state.order.shippingAddress is already populated object, use it
    location.state?.order?.shippingAddress &&
      typeof location.state.order.shippingAddress === "object"
      ? location.state.order.shippingAddress
      : null
  );
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // helper: compute order id from params / query
  const resolvedOrderId = useMemo(() => {
    return order?._id ?? paramOrderId ?? searchParams.get("order_id") ?? null;
  }, [order, paramOrderId, searchParams]);

  useEffect(() => {
    // fetch order if not provided via location.state
    const fetchOrder = async () => {
      if (order) {
        setLoading(false);
        return;
      }
      const id = paramOrderId ?? searchParams.get("order_id");
      if (!id) {
        setError("No order provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get(`/api/orders/${id}`);
        // backend might return { success, message, data: order } or raw order
        const fetched = data?.data ?? data;
        setOrder(fetched);

        // if fetched.shippingAddress is an id (string), we attempt to fetch address later on
        if (
          fetched.shippingAddress &&
          typeof fetched.shippingAddress === "object"
        ) {
          setShippingAddress(fetched.shippingAddress);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ?? err.message ?? "Failed to fetch order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // if order exists and shippingAddress is id string, try fetch address
    const fetchAddressIfNeeded = async () => {
      if (!order) return;
      if (!order.shippingAddress) return;
      if (typeof order.shippingAddress === "object") {
        setShippingAddress(order.shippingAddress);
        return;
      }
      // shippingAddress is likely an id -> attempt to fetch
      if (typeof order.shippingAddress === "string") {
        try {
          const { data } = await api.get(
            `/api/addresses/${order.shippingAddress}`
          );
          const fetched = data?.data ?? data;
          setShippingAddress(fetched);
        } catch (err) {
          // non-critical: address fetch failure shouldn't break page
          // console.warn("Failed to fetch shipping address", err);
        }
      }
    };

    fetchAddressIfNeeded();
  }, [order]);

  // derived values
  const totalItems = useMemo(() => {
    if (!order) return 0;
    if (typeof order.totalItem === "number") return order.totalItem;
    return (order.orderItems || []).reduce(
      (s, it) => s + (it.quantity ?? 1),
      0
    );
  }, [order]);

  const totalDiscountedPrice = useMemo(() => {
    if (!order) return 0;
    if (typeof order.totalDiscountedPrice === "number")
      return order.totalDiscountedPrice;
    // compute sum(discountedPrice * qty) fallback
    return (order.orderItems || []).reduce((acc, it) => {
      const unit = Number(
        it.discountedPrice ??
          it.price ??
          it.product?.discountedPrice ??
          it.product?.price ??
          0
      );
      const qty = Number(it.quantity ?? 1);
      return acc + unit * qty;
    }, 0);
  }, [order]);

  const canCancel = useMemo(() => {
    // simple rule: only allow cancel if PENDING
    const st = (order?.orderStatus ?? "").toString().toUpperCase();
    return st === "PENDING";
  }, [order]);

  const handleCancelOrder = async () => {
    if (!resolvedOrderId) return;
    try {
      setCancelling(true);
      // assuming backend supports PATCH /api/orders/status or /api/orders/:id with body { status: 'CANCELLED' }
      // adapt endpoint if needed
      await api.patch(`/api/orders/${resolvedOrderId}`, {
        orderId: resolvedOrderId,
        status: "CANCELLED",
      });
      // refresh order: simple approach fetch updated order
      const { data } = await api.get(`/api/orders/${resolvedOrderId}`);
      const refreshed = data?.data ?? data;
      setOrder(refreshed);
    } catch (err) {
      // show minimal error
      setError(
        err.response?.data?.message ?? err.message ?? "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleCheckout = () => {
    // prefer resolvedOrderId which already computes from params/state
    const id = resolvedOrderId ?? order?._id ?? null;

    if (!id) {
      console.warn("handleCheckout: no order id available", {
        resolvedOrderId,
        order,
      });
      // optionally show user-friendly message or return to previous page
      return;
    }

    // build query string safely
    const qs = new URLSearchParams({ step: "3", order_id: id }).toString();
    const url = `/checkout?${qs}`;

    // debug log to confirm
    console.log("Navigating to checkout:", { url, id });

    // navigate
    navigate(url, { state: { order } }); // also pass full order in location.state for convenience
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container sx={{ py: 6 }}>
        <Typography color="error">{error}</Typography>
        <Typography
          sx={{ mt: 2, cursor: "pointer", color: "primary.main" }}
          onClick={() => navigate(-1)}
        >
          Go back
        </Typography>
      </Container>
    );

  if (!order) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 3, textAlign: "left" }}>
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{ textTransform: "none", fontWeight: 600 }}
      >
        Back
      </Button>
      <Box sx={{}}>
        {/* Header with Cancel Button */}
        <Box
          className="ml-96"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            textAlign: "center",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Order Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Order ID: {order._id}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {canCancel && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelOrder}
                disabled={cancelling}
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  px: 3,
                }}
              >
                {cancelling ? "Cancelling..." : "CANCEL ORDER"}
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCheckout}
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  px: 3,
                }}
              >
                {" "}
                Checkout
              </Button>
            )}
          </Box>
        </Box>

        {/* Order Tracking */}
        <Box sx={{ mb: 4 }}>
          {/* If OrderTracking expects a step number, you can compute from orderStatus */}
          <OrderTracking
            activeStep={(() => {
              const s = (order.orderStatus || "").toUpperCase();
              if (s === "PLACED") return 1;
              if (s === "CONFIRMED") return 2;
              if (s === "SHIPPED") return 3;
              if (s === "DELIVERED") return 4;
              return 0;
            })()}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            {/* Order Items */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Order Items
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {(order.orderItems || []).map((item) => {
                  // adapt OrderItemCard props to accept backend item shape
                  const product = item.product ?? {};
                  const cardProps = {
                    id: item._id,
                    name: product.title,
                    image: product.imageUrl?.[0],
                    size: item.size,
                    price: item.price,
                    discountedPrice: item.discountedPrice,
                    quantity: item.quantity,
                    seller: product.brand,
                    // pass original item if needed
                    raw: item,
                  };
                  return <OrderItemCard key={item._id} item={cardProps} />;
                })}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            {/* Summary + Address */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Summary
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total Items
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {totalItems}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  ₹{Number(totalDiscountedPrice).toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Shipping Address
              </Typography>

              {shippingAddress ? (
                // AddressCard should accept either the full address object or props you expect
                <AddressCard address={shippingAddress} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Address not available
                </Typography>
              )}
            </Paper>

            {/* Dates / status box */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Status
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                {order.orderStatus}
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body2">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString()
                    : "-"}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Delivery Date
                </Typography>
                <Typography variant="body2">
                  {order.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleDateString()
                    : "TBD"}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default OrderDetails;
