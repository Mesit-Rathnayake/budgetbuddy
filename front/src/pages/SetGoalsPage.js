import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SetGoalsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Header />
      <main className="p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Set Goals</h1>
            <button
              onClick={() => navigate('/home')}
              className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
            >
              Back to Home
            </button>
          </div>

          <p className="text-gray-600 mb-6">This is a placeholder page. Goal creation and tracking will be implemented here later.</p>

          {/* Basic goal form scaffold */}
          <form className="grid grid-cols-1 gap-4 max-w-md">
            <input placeholder="Goal name" type="text" className="p-2 border rounded" />
            <input placeholder="Target amount" type="number" className="p-2 border rounded" />
            <input placeholder="Target date" type="date" className="p-2 border rounded" />
            <div className="text-right">
              <button type="button" disabled className="px-4 py-2 bg-indigo-600 text-white rounded opacity-70 cursor-not-allowed">Save (disabled)</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
