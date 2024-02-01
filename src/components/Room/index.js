import React from "react";
import CustomInputNumber from "./../CustomInputNumber"

const Room = (props) => {
  const { } = props;

  return (
    <div className="roomWrapper">
      <div className="title">房間：1人</div>
      <div className="itemWrapper">
        <div className="itemLabel">
          大人
          <div>年齡 20+</div>
        </div>
        <CustomInputNumber />
      </div>
      <div className="itemWrapper">
        <div className="itemLabel">
          小孩
        </div>
        <CustomInputNumber />
      </div>
    </div>
  )
}

export default Room;