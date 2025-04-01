export interface User {
    _id: number
    name: string
    email: string
    password: string
}

export interface AuthState {
    user: User | null
    token: string | null
    loading: boolean
    error: string | null
    isAuthenticated : boolean
}

export interface RegisterResponse {
    token: string
    user: User
}