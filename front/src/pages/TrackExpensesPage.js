import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TrackExpensesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Header />
      <main className="p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Track Expenses</h1>
            <button
              onClick={() => navigate('/home')}
              className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
            >
              Back to Home
            </button>
          </div>

          <p className="text-gray-600 mb-6">This is a placeholder page. We'll add expense tracking features here later.</p>

          {/* Basic expense form scaffold */}
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Amount" type="number" className="p-2 border rounded" />
            <input placeholder="Category" type="text" className="p-2 border rounded" />
            <input placeholder="Date" type="date" className="p-2 border rounded" />
            <input placeholder="Note (optional)" type="text" className="p-2 border rounded" />
            <div className="sm:col-span-2 text-right">
              <button type="button" disabled className="px-4 py-2 bg-green-600 text-white rounded opacity-70 cursor-not-allowed">Add (disabled)</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
