import axios from "axios"
const baseUrl = "/api/users"

// AUTH - get full data of the current user
const getCurrent = async (token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const response = await axios.get(baseUrl, config)
    return response.data
}

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

// AUTH - edit user details
const editProfile = async (username, email, curPassword, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const editUser = {
        username: username,
        email: email,
        curPassword: curPassword,
        newPassword: curPassword,
        newPassword2: curPassword
    }

    const response = await axios.put(baseUrl, editUser, config)
    return response.data
}

// AUTH - edit user password
const editPassword = async (curPassword, newPassword, newPassword2, token) => {
    const config = {
        headers: { Authorization: `bearer ${token}` },
    }

    const editUser = {
        username: null,
        email: null,
        curPassword: curPassword,
        newPassword: newPassword,
        newPassword2: newPassword2
    }

    const response = await axios.put(baseUrl, editUser, config)
    return response.data
}

export default {
    getCurrent, create, editProfile, editPassword
}