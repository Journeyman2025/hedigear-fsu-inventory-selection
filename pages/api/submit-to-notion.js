// pages/api/submit-to-notion.js

// Helper function to format selections for Notion's 'multi_select' property type
function formatMultiSelect(items) {
  // Filter out any null or undefined items to prevent errors
  const validItems = items.filter(item => item && (item.productName || typeof item === 'string'));
  if (validItems.length === 0) return [];

  // Notion's multi-select expects an array of objects with a 'name' key.
  return validItems.map(item => ({ name: (item.productName || item).substring(0, 100) })); // Notion tags are max 100 chars
}

// Helper function to format selections into a simple text list for a 'rich_text' property
function formatRichTextList(items) {
    if (!items || items.length === 0) return 'None';
    // Ensure we are accessing the correct property for the product name
    return items.map(item => `- ${item.productName || item}`).join('\n');
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;

  console.log("--- Notion API Route Triggered ---");

  if (!NOTION_API_KEY || !DATABASE_ID) {
    console.error("Missing Notion API Key or Database ID in .env.local file.");
    return res.status(500).json({ message: "Server configuration error: Missing Notion credentials." });
  }

  const submissionData = req.body;

  // --- NEW DEBUGGING: Log the received selection data ---
  console.log("\nReceived selection data from front-end:");
  console.log("selectedPick1:", JSON.stringify(submissionData.selectedPick1, null, 2));
  console.log("selectedPick3:", JSON.stringify(submissionData.selectedPick3, null, 2));
  console.log("selectedPick2:", JSON.stringify(submissionData.selectedPick2, null, 2));

  const zipCode = submissionData.shippingAddress.zip;

  const notionPayload = {
    parent: { database_id: DATABASE_ID },
    properties: {
      'First Name': { title: [{ text: { content: submissionData.firstName } }] },
      'Last Name': { rich_text: [{ text: { content: submissionData.lastName } }] },
      'Email': { email: submissionData.email },
      'Street Address': { rich_text: [{ text: { content: submissionData.shippingAddress.street } }] },
      'Apt/Suite': { rich_text: [{ text: { content: submissionData.shippingAddress.apt || '' } }] },
      'City': { rich_text: [{ text: { content: submissionData.shippingAddress.city } }] },
      'State': { select: { name: submissionData.shippingAddress.state } },
      'ZIP Code': { rich_text: [{ text: { content: zipCode } }] },
      'Backpack Selection': { multi_select: formatMultiSelect([submissionData.selectedPick1]) },
      'Other Patches': { multi_select: formatMultiSelect(submissionData.selectedPick2) },
      'Included Items': { rich_text: [{ text: { content: formatRichTextList(submissionData.includedItems) } }] },
      'Campaign': { rich_text: [{ text: { content: 'Florida State University NIL 2025' } }] },
      'Submission Time': { date: { start: new Date().toISOString() } },
    }
  };

  console.log("\nConstructed Notion Payload:");
  console.log(JSON.stringify(notionPayload, null, 2));

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(notionPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("\n--- ERROR FROM NOTION API ---");
      console.error("Status:", response.status);
      console.error("Response Body:", errorData);
      console.error("--- END OF NOTION ERROR ---");
      return res.status(500).json({ message: `Notion API Error: ${errorData.message}` });
    }

    console.log("\nSuccessfully submitted to Notion.");
    res.status(200).json({ message: 'Success' });

  } catch (error) {
    console.error("\n--- CATCH BLOCK ERROR ---");
    console.error("An unexpected error occurred:", error);
    console.error("--- END OF CATCH BLOCK ERROR ---");
    res.status(500).json({ message: 'An unexpected error occurred on the server.' });
  }
}