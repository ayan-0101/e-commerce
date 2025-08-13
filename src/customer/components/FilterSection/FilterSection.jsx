import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
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
    
    // Navigate to the new URL
    const query = searchParams.toString();
    navigate({ search: query ? `?${query}` : '' });
  };

  const isSelected = (value) => {
    const searchParams = new URLSearchParams(location.search);
    const currentValues = searchParams.get(section.id)?.split(",") || [];
    return currentValues.includes(value);
  };

  return (
    <Disclosure as="div" className={wrapperClass}>
      <h3 className="-mx-2 -my-3 flow-root lg:m-0">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500 lg:px-0">
          <span className="font-medium text-gray-900">{section.name}</span>
          <span className="ml-6 flex items-center">
            <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
            <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-4">
        <div className="space-y-4 lg:space-y-4">
          {section.options.map((option, idx) => (
            <div key={option.value} className="flex items-center">
              <input
                value={option.value}
                checked={isSelected(option.value)} // Use checked instead of defaultChecked
                id={`${idPrefix}-${section.id}-${idx}`}
                name={`${section.id}[]`}
                type={section.type}
                onChange={() => handleFilter(option.value, section.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`${idPrefix}-${section.id}-${idx}`}
                className="ml-3 text-sm text-gray-600 lg:text-gray-500"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}