'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface LatLng {
  lat: number;
  lng: number;
}

interface Zone {
  id: string;
  name: string;
  coordinates: LatLng[];
  color: string;
}

const BIRMINGHAM_UK = { lat: 52.5086, lng: -1.8755 };
const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<LatLng[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [editingVertexIndex, setEditingVertexIndex] = useState<number | null>(null);
  const drawnItemsRef = useRef<any>(null);
  const polygonMarkersRef = useRef<any[]>([]);
  const editMarkersRef = useRef<any[]>([]);
  const LRef = useRef<any>(null);

  // Initialize Leaflet and map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Dynamically import Leaflet on client side only
    const initMap = async () => {
      const L = await import('leaflet');
      LRef.current = L.default || L;

      mapInstance.current = LRef.current.map(mapContainer.current).setView(
        [BIRMINGHAM_UK.lat, BIRMINGHAM_UK.lng],
        12
      );

      LRef.current.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      drawnItemsRef.current = LRef.current.featureGroup().addTo(mapInstance.current);
    };

    initMap();
  }, []);

  // Handle map clicks for drawing
  useEffect(() => {
    if (!mapInstance.current || !LRef.current) return;

    const map = mapInstance.current;
    const L = LRef.current;

    const handleMapClick = (e: any) => {
      if (!isDrawing || editingVertexIndex !== null) return;

      const clickedLatLng = e.latlng;
      const newPolygon = [...currentPolygon, { lat: clickedLatLng.lat, lng: clickedLatLng.lng }];
      setCurrentPolygon(newPolygon);

      const marker = L.circleMarker([clickedLatLng.lat, clickedLatLng.lng], {
        radius: 6,
        fillColor: '#ff7300',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(drawnItemsRef.current);
      polygonMarkersRef.current.push(marker);

      if (newPolygon.length > 1) {
        const prevPoint = newPolygon[newPolygon.length - 2];
        L.polyline(
          [
            [prevPoint.lat, prevPoint.lng],
            [clickedLatLng.lat, clickedLatLng.lng],
          ],
          { color: '#ff7300', weight: 2 }
        ).addTo(drawnItemsRef.current);
      }

      // Show closing line preview when user has 3+ points
      if (newPolygon.length >= 3) {
        L.polyline(
          [
            [clickedLatLng.lat, clickedLatLng.lng],
            [newPolygon[0].lat, newPolygon[0].lng],
          ],
          { color: '#ff7300', weight: 2, dashArray: '5, 5' }
        ).addTo(drawnItemsRef.current);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawing, editingVertexIndex, currentPolygon]);

  // Load zones on mount
  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await fetch('/api/zones');
      const data = await response.json();
      setZones(data);
      if (drawnItemsRef.current && LRef.current) {
        renderZones(data, LRef.current, selectedZoneId);
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const renderZones = (zonesToRender: Zone[], L: any, highlightedZoneId: string | null = null) => {
    if (!drawnItemsRef.current) return;

    zonesToRender.forEach((zone) => {
      const coordinates = zone.coordinates.map((coord) => [coord.lat, coord.lng] as [number, number]);
      const isSelected = highlightedZoneId === zone.id;

      if (coordinates.length > 2) {
        // Always render as closed filled polygon
        L.polygon(coordinates, {
          color: zone.color,
          weight: 2,
          opacity: isSelected ? 1 : 0.7,
          fillColor: zone.color,
          fillOpacity: isSelected ? 0.70 : 0.2,
        }).addTo(drawnItemsRef.current);

        if (isSelected) {
          // Add blue vertex markers for editing when selected
          zone.coordinates.forEach((coord, idx) => {
            const marker = L.circleMarker([coord.lat, coord.lng], {
              radius: 8,
              fillColor: '#0066ff',
              color: '#ffffff',
              weight: 3,
              opacity: 1,
              fillOpacity: 1,
            }).addTo(drawnItemsRef.current);

            marker.on('mousedown', () => {
              setEditingVertexIndex(idx);
            });

            editMarkersRef.current.push(marker);
          });

          // Show zone name popup when selected
          const zoneNameText = L.popup()
            .setLatLng([zone.coordinates[0].lat, zone.coordinates[0].lng])
            .setContent(zone.name)
            .openOn(mapInstance.current);
        }
      }
    });
  };

  const handleStartDrawing = () => {
    setCurrentPolygon([]);
    setIsDrawing(true);
    polygonMarkersRef.current.forEach((m) => drawnItemsRef.current?.removeLayer(m));
    polygonMarkersRef.current = [];
  };

  const handleCompletePolygon = async () => {
    if (currentPolygon.length < 3) {
      alert('Please draw at least 3 points to create a polygon');
      return;
    }

    const newZone: Zone = {
      id: Date.now().toString(),
      name: `Zone ${zones.length + 1}`,
      coordinates: currentPolygon,
      color: COLORS[zones.length % COLORS.length],
    };

    try {
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZone),
      });

      if (response.ok) {
        const updatedZones = [...zones, newZone];
        setZones(updatedZones);
        if (drawnItemsRef.current && LRef.current) {
          renderZones(updatedZones, LRef.current, selectedZoneId);
        }
        setCurrentPolygon([]);
        setIsDrawing(false);
        polygonMarkersRef.current.forEach((m) => drawnItemsRef.current?.removeLayer(m));
        polygonMarkersRef.current = [];
      }
    } catch (error) {
      console.error('Error saving zone:', error);
    }
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setCurrentPolygon([]);
    polygonMarkersRef.current.forEach((m) => drawnItemsRef.current?.removeLayer(m));
    polygonMarkersRef.current = [];
  };

  const handleSelectZone = (zoneId: string) => {
    // Only select if not already selected; second click does nothing
    if (selectedZoneId === zoneId) {
      return;
    }

    setSelectedZoneId(zoneId);
    editMarkersRef.current.forEach((m) => drawnItemsRef.current?.removeLayer(m));
    editMarkersRef.current = [];
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
    }
    if (LRef.current) {
      // Pass zoneId directly to renderZones for immediate highlighting
      renderZones(zones, LRef.current, zoneId);
    }

    // Center map on selected zone
    const zone = zones.find((z) => z.id === zoneId);
    if (zone && zone.coordinates.length > 0 && mapInstance.current) {
      const bounds = LRef.current.latLngBounds(
        zone.coordinates.map((coord) => [coord.lat, coord.lng])
      );
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    try {
      await fetch('/api/zones', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: zoneId }),
      });

      const updatedZones = zones.filter((z) => z.id !== zoneId);
      setZones(updatedZones);
      let newSelectedZoneId = selectedZoneId;
      if (selectedZoneId === zoneId) {
        setSelectedZoneId(null);
        newSelectedZoneId = null;
      }
      if (drawnItemsRef.current) {
        drawnItemsRef.current.clearLayers();
      }
      if (LRef.current) {
        renderZones(updatedZones, LRef.current, newSelectedZoneId);
      }
    } catch (error) {
      console.error('Error deleting zone:', error);
    }
  };

  // Handle vertex dragging
  useEffect(() => {
    if (editingVertexIndex === null || !selectedZoneId || !mapInstance.current) return;

    const selectedZone = zones.find((z) => z.id === selectedZoneId);
    if (!selectedZone) return;

    const handleMouseMove = (e: any) => {
      const newCoordinates = [...selectedZone.coordinates];
      newCoordinates[editingVertexIndex] = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      if (editMarkersRef.current[editingVertexIndex]) {
        editMarkersRef.current[editingVertexIndex].setLatLng([
          e.latlng.lat,
          e.latlng.lng,
        ]);
      }
    };

    const handleMouseUp = async () => {
      const newCoordinates = [...selectedZone.coordinates];
      const updatedZone = { ...selectedZone, coordinates: newCoordinates };

      try {
        await fetch('/api/zones', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedZone),
        });

        const updatedZones = zones.map((z) => (z.id === selectedZoneId ? updatedZone : z));
        setZones(updatedZones);
      } catch (error) {
        console.error('Error updating zone:', error);
      }

      setEditingVertexIndex(null);
      mapInstance.current?.off('mousemove', handleMouseMove);
      mapInstance.current?.off('mouseup', handleMouseUp);
    };

    mapInstance.current.on('mousemove', handleMouseMove);
    mapInstance.current.on('mouseup', handleMouseUp);

    return () => {
      mapInstance.current?.off('mousemove', handleMouseMove);
      mapInstance.current?.off('mouseup', handleMouseUp);
    };
  }, [editingVertexIndex, selectedZoneId, zones]);

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />

        {isDrawing && (
          <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4" style={{ zIndex: 9999 }}>
            <p className="text-sm font-medium mb-3 text-gray-700">
              Points: {currentPolygon.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCompletePolygon}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium transition"
              >
                Complete
              </button>
              <button
                onClick={handleCancelDrawing}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!isDrawing && (
          <button
            onClick={handleStartDrawing}
            className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition"
            style={{ zIndex: 9999 }}
          >
            Draw Zone
          </button>
        )}
      </div>

      <div className="w-80 bg-white shadow-lg overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <h2 className="text-lg font-bold">Zones</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {zones.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No zones created yet. Click "Draw Zone" to start.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Zone Name</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Points</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr
                    key={zone.id}
                    className={`border-b cursor-pointer transition ${
                      selectedZoneId === zone.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectZone(zone.id)}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: zone.color }}
                        />
                        <span className="font-medium">{zone.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{zone.coordinates.length}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteZone(zone.id);
                        }}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedZoneId && (
          <div className="border-t bg-gray-50 p-4 max-h-48 overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-700 mb-2">COORDINATES</h3>
            <div className="space-y-1 text-xs">
              {zones
                .find((z) => z.id === selectedZoneId)
                ?.coordinates.map((coord, idx) => (
                  <div key={idx} className="text-gray-600 font-mono">
                    <strong>Point {idx + 1}:</strong> {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
