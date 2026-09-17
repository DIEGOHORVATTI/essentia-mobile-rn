import { useMemo } from 'react'
import { WebView } from 'react-native-webview'

import { useIsDark } from '@/theme'

import type { GeoPatient } from '../hooks/use-patients-map'

type PatientMapProps = {
  patients: GeoPatient[]
  onSelect: (id: string) => void
}

function buildHtml(patients: GeoPatient[], dark: boolean): string {
  const osmClass = dark ? 'dark-tiles' : ''

  const points = JSON.stringify(
    patients.map((patient) => ({
      id: patient.id,
      name: patient.fullName,
      city: patient.location ?? '',
      avatar: patient.avatarUrl,
      lat: patient.lat,
      lng: patient.lng,
    })),
  )

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; background: ${dark ? '#0c1112' : '#f5f1ed'}; }
    .leaflet-popup-content { text-align: center; font-family: -apple-system, Roboto, sans-serif; }
    .btn { margin-top: 6px; padding: 6px 12px; border: none; border-radius: 8px; background: #b29b62; color: #14120c; font-weight: 700; }
    .avatar-marker img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #b29b62; box-shadow: 0 2px 6px rgba(0,0,0,.5); background: #141b1d; }
    .marker-cluster-small, .marker-cluster-medium, .marker-cluster-large { background: rgba(178,155,98,.35); }
    .marker-cluster-small div, .marker-cluster-medium div, .marker-cluster-large div { background: #b29b62; color: #14120c; font-weight: 700; }
    .dark-tiles { filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9); }
    .leaflet-control-layers { border-radius: 10px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
  <script>
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function sel(id) { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(id); }

    var data = ${points};
    var map = L.map('map', { zoomControl: false }).setView([42.3, -71.8], 8);

    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19, className: '${osmClass}' });
    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri', maxZoom: 19 });
    var streets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri', maxZoom: 19 });

    osm.addTo(map);
    L.control.layers({ 'Padrao': osm, 'Satelite': satellite, 'Ruas': streets }, null, { position: 'topright', collapsed: true }).addTo(map);

    var cluster = L.markerClusterGroup({ maxClusterRadius: 55, showCoverageOnHover: false });
    var bounds = [];
    data.forEach(function (p) {
      var icon = L.divIcon({
        className: 'avatar-marker',
        html: '<img src="' + p.avatar + '" />',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22],
      });
      var marker = L.marker([p.lat, p.lng], { icon: icon });
      marker.bindPopup('<b>' + esc(p.name) + '</b><br><span>' + esc(p.city) + '</span><br><button class="btn" onclick="sel(\\'' + p.id + '\\')">Ver paciente</button>');
      cluster.addLayer(marker);
      bounds.push([p.lat, p.lng]);
    });
    map.addLayer(cluster);
    if (bounds.length > 0) map.fitBounds(bounds, { padding: [50, 50] });
  </script>
</body>
</html>`
}

export function PatientMap({ patients, onSelect }: PatientMapProps) {
  const dark = useIsDark()
  const html = useMemo(() => buildHtml(patients, dark), [patients, dark])

  return (
    <WebView
      source={{ html }}
      onMessage={(event) => onSelect(event.nativeEvent.data)}
      originWhitelist={['*']}
      style={{ flex: 1, backgroundColor: 'transparent' }}
    />
  )
}
