import App from "./App"
import { Provider } from "react-redux"
import { setupStore } from "./store/index"
import { createRoot } from "react-dom/client";
import OffCanvas from "./components/offcanvas";
import "./assets/styles/main.css";

import { Button } from "react-bootstrap";

const store = setupStore();
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <Provider store={store}>
        <App/>
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-1"> {/* User menu column */}
                    {/* usage examples */}
                    <ul>
                        <li><OffCanvas></OffCanvas></li>
                        <li><OffCanvas trigger = {<Button variant="success">Success</Button>}></OffCanvas></li>
                        <li><OffCanvas title="Custom Title Example" trigger = {<span>Text Button</span>} placement="bottom">
                            <img src="https://fastly.picsum.photos/id/1081/200/200.jpg?hmac=jyxOLb8HFEGU9gP9khyXdMjr1zDV7sT6gv1_mYxlheY"></img>
                        </OffCanvas></li>
                        <li><OffCanvas trigger = {<span>Data</span>} placement="top" className="w-25"></OffCanvas></li>
                        <li><OffCanvas trigger = {<span>Analytics</span>} id="canvas-halfscreen"></OffCanvas></li>
                    </ul>
                </div>
                <div className="col-md-11"> {/* Main content column */}
                    <h1>Lorem Ipsum</h1>
                </div>
            </div>
        </div>
    </Provider>
)