import { useState, useEffect } from 'react';
import { CAMPAIGN_CONFIG as campaignConfig } from '../campaign.config';
import Head from 'next/head';

// This component is a direct adaptation of the working UF project's logic,
// updated for FSU's selection rules and Tailwind CSS styling.

export default function Home() {
  const [inventory, setInventory] = useState([]);
  
  // State for selections (mirrors the simple UF logic)
  const [selectedBackpack, setSelectedBackpack] = useState(null);
  const [selectedPatches, setSelectedPatches] = useState([]);
  
  // State for the form
  const [formVisible, setFormVisible] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    shippingAddress: { street: '', apt: '', city: '', state: '', zip: '' },
  });

  // Fetch inventory data on component mount
  useEffect(() => {
    fetch('/data/inventory.json')
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch(err => console.error("Failed to fetch inventory:", err));
  }, []);

  // Filter inventory into the correct groups using the FSU data keys
  const includedItems = inventory.filter(p => p['Selection Options'] === 'Included');
  const backpackItems = inventory.filter(p => p['Selection Options'] === 'Pick 1');
  const patchItems = inventory.filter(p => p['Selection Options'] === 'Pick 5');

  // --- SELECTION HANDLERS (Directly adapted from UF logic) ---

  const handleSelectBackpack = (item) => {
    // UF logic allows toggling the backpack selection
    if (selectedBackpack && selectedBackpack['Product Name'] === item['Product Name']) {
      setSelectedBackpack(null);
    } else {
      setSelectedBackpack(item);
    }
  };

  const handleTogglePatches = (item) => {
    const isSelected = selectedPatches.some(p => p['Product Name'] === item['Product Name']);
    
    if (isSelected) {
      // If already selected, remove it
      setSelectedPatches(selectedPatches.filter(p => p['Product Name'] !== item['Product Name']));
    } else if (selectedPatches.length < campaignConfig.patchSelectionLimit) {
      // If not selected and limit is not reached, add it
      setSelectedPatches([...selectedPatches, item]);
    }
  };
  
  // --- FORM HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    
    // The Notion API expects selectedPick1 and selectedPick2
    const submissionData = {
      ...formData,
      selectedPick1: selectedBackpack,
      selectedPick2: selectedPatches, 
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
      console.error("Submission error:", error);
      setSubmissionStatus('error');
    }
  };

  // Determine if the "Proceed" button should be enabled
  const isSelectionComplete = selectedBackpack && selectedPatches.length === campaignConfig.patchSelectionLimit;

  // --- RENDER LOGIC ---

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
        {/* Included Items Section */}
        <div className="mb-12">
            <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-6">Included with Your HEDi-PACK</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {includedItems.map((item) => (
                    <div key={item['Product Name']} className="border rounded-lg p-4 text-center">
                        <img src={item.Image || '/images/placeholder.png'} alt={item['Product Name']} className="w-full h-48 object-contain mb-4" />
                        <p className="text-sm font-semibold">{item['Product Name']}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Backpack Selection Section */}
        <div className="mb-12">
            <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-6">Step 1: Choose Your HEDi-PACK (Pick 1)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {backpackItems.map((item) => {
                    const isSelected = selectedBackpack && selectedBackpack['Product Name'] === item['Product Name'];
                    return (
                        <div
                            key={item['Product Name']}
                            className={`border rounded-lg p-4 text-center transition-all duration-200 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}
                            onClick={() => handleSelectBackpack(item)}
                        >
                            <img src={item.Image || '/images/placeholder.png'} alt={item['Product Name']} className="w-full h-48 object-contain mb-4" />
                            <p className="text-sm font-semibold">{item['Product Name']}</p>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Patch Selection Section */}
        <div className="mb-12">
            <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-6">{`Step 2: Choose Your Patches (${selectedPatches.length}/${campaignConfig.patchSelectionLimit})`}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {patchItems.map((item) => {
                    const isSelected = selectedPatches.some(p => p['Product Name'] === item['Product Name']);
                    const isDisabled = !isSelected && selectedPatches.length >= campaignConfig.patchSelectionLimit;
                    return (
                        <div
                            key={item['Product Name']}
                            className={`border rounded-lg p-4 text-center transition-all duration-200 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}
                            onClick={() => !isDisabled && handleTogglePatches(item)}
                        >
                            <img src={item.Image || '/images/placeholder.png'} alt={item['Product Name']} className="w-full h-48 object-contain mb-4" />
                            <p className="text-sm font-semibold">{item['Product Name']}</p>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Form and Submission Section */}
        {!formVisible && (
          <div className="text-center my-8">
            <button 
              onClick={() => setFormVisible(true)}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              disabled={!isSelectionComplete}
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
