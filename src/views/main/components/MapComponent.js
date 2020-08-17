import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Map,
  TileLayer,
  CircleMarker,
  Marker,
  Circle,
  Tooltip,
  Polygon,
  SVGOverlay,
} from "react-leaflet";
import styles from "../../../style/main/components/MapComponent.module.scss";
import "leaflet/dist/leaflet.css";
import { getApiUrl } from "../../../config/ApiURL";
import AnimatedMapPopup from "./AnimatedMapPopup";
import { AirQualityColors, indexToLevel } from "../../../config/AirQuality";

import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function MapComponent() {
  const constans = {
    lat: 50.0622881,
    lng: 19.9311482,
    initialZoom: 13,
  };

  const calculateMarkerSize = (zoom) => Math.cos((zoom * Math.PI) / 36) * -10 + 10;

  const [currentMarkerSize, setCurrentMarkerSize] = useState(calculateMarkerSize(constans.initialZoom))

  const [stationData, setStationData] = useState(null)
  
  const [stationFullData, setStationFullData] = useState({})

  const [stationDataLastFetchDate, setStationDataLastFetchDate] = useState(null)

  const [isGeolocalizationEnable, setIsGeolocalizationEnable] = useState(false)

  const [userCurrentPosition, setUserCurrentPosition] = useState({
    lat: 50.0622881,
    lng: 19.9311482,
  })

  const [leafletMap, setLeafletMap] = useState(null)

  const setMapPositionWithGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGeolocalizationEnable(true)
        setUserCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => console.error("Error Code = " + error.code + " - " + error.message)
    );
  }

  const trySetMapPositionWithGeolocation = () => {
    if (!("geolocation" in navigator)) {
      return false;
    }
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((info) => {
        if (info.state == "granted") {
          setMapPositionWithGeolocation();
        }
      });
    } else {
      // Safari doesn't support navigator.permissions
      setMapPositionWithGeolocation();
    }
  }

  const getMarkers = (lat, lng, radius) => {
    fetch(
      getApiUrl("getMarkers", null, {
        latitude: lat,
        longitude: lng,
        radius: radius,
      })
    )
      .then((response) => response.json())
      .then((data) => {
        let currentDate = Date();
        if (!stationDataLastFetchDate || currentDate > stationDataLastFetchDate) {
          setStationDataLastFetchDate(currentDate)
          console.log(data.data)
          setStationData(data.data)
        }
      })
      .catch((e) => console.error(e));
  }

  const updateMarkers = () => {
    if (!leafletMap) return;

    let bounds = leafletMap.leafletElement.getBounds();
    let center = leafletMap.leafletElement.getCenter();
    let radius = leafletMap.leafletElement.distance(bounds._northEast, center);

    // this.getMarkers(center.lat, center.lng, radius); // todo markers logic
    getMarkers(center.lat, center.lng, 1000000);
  }

  const getStationData = (stationId) => {
    let key = `station${stationId}Key`;
    fetch(
      getApiUrl("getPopupData", [stationId], {
        strategy: "latest",
      })
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        setStationFullData({...stationFullData, [key]: data.data})
      })
      .catch((e) => console.error(e));
  }

  const renderMarkers = () => {
    if (!stationData) return;
    
    return stationData.map((item, index) => {
      let position = {
        lat: item.location.latitude,
        lng: item.location.longitude,
      };
      let stationId = item.id;
      let stationDataKey = `station${stationId}Key`;
      let color = AirQualityColors[indexToLevel(item.aqi)];
      
      return (
        <CircleMarker
          key={index}
          center={position}
          fillColor={color}
          color={color}
          onClick={() => {
            getStationData(stationId)
          }}
          fillOpacity={0.3}
          opacity={1}
          radius={currentMarkerSize}
        >
          <AnimatedMapPopup
            stationData={stationFullData[stationDataKey]}
            color={color}
          />
        </CircleMarker>
      );
    });
  }

  const currentPositionMarker = () => {
    if (!isGeolocalizationEnable) return;
    return (
      <CircleMarker
        center={userCurrentPosition}
        fillColor="#5078de"
        color="#5078de"
        onClick={() => {}}
      />
    );
  }

  useEffect(() => {
    trySetMapPositionWithGeolocation();
    updateMarkers();
  }, [leafletMap])

  return (
    <div className={styles.container}>
      <Map
        zoomControl={false}
        center={[constans.lat, constans.lng]}
        zoom={constans.initialZoom}
        ref={(m) => setLeafletMap(m)}
        onzoomend={(x) => setCurrentMarkerSize(calculateMarkerSize(leafletMap.leafletElement.getZoom()))}
        // onMoveEnd={
        //   (x) => this.updateMarkers()
        // }
        // todo markers logic
        className={styles.map}
      >
        <TileLayer
          attribution='<a href="//basemaps.cartocdn.com">Basemap</a> | &copy; <a href="//osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {renderMarkers()}
        {currentPositionMarker()}
      </Map>
      <div className={styles.logo}>Airella</div>
    </div>
  );
}

function mapStateToProps(state) {
  return state.search;
}

export default connect(mapStateToProps)(MapComponent);
