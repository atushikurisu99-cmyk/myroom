window.StandbyScreen = ({ onAdvance }) => {
  const { FixedTopLayout } = window.__AppShared;

  return (
    <FixedTopLayout
      screen="standby"
      time="05：45"
      buttonLabel="実車"
      buttonVariant="standby"
      onAdvance={onAdvance}
      bottomNavCenter="履歴"
      bottomNavActive="center"
      content={<div style={{ height: '124px' }} />}
    />
  );
};
