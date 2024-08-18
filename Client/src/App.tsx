import useTokenRefresh from "./hooks/useTokenRefresh.ts";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";
import {useAppDispatch, useAppSelector} from "./hooks/redux.ts";
import Employees from "./pages/Employees.tsx";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import {useEffect} from "react";
import {setTokenPayload} from "./store/slices/accountSlice.ts";
import Dashboard from "./pages/Dashboard.tsx";
import Vacations from "./pages/Vacations.tsx";
import About from "./pages/About.tsx";
import Organizer from "./pages/Organizer.tsx";

function App() {
    const dispatch = useAppDispatch();

    const isLoggedIn = useAppSelector(state => state.accountInfo.isLoggedIn);
    const role = useAppSelector(state => state.accountInfo.user.role);

    useEffect(() => {
        if (!isLoggedIn) {
            const token = localStorage.getItem('authToken');
            if (token != null)
                dispatch(setTokenPayload(token));
        }
    }, [dispatch, isLoggedIn]);

    useTokenRefresh();

    return (
        <BrowserRouter>
            { isLoggedIn
                ?
                <div className="container-fluid" style={{height: "100vh"}}>
                    <div className="row h-100">
                        <div className="col-2 p-0">
                            <Sidebar/>
                        </div>
                        <div className="col-10">
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/employees" element={<Employees/>}/>
                                <Route path="/vacations" element={<Vacations/>}/>
                                <Route path="/organizer" element={<Organizer/>}/>
                                <Route path="/about" element={<About/>}/>

                                <Route path="*" element={
                                    <Navigate to={
                                        role == "DEVELOPER" ? "/dashboard" :
                                        role == "USER_MANAGER" ? "/employees" :
                                        "/"
                                    }/>
                                }/> 
                            </Routes>
                        </div>
                    </div>
                </div>
                :
                <Routes>
                    <Route path="/login" element={<Login/>}/>

                    <Route path="*" element={<Navigate to="/login"/>}/>
                </Routes>
            }
        </BrowserRouter>
    )
}

export default App