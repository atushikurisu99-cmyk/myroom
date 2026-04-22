window.AppComponents = (() => {
  const {
    formatMoney,
    formatTime,
    formatFullDate,
    formatDutyDate,
    recordType,
    getWeatherIcon,
  } = window.AppUtils;
  const C = window.AppConstants;
  const L = C.TOP_LAYOUT;

  function HomeIcon() {
    return (
      <div
        style={{
          width: `${L.NAV_SIDE_ICON_SIZE}px`,
          height: `${L.NAV_SIDE_ICON_SIZE}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          style={{ width: "100%", height: "100%", display: "block", fill: "#ffffff" }}
        >
          <path d="M3 11L12 3L21 11V20C21 20.5523 20.5523 21 20 21H14V14H10V21H4C3.44772 21 3 20.5523 3 20V11Z" />
        </svg>
      </div>
    );
  }

  function MenuDotsIcon() {
    const dots = [5, 12, 19];
    return (
      <svg
        width={L.NAV_MENU_ICON_SIZE}
        height={L.NAV_MENU_ICON_SIZE}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ display: "block", flexShrink: 0 }}
      >
        {dots.map((x) =>
          dots.map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" fill="white" />
          ))
        )}
      </svg>
    );
  }

  function SunWeatherIcon({ size = 22 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="5.2" fill="#F7B500" stroke="#E28A00" strokeWidth="1" />
        <g stroke="#F7B500" strokeWidth="1.6" strokeLinecap="round">
          <line x1="12" y1="1.8" x2="12" y2="4.5" />
          <line x1="12" y1="19.5" x2="12" y2="22.2" />
          <line x1="1.8" y1="12" x2="4.5" y2="12" />
          <line x1="19.5" y1="12" x2="22.2" y2="12" />
          <line x1="4.6" y1="4.6" x2="6.6" y2="6.6" />
          <line x1="17.4" y1="17.4" x2="19.4" y2="19.4" />
          <line x1="17.4" y1="6.6" x2="19.4" y2="4.6" />
          <line x1="4.6" y1="19.4" x2="6.6" y2="17.4" />
        </g>
      </svg>
    );
  }

  function PartlyCloudyWeatherIcon({ size = 22 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <g transform="translate(1,1)">
          <circle cx="8" cy="8" r="4.2" fill="#F7B500" stroke="#E28A00" strokeWidth="1" />
          <g stroke="#F7B500" strokeWidth="1.4" strokeLinecap="round">
            <line x1="8" y1="1.2" x2="8" y2="3.2" />
            <line x1="8" y1="12.8" x2="8" y2="14.8" />
            <line x1="1.2" y1="8" x2="3.2" y2="8" />
            <line x1="12.8" y1="8" x2="14.8" y2="8" />
            <line x1="3.4" y1="3.4" x2="4.9" y2="4.9" />
            <line x1="11.1" y1="11.1" x2="12.6" y2="12.6" />
            <line x1="11.1" y1="4.9" x2="12.6" y2="3.4" />
            <line x1="3.4" y1="12.6" x2="4.9" y2="11.1" />
          </g>
        </g>
        <g transform="translate(7,9)">
          <path
            d="M3.2 8.8H11.6C14 8.8 15.6 7.4 15.6 5.4C15.6 3.6 14.2 2.2 12.4 2.2C12 2.2 11.6 2.3 11.3 2.4C10.7 1 9.4 0 7.8 0C5.6 0 3.8 1.8 3.8 4C1.8 4.2 0.4 5.6 0.4 7.2C0.4 8.2 1.4 8.8 3.2 8.8Z"
            fill="#F3F5F8"
            stroke="#C8D0DA"
            strokeWidth="1"
          />
        </g>
      </svg>
    );
  }

  function WeatherMiniPair({ weather }) {
    const base = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(base.getDate() + 1);

    const nowIcon = getWeatherIcon(weather?.nowKind || "unknown");
    const tomorrowIcon = getWeatherIcon(weather?.tomorrowKind || "unknown");

    const renderIcon = (icon) => {
      if (icon === "☀️") return <SunWeatherIcon size={22} />;
      if (icon === "⛅") return <PartlyCloudyWeatherIcon size={22} />;
      return <span style={{ fontSize: "22px", lineHeight: 1 }}>{icon}</span>;
    };

    return (
      <>
        <div
          style={{
            position: "absolute",
            left: "31px",
            top: "49px",
            width: "40px",
            textAlign: "center",
          }}
        >
          <div className="text-[11px] font-semibold text-[#7a869f] leading-none">
            {`${base.getMonth() + 1}/${base.getDate()}`}
          </div>
          <div className="mt-[8px] flex items-center justify-center">
            {renderIcon(nowIcon)}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: "74px",
            top: "49px",
            width: "40px",
            textAlign: "center",
          }}
        >
          <div className="text-[11px] font-semibold text-[#7a869f] leading-none">
            {`${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`}
          </div>
          <div className="mt-[8px] flex items-center justify-center">
            {renderIcon(tomorrowIcon)}
          </div>
        </div>
      </>
    );
  }

  function HeaderCard({
    timeParts,
    cardMode,
    weather,
    totalAmount,
    amount1,
    amount2,
  }) {
    const hh = timeParts?.hh || "00";
    const mm = timeParts?.mm || "00";

    const labelBase = {
      position: "absolute",
      left: `${L.HEADER_INNER_X}px`,
      top: `${L.SWITCH_LABEL_TOP}px`,
      fontSize: "13px",
      lineHeight: "1",
      color: C.SUB,
      fontWeight: 700,
      whiteSpace: "nowrap",
    };

    const digitsBase = {
      position: "absolute",
      right: "18px",
      bottom: "0px",
      fontSize: "26px",
      color: C.TEXT,
      lineHeight: "1",
      whiteSpace: "nowrap",
      fontWeight: 700,
    };

    const yenBase = {
      position: "absolute",
      right: "0px",
      bottom: "1px",
      fontSize: "20px",
      color: C.TEXT,
      lineHeight: "1",
      fontWeight: 700,
      whiteSpace: "nowrap",
    };

    const renderBottom = () => {
      if (cardMode === 1) {
        return (
          <>
            <div style={labelBase}>合計</div>
            <div style={digitsBase}>{Number(totalAmount || 0).toLocaleString("ja-JP")}</div>
            <div style={yenBase}>円</div>
          </>
        );
      }

      if (cardMode === 4) {
        return (
          <>
            <div style={labelBase}>①</div>
            <div style={digitsBase}>{Number(amount1 || 0).toLocaleString("ja-JP")}</div>
            <div style={yenBase}>円</div>
          </>
        );
      }

      if (cardMode === 5) {
        return (
          <>
            <div style={labelBase}>②</div>
            <div style={digitsBase}>{Number(amount2 || 0).toLocaleString("ja-JP")}</div>
            <div style={yenBase}>円</div>
          </>
        );
      }

      return (
        <>
          <div style={labelBase}>今日のペース</div>

          <div
            style={{
              position: "absolute",
              left: `${L.HEADER_INNER_X}px`,
              bottom: "8px",
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              background: C.GOOD,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${L.HEADER_INNER_X + 16}px`,
              bottom: "2px",
              fontSize: "18px",
              lineHeight: "1",
              color: C.GOOD,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            良好
          </div>
        </>
      );
    };

    return (
      <button
        type="button"
        className="absolute bg-white shadow-[0_8px_22px_rgba(0,0,0,0.08)]"
        style={{
          left: `${L.SIDE}px`,
          right: `${L.SIDE}px`,
          top: "0px",
          height: `${L.HEADER_H}px`,
          borderRadius: "8px",
          zIndex: 5,
        }}
      >
        <WeatherMiniPair weather={weather} />

        <div
          className="absolute font-bold tracking-[-0.05em] leading-none"
          style={{
            top: `${L.TOP_BAND_TOP}px`,
            right: `${L.CLOCK_RIGHT}px`,
            fontSize: "68px",
            color: C.TEXT,
          }}
        >
          {hh}：{mm}
        </div>

        <div
          className="absolute left-0 right-0"
          style={{
            top: `${L.LOWER_BAND_TOP}px`,
            height: `${L.LOWER_BAND_H}px`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${L.HEADER_INNER_X}px`,
              right: `${L.HEADER_INNER_X}px`,
              bottom: `${L.SWITCH_MAIN_BOTTOM}px`,
              height: "28px",
            }}
          >
            {renderBottom()}
          </div>
        </div>
      </button>
    );
  }

  function MainButton({ label, type = "start", onClick, disabled = false }) {
    const bg =
      type === "start"
        ? "linear-gradient(180deg,#86e0b2 0%, #6dbb99 42%, #50937c 100%)"
        : type === "standby"
        ? "linear-gradient(180deg,#88c8f5 0%, #5b9bf0 44%, #3c73d8 100%)"
        : "linear-gradient(180deg,#f5d85e 0%, #ecb63c 42%, #d49326 100%)";

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="relative w-full rounded-[32px] text-white overflow-hidden shadow-[0_10px_22px_rgba(0,0,0,0.14)] disabled:opacity-60"
        style={{ height: `${L.BUTTON_H}px`, background: bg }}
      >
        <div className="absolute left-[18px] right-[18px] top-[10px] h-[54px] rounded-[28px] bg-[rgba(255,255,255,0.28)]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[34px] font-black tracking-[-0.03em]">{label}</span>
        </div>
      </button>
    );
  }

  function GraphCard({ title, sub }) {
    return (
      <div
        className="rounded-[18px] bg-[rgba(248,250,252,0.56)] border border-[rgba(255,255,255,0.14)] overflow-hidden"
        style={{
          height: `${L.GRAPH_CARD_H}px`,
          paddingLeft: `${L.GRAPH_PAD_X}px`,
          paddingRight: `${L.GRAPH_PAD_X}px`,
          paddingTop: `${L.GRAPH_PAD_TOP}px`,
          paddingBottom: "8px",
        }}
      >
        <div
          style={{
            fontSize: `${L.GRAPH_TITLE_FONT}px`,
            fontWeight: 900,
            color: C.GRAPH_TEXT,
            lineHeight: "1.1",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: "6px",
            fontSize: `${L.GRAPH_SUB_FONT}px`,
            fontWeight: 700,
            color: C.GRAPH_SUB,
            lineHeight: "1.1",
          }}
        >
          {sub}
        </div>
      </div>
    );
  }

  function TopGraphArea() {
    return (
      <div
        className="grid grid-cols-2"
        style={{
          columnGap: `${L.GRAPH_GAP_X}px`,
          rowGap: `${L.GRAPH_GAP_Y}px`,
        }}
      >
        <GraphCard title="売上" sub="グラフ" />
        <GraphCard title="本数" sub="推移" />
        <GraphCard title="時間帯" sub="動き" />
        <GraphCard title="分析" sub="入口" />
      </div>
    );
  }

  function RideInfoCard({ pickup, rideStartAt, elapsedText, viaStops }) {
    return (
      <div className="bg-white px-5 py-4 shadow-[0_8px_22px_rgba(0,0,0,0.08)] h-[124px]" style={{ borderRadius: "8px" }}>
        <div className="text-[18px] font-black text-[#1f2a44] truncate">
          {pickup || "取得中..."}
        </div>

        <div className="mt-4 flex justify-between items-end gap-4">
          <div>
            <div className="text-[12px] font-semibold text-[#6e7a93]">乗車時刻</div>
            <div className="mt-1 text-[18px] font-bold text-[#1f2a44] leading-none">
              {formatTime(rideStartAt)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[12px] font-semibold text-[#6e7a93]">経過時間</div>
            <div className="mt-1 text-[18px] font-bold text-[#1f2a44] leading-none">
              {elapsedText || "0分"}
            </div>
          </div>
        </div>

        {viaStops?.length > 0 && (
          <div className="mt-2 text-[11px] font-semibold text-[#6e7a93] truncate">
            経由あり（{viaStops.length}件）
          </div>
        )}
      </div>
    );
  }

  function HistoryRecordCard({ record, onClick }) {
    const type = recordType(record);

    return (
      <button
        type="button"
        onClick={() => onClick(record)}
        className={`w-full text-left rounded-2xl border border-slate-200 bg-white p-4 active:bg-slate-50 ${C.shadowSub}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xl font-bold text-slate-800">
              {formatMoney(record.金額)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {formatTime(record.乗車時刻)} → {formatTime(record.降車時刻)}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div
              className={`inline-flex min-w-[34px] justify-center rounded-full px-2.5 py-1 text-xs font-bold ${
                type === "1"
                  ? "bg-sky-100 text-sky-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {type === "1" ? "①" : "②"}
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              {type === "1" ? "現金" : "カード・QR / 領収証"}
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-1 text-sm text-slate-600">
          <div className="truncate">乗車地：{record.乗車地 || "未取得"}</div>
          <div className="truncate">降車地：{record.降車地 || "未取得"}</div>
          {record.備考 ? (
            <div className="truncate text-xs text-slate-500">備考：{record.備考}</div>
          ) : null}
          <div className="truncate text-xs text-slate-400">
            乗務日：{formatFullDate(record.乗務日 || record.乗車時刻)}
          </div>
        </div>
      </button>
    );
  }

  function BottomNavBlock({ type, label, onClick }) {
    if (type === "home") {
      return (
        <button
          type="button"
          onClick={onClick}
          style={{
            height: `${L.NAV_BLOCK_HEIGHT}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: `${L.NAV_BLOCK_GAP}px`,
            position: "relative",
            zIndex: 4,
          }}
        >
          <HomeIcon />
          <div
            style={{
              fontSize: `${L.NAV_SIDE_TEXT_SIZE}px`,
              fontWeight: 800,
              lineHeight: "1",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            ホーム
          </div>
        </button>
      );
    }

    if (type === "menu") {
      return (
        <button
          type="button"
          onClick={onClick}
          style={{
            height: `${L.NAV_BLOCK_HEIGHT}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: `${L.NAV_BLOCK_GAP}px`,
            position: "relative",
            zIndex: 4,
          }}
        >
          <MenuDotsIcon />
          <div
            style={{
              fontSize: `${L.NAV_SIDE_TEXT_SIZE}px`,
              fontWeight: 800,
              lineHeight: "1",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            メニュー
          </div>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          height: `${L.NAV_BLOCK_HEIGHT}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 4,
        }}
      >
        <div
          style={{
            fontSize: `${L.NAV_CENTER_TEXT_SIZE}px`,
            fontWeight: 900,
            lineHeight: "1",
            color: "#ffffff",
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
      </button>
    );
  }

  function BottomToggleArrow({ isOpen, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={isOpen ? "終了メニューを閉じる" : "終了メニューを開く"}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: `${L.BOTTOM_BAND_BOTTOM + L.BOTTOM_BAND_H - 52}px`,
          width: "38px",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          padding: 0,
          margin: 0,
          zIndex: 8,
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            transition: "transform 220ms cubic-bezier(0.22,1,0.36,1)",
            transform: `rotate(${isOpen ? 180 : 0}deg) scale(${isOpen ? 0.88 : 1})`,
            transformOrigin: "50% 50%",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            aria-hidden="true"
            style={{ display: "block" }}
          >
            <path
              d="M6 15L12 9L18 15"
              fill="none"
              stroke="#9aa3af"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    );
  }

  function BottomNav({
    centerLabel = "履歴",
    onHome,
    onCenter,
    onMenu,
    active = "home",
    isOpen = false,
    onToggle = null,
  }) {
    return (
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ height: `${L.NAV_H}px`, zIndex: 20 }}
      >
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: `${L.BOTTOM_BAND_BOTTOM}px`,
            height: `${L.BOTTOM_BAND_H}px`,
            background: C.GREEN,
            borderTopLeftRadius: `${L.BOTTOM_BAND_RADIUS}px`,
            borderTopRightRadius: `${L.BOTTOM_BAND_RADIUS}px`,
            overflow: "visible",
            zIndex: 1,
          }}
        />

        {typeof onToggle === "function" && (
          <BottomToggleArrow isOpen={isOpen} onClick={onToggle} />
        )}

        <div
          className="absolute inset-x-0"
          style={{
            bottom: `${L.BOTTOM_BAND_BOTTOM}px`,
            height: `${L.BOTTOM_BAND_H}px`,
            zIndex: 3,
          }}
        >
          <div className="absolute inset-0 grid grid-cols-3">
            {["home", "center", "menu"].map((key) => {
              const blockType = key === "center" ? "center" : key;
              const blockLabel = key === "center" ? centerLabel : "";
              const isActive = active === key;
              const onClick = key === "home" ? onHome : key === "center" ? onCenter : onMenu;

              return (
                <div key={key} className="relative">
                  {isActive && (
                    <div
                      className="absolute left-1/2"
                      style={{
                        top: `${L.NAV_CIRCLE_TOP}px`,
                        transform: "translateX(-50%)",
                        width: `${L.NAV_CIRCLE_SIZE}px`,
                        height: `${L.NAV_CIRCLE_SIZE}px`,
                        borderRadius: "999px",
                        background: C.NAV_ACTIVE,
                        zIndex: 2,
                      }}
                    />
                  )}

                  <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: `${L.NAV_BLOCK_TOP}px`,
                      zIndex: 4,
                    }}
                  >
                    <BottomNavBlock
                      type={blockType}
                      label={blockLabel}
                      onClick={onClick}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function OtherSheet({ show, onClose, openHistoryFull, onShowSoon }) {
    if (!show) return null;

    return (
      <div
        className="absolute inset-0 z-30 bg-slate-900/40 flex items-end"
        onClick={onClose}
      >
        <div
          className="w-full rounded-t-[28px] bg-white shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: "otherSheetUp 220ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="px-4 pt-3 pb-4">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-3"></div>
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-slate-800">メニュー</div>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
              >
                閉じる
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={onShowSoon}
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50"
              >
                分析
              </button>
              <button
                type="button"
                onClick={onShowSoon}
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 border-b border-slate-100 active:bg-slate-50"
              >
                設定
              </button>
              <button
                type="button"
                onClick={openHistoryFull}
                className="w-full px-4 py-4 text-left text-base font-semibold text-slate-800 active:bg-slate-50"
              >
                履歴
              </button>
            </div>
          </div>

          <style>{`
            @keyframes otherSheetUp {
              0% { transform: translateY(100%); }
              100% { transform: translateY(0); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  function PaymentDialog({
    amount,
    pickupMeta,
    dropoffMeta,
    paymentCountdown,
    savingDots,
    onCancel,
  }) {
    return (
      <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full rounded-[28px] bg-white shadow-2xl p-5">
          <div className="text-[34px] font-black text-slate-800 tracking-[-0.04em]">
            {formatMoney(amount)}
          </div>
          <div className="mt-5 text-[18px] font-bold text-slate-800">
            {paymentCountdown > 0.5
              ? `自動保存中${"・".repeat(Math.max(0, savingDots))}`
              : "保存中"}
          </div>
          <div className="mt-3 text-sm text-slate-500">
            乗車位置精度：
            {pickupMeta?.accuracy != null ? `${pickupMeta.accuracy}m` : "--"}
            <br />
            降車位置精度：
            {dropoffMeta?.accuracy != null ? `${dropoffMeta.accuracy}m` : "--"}
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="min-w-[92px] h-[44px] rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ViaDialog({ pendingViaPlace, onCancel, onRecord }) {
    return (
      <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full rounded-[28px] bg-white shadow-2xl p-5">
          <div className="text-[18px] font-bold text-slate-800">
            現在地を経由地として記録します
          </div>
          <div className="mt-3 text-sm text-slate-500 truncate">
            {pendingViaPlace || "未取得"}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold"
            >
              戻る
            </button>
            <button
              type="button"
              onClick={onRecord}
              className="h-[48px] rounded-2xl bg-slate-800 text-white font-bold"
            >
              記録
            </button>
          </div>
        </div>
      </div>
    );
  }

  function FinishDialog({ workDate, recordCount, totalAmount, onCancel, onConfirm }) {
    return (
      <div className="absolute inset-0 z-40 bg-slate-900/40 flex items-center justify-center px-4">
        <div className="w-full rounded-[28px] bg-white shadow-2xl p-5">
          <div className="text-[20px] font-bold text-slate-800">
            {formatDutyDate(workDate)}の乗務を終了しますか？
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <div>乗車回数：{recordCount}回</div>
            <div>売上合計：{formatMoney(totalAmount)}</div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold"
            >
              戻る
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="h-[48px] rounded-2xl bg-slate-800 text-white font-bold"
            >
              本日の乗務を終了
            </button>
          </div>
        </div>
      </div>
    );
  }

  return {
    HeaderCard,
    RideInfoCard,
    HistoryRecordCard,
    TopGraphArea,
    BottomNav,
    MainButton,
    OtherSheet,
    PaymentDialog,
    ViaDialog,
    FinishDialog,
  };
})();