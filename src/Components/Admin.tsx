import AdminValidator from "../Api/AdminValidator";
import { FaSpinner } from "react-icons/fa";
import Button from "./Button";

const Admin = ({ type }: { type: string }) => {
  const {
    errors,
    handleImageChange,
    handleSubmit,
    products,
    imagePreview,
    register,
    loading,
    show,
    setShow,
    navigate
  } = AdminValidator();

  return (
    <div className="w-full flex flex-col justify-center items-center py-12 px-4">
     <div
          className={`bg-primary text-white fixed top-28 left-1/2 -translate-x-1/2 h-fit rounded-lg justify-center items-center z-10 transition-all duration-500 ease-in-out flex flex-col ${
            show ? "w-[180px] xs:w-[200px] opacity-100" : "w-0 opacity-0"
          } py-2 px-3`}
        >
          <p className="text-lg font-poppins font-semibold text-center">Do you want to continue posting</p>
          <span className="flex flex-row gap-5 items-center justify-between">
            <Button
              onSmash={() => setShow(false)}
              styles="hover:bg-green-400 bg-shadow rounded-full"
              router=""
              buttonText="yes"
            />
            <Button
              onSmash={() => navigate("/")}
              styles="hover:bg-green-400 bg-shadow rounded-full"
              router="/"
              buttonText="no"
            />
          </span>
        </div>
      <h4 className="text-center tracking-wider text-3xl font-bold xs:text-[45px] sm:text-[60px]">
        {type} post
      </h4>
      <form className="w-full" onSubmit={handleSubmit(products)}>
        <div className="flex flex-col items-center gap-9 w-full max-w-[500px] mt-9 sm:mt-20 px-3 mx-auto">
          <div className="flex flex-col items-center w-full gap-3">
            <label
              htmlFor="image"
              id="image"
              className="font-semibold text-xl sm:text-2xl orange_gradient"
            >
              Image
            </label>
            <span className="relative flex rounded-lg">
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] border-red-300 flex items-center justify-center bg-gray-200 rounded-lg">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-500">No image selected</span>
                )}
              </div>
              <input
                type="file"
                placeholder="Drop your image"
                {...register("image", { required: true })}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  handleImageChange(e);
                  register("image").onChange(e);
                }}
              />
            </span>
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="name"
              id="product"
              className="font-semibold text-lg sm:text-xl orange_gradient"
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
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="name"
              id="description"
              className="font-semibold text-[20px] orange_gradient"
            >
              Product description
            </label>
            <input
              type="text"
              {...register("description", { required: true })}
              placeholder="Enter product description"
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="originalPrice"
              id="originalPrice"
              className="font-semibold text-[20px] orange_gradient"
            >
              Original Price (optional)
            </label>
            <input
              type="number"
              placeholder="Enter original price if applicable"
              {...register("originalPrice", { valueAsNumber: true })}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.originalPrice && (
              <p className="text-red-500">{errors.originalPrice.message}</p>
            )}
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="price"
              id="price"
              className="font-semibold text-[20px] orange_gradient"
            >
              Price
            </label>
            <input
              type="text"
              placeholder="Enter product price"
              {...register("price", { required: true, valueAsNumber: true })}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="discount"
              id="discount"
              className="font-semibold text-[20px] orange_gradient"
            >
              Discount (%)
            </label>
            <input
              type="number"
              placeholder="Enter discount percentage, e.g., 20"
              {...register("discount", { valueAsNumber: true })}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.discount && (
              <p className="text-red-500">{errors.discount.message}</p>
            )}
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="brand"
              id="brand"
              className="font-semibold text-[20px] orange_gradient"
            >
              Brand (optional)
            </label>
            <input
              type="text"
              placeholder="Enter brand"
              {...register("brand")}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.brand && (
              <p className="text-red-500">{errors.brand.message}</p>
            )}
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="specifications"
              id="specifications"
              className="font-semibold text-[20px] orange_gradient"
            >
              Specifications (JSON)
            </label>
            <textarea
              placeholder='{"color":"black","size":"42mm"} - enter as JSON'
              {...register("specifications")}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300 h-28"
            />
            {errors.specifications && errors.specifications.message && (
              <p className="text-red-500">{String(errors.specifications.message)}</p>
            )}
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="seller"
              id="seller"
              className="font-semibold text-[20px] orange_gradient"
            >
              Seller name (optional)
            </label>
            <input
              type="text"
              placeholder="Enter seller name"
              {...register("seller")}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <label
              htmlFor="quantity"
              id="quantity"
              className="font-semibold text-[20px] orange_gradient"
            >
              Available quantity
            </label>
            <input
              type="number"
              placeholder="Enter number of available product quantity"
              {...register("quantity", { required: true, valueAsNumber: true })}
              className="w-full px-3 py-3 rounded-lg border border-[#ebebeb] bg-[#f2f2f2] focus:outline-red-300"
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-lg py-3 px-7 bg-white bg-shadow orange_gradient"
          >
            {" "}
            {loading ? (
              <p className="flex items-center gap-2 justify-center">
                <FaSpinner className="text-black animate-spin" />
                Create post
              </p>
            ) : (
              <p>Create post</p>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admin;
