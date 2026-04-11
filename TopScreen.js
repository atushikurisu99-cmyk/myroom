window.TopScreen = ({ onAdvance }) => {
  const { FixedTopLayout, TopGraphArea } = window.__AppShared;

  return (
    <FixedTopLayout
      screen="top"
      time="05：45"
      amount="¥0"
      buttonLabel="乗務開始"
      buttonVariant="start"
      onAdvance={onAdvance}
      bottomNavCenter="経費"
      bottomNavActive="home"
      showArrow={true}
      content={<TopGraphArea />}
    />
  );
};
