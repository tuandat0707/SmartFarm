// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
// import { useGlobalContext } from "./context";
// import Home from "./pages/Home/Home";
// import Login from "./pages/Login/Login";
// import Dashboard from "./components/Dashboard";
// import Datalog from "./components/Datalog/Datalog";
// function App() {
//   const {user} = useGlobalContext();
//   const router = createBrowserRouter(createRoutesFromElements(
//     user ?(
// <Route path="/" element={<Home/>}>
//   <Route path="/" element={<Dashboard/>}/>
//   <Route path="/datalog" element={<Datalog/>}/>
  
// </Route>
//     ): (
// <Route path="/" element={<Login/>}/>
//       )
//   ))
//   return (
//     <RouterProvider router={router}/>
//   );
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './hooks/useAuthContext'


import WebsiteLayout from "./layouts/WebsiteLayout";
import LoginLayout from "./layouts/LoginLayout";

import Login from "./pages/Login";
import Signup from './pages/Signup'
import Dashboard from "./components/Dashboard";
import Control from "./pages/Control";
import Datalog from "./components/Datalog/Datalog";


const App = () => {
    const {user} = useAuthContext();

    return (<BrowserRouter>
        {user ?
            <Routes>
                <Route path="/" element={<WebsiteLayout />}>
                    <Route path="" element={<Dashboard />} />
                    <Route path="control" element={<Control />} />
                    <Route path="datalog" element={<Datalog />} />
                    <Route path="diagnose" element={<Dashboard />} />
                    <Route path="notification" element={<Dashboard />} />
                    {/* <Route path="login" element={<Login />} /> */}
                    {/* <Route path="signup" element={<Signup />} /> */}
                </Route>
            </Routes> :
            <LoginLayout>
                <Routes>
                    <Route path="/" element={<Navigate replace to="login" />} />
                    <Route path='/login' element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Routes>
            </LoginLayout>
        }
    </BrowserRouter>)
}

export default App;
