'use client';

import { useState, useEffect } from 'react';

interface User {
  uuid?: string;
  login?: { username: string };
  name?: { first: string; last: string };
  email?: string;
  location?: { city: string; country: string };
}

interface ClockRecord {
  userId: string;
  userName: string;
  clockInTime: number;
  clockOutTime?: number;
  jobLocation?: string;
}

export default function ClockApp() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [clockRecords, setClockRecords] = useState<ClockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [sessionDuration, setSessionDuration] = useState<string>('');

  const API_BASE = 'https://user-api.builder-io.workers.dev/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const userId = selectedUser.uuid || selectedUser.login?.username;
    const activeRecord = clockRecords.find(r => r.userId === userId && !r.clockOutTime);

    if (!activeRecord) {
      setSessionDuration('');
      return;
    }

    const timer = setInterval(() => {
      const elapsed = Date.now() - activeRecord.clockInTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      setSessionDuration(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedUser, clockRecords]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/users?perPage=50`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = () => {
    if (!selectedUser) return;

    const userId = selectedUser.uuid || selectedUser.login?.username;
    const userName = `${selectedUser.name?.first} ${selectedUser.name?.last}`;

    const newRecord: ClockRecord = {
      userId,
      userName,
      clockInTime: Date.now(),
      jobLocation: selectedUser.location?.city || 'Unknown location',
    };

    setClockRecords([...clockRecords, newRecord]);
  };

  const handleClockOut = () => {
    if (!selectedUser) return;

    const userId = selectedUser.uuid || selectedUser.login?.username;
    setClockRecords(
      clockRecords.map(record =>
        record.userId === userId && !record.clockOutTime
          ? { ...record, clockOutTime: Date.now() }
          : record
      )
    );
  };

  const isClockedIn = selectedUser ? clockRecords.some(
    r => r.userId === (selectedUser.uuid || selectedUser.login?.username) && !r.clockOutTime
  ) : false;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    const end = endTime || Date.now();
    const duration = end - startTime;
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="clock-container min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Window Fitting Jobs</h1>
        <p className="text-gray-200">Clock In & Clock Out System</p>
      </div>

      {/* Current Time Display */}
      <div className="mb-8 text-center">
        <div className="time-display text-yellow-400">{currentTime || '00:00:00'}</div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - User Selection */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Select Fitter</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-300">Loading users...</div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.uuid || user.login?.username}
                  onClick={() => setSelectedUser(user)}
                  className={`user-card w-full text-left p-4 rounded-lg transition-all ${
                    selectedUser?.uuid === user.uuid || 
                    selectedUser?.login?.username === user.login?.username
                      ? 'active'
                      : 'hover:bg-white/15'
                  }`}
                >
                  <div className="font-semibold text-lg">
                    {user.name?.first} {user.name?.last}
                  </div>
                  <div className="text-sm opacity-75">
                    {user.email}
                  </div>
                  {user.location?.city && (
                    <div className="text-xs opacity-60 mt-1">
                      📍 {user.location.city}, {user.location.country}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Clock In/Out Controls */}
        <div className="flex flex-col gap-6">
          {/* Status Card */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Current Status</h2>
            
            {selectedUser ? (
              <div>
                <div className="mb-4">
                  <div className="text-white text-lg font-semibold mb-2">
                    {selectedUser.name?.first} {selectedUser.name?.last}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`status-badge ${isClockedIn ? 'clocked-in' : 'clocked-out'}`}>
                      {isClockedIn ? '✓ Clocked In' : '○ Clocked Out'}
                    </span>
                  </div>
                  {sessionDuration && (
                    <div className="text-white mb-2">
                      <div className="text-sm opacity-75">Session Duration</div>
                      <div className="duration-display">{sessionDuration}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {isClockedIn ? (
                    <button
                      onClick={handleClockOut}
                      className="clock-btn-primary w-full py-4 rounded-lg text-lg font-bold transition-all"
                    >
                      🛑 Clock Out Now
                    </button>
                  ) : (
                    <button
                      onClick={handleClockIn}
                      className="clock-btn-primary w-full py-4 rounded-lg text-lg font-bold transition-all"
                    >
                      ▶ Clock In Now
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Select a fitter to begin
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Today's Record</h3>
            {selectedUser && clockRecords.filter(r => r.userId === (selectedUser.uuid || selectedUser.login?.username)).length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {clockRecords
                  .filter(r => r.userId === (selectedUser.uuid || selectedUser.login?.username))
                  .map((record, idx) => (
                    <div key={idx} className="text-sm bg-white/5 p-3 rounded border border-white/10">
                      <div className="text-yellow-400 font-semibold">
                        In: {formatTime(record.clockInTime)}
                      </div>
                      {record.clockOutTime && (
                        <div className="text-gray-300">
                          Out: {formatTime(record.clockOutTime)}
                        </div>
                      )}
                      <div className="text-gray-400 text-xs mt-1">
                        Duration: {formatDuration(record.clockInTime, record.clockOutTime)}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        📍 {record.jobLocation}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm text-center py-4">
                {selectedUser ? 'No clock records yet' : 'Select a fitter to view records'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Retry Button */}
      {error && (
        <div className="mt-8">
          <button
            onClick={fetchUsers}
            className="clock-btn-secondary px-6 py-3 rounded-lg font-semibold"
          >
            ↻ Retry Loading Users
          </button>
        </div>
      )}
    </div>
  );
}
