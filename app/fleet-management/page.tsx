'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface LatLng {
  lat: number;
  lng: number;
}

interface Tariff {
  duration: string;
  price: number;
}

interface Zone {
  id: string;
  name: string;
  coordinates: LatLng[];
  color: string;
  tariffs?: Tariff[];
}

const COLOR_PALETTE = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];

const DEFAULT_TARIFFS: Tariff[] = [
  { duration: 'Up to 1 hour', price: 1.00 },
  { duration: 'Up to 2 hours', price: 2.00 },
  { duration: 'Up to 6 hours', price: 5.00 },
  { duration: 'Up to 12 hours', price: 9.00 },
  { duration: 'Up to 24 hours', price: 15.00 }
];

export default function ParkingZoneManagement() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<LatLng[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [editingVertexIndex, setEditingVertexIndex] = useState<number | null>(null);
  const [showTariffModal, setShowTariffModal] = useState(false);
  const [editingTariffs, setEditingTariffs] = useState<Tariff[]>([]);

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const drawnItemsRef = useRef<any>(null);
  const polygonMarkersRef = useRef<any[]>([]);
  const editMarkersRef = useRef<any[]>([]);
  const LRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        LRef.current = L.default;
        initMap(L.default);
      });
    }
  }, []);

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (mapInstance.current && LRef.current) {
      renderZones();
    }
  }, [zones, selectedZoneId]);

  const initMap = (L: any) => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current).setView([52.5086, -1.8755], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    drawnItemsRef.current = L.featureGroup().addTo(map);
    mapInstance.current = map;

    map.on('click', handleMapClick);
  };

  const fetchZones = async () => {
    try {
      const response = await fetch('/api/zones');
      const data = await response.json();
      setZones(data);
    } catch (error) {
      console.error('Failed to fetch zones:', error);
    }
  };

  const handleMapClick = (e: any) => {
    if (!isDrawing || !LRef.current) return;

    const newPoint: LatLng = {
      lat: e.latlng.lat,
      lng: e.latlng.lng
    };

    const L = LRef.current;
    const marker = L.circleMarker([newPoint.lat, newPoint.lng], {
      radius: 6,
      color: '#ff6600',
      fillColor: '#ff6600',
      fillOpacity: 1
    }).addTo(mapInstance.current);

    polygonMarkersRef.current.push(marker);
    setCurrentPolygon([...currentPolygon, newPoint]);
  };

  const renderZones = () => {
    if (!mapInstance.current || !LRef.current) return;

    const L = LRef.current;
    drawnItemsRef.current.clearLayers();
    editMarkersRef.current.forEach(marker => marker.remove());
    editMarkersRef.current = [];

    zones.forEach(zone => {
      const isSelected = zone.id === selectedZoneId;
      const latlngs = zone.coordinates.map(c => [c.lat, c.lng]);

      const polygon = L.polygon(latlngs, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: isSelected ? 0.35 : 0.2,
        weight: 2,
        opacity: isSelected ? 1 : 0.6
      }).addTo(drawnItemsRef.current);

      polygon.bindPopup(zone.name);

      if (isSelected) {
        zone.coordinates.forEach((coord, index) => {
          const marker = L.circleMarker([coord.lat, coord.lng], {
            radius: 8,
            color: '#2563eb',
            fillColor: '#2563eb',
            fillOpacity: 1,
            draggable: true
          }).addTo(mapInstance.current);

          marker.on('dragstart', () => {
            setEditingVertexIndex(index);
          });

          marker.on('drag', (e: any) => {
            const newLat = e.latlng.lat;
            const newLng = e.latlng.lng;
            
            const updatedCoords = [...zone.coordinates];
            updatedCoords[index] = { lat: newLat, lng: newLng };
            
            const updatedZone = { ...zone, coordinates: updatedCoords };
            setZones(zones.map(z => z.id === zone.id ? updatedZone : z));
          });

          marker.on('dragend', async () => {
            const updatedZone = zones.find(z => z.id === zone.id);
            if (updatedZone) {
              await updateZone(updatedZone);
            }
            setEditingVertexIndex(null);
          });

          editMarkersRef.current.push(marker);
        });

        mapInstance.current.fitBounds(polygon.getBounds(), { padding: [50, 50] });
      }
    });

    if (currentPolygon.length > 0) {
      const latlngs = currentPolygon.map(c => [c.lat, c.lng]);
      
      if (currentPolygon.length >= 2) {
        L.polyline(latlngs, { color: '#ff6600', weight: 2 }).addTo(drawnItemsRef.current);
      }
      
      if (currentPolygon.length >= 3) {
        const previewLine = [...latlngs, latlngs[0]];
        L.polyline(previewLine, {
          color: '#ff6600',
          weight: 2,
          dashArray: '5, 5'
        }).addTo(drawnItemsRef.current);
      }
    }
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setCurrentPolygon([]);
    polygonMarkersRef.current = [];
  };

  const handleCompletePolygon = async () => {
    if (currentPolygon.length < 3) {
      alert('Please place at least 3 points to create a zone');
      return;
    }

    const nextColorIndex = zones.length % COLOR_PALETTE.length;
    const newZone = {
      name: `Zone ${zones.length + 1}`,
      coordinates: currentPolygon,
      color: COLOR_PALETTE[nextColorIndex]
    };

    try {
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZone)
      });

      const createdZone = await response.json();
      setZones([...zones, createdZone]);
      
      setIsDrawing(false);
      setCurrentPolygon([]);
      polygonMarkersRef.current.forEach(marker => marker.remove());
      polygonMarkersRef.current = [];
    } catch (error) {
      console.error('Failed to create zone:', error);
    }
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setCurrentPolygon([]);
    polygonMarkersRef.current.forEach(marker => marker.remove());
    polygonMarkersRef.current = [];
    renderZones();
  };

  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
  };

  const handleDeleteZone = async (zoneId: string) => {
    try {
      await fetch('/api/zones', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: zoneId })
      });

      setZones(zones.filter(z => z.id !== zoneId));
      if (selectedZoneId === zoneId) {
        setSelectedZoneId(null);
      }
    } catch (error) {
      console.error('Failed to delete zone:', error);
    }
  };

  const updateZone = async (zone: Zone) => {
    try {
      await fetch('/api/zones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zone)
      });
    } catch (error) {
      console.error('Failed to update zone:', error);
    }
  };

  const handleOpenTariffModal = (zone: Zone) => {
    setEditingTariffs(zone.tariffs || DEFAULT_TARIFFS);
    setShowTariffModal(true);
  };

  const handleCloseTariffModal = () => {
    setShowTariffModal(false);
  };

  const handleUpdateTariffPrice = (index: number, price: number) => {
    const updated = [...editingTariffs];
    updated[index] = { ...updated[index], price };
    setEditingTariffs(updated);
  };

  const handleSaveTariffs = async () => {
    if (!selectedZoneId) return;

    const zone = zones.find(z => z.id === selectedZoneId);
    if (!zone) return;

    const updatedZone = { ...zone, tariffs: editingTariffs };
    
    try {
      await fetch('/api/zones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedZone)
      });

      setZones(zones.map(z => z.id === selectedZoneId ? updatedZone : z));
      setShowTariffModal(false);
    } catch (error) {
      console.error('Failed to save tariffs:', error);
    }
  };

  const selectedZone = zones.find(z => z.id === selectedZoneId);

  return (
    <div className="flex h-screen">
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
        
        {!isDrawing ? (
          <button
            onClick={handleStartDrawing}
            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium z-[9999]"
          >
            Draw Zone
          </button>
        ) : (
          <div className="absolute top-4 right-4 flex gap-2 z-[9999]">
            <div className="bg-white px-4 py-2 rounded shadow-lg font-medium">
              Points: {currentPolygon.length}
            </div>
            <button
              onClick={handleCompletePolygon}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
            >
              Complete
            </button>
            <button
              onClick={handleCancelDrawing}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="w-80 bg-white shadow-lg overflow-y-auto flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold p-4">
          Parking Zones
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Zone Name</th>
                <th className="text-left p-3 text-sm font-medium">Points</th>
                <th className="text-left p-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map(zone => (
                <tr
                  key={zone.id}
                  onClick={() => handleSelectZone(zone.id)}
                  className={`cursor-pointer ${
                    selectedZoneId === zone.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: zone.color }}
                      />
                      {zone.name}
                    </div>
                  </td>
                  <td className="p-3 text-sm">{zone.coordinates.length}</td>
                  <td className="p-3 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteZone(zone.id);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedZone && (
          <>
            <div className="bg-gray-50 border-t p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Tariffs</h3>
                <button
                  onClick={() => handleOpenTariffModal(selectedZone)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-1 text-sm">
                {(selectedZone.tariffs || DEFAULT_TARIFFS).map((tariff, index) => (
                  <div key={index}>
                    {tariff.duration}: £{tariff.price.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border-t p-4">
              <h3 className="font-semibold mb-2">Coordinates</h3>
              <div className="max-h-48 overflow-y-auto space-y-1 text-xs font-mono">
                {selectedZone.coordinates.map((coord, index) => (
                  <div key={index}>
                    Point {index + 1}: {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {showTariffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">Edit Tariffs</h2>
            <div className="space-y-3 mb-6">
              {editingTariffs.map((tariff, index) => (
                <div key={index} className="flex items-center gap-3">
                  <label className="flex-1 text-sm">{tariff.duration}:</label>
                  <div className="flex items-center">
                    <span className="mr-1">£</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={tariff.price}
                      onChange={(e) => handleUpdateTariffPrice(index, parseFloat(e.target.value) || 0)}
                      className="border rounded px-2 py-1 w-24 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCloseTariffModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTariffs}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
