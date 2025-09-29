import React, { useState, useEffect } from 'react';

const PET_SPECIES = {
  Dog: ['https://api.dicebear.com/7.x/pixel-art/svg?seed=dog1','https://api.dicebear.com/7.x/pixel-art/svg?seed=dog2','https://api.dicebear.com/7.x/pixel-art/svg?seed=dog3','https://api.dicebear.com/7.x/pixel-art/svg?seed=dog4','https://api.dicebear.com/7.x/pixel-art/svg?seed=dog5'],
  Cat: ['https://api.dicebear.com/7.x/pixel-art/svg?seed=cat1','https://api.dicebear.com/7.x/pixel-art/svg?seed=cat2','https://api.dicebear.com/7.x/pixel-art/svg?seed=cat3','https://api.dicebear.com/7.x/pixel-art/svg?seed=cat4','https://api.dicebear.com/7.x/pixel-art/svg?seed=cat5'],
  Bird: ['https://api.dicebear.com/7.x/pixel-art/svg?seed=bird1','https://api.dicebear.com/7.x/pixel-art/svg?seed=bird2','https://api.dicebear.com/7.x/pixel-art/svg?seed=bird3','https://api.dicebear.com/7.x/pixel-art/svg?seed=bird4','https://api.dicebear.com/7.x/pixel-art/svg?seed=bird5'],
  Dragon: ['https://api.dicebear.com/7.x/pixel-art/svg?seed=dragon1','https://api.dicebear.com/7.x/pixel-art/svg?seed=dragon2','https://api.dicebear.com/7.x/pixel-art/svg?seed=dragon3','https://api.dicebear.com/7.x/pixel-art/svg?seed=dragon4','https://api.dicebear.com/7.x/pixel-art/svg?seed=dragon5'],
};

const hungerDecayRate = 1;

