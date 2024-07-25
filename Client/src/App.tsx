import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/styles/main.css";

import "./assets/styles/tab-account.css";

import OffCanvas from "./components/offcanvas";
import RoleMenu from "./components/tab-roles/rolemenu";

import { BsListColumns, BsFillQuestionCircleFill, BsFillPersonFill, BsDoorOpenFill } from "react-icons/bs";
import AccountWindow from "./components/account-info/account-window.tsx";
import AccountInfo from './components/account-info/account-info.tsx';
import { logout } from './store/slices/accountSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';



function App() {
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        dispatch(logout());
    }

    const { isLoggedIn } = useSelector((state: RootState) => state.accountInfo);

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 home-menu"> {/* User menu column */}
                        <ul>
                            <div id="account-window">
                                <AccountWindow/>
                            </div>
                            <hr/>
                            <li className="menu-category">Dashboard</li>
                            <li><OffCanvas title="Placeholder Tab" placement="start" trigger = {<span className="menu-entry"><BsFillQuestionCircleFill className="menu-icon"/>Placeholder</span>}/></li>
                            <li><OffCanvas title="Placeholder Tab" placement="start" trigger = {<span className="menu-entry"><BsFillQuestionCircleFill className="menu-icon"/>Placeholder</span>}/></li>
                            <hr/>
                            {isLoggedIn && (
                                <>
                                    <li className="menu-category">Main Menu</li>
                                    <li><OffCanvas title="Placeholder Tab" placement="start" trigger = {<span className="menu-entry"><BsFillQuestionCircleFill className="menu-icon"/>Placeholder</span>}/></li>
                                    <li><OffCanvas title="Placeholder Tab" placement="start" trigger = {<span className="menu-entry"><BsFillQuestionCircleFill className="menu-icon"/>Placeholder</span>}/></li>
                                    <li>
                                        <OffCanvas title="Roles Tab" placement="start" trigger = {<span className="menu-entry"><BsListColumns className="menu-icon"/>Roles</span>} id="role-menu">
                                            <RoleMenu></RoleMenu>
                                        </OffCanvas>
                                    </li>
                                    <hr/>
                                    <li className="menu-category">Account</li>
                                    <li><OffCanvas title="About Tab" placement="start" trigger = {<span className="menu-entry"><BsFillPersonFill className="menu-icon"/>About</span>}><AccountInfo/></OffCanvas></li>
                                    <li><a onClick={handleLogout}><span className="menu-entry" id="menu-logout"><BsDoorOpenFill className="menu-icon"/>Logout</span></a></li>
                                    <hr/>
                                </>
                            )}
                        </ul>
                    </div>
                    <div className="col-md-10"> {/* Main content column */}
                        <h1>Lorem Ipsum</h1>
                    </div>
                </div>
            </div>
        </>
    )
}
export default App