'use client';

import { useState, useEffect } from 'react';

interface User {
  uuid?: string;
  login?: { username: string };
  name?: { first: string; last: string };
  email?: string;
  location?: { city: string; country: string; state?: string };
}

interface ClockRecord {
  userId: string;
  userName: string;
  clockInTime: number;
  clockOutTime?: number;
  jobLocation?: string;
}

interface UserModalData extends User {
  photoUrl: string;
}

export default function ClockApp() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [clockRecords, setClockRecords] = useState<ClockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [sessionDuration, setSessionDuration] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState<UserModalData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testTime, setTestTime] = useState<{ hours: string; minutes: string; seconds: string; ampm: string }>({
    hours: '12',
    minutes: '00',
    seconds: '00',
    ampm: 'AM',
  });
  const [useTestTime, setUseTestTime] = useState(false);

  const API_BASE = 'https://user-api.builder-io.workers.dev/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (useTestTime) {
        const display = `${String(testTime.hours).padStart(2, '0')}:${String(testTime.minutes).padStart(2, '0')}:${String(testTime.seconds).padStart(2, '0')} ${testTime.ampm}`;
        setCurrentTime(display);
      } else {
        setCurrentTime(new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [useTestTime, testTime]);

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

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    setModalLoading(true);
    try {
      const photoResponse = await fetch('https://thispersondoesnotexist.com/', {
        cache: 'no-store',
      });
      const photoUrl = photoResponse.url;
      
      setModalUser({
        ...user,
        photoUrl: photoUrl || 'https://thispersondoesnotexist.com/',
      });
      setModalOpen(true);
    } catch (err) {
      setModalUser({
        ...user,
        photoUrl: 'https://thispersondoesnotexist.com/',
      });
      setModalOpen(true);
    } finally {
      setModalLoading(false);
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

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const firstName = user.name?.first?.toLowerCase() || '';
    const lastName = user.name?.last?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const username = user.login?.username?.toLowerCase() || '';

    return (
      firstName.includes(query) ||
      lastName.includes(query) ||
      email.includes(query) ||
      username.includes(query)
    );
  });

  return (
    <div className="clock-container">
      {/* Header */}
      <header className="page-header sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <img 
            src="https://www.sageglass.com/themes/custom/sageglass/logo.svg" 
            alt="Sage Glass Logo"
            className="page-header-logo"
          />
          <div>
            <h1 className="page-header-title text-2xl">Window Fitting Jobs</h1>
            <p className="text-sm text-gray-600">Clock In & Clock Out System</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Current Time Display */}
        <div className="mb-8 text-center">
          <div className="time-display">{currentTime || '00:00:00'}</div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - User Selection */}
          <div className="select-fitter-box rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Fitter</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="text-gray-600">Loading users...</div>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user.uuid || user.login?.username}
                    onClick={() => handleUserClick(user)}
                    className={`user-card w-full text-left p-4 rounded-lg transition-all ${
                      selectedUser?.uuid === user.uuid || 
                      selectedUser?.login?.username === user.login?.username
                        ? 'active'
                        : ''
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
                        📍 {user.location.city}{user.location.state ? ', ' + user.location.state : ''}, {user.location.country}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-4">
                <button
                  onClick={fetchUsers}
                  className="w-full clock-btn-primary px-6 py-3 rounded-lg font-semibold"
                >
                  ↻ Retry Loading Users
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Clock In/Out Controls */}
          <div className="flex flex-col gap-6">
            {/* Status Card */}
            <div className="status-box rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Status</h2>
              
              {selectedUser ? (
                <div>
                  <div className="mb-4">
                    <div className="text-gray-800 text-lg font-semibold mb-2">
                      {selectedUser.name?.first} {selectedUser.name?.last}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`status-badge ${isClockedIn ? 'clocked-in' : 'clocked-out'}`}>
                        {isClockedIn ? '✓ Clocked In' : '○ Clocked Out'}
                      </span>
                    </div>
                    {sessionDuration && (
                      <div className="text-gray-800 mb-2">
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
            <div className="activity-box rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Record</h3>
              {selectedUser && clockRecords.filter(r => r.userId === (selectedUser.uuid || selectedUser.login?.username)).length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {clockRecords
                    .filter(r => r.userId === (selectedUser.uuid || selectedUser.login?.username))
                    .map((record, idx) => (
                      <div key={idx} className="activity-record">
                        <div className="activity-record-time">
                          In: {formatTime(record.clockInTime)}
                        </div>
                        {record.clockOutTime && (
                          <div className="text-gray-600">
                            Out: {formatTime(record.clockOutTime)}
                          </div>
                        )}
                        <div className="activity-record-duration mt-1">
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
      </main>

      {/* User Modal */}
      {modalOpen && modalUser && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              className="modal-close-btn"
            >
              ✕
            </button>
            
            <img
              src={modalUser.photoUrl}
              alt={`${modalUser.name?.first} ${modalUser.name?.last}`}
              className="modal-photo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://thispersondoesnotexist.com/';
              }}
            />

            <div className="modal-info-section">
              <div className="modal-info-title">
                {modalUser.name?.first} {modalUser.name?.last}
              </div>

              {modalUser.email && (
                <div className="modal-info-item">
                  <div className="modal-info-label">Email</div>
                  <div className="modal-info-value">{modalUser.email}</div>
                </div>
              )}

              {modalUser.login?.username && (
                <div className="modal-info-item">
                  <div className="modal-info-label">Username</div>
                  <div className="modal-info-value">{modalUser.login.username}</div>
                </div>
              )}

              {modalUser.location && (
                <div className="modal-info-item">
                  <div className="modal-info-label">Location</div>
                  <div className="modal-info-value">
                    {modalUser.location.city}{modalUser.location.state ? ', ' + modalUser.location.state : ''}, {modalUser.location.country}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    handleClockIn();
                  }}
                  className="clock-btn-primary w-full py-3 rounded-lg font-semibold"
                >
                  ▶ Clock In This Fitter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
