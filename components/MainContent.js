function MainContent({ activePet, showPetCreation, showSettings, showInventory, activeNav, createPet, feedPet, activePetIndex }) {
  if (showPetCreation) return <PetCreationForm onCreate={createPet} />;
  if (showSettings) return <h2>Settings - Coming Soon!</h2>;
  if (showInventory) return <h2>Inventory - Coming Soon!</h2>;
  if (activeNav === 'Games') return <h2>Games - Coming Soon!</h2>;
  if (activeNav === 'Social') return <h2>Social - Coming Soon!</h2>;

  return activePet ? (
    <div>
      <h2>{activePet.name}</h2>
      <img src={PET_SPECIES[activePet.species][activePet.stage - 1]} alt={activePet.species}
        style={{ width: '150px', imageRendering: 'pixelated' }} />
      <p>Species: {activePet.species}</p>
      <p>Gender: {activePet.gender}</p>
      <p>Age: {Math.floor((Date.now() - activePet.createdAt) / (1000 * 60 * 60 * 24))} days</p>
      <p>Stage: {activePet.stage}</p>
      <p>Health: {Math.round(activePet.health)}</p>
      <p>Hunger: {Math.round(activePet.hunger)}</p>
      {activePet.dead ? (
        <p style={{ color: 'red' }}>Dead</p>
      ) : (
        <button onClick={() => feedPet(activePetIndex)}
          style={{ background: '#10b981', color: 'white', padding: '5px', border: 'none' }}>
          Feed
        </button>
      )}
    </div>
  ) : <p>No active pet selected.</p>;
}
