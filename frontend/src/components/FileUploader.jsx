import React, { useState, useEffect } from "react"

import ParseData from "../utilities/DataParser"

const FileUploader = () => {
    const [rawData, setRawData] = useState("")
    const [parsedData, setParsedData] = useState(null)

    const handleChange = (e) => {
        const fileReader = new FileReader()
        fileReader.readAsText(e.target.files[0], "UTF-8")
        fileReader.onload = e => {
            setRawData(e.target.result)
        }
    }

    useEffect(() => {
        if (rawData && rawData !== "") {
            setParsedData(ParseData(rawData))
        }
    }, [rawData])

    return (
        <>
            <h1>Upload Json file:</h1>

            <input type="file" onChange={handleChange} />
            <br />
            <pre>{JSON.stringify(parsedData, null, "\t")}</pre>
        </>
    )
}

export default FileUploader