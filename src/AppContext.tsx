import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { vibrate } from "./utils";
import { DatabaseContextValue, DatabaseType, DbProvider } from "./DbContext";
import { Workbox } from "workbox-window";
import { produce, freeze, current } from "immer";
import type { Location as GeoLocation } from "hk-bus-eta";
import { ETA_FORMAT_NEXT_TYPES } from "./constants";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import { fetchDbFunc } from "./db";
import { CacheProvider, EmotionCache } from "@emotion/react";
import reportWebVitals, { sendToGoogleAnalytics } from "../src/reportWebVitals";
import { useTranslation } from "react-i18next";

type GeoPermission = "opening" | "granted" | "denied" | "closed" | null;

interface AppState {
  searchRoute: string;
  selectedRoute: string;
  geoPermission: GeoPermission;
  geolocation: GeoLocation;
  /**
   * hot query count
   */
  hotRoute: Record<string, number>;
  savedEtas: string[];
  /**
   * filter routes by route schedule against time
   */
  isRouteFilter: boolean;
  /**
   * bus sorting order
   */
  busSortOrder: "KMB first" | "CTB-NWFB first";
  /**
   * number pad order
   */
  numPadOrder: "789456123c0b" | "123456789c0b";
  /**
   * time display format
   */
  etaFormat: "exact" | "diff" | "mixed";
  colorMode: "dark" | "light";
  /**
   * energy saving mode
   */
  energyMode: boolean;
  /**
   * vibrate duration
   */
  vibrateDuration: number;
  /**
   * check if window is on active in mobile
   */
  isVisible: boolean;
  /**
   * enable analytics or not
   */
  analytics: boolean;
}

interface AppContextValue extends AppState, DatabaseContextValue {
  setSearchRoute: (searchRoute: string) => void;
  updateSearchRouteByButton: (buttonValue: string) => void;
  updateSelectedRoute: (route: string, seq?: string) => void;
  // UX
  updateGeolocation: (geoLocation: GeoLocation) => void;
  updateSavedEtas: (keys: string) => void;
  setSavedEtas: (savedEtas: string[]) => void;
  resetUsageRecord: () => void;
  // settings
  updateGeoPermission: (
    geoPermission: AppState["geoPermission"],
    deniedCallback?: () => void
  ) => void;
  toggleRouteFilter: () => void;
  toggleBusSortOrder: () => void;
  toggleNumPadOrder: () => void;
  toggleEtaFormat: () => void;
  toggleColorMode: () => void;
  toggleEnergyMode: () => void;
  toggleVibrateDuration: () => void;
  toggleAnalytics: () => void; // not
  changeLanguage: (lang: "zh" | "en") => void;
  workbox?: Workbox;
}

interface AppContextProviderProps {
  initialDb: DatabaseType;
  children: ReactNode;
  workbox?: Workbox;
  emotionCache?: EmotionCache;
}

const AppContext = React.createContext<AppContextValue>(null);
const defaultGeolocation: GeoLocation = { lat: 22.302711, lng: 114.177216 };
const isGeoPremission = (input: unknown): input is GeoPermission => {
  return (
    input === "opening" ||
    input === "granted" ||
    input === "denied" ||
    input === null
  );
};

const isGeoLocation = (input: unknown): input is GeoLocation => {
  if (input instanceof Object && input !== null && input !== undefined) {
    if (typeof input["lat"] === "number" && typeof input["lng"] === "number") {
      return true;
    }
  }
  return false;
};

const isBusSortOrder = (input: unknown): input is AppState["busSortOrder"] => {
  return input === "KMB first" || input === "CTB-NWFB first";
};

const isNumPadOrder = (input: unknown): input is AppState["numPadOrder"] => {
  return input === "789456123c0b" || input === "123456789c0b";
};

const isEtaFormat = (input: unknown): input is AppState["etaFormat"] => {
  return input === "exact" || input === "diff" || input === "mixed";
};

const isStrings = (input: unknown[]): input is string[] => {
  if (input.some((v) => typeof v !== "string")) {
    return false;
  }
  return true;
};

const isColorMode = (input: unknown): input is "dark" | "light" => {
  return input === "dark" || input === "light";
};

const isNumberRecord = (input: unknown): input is Record<string, number> => {
  if (input instanceof Object && input !== null && input !== undefined) {
    if (Object.entries(input).some((v) => typeof v !== "number")) {
      return false;
    } else {
      return true;
    }
  }
  return false;
};

