import App from "./App"

import { Provider } from "react-redux"
import { setupStore } from "./store"
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.css";


const store = setupStore();
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
)