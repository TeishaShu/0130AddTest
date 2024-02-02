import React, { useState, useRef, useMemo, useEffect } from "react";

const CustomInputNumber = (props) => {
  const { min = 0, max, step = 1, name, value, disabled, onChange, onBlur } = props;
  const [inputNumber, setInputNumber] = useState(value || 0);
  const [intervalId, setIntervalId] = useState(null);
  const [isMinDisabled, setIsMinDisabled] = useState(false);
  const [isMaxDisabled, setIsMaxDisabled] = useState(false);
  const hasBlurredRef = useRef(false);

  const minDisabled = useMemo(() => value <= min || disabled, [value, min, disabled])
  const maxDisabled = useMemo(() => value >= max || disabled, [value, max, disabled])


  useEffect(() => {
    if (minDisabled || maxDisabled) {
      stopAccumulating()
    }
  }, [minDisabled, maxDisabled]);

  const handleChange = (event, type) => {
    setInputNumber(pre => {
      let updateNum = 0;
      if (type === "input") updateNum = parseInt(event.target.value, 10) || 0;
      if (type === "plus") updateNum = Number(pre) + step;
      if (type === "minus") updateNum = Number(pre) - step;
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
      // setIsMinDisabled(updateNum <= min);
      // setIsMaxDisabled(updateNum >= max);


      if (updateNum <= min || updateNum >= max) {
        stopAccumulating()
        // setIsMinDisabled(true);
      }
      // if (updateNum === max) {
      //   handleMouseUp()
      //   setIsMaxDisabled(true);
      // }

      return updateNum;
    })
  }

  const handleMouseDown = (event, type) => {
    handleChange(event, type); // click once
    //多個判斷:按太久開始累加
    const id = setInterval(() => handleChange(event, type), 300);
    setIntervalId(id);
  }

  const stopAccumulating = () => {//停止累加
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
      return
    }
  }

  const handleOnBlur = (event, updateNum) => {
    stopAccumulating()
    event.target.name = name;
    event.target.value = updateNum || Number(inputNumber);
    console.log("handleOnBlur", { name, updateNum, inputNumber }, updateNum || Number(inputNumber));
    onBlur(event)
  }

  return (
    <div className="inputBox" onBlur={() => handleOnBlur({ target: { name, value: inputNumber } })}>
      <button
        type="button"
        disabled={minDisabled}
        onMouseDown={(event) => handleMouseDown(event, "minus")}
        onMouseUp={stopAccumulating}
        // onMouseLeave={handleMouseUp}
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
        onChange={event => handleChange(event, "input")}
      />
      <button
        type="button"
        disabled={maxDisabled}
        onMouseDown={(event) => handleMouseDown(event, "plus")}
        onMouseUp={stopAccumulating}
        // onMouseLeave={handleMouseUp}
        className={disabled ? "disabled" : ""}
      >
        <i className="fa fa-solid fa-plus"></i>
      </button>
    </div>
  )
}

export default CustomInputNumber;