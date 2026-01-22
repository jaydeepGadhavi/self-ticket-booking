import { CalendarCheck, DollarSign } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { Apiservice } from "../../services/Apiservice";

const AdminDashboard = () => {

  /* ---------------- UI STATS ---------------- */
  const [dashBoardStatasctics, setDashBoardStatistics] = useState([]);

  /* ---------------- CHART STATES ---------------- */
  const [bookingCount, setBookingCount] = useState([]);
  const [bookingCapacity, setBookingCapacity] = useState([]);
  const [cancelCount, setCancelledCount] = useState([]);
  const [bookingRevenue, setBookingRevenue] = useState([]);
  const [eventStatus, setEventStatus] = useState([]);

  /* ---------------- API CALL ---------------- */
  const loadEvents = async () => {
    try {
      const res = await Apiservice.get("event/dashboard");
      const data = res.data

      /* ---------- STATS ---------- */
      setDashBoardStatistics([
        {
          id: 1,
          title: "Total Tickets Sold",
          value: data.totalTicketsSold,
          bg: "bg-orange-50",
          iconBg: "bg-orange-500",
          icon: CalendarCheck,
        },
        {
          id: 2,
          title: "Total Revenue",
          value: `₹${data.totalRevenue}`,
          bg: "bg-green-50",
          iconBg: "bg-green-500",
          icon: DollarSign,
        },
        
      ]);

      /* ---------- BAR CHART DATA ---------- */
      setBookingCount(
        data.events.map((e) => ({
          name: `${e.title} #${e.id}`,
          y: Number(e.bookingCount),
        }))
      );

      setBookingCapacity(
        data.events.map((e) => ({
          name: `${e.title} #${e.id}`,
          y: e.capacity,
        }))
      );

      setCancelledCount(
        data.events.map((e) => ({
          name: `${e.title} #${e.id}`,
          y: Number(e.cancelledCount),
        }))
      );

      setBookingRevenue(
        data.events.map((e) => ({
          name: `${e.title} #${e.id}`,
          y: e.bookingRevenue,
        }))
      );

      /* ---------- PIE CHART DATA ---------- */
      const activeCount = data.events.filter(e => e.active).length;
      const inactiveCount = data.events.length - activeCount;

      setEventStatus([
        { name: "ACTIVE", y: activeCount },
        { name: "INACTIVE", y: inactiveCount },
      ]);

    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* ---------------- CHART OPTIONS ---------------- */
  const barChartOptions = {
    chart: { type: "column" },
    title: { text: null },
    credits: { enabled: false },
    xAxis: {
      categories: bookingRevenue.map((item) => item.name),
    },
    yAxis: {
      min: 0,
      title: { text: "Values" },
    },
    series: [
      { name: "Bookings", data: bookingCount },
      { name: "Capacity", data: bookingCapacity },
      { name: "Cancelled", data: cancelCount },
      { name: "Revenue", data: bookingRevenue },
    ],
  };

  const pieChartOptions = {
    chart: { type: "pie" },
    title: { text: "" },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: "60%",
        dataLabels: { enabled: true },
      },
    },
    series: [{ name: "Events", data: eventStatus }],
  };

  return (
    <div className="w-full p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage your ticket booking system
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dashBoardStatasctics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`${item.bg} rounded-2xl shadow-sm p-5 flex justify-between items-center hover:shadow-md`}
            >
              <div className="w-full">
                <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center mb-2`}>
                  <Icon className="text-white" size={20} />
                </div>
                <p className="text-sm text-gray-600">{item.title}</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {item.value}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BAR CHART */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-800">Event Bookings</h3>
          <p className="text-sm text-gray-500 mb-4">Top performing events</p>

          {bookingCount.length === 0 ? (
            <p className="flex items-center justify-center min-h-[300px] text-gray-400">
              No Data Available
            </p>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
          )}
        </div>

        {/* PIE CHART */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-800">Event Status</h3>
          <p className="text-sm text-gray-500 mb-4">Distribution overview</p>
          <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
