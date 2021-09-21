import { Drawer, List, ListItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const ServiceIds = {
  31: "星期一至五",
  287: "星期一至五",
  415: "星期一至五",
  63: "星期一至六",
  319: "星期一至六",
  447: "星期一至六",
  416: "星期六至日",
  480: "星期六至日",
  266: "星期二至四",
  271: "星期一至四",
  272: "星期五",
  288: "星期六",
  320: "星期日及公眾假期",
  448: "星期日及公眾假期",
  511: "所有日子",
};

const TimetableDrawer = ({ freq, open, onClose }) => {
  const { t } = useTranslation();
  useStyles();
  const list = useMemo(() => {
    return Object.entries(freq).map(([serviceId, dayFreq]) => (
      <ListItem key={`${serviceId}`} className="timetable-entries">
        <Typography variant="subtitle1">{t(ServiceIds[serviceId])}</Typography>
        {Object.entries(dayFreq)
          .sort((a, b) => (a[0] < b[0] ? -1 : 1))
          .map(([start, details]) => (
            <div
              key={`${serviceId}-${start}`}
              className="timetable-freqContainer"
            >
              <Typography variant="caption">
                {start} {details ? `-${details[0]}` : ""}
              </Typography>
              {details ? (
                <Typography variant="caption">
                  {parseInt(details[1], 10) / 60}
                  {t("分鐘")}
                </Typography>
              ) : (
                <></>
              )}
            </div>
          ))}
      </ListItem>
    ));
  }, [freq, t]);
  const modalProps = useMemo(() => {
    return {
      onClose: () => {
        onClose();
      },
    };
  }, [onClose]);
  const paperProps = useMemo(() => {
    return { className: "timetable-drawer" };
  }, []);
  return (
    <Drawer
      open={open}
      ModalProps={modalProps}
      PaperProps={paperProps}
      anchor="right"
    >
      <List>{list}</List>
    </Drawer>
  );
};

export default TimetableDrawer;

const useStyles = makeStyles((theme) => ({
  "@global": {
    ".timetable-drawer": {
      height: "100vh",
      width: "80%",
      maxWidth: "320px",
      paddingTop: "56px",
      paddingLeft: "20px",
      backgroundColor:
        theme.palette.type === "dark"
          ? theme.palette.background.default
          : theme.palette.primary.main,
    },
    ".timetable-entries": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    ".timetable-freqContainer": {
      display: "flex",
      justifyContent: "space-between",
      width: "80%",
    },
  },
}));
