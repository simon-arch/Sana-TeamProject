import App from "./App"
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from "react-redux"
import { setupStore } from "./store/index"
import { createRoot } from "react-dom/client";

import OffCanvas from "./components/offcanvas";
import RoleMenu from "./components/tab-roles/rolemenu";

import { BsListColumns, BsFillQuestionCircleFill } from "react-icons/bs";
import "./assets/styles/main.css";

const store = setupStore();
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <Provider store={store}>
        <App/>
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 home-menu"> {/* User menu column */}
                    <ul>
                        <OffCanvas title="Account Info" placement="start" trigger = {<h4 style={{textAlign:"center"}}>FUTURE ACCOUNT INFO HERE</h4>}/>
                        <hr/>
                        <li className="menu-category">Dashboard</li>
                        <li><OffCanvas title="Placeholder Tab" placement="start" trigger = {<span className="menu-entry"><BsFillQuestionCircleFill className="menu-icon"/>Placeholder</span>}/></li>
                        <li><OffCanvas title="Placeholder Tab" placement="start" trigger = {<span className="menu-entry"><BsFillQuestionCircleFill className="menu-icon"/>Placeholder</span>}/></li>
                        <hr/>
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
                        <li><OffCanvas title="Placeholder Tab" placement="start" trigger = {<span className="menu-entry"><BsFillQuestionCircleFill className="menu-icon"/>Placeholder</span>}/></li>
                        <li><OffCanvas title="Placeholder Tab" placement="start" trigger = {<span className="menu-entry"><BsFillQuestionCircleFill className="menu-icon"/>Placeholder</span>}/></li>
                        <hr/>
                    </ul>
                </div>
                <div className="col-md-10"> {/* Main content column */}
                    <h1>Lorem Ipsum</h1>
                </div>
            </div>
        </div>
    </Provider>
)