import React from "react";
import Room from "./../Room";

const RoomAllocation = (props) => {
  const { guest, room, onChange } = props;
  const roomArray = Array.from({ length: room }, (_, index) => index + 1);
  const aaa = [{
    adult: 1, child: 0
  }, { adult: 1, child: 0 }, { adult: 1, child: 0 }]

  return (
    <div style={{ width: '350px' }}>
      <div className="title">住客人數: {guest}人/{room}房</div>
      <div className="reminderMessage">尚未分配人數: 7人</div>
      {roomArray.map(el => (
        <Room key={`room${el}`} />
      ))}
    </div>
  )
}

export default RoomAllocation