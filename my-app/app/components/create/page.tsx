'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  date: string;
  trade_code: string;
  high: string;
  low: string;
  open: string;
  close: string;
  volume: string;
}

const Page = () => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    date: '',
    trade_code: '',
    high: '',
    low: '',
    open: '',
    close: '',
    volume: '',
  });

  // Stocks state (to display added data in first row)
  const [stocks, setStocks] = useState<FormData[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newData: FormData = {
      ...formData,
      date: new Date().toISOString(), // Set the current date in ISO format
    };

    // Retrieve existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem('stocks') || '[]');

    // Add new data to the beginning
    const updatedData = [newData, ...existingData];

    // Store in localStorage
    localStorage.setItem('stocks', JSON.stringify(updatedData));

    alert('Data added!');

    // Clear form
    setFormData({
      date: '',
      trade_code: '',
      high: '',
      low: '',
      open: '',
      close: '',
      volume: '',
    });

    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Create New Data Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="form-group">
          <label htmlFor="tradeCode" className="block text-sm font-medium text-gray-700">Trade Code</label>
          <input
            type="text"
            id="tradeCode"
            name="trade_code"
            value={formData.trade_code}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="high" className="block text-sm font-medium text-gray-700">High</label>
          <input
            type="number"
            id="high"
            name="high"
            value={formData.high}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="low" className="block text-sm font-medium text-gray-700">Low</label>
          <input
            type="number"
            id="low"
            name="low"
            value={formData.low}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="open" className="block text-sm font-medium text-gray-700">Open</label>
          <input
            type="number"
            id="open"
            name="open"
            value={formData.open}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="close" className="block text-sm font-medium text-gray-700">Close</label>
          <input
            type="number"
            id="close"
            name="close"
            value={formData.close}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="volume" className="block text-sm font-medium text-gray-700">Volume</label>
          <input
            type="number"
            id="volume"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Create
        </button>
      </form>

      {/* Display Added Data */}
      {stocks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Stock Data</h2>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b">Trade Code</th>
                <th className="px-4 py-2 text-left border-b">High</th>
                <th className="px-4 py-2 text-left border-b">Low</th>
                <th className="px-4 py-2 text-left border-b">Open</th>
                <th className="px-4 py-2 text-left border-b">Close</th>
                <th className="px-4 py-2 text-left border-b">Volume</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b">{stock.trade_code}</td>
                  <td className="px-4 py-2 border-b">{stock.high}</td>
                  <td className="px-4 py-2 border-b">{stock.low}</td>
                  <td className="px-4 py-2 border-b">{stock.open}</td>
                  <td className="px-4 py-2 border-b">{stock.close}</td>
                  <td className="px-4 py-2 border-b">{stock.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;
