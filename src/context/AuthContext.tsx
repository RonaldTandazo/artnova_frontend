import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useLogin, useSignUp, useRefreshToken, useRevokeToken } from '../services/Authentication/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { setAuthCallbacks } from '@/utils/ApolloClient';
import { User } from '@/custom/interfaces/general/GeneralInterfaces';
import { AuthContextType } from '@/custom/interfaces/Context/AuthContextInterfaces';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 1. Estados
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<null | ApolloError>(null);

    // 2. Hooks y Referencias
    const { signUp: SignUp, error: signUpError } = useSignUp();
    const { login: loginUser, data: signInData, error: signInError} = useLogin();
    const { refreshToken: refreshTokenProcess } = useRefreshToken();
    const { revokeToken: RevokeToken, data: revokeTokenData } = useRevokeToken();
    const navigate = useNavigate();

    // --- 3. Funciones (useCallback) ---
    const clearError = useCallback(() => {
        setErrorMessage(null)
    }, []);

    const finishLoading = useCallback(() => {
        setTimeout(() => {
            setLoading(false);
        }, 0);
    }, []);

    const logout = useCallback(async (token = refreshToken) => {
        if(token){
            try {
                setLoading(true)
                navigate('/signin');
                
                localStorage.removeItem("user");
                localStorage.removeItem("refreshToken");
                
                setUser(undefined);
                setAccessToken(null);
                setRefreshToken(null);
                setIsAuthenticated(false);

                await RevokeToken(token);
            } catch (error) {
                console.error("Sign In Error:", error);
            }finally{
                finishLoading();
            }
        }else{
            finishLoading();
        }
    }, [refreshToken]);

    const callRefreshTokenProcess = useCallback(async (token: string) => {
        try {
            const { data }: any = await refreshTokenProcess(token);
            if (data && data.refreshToken) {
                setAccessToken(data.refreshToken.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken.refreshToken);
                setRefreshToken(data.refreshToken.refreshToken);
                return data.refreshToken;
            }
            return null;
        } catch (err) {
            console.error("Error al refrescar el token:", err);
            throw err;
        }
    }, []);

    const tryRefreshOnLoad = useCallback(async (storedRefreshToken: string, storedUser: string) => {
        setLoading(true)
        try {
            const newTokens = await callRefreshTokenProcess(storedRefreshToken);
            if (newTokens) {
                setAccessToken(newTokens.accessToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
                finishLoading();
            } else {
                logout(storedRefreshToken);
            }
        } catch (err) {
            logout(storedRefreshToken);
        }
    }, []);

    useEffect(() => {
        if(revokeTokenData){
            setLoading(false)
        }
    }, [revokeTokenData])

    // --- 4. Lógica de Sincronización con Apollo ---

    useEffect(() => {
        setAuthCallbacks(
            () => accessToken,
            () => refreshToken,
            callRefreshTokenProcess,
            logout
        );
    }, [accessToken, refreshToken, logout, callRefreshTokenProcess]);

    // --- 5. Lógica de Carga Inicial ---

    useEffect(() =>{
        const storedUser = localStorage.getItem("user");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedUser && storedRefreshToken) {
            if(isTokenExpired(storedRefreshToken)){
                logout(storedRefreshToken);
            } else {
                tryRefreshOnLoad(storedRefreshToken, storedUser);   
            }
        }else{
            finishLoading();
        }
    }, []);

    // --- 6. Manejadores de Respuesta de Mutaciones (Login/SignUp) ---

    useEffect(() => {
        if (signInData && signInData.login) {
            try {
                const decodedToken = decodeToken(signInData.login.accessToken);

                localStorage.setItem('refreshToken', signInData.login.refreshToken);
                localStorage.setItem('user', JSON.stringify(decodedToken));
                setRefreshToken(signInData.login.refreshToken);
                setAccessToken(signInData.login.accessToken);

                setUser(decodedToken);
                setIsAuthenticated(true);
                navigate('/');
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        }
    }, [signInData]);

    useEffect(() => {
        if (signUpError) {
            setErrorMessage(signUpError);
        }
    }, [signUpError]);

    useEffect(() => {
        if (signInError) {
            setErrorMessage(signInError);
        }
    }, [signInError]);

    // --- 7. Funciones Públicas ---

    const login = useCallback(async (username: string, password: string, rememberMe: boolean) => {
        try {
            clearError()
            setLoading(true);
            await loginUser(username, password, rememberMe);
        } catch (error) {
            console.error("Sign In Error:", error);
        } finally {          
            finishLoading();
        }
    }, []);

    const signup = useCallback(async (firstName: string, lastName: string, email: string, username: string, password: string) => {
        try {
            clearError()
            setLoading(true);
            
            const response = await SignUp(firstName, lastName, email, username, password);
            if(response?.data){
                navigate("/SignIn");
            }
        } catch (error) {
            console.error("Sign Up Error:", error);
        } finally {          
            finishLoading();
        }
    }, []);

    const updateUser = useCallback((newUser: User) => {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    }, []);

    // --- 8. Renderizado del Contexto ---

    return (
        <AuthContext.Provider 
            value={{ 
                isAuthenticated, 
                signup, 
                login, 
                logout, 
                token: accessToken, 
                user, 
                loading, 
                error: errorMessage, 
                clearError, 
                updateUser 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const decodeToken = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        throw new Error("Token inválido");
    }
};

const isTokenExpired = (token: string) => {
    const decoded = decodeToken(token);
    return Date.now() >= decoded.exp * 1000;
};

const hasRememberMe = (token: string) => {
    const decoded = decodeToken(token);
    if(decoded.rememberMe){
        return true;
    }

    return false;
};
