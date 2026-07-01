import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '../../components/ui/Card';
import { ApiService } from '../../services/api';
import type { Hotspot } from '../../types';
import { pageVariants } from '../../utils/animations';

// Quick fix for Leaflet default marker icons not loading in React
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

export const MapHeatmaps: React.FC = () => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const center: [number, number] = [26.8467, 80.9462]; // Lucknow

  useEffect(() => {
    ApiService.getHotspots().then(setHotspots);
  }, []);

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="h-full flex flex-col space-y-4">
      <div className="flex-none">
        <h1 className="text-2xl font-bold tracking-tight">Violation Hotspots</h1>
        <p className="text-muted">Geographic clustering of traffic violations</p>
      </div>

      <Card className="flex-1 min-h-[500px] relative overflow-hidden border-2 border-border shadow-md rounded-xl">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {hotspots.map(h => (
            <CircleMarker
              key={h.id}
              center={[h.centerLatitude, h.centerLongitude]}
              radius={Math.min(h.violationCount / 10, 40) + 10}
              pathOptions={{ 
                color: h.severity === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)', 
                fillColor: h.severity === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)',
                fillOpacity: 0.4 
              }}
            >
              <Popup className="rounded-md shadow-sm">
                <div className="font-sans">
                  <h3 className="font-bold">{h.name}</h3>
                  <p className="text-sm mt-1">Severity: <span className="uppercase font-semibold text-danger">{h.severity}</span></p>
                  <p className="text-sm">Total Violations: {h.violationCount}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          <MapUpdater center={center} />
        </MapContainer>
      </Card>
    </motion.div>
  );
};
