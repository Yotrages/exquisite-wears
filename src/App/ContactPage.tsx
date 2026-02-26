import { Layout } from "../Components"
import Contact from "../Components/Contact"
import { Link } from "react-router-dom"
import { FaChevronRight } from "react-icons/fa"

const ContactPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <FaChevronRight className="text-[10px]" />
              <span className="text-gray-900 font-medium">Contact Us</span>
            </div>
            <div className="text-center py-6 sm:py-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold mb-4">
                💬 We're here to help
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Get In <span className="text-orange-500">Touch</span>
              </h1>
              <p className="text-gray-500 text-base max-w-md mx-auto">
                Have a question, feedback, or need support? Our team is ready to assist you.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <Contact />
        </div>
      </div>
    </Layout>
  )
}

export default ContactPage
