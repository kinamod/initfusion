'use client';

import { useEffect, useState, useRef } from 'react';
import { Header } from '../components/Header';
import { ChevronDown } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  coordinates: any[];
  color: string;
  tariffs?: Array<{ duration: string; price: number }>;
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

const RANDOM_PLATES = [
  'AB21ABC', 'CD22CDE', 'EF23EFG', 'GH24GHI', 'IJ25IJK',
  'KL26KLM', 'MN27MNO', 'OP28OPQ', 'QR29QRS', 'ST30STU',
  'UV31UVW', 'WX32XYZ', 'YZ33YZA', 'AA34AAB', 'BB35BBC',
];

function getPaymentStatus(car: Car, tariffs?: Array<{ duration: string; price: number }>) {
  if (!car.ticketBoughtTime || car.ticketDuration === null) {
    return { status: 'unpaid', label: 'No Ticket' };
  }

  const boughtTime = new Date(car.ticketBoughtTime).getTime();
  const expiryTime = boughtTime + car.ticketDuration * 60 * 1000;
  const now = new Date().getTime();
  const timeUntilExpiry = expiryTime - now;

  if (timeUntilExpiry < 0) {
    return { status: 'expired', label: 'Expired' };
  }

  if (timeUntilExpiry < 30 * 60 * 1000) {
    return { status: 'expiring', label: 'Expiring Soon' };
  }

  return { status: 'paid', label: 'Valid Ticket' };
}

function getRowColor(status: string) {
  switch (status) {
    case 'paid':
      return 'bg-green-50 hover:bg-green-100';
    case 'expiring':
      return 'bg-yellow-50 hover:bg-yellow-100';
    case 'expired':
      return 'bg-red-50 hover:bg-red-100';
    case 'unpaid':
      return 'bg-red-50 hover:bg-red-100';
    default:
      return 'hover:bg-gray-50';
  }
}

function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(minutes: number | null) {
  if (!minutes) return '-';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  return `${hours}h`;
}

interface EditState {
  car: Car;
  hasPCN: boolean;
  ticketStatus: 'none' | 'paid';
}

