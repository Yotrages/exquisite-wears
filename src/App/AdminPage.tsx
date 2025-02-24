import { useEffect } from "react";
import Admin from "../Components/Admin";
import { useNavigate } from "react-router-dom";
import { Layout } from "../Components";

const AdminPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('admin');
    const notAdmin = 'true'
    if (token !== notAdmin) {
      navigate('/login')
    }
  }, [navigate])


  return (
    <Layout>
      <Admin type="Create"/>
    </Layout>
  )
}

export default AdminPage;