'use client';

import { useEffect, useState } from 'react';

// Definim interfața pentru datele de geolocalizare
interface GeoData {
  timestamp: string;
  ip: string;
  headers: Record<string, string>;
  geo: {
    country: string;
    region: string;
    city: string;
  };
  detection: {
    countryCode: string;
    expectedLocale: string | null;
    finalLocale: string;
  };
}

export default function GeoDebugPage() {
  const [data, setData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGeoData() {
      try {
        setLoading(true);
        const response = await fetch('/api/debug-geo');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const geoData = await response.json();
        setData(geoData);
      } catch (err) {
        setError('A apărut o eroare la încărcarea datelor de geolocalizare');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGeoData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Încărcare date geolocalizare...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Informații Geolocalizare</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl mb-2">IP și Timestamp:</h2>
        <p><strong>IP:</strong> {data?.ip}</p>
        <p><strong>Timestamp:</strong> {data?.timestamp}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl mb-2">Informații Geo:</h2>
        <p><strong>Țară:</strong> {data?.geo.country}</p>
        <p><strong>Regiune:</strong> {data?.geo.region}</p>
        <p><strong>Oraș:</strong> {data?.geo.city}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl mb-2">Detecție Limbă:</h2>
        <p><strong>Cod Țară:</strong> {data?.detection.countryCode}</p>
        <p><strong>Limba Așteptată:</strong> {data?.detection.expectedLocale || 'necunoscută'}</p>
        <p><strong>Limba Finală:</strong> {data?.detection.finalLocale}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Toate Headerele:</h2>
        <pre className="whitespace-pre-wrap bg-white p-2 rounded border">
          {JSON.stringify(data?.headers, null, 2)}
        </pre>
      </div>
    </div>
  );
}
