import { useEffect, useMemo, useState } from "react";
import { get, map } from "lodash";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { FunnelIcon, Squares2X2Icon } from "@heroicons/react/20/solid";

import ProductCard from "./ProductCard";
import FiltersPanel from "../../components/FilterSection/FilterPanel";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProductAllProduct } from "../../../State/Product/Action";
import { Pagination } from "@mui/material";

export default function ProductPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  // product slice from redux - keep flexible (supports different shapes)
  const productSlice = useSelector((state) => state.product || {});
  const products = get(productSlice, "products.content", []) || [];
  const totalPages = get(productSlice, "products.totalPages", 0) || 0;
  const loading = get(productSlice, "loading", false);
  const error = get(productSlice, "error", null);

  // parse search params into a stable object (handles repeated params & comma-separated)
  const parsedSearch = useMemo(() => {
    const decoded = decodeURIComponent(location.search || "");
    const sp = new URLSearchParams(decoded);

    const getMulti = (key) => {
      const values = sp.getAll(key);
      if (!values || values.length === 0) return [];
      return values.flatMap((v) =>
        v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []
      );
    };

    const priceRange = sp.get("priceRange") || null;
    const [minPrice, maxPriceRaw] = priceRange ? priceRange.split("-") : [null, null];
    const maxPrice = maxPriceRaw === "above" ? null : maxPriceRaw;

    const pageNumber = sp.get("page") ? Math.max(1, Number(sp.get("page"))) : 1;
    const pageSize = sp.get("pageSize") ? Math.max(1, Number(sp.get("pageSize"))) : 10;

    return {
      raw: sp,
      category: params.levelThree || null,
      color: getMulti("color"),
      sizes: getMulti("size"),
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      minDiscount: sp.get("discount") || null,
      stock: sp.get("availability") || null,
      sort: sp.get("sort") || null,
      pageNumber,
      pageSize,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, params.levelThree]);

  // centralized fetch effect: maps parsedSearch into the API payload and dispatches
  useEffect(() => {
    const data = {
      category: parsedSearch.category,
      color: parsedSearch.color,
      sizes: parsedSearch.sizes,
      minPrice: parsedSearch.minPrice,
      maxPrice: parsedSearch.maxPrice,
      minDiscount: parsedSearch.minDiscount,
      stock: parsedSearch.stock,
      sort: parsedSearch.sort,
      pageNumber: parsedSearch.pageNumber,
      pageSize: parsedSearch.pageSize,
    };

    dispatch(findProductAllProduct(data));
  }, [dispatch, parsedSearch]);

  // pagination handler
  const handlePagination = (event, value) => {
    const sp = new URLSearchParams(location.search || "");
    sp.set("page", String(value));
    const searchString = sp.toString();
    navigate(searchString ? `?${searchString}` : "", { replace: false });
  };

  const listKeyForItem = (item) => item?._id || item?.id || JSON.stringify(item).slice(0, 12);

  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="w-56 m-3 bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
        aria-hidden="true"
      >
        <div className="h-64 bg-gray-200" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-6 bg-gray-200 rounded w-1/3 mt-3" />
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
          aria-label="Mobile filter dialog"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  aria-label="Close filters"
                >
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              <div className="px-4 mt-4">
                {/* FiltersPanel contains Sort + Filters + Reset */}
                <FiltersPanel idPrefix="filter-mobile" compact onClose={() => setMobileFiltersOpen(false)} />
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-baseline justify-between border-gray-200 pt-6">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                aria-label="Open filters"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
              {/* Filters (desktop) */}
              <div className="hidden lg:block">
                <div className="sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-auto pr-4">
                  <FiltersPanel idPrefix="filter-desktop" />
                </div>
              </div>

              {/* Product grid */}
              <div className="lg:col-span-4 w-full">
                {/* Header / result count */}
                <div className="flex items-center justify-between px-2 pb-4">
                  <div className="text-sm text-gray-600">
                    {loading ? (
                      <span>Loading products…</span>
                    ) : (
                      <span>
                        Showing{" "}
                        <strong className="text-gray-900">{products.length}</strong>{" "}
                        results
                      </span>
                    )}
                  </div>
                </div>

                {/* Actual list */}
                <div className="flex flex-wrap justify-center bg-white py-5">
                  {error && (
                    <div className="col-span-full w-full text-center py-10">
                      <p className="text-sm text-red-600">Error loading products.</p>
                      <p className="text-xs text-gray-500 mt-2">{String(error)}</p>
                    </div>
                  )}

                  {loading && renderSkeletons()}

                  {!loading && Array.isArray(products) && products.length === 0 && (
                    <div className="col-span-full w-full text-center py-10">
                      <p className="text-lg font-medium text-gray-700">No products found</p>
                      <p className="text-sm text-gray-500 mt-1">Try clearing some filters or using a different search.</p>
                    </div>
                  )}

                  {!loading &&
                    Array.isArray(products) &&
                    map(products, (item) => <ProductCard key={listKeyForItem(item)} product={item} />)}
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center pb-10">
            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                color="secondary"
                onChange={handlePagination}
                page={parsedSearch.pageNumber}
                showFirstButton
                showLastButton
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
