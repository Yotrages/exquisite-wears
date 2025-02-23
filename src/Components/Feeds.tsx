import ProductValidator from "../Api/ProductValidator";
import Button from "./Button";
import { MessageRight } from "./Message";

const Feeds = () => {
  
const { handleEdit, deletePost, success, token, notAdmin, products, error, setCurrentPage, currentPage, totalPages } = ProductValidator()
  return (
    <section className="py-20">
      <MessageRight success={success} error={error}/>
      <div className="grid qy:grid-cols-3 md:grid-cols-4 grid-cols-2 sm:w-[88%] w-full sm:px-0 px-3 m-auto items-center gap-5">
        {products.length > 0 &&
          products.map((item) => (
            <div
              key={item?._id}
              className="flex flex-col h-fit mr-8 p-image bg-shadow rounded-lg hover:scale-110 transition-all duration-500 bg-white gap-4 mb-6 pb-3"
            >
              <img
                className="w-full h-fit object-cover aspect-square rounded-lg"
                src={item?.image || "default-placeholder-image.jpg"}
                alt={item?.name}
              />
              <div className="flex flex-col  flex-wrap gap-3 px-4">
                <h1 className="text-primary mb-2 header  tracking-wide font-light font-poppins">
                  {item?.name}
                </h1>
                <h1 className="text-primary header text-wrap tracking-wide font-light font-poppins">
                  {item?.description}
                </h1>
                <p className="orange_gradient font-poppins font-semibold tracking-wide">
                  ${item?.price}
                </p>
                <Button onSmash={() => console.log('pressed')} styles="rounded-lg text-white hover:bg-green-500 text-center" buttonText="Discuss product" router="https://wa.me/08145534450"/>
              </div>
              {token === notAdmin && (
                <div className="flex w-full px-4 justify-between h-fit sm:flex-row flex-col items-start sm:items-center gap-2">
                  <button 
                    type="submit"
                    onClick={() => handleEdit(item._id)}
                    className="rounded-lg  gap-4 py-2 px-3 bg-black-gradient bg-shadow text-white font-semibold tracking-widest"
                  >Edit</button>
                  <button
                    type="submit"
                    onClick={() => deletePost(item._id)}
                    className="rounded-lg py-2 px-3 bg-red-500 bg-shadow text-white font-semibold tracking-widest"
                  >Delete</button>
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="flex flex-row w-full items-center justify-center pt-5 gap-4">
        <button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1} className="bg-black rounded-full cursor-pointer px-4 py-2 text-white text-center">Previous</button>
        <span className="bg-black text-white flex items-center justify-center font-poppins text-lg rounded-full size-10 text-center">
          {currentPage}
        </span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages} className="bg-black px-4 py-2 rounded-full w-fit text-white text-center">Next</button>
      </div>
    </section>
  );
};

export default Feeds;
