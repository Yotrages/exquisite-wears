import { useNavigate } from 'react-router-dom';
import { FaTshirt, FaLaptop, FaMobileAlt, FaHome, FaBook, FaBaby, FaFootballBall, FaHeartbeat } from 'react-icons/fa';

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Fashion', icon: FaTshirt, color: 'bg-pink-100', iconColor: 'text-pink-600' },
    { name: 'Electronics', icon: FaLaptop, color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { name: 'Phones', icon: FaMobileAlt, color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { name: 'Home', icon: FaHome, color: 'bg-green-100', iconColor: 'text-green-600' },
    { name: 'Books', icon: FaBook, color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { name: 'Baby', icon: FaBaby, color: 'bg-red-100', iconColor: 'text-red-600' },
    { name: 'Sports', icon: FaFootballBall, color: 'bg-orange-100', iconColor: 'text-orange-600' },
    { name: 'Health', icon: FaHeartbeat, color: 'bg-teal-100', iconColor: 'text-teal-600' },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-600">Discover products in your favorite categories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => navigate(`/search/${category.name}`)}
              className={`${category.color} rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`${category.iconColor} text-4xl`}>
                <category.icon />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 text-center">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