export default function TamagotchiApp() {
  const [pubkey, setPubkey] = useState(null);
  const [profile, setProfile] = useState({ name: '', npub: '', picture: '' });
  const [pets, setPets] = useState([]);
  const [activePetIndex, setActivePetIndex] = useState(0);
  const [activeNav, setActiveNav] = useState('Home');
  const [showPetCreation, setShowPetCreation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => { if (pubkey) { const data = localStorage.getItem(`pets:${pubkey}`); if (data) setPets(JSON.parse(data)); } }, [pubkey]);
  useEffect(() => { if (pubkey) localStorage.setItem(`pets:${pubkey}`, JSON.stringify(pets)); }, [pets, pubkey]);

  const testLogin = () => { setPubkey('test_pubkey_0000'); setProfile({ name: 'Test User', npub: 'npub1test1234...', picture: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=testprofile' }); };
  const logout = () => { setPubkey(null); setProfile({ name: '', npub: '', picture: '' }); setPets([]); setActivePetIndex(0); };
  const createPet = (name, species, gender) => { setPets([...pets, { name, species, gender, createdAt: Date.now(), lastUpdated: Date.now(), hunger: 100, health: 100, stage: 1, dead: false }]); setShowPetCreation(false); };
  const feedPet = (index) => { setPets(prev => { const petsCopy = [...prev]; const pet = { ...petsCopy[index] }; if (!pet.dead) { pet.hunger = Math.min(100, pet.hunger + 20); pet.health = Math.min(100, pet.health + 5); pet.lastUpdated = Date.now(); } petsCopy[index] = pet; return petsCopy; }); };
  const updatePetStatus = pet => { const hoursPassed = (Date.now() - pet.lastUpdated) / 3600000; pet.hunger = Math.max(0, pet.hunger - hoursPassed * hungerDecayRate); pet.lastUpdated = Date.now(); if (pet.hunger <= 0) pet.dead = true; const ageDays = (Date.now() - pet.createdAt) / (1000 * 60 * 60 * 24); pet.stage = Math.min(5, Math.floor(ageDays / 2) + 1); return pet; };
  const activePet = pets[activePetIndex] ? updatePetStatus({ ...pets[activePetIndex] }) : null;

  const Sidebar = () => (
    <div style={{ width: sidebarCollapsed ? '50px' : '250px', background: '#1e3a8a', color: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'Press Start 2P, monospace', padding: '10px', height: '100vh', transition: 'width 0.3s ease-in-out' }}>
      {activePet && !sidebarCollapsed && (
        <div style={{ display: 'flex', alignItems: 'center', background:'#14326b', padding:'5px', borderRadius:'12px', marginBottom: '20px', opacity: sidebarCollapsed ? 0 : 1, transition: 'opacity 0.5s' }}>
          <img src={PET_SPECIES[activePet.species][activePet.stage-1]} alt={activePet.species} style={{ width:'60px', height:'60px', imageRendering:'pixelated', marginRight:'10px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight:'bold' }}>{activePet.name}</span>
            <span>Health: {Math.round(activePet.health)}</span>
            <span>Hunger: {Math.round(activePet.hunger)}</span>
          </div>
        </div>
      )}
      {profile.name && !sidebarCollapsed && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', background: '#14326b', padding: '5px', borderRadius: '12px', opacity: sidebarCollapsed ? 0 : 1, transition: 'opacity 0.5s' }}>
          <img src={profile.picture} alt="profile" style={{ width: '60px', height: '60px', imageRendering: 'pixelated', marginRight: '10px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span>{profile.name}</span>
            <small>{profile.npub}</small>
          </div>
        </div>
      )}

      <nav style={{ flexGrow: 1 }}>
        <button onClick={() => setActiveNav('Home')} style={{ width: '100%', margin: '5px 0', background: activeNav==='Home'?'#2563eb':'#3b82f6', border: 'none', color: 'white', padding: '8px' }}>Home</button>
        <button onClick={() => setShowInventory(true)} style={{ width: '100%', margin: '5px 0', background:'#10b981', border:'none', color:'white', padding:'8px' }}>Inventory</button>
        {['Games','Social'].map(nav => (
          <button key={nav} onClick={() => setActiveNav(nav)} style={{ width: '100%', margin: '5px 0', background: activeNav===nav?'#2563eb':'#3b82f6', border: 'none', color: 'white', padding: '8px' }}>{nav}</button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button onClick={() => setShowPetCreation(true)} style={{ width:'100%', margin:'5px 0', background:'#f59e0b', border:'none', color:'white', padding:'8px' }}>Create Pet</button>
        <button onClick={() => setShowSettings(true)} style={{ width:'100%', margin:'5px 0', background:'#6b21a8', border:'none', color:'white', padding:'8px' }}>Settings</button>
        <button onClick={logout} style={{ width:'100%', margin:'5px 0', background:'#ef4444', border:'none', color:'white', padding:'8px' }}>Logout</button>
      </div>

      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ position: 'absolute', right: sidebarCollapsed ? '-25px' : '-30px', top: '50%', transform: 'translateY(-50%)', background: '#3b82f6', color:'white', border:'none', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer', zIndex:10 }}>⮜</button>
    </div>
  );

  const PetCreationForm = ({ onCreate }) => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('Dog');
    const [gender, setGender] = useState('Male');
    return (
      <div style={{ textAlign:'center', marginTop:'20px', transition:'opacity 0.5s' }}>
        <h2>Create New Pet</h2>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" style={{ width: '200px', marginBottom:'10px' }} />
        <br />
        <select value={species} onChange={e=>setSpecies(e.target.value)} style={{ width: '200px', marginBottom:'10px' }}>{Object.keys(PET_SPECIES).map(s=><option key={s}>{s}</option>)}</select>
        <br />
        <select value={gender} onChange={e=>setGender(e.target.value)} style={{ width: '200px', marginBottom:'10px' }}><option>Male</option><option>Female</option></select>
        <br />
        <button onClick={()=>onCreate(name,species,gender)} style={{ background:'#3b82f6', color:'white', padding:'5px', width:'200px' }}>Create Pet</button>
      </div>
    );
  };

  const MainContent = () => {
    if(showPetCreation) return <PetCreationForm onCreate={createPet} />;
    if(showSettings) return <div style={{ transition:'opacity 0.5s' }}><h2>Settings - Coming Soon!</h2></div>;
    if(showInventory) return <div style={{ transition:'opacity 0.5s' }}><h2>Inventory - Coming Soon!</h2></div>;

    return activePet ? (
      <div style={{ transition:'opacity 0.5s' }}>
        <h2>{activePet.name}</h2>
        <img src={PET_SPECIES[activePet.species][activePet.stage-1]} alt={activePet.species} style={{ width:'150px', imageRendering:'pixelated' }} />
        <p>Species: {activePet.species}</p>
        <p>Gender: {activePet.gender}</p>
        <p>Age: {Math.floor((Date.now()-activePet.createdAt)/(1000*60*60*24))} days</p>
        <p>Stage: {activePet.stage}</p>
        <p>Health: {Math.round(activePet.health)}</p>
        <p>Hunger: {Math.round(activePet.hunger)}</p>
        {activePet.dead ? <p style={{color:'red'}}>Dead</p> : <button onClick={()=>feedPet(activePetIndex)} style={{background:'#10b981', color:'white', padding:'5px', border:'none'}}>Feed</button>}
      </div>
    ) : <p style={{ transition:'opacity 0.5s' }}>No active pet selected.</p>;
  };

  return (
    <div style={{ display:'flex', fontFamily:'Press Start 2P, monospace', background:'#93c5fd', minHeight:'100vh' }}>
      {!pubkey ? (
        <div style={{ margin:'auto', textAlign:'center' }}>
          <h1>Pixel Pets</h1>
          <button onClick={testLogin} style={{ margin:'10px', background:'#10b981', color:'white', padding:'10px' }}>Test Login</button>
        </div>
      ) : (
        <>
          <Sidebar />
          <div style={{ flexGrow:1, padding:'20px' }}>
            <MainContent />
          </div>
        </>
      )}
    </div>
  );
}