'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip } from 'chart.js';  // Import the necessary elements

// Register elements and scales
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip);

interface StockData {
  date: string;
  trade_code: string;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  // Add other chart options here
};

export default function Home() {
  const [datas, setDatas] = useState<StockData[]>([]);
  const [filteredData, setFilteredData] = useState<StockData[]>([]);  // To store filtered data
  const [searchQuery, setSearchQuery] = useState<string>('');  // To store the search query
  const [selectedTradeCode, setSelectedTradeCode] = useState<string>('');  // To store selected trade code
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch remote data
    fetch('https://raw.githubusercontent.com/nuresaba8/Janata_Wifi/refs/heads/main/stock_market_data.json')
      .then((res) => res.json())
      .then((data: StockData[]) => {
        const localData = JSON.parse(localStorage.getItem('stocks') || '[]');
        setDatas([...localData, ...data]); // Combine local and remote data
        setFilteredData([...localData, ...data]);  // Initialize filtered data
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Filter data based on search query and selected trade_code
  useEffect(() => {
    let filtered = datas;
    
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.trade_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.date.includes(searchQuery)
      );
    }
    
    if (selectedTradeCode) {
      filtered = filtered.filter(item => item.trade_code === selectedTradeCode);  // Filter by selected trade_code
    }

    setFilteredData(filtered);
  }, [searchQuery, selectedTradeCode, datas]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage * itemsPerPage < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDeleteBook = (date: string) => {
    // Filter out the data with the given date
    const updatedData = filteredData.filter((data) => data.date !== date);
    
    // Update the state with the filtered data
    setFilteredData(updatedData);

    // Also update the original data and localStorage
    const updatedOriginalData = datas.filter((data) => data.date !== date);
    setDatas(updatedOriginalData);
    localStorage.setItem('stocks', JSON.stringify(updatedOriginalData));
  };

  // Extract the unique trade codes for the dropdown
  const tradeCodes = Array.from(new Set(datas.map(data => data.trade_code)));

  // Function to download filtered data as CSV
  const downloadCSV = () => {
    const headers = ['Date', 'Trade Code', 'High', 'Low', 'Open', 'Close', 'Volume'];
    const rows = filteredData.map((data) => [
      data.date,
      data.trade_code,
      data.high,
      data.low,
      data.open,
      data.close,
      data.volume,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'stock_market_data.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Navigation Button */}
      <div className="mb-6">
        <Link href="/components/create">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Create New Data
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Trade Code or Date"
          className="border border-gray-300 p-2 rounded-md w-full"
        />
        <button onClick={() => setSearchQuery(searchQuery)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
          Search
        </button>
      </div>

      {/* Trade Code Dropdown */}
      <div className="mb-6">
        <select
          value={selectedTradeCode}
          onChange={(e) => setSelectedTradeCode(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full md:w-64"
        >
          <option value="">Select Trade Code</option>
          {tradeCodes.map((tradeCode, index) => (
            <option key={index} value={tradeCode}>
              {tradeCode}
            </option>
          ))}
        </select>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="font-semibold text-lg mb-4">Line Chart</div>
          <Line
            data={{
              labels: currentItems.map((data) => data.date),
              datasets: [
                {
                  label: 'Close',
                  data: currentItems.map((data) => data.close),
                  backgroundColor: '#064FF0',
                  borderColor: '#064FF0',
                },
              ],
            }}
            options={{
              elements: {
                line: {
                  tension: 0.5,
                },
              },
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="font-semibold text-lg mb-4">Bar Chart</div>
          <Bar
            data={{
              labels: currentItems.map((data) => data.date),
              datasets: [
                {
                  label: 'Volume',
                  data: currentItems.map((data) => data.volume),
                  backgroundColor: [
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(253, 135, 135, 0.8)',
                  ],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return `Volume: ${tooltipItem.raw}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Trade Code</th>
              <th className="border px-4 py-2 text-left">High</th>
              <th className="border px-4 py-2 text-left">Low</th>
              <th className="border px-4 py-2 text-left">Open</th>
              <th className="border px-4 py-2 text-left">Close</th>
              <th className="border px-4 py-2 text-left">Volume</th>
              <th className="border px-4 py-2 text-left" colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((data, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{data.date}</td>
                <td className="border px-4 py-2">{data.trade_code}</td>
                <td className="border px-4 py-2">{data.high}</td>
                <td className="border px-4 py-2">{data.low}</td>
                <td className="border px-4 py-2">{data.open}</td>
                <td className="border px-4 py-2">{data.close}</td>
                <td className="border px-4 py-2">{data.volume}</td>
                <td className="border px-4 py-2">
                  <Link href={`/components/update/${data.trade_code}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Edit
                    </button>
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteBook(data.date)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-300 px-4 py-2 rounded-md">
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage}</span>
        <button onClick={nextPage} disabled={currentPage * itemsPerPage >= filteredData.length} className="bg-gray-300 px-4 py-2 rounded-md">
          Next
        </button>
      </div>

      {/* Download CSV Button */}
      <div className="mt-6">
        <button onClick={downloadCSV} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
          Download CSV
        </button>
      </div>
    </div>
  );
}
