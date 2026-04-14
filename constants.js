window.AppConstants = {
  BG: "#dfe5ee",
  GREEN: "#32CD32",
  NAV_ACTIVE: "#51BF2F",
  CARD: "#ffffff",
  TEXT: "#1f2a44",
  SUB: "#6e7a93",
  GOOD: "#28a26b",
  GRAPH_TEXT: "#445673",
  GRAPH_SUB: "#98a6bc",

  SHELL_W: 430,
  NAV_H: 112,

  TOP_LAYOUT: {
    SIDE: 20,

    LINE_1_CLOCK_TOP: 40,
    LINE_2_HEADER_BOTTOM: 180,
    LINE_3_BUTTON_TOP: 196,
    LINE_4_BUTTON_BOTTOM: 338,
    LINE_5_GREEN_BOTTOM: 346,
    LINE_6_CONTENT_TOP: 354,

    HEADER_H: 180,
    BUTTON_H: 142,
    CONTENT_PLACEHOLDER_H: 124,

    HEADER_INNER_X: 16,
    TOP_BAND_TOP: 40,
    LOWER_BAND_TOP: 118,
    LOWER_BAND_H: 50,

    CLOCK_RIGHT: 12,

    SWITCH_LABEL_TOP: 8,
    SWITCH_MAIN_BOTTOM: 4,
    PACE_DOT_SIZE: 10,

    WEATHER_DAY_FONT: 11,
    WEATHER_DAY_WIDTH: 40,
    WEATHER_DAY_HEIGHT: 12,
    WEATHER_ICON_SIZE: 22,

    WEATHER_COL2_RATIO: 0.2,
    WEATHER_COL3_RATIO: 0.3,

    WEATHER_DAY_TOP_INSET: 9,
    WEATHER_ICON_BOTTOM_INSET: 1,

    WEATHER_ALL_X_ADJUST: -31,
    WEATHER_DAY_X_ADJUST: 0,
    WEATHER_ICON_X_ADJUST: 0,
    WEATHER_DAY_Y_ADJUST: 0,
    WEATHER_ICON_Y_ADJUST: 0,

    TOP_MONEY_NUMBER_FONT: 26,
    TOP_MONEY_YEN_FONT: 20,
    TOP_MONEY_EYE_LEFT: "90%",
    TOP_MONEY_EYE_SIZE: 26,
    TOP_MONEY_EYE_BOTTOM: 5,
    TOP_MONEY_YEN_RIGHT: 72,
    TOP_MONEY_DIGITS_RIGHT: 96,
    TOP_MONEY_DIGITS_WIDTH: 170,

    GRAPH_CARD_H: 72,
    GRAPH_GAP_Y: 16,
    GRAPH_GAP_X: 14,
    GRAPH_TITLE_FONT: 16,
    GRAPH_SUB_FONT: 11,
    GRAPH_PAD_X: 14,
    GRAPH_PAD_TOP: 12,

    BOTTOM_BAND_H: 70,
    BOTTOM_BAND_RADIUS: 26,
    BOTTOM_BAND_BOTTOM: 0,

    NAV_CIRCLE_SIZE: 96,
    NAV_CIRCLE_TOP: -10,

    NAV_BLOCK_TOP: 18,
    NAV_BLOCK_HEIGHT: 40,
    NAV_BLOCK_GAP: 4,

    NAV_CENTER_TEXT_SIZE: 18,
    NAV_SIDE_TEXT_SIZE: 12,

    NAV_SIDE_ICON_SIZE: 31.2,
    NAV_MENU_ICON_SIZE: 30.8,
  },

  MAIN_BUTTON_SLOT_HEIGHT: 148,
  SHARED_INFO_SLOT_HEIGHT: 124,
  BOTTOM_NAV_HEIGHT: 112,
  HOME_END_SHEET_HEIGHT: 230,

  STANDBY_OTHER_MOVE_RANGE: 252,
  FINISH_ENABLE_OFFSET: 120,

  PASSENGER_ACTIVE: "#808C88",
  PASSENGER_INACTIVE: "#EBE9EA",

  PAYMENT_DISABLED: "#d3d3d3",
  PAYMENT_CASH: "#4242ff",
  PAYMENT_CARD: "#0aff84",
  PAYMENT_RECEIPT: "#ffff19",

  shadowSub: "shadow-[0_8px_16px_rgba(0,0,0,0.10)]",

  cardClass:
    "rounded-[8px] bg-white shadow-[0_8px_22px_rgba(0,0,0,0.08)]",

  mainButtonBase:
    "relative overflow-hidden w-full h-full rounded-[32px] text-white active:scale-[0.985] disabled:opacity-60 disabled:active:scale-100",

  mainButtonShine:
    "before:content-[''] before:absolute before:top-[10px] before:left-[18px] before:right-[18px] before:h-[54px] before:rounded-[28px] before:bg-[rgba(255,255,255,0.28)]",

  bigButtonText: "text-[34px] font-black tracking-[-0.03em]",

  smallButtonBase:
    "w-full h-[72px] rounded-[24px] text-[22px] font-bold shadow-[0_8px_16px_rgba(0,0,0,0.14)] active:scale-[0.985]",

  endDutyButtonClass:
    "relative overflow-hidden rounded-[18px] border border-[#d8c7c7] text-white font-bold shadow-[inset_0_2px_0_rgba(255,255,255,0.30),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)] active:scale-[0.985] bg-[linear-gradient(180deg,#8f8787,#7f7777,#706868)]",

  previewHeaderHeight: 32,
  previewViewportHeight: 156,
  previewRowHeight: 62,
};
