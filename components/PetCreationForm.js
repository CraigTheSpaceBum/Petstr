function PetCreationForm({ onCreate }) {
  const [name, setName] = React.useState('');
  const [species, setSpecies] = React.useState('Dog');
  const [gender, setGender] = React.useState('Male');

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Create New Pet</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"
        style={{ width: '200px', marginBottom: '10px' }} />
      <br />
      <select value={species} onChange={e => setSpecies(e.target.value)}
        style={{ width: '200px', marginBottom: '10px' }}>
        {Object.keys(PET_SPECIES).map(s => <option key={s}>{s}</option>)}
      </select>
      <br />
      <select value={gender} onChange={e => setGender(e.target.value)}
        style={{ width: '200px', marginBottom: '10px' }}>
        <option>Male</option>
        <option>Female</option>
      </select>
      <br />
      <button onClick={() => onCreate(name, species, gender)}
        style={{ background: '#3b82f6', color: 'white', padding: '5px', width: '200px' }}>
        Create Pet
      </button>
    </div>
  );
}
