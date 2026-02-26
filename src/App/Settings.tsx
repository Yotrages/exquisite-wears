import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout';
import { User, Lock, Eye, Home, Trash2, Save, Plus, AlertCircle, ChevronRight } from 'lucide-react';
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface UserProfile { name: string; email: string; phone: string; avatar?: string; }
interface Address { _id: string; street: string; city: string; state: string; postalCode: string; country: string; isDefault?: boolean; }

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security' | 'privacy'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '', phone: '' });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', postalCode: '', country: '', isDefault: false });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [privacy, setPrivacy] = useState({ profileVisibility: 'private', showWishlist: false, showOrderHistory: false, allowMessages: true });

  useEffect(() => {
    apiClient.get('/settings')
      .then(res => {
        if (res.data.user) {
          setProfile(res.data.user);
          if (res.data.user.shippingAddress) setAddresses(res.data.user.shippingAddress);
        }
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    try { setIsSaving(true); await apiClient.put('/settings/profile', { name: profile.name, phone: profile.phone }); toast.success('Profile updated!'); }
    catch (e: any) { toast.error(e.response?.data?.error || 'Failed to update profile'); }
    finally { setIsSaving(false); }
  };

  const handleSaveAddress = async () => {
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.postalCode || !addressForm.country) {
      toast.error('All fields are required'); return;
    }
    try {
      setIsSaving(true);
      await apiClient.post('/settings/addresses', addressForm);
      setAddresses([...addresses, addressForm as Address]);
      setAddressForm({ street: '', city: '', state: '', postalCode: '', country: '', isDefault: false });
      setShowAddressForm(false);
      toast.success('Address added!');
    } catch (e: any) { toast.error(e.response?.data?.error || 'Failed to save'); }
    finally { setIsSaving(false); }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      setIsSaving(true);
      await apiClient.delete(`/settings/addresses/${id}`);
      setAddresses(addresses.filter(a => a._id !== id));
      toast.success('Address deleted');
    } catch (e: any) { toast.error(e.response?.data?.error || 'Failed to delete'); }
    finally { setIsSaving(false); }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) { setPasswordError('All fields are required'); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordError('Passwords do not match'); return; }
    if (passwordForm.newPassword.length < 6) { setPasswordError('Password must be at least 6 characters'); return; }
    try {
      setIsSaving(true);
      await apiClient.put('/settings/password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed!');
    } catch (e: any) { setPasswordError(e.response?.data?.error || 'Failed to change password'); }
    finally { setIsSaving(false); }
  };

  const handleSavePrivacy = async () => {
    try { setIsSaving(true); await apiClient.put('/settings/privacy', privacy); toast.success('Privacy settings updated!'); }
    catch (e: any) { toast.error(e.response?.data?.error || 'Failed to update'); }
    finally { setIsSaving(false); }
  };

  const tabs = [
    { id: 'profile',   label: 'Profile',    icon: User },
    { id: 'addresses', label: 'Addresses',  icon: Home },
    { id: 'security',  label: 'Security',   icon: Lock },
    { id: 'privacy',   label: 'Privacy',    icon: Eye },
  ];

  const inputCls = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-400";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-1.5";
  const saveBtnCls = "flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-60";

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading settings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-gray-900 font-medium">Account Settings</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Account Settings</h1>
            <p className="text-sm text-gray-500">Manage your profile, addresses and security</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-2 sticky top-32">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold mb-0.5 ${
                      activeTab === id
                        ? 'bg-orange-50 text-orange-600 border border-orange-100'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} className={activeTab === id ? 'text-orange-500' : 'text-gray-400'} />
                    <span className="flex-1 text-left">{label}</span>
                    {activeTab === id && <ChevronRight size={14} className="text-orange-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className={inputCls} placeholder="Your full name" />
                    </div>
                    <div>
                      <label className={labelCls}>Email address</label>
                      <input type="email" value={profile.email} disabled className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className={labelCls}>Phone number</label>
                      <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className={inputCls} placeholder="e.g. 08012345678" />
                    </div>
                    <div className="pt-2">
                      <button onClick={handleSaveProfile} disabled={isSaving} className={saveBtnCls}>
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Shipping Addresses</h2>
                    <button
                      onClick={() => { setShowAddressForm(!showAddressForm); setAddressForm({ street: '', city: '', state: '', postalCode: '', country: '', isDefault: false }); }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all active:scale-95"
                    >
                      <Plus size={16} /> Add Address
                    </button>
                  </div>

                  {showAddressForm && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5 space-y-4">
                      <h3 className="text-sm font-bold text-gray-700">New Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: 'street', placeholder: 'Street Address' },
                          { key: 'city', placeholder: 'City' },
                          { key: 'state', placeholder: 'State/Province' },
                          { key: 'postalCode', placeholder: 'Postal Code' },
                          { key: 'country', placeholder: 'Country' },
                        ].map(({ key, placeholder }) => (
                          <input
                            key={key}
                            type="text"
                            placeholder={placeholder}
                            value={(addressForm as any)[key]}
                            onChange={e => setAddressForm({ ...addressForm, [key]: e.target.value })}
                            className={inputCls}
                          />
                        ))}
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="w-4 h-4 accent-orange-500" />
                        <span className="text-sm text-gray-700">Set as default address</span>
                      </label>
                      <div className="flex gap-3 pt-2">
                        <button onClick={handleSaveAddress} disabled={isSaving} className={saveBtnCls}>
                          {isSaving ? 'Saving...' : 'Save Address'}
                        </button>
                        <button onClick={() => setShowAddressForm(false)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {addresses.length === 0 ? (
                    <div className="py-12 text-center">
                      <Home size={40} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No addresses saved yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map(address => (
                        <div key={address._id} className="border border-gray-100 rounded-xl p-4 flex items-start justify-between hover:border-orange-200 transition-colors">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{address.street}, {address.city}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{address.state} {address.postalCode}, {address.country}</p>
                            {address.isDefault && <span className="inline-block mt-1 text-[11px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Default</span>}
                          </div>
                          <button onClick={() => handleDeleteAddress(address._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Change Password</h2>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className={labelCls}>Current Password</label>
                      <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className={inputCls} placeholder="Enter current password" />
                    </div>
                    <div>
                      <label className={labelCls}>New Password</label>
                      <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className={inputCls} placeholder="At least 6 characters" />
                    </div>
                    <div>
                      <label className={labelCls}>Confirm New Password</label>
                      <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className={inputCls} placeholder="Repeat new password" />
                    </div>
                    {passwordError && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl text-sm">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {passwordError}
                      </div>
                    )}
                    <div className="pt-2">
                      <button onClick={handleChangePassword} disabled={isSaving} className={saveBtnCls}>
                        <Lock size={16} />
                        {isSaving ? 'Updating...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy */}
              {activeTab === 'privacy' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Privacy Settings</h2>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className={labelCls}>Profile Visibility</label>
                      <select value={privacy.profileVisibility} onChange={e => setPrivacy({ ...privacy, profileVisibility: e.target.value })} className={inputCls}>
                        <option value="private">Private — only visible to you</option>
                        <option value="friends">Friends — visible to connections</option>
                        <option value="public">Public — visible to everyone</option>
                      </select>
                    </div>
                    {[
                      { key: 'showWishlist', label: 'Show my wishlist to others' },
                      { key: 'showOrderHistory', label: 'Show order history' },
                      { key: 'allowMessages', label: 'Allow messages from others' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center justify-between cursor-pointer py-3 border-b border-gray-50 last:border-0">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <div
                          onClick={() => setPrivacy({ ...privacy, [key]: !(privacy as any)[key] })}
                          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${(privacy as any)[key] ? 'bg-orange-500' : 'bg-gray-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${(privacy as any)[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </label>
                    ))}
                    <div className="pt-2">
                      <button onClick={handleSavePrivacy} disabled={isSaving} className={saveBtnCls}>
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
