window.StandbyScreen = ({ onAdvance }) => {
  const { FixedTopLayout } = window.__AppShared;

  return (
    <FixedTopLayout
      type="standby"
      buttonLabel="実車"
      onClick={onAdvance}
    >
      <div />
    </FixedTopLayout>
  );
};
