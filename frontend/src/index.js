import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import Redirector from "./Redirector"

import "./styles/index.scss"

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <Redirector />
    </BrowserRouter>
)