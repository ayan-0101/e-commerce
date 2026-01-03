// src/admin/components/OrdersTable.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import { useLocation } from "react-router-dom";
import CustomTable from "./HOC/Table";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../State/Order/Action";
import OrderDetailsOverlay from "./HOC/orderDetailsOverlay";

const OrdersTable = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    orders = [],
    loading,
    updating,
    deleting,
  } = useSelector((state) => state.order);

  const querySearch = new URLSearchParams(location.search);
  const highlightQuery = querySearch.get("title") || "";

  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    orderId: null,
    orderInfo: "",
  });

  // Order details dialog (overlay)
  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    order: null,
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const ORDER_STATUSES = [
    { value: "PLACED", label: "Placed", color: "info" },
    { value: "PENDING", label: "Pending", color: "warning" },
    { value: "CONFIRMED", label: "Confirmed", color: "primary" },
    { value: "SHIPPED", label: "Shipped", color: "secondary" },
    { value: "DELIVERED", label: "Delivered", color: "success" },
    { value: "CANCELLED", label: "Cancelled", color: "error" },
  ];

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const statusObj = ORDER_STATUSES.find(
      (s) => s.value === status?.toUpperCase()
    );
    return statusObj?.color || "default";
  };

  // --- DELETE ORDER ---

  const handleDeleteClick = (orderId, orderInfo) => {
    setDeleteDialog({
      open: true,
      orderId,
      orderInfo,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      orderId: null,
      orderInfo: "",
    });
  };

  const handleConfirmDelete = async () => {
    const { orderId } = deleteDialog;

    try {
      await dispatch(deleteOrder(orderId));
      handleCloseDeleteDialog();

      setSnackbar({
        open: true,
        message: "Order deleted successfully",
        severity: "success",
      });

      dispatch(getAllOrders());
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message: `Failed to delete order: ${
          error?.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    }
  };

  // --- ORDER DETAILS OVERLAY ---

  const handleViewDetails = (orderRow) => {
    setDetailsDialog({
      open: true,
      order: orderRow,
    });
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialog({
      open: false,
      order: null,
    });
  };

  // Called by overlay when "Update Status" is pressed
  const handleUpdateStatusFromOverlay = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus(orderId, newStatus));

      // Optimistically update local overlay order
      setDetailsDialog((prev) =>
        prev.order
          ? {
              ...prev,
              order: { ...prev.order, orderStatus: newStatus },
            }
          : prev
      );

      setSnackbar({
        open: true,
        message: `Order status updated to ${newStatus}`,
        severity: "success",
      });

      // Refresh table data
      dispatch(getAllOrders());
    } catch (error) {
      console.error("Status update error:", error);
      setSnackbar({
        open: true,
        message: `Failed to update status: ${
          error?.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Columns (NO updateStatus column now)
  const columns = [
    {
      id: "image",
      label: "Image",
      align: "left",
      render: (row) => {
        const firstItem = row.orderItems?.[0];
        const img = firstItem?.product?.imageUrl?.[0];
        const title = firstItem?.product?.title || `Order ${row._id}`;
        return (
          <Avatar
            src={img}
            alt={title}
            sx={{ width: 48, height: 48 }}
            variant="rounded"
            className="ring-1 ring-gray-200"
          />
        );
      },
    },
    {
      id: "orderId",
      label: "Order ID",
      accessor: "_id",
      maxWidth: 180,
      cellClass: "text-gray-800 font-mono text-xs",
      render: (row) => (
        <span className="block truncate max-w-[150px]">{row._id}</span>
      ),
    },
    {
      id: "customer",
      label: "Customer",
      render: (row) => {
        const first = row.user?.firstName || "";
        const last = row.user?.lastName || "";
        const name = `${first} ${last}`.trim() || "N/A";
        return name;
      },
      cellClass: "text-gray-800 font-medium",
    },
    {
      id: "email",
      label: "Email",
      accessor: "user.email",
      maxWidth: 200,
    },
    {
      id: "items",
      label: "Items",
      align: "center",
      render: (row) =>
        row.totalItem ??
        row.orderItems?.reduce((sum, it) => sum + (it.quantity ?? 1), 0) ??
        0,
    },
    {
      id: "total",
      label: "Total (₹)",
      align: "right",
      render: (row) =>
        (row.totalDiscountedPrice ?? row.totalPrice ?? 0).toLocaleString(),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row) => (
        <Chip
          label={row.orderStatus}
          color={getStatusColor(row.orderStatus)}
          size="small"
          sx={{
            textTransform: "uppercase",
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      ),
    },
    {
      id: "orderDate",
      label: "Order Date",
      render: (row) =>
        row.orderDate ? new Date(row.orderDate).toLocaleDateString() : "—",
    },
    {
      id: "view",
      label: "View",
      align: "center",
      render: (row) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleViewDetails(row)}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          View
        </Button>
      ),
    },
    {
      id: "delete",
      label: "Delete",
      align: "center",
      render: (row) => (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            handleDeleteClick(
              row._id,
              `${row.user?.firstName || ""} ${
                row.user?.lastName || ""
              } - Order ${row._id}`
            )
          }
          disabled={deleting}
          className="bg-red-500 hover:bg-red-600 text-white shadow-sm"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={orders.orders || orders || []}
        isLoading={loading}
        title="All Orders"
        emptyMessage="No orders found"
        pagination={null}
        headerContent={null}
        highlightQuery={highlightQuery}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be
            undone.
            <br />
            <strong>{deleteDialog.orderInfo}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={16} />}
            className="bg-red-500 hover:bg-red-600"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Overlay (separate component) */}
      <OrderDetailsOverlay
        open={detailsDialog.open}
        onClose={handleCloseDetailsDialog}
        order={detailsDialog.order}
        onUpdateStatus={handleUpdateStatusFromOverlay}
        updating={updating}
        ORDER_STATUSES={ORDER_STATUSES}
        getStatusColor={getStatusColor}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OrdersTable;
