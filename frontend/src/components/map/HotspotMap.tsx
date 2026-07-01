import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { Layers } from 'lucide-react';

// Fix Leaflet's default icon path issues with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export interface HotspotData {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  violations: number;
  severity: 'low' | 'medium' | 'high' | 'critical' | string;
  type: string;
  district?: string;
}

interface HotspotMapProps {
  hotspots: HotspotData[];
  center: [number, number];
  zoom?: number;
}

// React-Leaflet component for Heatmap
const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    // We typecast as any because leaflet.heat augments L but Typescript might miss it
    const heat = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 100, // adjust based on expected max intensity
      gradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

const getMarkerColor = (severity: string) => {
  switch(severity.toLowerCase()) {
    case 'critical': return '#EF4444'; // red
    case 'high': return '#F59E0B'; // amber
    case 'medium': return '#3B82F6'; // blue
    default: return '#10B981'; // green
  }
};

const HotspotMap: React.FC<HotspotMapProps> = ({ hotspots, center, zoom = 12 }) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showSatellite, setShowSatellite] = useState(false);

  // points array for leaflet.heat: [lat, lng, intensity]
  const heatPoints = hotspots.map(h => [h.lat, h.lng, h.violations] as [number, number, number]);

  return (
    <div className="relative w-full h-full min-h-[400px] z-0 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        {showSatellite ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        
        {showHeatmap && heatPoints.length > 0 && (
          <HeatmapLayer points={heatPoints} />
        )}

        {showMarkers && hotspots.map(hotspot => (
          <CircleMarker
            key={hotspot.id}
            center={[hotspot.lat, hotspot.lng]}
            radius={hotspot.severity === 'critical' ? 24 : hotspot.severity === 'high' ? 16 : 10}
            pathOptions={{
              fillColor: getMarkerColor(hotspot.severity),
              fillOpacity: 0.6,
              color: getMarkerColor(hotspot.severity),
              weight: 2
            }}
          >
            <Popup className="rounded-xl overflow-hidden shadow-lg border-0">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-slate-900 mb-1">{hotspot.name}</h3>
                {hotspot.district && <p className="text-xs text-slate-500 mb-2">{hotspot.district} District</p>}
                
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2">
                  <span className="text-xs font-semibold text-slate-700">Violations:</span>
                  <span className="text-sm font-bold text-red-600">{hotspot.violations}</span>
                </div>
                
                <p className="text-xs text-slate-500 mt-2 capitalize">
                  Most common: <span className="font-semibold text-slate-700">{hotspot.type.replace('_', ' ')}</span>
                </p>
                <button className="w-full mt-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors">
                  View Violations →
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Layer Controls Panel */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-40">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center">
          <Layers size={14} className="mr-1.5"/> Layers
        </h4>
        <div className="space-y-2.5">
          <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showHeatmap} 
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="mr-2.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" 
            />
            Heatmap
          </label>
          <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showMarkers} 
              onChange={(e) => setShowMarkers(e.target.checked)}
              className="mr-2.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" 
            />
            Markers
          </label>
          <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
          <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showSatellite} 
              onChange={(e) => setShowSatellite(e.target.checked)}
              className="mr-2.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" 
            />
            Satellite
          </label>
        </div>
      </div>
    </div>
  );
};

export default HotspotMap;
