import useProductValidator from "../Api/ProductValidator";
import Button from "./Button";
import { MessageRight } from "./Message";

const SkeletonCard = () => (
  <div className="animate-pulse flex flex-col h-fit mr-8 p-image bg-shadow rounded-lg bg-gray-200 gap-4 mb-6 pb-3">
    <div className="w-full h-[200px] bg-gray-300 rounded-lg"></div>
    <div className="flex flex-col gap-1 px-4">
      <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      <div className="h-4 bg-gray-400 rounded w-5/6"></div>
      <div className="h-4 bg-gray-400 rounded w-1/2"></div>
      <div className='h-7 bg-gray-400 rounded px-4 w-5/6'></div>
    </div>
  </div>
);

const Feeds = () => {
  const {
    handleEdit,
    deletePost,
    success,
    token,
    notAdmin,
    products,
    error,
    setCurrentPage,
    currentPage,
    totalPages,
  } = useProductValidator();

  const isLoading = products.length === 0; // If no products, assume loading

  return (
    <section className="py-20">
      <MessageRight success={success} error={error} />

      <div className="grid qy:grid-cols-3 md:grid-cols-4 grid-cols-2 sm:w-[88%] w-full sm:px-0 px-2 m-auto items-center gap-1 xs:gap-5">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />) // Show 6 skeleton loaders
          : products.map((item) => (
              <div
                key={item?._id}
                className="flex flex-col h-fit mr-8 p-image bg-shadow rounded-lg hover:scale-110 transition-all duration-500 bg-white gap-4 mb-6 pb-3"
              >
                <img
                  className="w-full h-fit object-cover aspect-square rounded-lg"
                  src={item?.image || "default-placeholder-image.jpg"}
                  alt={item?.name}
                />
                <div className="flex flex-col flex-wrap qy:gap-2.5 gap-1.5 px-4">
                  <h1 className="text-primary mb-1 header h-10 qy:h-0 font-light qy:text-base text-sm font-poppins">
                    {item?.name}
                  </h1>
                  <h1 className="text-primary header h-10 qy:h-0 text-wrap font-light qy:text-base text-sm font-poppins">
                    {item?.description}
                  </h1>
                  <p className="orange_gradient font-poppins font-semibold tracking-wide">
                    ${item?.price}
                  </p>
                  <Button
                    onSmash={() => console.log("pressed")}
                    styles="rounded-lg text-white hover:bg-green-500 text-center qy:text-base text-xs"
                    buttonText="Discuss product"
                    router="https://wa.me/08145534450"
                  />
                </div>
                {token === notAdmin && (
                  <div className="flex w-full px-4 justify-between h-fit sm:flex-row flex-col items-start sm:items-center gap-2">
                    <button
                      type="submit"
                      onClick={() => handleEdit(item._id)}
                      className="rounded-lg  gap-4 py-2 px-3 bg-black-gradient bg-shadow text-white font-semibold tracking-widest"
                    >
                      Edit
                    </button>
                    <button
                      type="submit"
                      onClick={() => deletePost(item._id)}
                      className="rounded-lg py-2 px-3 bg-red-500 bg-shadow text-white font-semibold tracking-widest"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
      </div>

      <div className="flex flex-row w-full items-center justify-center pt-5 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="bg-black rounded-full cursor-pointer px-4 py-2 text-white text-center"
        >
          Previous
        </button>
        <span className="bg-black text-white flex items-center justify-center font-poppins text-lg rounded-full size-10 text-center">
          {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className="bg-black px-4 py-2 rounded-full w-fit text-white text-center cursor-pointer"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Feeds;
