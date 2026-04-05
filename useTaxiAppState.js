import { useState } from "react";

export function useTaxiAppState() {
  const [screen, setScreen] = useState("top");

  const [showHistory, setShowHistory] = useState(false);
  const [historyMode, setHistoryMode] = useState("simple"); // simple / full

  const openHistorySimple = () => {
    setHistoryMode("simple");
    setShowHistory(true);
  };

  const openHistoryFull = () => {
    setHistoryMode("full");
    setShowHistory(true);
  };

  return {
    screen,
    setScreen,
    showHistory,
    setShowHistory,
    historyMode,
    openHistorySimple,
    openHistoryFull,
  };
}
