import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import { findProductAllProduct } from "../../../State/Product/Action";
import { useNavigate, useLocation } from "react-router-dom";
import { updateSearchParam } from "../FilterSection/urlUtil";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginLeft: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flex: 1,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "28ch",
      },
    },
  },
}));

export default function SearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // initialize input value from URL ?title=...
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initial = params.get("title") || "";

  const [value, setValue] = useState(initial);

  // Debounce helper using timeout
  const useDebouncedCallback = (fn, wait = 450) => {
    const timerRef = useRef(null);
    return useCallback(
      (...args) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          fn(...args);
          timerRef.current = null;
        }, wait);
      },
      [fn, wait]
    );
  };

  // Run search: update URL and dispatch
  const runSearch = useCallback(
    (q) => {
      updateSearchParam(navigate, location, "title", q?.trim() || "");
      dispatch(findProductAllProduct({ title: q?.trim() || "" }));
    },
    [dispatch, navigate, location]
  );

  // debounced version for onChange
  const debouncedRunSearch = useDebouncedCallback(runSearch, 450);

  // When user types
  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    debouncedRunSearch(v);
  };

  // Immediate search on Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch(value);
    }
  };

  // Clear search handler
  const handleClear = () => {
    setValue("");
    updateSearchParam(navigate, location, "title", ""); // remove from URL
    dispatch(findProductAllProduct({ title: "" })); // refresh product list
  };

  // Keep input synced with URL changes
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const t = sp.get("title") || "";
    setValue(t);
  }, [location.search]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {/* Clear Button */}
      {value && (
        <IconButton
          size="small"
          onClick={handleClear}
          sx={{
            position: "absolute",
            right: 4,
            color: "gray",
            "&:hover": { color: "black" },
          }}
          aria-label="Clear search"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Search>
  );
}
