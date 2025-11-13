'use client';

import { useEffect, useState, useRef } from 'react';
import { Car as CarIcon, MapPin } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  color: string;
  tariffs?: Tariff[];
}

interface Tariff {
  duration: string;
  price: number;
}

interface Car {
  id: string;
  licensePlate: string;
  zoneId: string;
  entryTime: string;
  exitTime: string | null;
  ticketBoughtTime: string | null;
  ticketDuration: number | null;
  ticketPrice: number | null;
  hasPCN?: boolean;
}

const DEFAULT_TARIFFS: Tariff[] = [
  { duration: 'Up to 1 hour', price: 1.00 },
  { duration: 'Up to 2 hours', price: 2.00 },
  { duration: 'Up to 6 hours', price: 5.00 },
  { duration: 'Up to 12 hours', price: 9.00 },
  { duration: 'Up to 24 hours', price: 15.00 }
];

const LICENSE_PLATES = ['AB12CDE', 'XY34FGH', 'MN56IJK', 'PQ78RST', 'UV90WXY', 'CD21EFG', 'HI43JKL', 'NO65PQR'];

export default function ParkopediaCarTracking() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [editingTariffs, setEditingTariffs] = useState<Tariff[]>([]);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchZones();
    fetchCars();
    const interval = setInterval(fetchCars, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isSimulating) {
      simulationInterval.current = setInterval(() => {
        runSimulation();
      }, 1000);
    } else {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    }
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, [isSimulating, zones]);

  const fetchZones = async () => {
    try {
      const response = await fetch('/api/zones');
      const data = await response.json();
      setZones(data);
    } catch (error) {
      console.error('Failed to fetch zones:', error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    }
  };

  const addRandomCar = async () => {
    if (zones.length === 0) return;

    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    const randomPlate = LICENSE_PLATES[Math.floor(Math.random() * LICENSE_PLATES.length)] + Math.floor(Math.random() * 1000);

    try {
      await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licensePlate: randomPlate,
          zoneId: randomZone.id,
          entryTime: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to add car:', error);
    }
  };

  const runSimulation = async () => {
    if (Math.random() < 0.9) {
      await addRandomCar();
    }

    // Fetch fresh car data to avoid stale closure
    const response = await fetch('/api/cars');
    const currentCars = await response.json();

    const activeCars = currentCars.filter((c: Car) => !c.exitTime);
    for (const car of activeCars) {
      if (Math.random() < 0.65 && !car.ticketBoughtTime) {
        await buyTicket(car.id);
      }

      if (Math.random() < 0.85) {
        await exitCar(car.id);
      }
    }
  };

  const exitCar = async (carId: string) => {
    const car = cars.find(c => c.id === carId);
    if (!car || car.exitTime) return;

    const hasPCN = !car.ticketBoughtTime || isTicketExpired(car);

    try {
      await fetch('/api/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: carId,
          exitTime: new Date().toISOString(),
          hasPCN
        })
      });
    } catch (error) {
      console.error('Failed to exit car:', error);
    }
  };

  const buyTicket = async (carId: string) => {
    const durations = [60, 120, 360, 720, 1440];
    const randomDuration = durations[Math.floor(Math.random() * durations.length)];
    const tariff = DEFAULT_TARIFFS.find(t => t.duration.includes(randomDuration === 60 ? '1 hour' : randomDuration === 120 ? '2 hours' : randomDuration === 360 ? '6 hours' : randomDuration === 720 ? '12 hours' : '24 hours'));

    try {
      await fetch('/api/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: carId,
          ticketBoughtTime: new Date().toISOString(),
          ticketDuration: randomDuration,
          ticketPrice: tariff?.price || 1.00
        })
      });
    } catch (error) {
      console.error('Failed to buy ticket:', error);
    }
  };

  const deleteCar = async (carId: string) => {
    try {
      await fetch('/api/cars', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: carId })
      });
      fetchCars();
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  };

  const openTariffModal = (zone: Zone) => {
    setEditingZone(zone);
    setEditingTariffs(zone.tariffs || DEFAULT_TARIFFS);
  };

  const saveTariffs = async () => {
    if (!editingZone) return;

    try {
      await fetch('/api/zones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingZone,
          tariffs: editingTariffs
        })
      });
      setEditingZone(null);
      fetchZones();
    } catch (error) {
      console.error('Failed to save tariffs:', error);
    }
  };

  const getTicketStatus = (car: Car): { text: string; color: string } => {
    if (!car.ticketBoughtTime) {
      return { text: 'No Ticket', color: '#EF4444' };
    }

    const ticketTime = new Date(car.ticketBoughtTime).getTime();
    const now = Date.now();
    const elapsed = ((now - ticketTime) / (1000 * 60)) * 10;

    if (elapsed > (car.ticketDuration || 0)) {
      return { text: 'Expired', color: '#EF4444' };
    } else if (elapsed > (car.ticketDuration || 0) * 0.8) {
      return { text: 'Expiring Soon', color: '#F59E0B' };
    } else {
      return { text: 'Valid Ticket', color: '#10B981' };
    }
  };

  const isTicketExpired = (car: Car): boolean => {
    if (!car.ticketBoughtTime || !car.ticketDuration) return true;
    const ticketTime = new Date(car.ticketBoughtTime).getTime();
    const elapsed = (Date.now() - ticketTime) / (1000 * 60);
    return elapsed > car.ticketDuration;
  };

  const formatTime = (isoString: string): string => {
    return new Date(isoString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateDuration = (entry: string, exit: string): string => {
    const ms = new Date(exit).getTime() - new Date(entry).getTime();
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getZoneCars = (zoneId: string, inZone: boolean) => {
    return cars.filter(c => c.zoneId === zoneId && (inZone ? !c.exitTime : !!c.exitTime));
  };

  const leftCars = cars.filter(c => !!c.exitTime);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 text-white p-4" style={{ background: '#0A0944' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F76e39d6cb5b24501bed5149204e569f5%2Fb70e9ce726e84da6bb75c36c98e3fceb?format=webp&width=800"
            alt="Parkopedia"
            className="h-8 w-auto brightness-0 invert"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm">Simulation</span>
              <input
                type="checkbox"
                checked={isSimulating}
                onChange={(e) => setIsSimulating(e.target.checked)}
                className="w-12 h-6 appearance-none rounded-full relative cursor-pointer transition-colors"
                style={{
                  backgroundColor: isSimulating ? '#02FF7F' : '#6B7280'
                }}
              />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Demo Controls</h2>
          <button
            onClick={addRandomCar}
            className="text-white px-4 py-2 rounded font-medium hover:opacity-90"
            style={{ backgroundColor: '#0A0944' }}
          >
            Add Random Car Entry
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Click to simulate a vehicle entering a random parking zone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {zones.map(zone => {
            const inZoneCars = getZoneCars(zone.id, true);
            return (
              <div key={zone.id} className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: zone.color }} />
                    <h3 className="font-semibold">{zone.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{inZoneCars.length} cars</span>
                    <button
                      onClick={() => openTariffModal(zone)}
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: '#0A0944', color: 'white' }}
                    >
                      Edit Tariffs
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-medium text-sm mb-2">In Zone</h4>
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-sm mb-4">
                      <tbody>
                        {inZoneCars.map(car => {
                        const status = getTicketStatus(car);
                        return (
                          <tr key={car.id} className="border-b">
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                                <span className="font-mono text-xs">{car.licensePlate}</span>
                                {car.hasPCN && <span className="text-xs bg-red-600 text-white px-1 rounded">PCN</span>}
                              </div>
                            </td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => exitCar(car.id)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Exit
                              </button>
                            </td>
                          </tr>
                        );
                        })}
                        {inZoneCars.length === 0 && (
                          <tr><td colSpan={2} className="py-2 text-gray-400 text-center">No vehicles</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <h4 className="font-medium text-sm mb-2">Left</h4>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        {getZoneCars(zone.id, false).slice(0, 10).map(car => {
                        const status = getTicketStatus(car);
                        return (
                          <tr key={car.id} className="border-b">
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                                <span className="font-mono text-xs">{car.licensePlate}</span>
                                {car.hasPCN && <span className="text-xs bg-red-600 text-white px-1 rounded">PCN</span>}
                              </div>
                            </td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => deleteCar(car.id)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                        })}
                        {getZoneCars(zone.id, false).length === 0 && (
                          <tr><td colSpan={2} className="py-2 text-gray-400 text-center">No vehicles</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Historical Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-3">License Plate</th>
                  <th className="text-left p-3">Zone</th>
                  <th className="text-left p-3">Entry Time</th>
                  <th className="text-left p-3">Exit Time</th>
                  <th className="text-left p-3">Duration</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leftCars.map(car => {
                  const zone = zones.find(z => z.id === car.zoneId);
                  const status = getTicketStatus(car);
                  return (
                    <tr key={car.id} className="border-b">
                      <td className="p-3 font-mono">{car.licensePlate}</td>
                      <td className="p-3">
                        {zone && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: zone.color }} />
                            {zone.name}
                          </div>
                        )}
                      </td>
                      <td className="p-3">{formatTime(car.entryTime)}</td>
                      <td className="p-3">{car.exitTime ? formatTime(car.exitTime) : '-'}</td>
                      <td className="p-3">
                        {car.exitTime ? calculateDuration(car.entryTime, car.exitTime) : '-'}
                      </td>
                      <td className="p-3">
                        <span
                          className="px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: status.color }}
                        >
                          {car.hasPCN ? 'PCN' : status.text}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteCar(car.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {leftCars.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      No historical records yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {editingZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">Edit Tariffs - {editingZone.name}</h2>
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
                      onChange={(e) => {
                        const updated = [...editingTariffs];
                        updated[index] = { ...updated[index], price: parseFloat(e.target.value) || 0 };
                        setEditingTariffs(updated);
                      }}
                      className="border rounded px-2 py-1 w-24 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingZone(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveTariffs}
                className="flex-1 text-white px-4 py-2 rounded font-medium hover:opacity-90"
                style={{ backgroundColor: '#0A0944' }}
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
