function Sidebar({ 
  activePet, 
  profile, 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  activeNav, 
  setActiveNav,
  setShowInventory,
  setShowPetCreation,
  setShowSettings,
  logout,
  torontoTime
}) {
  return (
    <div style={{
      width: sidebarCollapsed ? '50px' : '250px',
      background: '#1e3a8a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Press Start 2P, monospace',
      padding: '10px',
      height: '100vh',
      transition: 'width 0.3s ease-in-out',
      position: 'relative'
    }}>
      {activePet && !sidebarCollapsed && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#14326b',
          padding: '5px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <img src={PET_SPECIES[activePet.species][activePet.stage - 1]} 
            alt={activePet.species}
            style={{ width: '60px', height: '60px', imageRendering: 'pixelated', marginRight: '10px' }} />
          <div>
            <span style={{ fontWeight: 'bold' }}>{activePet.name}</span>
            <span>Health: {Math.round(activePet.health)}</span>
            <span>Hunger: {Math.round(activePet.hunger)}</span>
          </div>
        </div>
      )}

      {profile.name && !sidebarCollapsed && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          background: '#14326b',
          padding: '5px',
          borderRadius: '12px'
        }}>
          <img src={profile.picture} alt="profile"
            style={{ width: '60px', height: '60px', imageRendering: 'pixelated', marginRight: '10px' }} />
          <div>
            <span>{profile.name}</span>
            <small>{profile.npub}</small>
          </div>
        </div>
      )}

      <nav style={{ flexGrow: 1 }}>
        {['Home', 'Games', 'Social'].map(nav => (
          <button key={nav} onClick={() => {
            setActiveNav(nav);
            setShowInventory(false);
            setShowPetCreation(false);
            setShowSettings(false);
          }}
          style={{
            width: '100%', margin: '5px 0',
            background: activeNav === nav ? '#2563eb' : '#3b82f6',
            border: 'none', color: 'white', padding: '8px'
          }}>
            {nav}
          </button>
        ))}
        <button onClick={() => { setShowInventory(true); setShowPetCreation(false); setShowSettings(false); }}
          style={{ width: '100%', margin: '5px 0', background: '#10b981', border: 'none', color: 'white', padding: '8px' }}>
          Inventory
        </button>
      </nav>

      {!sidebarCollapsed && (
        <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '10px' }}>
          <span>Toronto Time</span><br />
          <span>{torontoTime}</span>
        </div>
      )}

      <div style={{ marginTop: 'auto' }}>
        <button onClick={() => setShowPetCreation(true)}
          style={{ width: '100%', margin: '5px 0', background: '#f59e0b', border: 'none', color: 'white', padding: '8px' }}>
          Create Pet
        </button>
        <button onClick={() => setShowSettings(true)}
          style={{ width: '100%', margin: '5px 0', background: '#6b21a8', border: 'none', color: 'white', padding: '8px' }}>
          Settings
        </button>
        <button onClick={logout}
          style={{ width: '100%', margin: '5px 0', background: '#ef4444', border: 'none', color: 'white', padding: '8px' }}>
          Logout
        </button>
      </div>

      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        style={{
          position: 'absolute',
          right: sidebarCollapsed ? '-25px' : '-30px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          cursor: 'pointer'
        }}>
        ⮜
      </button>
    </div>
  );
}
