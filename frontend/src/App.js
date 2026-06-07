import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // login, register, dashboard
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Item states
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  // --- AUTHENTICATION ---
  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (response.ok) {
      alert('Registration successful! Please login.');
      setCurrentScreen('login');
    } else {
      alert(data.error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      setCurrentScreen('dashboard');
      fetchItems(); // Load data after login
    } else {
      alert(data.error);
    }
  };

  // --- CRUD OPERATIONS ---
  const fetchItems = async () => {
    const response = await fetch('http://localhost:5000/items');
    const data = await response.json();
    setItems(data);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const itemData = { name: itemName, quantity, description };

    if (editId) {
      // Update
      await fetch(`http://localhost:5000/items/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      setEditId(null);
    } else {
      // Add New
      await fetch('http://localhost:5000/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
    }
    
    setItemName(''); setQuantity(''); setDescription('');
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setItemName(item.name);
    setQuantity(item.quantity);
    setDescription(item.description);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      await fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentScreen('login');
    setEmail(''); setPassword('');
  };

  // --- UI SCREENS ---
  if (currentScreen === 'login') {
    return (
      <div className="container auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Login</button>
        </form>
        <button className="link-btn" onClick={() => setCurrentScreen('register')}>Create an account</button>
      </div>
    );
  }

  if (currentScreen === 'register') {
    return (
      <div className="container auth-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <button className="link-btn" onClick={() => setCurrentScreen('login')}>Already have an account? Login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Project Dashboard</h2>
        <div>
          <span>Welcome, {user?.name} </span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <form onSubmit={handleSaveItem} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required style={{flex: 1, padding: '8px'}} />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required style={{width: '100px', padding: '8px'}} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{flex: 2, padding: '8px'}} />
        <button type="submit" style={{ width: 'auto', marginTop: '0' }}>{editId ? 'Update' : 'Add Data'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.description}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;