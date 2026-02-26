import { useNavigate } from 'react-router-dom';
import {
  FaTshirt, FaLaptop, FaMobileAlt, FaHome, FaBook,
  FaBaby, FaFootballBall, FaHeartbeat, FaGem, FaCamera, FaCarrot
} from 'react-icons/fa';
import { MdKitchen } from 'react-icons/md';
import { FaChevronRight } from 'react-icons/fa';

const categories = [
  { name: 'Fashion',     icon: FaTshirt,     bg: '#fff3e0', color: '#e65100', ring: '#f57c00' },
  { name: 'Electronics', icon: FaLaptop,     bg: '#e3f2fd', color: '#0d47a1', ring: '#1976d2' },
  { name: 'Phones',      icon: FaMobileAlt,  bg: '#f3e5f5', color: '#6a1b9a', ring: '#8e24aa' },
  { name: 'Home',        icon: FaHome,       bg: '#e8f5e9', color: '#1b5e20', ring: '#43a047' },
  { name: 'Books',       icon: FaBook,       bg: '#fffde7', color: '#f57f17', ring: '#fbc02d' },
  { name: 'Baby',        icon: FaBaby,       bg: '#fce4ec', color: '#880e4f', ring: '#e91e63' },
  { name: 'Sports',      icon: FaFootballBall, bg: '#fff3e0', color: '#bf360c', ring: '#ff5722' },
  { name: 'Health',      icon: FaHeartbeat,  bg: '#e0f2f1', color: '#004d40', ring: '#00897b' },
  { name: 'Jewellery',   icon: FaGem,        bg: '#fce4ec', color: '#c62828', ring: '#e53935' },
  { name: 'Kitchen',     icon: MdKitchen,    bg: '#f1f8e9', color: '#33691e', ring: '#7cb342' },
  { name: 'Cameras',     icon: FaCamera,     bg: '#e8eaf6', color: '#283593', ring: '#3f51b5' },
  { name: 'Food',        icon: FaCarrot,     bg: '#fff8e1', color: '#e65100', ring: '#fb8c00' },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="section-header mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-orange-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigate('/search/all')}
            className="section-link text-sm"
          >
            See all <FaChevronRight className="text-xs" />
          </button>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => navigate(`/search/${category.name}`)}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
              style={{ background: category.bg }}
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ background: category.color + '20', border: `2px solid ${category.ring}30` }}
              >
                <category.icon style={{ color: category.color }} className="text-lg sm:text-xl" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center leading-tight line-clamp-1">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
