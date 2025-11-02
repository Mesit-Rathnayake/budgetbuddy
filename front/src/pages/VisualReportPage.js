import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function VisualReportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Header />
      <main className="p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Visual Reports</h1>
            <button
              onClick={() => navigate('/home')}
              className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
            >
              Back to Home
            </button>
          </div>

          <p className="text-gray-600 mb-6">This is a placeholder page. Charts and visual reports will appear here later.</p>

          {/* Chart placeholder */}
          <div className="h-64 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <span className="text-lg">[Chart placeholder]</span>
          </div>
        </div>
      </main>
    </div>
  );
}
