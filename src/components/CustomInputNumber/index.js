import React, { useState, useMemo, useEffect } from "react";

const CustomInputNumber = (props) => {
  const { min = 0, max, step = 1, name, value, disabled, onChange, onBlur } = props;
  const [inputNumber, setInputNumber] = useState(value || 0);
  const [intervalId, setIntervalId] = useState(null);
  const minDisabled = useMemo(() => inputNumber <= min, [inputNumber, min])
  const maxDisabled = useMemo(() => inputNumber >= max || disabled, [inputNumber, max, disabled])

  useEffect(() => {
    if (minDisabled || maxDisabled) {
      stopAccumulating()
    }
  }, [minDisabled, maxDisabled]);

  const handleChangeInput = (event) => {
    const value = parseInt(event.target.value, 10) || 0;
    setInputNumber(value)
  }

  const handleIncrement = (event) => {
    const updateValue = Math.min(max, inputNumber + step)
    updateInputNumber(event, updateValue)
    setInputNumber(updateValue)

    startAccumulating(() => setInputNumber(pre => {
      const value = Math.min(max, pre + step);
      updateInputNumber(event, value)
      return value
    }))
  }

  const handleDecrement = (event) => {
    const updateValue = Math.max(min, inputNumber - step)
    updateInputNumber(event, updateValue)
    setInputNumber(updateValue)

    startAccumulating(() => setInputNumber(pre => {
      const value = Math.max(min, pre - step);
      updateInputNumber(event, value)
      return value
    }))
  }

  const updateInputNumber = (event, updateNum) => {
    event.target.value = updateNum;
    event.target.name = name;
    onChange(event)
  }

  const startAccumulating = (fun) => {
    const id = setInterval(() => fun(), 300);
    setIntervalId(id);
  }

  const stopAccumulating = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }

  const handleOnBlur = (event) => {
    stopAccumulating()
    event.target.name = name;
    event.target.value = Number(inputNumber);
    onBlur(event)
  }

  return (
    <div className="inputBox">
      {max}
      <button
        type="button"
        disabled={minDisabled}
        onMouseDown={handleDecrement}
        onMouseUp={stopAccumulating}
        onBlur={handleOnBlur}
        className={disabled ? "disabled" : ""}
      >
        <i className="fa fa-solid fa-minus"></i>
      </button>
      <input
        type="number"
        name={name}
        value={inputNumber}
        min={min}
        max={max}
        onChange={handleChangeInput}
        onBlur={handleOnBlur}
      />
      <button
        type="button"
        disabled={maxDisabled}
        onMouseDown={handleIncrement}
        onMouseUp={stopAccumulating}
        onBlur={handleOnBlur}
        className={disabled ? "disabled" : ""}
      >
        <i className="fa fa-solid fa-plus"></i>
      </button>
    </div>
  )
}

export default CustomInputNumber;