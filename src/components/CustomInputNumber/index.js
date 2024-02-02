import React, { useState, useRef, useMemo, useEffect } from "react";

const CustomInputNumber = (props) => {
  const { min = 0, max, step = 1, name, value, disabled, onChange, onBlur } = props;
  const [inputNumber, setInputNumber] = useState(value || 0);
  const [intervalId, setIntervalId] = useState(null);
  const hasBlurredRef = useRef(false);
  const minDisabled = useMemo(() => inputNumber <= min || disabled, [inputNumber, min, disabled])
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
    updateInputNumber(event, inputNumber + step)
    setInputNumber(inputNumber + step)

    startAccumulating(() => setInputNumber(pre => {
      const value = Number(pre) + step;
      console.log({ value, min }, value <= min);
      if (value <= min) {
        updateInputNumber(event)
      }
      return value
    }))
  }

  const handleDecrement = (event) => {
    updateInputNumber(event, inputNumber - step)
    setInputNumber(inputNumber - step)

    startAccumulating(() => setInputNumber(pre => {
      const value = Number(pre) - step;
      if (value >= max) {
        updateInputNumber(event)
      }
      return value
    }))
  }

  const updateInputNumber = (event, updateNum) => {
    event.target.value = updateNum;
    event.target.name = name;
    console.log("updateInputNumber", { updateNum, name });
    onChange(event)
  }

  const handleChange = (updateNum, event) => {
    setInputNumber(pre => {
      // let updateNum = 0;
      // if (type === "input") updateNum = parseInt(event.target.value, 10) || 0;
      // if (type === "plus") updateNum = Number(pre) + step;
      // if (type === "minus") updateNum = Number(pre) - step;

      // number over setting
      console.log(type, updateNum);
      if (updateNum < min || updateNum > max) {
        updateNum = updateNum > max ? pre : min;
        event.target.value = updateNum;
        event.target.name = name;
        stopAccumulating()
        if (!hasBlurredRef.current) {
          handleOnBlur(event, updateNum);
          hasBlurredRef.current = true;
        }

      } else {
        event.target.value = updateNum;
        event.target.name = name;
        onChange(event)
      }

      // stop setInterval if already min or max
      if (updateNum <= min || updateNum >= max) {
        stopAccumulating()
      }

      return updateNum;
    })
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