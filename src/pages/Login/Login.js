import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router";
import "./Login.scss";
import BodyLogin from "../../components/BodyLogin/BodyLogin"; // Import BodyLogin

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    return (
        <BodyLogin
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            login={login}
            error={error}
            isLoading={isLoading}
            navigate={navigate}
        />
    );
};

export default Login;