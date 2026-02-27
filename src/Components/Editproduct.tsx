import { FaSpinner } from "react-icons/fa";
import EditValidator from "../Api/EditValidator";

const Editproduct = () => {
  const { handleImageChange, handleSubmit, errors, product, products, imagePreview, register, loading } = EditValidator();

  return (
    <div className="w-full flex flex-col justify-center items-center py-12 px-4 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl">
        <h4 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Edit Product
        </h4>
        <p className="text-gray-500 text-sm mb-8">Update the product details below.</p>

        <form onSubmit={handleSubmit(product)} className="space-y-6">
          {/* ── IMAGE ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-3">Product Image</label>
            <div className="relative flex rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-orange-400 transition-colors bg-gray-50 cursor-pointer">
              <div className="w-full h-56 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview || products.image} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-3 opacity-20">🖼️</div>
                    <p className="text-gray-400 text-sm font-medium">Click to upload image</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                {...register("image", { required: false })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => { handleImageChange(e); register("image").onChange(e); }}
              />
            </div>
          </div>

          {/* ── CORE INFO ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-3">Basic Information</h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="Enter product name"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white transition-colors"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brand</label>
              <input
                type="text"
                {...register("brand")}
                placeholder="e.g., Nike, Samsung, Generic"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white transition-colors"
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
              <select
                {...register("category", { required: true })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white transition-colors"
              >
                <option value="">Select a category</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Phones">Phones</option>
                <option value="Home">Home</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Beauty">Beauty</option>
                <option value="Health">Health</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Toys">Toys</option>
                <option value="Baby">Baby</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea
                {...register("description", { required: true })}
                placeholder="Describe the product in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white resize-none transition-colors"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* ── PRICING ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-3">Pricing</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Selling Price (₦) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("price", { required: true, valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white transition-colors"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Original Price (₦)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Before discount"
                  {...register("originalPrice", { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white transition-colors"
                />
                {errors.originalPrice && <p className="text-red-500 text-xs mt-1">{errors.originalPrice.message}</p>}
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Discount (%)
                <span className="ml-2 text-xs text-gray-400 font-normal">Leave 0 to hide discount badge</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                {...register("discount", { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white transition-colors"
              />
              {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>}
              <p className="text-xs text-gray-400 mt-1">
                💡 If discount is set, the "X% OFF" badge will show on the product. Set to 0 to hide it.
              </p>
            </div>
          </div>

          {/* ── INVENTORY ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-3">Inventory</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register("quantity", { required: true, valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white transition-colors"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU</label>
                <input
                  type="text"
                  {...register("sku")}
                  placeholder="e.g., EXQ-001"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white transition-colors"
                />
                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
              </div>
            </div>

            {/* In Stock Toggle */}
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors">
              <input
                id="inStock"
                type="checkbox"
                {...register('inStock')}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <div>
                <span className="text-sm font-semibold text-gray-700">Mark as In Stock</span>
                <p className="text-xs text-gray-400">Override automatic stock detection</p>
              </div>
            </label>
          </div>

          {/* ── TAGS ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-3">Additional Details</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
              <input
                type="text"
                {...register("tags")}
                placeholder="e.g., summer, casual, trending (comma separated)"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm bg-white transition-colors"
              />
              {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>}
            </div>
          </div>

          {/* ── SUBMIT ── */}
          <div className="flex gap-3 pb-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-200"
            >
              {loading ? (
                <><FaSpinner className="animate-spin" /> Saving Changes...</>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editproduct;
