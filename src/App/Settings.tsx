import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Eye,
  Home,
  Trash2,
  Save,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security' | 'privacy'>(
    'profile'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
  });

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false,
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Privacy state
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showWishlist: false,
    showOrderHistory: false,
    allowMessages: true,
  });

  // Load initial data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/settings');

        if (response.data.user) {
          setProfile(response.data.user);
          if (response.data.user.shippingAddress) {
            setAddresses(response.data.user.shippingAddress);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save profile
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await apiClient.put(
        '/settings/profile',
        {
          name: profile.name,
          phone: profile.phone,
        }
      );
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Save address
  const handleSaveAddress = async () => {
    try {
      setIsSaving(true);

      // Validate form
      if (
        !addressForm.street ||
        !addressForm.city ||
        !addressForm.state ||
        !addressForm.postalCode ||
        !addressForm.country
      ) {
        toast.error('All fields are required');
        setIsSaving(false);
        return;
      }

      await apiClient.post('/settings/addresses', addressForm);

      setAddresses([...addresses, addressForm as Address]);
      setAddressForm({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false,
      });
      setShowAddressForm(false);
      toast.success('Address added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      setIsSaving(true);
      await apiClient.delete(`/settings/addresses/${addressId}`);

      setAddresses(addresses.filter((addr) => addr._id !== addressId));
      toast.success('Address deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete address');
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    setPasswordError('');

    try {
      // Validation
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        setPasswordError('All fields are required');
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }

      setIsSaving(true);
      await apiClient.put(
        '/settings/password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }
      );

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password changed successfully');
    } catch (error: any) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  // Save privacy settings
  const handleSavePrivacy = async () => {
    try {
      setIsSaving(true);
      await apiClient.put('/settings/privacy', privacy);
      toast.success('Privacy settings updated');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Messages are now shown via toast notifications */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'addresses', label: 'Addresses', icon: Home },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'privacy', label: 'Privacy', icon: Eye },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === id
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Save size={20} />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Shipping Addresses</h2>
                  <button
                    onClick={() => {
                      setShowAddressForm(!showAddressForm);
                      setAddressForm({
                        street: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: '',
                        isDefault: false,
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    Add Address
                  </button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={addressForm.street}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, street: e.target.value })
                        }
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, city: e.target.value })
                        }
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="State/Province"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, state: e.target.value })
                        }
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={addressForm.postalCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            postalCode: e.target.value,
                          })
                        }
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, country: e.target.value })
                        }
                        className="px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            isDefault: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded"
                      />
                      <label className="text-gray-700">Set as default address</label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveAddress}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Address'}
                      </button>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Addresses List */}
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No addresses yet</p>
                  ) : (
                    addresses.map((address) => (
                      <div key={address._id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">
                              {address.street}, {address.city}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.state} {address.postalCode}, {address.country}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        {address.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Error */}
                  {passwordError && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle size={20} />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Lock size={20} />
                      {isSaving ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                    <select
                      value={privacy.profileVisibility}
                      onChange={(e) =>
                        setPrivacy({ ...privacy, profileVisibility: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="private">Private (Only visible to you)</option>
                      <option value="friends">Friends (Visible to connections)</option>
                      <option value="public">Public (Visible to everyone)</option>
                    </select>
                  </div>

                  {/* Show Wishlist */}
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Show my wishlist</label>
                    <input
                      type="checkbox"
                      checked={privacy.showWishlist}
                      onChange={(e) =>
                        setPrivacy({ ...privacy, showWishlist: e.target.checked })
                      }
                      className="w-5 h-5 rounded"
                    />
                  </div>

                  {/* Show Order History */}
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Show order history</label>
                    <input
                      type="checkbox"
                      checked={privacy.showOrderHistory}
                      onChange={(e) =>
                        setPrivacy({ ...privacy, showOrderHistory: e.target.checked })
                      }
                      className="w-5 h-5 rounded"
                    />
                  </div>

                  {/* Allow Messages */}
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Allow messages from others</label>
                    <input
                      type="checkbox"
                      checked={privacy.allowMessages}
                      onChange={(e) =>
                        setPrivacy({ ...privacy, allowMessages: e.target.checked })
                      }
                      className="w-5 h-5 rounded"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSavePrivacy}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Save size={20} />
                      {isSaving ? 'Saving...' : 'Save Privacy Settings'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
