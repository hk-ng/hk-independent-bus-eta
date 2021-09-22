import "./index.css";
import App from "./App";
import { DbProvider } from "./DbContext";
import { AppContextProvider } from "./AppContext";
import "./i18n";
import type { DatabaseType } from "./DbContext"

interface IndexPageProps {
  pageContext: {
    data: DatabaseType;
  }
}

const IndexPage = ({pageContext}: IndexPageProps) => {
  <DbProvider initialDb={pageContext.data}>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </DbProvider>
}

export default IndexPage;