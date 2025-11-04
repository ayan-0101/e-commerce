import { useLocation, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ResetAllFilters({ className = '' }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if any filters are applied (safer check using URLSearchParams)
  const hasActiveFilters = () => {
    try {
      return Boolean(new URLSearchParams(location.search).toString());
    } catch (e) {
      return location.search && location.search.length > 1;
    }
  };

  // Reset all filters
  const handleResetAll = () => {
    const newSearch = '';
    navigate({ search: newSearch });
  };

  // Don't show button if no filters are active
  if (!hasActiveFilters()) {
    return null;
  }

  return (
    <button
      onClick={handleResetAll}
      className={`flex items-center gap-1 px-2 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors ${className}`}
    >
      <XMarkIcon className="h-4 w-4" />
      Reset All
    </button>
  );
}