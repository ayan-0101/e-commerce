import { useEffect, useState } from "react";
import { get, map } from "lodash";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { mensKurta } from "../../../Data/mensKurta";
import { filters } from "./FilterData";

import ProductCard from "./ProductCard";
import FilterSection from "../../components/FilterSection/FilterSection";
import ResetAllFilters from "../../components/FilterSection/ResetAllFilters";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { findProductAllProduct } from '../../../State/Product/Action';

const sortOptions = [
  { name: "Price: Low to High", value: "price_low", current: false },
  { name: "Price: High to Low", value: "price_high", current: false }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {product} = useSelector(state => state);
  const products = get(product,('products.content'),{})
  const decodedQuery = decodeURIComponent(location.search);
  const urlSearchParams = new URLSearchParams(decodedQuery);
  const sort = urlSearchParams.get('sort');

  // Get current sort value from URL
  const searchParams = new URLSearchParams(location.search);
  const currentSort = searchParams.get('sort');

  const handleSort = (sortValue) => {
    const searchParams = new URLSearchParams(location.search);
    
    // If clicking the same sort option, remove it (toggle off)
    if (currentSort === sortValue) {
      searchParams.delete('sort');
    } else {
      searchParams.set('sort', sortValue);
    }
    
    navigate({ search: searchParams.toString() ? `?${searchParams.toString()}` : '' });
  };

  // Get the label of currently selected sort option
  const getCurrentSortLabel = () => {
    if (!currentSort) return "Sort";
    const selectedOption = sortOptions.find(opt => opt.value === currentSort);
    return selectedOption ? selectedOption.name : "Sort";
  };

  // Centralized fetch: parse URL search params and dispatch a single request
  // so that toggling filters / sort / page triggers just one API call.
  const params = useParams();
  useEffect(() => {
    const decoded = decodeURIComponent(location.search || '');
    const sp = new URLSearchParams(decoded);

    const colorParam = sp.getAll('color');
    // If colors are provided as a comma-separated single param, also handle that
    const colors = colorParam.length > 0
      ? colorParam.flatMap(c => c.split(',').filter(Boolean))
      : ([]);

    const sizesParam = sp.getAll('size');
    const sizes = sizesParam.length > 0
      ? sizesParam.flatMap(s => s.split(',').filter(Boolean))
      : ([]);

    const priceRange = sp.get('priceRange');
    const [minPrice, maxPriceRaw] = priceRange ? priceRange.split('-') : [null, null];
    const maxPrice = maxPriceRaw === 'above' ? null : maxPriceRaw;

    const data = {
      category: params.levelThree || null,
      color: colors, // action expects `color` (can be array)
      sizes: sizes, // action expects `sizes`
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      minDiscount: sp.get('discount') || null,
      stock: sp.get('availability') || null,
      sort: sp.get('sort') || null,
      pageNumber: sp.get('page') ? Number(sp.get('page')) : 1,
      pageSize: sp.get('pageSize') ? Number(sp.get('pageSize')) : 10,
    };

    // dispatch the centralized product fetch
    dispatch(findProductAllProduct(data));
  }, [location.search, params.levelThree, dispatch]);

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
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
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

               {/* Reset All Button - Mobile */}
              <div className="px-4 mt-4">
                <ResetAllFilters className="w-full justify-center" />
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <FilterSection
                    key={section.id}
                    section={section}
                    idPrefix="filter-mobile"
                    wrapperClass="border-t border-gray-200 px-4 py-6"
                  />
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-baseline justify-between border-gray-200 pt-6">
    
            <div className="flex items-center">
              {/* Reset All Filters - Desktop (visible on lg and above) */}
              <div className="hidden lg:flex lg:items-center lg:mr-4">
                <ResetAllFilters />
              </div>
              {/* Sort Menu */}
              <Menu as="div" className="relative inline-block text-right">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 ml-4">
                    {getCurrentSortLabel()}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-500 transition-transform duration-200 ease-in-out group-aria-expanded:rotate-180"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute left-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value}>
                        <button
                          onClick={() => handleSort(option.value)}
                          className={classNames(
                            currentSort === option.value
                              ? "font-medium text-gray-900 bg-gray-100"
                              : "text-gray-500",
                            "block w-full text-left px-5 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          )}
                        >
                          {option.name}
                          {currentSort === option.value && (
                            <span className="ml-2 text-indigo-600">✓</span>
                          )}
                        </button>
                      </MenuItem>
                    ))}
                    
                    {/* Clear Sort Option */}
                    {currentSort && (
                      <>
                        <div className="border-t border-gray-200 my-1" />
                        <MenuItem>
                          <button
                            onClick={() => handleSort(currentSort)}
                            className="block w-full text-left px-5 py-2 text-sm text-red-600 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          >
                            Clear Sort
                          </button>
                        </MenuItem>
                      </>
                    )}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
              
              {/* Filters */}
              <form className="hidden lg:block">
                {filters.map((section) => (
                  <FilterSection
                    key={section.id}
                    section={section}
                    idPrefix="filter-desktop"
                    wrapperClass="border-t border-gray-200 px-4 py-6"
                  />
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-4 w-full">
                <div className="flex flex-wrap justify-center bg-white py-5">
                  {map(products, (item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}