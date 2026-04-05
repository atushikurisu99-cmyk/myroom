window.AppConstants = {
  MAIN_BUTTON_SLOT_HEIGHT: 148,
  SHARED_INFO_SLOT_HEIGHT: 116,
  HOME_BOTTOM_CARD_HEIGHT: 112,
  BOTTOM_NAV_HEIGHT: 82,

  PASSENGER_ACTIVE: "#e3e548",
  PASSENGER_INACTIVE: "#cfd6df",
  PAYMENT_DISABLED: "#d3d3d3",
  PAYMENT_CASH: "#4242ff",
  PAYMENT_CARD: "#0aff84",
  PAYMENT_RECEIPT: "#ffff19",

  shadowSub: "shadow-[0_8px_16px_rgba(0,0,0,0.10)]",
  cardClass:
    "rounded-[28px] bg-white border border-white/70 shadow-[0_8px_16px_rgba(0,0,0,0.10)]",
  mainButtonBase:
    "relative overflow-hidden w-full h-full rounded-[28px] text-white active:scale-[0.985] border border-white/60 shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-3px_8px_rgba(0,0,0,0.30),0_8px_16px_rgba(0,0,0,0.18)] disabled:opacity-60 disabled:active:scale-100",
  mainButtonShine:
    "before:content-[''] before:absolute before:top-[6px] before:left-3 before:right-3 before:h-[40%] before:rounded-full before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55),transparent)]",
  bigButtonText: "text-[30px] font-extrabold tracking-[-0.03em]",
  smallButtonBase:
    "relative overflow-hidden w-full rounded-[20px] border border-white/60 shadow-[inset_0_2px_0_rgba(255,255,255,0.65),inset_0_-2px_6px_rgba(0,0,0,0.20),0_6px_12px_rgba(0,0,0,0.14)] active:scale-[0.985]",
  endDutyButtonClass:
    "relative overflow-hidden rounded-[18px] border border-[#d8c7c7] text-white font-bold shadow-[inset_0_2px_0_rgba(255,255,255,0.30),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)] active:scale-[0.985] bg-[linear-gradient(180deg,#8f8787,#7f7777,#706868)]",

  historyRowMinHeight: 92,
};
