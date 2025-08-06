// hediger-fsu-inventory-selection/campaign.config.js

const campaignConfig = {
  campaignName: 'Florida State University NIL 2025',
  owner: 'HEDi-GEAR',
  // The main page title
  title: 'Florida State University | HEDi-GEAR Inventory Selection',
  // The header title
  header: 'FSU INVENTORY SELECTION',
  // The subheader
  subheader: 'Please select your HEDi-PACK and 5 patches',
  // The logo to display in the header
  logo: '/brand/florida-state-letters.png',
  // The favicon
  favicon: '/brand/fsu-instagram-logo.jpg',
  // The number of patches that can be selected
  patchSelectionLimit: 5,
  // The Notion database ID
  // IMPORTANT: You will likely need to create a new Notion database for FSU submissions and add the new ID here.
  notionDatabaseId: process.env.NOTION_DATABASE_ID || '',
  // The property names in your Notion database
  notionProperties: {
    name: 'Name',
    instagram: 'Instagram',
    backpack: 'Backpack Selection',
    patches: 'Patch Selections',
    campaign: 'Campaign',
  },
};

module.exports = campaignConfig;