import { useCallback } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function FilterSection({
  section,
  idPrefix = "filter",
  wrapperClass = "",
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const getSearchParams = useCallback(() => {
    try {
      return new URLSearchParams(location.search);
    } catch {
      return new URLSearchParams();
    }
  }, [location.search]);

  const isSelected = useCallback(
    (value) => {
      const sp = getSearchParams();
      const raw = sp.get(section.id);
      if (!raw) return false;
      return raw.split(",").some((v) => v === value);
    },
    [getSearchParams, section.id]
  );

  const handleFilter = useCallback(
    (value) => {
      const sp = getSearchParams();
      const type = section.type;

      if (type === "checkbox") {
        const existing = sp.get(section.id);
        const values =
          existing && existing.length
            ? existing.split(",").filter(Boolean)
            : [];
        const idx = values.indexOf(value);
        if (idx >= 0) values.splice(idx, 1);
        else values.push(value);

        if (values.length === 0) sp.delete(section.id);
        else sp.set(section.id, values.join(","));
      } else if (type === "radio") {
        const current = sp.get(section.id);
        if (current === value) sp.delete(section.id);
        else sp.set(section.id, value);
      }

      // reset page to 1 when filters change
      if (sp.has("page")) sp.delete("page");

      const s = sp.toString();
      navigate(s ? `?${s}` : "");
    },
    [getSearchParams, navigate, section.type, section.id]
  );

  const resetSectionFilter = useCallback(() => {
    const sp = getSearchParams();
    sp.delete(section.id);
    if (sp.has("page")) sp.delete("page");
    const s = sp.toString();
    navigate(s ? `?${s}` : "");
  }, [getSearchParams, navigate, section.id]);

  const hasSelectedOptions = useCallback(() => {
    const sp = getSearchParams();
    const raw = sp.get(section.id);
    return Boolean(raw && raw.length);
  }, [getSearchParams, section.id]);

  return (
    <Disclosure as="div" className={wrapperClass}>
      {({ open }) => (
        <>
          <h3 className="flex items-center justify-between w-full">
            <DisclosureButton
              className="flex items-center px-2 py-3 text-gray-700 hover:text-gray-900 lg:px-0 bg-white group w-full"
              aria-expanded={open}
            >
              <span className="font-medium text-gray-900 mr-2">
                {section.name}
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </DisclosureButton>

            {open && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  resetSectionFilter();
                }}
                variant="outlined"
                color="error"
                size="small"
                disabled={!hasSelectedOptions()}
                sx={{
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  minWidth: "auto",
                  opacity: hasSelectedOptions() ? 1 : 0.5,
                  cursor: hasSelectedOptions() ? "pointer" : "not-allowed",
                }}
                aria-disabled={!hasSelectedOptions()}
                aria-label={`Reset ${section.name} filter`}
              >
                Reset
              </Button>
            )}
          </h3>

          <DisclosurePanel className="pt-4">
            <div className="space-y-3 lg:space-y-4">
              {section.options.map((option, idx) => {
                const inputId = `${idPrefix}-${section.id}-${idx}`;
                const checked = !!isSelected(option.value);
                return (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={inputId}
                      name={section.id}
                      type={section.type}
                      value={option.value}
                      checked={checked}
                      onChange={() => handleFilter(option.value)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      aria-checked={checked}
                    />
                    <label
                      htmlFor={inputId}
                      className="ml-3 text-sm text-gray-600 lg:text-gray-500 cursor-pointer select-none"
                    >
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
