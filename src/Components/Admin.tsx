import AdminValidator from "../Api/AdminValidator";
import { FaSpinner } from "react-icons/fa";
import Button from "./Button";
import { MessageCenter } from "./Message";

const Admin = ({ type }: { type: string }) => {
  const {
    error,
    errors,
    handleImageChange,
    handleSubmit,
    navigate,
    success,
    products,
    show,
    imagePreview,
    register,
    loading,
    setShow
  } = AdminValidator();

  return (
    <div className="w-full flex flex-col justify-center items-center py-12 px-4">
     <MessageCenter error={error} success={success}/>
        <div
          className={`bg-primary text-white fixed top-7 h-fit justify-center items-center z-10 transition-all duration-500 ease-in-out flex flex-col ${
            show ? "w-[200px] opacity-100" : "w-0 opacity-0"
          } py-2 px-3`}
        >
          <p className="text-lg font-poppins font-semibold text-center">Do you want to continue posting</p>
          <span className="flex flex-row gap-5 items-center justify-between">
            <Button
              onSmash={() => setShow(false)}
              styles="hover:bg-green-400 bg-shadow rounded-lg"
              router=""
              buttonText="yes"
            />
            <Button
              onSmash={() => navigate("/")}
              styles="hover:bg-green-400 bg-shadow rounded-lg"
              router="/"
              buttonText="no"
            />
          </span>
        </div>
      <h4 className="text-center tracking-wider text-3xl font-bold xs:text-[45px] sm:text-[60px]">
        {type} post
      </h4>
      <form className="w-full" onSubmit={handleSubmit(products)}>
        <div className="flex flex-col items-center gap-9 w-full qy:w-[500px] mt-9 sm:mt-20 px-3 mx-auto">
          <div className="flex flex-col items-center w-full gap-3">
            <label
              htmlFor="image"
              id="image"
              className="font-semibold text-[24px] orange_gradient"
            >
              Image
            </label>
            <span className="relative flex rounded-lg">
              <div className="qy:size-[350px] md:size-[400px] size-64 border-red-300 flex items-center justify-center bg-gray-200 rounded-lg">
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
                  // Ensure the file is registered in the form
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
