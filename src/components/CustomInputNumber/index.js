import React, { useState } from "react";

const CustomInputNumber = (props) => {
  const { min, max, step, name, value, disabled, onChange, onBlur } = props;
  const [number, setNumber] = useState(0);
  const handleInputChange = (event) => {
    setNumber(event.target.value)
  }
  const handleChange = (type) => {
    

  }
  return (
    <div className="inputBox">
      <button
        type="button"
        disabled={disabled}
        onClick={() => handleChange("minus")}
      >
        <i className="fa fa-solid fa-minus"></i>
      </button>
      <input
        type="number"
        value={number}
        min={min || 0}
        max={max}
        onChange={handleInputChange}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => handleChange("plus")}
      >
        <i className="fa fa-solid fa-plus"></i>
      </button>
    </div>
  )
}

export default CustomInputNumber;