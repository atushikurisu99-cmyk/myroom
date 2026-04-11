window.RideScreen = ({ onAdvance }) => {
  const { FixedTopLayout, RideInfoCard } = window.__AppShared;

  return (
    <FixedTopLayout
      type="ride"
      buttonLabel="降車"
      onClick={onAdvance}
    >
      <RideInfoCard />
    </FixedTopLayout>
  );
};
