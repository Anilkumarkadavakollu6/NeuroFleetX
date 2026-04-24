import L from 'leaflet';

// ─── Leaflet Marker Icon Fix ──────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ─── Custom Marker Icons ─────────────────────
export const sourceIcon = new L.DivIcon({
  className: '',
  html: `<div style="position:relative;width:32px;height:32px;">
    <div style="width:32px;height:32px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;border:3px solid white;box-shadow:0 3px 12px rgba(16,185,129,0.5);display:flex;align-items:center;justify-content:center;">
      <div style="width:10px;height:10px;background:white;border-radius:50%;"></div>
    </div>
    <div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:12px;height:4px;background:rgba(0,0,0,0.2);border-radius:50%;filter:blur(1px);"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
});

export const destIcon = new L.DivIcon({
  className: '',
  html: `<div style="position:relative;width:32px;height:32px;">
    <div style="width:32px;height:32px;background:linear-gradient(135deg,#ef4444,#dc2626);border-radius:50%;border:3px solid white;box-shadow:0 3px 12px rgba(239,68,68,0.5);display:flex;align-items:center;justify-content:center;">
      <div style="width:10px;height:10px;background:white;border-radius:50%;"></div>
    </div>
    <div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:12px;height:4px;background:rgba(0,0,0,0.2);border-radius:50%;filter:blur(1px);"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
});