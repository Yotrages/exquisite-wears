import { Layout } from "../Components"
import Contact from "../Components/Contact"

const ContactPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
            <p className="text-lg text-gray-600">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>
          <Contact />
        </div>
      </div>
    </Layout>
  )
}

export default ContactPage
