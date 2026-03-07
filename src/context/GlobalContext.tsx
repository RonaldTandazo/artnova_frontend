import { createContext, ReactNode, useContext, useState } from 'react';

interface GlobalContextType {
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);

    const contextValue: GlobalContextType = {
        loading,
        setLoading,
    };

    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalState = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobalState must be used within GlobalStateProvider');
    }
    return context;
};