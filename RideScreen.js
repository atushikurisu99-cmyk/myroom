window.RideScreen = ({ onAdvance }) => {
  const { FixedTopLayout, RideInfoCard } = window.__AppShared;

  return (
    <FixedTopLayout
      screen="ride"
      time="05：45"
      buttonLabel="降車"
      buttonVariant="ride"
      onAdvance={onAdvance}
      bottomNavCenter="履歴"
      bottomNavActive="center"
      content={<RideInfoCard />}
    />
  );
};
