import React, { useState, useEffect } from 'react';
import { 
  getAuth, 
  updatePassword, 
  updateEmail, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  getFirestore, 
  serverTimestamp 
} from 'firebase/firestore';

const SettingsPage = () => {
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;
  
  // Form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  });
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // UI states
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('password');

  useEffect(() => {
    // Check if current user is super admin
    if (currentUser && currentUser.email === 'admin@bluewhale.com') {
      setIsSuperAdmin(true);
    }
    
    // Pre-fill email field
    if (currentUser) {
      setEmailForm(prev => ({ ...prev, newEmail: currentUser.email || '' }));
    }
  }, [currentUser]);

  // Reset messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const { currentPassword, newPassword, confirmPassword } = passwordForm;
      
      // Validate inputs
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email || '',
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, newPassword);
      
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const { newEmail, password } = emailForm;
      
      // Validate inputs
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      
      if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email || '',
        password
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update email
      await updateEmail(currentUser, newEmail);
      
      setMessage({ text: 'Email updated successfully!', type: 'success' });
      setEmailForm({ ...emailForm, password: '' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const { email, password, confirmPassword } = newUserForm;
      
      // Validate inputs
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Check if user already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('A user with this email already exists');
      }
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      // Store user in Firestore
      await addDoc(collection(db, 'users'), {
        uid: newUser.uid,
        email: newUser.email,
        role: 'admin',
        createdAt: serverTimestamp(),
        createdBy: currentUser?.email || 'system'
      });
      
      setMessage({ text: `User ${email} added successfully!`, type: 'success' });
      setNewUserForm({ email: '', password: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-medium rounded-t-lg ${
        active 
          ? 'bg-white text-blue-900 border-t-2 border-yellow-400' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Account Settings</h2>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <TabButton id="password" label="Change Password" active={activeTab === 'password'} />
        <TabButton id="email" label="Update Email" active={activeTab === 'email'} />
        {isSuperAdmin && (
          <TabButton id="addUser" label="Add User" active={activeTab === 'addUser'} />
        )}
      </div>
      
      {/* Status Messages */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Password Change Form */}
      {activeTab === 'password' && (
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}
      
      {/* Email Change Form */}
      {activeTab === 'email' && (
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Update Email Address</h3>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Email Address
              </label>
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({...emailForm, newEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password (for verification)
              </label>
              <input
                type="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm({...emailForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Email'}
            </button>
          </form>
        </div>
      )}
      
      {/* Add User Form (Super Admin Only) */}
      {activeTab === 'addUser' && isSuperAdmin && (
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Add New Admin User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={newUserForm.confirmPassword}
                onChange={(e) => setNewUserForm({...newUserForm, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Adding User...' : 'Add User'}
            </button>
          </form>
        </div>
      )}
      
      <div className="mt-8 text-sm text-gray-500">
        <p>
          Note: For security reasons, you will be required to re-authenticate when changing sensitive account information.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;    