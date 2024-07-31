import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/styles/main.css";

import "./assets/styles/tab-account.css";

import OffCanvas from "./components/offcanvas";
import RoleMenu from "./components/tab-roles/rolemenu";

import {
    BsListColumns,
    BsFillQuestionCircleFill,
    BsFillPersonFill,
    BsDoorOpenFill,
    BsPencilSquare
} from "react-icons/bs";
import AccountWindow from "./components/account-info/account-window.tsx";
import AccountInfo from './components/account-info/account-info.tsx';
import {logout} from './store/slices/accountSlice.ts';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from './store';
import RoleManager from './components/tab-rolemanager/rolemanager.tsx';
import AdministrationWindow from "./components/tab-users-administration/administration-window.tsx";
import {hasPermission} from "./store/helper.ts";


function App() {
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        dispatch(logout());
    }

    const {isLoggedIn, user} = useSelector((state: RootState) => state.accountInfo);
    const permissions = user.permissions || [];
    const canViewUsers = hasPermission(permissions, "ViewUsers");

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
                            <li><OffCanvas title="Placeholder Tab" placement="start"
                                           trigger={<span className="menu-entry"><BsFillQuestionCircleFill
                                               className="menu-icon"/>Placeholder</span>}/></li>
                            <li><OffCanvas title="Placeholder Tab" placement="start"
                                           trigger={<span className="menu-entry"><BsFillQuestionCircleFill
                                               className="menu-icon"/>Placeholder</span>}/></li>
                            <hr/>
                            {isLoggedIn && (
                                <>
                                    <li className="menu-category">Main Menu</li>
                                    {canViewUsers && (
                                        <li>
                                            <OffCanvas title="Users Administration" placement="start"
                                                       className="w-100"
                                                       trigger={<span className="menu-entry"><BsFillQuestionCircleFill
                                                           className="menu-icon"/>Users Administration</span>}>
                                                <AdministrationWindow/>
                                            </OffCanvas>
                                        </li>
                                    )}
                                    <li>
                                        <OffCanvas permission="ManageUserPermissions" title="Permissions Tab"
                                                   placement="start"
                                                   trigger={<span className="menu-entry"><BsPencilSquare
                                                       className="menu-icon"/>Permissions</span>}>
                                            <RoleManager></RoleManager>
                                        </OffCanvas>
                                    </li>
                                    <li>
                                        <OffCanvas permission={["ViewUsers", "ManageUserRoles"]} title="Roles Tab"
                                                   placement="start"
                                                   trigger={<span className="menu-entry"><BsListColumns
                                                       className="menu-icon"/>Roles</span>} id="role-menu">
                                            <RoleMenu></RoleMenu>
                                        </OffCanvas>
                                    </li>
                                    <hr/>
                                    <li className="menu-category">Account</li>
                                    <li><OffCanvas title="About Tab" placement="start"
                                                   trigger={<span className="menu-entry"><BsFillPersonFill
                                                       className="menu-icon"/>About</span>}><AccountInfo/></OffCanvas>
                                    </li>
                                    <li><a onClick={handleLogout}><span className="menu-entry"
                                                                        id="menu-logout"><BsDoorOpenFill
                                        className="menu-icon"/>Logout</span></a></li>
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