import { useState } from 'react';
import inventory from '../public/data/inventory.json';

function transformImageUrl(url) {
  const match = url.match(/\/d\/([^/]+)/);
  if (match) {
    const id = match[1];
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }
  return url;
}

export default function Home() {
  // Partition items by selection option
  const includedItems = inventory.filter(item => item.selectionOption === 'Included');
  const pick1Items = inventory.filter(item => item.selectionOption === 'Pick 1');
  const pick3Items = inventory.filter(item => item.selectionOption === 'Pick 3');
  const pick2Items = inventory.filter(item => item.selectionOption === 'Pick 2');

  // State for selection
  const [selectedPick1, setSelectedPick1] = useState(null);
  const [selectedPick3, setSelectedPick3] = useState([]);
  const [selectedPick2, setSelectedPick2] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSelectPick1 = (item) => {
    if (selectedPick1 && selectedPick1.productName === item.productName) {
      setSelectedPick1(null);
    } else {
      setSelectedPick1(item);
    }
  };

  const handleTogglePick3 = (item) => {
    const exists = selectedPick3.some(i => i.productName === item.productName);
    if (exists) {
      setSelectedPick3(selectedPick3.filter(i => i.productName !== item.productName));
    } else if (selectedPick3.length < 3) {
      setSelectedPick3([...selectedPick3, item]);
    }
  };

  const handleTogglePick2 = (item) => {
    const exists = selectedPick2.some(i => i.productName === item.productName);
    if (exists) {
      setSelectedPick2(selectedPick2.filter(i => i.productName !== item.productName));
    } else if (selectedPick2.length < 2) {
      setSelectedPick2([...selectedPick2, item]);
    }
  };

  const isPick3Selected = (item) => selectedPick3.some(i => i.productName === item.productName);
  const isPick2Selected = (item) => selectedPick2.some(i => i.productName === item.productName);

  const readyToSubmit = !!(
    selectedPick1 &&
    selectedPick3.length === 3 &&
    selectedPick2.length === 2 &&
    name.trim() &&
    email.trim() &&
    address.trim()
  );

  const handleSubmit = () => {
    const submission = {
      name,
      email,
      address,
      includedItems,
      selectedPick1,
      selectedPick3,
      selectedPick2
    };
    alert(JSON.stringify(submission, null, 2));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#782F40' }}>FSU Athlete Inventory Selection</h1>
      {/* Included items */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#782F40' }}>Included Items</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {includedItems.map(item => (
            <div key={item.productName} style={{ width: '150px', textAlign: 'center', border: '1px solid #CEB888', padding: '5px', borderRadius: '4px' }}>
              <img
                src={transformImageUrl(item.imageUrl)}
                alt={item.productName}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/placeholder.png';
                }}
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              />
              <p style={{ marginTop: '5px', fontWeight: 'bold' }}>{item.productName}</p>
              <p style={{ fontStyle: 'italic', color: '#555' }}>Included</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pick 1 group */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#782F40' }}>Select 1 Bag</h2>
        <p>Choose exactly one backpack.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {pick1Items.map(item => {
            const selected = selectedPick1 && selectedPick1.productName === item.productName;
            return (
              <div
                key={item.productName}
                onClick={() => handleSelectPick1(item)}
                style={{
                  width: '150px',
                  cursor: 'pointer',
                  border: selected ? '2px solid #CEB888' : '1px solid #CEB888',
                  borderRadius: '4px',
                  padding: '5px',
                  boxShadow: selected ? '0 0 6px #CEB88899' : 'none'
                }}
              >
                <img
                  src={transformImageUrl(item.imageUrl)}
                  alt={item.productName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/placeholder.png';
                  }}
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
                <p style={{ marginTop: '5px' }}>{item.productName}</p>
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: '10px' }}>Selected: {selectedPick1 ? selectedPick1.productName : 'None'}</p>
      </section>

      {/* Pick 3 group */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#782F40' }}>Select 3 Bookstore Patches</h2>
        <p>Pick exactly three patches from the Bookstore collection.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {pick3Items.map(item => {
            const selected = isPick3Selected(item);
            const disabled = !selected && selectedPick3.length >= 3;
            return (
              <div
                key={item.productName}
                onClick={() => !disabled && handleTogglePick3(item)}
                style={{
                  width: '150px',
                  cursor: disabled ? 'default' : 'pointer',
                  border: selected ? '2px solid #CEB888' : '1px solid #CEB888',
                  borderRadius: '4px',
                  padding: '5px',
                  opacity: disabled && !selected ? 0.5 : 1
                }}
              >
                <img
                  src={transformImageUrl(item.imageUrl)}
                  alt={item.productName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/placeholder.png';
                  }}
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
                <p style={{ marginTop: '5px' }}>{item.productName}</p>
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: '10px' }}>Selected ({selectedPick3.length}/3)</p>
      </section>

      {/* Pick 2 group */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#782F40' }}>Select 2 Other Patches</h2>
        <p>Pick exactly two patches from the other categories (Locations, National Parks, Numbers, USA).</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {pick2Items.map(item => {
            const selected = isPick2Selected(item);
            const disabled = !selected && selectedPick2.length >= 2;
            return (
              <div
                key={item.productName}
                onClick={() => !disabled && handleTogglePick2(item)}
                style={{
                  width: '150px',
                  cursor: disabled ? 'default' : 'pointer',
                  border: selected ? '2px solid #CEB888' : '1px solid #CEB888',
                  borderRadius: '4px',
                  padding: '5px',
                  opacity: disabled && !selected ? 0.5 : 1
                }}
              >
                <img
                  src={transformImageUrl(item.imageUrl)}
                  alt={item.productName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/placeholder.png';
                  }}
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
                <p style={{ marginTop: '5px' }}>{item.productName}</p>
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: '10px' }}>Selected ({selectedPick2.length}/2)</p>
      </section>

      {/* User Info */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#782F40' }}>Your Information</h2>
        <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #CEB888' }}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #CEB888' }}
          />
          <textarea
            placeholder="Shipping Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            rows={3}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #CEB888' }}
          />
        </div>
      </section>

      {/* Submit */}
      <section>
        <button
          onClick={handleSubmit}
          disabled={!readyToSubmit}
          style={{
            padding: '10px 20px',
            backgroundColor: readyToSubmit ? '#782F40' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: readyToSubmit ? 'pointer' : 'default'
          }}
        >
          Submit
        </button>
        {!readyToSubmit && (
          <p style={{ marginTop: '10px', color: '#d32f2f' }}>
            Please complete your selections (1 bag, 3 Bookstore patches, 2 other patches) and fill in your name, email and address.
          </p>
        )}
      </section>
    </div>
  );
}
