import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from './hooks/useAuthContext';
import WebsiteLayout from "./layouts/WebsiteLayout";
import LoginLayout from "./layouts/LoginLayout";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import Dashboard from "./components/Dashboard";
import Control from "./pages/Control";
import Datalog from "./components/Datalog/Datalog";
import Logs from "./pages/Logs";
import { useGlobalContext } from './context/index';
import client from './utils/adafruit';

const App = () => {
    const { user } = useAuthContext();
    const { setTemperature, setLightIntensity, setHumidity, setLightBtn, setPumperBtn, setAirBtn, setStrawStatus } = useGlobalContext();

    console.log('App.jsx: User state:', user);
    console.log('App.jsx: Current route:', window.location.pathname);
    console.log('App.jsx: localStorage user:', localStorage.getItem('user'));

    client.on('message', (topic, message, packet) => {
        console.log("Received '" + message + "' on '" + topic + "'");
        switch (topic.split("/")[2]) {
            case 'humidity-sensor':
                setHumidity((message.toString()));
                break;
            case 'temperature-sensor':
                setTemperature((message.toString()));
                break;
            case 'light-sensor':
                setLightIntensity((message.toString()));
                break;
            case 'fan':
                setAirBtn((message.toString()));
                break;
            case 'strawberry-status':
                setStrawStatus((message.toString()));
                break;
            case 'pumper':
                setPumperBtn((message.toString()));
                break;
            case 'led':
                setLightBtn((message.toString()));
                break;
            default:
                break;
        }
    });

    return (
        <BrowserRouter>
            <Routes>
                {/* Routes using LoginLayout (no sidebar) */}
                <Route element={<LoginLayout />}>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
                {/* Routes using WebsiteLayout (with sidebar) */}
                <Route element={user ? <WebsiteLayout /> : <Login />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/control" element={<Control />} />
                    <Route path="/datalog" element={<Datalog />} />
                    <Route path="/diagnose" element={<Dashboard />} />
                    <Route path="/logs" element={<Logs />} />
                </Route>
                {/* Fallback route for debugging */}
                <Route path="*" element={<div>404: Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;