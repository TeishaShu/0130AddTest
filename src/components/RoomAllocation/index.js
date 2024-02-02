import React, { useEffect, useState } from "react";
import CustomInputNumber from "./../CustomInputNumber"

const RoomAllocation = (props) => {
  const { guest, room, onChange } = props;
  const [orderData, setOrderData] = useState([])
  const [remainGuest, setRemainGuest] = useState(guest)

  useEffect(() => {
    const defaultOrder = Array.from({ length: room }, (_, index) => ({
      adult: 1,
      child: 0,
      ui_id: `room${index}`
    }));
    const defaultAdultNum = defaultOrder.reduce((sum, item) => sum + item.adult, 0)
    setRemainGuest(guest - defaultAdultNum)
    setOrderData(defaultOrder)
  }, [])

  const handleChangeOrder = (event, ui_id) => { // New value
    const value = event.target.value;
    const name = event.target.name;
    // console.log("New value:", { value, name, ui_id },orderData)
    // You can add logic here if needed
    // For now, no specific logic is applied
    console.log("CHANGE",{ value, name, ui_id });
    return
  }
  const handleOnBlur = (event, ui_id) => { // Final value
    const value = event.target.value;
    const name = event.target.name;
    console.log("blur");
    setOrderData(preOrderData => {
      const arrayIdx = preOrderData.findIndex(el => el.ui_id === ui_id)
      const updateData = JSON.parse(JSON.stringify(preOrderData))
      updateData[arrayIdx][name] = Number(value);

      // calculate the remaining guests for the current room
      calculateRemainGuest(updateData)

      // update
      if (onChange) onChange(updateData);
      return updateData
    })
  }

  const calculateRemainGuest = (updateData) => {
    const currentPeople = updateData.reduce((sum, item) => sum + item.child + item.adult, 0)
    setRemainGuest(guest - currentPeople)
  }

  return (
    <div style={{ width: '350px' }}>
      <div className="title">住客人數: {guest}人/{room}房</div>
      <div className="reminderMessage">尚未分配人數：{remainGuest}人</div>
      {orderData.map(el => {
        const roomPeople = 4;
        return (
          <div className="roomWrapper" key={el.ui_id}>
            <div className="title">房間：{Number(el.adult) + Number(el.child)}人</div>
            <div className="itemWrapper">
              <div className="itemLabel">
                大人
                <div>年齡 20+</div>
              </div>
              <CustomInputNumber
                min={1}
                max={Math.min(remainGuest, roomPeople - el.child)}
                step={1}
                name="adult"
                value={el.adult}
                disabled={false}//人數滿
                onChange={event => handleChangeOrder(event, el.ui_id)}
                onBlur={(event) => handleOnBlur(event, el.ui_id)}
              />
            </div>
            <div className="itemWrapper">
              <div className="itemLabel">
                小孩
              </div>
              <CustomInputNumber
                min={0}
                max={Math.min(remainGuest, roomPeople - el.adult)}
                step={1}
                name="child"
                value={el.child}
                disabled={false}
                onChange={event => handleChangeOrder(event, el.ui_id)}
                onBlur={(event) => handleOnBlur(event, el.ui_id)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RoomAllocation