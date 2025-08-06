// campaign.config.js

export const CAMPAIGN_CONFIG = {
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
  // The colors used in _app.js to set CSS variables
  primaryColor: '#782F40', // FSU Garnet
  secondaryColor: '#CEB888', // FSU Gold
  // The Notion database ID
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