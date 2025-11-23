import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * OrderCard - shows order summary.
 * - Displays total discounted price (order.totalDiscountedPrice) or computes it.
 * - Shows up to 5 product images from orderItems in a shuffled, stacked layout.
 */
const OrderCard = ({ order = {} }) => {
  const navigate = useNavigate();

  // first order item for title fallback
  const firstOrderItem =
    Array.isArray(order.orderItems) && order.orderItems.length > 0
      ? order.orderItems[0]
      : null;

  const name =
    firstOrderItem?.product?.title ||
    order.name ||
    `Order #${order._id ?? order.id ?? ""}`;

  // derive images: product.imageUrl[0] from each orderItem, remove falsy, unique, limit to 5
  const images = useMemo(() => {
    const imgs = (order.orderItems || [])
      .map((it) => it.product?.imageUrl?.[0])
      .filter(Boolean);

    // unique preserve first occurrence
    const unique = [...new Set(imgs)];

    // shuffle array (Fisher-Yates) to get "shuffled cards" look
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }

    return unique.slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]); // re-run if order changes

  // fallback single image if no images found
  const mainImage = images[0] || firstOrderItem?.product?.imageUrl?.[0] || order.image || "";

  // price: prefer totalDiscountedPrice, else compute sum of discountedPrice * quantity, else fallback to totalPrice
  const computedTotalDiscounted = useMemo(() => {
    if (typeof order.totalDiscountedPrice === "number" && !isNaN(order.totalDiscountedPrice)) {
      return Number(order.totalDiscountedPrice);
    }

    // compute from items
    const sum = (order.orderItems || []).reduce((acc, it) => {
      const unit = Number(it.discountedPrice ?? it.price ?? it.product?.discountedPrice ?? it.product?.price ?? 0);
      const qty = Number(it.quantity ?? 1);
      return acc + unit * qty;
    }, 0);

    if (sum > 0) return sum;
    if (typeof order.totalPrice === "number" && !isNaN(order.totalPrice)) return Number(order.totalPrice);
    return 0;
  }, [order]);

  const status = order.orderStatus || order.status || "Unknown";

  const deliveryDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "TBD";

  const getStatusColor = (s) => {
    const st = (s || "").toString().toLowerCase();
    if (st.includes("delivered")) return "success";
    if (st.includes("cancelled") || st.includes("canceled")) return "error";
    if (st.includes("returned")) return "warning";
    if (st.includes("shipped") || st.includes("on the way") || st.includes("pending")) return "info";
    return "default";
  };

  const handleDetails = () => {
    navigate(`/order/${order._id}`, { state: { order } });
  };

  // stacked image styles: translateX per index, small rotation for a shuffled look
  const renderStackedImages = () => {
    if (!images || images.length === 0) {
      // render single main image
      return (
        <CardMedia
          component="img"
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            objectFit: "cover",
            borderRadius: 1.5,
            flexShrink: 0,
          }}
          image={mainImage || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="}
          alt={name}
        />
      );
    }

    // show horizontal stack
    return (
      <Box
        sx={{
          width: { xs: 80, sm: 100 },
          minWidth: { xs: 80, sm: 100 },
          height: { xs: 80, sm: 100 },
          position: "relative",
          flexShrink: 0,
        }}
      >
        {images.map((src, idx) => {
          // compute offsets
          const maxOffset = 18; // px offset between cards
          const offset = Math.min(idx, 4) * maxOffset;
          // small rotation for 'shuffled' look, vary with idx
          const rotate = (idx % 5) * 4 - 8; // -8, -4, 0, 4, 8
          const zIndex = 100 + idx;
          const sizeReduce = idx * 0.0; // keep same size but you can slightly scale if wanted

          return (
            <Box
              key={`${src}-${idx}`}
              component="img"
              src={src}
              alt={`${name} ${idx + 1}`}
              sx={{
                position: "absolute",
                top: 0,
                left: `${offset}px`,
                width: `calc(100% - ${offset}px)`,
                height: "100%",
                objectFit: "cover",
                borderRadius: 1.2,
                boxShadow: 1,
                transform: `rotate(${rotate}deg) scale(${1 - sizeReduce})`,
                zIndex,
                border: "1px solid rgba(255,255,255,0.6)",
                backgroundColor: "background.paper",
              }}
            />
          );
        })}
      </Box>
    );
  };

  return (
    <Card
      elevation={1}
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "white",
        borderRadius: 2,
        "&:hover": { boxShadow: 2 },
        transition: "all 0.2s ease-in-out",
      }}
    >
      {renderStackedImages()}

      <CardContent sx={{ flex: 1, p: 0, pl: 2, "&:last-child": { pb: 0 } }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", height: "100%" }}>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, lineHeight: 1.3, color: "text.primary" }} noWrap title={name}>
                {name}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.8rem" }}>
                Items: <strong>{(order.orderItems || []).reduce((acc, it) => acc + (it.quantity ?? 1), 0)}</strong>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main", mb: 0.5 }}>
                ₹{Number(computedTotalDiscounted).toLocaleString()}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                Expected Delivery: {deliveryDate}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", ml: { sm: 2 }, mt: { xs: 2, sm: 0 } }}>
            <Chip label={status} color={getStatusColor(status)} variant="outlined" size="small" sx={{ fontSize: "0.7rem", fontWeight: 500, px: 1, height: 28, mb: 1 }} />

            <Button variant="contained" size="small" onClick={handleDetails} sx={{ textTransform: "none", fontWeight: 600 }}>
              Order Details
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
