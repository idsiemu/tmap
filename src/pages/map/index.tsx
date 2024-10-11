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

  const walkLoad = async (requestData: any) => {
    try {
      // const resultData = JSON.parse(requestData)
      const resultData = requestData.features
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
            tempDrawInfoArr.push(new Tmapv2.LatLng(
                geometry.coordinates[j][1],
                geometry.coordinates[j][0],
            ));

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

      <div ref={mapElement} style={{ width: "100%", height: "100vh" }} />
    </>
  );
}

export default MapScreen;
