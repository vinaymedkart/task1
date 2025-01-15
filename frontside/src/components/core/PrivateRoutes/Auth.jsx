// This will prevent non-authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function Auth({ children }) {
    const { token } = useSelector((state) => state.auth)

    if (token === null) {
        return <Navigate to="/login" />
    } else {
        return children
    }
}

export default Auth
