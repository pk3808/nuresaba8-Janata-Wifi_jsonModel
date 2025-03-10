'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface StockData {
  date: string;
  trade_code: string;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
}

export default function Page() {
  const router = useRouter();
  const { date } = useParams();
  const [stock, setStock] = useState<StockData | null>(null);

  useEffect(() => {
    if (date) {
      const storedData = JSON.parse(localStorage.getItem('stocks') || '[]');
      const stockToEdit = storedData.find((item: StockData) => item.date === date);
      if (stockToEdit) {
        setStock(stockToEdit);
      }
    }
  }, [date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (stock) {
      setStock({
        ...stock,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (stock) {
      const storedData = JSON.parse(localStorage.getItem('stocks') || '[]');
      const updatedData = storedData.map((item: StockData) =>
        item.date === stock.date ? stock : item
      );

      // Update the state and localStorage
      setStock(stock);
      localStorage.setItem('stocks', JSON.stringify(updatedData));
      
      // Redirect back to the home page after updating
      router.push('/');
    }
  };

  if (!stock) {
    return <div className="text-center text-xl font-medium">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit Stock Data for {stock.date}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="trade_code" className="mb-1 text-lg">Trade Code:</label>
          <input
            type="text"
            name="trade_code"
            value={stock.trade_code}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="high" className="mb-1 text-lg">High:</label>
          <input
            type="number"
            name="high"
            value={stock.high}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="low" className="mb-1 text-lg">Low:</label>
          <input
            type="number"
            name="low"
            value={stock.low}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="open" className="mb-1 text-lg">Open:</label>
          <input
            type="number"
            name="open"
            value={stock.open}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="close" className="mb-1 text-lg">Close:</label>
          <input
            type="number"
            name="close"
            value={stock.close}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="volume" className="mb-1 text-lg">Volume:</label>
          <input
            type="number"
            name="volume"
            value={stock.volume}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Update
        </button>
      </form>
    </div>
  );
}
