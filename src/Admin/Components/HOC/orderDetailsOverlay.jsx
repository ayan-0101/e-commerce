// src/admin/components/OrderDetailsOverlay.jsx
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const OrderDetailsOverlay = ({
  open,
  onClose,
  order,
  onUpdateStatus,
  updating,
  ORDER_STATUSES,
  getStatusColor,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "");

  useEffect(() => {
    setSelectedStatus(order?.orderStatus || "");
  }, [order]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleStatusUpdateClick = () => {
    if (!order || !selectedStatus || selectedStatus === order.orderStatus) return;
    onUpdateStatus(order._id, selectedStatus);
  };

  const items = order?.orderItems || [];
  const totalItems =
    order?.totalItem ??
    items.reduce((sum, it) => sum + (it.quantity ?? 1), 0);

  const address =
    order && typeof order.shippingAddress === "object"
      ? order.shippingAddress
      : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.45)",
          bgcolor: "#212a3d", // slate-900
          color: "white",
        },
      }}
    >
      {/* Custom title bar */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgba(129,140,248,0.25), rgba(56,189,248,0.12))",
          borderBottom: "1px solid rgba(148,163,184,0.4)",
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ color: "rgb(148 163 184)" }}>
            Order Details
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            #{order?._id}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "rgb(148 163 184)",
            "&:hover": { bgcolor: "rgba(148,163,184,0.1)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent
        dividers
        sx={{
          px: 3,
          py: 3,
          background:
            "radial-gradient(circle at top left, rgba(59,130,246,0.25), transparent 60%), radial-gradient(circle at bottom right, rgba(236,72,153,0.18), transparent 55%)",
        }}
      >
        {!order ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Top row: summary & status controls */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "rgb(148 163 184)", mb: 0.5 }}
                >
                  Placed on{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString()
                    : "—"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgb(148 163 184)" }}
                >
                  Total Items:{" "}
                  <span style={{ fontWeight: 600, color: "white" }}>
                    {totalItems}
                  </span>
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={order.orderStatus}
                  color={getStatusColor(order.orderStatus)}
                  size="small"
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                  }}
                />

                <FormControl
                  size="small"
                  sx={{
                    minWidth: 180,
                    "& .MuiInputBase-root": {
                      bgcolor: "rgba(15,23,42,0.9)",
                      borderRadius: 2,
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgb(148 163 184)",
                    },
                  }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus || ""}
                    label="Status"
                    onChange={handleStatusChange}
                    sx={{
                      color: "white",
                      "& .MuiSelect-icon": { color: "rgb(148 163 184)" },
                    }}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleStatusUpdateClick}
                  disabled={
                    updating ||
                    !selectedStatus ||
                    selectedStatus === order.orderStatus
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 999,
                    px: 2.5,
                    background:
                      "linear-gradient(135deg, #4f46e5, #06b6d4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4338ca, #0891b2)",
                    },
                  }}
                >
                  {updating ? "Updating..." : "Update Status"}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(148,163,184,0.35)" }} />

            {/* Main grid */}
            <Grid container spacing={3}>
              {/* Items list */}
              <Grid item xs={12} md={7}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "rgb(148 163 184)", mb: 1 }}
                >
                  Items
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {items.map((it) => {
                    const product = it.product || {};
                    const image = product.imageUrl?.[0];
                    const title = product.title || "Product";

                    const qty = it.quantity ?? 1;
                    const unit =
                      it.discountedPrice ??
                      it.price ??
                      product.discountedPrice ??
                      product.price ??
                      0;
                    const subtotal = unit * qty;

                    return (
                      <Box
                        key={it._id}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid rgba(148,163,184,0.25)",
                          bgcolor: "rgba(15,23,42,0.9)",
                        }}
                      >
                        <Avatar
                          src={image}
                          alt={title}
                          variant="rounded"
                          sx={{ width: 56, height: 56 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600 }}
                            noWrap
                          >
                            {title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgb(148 163 184)",
                              fontSize: "0.8rem",
                            }}
                          >
                            Size: <b>{it.size}</b> · Qty: <b>{qty}</b>
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgb(148 163 184)",
                              fontSize: "0.8rem",
                            }}
                          >
                            Unit: ₹{unit.toLocaleString()}
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgb(148 163 184)",
                              fontSize: "0.8rem",
                            }}
                          >
                            Subtotal
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            ₹{subtotal.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Grid>

              {/* Right side: summary + customer + address */}
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(148,163,184,0.25)",
                    bgcolor: "rgba(15,23,42,0.9)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "rgb(148 163 184)", mb: 1 }}
                  >
                    Payment Summary
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "rgb(148 163 184)" }}
                    >
                      Total Items
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {totalItems}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "rgb(148 163 184)" }}
                    >
                      Total Price
                    </Typography>
                    <Typography variant="body2">
                      ₹{(order.totalPrice ?? 0).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "rgb(148 163 184)" }}
                    >
                      Discount
                    </Typography>
                    <Typography variant="body2">
                      -₹{(order.discount ?? 0).toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1, borderColor: "rgba(148,163,184,0.35)" }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "rgb(148 163 184)" }}
                    >
                      Payable
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      ₹{(
                        order.totalDiscountedPrice ?? order.totalPrice ?? 0
                      ).toLocaleString()}
                    </Typography>
                  </Box>

                  {order.paymentDetails && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgb(148 163 184)", fontSize: "0.8rem" }}
                      >
                        Payment:{" "}
                        <b>{order.paymentDetails.paymentMethod || "N/A"}</b> ·{" "}
                        Status:{" "}
                        <b>{order.paymentDetails.paymentStatus || "N/A"}</b>
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(148,163,184,0.25)",
                    bgcolor: "rgba(15,23,42,0.9)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "rgb(148 163 184)", mb: 1 }}
                  >
                    Customer
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {(order.user?.firstName || "") +
                      " " +
                      (order.user?.lastName || "")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgb(148 163 184)" }}
                  >
                    {order.user?.email}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(148,163,184,0.25)",
                    bgcolor: "rgba(15,23,42,0.9)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "rgb(148 163 184)", mb: 1 }}
                  >
                    Shipping Address
                  </Typography>
                  {address ? (
                    <>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {address.firstName} {address.lastName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgb(148 163 184)" }}
                      >
                        {address.streetAddress}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgb(148 163 184)" }}
                      >
                        {address.city}, {address.state} {address.zipCode}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgb(148 163 184)" }}
                      >
                        Mobile: {address.mobile}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "rgb(148 163 184)" }}
                    >
                      Address not available. Populate <code>shippingAddress</code>{" "}
                      in <code>allOrders</code> if you need it here.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsOverlay;
