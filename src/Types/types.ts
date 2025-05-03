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


export interface Users {
    email: string,
    id: string
}

export interface AuthResponse {
    user: Users
    token: string
}

export interface AuthorizationState {
    user: Users | null;
    token: string | null;
    isAuthenticated: boolean
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string
    password: string;
    confirm_password: string
}