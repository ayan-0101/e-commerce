// src/admin/components/OrdersTable.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTable from "./HOC/Table";
import { getAllOrders } from "../../State/Order/Action";

const OrdersTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders = [], loading, error } = useSelector((state) => state.order);
  const querySearch = new URLSearchParams(location.search);
  const highlightQuery = querySearch.get("title") || "";

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleViewDetails = (orderRow) => {
    navigate(`/order/${orderRow._id}`, { state: { order: orderRow } });
  };

  // Columns for orders
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
      maxWidth: 220,
      cellClass: "text-gray-800 font-mono text-xs",
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
      highlight: true, // if you later search by name
      cellClass: "text-gray-800 font-medium",
    },
    {
      id: "email",
      label: "Email",
      accessor: "user.email",
      maxWidth: 240,
    },
    {
      id: "items",
      label: "Items",
      align: "right",
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
      accessor: "orderStatus",
      cellClass: "uppercase text-xs font-semibold",
    },
    {
      id: "orderDate",
      label: "Order Date",
      render: (row) =>
        row.orderDate
          ? new Date(row.orderDate).toLocaleString()
          : "—",
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
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
  ];

  // Simple error display: you can replace with Snackbar if you want
  const errorBanner = error ? (
    <div className="w-full mb-2 text-center text-sm text-red-600">
      {typeof error === "string" ? error : error.message || "Failed to load orders"}
    </div>
  ) : null;

  return (
    <>
      {errorBanner}

      <CustomTable
        columns={columns}
        data={orders.orders}
        isLoading={loading}
        title="All Orders"
        emptyMessage="No orders found"
        pagination={null}
        headerContent={null}
        highlightQuery={highlightQuery}
      />
    </>
  );
};

export default OrdersTable;
