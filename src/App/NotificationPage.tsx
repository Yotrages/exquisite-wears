import Layout from "../Components/Layout"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Notification from "../Components/Notification";

const NotificationPage = () => {
    const navigate = useNavigate();
      useEffect(() => {
        const token = localStorage.getItem('admin');
        console.log(token)
        const notAdmin = 'true'
        if (token !== notAdmin) {
          navigate('/login')
        }
      }, [navigate])
  return (
    <Layout>
        <Notification />
    </Layout>
)
}

export default NotificationPage;