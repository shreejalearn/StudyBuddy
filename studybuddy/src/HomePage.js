import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './components/menuButton';
import Logo from './assets/logo (2).png';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav style={{ backgroundColor: 'lightblue', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt="Logo" style={{ height: '100px', marginRight: '1rem' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
          <input type="text" placeholder="Search..." style={{ padding: '0.5rem', width: '400px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => navigate('/mygallery')} style={{ padding: '0.5rem 1rem' }}>Your Collections</button>
        </div>
      </nav>
      <div>
        {/* Add content here if needed */}
      </div>
      <div className="landing-content">
        <h1>Study Buddy</h1>
        <p>lorem ipsum.</p>
        <div className="category-buttons">
          {/* Add buttons here if needed */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;