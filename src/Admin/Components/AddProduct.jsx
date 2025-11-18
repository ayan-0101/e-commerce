import { useState, useEffect } from "react";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { createNewProduct, updateProductById } from "../../State/Product/Action";
import { Alert, Snackbar } from "@mui/material";
import { useLocation } from "react-router-dom";
import { get } from "lodash";

const AddProduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const editProductData = get(location, "state.productData", null);
  console.log("edit", editProductData);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(false);

  // Default form structure
  const defaultFormData = {
    title: "",
    description: "",
    price: "",
    discountedPrice: "",
    discountPercentage: "",
    quantity: "",
    brand: "",
    color: "",
    size: [
      { name: "xs", quantity: 0 },
      { name: "s", quantity: 0 },
      { name: "m", quantity: 0 },
      { name: "l", quantity: 0 },
      { name: "xl", quantity: 0 },
    ],
    imageUrl: [""],
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    ratings: [],
    reviews: [],
    numRatings: 0,
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Load edit data when component mounts
  useEffect(() => {
    if (editProductData && Object.keys(editProductData).length > 0) {
      setFormData({
        ...defaultFormData,
        ...editProductData,
        // Ensure size array exists and has proper structure
        size: Array.isArray(editProductData.size) && editProductData.size.length > 0
          ? editProductData.size
          : defaultFormData.size,
        // Ensure imageUrl is an array
        imageUrl: Array.isArray(editProductData.imageUrl) && editProductData.imageUrl.length > 0
          ? editProductData.imageUrl
          : defaultFormData.imageUrl,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-calculate total quantity from sizes
  useEffect(() => {
    if (Array.isArray(formData.size)) {
      const totalQuantity = formData.size.reduce(
        (sum, size) => sum + (Number(size.quantity) || 0),
        0
      );
      setFormData((prev) => ({ ...prev, quantity: totalQuantity }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.size]);

  // Auto-calculate discount percentage
  useEffect(() => {
    const price = Number(formData.price);
    const discountedPrice = Number(formData.discountedPrice);

    if (price > 0 && discountedPrice > 0 && discountedPrice < price) {
      const discount = Math.round(((price - discountedPrice) / price) * 100);
      setFormData((prev) => ({ ...prev, discountPercentage: discount }));
    } else if (discountedPrice >= price) {
      setFormData((prev) => ({ ...prev, discountPercentage: 0 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.price, formData.discountedPrice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discountedPrice" || name === "numRatings"
          ? Number(value) || ""
          : value,
    }));
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...formData.size];
    newSizes[index].quantity = Number(value) || 0;
    setFormData((prev) => ({ ...prev, size: newSizes }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.imageUrl];
    newImageUrls[index] = value;
    setFormData((prev) => ({ ...prev, imageUrl: newImageUrls }));
  };

  const addImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: [...prev.imageUrl, ""],
    }));
  };

  const removeImageUrl = (index) => {
    if (formData.imageUrl.length > 1) {
      const newImageUrls = formData.imageUrl.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, imageUrl: newImageUrls }));
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const handleSubmit = async () => {
    // validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.discountedPrice ||
      !formData.brand ||
      !formData.color ||
      !formData.topLevelCategory ||
      !formData.secondLevelCategory ||
      !formData.thirdLevelCategory
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields!",
        severity: "error",
      });
      return;
    }

    const productData = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      discountedPrice: Number(formData.discountedPrice),
      discountPercentage: Number(formData.discountPercentage),
      quantity: Number(formData.quantity),
      brand: formData.brand,
      color: formData.color,
      size: formData.size.map((s) => ({
        name: s.name,
        quantity: Number(s.quantity),
      })),
      imageUrl: formData.imageUrl.filter((url) => url.trim() !== ""),
      ratings: formData.ratings || [],
      reviews: formData.reviews || [],
      numRatings: formData.numRatings || 0,
      topLevelCategory: formData.topLevelCategory,
      secondLevelCategory: formData.secondLevelCategory,
      thirdLevelCategory: formData.thirdLevelCategory,
    };

    try {
      setLoading(true);

      if (editProductData && editProductData._id) {
        // UPDATE flow
        const updated = await dispatch(updateProductById(editProductData._id, productData));
        setSnackbar({
          open: true,
          message: "Product updated successfully!",
          severity: "success",
        });

        // Optionally: update local form with returned updated values (keeps UI consistent)
        if (updated) {
          setFormData((prev) => ({ ...prev, ...updated }));
        }
      } else {
        // CREATE flow
        const created = await dispatch(createNewProduct(productData));
        setSnackbar({
          open: true,
          message: "Product created successfully!",
          severity: "success",
        });

        // reset only after create
        resetForm();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setSnackbar({
        open: true,
        message: editProductData
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-6">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-2xl">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-lg font-semibold text-gray-800">
              {editProductData ? "Updating Product..." : "Creating Product..."}
            </p>
          </div>
        </div>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div className="max-w-screen-xl mx-auto">
        {/* Page header */}
        <div className="mb-6 flex items-center gap-3">
          <Upload className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            {editProductData ? "Edit Product" : "Create New Product"}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information (wider) */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Pirate-Party Tshirt"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Lightweight and breathable comfortable t-shirts..."
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Lowkey"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Black"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing (small card) */}
          <div className="col-span-1 bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-green-900 mb-4">
              Pricing
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="499"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Discounted Price *
                </label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="339"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Discount %
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Total Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Sizes + Categories + Images in ONE row */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sizes */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold text-purple-900 mb-4">
                Size Quantities
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {formData.size?.map((size, index) => (
                  <div key={size.name} className="flex items-center gap-3">
                    <label className="w-20 text-sm font-medium text-gray-700 uppercase">
                      {size.name}
                    </label>
                    <input
                      type="number"
                      value={size.quantity}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                      min="0"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      disabled={loading}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold text-pink-900 mb-4">
                Categories
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Top Level *
                  </label>
                  <input
                    type="text"
                    name="topLevelCategory"
                    value={formData.topLevelCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Category"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Second Level *
                  </label>
                  <input
                    type="text"
                    name="secondLevelCategory"
                    value={formData.secondLevelCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Clothing"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Third Level *
                  </label>
                  <input
                    type="text"
                    name="thirdLevelCategory"
                    value={formData.thirdLevelCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Anime"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-orange-900">
                  Images
                </h2>
                <button
                  onClick={addImageUrl}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                  disabled={loading}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {formData.imageUrl?.map((url, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) =>
                        handleImageUrlChange(index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="https://example.com/image.jpg"
                      disabled={loading}
                    />

                    {url && (
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        className="w-12 h-12 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}

                    {formData.imageUrl.length > 1 && (
                      <button
                        onClick={() => removeImageUrl(index)}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions - full width */}
          <div className="col-span-1 md:col-span-3 flex gap-4 justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {editProductData ? "Update Product" : "Create Product"}
            </button>
            <button
              onClick={resetForm}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
