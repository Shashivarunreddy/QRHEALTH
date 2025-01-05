import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, EmergencyContact } from '../types/profile';
import { Save, Plus, Trash2, AlertCircle, X } from 'lucide-react';

export function ProfileForm() {
  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: '',
    date_of_birth: '',
    blood_group: '',
    blood_pressure: '',
    sugar_level: '',
    medical_condition_details: '',
    medical_conditions: [],
    allergies: [],
    medications: [],
    emergency_contacts: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (data) {
      setProfile(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
        });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setProfile(prev => ({
        ...prev,
        allergies: [...(prev.allergies || []), newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setProfile(prev => ({
      ...prev,
      allergies: (prev.allergies || []).filter((_, i) => i !== index)
    }));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setProfile(prev => ({
        ...prev,
        medications: [...(prev.medications || []), newMedication.trim()]
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setProfile(prev => ({
      ...prev,
      medications: (prev.medications || []).filter((_, i) => i !== index)
    }));
  };

  const addEmergencyContact = () => {
    setProfile(prev => ({
      ...prev,
      emergency_contacts: [
        ...(prev.emergency_contacts || []),
        { name: '', relationship: '', phone: '' },
      ],
    }));
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    setProfile(prev => {
      const contacts = [...(prev.emergency_contacts || [])];
      contacts[index] = { ...contacts[index], [field]: value };
      return { ...prev, emergency_contacts: contacts };
    });
  };

  const removeEmergencyContact = (index: number) => {
    setProfile(prev => ({
      ...prev,
      emergency_contacts: (prev.emergency_contacts || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <AlertCircle className="text-blue-500" />
        Health Profile
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profile.full_name || ''}
            onChange={e => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={profile.date_of_birth || ''}
            onChange={e => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Blood Group
          </label>
          <select
            value={profile.blood_group || ''}
            onChange={e => setProfile(prev => ({ ...prev, blood_group: e.target.value }))}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Blood Pressure (mmHg)
          </label>
          <input
            type="text"
            value={profile.blood_pressure || ''}
            onChange={e => setProfile(prev => ({ ...prev, blood_pressure: e.target.value }))}
            placeholder="e.g., 120/80"
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Sugar Level (mg/dL)
          </label>
          <input
            type="text"
            value={profile.sugar_level || ''}
            onChange={e => setProfile(prev => ({ ...prev, sugar_level: e.target.value }))}
            placeholder="e.g., 100"
            className="w-full p-3 border rounded"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 font-bold mb-2">
          Medical Condition Details
        </label>
        <textarea
          value={profile.medical_condition_details || ''}
          onChange={e => setProfile(prev => ({ ...prev, medical_condition_details: e.target.value }))}
          className="w-full p-3 border rounded h-32"
          placeholder="Describe your medical conditions, history, and any important health information..."
        />
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 font-bold mb-2">Allergies</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Add allergy..."
          />
          <button
            type="button"
            onClick={addAllergy}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.allergies?.map((allergy, index) => (
            <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
              <span>{allergy}</span>
              <button
                type="button"
                onClick={() => removeAllergy(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 font-bold mb-2">Current Medications</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Add medication..."
          />
          <button
            type="button"
            onClick={addMedication}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.medications?.map((medication, index) => (
            <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
              <span>{medication}</span>
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Emergency Contacts</h3>
        {profile.emergency_contacts?.map((contact, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                value={contact.name}
                onChange={e => updateEmergencyContact(index, 'name', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Relationship</label>
              <input
                type="text"
                value={contact.relationship}
                onChange={e => updateEmergencyContact(index, 'relationship', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={e => updateEmergencyContact(index, 'phone', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => removeEmergencyContact(index)}
                className="absolute right-0 top-8 text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addEmergencyContact}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
        >
          <Plus size={20} />
          Add Emergency Contact
        </button>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}