export const setMapPositionRequest = (position) => ({
  type: "MAP_POSITION_REQUEST",
  position,
});

export const sensorDetailAction = (sensorData) => ({
  type: "SENSOR_DETAIL",
  sensorData,
});

export const setLoginDialogVisibility = (visibility) => ({
  type: "LOGIN_DIALOG_VISIBLE",
  visibility,
});

export const setAuthorization = (logged) => ({
  type: "AUTHORIZATION",
  logged,
});

export const setSensorChart = (visibility) => ({
  type: "SENSOR_CHART",
  visibility,
});
