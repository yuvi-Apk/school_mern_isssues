import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, IndianRupee, CalendarCheck2 } from "lucide-react";
import Port from "../Components/link.js"
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${Port}/api/dashboard`);
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6 text-blue-500 animate-pulse">Loading Dashboard...</p>;

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-8 tracking-tight">School Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card
          icon={<Users className="text-blue-600 w-10 h-10" />}
          title="Total Students"
          value={data?.totalStudents}
          color="bg-blue-100"
        />
        <Card
          icon={<IndianRupee className="text-green-600 w-10 h-10" />}
          title="Total Fees Collected"
          value={`₹${(data?.totalFeesCollected || 0).toLocaleString("en-IN")}`}
          color="bg-green-100"
        />
        <Card
          icon={<CalendarCheck2 className="text-yellow-600 w-10 h-10" />}
          title="Attendance"
          value={`${data?.totalAttendance}%`}
          color="bg-yellow-100"
        />
      </div>
    </div>
  );
};

const Card = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-in-out">
    <div className={`${color} p-5 rounded-full shadow-inner`}>{icon}</div>
    <div>
      <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
      <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
    </div>
  </div>
);

export default Dashboard;
