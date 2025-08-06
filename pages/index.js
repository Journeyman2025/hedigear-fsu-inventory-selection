import { useState, useEffect } from 'react';
import { CAMPAIGN_CONFIG as campaignConfig } from '../campaign.config';
import Head from 'next/head';

// Main component for the inventory selection page
export default function Home() {
  // State variables
  const [inventory, setInventory] = useState([]);
  const [selectedPick1, setSelectedPick1] = useState(null);
  const [selectedPick2, setSelectedPick2] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    shippingAddress: { street: '', apt: '', city: '', state: '', zip: '' },
  });

  // --- DEBUGGING: Log state whenever it changes ---
  useEffect(() => {
    console.log("DEBUG: Backpack selection changed:", selectedPick1);
  }, [selectedPick1]);

  useEffect(() => {
    console.log("DEBUG: Patch selection changed. Count:", selectedPick2.length);
  }, [selectedPick2]);

  // Fetch inventory data on component mount
  useEffect(() => {
    console.log("DEBUG: Fetching inventory data...");
    fetch('/data/inventory.json')
      .then((res) => res.json())
      .then((data) => {
        console.log("DEBUG: Inventory data loaded successfully.");
        setInventory(data);
      })
      .catch(err => console.error("DEBUG: Failed to fetch or parse inventory.json", err));
  }, []);

  // Filter inventory into categories
  const includedItems = inventory.filter(p => p['Selection Options'] === 'Included');
  const pick1Items = inventory.filter(p => p['Selection Options'] === 'Pick 1');
  const pick5Items = inventory.filter(p => p['Selection Options'] === 'Pick 5');

  // --- DEBUGGING: Add logs to handlers ---
  const handleSelectPick1 = (item) => {
    console.log("DEBUG: handleSelectPick1 called with:", item['Product Name']);
    setSelectedPick1(item);
  };

  const handleSelectPick2 = (item) => {
    console.log("DEBUG: handleSelectPick2 called with:", item['Product Name']);
    if (!selectedPick2.find(p => p['Product Name'] === item['Product Name']) && selectedPick2.length < campaignConfig.patchSelectionLimit) {
      setSelectedPick2(prev => [...prev, item]);
    } else {
      console.log("DEBUG: Selection prevented: item already selected or limit reached.");
    }
  };

  const handleDeselectPick2 = (item) => {
    console.log("DEBUG: handleDeselectPick2 called with:", item['Product Name']);
    setSelectedPick2(prev => prev.filter(p => p['Product Name'] !== item['Product Name']));
  };

  // Handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPick1 || selectedPick2.length !== campaignConfig.patchSelectionLimit) {
      alert(`Please make sure you have selected 1 backpack and ${campaignConfig.patchSelectionLimit} patches.`);
      return;
    }
    setSubmissionStatus('submitting');
    const submissionData = {
      ...formData,
      selectedPick1,
      selectedPick2,
      includedItems,
    };
    try {
      const response = await fetch('/api/submit-to-notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      if (response.ok) setSubmissionStatus('success');
      else setSubmissionStatus('error');
    } catch (error) {
      setSubmissionStatus('error');
    }
  };

  // Reusable component for rendering a grid of products
  const ProductGrid = ({ title, items, selectedItems, onSelectItem, onDeselectItem, isMultiSelect }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const isSelected = selectedItems?.some(p => p['Product Name'] === item['Product Name']);
          return (
            <div
              key={item['Product Name']}
              className={`border rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}
              onClick={() => {
                console.log("DEBUG: Clicked on", item['Product Name']);
                isMultiSelect ? (isSelected ? onDeselectItem(item) : onSelectItem(item)) : onSelectItem(item);
              }}
            >
              <img src={item.Image || '/images/placeholder.png'} alt={item['Product Name']} className="w-full h-48 object-contain mb-4" />
              <p className="text-sm font-semibold">{item['Product Name']}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (submissionStatus === 'success') {
    return (
      <div className="text-center p-10">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h2>
        <p className="text-lg">Your selections have been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{campaignConfig.title}</title>
        <link rel="icon" href={campaignConfig.favicon} />
      </Head>
      <header className="bg-gray-800 text-white p-6 text-center">
        <img src={campaignConfig.logo} alt="Campaign Logo" className="h-20 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold">{campaignConfig.header}</h1>
        <p className="text-lg mt-2">{campaignConfig.subheader}</p>
      </header>
      <main className="container mx-auto p-8">
        <ProductGrid title="Included with Your HEDi-PACK" items={includedItems} />
        <ProductGrid 
          title="Step 1: Choose Your HEDi-PACK (Pick 1)" 
          items={pick1Items} 
          selectedItems={selectedPick1 ? [selectedPick1] : []}
          onSelectItem={handleSelectPick1}
          isMultiSelect={false} 
        />
        <ProductGrid 
          title={`Step 2: Choose Your Patches (Pick ${campaignConfig.patchSelectionLimit})`} 
          items={pick5Items} 
          selectedItems={selectedPick2}
          onSelectItem={handleSelectPick2}
          onDeselectItem={handleDeselectPick2}
          isMultiSelect={true}
        />
        {!formVisible && (
          <div className="text-center my-8">
            <button 
              onClick={() => setFormVisible(true)}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              disabled={!selectedPick1 || selectedPick2.length !== campaignConfig.patchSelectionLimit}
            >
              Proceed to Shipping
            </button>
          </div>
        )}
        {formVisible && (
          <div className="max-w-2xl mx-auto mt-10 p-8 border rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" name="firstName" placeholder="First Name" className="p-2 border rounded" required onChange={handleInputChange} />
                <input type="text" name="lastName" placeholder="Last Name" className="p-2 border rounded" required onChange={handleInputChange} />
              </div>
              <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded mb-4" required onChange={handleInputChange} />
              <input type="text" name="shippingAddress.street" placeholder="Street Address" className="w-full p-2 border rounded mb-4" required onChange={handleInputChange} />
              <input type="text" name="shippingAddress.apt" placeholder="Apt, Suite, etc. (optional)" className="w-full p-2 border rounded mb-4" onChange={handleInputChange} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input type="text" name="shippingAddress.city" placeholder="City" className="p-2 border rounded" required onChange={handleInputChange} />
                <input type="text" name="shippingAddress.state" placeholder="State" className="p-2 border rounded" required onChange={handleInputChange} />
                <input type="text" name="shippingAddress.zip" placeholder="ZIP Code" className="p-2 border rounded" required onChange={handleInputChange} />
              </div>
              <button 
                type="submit" 
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                disabled={submissionStatus === 'submitting'}
              >
                {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit My Selections'}
              </button>
              {submissionStatus === 'error' && <p className="text-red-500 text-center mt-4">There was an error submitting your form. Please try again.</p>}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
