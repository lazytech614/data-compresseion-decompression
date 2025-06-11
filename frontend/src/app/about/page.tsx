"use client";

import { useEffect, useState } from 'react';
import { fetchAlgorithms } from '../../../utils/api';

export default function About() {
  const [algorithms, setAlgorithms] = useState([]);

  useEffect(() => {
    fetchAlgorithms()
      .then((list) => setAlgorithms(list))
      .catch((err) => console.error(err));
  }, []);

  console.log(algorithms);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6">Compression Algorithms Overview</h1>
      <div className="max-w-2xl space-y-6">
        {algorithms.map((algo) => (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-medium">Algo name</h2>
            <p className="mt-2">Algo desc</p>
          </div>
        ))}
      </div>
    </div>
  );
}
