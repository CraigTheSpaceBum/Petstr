function TamagotchiApp() {
  const [pubkey, setPubkey] = React.useState(null);
  const [profile, setProfile] = React.useState({ name: '', npub: '', picture: '' });
  const [pets, setPets] = React.useState([]);
  const [activePetIndex, setActivePetIndex] = React.useState(0);
  const [activeNav, setActiveNav] = React.useState('Home');
  const [showPetCreation, setShowPetCreation] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showInventory, setShowInventory] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [torontoTime, setTorontoTime] = React.useState('');

  // Update pets from storage
  React.useEffect(() => {
    if (pubkey) {
      const data = localStorage.getItem(`pets:${pubkey}`);
      if (data) setPets(JSON.parse(data));
    }
  }, [pubkey]);
  React.useEffect(() => {
    if (pubkey) localStorage.setItem(`pets:${pubkey}`, JSON.stringify(pets));
  }, [pets, pubkey]);

  // Toronto time updater
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleTimeString("en-CA", {
        timeZone: "America/Toronto",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setTorontoTime(now);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const testLogin = () => {
    setPubkey('test_pubkey_0000');
    setProfile({
      name: 'Test User',
      npub: 'npub1test1234...',
      picture: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=testprofile'
    });
  };

  const logout = () => {
    setPubkey(null);
    setProfile({ name: '', npub: '', picture: '' });
    setPets([]);
    setActivePetIndex(0);
  };

  const createPet = (name, species, gender) => {
    setPets([...pets, {
      name,
      species,
      gender,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      hunger: 100,
      health: 100,
      stage: 1,
      dead: false
    }]);
    setShowPetCreation(false);
  };

  const feedPet = (index) => {
    setPets(prev => {
      const petsCopy = [...prev];
      const pet = { ...petsCopy[index] };
      if (!pet.dead) {
        pet.hunger = Math.min(100, pet.hunger + 20);
        pet.health = Math.min(100, pet.health + 5);
        pet.lastUpdated = Date.now();
      }
      petsCopy[index] = pet;
      return petsCopy;
    });
  };

  const updatePetStatus = pet => {
    const hoursPassed = (Date.now() - pet.lastUpdated) / 3600000;
    pet.hunger = Math.max(0, pet.hunger - hoursPassed * hungerDecayRate);
    pet.lastUpdated = Date.now();
    if (pet.hunger <= 0) pet.dead = true;
    const ageDays = (Date.now() - pet.createdAt) / (1000 * 60 * 60 * 24);
    pet.stage = Math.min(5, Math.floor(ageDays / 2) + 1);
    return pet;
  };

  const activePet = pets[activePetIndex] ? updatePetStatus({ ...pets[activePetIndex] }) : null;

  return (
    <div style={{
      display: 'flex',
      fontFamily: 'Press Start 2P, monospace',
      background: '#93c5fd',
      minHeight: '100vh'
    }}>
      {!pubkey ? (
        <div style={{ margin: 'auto', textAlign: 'center' }}>
          <h1>Pixel Pets</h1>
          <button onClick={testLogin}
            style={{ margin: '10px', background: '#10b981', color: 'white', padding: '10px' }}>
            Test Login
          </button>
        </div>
      ) : (
        <>
          <Sidebar
            activePet={activePet}
            profile={profile}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            setShowInventory={setShowInventory}
            setShowPetCreation={setShowPetCreation}
            setShowSettings={setShowSettings}
            logout={logout}
            torontoTime={torontoTime}
          />
          <div style={{ flexGrow: 1, padding: '20px' }}>
            <MainContent
              activePet={activePet}
              showPetCreation={showPetCreation}
              showSettings={showSettings}
              showInventory={showInventory}
              activeNav={activeNav}
              createPet={createPet}
              feedPet={feedPet}
              activePetIndex={activePetIndex}
            />
          </div>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<TamagotchiApp />);
