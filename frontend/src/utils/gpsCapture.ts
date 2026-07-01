// ── GPS Capture Utility ────────────────────────────────────────

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export const captureGPS = (): Promise<GPSCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude:  position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy:  position.coords.accuracy,
        });
      },
      (error) => {
        let message = 'Location unavailable.';
        if (error.code === error.PERMISSION_DENIED) message = 'Location permission denied.';
        if (error.code === error.POSITION_UNAVAILABLE) message = 'Position unavailable.';
        if (error.code === error.TIMEOUT) message = 'Location request timed out.';
        reject(new Error(message));
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 30000 }
    );
  });
};

/** Mock GPS for demo mode — returns Lucknow center */
export const mockGPS = (): GPSCoordinates => ({
  latitude:  26.8467,
  longitude: 80.9462,
  accuracy:  15,
});

export const formatCoords = (lat: number, lon: number): string =>
  `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
