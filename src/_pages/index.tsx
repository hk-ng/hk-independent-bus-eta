import React from "react";
import App from "../App";
import { DbProvider } from "../DbContext";
import { AppContextProvider } from "../AppContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import type { DatabaseType } from "../DbContext";
import "../index.css";

interface IndexPageProps {
  pageContext: {
    db: DatabaseType;
  };
}

const IndexPage = (props: IndexPageProps) => {
  const { pageContext } = props;
  return (
    <DbProvider initialDb={pageContext.db}>
      <AppContextProvider>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </AppContextProvider>
    </DbProvider>
  );
};

export default IndexPage;
