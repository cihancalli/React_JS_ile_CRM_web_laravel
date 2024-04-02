import React from "react";

const CustomInput = ({title,placeholder = title, type= "text", value, handleChange, forInput = "inputText"}) => {
    return (
        <div className="form-group">
            <label htmlFor={forInput}>{title}</label>
            <input type={type}
                   className="form-control"
                   placeholder={placeholder}
                   value={value}
                   onChange={handleChange}/>
        </div>
    );
};

export default CustomInput;
