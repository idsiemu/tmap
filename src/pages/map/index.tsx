import axios from "axios";
import { flutterCallHandler } from "components/webViewUtils";
import { REACT_APP_TMAP_API_KEY } from "envs/indext";
import React, { useEffect, useRef, useState } from "react";

const { Tmapv2 } = window;

export interface IRequestPath {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  reqCoordType: string;
  resCoordType: string;
  startName: string;
  endName: string;
}

export interface ICenter {
  lat: number;
  lng: number;
}

const appKey = 'Z97RUN4aEB5Vim1sBdP7p3HhTachpyfZ3knXV6hk'

function MapScreen() {
  const mapElement = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [map, setMap] = useState(null);
  const [drawInfoArr, setDrawInfoArr] = useState<any[]>([]);
  const [center, setCenter] = useState<ICenter | null>(null);
  const polylineRef = useRef(null); // Polyline 객체를 참조하기 위한 useRef

  const fetchWalkLoad = async (requestData: IRequestPath) => {
    const headers = {
      // REACT_APP_TMAP_API_KEY
      appKey: appKey,
    };
    try {
      const response = await axios.post(
        "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
        requestData,
        { headers: headers }
      );
      const resultData = response.data.features;
      const tempDrawInfoArr = [];

      for (let i in resultData) {
        const geometry = resultData[i].geometry;
        if (geometry.type === "LineString") {
          for (let j in geometry.coordinates) {
            const latlng = new Tmapv2.Point(
              geometry.coordinates[j][0],
              geometry.coordinates[j][1]
            );
            const convertPoint =
              new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
            const convertChange = new Tmapv2.LatLng(
              convertPoint._lat,
              convertPoint._lng
            );
            tempDrawInfoArr.push(convertChange);
          }
        }
      }

      setDrawInfoArr(tempDrawInfoArr);
    } catch (e) {
      console.log(e);
    }
  };

  const walkLoad = async (resultData: any) => {
    try {
      // const resultData = JSON.parse(requestData)
      const tempDrawInfoArr = [];

      for (let i in resultData) {
        const geometry = resultData[i].geometry;
        if (geometry.type === "LineString") {
          for (let j in geometry.coordinates) {
            const latlng = new Tmapv2.Point(
                geometry.coordinates[j][0],
                geometry.coordinates[j][1]
            );
            const convertPoint =
                new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
            const convertChange = new Tmapv2.LatLng(
                convertPoint._lat,
                convertPoint._lng
            );
            tempDrawInfoArr.push(convertChange);
          }
        }
      }

      setDrawInfoArr(tempDrawInfoArr);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeCenter = (param: ICenter) => {
    setCenter(param);
  };

  const loadMap = () => {
    if (load) {
      if (mapElement.current) {
        const map = new Tmapv2.Map(mapElement.current, {
          center: new Tmapv2.LatLng(37.5665, 126.978), // 서울의 좌표
          width: "100%",
          height: "880px",
          zoom: 15,
        });
        setMap(map);
      }
    } else {
      setLoad(true);
    }
  };

  useEffect(() => {
    loadMap();
  }, [load]);

  useEffect(() => {
    if (drawInfoArr.length && map) {
      if (polylineRef.current) {
        // @ts-ignore
        polylineRef.current.setMap(null);
      }
      polylineRef.current = new Tmapv2.Polyline({
        path: drawInfoArr,
        strokeColor: "#0074D9",
        strokeWeight: 6,
        strokeOpacity: 1,
        map: map,
      });
    }
  }, [drawInfoArr]);

  useEffect(() => {
    if (center && map) {
      // @ts-ignore
      map.setCenter(new Tmapv2.LatLng(center.lat, center.lng));
    }
  }, [center]);

  useEffect(() => {
    window.fetchWalkLoad = fetchWalkLoad;
    window.walkLoad = walkLoad;
    window.handleChangeCenter = handleChangeCenter;
  }, []);

  useEffect(() => {
    if (map) {
      flutterCallHandler({
        handlerName: "mapLoaded",
      });
      // 경로 설정 예제
      // fetchWalkLoad({
      //   startX: 126.9779692,
      //   startY: 37.566535,
      //   endX: 127.03237,
      //   endY: 37.49795,
      //   reqCoordType: "WGS84GEO",
      //   resCoordType: "EPSG3857",
      //   startName: "출발지",
      //   endName: "도착지",
      // });
    }
  }, [map, window.walkLoad, window.fetchWalkLoad, window.handleChangeCenter]);

  return (
    <>
      <button onClick={() => {
        walkLoad(temp.features)
      }}>asdfasdf</button>
      <div ref={mapElement} style={{ width: "100%", height: "100vh" }} />
    </>
  );
}

export default MapScreen;

const temp = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          14135786,
          4518153
        ]
      },
      "properties": {
        "totalDistance": 563,
        "totalTime": 466,
        "index": 0,
        "pointIndex": 0,
        "name": "",
        "description": "29m 이동",
        "direction": "",
        "nearPoiName": "",
        "nearPoiX": "0.0",
        "nearPoiY": "0.0",
        "intersectionName": "",
        "facilityType": "11",
        "facilityName": "",
        "turnType": 200,
        "pointType": "SP"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            14135786,
            4518153
          ],
          [
            14135822,
            4518155
          ]
        ]
      },
      "properties": {
        "index": 1,
        "lineIndex": 0,
        "name": "",
        "description": ", 29m",
        "distance": 29,
        "time": 21,
        "roadType": 0,
        "categoryRoadType": 0,
        "facilityType": "11",
        "facilityName": ""
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          14135822,
          4518155
        ]
      },
      "properties": {
        "index": 2,
        "pointIndex": 1,
        "name": "미스터빈대떡 명동점",
        "description": "미스터빈대떡 명동점 에서 좌회전 후 보행자도로 을 따라 106m 이동 ",
        "direction": "",
        "nearPoiName": "미스터빈대떡 명동점",
        "nearPoiX": "0.0",
        "nearPoiY": "0.0",
        "intersectionName": "",
        "facilityType": "11",
        "facilityName": "",
        "turnType": 12,
        "pointType": "GP"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            14135822,
            4518155
          ],
          [
            14135823,
            4518177
          ],
          [
            14135819,
            4518221
          ],
          [
            14135815,
            4518243
          ],
          [
            14135810,
            4518274
          ],
          [
            14135810,
            4518289
          ]
        ]
      },
      "properties": {
        "index": 3,
        "lineIndex": 1,
        "name": "보행자도로",
        "description": "보행자도로, 106m",
        "distance": 106,
        "time": 82,
        "roadType": 22,
        "categoryRoadType": 0,
        "facilityType": "11",
        "facilityName": ""
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          14135810,
          4518289
        ]
      },
      "properties": {
        "index": 4,
        "pointIndex": 2,
        "name": "세븐일레븐 명동채원점",
        "description": "세븐일레븐 명동채원점 에서 우회전 후 을지로 을 따라 148m 이동 ",
        "direction": "",
        "nearPoiName": "세븐일레븐 명동채원점",
        "nearPoiX": "0.0",
        "nearPoiY": "0.0",
        "intersectionName": "",
        "facilityType": "11",
        "facilityName": "",
        "turnType": 13,
        "pointType": "GP"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            14135810,
            4518289
          ],
          [
            14135821,
            4518288
          ],
          [
            14135835,
            4518289
          ],
          [
            14135957,
            4518290
          ],
          [
            14135968,
            4518290
          ],
          [
            14135986,
            4518291
          ],
          [
            14135997,
            4518291
          ]
        ]
      },
      "properties": {
        "index": 5,
        "lineIndex": 2,
        "name": "을지로",
        "description": "을지로, 148m",
        "distance": 148,
        "time": 136,
        "roadType": 22,
        "categoryRoadType": 0,
        "facilityType": "11",
        "facilityName": ""
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          14135997,
          4518291
        ]
      },
      "properties": {
        "index": 6,
        "pointIndex": 3,
        "name": "",
        "description": "횡단보도 후 보행자도로 을 따라 7m 이동 ",
        "direction": "",
        "nearPoiName": "",
        "nearPoiX": "0.0",
        "nearPoiY": "0.0",
        "intersectionName": "",
        "facilityType": "15",
        "facilityName": "",
        "turnType": 211,
        "pointType": "GP"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            14135997,
            4518291
          ],
          [
            14136005,
            4518292
          ]
        ]
      },
      "properties": {
        "index": 7,
        "lineIndex": 3,
        "name": "보행자도로",
        "description": "보행자도로, 7m",
        "distance": 7,
        "time": 4,
        "roadType": 21,
        "categoryRoadType": 0,
        "facilityType": "15",
        "facilityName": ""
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          14136005,
          4518292
        ]
      },
      "properties": {
        "index": 8,
        "pointIndex": 4,
        "name": "",
        "description": "직진 후 을지로 을 따라 114m 이동 ",
        "direction": "",
        "nearPoiName": "",
        "nearPoiX": "0.0",
        "nearPoiY": "0.0",
        "intersectionName": "",
        "facilityType": "11",
        "facilityName": "",
        "turnType": 11,
        "pointType": "GP"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            14136005,
            4518292
          ],
          [
            14136030,
            4518293
          ],
          [
            14136058,
            4518295
          ],
          [
            14136149,
            4518298
          ]
        ]
      },
      "properties": {
        "index": 9,
        "lineIndex": 4,
        "name": "을지로",
        "description": "을지로, 114m",
        "distance": 114,
        "time": 82,
        "roadType": 21,
        "categoryRoadType": 0,
        "facilityType": "11",
        "facilityName": ""
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            14136149,
            4518298
          ],
          [
            14136152,
            4518298
          ],
          [
            14136157,
            4518293
          ],
          [
            14136159,
            4518292
          ]
        ]
      },
      "properties": {
        "index": 10,
        "lineIndex": 5,
        "name": "삼일대로",
        "description": "삼일대로, 10m",
        "distance": 10,
        "time": 37,
        "roadType": 21,
        "categoryRoadType": 0,
        "facilityType": "11",
        "facilityName": ""
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          14136159,
          4518292
        ]
      },
      "properties": {
        "index": 11,
        "pointIndex": 5,
        "name": "을지지하쇼핑센터",
        "description": "을지지하쇼핑센터 에서 좌측 횡단보도 후 보행자도로 을 따라 46m 이동 ",
        "direction": "",
        "nearPoiName": "을지지하쇼핑센터",
        "nearPoiX": "0.0",
        "nearPoiY": "0.0",
        "intersectionName": "",
        "facilityType": "15",
        "facilityName": "",
        "turnType": 212,
        "pointType": "GP"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            14136159,
            4518292
          ],
          [
            14136217,
            4518293
          ]
        ]
      },
      "properties": {
        "index": 12,
        "lineIndex": 6,
        "name": "보행자도로",
        "description": "보행자도로, 46m",
        "distance": 46,
        "time": 31,
        "roadType": 21,
        "categoryRoadType": 0,
        "facilityType": "15",
        "facilityName": ""
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          14136217,
          4518293
        ]
      },
      "properties": {
        "index": 13,
        "pointIndex": 6,
        "name": "",
        "description": "좌회전 후 삼일대로 을 따라 14m 이동 ",
        "direction": "",
        "nearPoiName": "",
        "nearPoiX": "0.0",
        "nearPoiY": "0.0",
        "intersectionName": "",
        "facilityType": "11",
        "facilityName": "",
        "turnType": 12,
        "pointType": "GP"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            14136217,
            4518293
          ],
          [
            14136218,
            4518295
          ],
          [
            14136221,
            4518298
          ],
          [
            14136232,
            4518299
          ]
        ]
      },
      "properties": {
        "index": 14,
        "lineIndex": 7,
        "name": "삼일대로",
        "description": "삼일대로, 14m",
        "distance": 14,
        "time": 10,
        "roadType": 21,
        "categoryRoadType": 0,
        "facilityType": "11",
        "facilityName": ""
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            14136232,
            4518299
          ],
          [
            14136344,
            4518304
          ]
        ]
      },
      "properties": {
        "index": 15,
        "lineIndex": 8,
        "name": "을지로",
        "description": "을지로, 89m",
        "distance": 89,
        "time": 63,
        "roadType": 21,
        "categoryRoadType": 0,
        "facilityType": "11",
        "facilityName": ""
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          14136344,
          4518304
        ]
      },
      "properties": {
        "index": 16,
        "pointIndex": 7,
        "name": "도착지",
        "description": "도착",
        "direction": "",
        "nearPoiName": "도착지",
        "nearPoiX": "0.0",
        "nearPoiY": "0.0",
        "intersectionName": "도착지",
        "facilityType": "",
        "facilityName": "",
        "turnType": 201,
        "pointType": "EP"
      }
    }
  ]
}