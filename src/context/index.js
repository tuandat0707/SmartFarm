import { useContext, createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = (props) => {
    const [user, setUser] = useState(true);

    return (
        <AppContext.Provider value={{ user, setUser }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppProvider;
export const useGlobalContext = () => useContext(AppContext);