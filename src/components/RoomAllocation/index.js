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
        const adultMin = 1;
        const childMin = 0;
        const adultStep = 1;
        const childStep = 1;

        return (
          <div className="roomWrapper" key={el.ui_id}>
            <div className="title">房間：{Number(el.adult) + Number(el.child)}人</div>
            <div className="itemWrapper">
              <div className="itemLabel">
                大人
                <div>年齡 20+</div>
              </div>
              <CustomInputNumber
                min={adultMin}
                max={roomPeople - el.child}
                step={adultStep}
                name="adult"
                value={el.adult}
                disabled={!remainGuest}//人數滿
                onChange={event => handleChangeOrder(event, el.ui_id)}
                onBlur={(event) => { }}
              />
            </div>
            <div className="itemWrapper">
              <div className="itemLabel">
                小孩
              </div>
              <CustomInputNumber
                min={childMin}
                max={roomPeople - el.adult}
                step={childStep}
                name="child"
                value={el.child}
                disabled={!remainGuest}
                onChange={event => handleChangeOrder(event, el.ui_id)}
                onBlur={(event) => { }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RoomAllocation