import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  userId: string;
}

export function QRCodeDisplay({ userId }: QRCodeProps) {
  // Ensure we use the full URL for the QR code
  const qrValue = `${window.location.origin}/profile/${userId}`;

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Health Profile QR Code</h2>
      <div className="p-4 bg-white rounded-lg border-2 border-gray-100">
        <QRCodeSVG
          value={qrValue}
          size={256}
          level="H"
          includeMargin
          className="w-full h-full"
        />
      </div>
      <p className="mt-4 text-gray-600 text-center">
        Scan this QR code to access your health profile in case of emergency
      </p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <p>Profile URL:</p>
        <a href={qrValue} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">
          {qrValue}
        </a>
      </div>
    </div>
  );
}