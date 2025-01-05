/*
  # Add Health Fields to Profiles Table

  1. Changes
    - Add blood_pressure column
    - Add sugar_level column
    - Add medical_condition_details column

  2. Description
    This migration adds new health-related fields to the profiles table to store
    blood pressure readings, sugar levels, and detailed medical condition descriptions.
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'blood_pressure'
  ) THEN
    ALTER TABLE profiles ADD COLUMN blood_pressure text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'sugar_level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN sugar_level text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'medical_condition_details'
  ) THEN
    ALTER TABLE profiles ADD COLUMN medical_condition_details text;
  END IF;
END $$;