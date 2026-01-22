import { useEffect, useState } from "react";
import { Pencil, XCircle, Download, ChevronDown, Search } from "lucide-react";
import { Apiservice } from "../../Services/ApiService";

export default function ManageBookings() {
  // Static mock data
  const [bookings, setBookings] = useState([]);

  // UI Logic States (No Functional Logic)
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(()=>{
    loadTickets()
  },[searchTerm])

  const loadTickets = async() => {
    const payload = {
      filter: {
        search: searchTerm
      }
    }
    const res = await Apiservice.post('ticket/filter',payload)
    console.log(res);
    setBookings(res.data)
  }

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
        <p className="text-gray-500 mt-1">
          View, create, and manage all ticket bookings
        </p>
      </div>

      {/* Filters (Visual Only) */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 w-full">

          {/* Search Icon */}
          <button
            className="cursor-pointer relative left-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow-md transition"
          >
            <Search size={16} />
          </button>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by ID, user, or event..."
            className="px-5 py-2 pr-12 rounded-full border border-gray-200 bg-white shadow-sm w-72 focus:outline-none focus:ring-2 focus:ring-orange-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-t-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-gray-800 font-semibold">
            <tr>
              <th className="p-4 text-left">Booking ID</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Time</th>
              <th className="p-4 text-left">Tickets</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.event.id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-600">#{booking.event.id}</td>
                <td className="p-4 font-medium text-gray-900">{booking.user.name}</td>
                <td className="p-4 text-gray-600">{booking.event.title}</td>
                <td className="p-4 text-gray-600">{booking.event.date}</td>
                <td className="p-4 text-gray-600">{booking.event.time}</td>
                <td className="p-4 text-gray-600">
                {booking.seats.map((seat, index) => (
                  <span key={index} className="mr-2">
                    {seat}
                  </span>
                ))}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
