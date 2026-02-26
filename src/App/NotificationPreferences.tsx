import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Phone, Clock, Save, X, ChevronRight } from 'lucide-react';
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Toggle = ({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked ? 'bg-orange-500' : 'bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const Section = ({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
        {icon}
      </div>
      <div>
        <h2 className="font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="px-6 py-5 space-y-4">{children}</div>
  </div>
);

const PreferenceRow = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4 py-1">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
    <Toggle checked={checked} onChange={onChange} disabled={disabled} />
  </div>
);

const NotificationPreferences: React.FC = () => {
  const { user } = useSelector((state: any) => state.authSlice);
  if (!user) return <Navigate to="/login" replace />;

  const [prefs, setPrefs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDndModal, setShowDndModal] = useState(false);
  const [dnd, setDnd] = useState({
    enabled: false,
    startHour: 22,
    endHour: 8,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get('/notifications/preferences');
        setPrefs(res.data);
        if (res.data.doNotDisturbHours) {
          setDnd({
            enabled: res.data.doNotDisturbHours.enabled || false,
            startHour: res.data.doNotDisturbHours.startHour ?? 22,
            endHour: res.data.doNotDisturbHours.endHour ?? 8,
          });
        }
      } catch {
        toast.error('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const set = (path: string, value: any) => {
    setPrefs((prev: any) => {
      const next = { ...prev };
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await apiClient.put('/notifications/preferences', prefs);
      toast.success('Preferences saved');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDnd = async () => {
    try {
      setIsSaving(true);
      await apiClient.put('/notifications/dnd', dnd);
      setPrefs((prev: any) => ({ ...prev, doNotDisturbHours: dnd }));
      setShowDndModal(false);
      toast.success('Do Not Disturb updated');
    } catch {
      toast.error('Failed to save DND settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    if (!window.confirm('This will disable all email notifications. Continue?')) return;
    try {
      setIsSaving(true);
      await apiClient.post('/notifications/unsubscribe-emails', {});
      toast.success('Unsubscribed from all emails');
      const res = await apiClient.get('/notifications/preferences');
      setPrefs(res.data);
    } catch {
      toast.error('Failed to unsubscribe');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-40 animate-pulse" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!prefs) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-500">Failed to load notification preferences.</p>
        </div>
      </Layout>
    );
  }

  const hourToLabel = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:00 ${ampm}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link to="/settings" className="hover:text-orange-500 transition-colors">Settings</Link>
              <ChevronRight size={12} />
              <span className="text-gray-900 font-medium">Notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Bell size={20} className="text-orange-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Notification Preferences</h1>
                <p className="text-sm text-gray-500">Manage how and when you hear from us</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          {/* ── EMAIL ── */}
          <Section
            icon={<Mail size={20} />}
            title="Email Notifications"
            subtitle="Receive updates to your inbox"
          >
            <PreferenceRow
              label="Order Updates"
              description="Confirmation, shipping and delivery emails"
              checked={prefs.emailNotifications?.orderUpdates ?? true}
              onChange={(v) => set('emailNotifications.orderUpdates', v)}
            />
            <div className="border-t border-gray-50" />
            <PreferenceRow
              label="Price Drop Alerts"
              description="When a wishlisted item drops in price"
              checked={prefs.emailNotifications?.priceDropAlerts ?? true}
              onChange={(v) => set('emailNotifications.priceDropAlerts', v)}
            />
            <div className="border-t border-gray-50" />
            <PreferenceRow
              label="Restock Notifications"
              description="When an out-of-stock item is available again"
              checked={prefs.emailNotifications?.restockNotifications ?? true}
              onChange={(v) => set('emailNotifications.restockNotifications', v)}
            />
            <div className="border-t border-gray-50" />
            <PreferenceRow
              label="Review Requests"
              description="Reminder to review products you purchased"
              checked={prefs.emailNotifications?.reviewRequests ?? true}
              onChange={(v) => set('emailNotifications.reviewRequests', v)}
            />
            <div className="border-t border-gray-50" />
            <PreferenceRow
              label="Promotions & Deals"
              description="Flash sales, discount codes and special offers"
              checked={prefs.emailNotifications?.promotions ?? true}
              onChange={(v) => set('emailNotifications.promotions', v)}
            />
            <div className="border-t border-gray-50" />
            <PreferenceRow
              label="Newsletter"
              description="Weekly picks, new arrivals and style guides"
              checked={prefs.emailNotifications?.newsletter ?? true}
              onChange={(v) => set('emailNotifications.newsletter', v)}
            />
          </Section>

          {/* ── PUSH ── */}
          <Section
            icon={<MessageSquare size={20} />}
            title="Push Notifications"
            subtitle="Browser & mobile push alerts"
          >
            <PreferenceRow
              label="Order Updates"
              description="Real-time shipping and delivery alerts"
              checked={prefs.pushNotifications?.orderUpdates ?? true}
              onChange={(v) => set('pushNotifications.orderUpdates', v)}
            />
            <div className="border-t border-gray-50" />
            <PreferenceRow
              label="Price Drop Alerts"
              checked={prefs.pushNotifications?.priceDropAlerts ?? true}
              onChange={(v) => set('pushNotifications.priceDropAlerts', v)}
            />
            <div className="border-t border-gray-50" />
            <PreferenceRow
              label="Restock Alerts"
              checked={prefs.pushNotifications?.restockNotifications ?? true}
              onChange={(v) => set('pushNotifications.restockNotifications', v)}
            />
            <div className="border-t border-gray-50" />
            <PreferenceRow
              label="Promotions"
              description="Flash sales and time-limited offers"
              checked={prefs.pushNotifications?.promotions ?? false}
              onChange={(v) => set('pushNotifications.promotions', v)}
            />
          </Section>

          {/* ── SMS ── */}
          <Section
            icon={<Phone size={20} />}
            title="SMS Notifications"
            subtitle="Text messages for critical alerts"
          >
            <PreferenceRow
              label="Enable SMS"
              description="Receive text alerts on your phone"
              checked={prefs.smsNotifications?.enabled ?? false}
              onChange={(v) => set('smsNotifications.enabled', v)}
            />
            {prefs.smsNotifications?.enabled && (
              <>
                <div className="border-t border-gray-50" />
                <PreferenceRow
                  label="Order Updates via SMS"
                  checked={prefs.smsNotifications?.orderUpdates ?? false}
                  onChange={(v) => set('smsNotifications.orderUpdates', v)}
                />
                <div className="border-t border-gray-50" />
                <PreferenceRow
                  label="Price Drop Alerts via SMS"
                  checked={prefs.smsNotifications?.priceDropAlerts ?? false}
                  onChange={(v) => set('smsNotifications.priceDropAlerts', v)}
                />
              </>
            )}
          </Section>

          {/* ── DO NOT DISTURB ── */}
          <Section
            icon={<Clock size={20} />}
            title="Do Not Disturb"
            subtitle="Quiet hours for notifications"
          >
            <div className="flex items-center justify-between">
              <div>
                {dnd.enabled ? (
                  <p className="text-sm font-semibold text-gray-900">
                    Active: {hourToLabel(dnd.startHour)} – {hourToLabel(dnd.endHour)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Not configured</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">No notifications during quiet hours</p>
              </div>
              <button
                onClick={() => setShowDndModal(true)}
                className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-sm rounded-xl transition-colors"
              >
                {dnd.enabled ? 'Edit' : 'Set Up'}
              </button>
            </div>
          </Section>

          {/* ── ACTIONS ── */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-60 shadow-md shadow-orange-200"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleUnsubscribeAll}
              disabled={isSaving}
              className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              Unsubscribe from All Emails
            </button>
          </div>
        </div>
      </div>

      {/* ── DND MODAL ── */}
      {showDndModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Do Not Disturb Hours</h3>
              <button onClick={() => setShowDndModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <PreferenceRow
                label="Enable Do Not Disturb"
                checked={dnd.enabled}
                onChange={(v) => setDnd((p) => ({ ...p, enabled: v }))}
              />
              {dnd.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Quiet Start Hour
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={23}
                      value={dnd.startHour}
                      onChange={(e) => setDnd((p) => ({ ...p, startHour: parseInt(e.target.value) }))}
                      className="w-full accent-orange-500"
                    />
                    <p className="text-sm text-orange-600 font-semibold mt-1">{hourToLabel(dnd.startHour)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Quiet End Hour
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={23}
                      value={dnd.endHour}
                      onChange={(e) => setDnd((p) => ({ ...p, endHour: parseInt(e.target.value) }))}
                      className="w-full accent-orange-500"
                    />
                    <p className="text-sm text-orange-600 font-semibold mt-1">{hourToLabel(dnd.endHour)}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={handleSaveDnd}
                disabled={isSaving}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowDndModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default NotificationPreferences;
