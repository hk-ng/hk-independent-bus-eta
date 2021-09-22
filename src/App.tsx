import React, { useContext, useMemo } from "react";
import { Router, Redirect } from "@reach/router";
import loadable from "@loadable/component";
import "./App.css";
import "leaflet/dist/leaflet.css";
import {
  MuiThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from "@material-ui/core/styles";
import { Container, CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "./AppContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./_pages/Home";
import RouteEta from "./_pages/RouteEta";
import { SearchContextProvider } from "./SearchContext";
const RouteBoard = loadable(() => import("./_pages/RouteBoard"));
const RouteSearch = loadable(() => import("./_pages/RouteSearch"));
const Settings = loadable(() => import("./_pages/Settings"));

// Use a custom wrapper to prevent passing through DOM props
// to a non-DOM element.
function RouterComponent({ children }) {
  // Shorthand of <React.Fragment>{children}</React.Fragment>
  return <>{children}</>;
}

const App = () => {
  const { colorMode } = useContext(AppContext);
  const theme = useMemo(() => {
    return colorMode === "dark" ? getDarkTheme() : getlightTheme();
  }, [colorMode]);
  useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SearchContextProvider>
        <Container maxWidth="xs" disableGutters className={"AppContainer"}>
          <Router primary={false} component={RouterComponent}>
            <Header default />
          </Router>
          <Router primary={false} component={RouterComponent}>
            <Redirect from="/" to="/zh" noThrow />
            <RouteEta path={`/:lang/route/:id/:panel?`} />
            <Settings path={`/:lang/settings`} />
            <RouteBoard path={`/:lang/board`} />
            <RouteSearch path={`/:lang/search`} />
            <Home path="/:lang" />
          </Router>
          <Router primary={false} component={RouterComponent}>
            <Footer default />
          </Router>
        </Container>
      </SearchContextProvider>
    </MuiThemeProvider>
  );
};

export default App;

const useStyles = makeStyles((theme) => ({
  "@global": {
    ".AppContainer": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    },
  },
}));

const getlightTheme = () =>
  createMuiTheme(
    {
      typography: {
        fontFamily: "Noto Sans TC, Chivo, sans-serif",
      },
      palette: {
        type: "light",
        background: {
          default: "#fedb00",
        },
        primary: {
          main: "#fedb00", // yellow
        },
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            html: {
              userSelect: "none",
            },
          },
        },
      },
    },
    ["light"]
  );

const getDarkTheme = () =>
  createMuiTheme({
    typography: {
      fontFamily: "Noto Sans TC, Chivo, sans-serif",
    },
    palette: {
      type: "dark",
      primary: {
        main: "#fedb00", // yellow
      },
      background: {
        default: "#000",
      },
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          html: {
            userSelect: "none",
          },
        },
      },
    },
  });
