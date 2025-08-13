import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import DashboardCards from "../Components/DashboardCards";

const PublicDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      
       
          <DashboardCards />
        
      
    </MainLayout>
  );
};

export default PublicDashboard;
