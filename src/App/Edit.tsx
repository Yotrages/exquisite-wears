import Layout from '../Components/Layout'
import Editproduct from '../Components/Editproduct'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Edit = () => {
  const notAdmin = 'true'
  const Admin = localStorage.getItem('admin')
  const navigate = useNavigate()

  useEffect(() => {
    if (Admin === notAdmin) {
      console.log('true')
    } else {
      navigate('/login')
    }
  }, [notAdmin, Admin])
  return (
    <Layout>
        <Editproduct />
    </Layout>
  )
}

export default Edit