import React, { useCallback, useContext } from "react";
import { Input, Tabs, Tab, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "@reach/router";
import { Link, navigate} from "gatsby"
import { useTranslation } from "react-i18next";
import AppContext from "../../AppContext";
import { vibrate, checkMobile } from "../../utils";

const Header = () => {
  const {
    searchRoute,
    setSearchRoute,
    db: { routeList },
  } = useContext(AppContext);

  const { t, i18n } = useTranslation();
  useStyles();
  const location = useLocation();
  const path = location.pathname;
  const handleLanguageChange = useCallback(
    (_, lang) => {
      vibrate(1);
      navigate(location.pathname.replace("/" + i18n.language, "/" + lang), {
        replace: true,
      });
      i18n.changeLanguage(lang);
    },
    [i18n, location.pathname]
  );

  const preventDefault = useCallback<
    React.EventHandler<React.SyntheticEvent<any>>
  >((e) => {
    e.preventDefault();
  }, []);

  const searchInputOnChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      if (
        e.target.value.toUpperCase() in routeList ||
        e.target.value in routeList
      ) {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        navigate(`/${i18n.language}/route/${e.target.value}`);
      }
      setSearchRoute(e.target.value);
    },
    [i18n.language, routeList, setSearchRoute]
  );

  const onSearchInputFocus = useCallback(() => {
    vibrate(1);
    if (navigator.userAgent !== "prerendering" && checkMobile()) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
    navigate(`/${i18n.language}/board`, { replace: true });
  }, [i18n.language]);

  const onClickSubTitle = useCallback(() => {
    vibrate(1);
    navigate(`/${i18n.language}/board`, { replace: true });
  }, [i18n.language]);

  return (
    <Toolbar className={"header-toolbar"}>
      <Link
        to={`/${i18n.language}/board`}
        onClick={onClickSubTitle}
        rel="nofollow"
      >
        <Typography
          component="h1"
          variant="subtitle2"
          className={"header-appTitle"}
        >
          {t("巴士到站預報")}
        </Typography>
      </Link>
      <Input
        id="searchInput"
        className={"header-searchRouteInput"}
        type="text"
        value={searchRoute}
        placeholder={t("巴士線")}
        onChange={searchInputOnChange}
        onFocus={onSearchInputFocus}
        disabled={path.includes("/route/")}
      />
      <Tabs
        className={"language-tabs"}
        value={i18n.language}
        onChange={handleLanguageChange}
      >
        <Tab
          disableRipple
          className={"language-tab"}
          id="en-selector"
          value="en"
          label="En"
          component={Link}
          to={`${location.pathname.replace("/zh", "/en")}`}
          onClick={preventDefault}
        />
        <Tab
          disableRipple
          className={"language-tab"}
          id="zh-selector"
          value="zh"
          label="繁"
          component={Link}
          to={`${location.pathname.replace("/en", "/zh")}`}
          onClick={preventDefault}
        />
      </Tabs>
    </Toolbar>
  );
};

export default Header;

const useStyles = makeStyles((theme) => ({
  "@global": {
    ".header-appTitle": {
      color:
        theme.palette.type === "dark"
          ? theme.palette.primary.main
          : theme.palette.text.primary,
    },
    ".header-toolbar": {
      backgroundColor:
        theme.palette.type === "dark"
          ? theme.palette.background.default
          : theme.palette.primary.main,
      "& a": {
        color: "black",
        textDecoration: "none",
      },
      display: "flex",
      justifyContent: "space-between",
      zIndex: theme.zIndex.drawer * 2,
    },
    ".header-searchRouteInput": {
      maxWidth: "50px",
      "& input": {
        textAlign: "center",
      },
      "& input::before": {
        borderBottom: `1px ${theme.palette.text.primary} solid`,
      },
    },
    ".language-tabs": {
      borderBottom: "none",
      minHeight: 24,
      "& .MuiTabs-indicator": {
        backgroundColor: "transparent",
      },
    },
    ".language-tab": {
      textTransform: "none",
      minWidth: 36,
      fontWeight: 900,
      marginRight: theme.spacing(0),
      fontSize: "15px",
      opacity: 1,
      padding: "6px 6px",
      "& .MuiTab-wrapper": {
        color: theme.palette.text.primary,
        borderRadius: "30px",
        padding: "2px 10px 0px 10px",
      },
    },
    ".language-tab.Mui-selected": {
      "& .MuiTab-wrapper": {
        color: "black",
        backgroundColor:
          theme.palette.type === "dark"
            ? theme.palette.primary.main
            : theme.palette.background.paper,
      },
    },
  },
}));
