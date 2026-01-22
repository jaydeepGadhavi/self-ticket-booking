import { useEffect, useState } from "react";
import { Calendar, Clock, Ticket } from "lucide-react";
import { Apiservice } from "../../Services/ApiService";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(()=>{
      loadTickets()
    },[])

    const loadTickets = async() =>{
        const userData = JSON.parse(localStorage.getItem('authData'))
        const payload = {
            filter: {
                userId: userData.id
            }
        }
        const res = await Apiservice.post('ticket/filter',payload)
        setBookings(res.data)
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">My Bookings</h1>
                <p className="text-sm text-gray-500">
                    View all your booked tickets
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                    <div
                        key={booking.event.id}
                        className="border border-gray-100 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
                    >
                        <div className="mb-3">
                            <h2 className="font-semibold text-base">
                                {booking.event.title}
                            </h2>
                            <p className="text-xs text-gray-500">
                                Booking ID: {booking.event.id}
                            </p>
                        </div>

                        <div className="text-sm space-y-4">
                            <div className="bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center text-xs space-x-2">
                                    <Calendar size={14} className="text-orange-500" />
                                    <p>Date</p>
                                </div>
                                <p>{booking.event.date}</p>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center text-xs space-x-2">
                                    <Clock size={14} className="text-blue-500" />
                                    <p>Time</p>
                                </div>
                                <p>{booking.event.time}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-xs text-gray-600">Description</p>
                                <p>{booking.event.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {bookings.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                    No bookings found.
                </div>
            )}
        </div>
    );
};

export default MyBookings;
