import Select from "react-select"

const TeamSelect = ({ teams, team, setTeam }) => {

    const options = teams.map(t => ({ value: t.id, label: t.name }))

    const handleTeamSelectChange = selectedOption => {
        setTeam(selectedOption)
    }

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
            background: "#323644",
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
        dropdownIndicator: (provided) => ({
            ...provided,
            color: "#9AA5B5",
            "&:hover": {
                color: "#9AA5B5"
            }
        }),
        clearIndicator: (provided, state) => ({
            ...provided,
            color: state.isDisabled  ? "transparent" : "#9AA5B5",
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

    return (
        <Select
            isClearable
            options={options}
            onChange={handleTeamSelectChange}
            placeholder="Select a team"
            value={team}
            styles={selectStyles}
            noOptionsMessage={() => "No teams found"}
            components={{ IndicatorSeparator: () => null }}
        />
    )
}

export default TeamSelect