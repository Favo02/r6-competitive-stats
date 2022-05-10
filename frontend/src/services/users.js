import axios from "axios"
const baseUrl = "/api/users"

// UNAUTH - create a new user
const create = async (username, email, password) => {

    const newUser = {
        username: username,
        email: email,
        password: password
    }

    const response = await axios.post(baseUrl, newUser)
    return response.data
}

export default {
    create
}