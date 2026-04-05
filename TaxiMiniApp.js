import React from "react";
import { useTaxiAppState } from "./useTaxiAppState";
import TopScreen from "./TopScreen";
import StandbyScreen from "./StandbyScreen";
import RideScreen from "./RideScreen";
import HistoryModal from "./HistoryModal";
import FareScreen from "./FareScreen";

export default function TaxiMiniApp() {
  const state = useTaxiAppState();

  return (
    <div className="w-screen h-screen overflow-hidden bg-white relative">

      {state.screen === "top" && <TopScreen {...state} />}
      {state.screen === "standby" && <StandbyScreen {...state} />}
      {state.screen === "ride" && <RideScreen {...state} />}
      {state.screen === "fare" && <FareScreen {...state} />}

      {state.showHistory && (
        <HistoryModal {...state} />
      )}
    </div>
  );
}
