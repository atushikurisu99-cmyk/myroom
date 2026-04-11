window.TopScreen = ({ onAdvance }) => {
  const { FixedTopLayout, TopGraphArea } = window.__AppShared;

  return (
    <FixedTopLayout
      type="top"
      buttonLabel="乗務開始"
      onClick={onAdvance}
    >
      <TopGraphArea />
    </FixedTopLayout>
  );
};
