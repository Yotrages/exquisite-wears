import Layout from '../Components/Layout'
import Editproduct from '../Components/Editproduct'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchValidator from '../Api/Search'

const Edit = () => {
  const { userCredentials } = SearchValidator()
  const Admin = userCredentials?.isAdmin
  const navigate = useNavigate()

  useEffect(() => {
    if (Admin) {
      console.log('true')
    } else {
      navigate('/login')
    }
  }, [])
  return (
    <Layout>
        <Editproduct />
    </Layout>
  )
}

export default Edit