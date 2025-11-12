export function updateSearchParam(navigate, location, key, value) {
  const sp = new URLSearchParams(location.search);

  if (value === undefined || value === null || value === "" || value.length === 0) {
    sp.delete(key);
  } else {
    sp.set(key, value);
  }

  // Always reset pagination if page param exists
  if (sp.has("page")) sp.delete("page");

  const queryString = sp.toString();
  navigate(queryString ? `?${queryString}` : "", { replace: false });
}
