import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

/**
 * ReusableTable Component
 * 
 * @param {Object} props
 * @param {Array} props.columns - Column configuration
 *   Example: [
 *     { id: 'image', label: 'Image', align: 'left', render: (row) => <Avatar src={row.imageUrl} /> },
 *     { id: 'name', label: 'Name', align: 'left', accessor: 'title' },
 *     { id: 'price', label: 'Price', align: 'right', render: (row) => `₹${row.price}` },
 *   ]
 * @param {Array} props.data - Array of data objects
 * @param {Boolean} props.isLoading - Loading state
 * @param {Object} props.pagination - Pagination config { currentPage, totalPages, onPageChange }
 * @param {String} props.title - Table title
 * @param {String} props.emptyMessage - Message when no data
 * @param {Object} props.styling - Custom styling options
 * @param {Number} props.rowHeight - Height of each row (default: 80)
 * @param {React.ReactNode} props.headerContent - Optional content above table
 */
const CustomTable = ({
  columns = [],
  data = [],
  isLoading = false,
  pagination = null,
  title = "",
  emptyMessage = "No data found",
  styling = {},
  rowHeight = 80,
  headerContent = null,
  highlightQuery = "",
}) => {
  const {
    containerClass = "bg-gradient-to-r from-purple-900 to-purple-950",
    headerClass = "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600",
    rowClass = "bg-white hover:bg-indigo-50 transition-all duration-200",
    headerTextClass = "text-white font-semibold",
    cellTextClass = "text-gray-700",
  } = styling;

  const highlightText = (text, query) => {
    if (!query || typeof text !== "string") return text;
    
    const q = query.trim();
    if (!q) return text;

    const regex = new RegExp(`(${q})`, "ig");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          style={{
            backgroundColor: "#fff33b",
            padding: "0 2px",
            borderRadius: 2,
          }}
        >
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  // Render cell content based on column configuration
  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row);
    }
    
    // Get value (supports nested accessors)
    let value;
    if (column.accessor) {
      value = column.accessor.split('.').reduce((obj, key) => obj?.[key], row);
    } else {
      value = row[column.id];
    }
    
    if (value == null) return "N/A";
    
    // If this column should be highlightable, apply highlighting
    if (column.highlight && highlightQuery) {
      return highlightText(String(value), highlightQuery);
    }
    
    return value;
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      {/* Optional header content (e.g., search bar) */}
      {headerContent && headerContent}

      <Paper className={containerClass} sx={{ width: "100%", overflow: "hidden" }}>
        {/* Title bar */}
        {title && (
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-xl text-purple-900 font-semibold">{title}</h2>
          </div>
        )}

        <TableContainer sx={{ maxHeight: "calc(100vh - 230px)" }}>
          <Table stickyHeader aria-label="reusable table" className="min-w-full">
            <TableHead>
              <TableRow className={headerClass}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    className={headerTextClass}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading && data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                    <span className="text-gray-600">{emptyMessage}</span>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow
                    key={row._id || row.id || rowIndex}
                    className={rowClass}
                    sx={{
                      height: rowHeight,
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || "left"}
                        sx={{ py: 2, maxWidth: column.maxWidth || "auto" }}
                        className={column.cellClass || cellTextClass}
                      >
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center py-4 border-t border-[#2e2e38]">
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={pagination.onPageChange}
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
  );
};

export default CustomTable;