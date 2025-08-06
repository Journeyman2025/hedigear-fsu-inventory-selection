import "../styles/globals.css";
import { CAMPAIGN_CONFIG } from "../campaign.config";

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --primary: ${CAMPAIGN_CONFIG.primaryColor};
          --secondary: ${CAMPAIGN_CONFIG.secondaryColor};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