export default function CarsTrackingPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set());
  const [simulationEnabled, setSimulationEnabled] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);
  const carsRef = useRef<Car[]>([]);
  const zonesRef = useRef<Zone[]>([]);

  useEffect(() => {
    fetchZones();
    fetchCars();

    const interval = setInterval(() => {
      fetchCars();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update refs when state changes
  useEffect(() => {
    carsRef.current = cars;
  }, [cars]);

  useEffect(() => {
    zonesRef.current = zones;
  }, [zones]);

  // Simulation logic - isolated from state changes
  useEffect(() => {
    if (!simulationEnabled || zonesRef.current.length === 0) return;

    const simulationInterval = setInterval(async () => {
      const currentZones = zonesRef.current;
      const currentCars = carsRef.current;

      // 90% chance to add a new car entry every cycle
      if (Math.random() < 0.9) {
        const randomZone = currentZones[Math.floor(Math.random() * currentZones.length)];
        const randomPlate = RANDOM_PLATES[Math.floor(Math.random() * RANDOM_PLATES.length)];

        // Set entry time to 5-15 minutes ago (simulated time)
        const minutesAgo = Math.floor(Math.random() * 10) + 5;
        const entryTime = new Date(Date.now() - minutesAgo * 60 * 1000);

        try {
          await fetch('/api/cars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              licensePlate: randomPlate,
              zoneId: randomZone.id,
              entryTime: entryTime.toISOString(),
            }),
          });
        } catch (error) {
          console.error('Error simulating car entry:', error);
        }
      }

      // For each car in a zone without exit, 70% chance to simulate exit per cycle
      const activeCars = currentCars.filter((c) => !c.exitTime);
      for (const car of activeCars) {
        if (Math.random() < 0.7) {
          const zone = currentZones.find((z) => z.id === car.zoneId);
          const shouldBuyTicket = Math.random() < 0.65; // 65% buy tickets, 35% don't
          const hasPCN = !shouldBuyTicket; // PCN if no ticket

          if (shouldBuyTicket && zone?.tariffs) {
            const randomTariff = zone.tariffs[Math.floor(Math.random() * zone.tariffs.length)];
            const minutes = parseInt(randomTariff.duration.match(/\d+/)?.[0] || '0') * 60;

            // Ticket bought a few minutes after entry
            const minutesAfterEntry = Math.floor(Math.random() * 3) + 1;
            const entryTimeMs = new Date(car.entryTime).getTime();
            const ticketTime = new Date(entryTimeMs + minutesAfterEntry * 60 * 1000);

            try {
              await fetch('/api/cars', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: car.id,
                  ticketBoughtTime: ticketTime.toISOString(),
                  ticketDuration: minutes,
                  ticketPrice: randomTariff.price,
                }),
              });
            } catch (error) {
              console.error('Error simulating ticket purchase:', error);
            }
          }

          try {
            await fetch('/api/cars', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: car.id,
                exitTime: new Date().toISOString(),
                hasPCN: hasPCN,
              }),
            });
          } catch (error) {
            console.error('Error simulating car exit:', error);
          }
        }
      }

      // Fetch cars in background, don't wait for it
      fetchCars().catch(console.error);
    }, 1000); // Simulate every 1 second (equals 10 minutes of simulated time)

    return () => clearInterval(simulationInterval);
  }, [simulationEnabled]);

  const fetchZones = async () => {
    try {
      const response = await fetch('/api/zones');
      const data = await response.json();
      setZones(data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const generateRandomCar = async () => {
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    const randomPlate = RANDOM_PLATES[Math.floor(Math.random() * RANDOM_PLATES.length)];

    if (!randomZone) return;

    try {
      await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licensePlate: randomPlate,
          zoneId: randomZone.id,
          entryTime: new Date().toISOString(),
        }),
      });
      await fetchCars();
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  const addTicket = async (carId: string, durationMinutes: number, price: number) => {
    const car = cars.find((c) => c.id === carId);
    if (!car) return;

    try {
      await fetch('/api/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: carId,
          ticketBoughtTime: new Date().toISOString(),
          ticketDuration: durationMinutes,
          ticketPrice: price,
        }),
      });
      await fetchCars();
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  const exitCar = async (carId: string) => {
    try {
      await fetch('/api/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: carId,
          exitTime: new Date().toISOString(),
        }),
      });
      await fetchCars();
    } catch (error) {
      console.error('Error exiting car:', error);
    }
  };

  const openEdit = (car: Car) => {
    setEditState({
      car,
      hasPCN: car.hasPCN ?? false,
      ticketStatus: car.ticketBoughtTime ? 'paid' : 'none',
    });
  };

  const saveEdit = async () => {
    if (!editState) return;
    const { car, hasPCN, ticketStatus } = editState;
    const updates: Record<string, unknown> = { id: car.id, hasPCN };
    if (ticketStatus === 'paid' && !car.ticketBoughtTime) {
      updates.ticketBoughtTime = new Date().toISOString();
      updates.ticketDuration = 60;
      updates.ticketPrice = 0;
    } else if (ticketStatus === 'none') {
      updates.ticketBoughtTime = null;
      updates.ticketDuration = null;
      updates.ticketPrice = null;
    }
    try {
      await fetch('/api/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      await fetchCars();
    } catch (error) {
      console.error('Error updating car:', error);
    }
    setEditState(null);
  };

  const deleteCar = async (carId: string) => {
    try {
      await fetch('/api/cars', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: carId }),
      });
      await fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const toggleZone = (zoneId: string) => {
    const newExpanded = new Set(expandedZones);
    if (newExpanded.has(zoneId)) {
      newExpanded.delete(zoneId);
    } else {
      newExpanded.add(zoneId);
    }
    setExpandedZones(newExpanded);
  };

  const getCarsInZone = (zoneId: string) => cars.filter((c) => c.zoneId === zoneId && !c.exitTime);
  const getCarsLeftZone = (zoneId: string) => cars.filter((c) => c.zoneId === zoneId && c.exitTime);
  const getAllLeftCars = cars.filter((c) => c.exitTime);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header
        showSimulationToggle={true}
        simulationEnabled={simulationEnabled}
        onSimulationToggle={setSimulationEnabled}
      />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Control Panel */}
          <div className="mb-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h2>
            <div className="flex gap-4">
              <button
                onClick={generateRandomCar}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition"
              >
                + Add Random Car Entry
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Click "Add Random Car Entry" to simulate a car entering a zone. Use the zone tables to add tickets and record exits.
            </p>
          </div>

          {/* Zones with Cars - 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {zones.map((zone) => {
              const carsInZone = getCarsInZone(zone.id);
              const carsLeftZone = getCarsLeftZone(zone.id);

              return (
                <div key={zone.id} className="rounded-lg border border-gray-200 overflow-hidden flex flex-col max-h-96">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: zone.color }}
                      />
                      <h3 className="text-sm font-semibold text-gray-900 flex-1">{zone.name}</h3>
                      <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                        {carsInZone.length} active
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col p-3 space-y-3">
                    {/* Currently in Zone */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-2">In Zone ({carsInZone.length})</h4>
                      {carsInZone.length === 0 ? (
                        <p className="text-xs text-gray-600 italic">No cars</p>
                      ) : (
                        <div className="overflow-x-auto text-xs">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-100 border-b text-xs">
                              <tr>
                                <th className="px-1 py-1 text-left font-semibold">Plate</th>
                                <th className="px-1 py-1 text-left font-semibold">Status</th>
                                <th className="px-1 py-1 text-center font-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {carsInZone.map((car) => {
                                const status = getPaymentStatus(car, zone.tariffs);
                                return (
                                  <tr key={car.id} className={`border-b text-xs ${getRowColor(status.status)}`}>
                                    <td className="px-1 py-1 font-mono font-bold truncate">{car.licensePlate}</td>
                                    <td className="px-1 py-1">
                                      <div className="flex items-center gap-1">
                                        <span
                                          className={`inline-block w-2 h-2 rounded-full ${
                                            status.status === 'paid'
                                              ? 'bg-green-600'
                                              : status.status === 'expiring'
                                              ? 'bg-yellow-600'
                                              : 'bg-red-600'
                                          }`}
                                        />
                                        {car.hasPCN && <span className="text-xs font-bold text-red-600">PCN</span>}
                                      </div>
                                    </td>
                                    <td className="px-1 py-1 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          onClick={() => openEdit(car)}
                                          className="text-xs px-1 py-0 bg-gray-500 text-white rounded hover:bg-gray-600 transition whitespace-nowrap"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => exitCar(car.id)}
                                          className="text-xs px-1 py-0 bg-blue-600 text-white rounded hover:bg-blue-700 transition whitespace-nowrap"
                                        >
                                          Exit
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Recently Left */}
                    {carsLeftZone.length > 0 && (
                      <div className="border-t pt-3">
                        <h4 className="text-xs font-semibold text-gray-900 mb-2">Left ({carsLeftZone.length})</h4>
                        <div className="overflow-x-auto text-xs">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-100 border-b text-xs">
                              <tr>
                                <th className="px-1 py-1 text-left font-semibold">Plate</th>
                                <th className="px-1 py-1 text-left font-semibold">Status</th>
                                <th className="px-1 py-1 text-center font-semibold">Edit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {carsLeftZone.map((car) => {
                                const status = getPaymentStatus(car, zone.tariffs);
                                return (
                                  <tr key={car.id} className={`border-b text-xs ${getRowColor(status.status)}`}>
                                    <td className="px-1 py-1 font-mono font-bold truncate">{car.licensePlate}</td>
                                    <td className="px-1 py-1">
                                      <div className="flex items-center gap-1">
                                        <span
                                          className={`inline-block w-2 h-2 rounded-full ${
                                            status.status === 'paid'
                                              ? 'bg-green-600'
                                              : status.status === 'expiring'
                                              ? 'bg-yellow-600'
                                              : 'bg-red-600'
                                          }`}
                                        />
                                        {car.hasPCN && <span className="text-xs font-bold text-red-600">PCN</span>}
                                      </div>
                                    </td>
                                    <td className="px-1 py-1 text-center">
                                      <button
                                        onClick={() => openEdit(car)}
                                        className="text-xs px-1 py-0 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                                      >
                                        Edit
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* All Left Cars Table */}
          {getAllLeftCars.length > 0 && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Historical Records ({getAllLeftCars.length})</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          License Plate
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Zone
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Entry Time
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Exit Time
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Duration
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getAllLeftCars.map((car) => {
                        const zone = zones.find((z) => z.id === car.zoneId);
                        const status = getPaymentStatus(car, zone?.tariffs);
                        const parkedTime = car.exitTime
                          ? Math.round(
                              (new Date(car.exitTime).getTime() -
                                new Date(car.entryTime).getTime()) /
                                60000
                            )
                          : 0;
                        return (
                          <tr key={car.id} className={`border-b ${getRowColor(status.status)}`}>
                            <td className="px-4 py-3 font-mono font-semibold">{car.licensePlate}</td>
                            <td className="px-4 py-3 text-gray-600">{zone?.name || 'Unknown'}</td>
                            <td className="px-4 py-3 text-gray-600">{formatTime(car.entryTime)}</td>
                            <td className="px-4 py-3 text-gray-600">
                              {car.exitTime ? formatTime(car.exitTime) : '-'}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{formatDuration(parkedTime)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    status.status === 'paid'
                                      ? 'bg-green-100 text-green-800'
                                      : status.status === 'expiring'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {status.label}
                                </span>
                                {car.hasPCN && (
                                  <span className="px-2 py-1 rounded text-xs font-bold bg-red-600 text-white">
                                    PCN
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEdit(car)}
                                  className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteCar(car.id)}
                                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {editState && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 max-w-full">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Edit Status</h3>
            <p className="text-sm text-gray-500 font-mono mb-4">{editState.car.licensePlate}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket</label>
                <select
                  value={editState.ticketStatus}
                  onChange={(e) => setEditState({ ...editState, ticketStatus: e.target.value as 'none' | 'paid' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">No Ticket</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pcn-toggle"
                  checked={editState.hasPCN}
                  onChange={(e) => setEditState({ ...editState, hasPCN: e.target.checked })}
                  className="w-4 h-4 accent-red-600"
                />
                <label htmlFor="pcn-toggle" className="text-sm font-medium text-gray-700">
                  Issue PCN
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={saveEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditState(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
