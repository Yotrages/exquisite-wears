import { FaSpinner } from "react-icons/fa";
import { MessageRight } from "./Message";
import EditValidator from "../Api/EditValidator";

const Editproduct = ({ type }: { type: string }) => {
    const {success, handleImageChange, handleSubmit, error, errors, product, products, imagePreview, register, loading} = EditValidator()

  return (
    <div className="w-full flex flex-col justify-center items-center py-16 px-4">
      <MessageRight success={success} error={error}/>
      <h4 className="text-center tracking-wider text-3xl xs:text-[45px] sm:text-[60px] font-semibold">
        {type} post
      </h4>
      <form onSubmit={handleSubmit(product)}>
        <div className="flex flex-col items-center gap-9 w-full sm:max-w-[500px] mt-9 sm:mt-20 px-3 mx-auto">
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
