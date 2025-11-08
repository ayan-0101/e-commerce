import { useLocation, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { includes } from "lodash";

export default function ResetAllFilters({ className = "" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const hasActiveFilters = () => {
    try {
      const params = Boolean(new URLSearchParams(location.search).toString());
      return (!includes(location.search, "page") && params) 
    } catch (e) {
      return location.search && location.search.length > 1;
    }
  };

  const handleResetAll = () => {
    navigate({ search: "" });
  };

  if (!hasActiveFilters()) {
    return null;
  }

  return (
    <button
      onClick={handleResetAll}
      className={`flex items-center gap-1 px-2 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors ${className}`}
      aria-label="Reset all filters"
      title="Reset all filters"
    >
      <XMarkIcon className="h-4 w-4" />
      <span>Reset All</span>
    </button>
  );
}
