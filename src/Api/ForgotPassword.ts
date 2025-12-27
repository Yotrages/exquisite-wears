import { useForm } from "react-hook-form"
import { LoginForm, loginSchema } from "../Schema/LoginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import apiClient from "./axiosConfig"
import { useNavigate } from "react-router-dom"
import { PasswordResetResponse } from "./ApiResponses"
import toast from "react-hot-toast"

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
           try {
            const res = await apiClient.put<PasswordResetResponse>(`/users/forgot`, form)
            if (res.status === 200) {
                setLoading(false)
                reset()
                setSuccess('Password updated successfully')
                toast.success('Password updated successfully')
                await new Promise((resolve) => setTimeout(resolve, 2000))
                navigate('/login')
            }
           } catch (error : any) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to reset password';
            setError(errorMsg);
            toast.error(errorMsg);
            setLoading(false);
            setTimeout(() => setError(""), 5000);
           }
        }
        handleChange()
    }
    return { ForgotPassword, success, error, loading, errors, handleSubmit, register, password, setPassword}
}

export default ForgotPasswordValidator;