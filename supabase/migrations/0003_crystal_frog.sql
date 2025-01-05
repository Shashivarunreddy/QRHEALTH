/*
  # Add public access policy for profiles

  1. Changes
    - Add policy to allow public read access to profiles
    - This enables QR code functionality by allowing anyone to view profile data
*/

-- Add policy for public read access to profiles
CREATE POLICY "Allow public read access to profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (true);