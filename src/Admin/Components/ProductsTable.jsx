import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductById,
  findProductAllProduct,
} from "../../State/Product/Action";
import { get } from "lodash";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../customer/components/Navigations/SearchBar";

/**
 * ProductsTable (styled)
 * - Soft indigo-tinted background
 * - Gradient header (purple → indigo → blue)
 * - Clean white rows with indigo hover glow
 * - Improved text colors and delete button styling
 *
 * Requires Tailwind for utility classes used in className.
 */

const ProductsTable = () => {
  const { product } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allProducts = get(product, "products.content", []);
  const pageNumber = get(product, "products.currentPage", 1);
  const totalPages = get(product, "products.totalPages", 1);
  const isLoading = get(product, "isFetching", false);

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

      // re-fetch current page (if page emptied, go to previous)
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
    console.log("object", productData);
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

  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center">
        <span className="w-80 bg-white pr-2 pt-2 pb-2 ">
          <SearchBar />
        </span>
        <Paper
          className="bg-gradient-to-r from-purple-900 to-purple-950"
          sx={{ width: "100%", overflow: "hidden" }}
        >
          {/* Header / title bar */}
          <div className="px-4 py-3 border-b border-gray-100 ">
            <h2 className="text-xl text-purple-900 font-semibold">
              All Products
            </h2>
          </div>

          <TableContainer sx={{ maxHeight: "calc(100vh - 230px)" }}>
            <Table
              stickyHeader
              aria-label="products table"
              className="min-w-full"
            >
              <TableHead>
                <TableRow className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
                  <TableCell className="text-white font-semibold">
                    Image
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    Name
                  </TableCell>
                  <TableCell align="right" className="text-white font-semibold">
                    Actual Price
                  </TableCell>
                  <TableCell align="right" className="text-white font-semibold">
                    Discounted Price
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    Color
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    Sizes
                  </TableCell>
                  <TableCell align="right" className="text-white font-semibold">
                    Quantity
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    Category
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    Delete Action
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    Update Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading && allProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : allProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <span className="text-gray-600">No products found</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  allProducts.map((row) => (
                    <TableRow
                      key={row._id}
                      className="bg-white hover:bg-indigo-50 transition-all duration-200"
                      sx={{
                        height: 80,
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Avatar
                          src={row.imageUrl?.[0]}
                          alt={row.title}
                          sx={{ width: 56, height: 56 }}
                          variant="rounded"
                          className="ring-1 ring-gray-200"
                        />
                      </TableCell>

                      <TableCell
                        sx={{ py: 2, maxWidth: 200 }}
                        className="text-gray-800 font-medium"
                      >
                        <span className="block truncate max-w-[240px]">
                          {row.title}
                        </span>
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{ py: 2 }}
                        className="text-gray-700"
                      >
                        ₹{row.price}
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{ py: 2 }}
                        className="text-gray-700"
                      >
                        ₹{row.discountedPrice}
                      </TableCell>

                      <TableCell sx={{ py: 2 }} className="text-gray-700">
                        {row.color}
                      </TableCell>

                      <TableCell sx={{ py: 2 }} className="text-gray-700">
                        {row.size?.map((s, index) => (
                          <span
                            key={s._id ?? index}
                            className="inline-block mr-1"
                          >
                            {s.name?.toUpperCase?.() ?? s}
                            {index < (row.size?.length ?? 0) - 1 ? ", " : ""}
                          </span>
                        ))}
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{ py: 2 }}
                        className="text-gray-700"
                      >
                        {row.quantity}
                      </TableCell>

                      <TableCell sx={{ py: 2 }} className="text-gray-700">
                        {row.category?.name || "N/A"}
                      </TableCell>

                      <TableCell sx={{ py: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleDeleteClick(row._id, row.title)}
                          disabled={deleting}
                          className="bg-red-500 hover:bg-red-600 text-white shadow-sm"
                        >
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleUpdateClick(row)}
                          disabled={deleting}
                          className="bg-red-500 hover:bg-red-600 text-white shadow-sm"
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <div className="flex justify-center py-4 border-t border-[#2e2e38]">
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePagination}
                showFirstButton
                showLastButton
                size="large"
                disabled={isLoading}
                sx={{
                  ".MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#7c3aed",
                    color: "#fff",
                  },
                }}
              />
            </div>
          )}
        </Paper>
      </div>

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
