import { FaSpinner } from "react-icons/fa";
import EditValidator from "../Api/EditValidator";

const Editproduct = () => {
    const { handleImageChange, handleSubmit, errors, product, products, imagePreview, register, loading} = EditValidator()

  return (
    <div className="w-full flex flex-col justify-center items-center py-16 px-4">
      <h4 className="text-center tracking-wider text-3xl xs:text-[45px] sm:text-[60px] font-semibold">
        Edit post
      </h4>
      <form onSubmit={handleSubmit(product)}>
        <div className="flex flex-col items-center gap-9 w-full sm:max-w-[500px] mt-9 sm:mt-20 px-3 mx-auto">
          {/* Image */}
          <div className="flex flex-col items-center w-full gap-3">
            <label
              htmlFor="image"
              id="image"
              className="font-semibold text-[24px] orange_gradient"
            >
              Image
            </label>
            <span className="relative flex rounded-lg">
              <div className="sm:size-[350px] size-52 border-red-300 flex items-center justify-center bg-gray-200 rounded-lg">
                {imagePreview ? (
                  <img
                    src={imagePreview || products.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No image selected</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                placeholder="Drop your image"
                {...register("image", { required: false })}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  handleImageChange(e);
                  register("image").onChange(e);
                }}
              />
            </span>
          </div>

          {/* Product Name */}
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="name"
              className="font-semibold text-[20px] orange_gradient"
            >
              Product name
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Enter product name"
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="category"
              className="font-semibold text-[20px] orange_gradient"
            >
              Category
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            >
              <option value="">Select a category</option>
              <option value="Dresses">Dresses</option>
              <option value="Shirts">Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Jackets">Jackets</option>
              <option value="Accessories">Accessories</option>
              <option value="Footwear">Footwear</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="description"
              className="font-semibold text-[20px] orange_gradient"
            >
              Product description
            </label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Enter product description"
              rows={4}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="price"
              className="font-semibold text-[20px] orange_gradient"
            >
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter product price"
              {...register("price", { required: true, valueAsNumber: true })}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="quantity"
              className="font-semibold text-[20px] orange_gradient"
            >
              Available quantity
            </label>
            <input
              type="number"
              min="0"
              placeholder="Enter number of available product quantity"
              {...register("quantity", { required: true, valueAsNumber: true })}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          {/* In Stock Toggle */}
          <div className="flex items-center gap-3 w-full mt-2">
            <input
              id="inStock"
              type="checkbox"
              {...register('inStock')}
              className="w-4 h-4"
            />
            <label htmlFor="inStock" className="text-sm text-gray-700">Mark as in stock</label>
          </div>

          {/* SKU */}
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="sku"
              className="font-semibold text-[20px] orange_gradient"
            >
              SKU (Stock Keeping Unit)
            </label>
            <input
              type="text"
              {...register("sku", { required: false })}
              placeholder="e.g., EXQ-DRESS-001 (optional)"
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.sku && (
              <p className="text-red-500">{errors.sku.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="tags"
              className="font-semibold text-[20px] orange_gradient"
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              {...register("tags", { required: false })}
              placeholder="e.g., summer, casual, trending (optional)"
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.tags && (
              <p className="text-red-500">{errors.tags.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="rounded-lg py-3 px-7 bg-white bg-shadow orange_gradient"
          >
            {" "}
            {loading ? (
              <p className="flex items-center gap-2 justify-center">
                <FaSpinner className="text-black animate-spin" />
                Update
              </p>
            ) : (
              <p>Update post</p>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editproduct;
