import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, PhoneCall, Clock, Save, X } from 'lucide-react';
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';

interface PreferencesData {
  email: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    orderUpdates: boolean;
    promotions: boolean;
    productRecommendations: boolean;
    priceDrops: boolean;
    reviews: boolean;
  };
  push?: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    orderUpdates: boolean;
    promotions: boolean;
    productRecommendations: boolean;
  };
  sms?: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    orderUpdates: boolean;
    urgentOnly: boolean;
  };
  doNotDisturb: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
    daysOfWeek?: string[];
  };
}

interface DndSchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
}

const NotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<PreferencesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDndModal, setShowDndModal] = useState(false);
  const [dndSchedule, setDndSchedule] = useState<DndSchedule>({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
    daysOfWeek: [],
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/notifications/preferences');
        setPreferences(response.data);

        if (response.data.doNotDisturb) {
          setDndSchedule({
            enabled: response.data.doNotDisturb.enabled,
            startTime: response.data.doNotDisturb.startTime || '22:00',
            endTime: response.data.doNotDisturb.endTime || '08:00',
            daysOfWeek: response.data.doNotDisturb.daysOfWeek || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
        toast.error('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Handle preference update
  const handleToggle = (path: string, value: any) => {
    if (!preferences) return;

    const newPrefs = { ...preferences };
    const keys = path.split('.');
    let current = newPrefs as any;

    for (let i = 0; i < keys?.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys?.length - 1]] = value;
    setPreferences(newPrefs);
  };

  // Save preferences
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await apiClient.put(
        '/notifications/preferences',
        preferences
      );
      toast.success('Preferences saved successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  // Save DND schedule
  const handleSaveDnd = async () => {
    try {
      setIsSaving(true);
      await apiClient.put(
        '/notifications/dnd/set',
        dndSchedule
      );

      if (preferences) {
        setPreferences({
          ...preferences,
          doNotDisturb: {
            enabled: dndSchedule.enabled,
            startTime: dndSchedule.startTime,
            endTime: dndSchedule.endTime,
            daysOfWeek: dndSchedule.daysOfWeek,
          },
        });
      }

      setShowDndModal(false);
      toast.success('Do Not Disturb schedule saved');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save schedule');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle unsubscribe all
  const handleUnsubscribeAll = async () => {
    if (!window.confirm('Are you sure? This will disable all notifications.')) return;

    try {
      setIsSaving(true);
      await apiClient.post(
        '/notifications/unsubscribe-all',
        {}
      );
      toast.success('Unsubscribed from all notifications');
      // Reload preferences
      const response = await apiClient.get('/notifications/preferences');
      setPreferences(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to unsubscribe');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Bell className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Failed to load preferences</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notification Preferences</h1>
          <p className="text-gray-600">Manage how and when you receive notifications</p>
        </div>

        {/* Messages are now shown via toast notifications */}

        {/* Email Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={24} className="text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Email Notifications</h2>
              <p className="text-sm text-gray-600">
                Receive updates about your account and purchases
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {/* Email enabled toggle */}
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Enable email notifications</label>
              <input
                type="checkbox"
                checked={preferences.email.enabled}
                onChange={(e) => handleToggle('email.enabled', e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </div>

            {preferences.email.enabled && (
              <>
                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium mb-2">Frequency</label>
                  <select
                    value={preferences.email.frequency}
                    onChange={(e) => handleToggle('email.frequency', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="instant">Instant</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Digest</option>
                  </select>
                </div>

                {/* Preferences */}
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  {[
                    { key: 'orderUpdates', label: 'Order updates and tracking' },
                    { key: 'promotions', label: 'Promotions and special offers' },
                    {
                      key: 'productRecommendations',
                      label: 'Personalized product recommendations',
                    },
                    { key: 'priceDrops', label: 'Price drops on wishlisted items' },
                    { key: 'reviews', label: 'Request to review purchases' },
                  ]?.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={(preferences.email as any)[key]}
                        onChange={(e) => handleToggle(`email.${key}`, e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <label className="text-gray-700">{label}</label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Push Notifications */}
        {preferences.push && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={24} className="text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold">Push Notifications</h2>
                <p className="text-sm text-gray-600">Receive notifications in your browser</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Enable push notifications</label>
                <input
                  type="checkbox"
                  checked={preferences.push.enabled}
                  onChange={(e) => handleToggle('push.enabled', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
              </div>

              {preferences.push.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <select
                      value={preferences.push.frequency}
                      onChange={(e) => handleToggle('push.frequency', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="instant">Instant</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-purple-200">
                    {[
                      { key: 'orderUpdates', label: 'Order updates' },
                      { key: 'promotions', label: 'Promotions' },
                      { key: 'productRecommendations', label: 'Product recommendations' },
                    ]?.map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={(preferences.push as any)[key]}
                          onChange={(e) => handleToggle(`push.${key}`, e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <label className="text-gray-700">{label}</label>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* SMS Notifications */}
        {preferences.sms && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <PhoneCall size={24} className="text-green-600" />
              <div>
                <h2 className="text-xl font-semibold">SMS Notifications</h2>
                <p className="text-sm text-gray-600">Receive text messages for important updates</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Enable SMS notifications</label>
                <input
                  type="checkbox"
                  checked={preferences.sms.enabled}
                  onChange={(e) => handleToggle('sms.enabled', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
              </div>

              {preferences.sms.enabled && (
                <div className="space-y-3 pl-4 border-l-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferences.sms.orderUpdates}
                      onChange={(e) => handleToggle('sms.orderUpdates', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <label className="text-gray-700">Order updates</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferences.sms.urgentOnly}
                      onChange={(e) => handleToggle('sms.urgentOnly', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <label className="text-gray-700">Urgent notifications only</label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Do Not Disturb */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock size={24} className="text-orange-600" />
            <div>
              <h2 className="text-xl font-semibold">Do Not Disturb</h2>
              <p className="text-sm text-gray-600">
                Set quiet hours when you don't want to receive notifications
              </p>
            </div>
          </div>

          <div className="mt-6">
            {preferences.doNotDisturb.enabled ? (
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="font-medium mb-2">
                  Quiet hours: {preferences.doNotDisturb.startTime} -{' '}
                  {preferences.doNotDisturb.endTime}
                </p>
                {preferences.doNotDisturb.daysOfWeek && preferences.doNotDisturb.daysOfWeek?.length > 0 && (
                  <p className="text-sm text-gray-600">
                    On: {preferences.doNotDisturb.daysOfWeek.join(', ')}
                  </p>
                )}
                <button
                  onClick={() => setShowDndModal(true)}
                  className="mt-3 text-orange-600 hover:text-orange-800 font-medium text-sm"
                >
                  Edit Schedule
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDndModal(true)}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Set Do Not Disturb
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={handleUnsubscribeAll}
            disabled={isSaving}
            className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
          >
            Unsubscribe from All
          </button>
        </div>
      </div>

      {/* DND Modal */}
      {showDndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Set Do Not Disturb Schedule</h3>
              <button
                onClick={() => setShowDndModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Enable DND */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={dndSchedule.enabled}
                  onChange={(e) => setDndSchedule({ ...dndSchedule, enabled: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <label className="text-gray-700">Enable Do Not Disturb</label>
              </div>

              {dndSchedule.enabled && (
                <>
                  {/* Time Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Start Time</label>
                    <input
                      type="time"
                      value={dndSchedule.startTime}
                      onChange={(e) =>
                        setDndSchedule({ ...dndSchedule, startTime: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">End Time</label>
                    <input
                      type="time"
                      value={dndSchedule.endTime}
                      onChange={(e) =>
                        setDndSchedule({ ...dndSchedule, endTime: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  {/* Days of Week */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Apply to days</label>
                    <div className="space-y-2">
                      {daysOfWeek?.map((day) => (
                        <div key={day} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={dndSchedule.daysOfWeek.includes(day)}
                            onChange={(e) => {
                              const newDays = e.target.checked
                                ? [...dndSchedule.daysOfWeek, day]
                                : dndSchedule.daysOfWeek.filter((d) => d !== day);
                              setDndSchedule({ ...dndSchedule, daysOfWeek: newDays });
                            }}
                            className="w-4 h-4 rounded"
                          />
                          <label className="text-gray-700">{day}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveDnd}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setShowDndModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPreferences;
