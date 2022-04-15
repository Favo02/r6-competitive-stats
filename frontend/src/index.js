import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import Main from "./Main"

import "./styles/index.scss"

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <Main />
    </BrowserRouter>
)