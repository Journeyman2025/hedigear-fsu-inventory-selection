// pages/privacy.js

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Privacy Policy for HEDiGEAR Product Selection</h1>
      <p style={{ color: '#555', marginBottom: '20px' }}><strong>Last Updated:</strong> August 5, 2025</p>

      <p style={{ marginBottom: '20px' }}>
        This privacy policy explains how we collect, use, and handle your personal information for the HEDiGEAR "Pack Your Story" campaign. Your privacy is important to us, and we are committed to protecting your data.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '10px' }}>Information We Collect</h2>
      <p>To fulfill your product selection, we collect the following personal information:</p>
      <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>
        <li><strong>Contact Information:</strong> First Name, Last Name, and Email Address.</li>
        <li><strong>Shipping Information:</strong> Street Address, Apartment/Suite Number, City, State, and ZIP Code.</li>
        <li><strong>Selection Data:</strong> The specific products you choose for the campaign.</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '10px' }}>How We Use Your Information</h2>
      <p>
        We use the information you provide for a single purpose: to ship you the correct HEDiGEAR products for this campaign.
      </p>
      <p style={{ marginTop: '10px' }}>
        Your email address will only be used for communications directly related to your product selection and shipment.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '10px' }}>Data Storage and Security</h2>
      <p>
        Your information is securely stored in a private Notion database. We take reasonable measures to protect your data from unauthorized access or disclosure.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '10px' }}>Information Sharing</h2>
      <p>
        We do not sell your personal information.
      </p>
      <p style={{ marginTop: '10px' }}>
        Your name and shipping address will only be shared with our fulfillment partners for the sole purpose of shipping your selected items. We will not share your data with any other third parties.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '10px' }}>Data Retention</h2>
      <p>
        We will keep your personal information only for as long as it is needed to complete the "Pack Your Story" campaign and for our internal records. After this period, your personal data will be securely deleted.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '10px' }}>Contact Us</h2>
      <p>
        If you have any questions about this privacy policy or how we handle your data, please contact us at <a href="mailto:Bret@hedigear.com" style={{ color: '#1976d2' }}>Bret@hedigear.com</a>.
      </p>

      <div style={{ marginTop: '40px' }}>
        <Link href="/" legacyBehavior>
          <a style={{ color: '#1976d2', textDecoration: 'underline' }}>← Back to Product Selection</a>
        </Link>
      </div>
    </div>
  );
}
