import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";

export default function FilterSection({ section, idPrefix = 'filter', wrapperClass = '' }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    const sectionType = section.type;
    
    if (sectionType === 'checkbox') {
      let filterValues = searchParams.get(sectionId)?.split(",") || [];
      
      if (filterValues.includes(value)) {
        filterValues = filterValues.filter(item => item !== value);
      } else {
        filterValues.push(value);
      }
      
      if (filterValues.length === 0) {
        searchParams.delete(sectionId);
      } else {
        searchParams.set(sectionId, filterValues.join(","));
      }
    } 
    else if (sectionType === 'radio') {

      const currentValue = searchParams.get(sectionId);
      
      if (currentValue === value) {
        searchParams.delete(sectionId);
      } else {
        searchParams.set(sectionId, value);
      }
    }

    navigate({ search: searchParams.toString() ? `?${searchParams.toString()}` : '' });
  };

  const isSelected = (value) => {
    const searchParams = new URLSearchParams(location.search);
    const currentValues = searchParams.get(section.id)?.split(",") || [];
    return currentValues.includes(value);
  };

  const resetSectionFilter = (closeDropdown) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(section.id);
    navigate({ search: searchParams.toString() ? `?${searchParams.toString()}` : '' });
    closeDropdown(); // Close disclosure after reset
  };

  // Check if any options are selected for this section
  const hasSelectedOptions = () => {
    const searchParams = new URLSearchParams(location.search);
    const currentValues = searchParams.get(section.id);
    return currentValues && currentValues.length > 0;
  };

  return (
    <Disclosure as="div" className={wrapperClass}>
      {({ open, close }) => (
        <>
          <h3 className="flex items-center justify-between w-full">
            <DisclosureButton className="flex items-center px-2 py-3 text-gray-400 hover:text-gray-500 lg:px-0 bg-white group">
              <span className="font-medium text-gray-900 mr-2">{section.name}</span>
              <ChevronDownIcon
                aria-hidden="true"
                className={`h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-transform duration-500 ease-in-out ${
                  open ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </DisclosureButton>

            {open && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  resetSectionFilter(close);
                }}
                variant="outlined"
                color="error"
                size="small"
                disabled={!hasSelectedOptions()}
                sx={{
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  minWidth: 'auto',
                  opacity: hasSelectedOptions() ? 1 : 0.5,
                  cursor: hasSelectedOptions() ? 'pointer' : 'not-allowed'
                }}
              >
                Reset
              </Button>
            )}
          </h3>

          <DisclosurePanel className="pt-4">
            <div className="space-y-4 lg:space-y-4">
              {section.options.map((option, idx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    value={option.value}
                    checked={isSelected(option.value)}
                    id={`${idPrefix}-${section.id}-${idx}`}
                    name={`${section.id}[]`}
                    type={section.type}
                    onChange={() => handleFilter(option.value, section.id)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`${idPrefix}-${section.id}-${idx}`}
                    className="ml-3 text-sm text-gray-600 lg:text-gray-500 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}