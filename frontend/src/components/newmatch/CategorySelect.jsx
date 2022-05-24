import { useEffect, useState, useRef } from "react"
import CreatableSelect from "react-select/creatable"
// import { ActionMeta, OnChangeValue } from "react-select"

import teamService from "../../services/teams"

const selectStyles = {
    menuList: (provided) => ({
        ...provided,
        background: "#1D90F5"
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#FFFFFF"
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#9AA5B5 "
    }),
    control: (provided, state) => ({
        ...provided,
        width: "400px",
        background: state.isDisabled ? "#1c1f26" : "#323644",
        border: "1px solid #9AA5B5",
        color: state.isSelected ? "red" : "blue",
        padding: "10px 20px",
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? "#323644" : "#272A37",
        color: state.isSelected ? "#FFFFFF" : "#9AA5B5",
        padding: "10px 20px",
    }),
    dropdownIndicator: (provided, { isDisabled }) => ({
        ...provided,
        color: isDisabled  ? "transparent" : "#9AA5B5",
        "&:hover": {
            color: "#9AA5B5"
        }
    }),
    clearIndicator: (provided, { isDisabled }) => ({
        ...provided,
        color: isDisabled  ? "transparent" : "#9AA5B5",
        "&:hover": {
            color: "#9AA5B5"
        }
    }),
    input: (provided) => ({
        ...provided,
        color: "white",
    }),
    noOptionsMessage: (provided) => ({
        ...provided,
        background: "#323644",
        color: "#9AA5B5"
    }),
}

const CategorySelect = ({ team, user, setCategory }) => {

    // if team working select
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(false)

    const selectInputRef = useRef()

    // get the categories of the team selected
    useEffect(() => {
        // if no team selected no categories
        if (!team) {
            return
        }

        // clear the current selected
        selectInputRef.current.clearValue()

        // get the categories from database
        setLoading(true)
        teamService
            .getCategories(team.value, user.token)
            .then(categories => {
                setLoading(false)
                setOptions(categories)
            })
            .catch (exception => {
                setLoading(false)
                console.log(exception)
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
                    window.location.reload(false)
                    return
                }
                // if token invalid force logout (removing invalid token from local storage and then reloading)
                if (exception.response.data.error === "token expired") {
                    localStorage.removeItem("loggedCompStatsUser")
                    window.location.reload(false)
                    return
                }
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })

    }, [team])

    // if no team selected the category select is disabled
    if (!team) {
        return (
            <CreatableSelect
                ref={selectInputRef}

                isDisabled={true}

                placeholder="Select a team first"
                components={{ IndicatorSeparator: () => null }} // remove vertical separator
                styles={selectStyles}
            />
        )
    }

    // set category to parent state when the value is changed
    const handleChange = (inputValue) => {
        if (inputValue) {
            setCategory(inputValue.value)
        }
        else {
            setCategory(null)
        }
    }

    // create the new category
    const handleCreate = (inputValue) => {
        setLoading(true)

        // data validation
        if (! (/^[a-zA-Z0-9]((?!(-))|-(?!(-))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(inputValue))) {
            alert("Enter a valid category name: 4-20 characters long, alpanumeric and dash (-), no consecutive dashes, no dashes at start or end")
            setLoading(false)
            return
        }

        teamService
            .addCategory(team.value, inputValue, user.token)
            .then(updatedCategories => {
                setLoading(false)
                setOptions(updatedCategories)
            })
            .catch (exception => {
                setLoading(false)
                console.log(exception)
                // if token expired refresh the page to run Redirector.jsx that checks token expiration
                if (exception.response.data.error === "token expired") {
                    window.location.reload(false)
                    return
                }
                // if token invalid force logout (removing invalid token from local storage and then reloading)
                if (exception.response.data.error === "token expired") {
                    localStorage.removeItem("loggedCompStatsUser")
                    window.location.reload(false)
                    return
                }
                if (exception.response) {
                    console.log("Error", exception.response.status, ":", exception.response.data.error)
                }
            })
    }

    return (
        <CreatableSelect
            ref={selectInputRef}

            isClearable
            isLoading={loading}
            isDisabled={loading}

            onChange={handleChange}
            onCreateOption={handleCreate}

            options={options.map(o => ({ value: o, label: o }))}

            placeholder="Select or create a category"
            noOptionsMessage={() => "No categories found, type to create a new one"}
            components={{ IndicatorSeparator: () => null }} // remove vertical separator

            styles={selectStyles}
        />
    )
}

export default CategorySelect