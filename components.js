// components.js

const BottomNav = ({ current, setCurrent }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "52px",
        background: "#9ED36A",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      {/* 共通スタイル */}
      {[
        { key: "home", label: "ホーム", icon: "home" },
        { key: "history", label: "履歴", icon: "text" },
        { key: "menu", label: "メニュー", icon: "dots" },
      ].map((item) => {
        const active = current === item.key;

        return (
          <div
            key={item.key}
            onClick={() => setCurrent(item.key)}
            style={{
              position: "relative",
              width: "33%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* 丸 */}
            <div
              style={{
                position: "absolute",
                top: "-12px",
                width: "78px",
                height: "78px",
                borderRadius: "50%",
                background: active ? "#7FC84E" : "rgba(255,255,255,0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* アイコン */}
              {item.icon === "home" && (
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    background: "#fff",
                    clipPath:
                      "polygon(50% 0%, 100% 40%, 85% 40%, 85% 100%, 15% 100%, 15% 40%, 0% 40%)",
                    marginBottom: "4px",
                  }}
                />
              )}

              {item.icon === "text" && (
                <div
                  style={{
                    fontSize: "20px",
                    color: "#fff",
                    marginBottom: "2px",
                  }}
                >
                  履歴
                </div>
              )}

              {item.icon === "dots" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,6px)",
                    gap: "5px",
                    marginBottom: "4px",
                  }}
                >
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        background: "#fff",
                        borderRadius: "50%",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* テキスト */}
              <div
                style={{
                  fontSize: "11px",
                  color: "#fff",
                  marginTop: "-2px",
                }}
              >
                {item.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* =========================
   上カード（既存崩さず微調整）
========================= */
const HeaderCard = ({ time, amount }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "14px 16px",
        margin: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "32px", fontWeight: "bold" }}>{time}</div>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          3
        </div>
      </div>

      <div
        style={{
          marginTop: "6px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        累計 + 乗務分
      </div>

      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        ¥{amount}
      </div>
    </div>
  );
};

export { BottomNav, HeaderCard };
