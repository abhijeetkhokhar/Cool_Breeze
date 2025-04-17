import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Implement save logic as needed (API call)
  const handleSave = () => {
    setEditing(false);
    // TODO: call API to update profile
    alert('Profile updated (not really, implement API call)!');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white p-6 rounded shadow mb-4">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Name:</label>
          {editing ? (
            <input className="border px-2 py-1 rounded w-full" value={name} onChange={e => setName(e.target.value)} />
          ) : (
            <div>{user.name}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Email:</label>
          {editing ? (
            <input className="border px-2 py-1 rounded w-full" value={email} onChange={e => setEmail(e.target.value)} />
          ) : (
            <div>{user.email}</div>
          )}
        </div>
        <div className="flex gap-4">
          {editing ? (
            <>
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setEditing(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
