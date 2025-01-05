import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile';
import { Activity, Phone, User, Heart, Pill, AlertCircle } from 'lucide-react';

export function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError('Profile not found or inaccessible');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin">
          <Activity size={32} className="text-blue-500" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">{error || 'Unable to load profile'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-blue-500" />
            Emergency Health Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-gray-700">Full Name</h3>
            <p className="text-xl">{profile.full_name}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Date of Birth</h3>
            <p className="text-xl">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Blood Group</h3>
            <p className="text-xl">{profile.blood_group}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Blood Pressure</h3>
            <p className="text-xl">{profile.blood_pressure || 'Not specified'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Sugar Level</h3>
            <p className="text-xl">{profile.sugar_level || 'Not specified'}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="text-red-500" />
            Medical Information
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Medical Conditions</h3>
            <p className="whitespace-pre-wrap mb-4">{profile.medical_condition_details || 'None specified'}</p>
            
            <h3 className="font-semibold text-gray-700 mb-2">Allergies</h3>
            <ul className="list-disc list-inside mb-4">
              {profile.allergies && profile.allergies.length > 0 ? 
                profile.allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                )) : 
                <li>None specified</li>
              }
            </ul>

            <h3 className="font-semibold text-gray-700 mb-2">Current Medications</h3>
            <ul className="list-disc list-inside">
              {profile.medications && profile.medications.length > 0 ? 
                profile.medications.map((medication, index) => (
                  <li key={index}>{medication}</li>
                )) : 
                <li>None specified</li>
              }
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Phone className="text-green-500" />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {profile.emergency_contacts && profile.emergency_contacts.length > 0 ? (
              profile.emergency_contacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-gray-600">{contact.relationship}</p>
                  <p className="text-blue-600">{contact.phone}</p>
                </div>
              ))
            ) : (
              <p>No emergency contacts specified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}