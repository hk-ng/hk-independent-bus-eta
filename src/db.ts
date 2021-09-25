import { fetchEtaObj, fetchEtaObjMd5 } from "hk-bus-eta";
import { decompress as decompressJson } from "lzutf8";
import { decompress as _decompressJson } from "compressed-json";

// implant the DB Context logic into code to avoid loading error
export const DB_CONTEXT_VERSION = "1.2.0";

const decompressJsonString = (txt) => {
  try {
    const ret = JSON.parse(decompressJson(txt, { inputEncoding: "Base64" }));
    return {
      ...ret,
      // sort the routeList object order based on the key
      routeList: Object.keys(ret.routeList)
        .sort()
        .reduce((acc, k) => {
          acc[k.replace(/\+/g, "-").replace(/ /g, "-").toUpperCase()] =
            ret.routeList[k];
          return acc;
        }, {}),
    };
  } catch (e) {
    try {
      // backward compactability
      return _decompressJson(JSON.parse(txt));
    } catch (e2) {
      // return empty object if no valid JSON string parsed
      return { routeList: {}, stopList: {}, stopMap: {} };
    }
  }
};

// to optimize the data fetching significantly
// we define the fetchDbFunc outside the components
// and we hence able to fetch data before rendering
export const fetchDbFunc = (forceRenew = false) => {
  if (localStorage.getItem("dbv") !== DB_CONTEXT_VERSION) {
    console.log("New DB, will refetch data");
    localStorage.removeItem("db");
    localStorage.removeItem("versionMd5");
    localStorage.removeItem("routeList");
    localStorage.removeItem("stopList");
    localStorage.removeItem("stopMap");
    localStorage.setItem("dbv", DB_CONTEXT_VERSION);
  }
  const schemaVersion = localStorage.getItem("schemaVersion");
  const versionMd5 = localStorage.getItem("versionMd5");
  const lastUpdateTime =
    parseInt(localStorage.getItem("updateTime"), 10) || Date.now();
  const storedDb = new Promise((resolve) => {
    resolve({
      schemaVersion,
      versionMd5,
      db: decompressJsonString(localStorage.getItem("db")),
    });
  });

  if (
    localStorage.getItem("db") &&
    (!navigator.onLine ||
      (!forceRenew && Date.now() - lastUpdateTime < 7 * 24 * 3600 * 1000))
  ) {
    return storedDb;
  }

  return Promise.all([
    fetch(process.env.PUBLIC_URL + "/schema-version.txt").then((r) => r.text()),
    fetchEtaObjMd5(),
  ])
    .then(([_schemaVersion, _md5]) => {
      let needRenew = forceRenew;
      if (schemaVersion !== _schemaVersion) {
        needRenew = true;
      }
      if (versionMd5 !== _md5) {
        needRenew = true;
      }

      if (needRenew) {
        localStorage.setItem("updateTime", Date.now().toString());
        return new Promise((resolve) => {
          const timerId = setTimeout(() => {
            if (!forceRenew && localStorage.getItem("db")) {
              resolve(storedDb);
            }
          }, 1000);
          fetchEtaObj()
            .then((db) => ({
              db: {
                ...db,
                routeList: Object.keys(db.routeList)
                  .sort()
                  .reduce((acc, k) => {
                    acc[
                      k.replace(/\+/g, "-").replace(/ /g, "-").toUpperCase()
                    ] = db.routeList[k];
                    return acc;
                  }, {}),
              },
              schemaVersion: _schemaVersion,
              versionMd5: _md5,
            }))
            .then((ret) => {
              localStorage.setItem("schemaVersion", _schemaVersion);
              localStorage.setItem("versionMd5", _md5);
              clearTimeout(timerId);
              resolve(ret);
            });
        });
      }

      return new Promise((resolve) => {
        resolve({
          schemaVersion,
          versionMd5,
          db: decompressJsonString(localStorage.getItem("db")),
        });
      });
    })
    .catch((r) => {
      // mock data for App.test.js
      return new Promise((resolve) => {
        resolve({
          schemaVersion: "",
          versionMd5: "",
          ...initDb,
        });
      });
    });
};

// actually start fetching DB once the script is runned
export const initDb = {
  db: { holidays: [] as string[], routeList: {}, stopList: {}, stopMap: {} },
};
