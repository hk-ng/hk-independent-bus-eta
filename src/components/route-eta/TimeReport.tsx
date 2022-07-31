import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AppContext from "../../AppContext";
import { useEtas } from "../Etas";
import { LinearProgress } from "../Progress";
interface TimeReportProps {
  routeId: string;
  seq: number;
  containerClass?: string;
  showStopName?: boolean;
}

const TimeReport = ({
  routeId,
  seq,
  containerClass = "",
  showStopName = false,
}: TimeReportProps) => {
  const { t, i18n } = useTranslation();
  const { db, etaFormat } = useContext(AppContext);
  const etas = useEtas(`${routeId}/${seq}`);

  if (etas == null) {
    return (
      <div className={containerClass}>
        <LinearProgress />
      </div>
    );
  }

  const displayMsg = (eta) => {
    if (!eta) return "";
    else {
      const waitTime = Math.round(
        (new Date(eta).getTime() - new Date().getTime()) / 60 / 1000
      );

      if (!Number.isInteger(waitTime)) {
        return eta.remark[i18n.language];
      }
      const exactTimeStr = eta.substr(11, 5);
      const waitTimeStr =
        waitTime < 1 ? `- ${t("分鐘")}` : `${waitTime} ${t("分鐘")}`;
      switch (etaFormat) {
        case "exact":
          return exactTimeStr;
        case "diff":
          return waitTimeStr;
        default:
          return `${exactTimeStr} (${waitTimeStr})`;
      }
    }
  };
  const stopId =
    db.routeList !== undefined
      ? Object.values(db.routeList[routeId].stops)[0][seq]
      : 0;

  return (
    <div className={containerClass}>
      {showStopName ? (
        <Typography variant="caption">
          {db.stopList?.[stopId].name[i18n.language]}
        </Typography>
      ) : null}
      {etas.length === 0
        ? t("未有班次資料")
        : etas.map((eta, idx) => (
            <Typography variant="subtitle1" key={`route-${idx}`}>
              {displayMsg(eta.eta)} -{" "}
              {eta.remark[i18n.language] ? eta.remark[i18n.language] : ""}{" "}
              {t(eta.co)}
            </Typography>
          ))}
    </div>
  );
};

export default TimeReport;
