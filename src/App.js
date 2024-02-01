import React from "react";
import RoomAllocation from "./components/RoomAllocation"

function App() {
  return (
    <div className="App">
      <RoomAllocation
        guest={10}
        room={3}
        onChange={result => console.log(result)}
      // [{ adult: 1, child: 0}, { adult: 1, child: 0 }, { adult: 1, child: 0 }]。
      />
    </div>
  );
}

export default App;