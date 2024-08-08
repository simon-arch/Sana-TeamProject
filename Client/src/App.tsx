import useTokenRefresh from "./hooks/useTokenRefresh.ts";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";
import {useAppDispatch, useAppSelector} from "./hooks/redux.ts";
import Employees from "./pages/Employees.tsx";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import {useEffect} from "react";
import {setTokenPayload} from "./store/slices/accountSlice.ts";
import Dashboard from "./pages/Dashboard.tsx";


function App() {
    const dispatch = useAppDispatch();

    const { isLoggedIn } = useAppSelector(state => state.accountInfo);

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

                                <Route path="*" element={<Navigate to="/"/>}/>
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