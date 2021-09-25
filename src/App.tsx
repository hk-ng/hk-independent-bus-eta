import React, { useContext, useMemo } from "react";
import loadable from "@loadable/component";
import "./App.css";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import { Container, CssBaseline, PaletteMode } from "@mui/material";
import { styled } from "@mui/material/styles";
import AppContext from "./AppContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import RouteEta from "./pages/RouteEta";
import { SearchContextProvider } from "./SearchContext";
const RouteBoard = loadable(() => import("./pages/RouteBoard"));
const RouteSearch = loadable(() => import("./pages/RouteSearch"));
const Settings = loadable(() => import("./pages/Settings"));

const PageSwitch = () => {
  const { path } = useRouteMatch();

  return (
    <SearchContextProvider>
      <Switch>
        <Route path={`${path}/route/:id/:panel?`}>
          <RouteEta />
        </Route>
        <Route path={`${path}/settings`}>
          <Settings />
        </Route>
        <Route path={`${path}/board`}>
          <RouteBoard />
        </Route>
        <Route path={`${path}/search`}>
          <RouteSearch />
        </Route>
        <Route path={`${path}`}>
          <Home />
        </Route>
      </Switch>
    </SearchContextProvider>
  );
};

const App = () => {
  const { colorMode } = useContext(AppContext);
  const theme = useMemo(() => {
    return createTheme(getThemeTokens(colorMode), [colorMode]);
  }, [colorMode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AppContainer
          maxWidth="xs"
          disableGutters
          className={classes.container}
        >
          <Router>
            <Route exact path="/">
              <Redirect to="/zh" />
            </Route>
            <Route path="/:lang">
              <CssBaseline />
              <Header />
              <PageSwitch />
              <Footer />
            </Route>
          </Router>
        </AppContainer>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

const PREFIX = "app";

const classes = {
  container: `${PREFIX}-container`,
};

const AppContainer = styled(Container)(({ theme }) => ({
  [`&.${classes.container}`]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
}));

const getThemeTokens = (mode: PaletteMode) => ({
  typography: {
    fontFamily: "Noto Sans TC, Chivo, sans-serif",
  },
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // light mode
          background: {
            default: "#fedb00",
          },
          primary: {
            main: "#fedb00", // yellow
          },
        }
      : {
          //dark mode
          primary: {
            main: "#fedb00", // yellow
          },
          background: {
            default: "#000",
          },
        }),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          userSelect: "none",
        },
        body: {
          fontSize: "0.875rem",
          lineHeight: 1.43,
        },
      },
    },
  },
});
