'use client';

import { useEffect, useState } from 'react';
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

export default function CarsTrackingPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchZones();
    fetchCars();

    const interval = setInterval(() => {
      fetchCars();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      <Header />

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

          {/* Zones with Cars */}
          <div className="space-y-6 mb-8">
            {zones.map((zone) => {
              const carsInZone = getCarsInZone(zone.id);
              const carsLeftZone = getCarsLeftZone(zone.id);
              const isExpanded = expandedZones.has(zone.id);

              return (
                <div key={zone.id} className="rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleZone(zone.id)}
                    className="w-full px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: zone.color }}
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
                      <span className="text-sm text-gray-600 font-medium">
                        ({carsInZone.length} active, {carsLeftZone.length} left)
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="p-6 space-y-6">
                      {/* Currently in Zone */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Currently in Zone</h4>
                        {carsInZone.length === 0 ? (
                          <p className="text-sm text-gray-600">No cars currently in this zone</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100 border-b">
                                <tr>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    License Plate
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Entry Time
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Status
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Duration
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {carsInZone.map((car) => {
                                  const status = getPaymentStatus(car, zone.tariffs);
                                  return (
                                    <tr key={car.id} className={`border-b ${getRowColor(status.status)}`}>
                                      <td className="px-4 py-3 font-mono font-semibold">
                                        {car.licensePlate}
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">
                                        {formatTime(car.entryTime)}
                                      </td>
                                      <td className="px-4 py-3">
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
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">
                                        {formatDuration(car.ticketDuration)}
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                          {!car.ticketBoughtTime && zone.tariffs && (
                                            <select
                                              onChange={(e) => {
                                                const tariff = zone.tariffs![parseInt(e.target.value)];
                                                const minutes = parseInt(tariff.duration.match(/\d+/)?.[0] || '0') * 60;
                                                addTicket(car.id, minutes, tariff.price);
                                              }}
                                              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white cursor-pointer"
                                            >
                                              <option value="">Add Ticket</option>
                                              {zone.tariffs.map((tariff, idx) => (
                                                <option key={idx} value={idx}>
                                                  {tariff.duration} (£{tariff.price})
                                                </option>
                                              ))}
                                            </select>
                                          )}
                                          <button
                                            onClick={() => exitCar(car.id)}
                                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Recently Left</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100 border-b">
                                <tr>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    License Plate
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Entry Time
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Exit Time
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Status
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Duration Parked
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {carsLeftZone.map((car) => {
                                  const status = getPaymentStatus(car, zone.tariffs);
                                  const parkedTime = car.exitTime
                                    ? Math.round(
                                        (new Date(car.exitTime).getTime() -
                                          new Date(car.entryTime).getTime()) /
                                          60000
                                      )
                                    : 0;
                                  return (
                                    <tr key={car.id} className={`border-b ${getRowColor(status.status)}`}>
                                      <td className="px-4 py-3 font-mono font-semibold">
                                        {car.licensePlate}
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">
                                        {formatTime(car.entryTime)}
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">
                                        {car.exitTime ? formatTime(car.exitTime) : '-'}
                                      </td>
                                      <td className="px-4 py-3">
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
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">
                                        {formatDuration(parkedTime)}
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
                  )}
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
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => deleteCar(car.id)}
                                className="text-xs text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
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
    </div>
  );
}
