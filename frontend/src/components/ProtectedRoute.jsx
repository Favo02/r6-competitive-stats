import { Navigate } from "react-router-dom"

const ProtectedRoute = (props) => {
    const user = props.user
    if (!user) {
        return <Navigate to="/login" />
    }

    return <>{props.children}</>
}

export default ProtectedRoute