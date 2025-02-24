import { useForm } from "react-hook-form"
import { LoginForm, loginSchema } from "../Schema/LoginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import axios from "axios"
import { URL } from "./Endpoint"
import { useNavigate } from "react-router-dom"

const ForgotPasswordValidator = () => {
    const [success, setSuccess] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState(false)
    const navigate = useNavigate()
    const {handleSubmit, formState: {errors}, register, reset} = useForm<LoginForm>({resolver: zodResolver(loginSchema)})

    const ForgotPassword = (form: LoginForm) => {
        setLoading(true)
        const handleChange = async () => {
            const res = await axios.put(`${URL}/users/forgot`, form)
            
           try {
            if (res.status === 200) {
                setLoading(false)
                reset()
                setSuccess('Password updated successfully')
                await new Promise((resolve) => setTimeout(resolve, 3000))
                navigate('/login')
            }
           } catch (error : any) {
            if (error.response) {
                setError(error.response.data.message)
            } else if (error.request) {
                setError('Request failed, Check your connection')
            } else {
                setError('An unknown error occurred')
            }
           }
        }
        handleChange()
    }
    return { ForgotPassword, success, error, loading, errors, handleSubmit, register, password, setPassword}
}

export default ForgotPasswordValidator;