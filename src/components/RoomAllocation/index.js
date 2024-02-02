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

      console.log("CHANGE", { value, name, ui_id, updateData });
      // calculate the remaining guests for the current room
      calculateRemainGuest(updateData)

      // update
      if (onChange) onChange(updateData);
      return updateData
    })
  }
  const handleOnBlur = (event, ui_id) => { // Final value
    const value = event.target.value;
    const name = event.target.name;
  }

  const calculateRemainGuest = (updateData) => {
    const currentPeople = updateData.reduce((sum, item) => sum + item.child + item.adult, 0)
    console.log("total", { guest, currentPeople }, guest - currentPeople);
    setRemainGuest(guest - currentPeople)
  }

  const maxAdult = (child) => {
    //最多4，要扣掉child
    //總人數剩下remainGuest
    //remainGuest有值&&room人數未滿4人.可以加到4

    const defaultRoomPeople = 4 - child;
    let maxNum = defaultRoomPeople
    if (remainGuest < defaultRoomPeople) {
      maxNum = (defaultRoomPeople + remainGuest) > 4 ? 4 : defaultRoomPeople + remainGuest
    }
    return maxNum
  }
  const maxChild = (adult) => {
    //最多4，要扣掉adult
    //總人數剩下remainGuest
    //remainGuest有值&&room人數未滿4人.可以加到4

    const defaultRoomPeople = 4 - adult;
    let maxNum = defaultRoomPeople
    if (remainGuest < defaultRoomPeople) {
      maxNum = (defaultRoomPeople + remainGuest) > 4 ? 4 : defaultRoomPeople + remainGuest
    }
    return maxNum
  }


  const roomAvailable = ( adult, child, room) => {
    const available = Math.min(remainGuest, room); 
    const used = adult + child;
    return available - used;
  };

  return (
    <div style={{ width: '350px' }}>
      <div className="title">住客人數: {guest}人/{room}房</div>
      <div className="reminderMessage">尚未分配人數：{remainGuest}人</div>
      {orderData.map(el => {
        const roomPeople = 4;
        const adultMin = 1;
        const childMin = 0;

        // console.log("el", { el, remainGuest }, "大人-全部人數4人房名額:", roomPeople - el.child, "min:", Math.min(remainGuest + adultMin, roomPeople - el.child),"...",remainGuest + adultMin);
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
                // max={Math.min(remainGuest, roomPeople - el.child)}
                max={roomAvailable(el.adult, el.child, 4)}
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
                min={childMin}
                max={roomAvailable(el.adult, el.child, 4)}
                // max={Math.min(remainGuest, roomPeople - el.adult)}
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