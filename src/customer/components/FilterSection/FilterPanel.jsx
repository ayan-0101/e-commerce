import React, { useCallback, useMemo } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import FilterSection from "./FilterSection";
import { filters, sortOptions } from "../../pages/ProductPage/FilterData";
import { updateSearchParam } from "./urlUtil";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * FiltersPanel
 * - Renders sort controls + all filter sections
 * - Handles sorting by updating URL search params (same behavior as ProductPage previously)
 * - `compact` optionally hides some chrome for mobile, `onClose` can be used to close the mobile dialog
 */
export default function FiltersPanel({
  idPrefix = "filter-panel",
  compact = false,
  onClose,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // parsed current sort (memoized)
  const currentSort = useMemo(() => {
    try {
      const sp = new URLSearchParams(location.search || "");
      return sp.get("sort");
    } catch {
      return null;
    }
  }, [location.search]);

  const getCurrentSortLabel = useCallback(() => {
    if (!currentSort) return "Sort";
    const sel = sortOptions.find((s) => s.value === currentSort);
    return sel ? sel.name : "Sort";
  }, [currentSort]);

  // toggles sort in URL (if same -> remove)
  const handleSort = useCallback(
    (sortValue) => {
      const sp = new URLSearchParams(location.search);
      const current = sp.get("sort");
      const newSort = current === sortValue ? "" : sortValue;
      updateSearchParam(navigate, location, "sort", newSort);
      if (onClose) onClose();
    },
    [location, navigate, onClose]
  );

  return (
    <div className="w-full">
      {/* Top row: sort + reset (compact toggle hides label spacing for mobile) */}
      <div
        className={classNames(
          "flex items-center justify-between px-4",
          compact ? "py-2" : "py-3"
        )}
      >
        <div className="flex items-center gap-3">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                aria-label="Sort products"
              >
                <span className="mr-2 text-lg">{getCurrentSortLabel()}</span>
                <ChevronDownIcon
                  className="h-4 w-4 text-gray-500"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>

            <MenuItems className="absolute left-0 z-10 mt-2 w-56 rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {sortOptions.map((o) => (
                  <MenuItem key={o.value}>
                    {({ active }) => (
                      <button
                        onClick={() => handleSort(o.value)}
                        className={classNames(
                          currentSort === o.value
                            ? "font-semibold text-gray-900 bg-gray-100"
                            : "text-gray-700",
                          "block w-full text-left px-4 py-2 text-sm"
                        )}
                      >
                        {o.name}
                        {currentSort === o.value && (
                          <span className="ml-2 text-indigo-600">✓</span>
                        )}
                      </button>
                    )}
                  </MenuItem>
                ))}
                {currentSort && (
                  <>
                    <div className="border-t border-gray-100 my-1" />
                    <MenuItem>
                      <button
                        onClick={() => handleSort(currentSort)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600"
                      >
                        Clear Sort
                      </button>
                    </MenuItem>
                  </>
                )}
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>

      {/* Filters list */}
      <div className="mt-3">
        {filters.map((section) => (
          <FilterSection
            key={section.id}
            section={section}
            idPrefix={`${idPrefix}-${section.id}`}
            wrapperClass="border-t border-gray-200 px-4 py-6"
          />
        ))}
      </div>
    </div>
  );
}