const getThemeTokens = (mode: PaletteMode) => ({
  typography: {
    fontFamily: "'Chiron Sans HK Pro WS', sans-serif",
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
  elements: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          userSelect: "none",
        },
        body: {
          fontSize: "0.875rem",
          lineHeight: 1.43,
          scrollbarColor: "#3f3f3f",
          scrollbarWidth: "thin",
        },
      },
    },
  },
});

export const AppContextProvider = ({
  initialDb,
  workbox,
  children,
  emotionCache,
}: AppContextProviderProps) => {
  const AppTitle = "巴士到站預報 App （免費無廣告）";
  // route list & stop list & route-stop list
  const [db, setDb] = useState<DatabaseType>(initialDb);
  const renewDb = useCallback(
    () =>
      fetchDbFunc(true).then((a) => {
        setDb(a);
      }),
    []
  );
  useEffect(() => {
    renewDb();
  }, [renewDb]);

  const getInitialState = (): AppState => {
    let devicePreferColorScheme = "dark"; // set default color theme in prerendering to "dark"
    if (typeof window !== "undefined") {
      devicePreferColorScheme =
        localStorage.getItem("colorMode") ||
        (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark");
    }
    const searchRoute = "";
    const geoPermission: unknown =
      typeof window !== "undefined"
        ? localStorage.getItem("geoPermission")
        : null;
    const geoLocation: unknown =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("geolocation"))
        : null;
    const busSortOrder: unknown =
      typeof window !== "undefined"
        ? localStorage.getItem("busSortOrder")
        : null;
    const numPadOrder: unknown =
      typeof window !== "undefined"
        ? localStorage.getItem("numPadOrder")
        : null;
    const etaFormat: unknown =
      typeof window !== "undefined" ? localStorage.getItem("etaFormat") : null;
    const savedEtas: unknown =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("savedEtas"))
        : null;
    const hotRoute: unknown =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("hotRoute"))
        : null;

    return {
      searchRoute: searchRoute,
      selectedRoute: "1-1-CHUK-YUEN-ESTATE-STAR-FERRY",
      geoPermission: isGeoPremission(geoPermission) ? geoPermission : null,
      geolocation: isGeoLocation(geoLocation)
        ? geoLocation
        : defaultGeolocation,
      hotRoute: isNumberRecord(hotRoute) ? hotRoute : {},
      savedEtas:
        Array.isArray(savedEtas) && isStrings(savedEtas) ? savedEtas : [],
      isRouteFilter:
        !!JSON.parse(
          typeof window !== "undefined"
            ? localStorage.getItem("isRouteFilter")
            : "false"
        ) || false,
      busSortOrder: isBusSortOrder(busSortOrder) ? busSortOrder : "KMB first",
      numPadOrder: isNumPadOrder(numPadOrder) ? numPadOrder : "123456789c0b",
      etaFormat: isEtaFormat(etaFormat) ? etaFormat : "diff",
      colorMode: isColorMode(devicePreferColorScheme)
        ? devicePreferColorScheme
        : "dark",
      energyMode:
        !!JSON.parse(
          typeof window !== "undefined"
            ? localStorage.getItem("energyMode")
            : "false"
        ) || false,
      vibrateDuration:
        JSON.parse(
          typeof window !== "undefined"
            ? localStorage.getItem("vibrateDuration")
            : "1"
        ) ?? 1,
      isVisible: true,
      analytics:
        JSON.parse(
          typeof window !== "undefined"
            ? localStorage.getItem("analytics")
            : "true"
        ) ?? true,
    };
  };
  useEffect(() => {
    state.analytics && reportWebVitals(sendToGoogleAnalytics);
  });
  const { i18n } = useTranslation();
  type State = AppState;
  const [state, setStateRaw] = useState(getInitialState);
  const { geoPermission } = state;
  const setState = useCallback((updater: (state: State) => void | State) => {
    if (typeof updater === "function") {
      setStateRaw(produce(updater));
    } else {
      setStateRaw(freeze(updater));
    }
  }, []);
  const setSearchRoute = useCallback(
    (searchRoute: string) => {
      setState((state) => {
        state.searchRoute = searchRoute;
      });
    },
    [setState]
  );

  useEffect(() => {
    if (geoPermission === "granted") {
      try {
        const _geoWatcherId = navigator.geolocation.watchPosition(
          ({ coords: { latitude, longitude } }) => {
            updateGeolocation({ lat: latitude, lng: longitude });
          }
        );
        geoWatcherId.current = _geoWatcherId;
      } catch (e) {
        console.error("cannot watch position", e);
      }
    }
    const onVisibilityChange = () => {
      setStateRaw(
        produce((state: State) => {
          state.isVisible = !document.hidden;
        })
      );
    };
    window.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      if (geoWatcherId.current) {
        navigator.geolocation.clearWatch(geoWatcherId.current);
      }
      window.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateGeolocation = useCallback((geolocation: GeoLocation) => {
    setStateRaw(
      produce((state: State) => {
        state.geolocation = geolocation;
        localStorage.setItem("geolocation", JSON.stringify(geolocation));
      })
    );
  }, []);

  const setGeoPermission = useCallback(
    (geoPermission: AppState["geoPermission"]) => {
      setState((state) => {
        state.geoPermission = geoPermission;
      });
    },
    [setState]
  );
  const geoWatcherId = useRef(null);

  const updateGeoPermission = useCallback(
    (geoPermission: AppState["geoPermission"], deniedCallback?: () => void) => {
      if (geoPermission === "opening") {
        setGeoPermission("opening");
        const _geoWatcherId = navigator.geolocation.watchPosition(
          ({ coords: { latitude, longitude } }) => {
            updateGeolocation({ lat: latitude, lng: longitude });
            setGeoPermission("granted");
            localStorage.setItem("geoPermission", "granted");
          },
          () => {
            setGeoPermission("denied");
            localStorage.setItem("geoPermission", "denied");
            if (deniedCallback) deniedCallback();
          }
        );
        geoWatcherId.current = _geoWatcherId;
      } else if (geoWatcherId.current) {
        navigator.geolocation.clearWatch(geoWatcherId.current);
        geoWatcherId.current = null;
        setGeoPermission(geoPermission);
        localStorage.setItem("geoPermission", geoPermission);
      }
    },
    [setGeoPermission, updateGeolocation]
  );

  const toggleRouteFilter = useCallback(() => {
    setStateRaw(
      produce((state: State) => {
        const prev = state.isRouteFilter;
        const isRouteFilter = prev ? false : true;
        localStorage.setItem("isRouteFilter", JSON.stringify(isRouteFilter));
        state.isRouteFilter = isRouteFilter;
      })
    );
  }, []);

  const toggleBusSortOrder = useCallback(() => {
    setStateRaw(
      produce((state: State) => {
        const prevOrder = state.busSortOrder;
        const busSortOrder =
          prevOrder === "KMB first" ? "CTB-NWFB first" : "KMB first";
        localStorage.setItem("busSortOrder", busSortOrder);
        state.busSortOrder = busSortOrder;
      })
    );
  }, []);

  const toggleNumPadOrder = useCallback(() => {
    setStateRaw(
      produce((state: State) => {
        const prevOrder = state.numPadOrder;
        const numPadOrder =
          prevOrder === "123456789c0b" ? "789456123c0b" : "123456789c0b";
        localStorage.setItem("numPadOrder", numPadOrder);
        state.numPadOrder = numPadOrder;
      })
    );
  }, []);

  const toggleEtaFormat = useCallback(() => {
    setStateRaw(
      produce((state: State) => {
        const prev = state.etaFormat;
        const etaFormat = ETA_FORMAT_NEXT_TYPES[prev];
        localStorage.setItem("etaFormat", etaFormat);
        state.etaFormat = etaFormat;
      })
    );
  }, []);

  const toggleColorMode = useCallback(() => {
    setStateRaw(
      produce((state: State) => {
        const prevColorMode = state.colorMode;
        const colorMode = prevColorMode === "dark" ? "light" : "dark";
        localStorage.setItem("colorMode", colorMode);
        state.colorMode = colorMode;
      })
    );
  }, []);

  const toggleEnergyMode = useCallback(() => {
    setStateRaw(
      produce((state: State) => {
        const prevEnergyMode = state.energyMode;
        const energyMode = !prevEnergyMode;
        localStorage.setItem("energyMode", JSON.stringify(energyMode));
        state.energyMode = energyMode;
      })
    );
  }, []);

  const toggleAnalytics = useCallback(() => {
    setStateRaw(
      produce((state: State) => {
        const prev = state.analytics;
        const analytics = !prev;
        localStorage.setItem("analytics", JSON.stringify(analytics));
        state.analytics = analytics;
      })
    );
  }, []);

  const toggleVibrateDuration = useCallback(() => {
    setStateRaw(
      produce((state: State) => {
        const prevVibrateDuration = state.vibrateDuration;
        const vibrateDuration = prevVibrateDuration ? 0 : 1;
        localStorage.setItem(
          "vibrateDuration",
          JSON.stringify(vibrateDuration)
        );
        state.vibrateDuration = vibrateDuration;
      })
    );
  }, []);

  const updateSearchRouteByButton = useCallback(
    (buttonValue: string) => {
      vibrate(state.vibrateDuration);
      setTimeout(() => {
        setStateRaw(
          produce((state: State) => {
            const prevSearchRoute = state.searchRoute;
            let ret;
            switch (buttonValue) {
              case "b":
                ret = prevSearchRoute.slice(0, -1);
                break;
              case "c":
                ret = "";
                break;
              default:
                ret = prevSearchRoute + buttonValue;
            }
            state.searchRoute = ret;
          })
        );
      }, 0);
    },
    [state.vibrateDuration]
  );

  const updateSelectedRoute = useCallback((route: string, seq: string = "") => {
    setStateRaw(
      produce((state: State) => {
        state.selectedRoute = `${route}/${seq}`;
        if (seq) {
          if (state.hotRoute[route + "/" + seq]) {
            state.hotRoute[route + "/" + seq] =
              state.hotRoute[route + "/" + seq] + 1;
          } else {
            state.hotRoute[route + "/" + seq] = 1;
          }
          localStorage.setItem(
            "hotRoute",
            JSON.stringify(current(state.hotRoute))
          );
        }
      })
    );
  }, []);

  const updateSavedEtas = useCallback((key: string) => {
    setStateRaw(
      produce((state: State) => {
        const prevSavedEtas = state.savedEtas;
        if (prevSavedEtas.includes(key)) {
          prevSavedEtas.splice(prevSavedEtas.indexOf(key), 1);
          localStorage.setItem(
            "savedEtas",
            JSON.stringify(current(prevSavedEtas))
          );
          state.savedEtas = prevSavedEtas;
          return;
        }
        const newSavedEtas = prevSavedEtas
          .concat(key)
          .filter((v, i, s) => s.indexOf(v) === i);
        localStorage.setItem("savedEtas", JSON.stringify(newSavedEtas));
        state.savedEtas = newSavedEtas;
      })
    );
  }, []);

  // for re-ordering
  const setSavedEtas = useCallback((savedEtas) => {
    setStateRaw(
      produce((state: State) => {
        localStorage.setItem("savedEtas", JSON.stringify(savedEtas));
        state.savedEtas = savedEtas;
      })
    );
  }, []);

  const resetUsageRecord = useCallback(() => {
    localStorage.clear();
    setStateRaw(
      produce((state: State) => {
        state.hotRoute = {};
        state.geolocation = defaultGeolocation;
        state.savedEtas = [];
      })
    );
  }, []);

  const changeLanguage = useCallback(
    (lang: "zh" | "en") => {
      i18n.changeLanguage(lang);
      localStorage.setItem("lang", lang);
    },
    [i18n]
  );

  const contextValue = useMemo(() => {
    return {
      ...state,
      AppTitle,
      db,
      renewDb,
      setSearchRoute,
      updateSearchRouteByButton,
      updateSelectedRoute,
      updateGeolocation,
      updateSavedEtas,
      setSavedEtas,
      resetUsageRecord,
      updateGeoPermission,
      toggleRouteFilter,
      toggleBusSortOrder,
      toggleNumPadOrder,
      toggleEtaFormat,
      toggleColorMode,
      toggleEnergyMode,
      toggleVibrateDuration,
      toggleAnalytics,
      changeLanguage,
      workbox,
    };
  }, [
    state,
    db,
    renewDb,
    setSearchRoute,
    updateSearchRouteByButton,
    updateSelectedRoute,
    updateGeolocation,
    updateSavedEtas,
    setSavedEtas,
    resetUsageRecord,
    updateGeoPermission,
    toggleRouteFilter,
    toggleBusSortOrder,
    toggleNumPadOrder,
    toggleEtaFormat,
    toggleColorMode,
    toggleEnergyMode,
    toggleVibrateDuration,
    toggleAnalytics,
    changeLanguage,
    workbox,
  ]);
  const theme = useMemo(() => {
    return createTheme(getThemeTokens(state.colorMode), [state.colorMode]);
  }, [state.colorMode]);
  return (
    <DbProvider AppTitle={AppTitle} db={db} renewDb={renewDb}>
      <AppContext.Provider value={contextValue}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <CacheProvider value={emotionCache}>{children}</CacheProvider>
          </StyledEngineProvider>
        </ThemeProvider>
      </AppContext.Provider>
    </DbProvider>
  );
};

export default AppContext;
export type { AppContextValue };
