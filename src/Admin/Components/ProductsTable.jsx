import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductById,
  findProductAllProduct,
} from "../../State/Product/Action";
import { get } from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../customer/components/Navigations/SearchBar";
import CustomTable from "./HOC/Table"; // Import the reusable table

const ProductsTable = () => {
  const { product } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const allProducts = get(product, "products.content", []);
  const pageNumber = get(product, "products.currentPage", 1);
  const totalPages = get(product, "products.totalPages", 1);
  const isLoading = get(product, "isFetching", false);
  const querySearch = new URLSearchParams(location.search);
  const paramsObj = Object.fromEntries(querySearch.entries()).title;

  // Local state for delete confirmation
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
    productName: "",
  });
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchProducts = (page = 1) => {
    const data = {
      title: "",
      category: null,
      color: [],
      sizes: [],
      minPrice: "",
      maxPrice: "",
      minDiscount: "",
      stock: "",
      sort: "",
      pageNumber: page,
      pageSize: 10,
    };
    dispatch(findProductAllProduct(data));
  };

  const handlePagination = (event, value) => {
    fetchProducts(value);
  };

  const handleDeleteClick = (productId, productName) => {
    setDeleteDialog({
      open: true,
      productId,
      productName,
    });
  };

  const handleCloseDialog = () => {
    setDeleteDialog({
      open: false,
      productId: null,
      productName: "",
    });
  };

  const handleConfirmDelete = async () => {
    const { productId, productName } = deleteDialog;
    try {
      setDeleting(true);
      await dispatch(deleteProductById(productId));
      handleCloseDialog();

      setSnackbar({
        open: true,
        message: `"${productName}" deleted successfully`,
        severity: "success",
      });

      const remainingItems = allProducts.length - 1;
      const shouldGoToPreviousPage = remainingItems === 0 && pageNumber > 1;
      fetchProducts(shouldGoToPreviousPage ? pageNumber - 1 : pageNumber);
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message: `Failed to delete product: ${
          error?.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateClick = (productData) => {
    navigate("/admin/products/create", {
      state: { productData },
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchProducts(1);
  }, [dispatch]);

  // Define columns configuration
  const columns = [
    {
      id: "image",
      label: "Image",
      align: "left",
      render: (row) => (
        <Avatar
          src={row.imageUrl?.[0]}
          alt={row.title}
          sx={{ width: 56, height: 56 }}
          variant="rounded"
          className="ring-1 ring-gray-200"
        />
      ),
    },
    {
      id: "name",
      label: "Name",
      align: "left",
      accessor: "title",
      highlight: true, 
      maxWidth: 200,
      cellClass: "text-gray-800 font-medium",
    },
    {
      id: "price",
      label: "Actual Price",
      align: "right",
      render: (row) => `₹${row.price}`,
    },
    {
      id: "discountedPrice",
      label: "Discounted Price",
      align: "right",
      render: (row) => `₹${row.discountedPrice}`,
    },
    {
      id: "color",
      label: "Color",
      accessor: "color",
    },
    {
      id: "sizes",
      label: "Sizes",
      render: (row) =>
        row.size?.map((s, index) => (
          <span key={s._id ?? index} className="inline-block mr-1">
            {s.name?.toUpperCase?.() ?? s}
            {index < (row.size?.length ?? 0) - 1 ? ", " : ""}
          </span>
        )),
    },
    {
      id: "quantity",
      label: "Quantity",
      align: "right",
      accessor: "quantity",
    },
    {
      id: "category",
      label: "Category",
      accessor: "category.name",
    },
    {
      id: "delete",
      label: "Delete Action",
      render: (row) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleDeleteClick(row._id, row.title)}
          disabled={deleting}
          className="bg-red-500 hover:bg-red-600 text-white shadow-sm"
        >
          Delete
        </Button>
      ),
    },
    {
      id: "update",
      label: "Update Action",
      render: (row) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleUpdateClick(row)}
          disabled={deleting}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={allProducts}
        isLoading={isLoading}
        title="All Products"
        emptyMessage="No products found"
        pagination={{
          currentPage: pageNumber,
          totalPages: totalPages,
          onPageChange: handlePagination,
        }}
        headerContent={
          <span className="w-80 bg-white pr-2 pt-2 pb-2">
            <SearchBar />
          </span>
        }
        highlightQuery={paramsObj || ""}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.productName}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={16} />}
            className="bg-red-500 hover:bg-red-600 text-white shadow-sm"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default ProductsTable;
