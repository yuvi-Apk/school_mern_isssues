import React from "react";
import { useNavigate } from "react-router-dom";

const ActionCard = ({ title, buttons }) => {
  const navigate = useNavigate();

  const handleClick = (btn) => {
    const route = btn.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${route}`);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 transition-all border border-gray-200 hover:shadow-2xl hover:scale-[1.02] duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 tracking-wide">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={() => handleClick(btn)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-xl hover:scale-105 transform transition-all"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const actionCategories = [
    {
      category: "School Management",
      cards: [
        { title: "Admission", buttons: ["Adm. Enquiry", "Admission"] },
        { title: "Student", buttons: ["Std Details", "searchStudent"] },
      ],
    },
    {
      category: "Finance",
      cards: [
        { title: "Fees", buttons: ["Fees Dues", "Collect Fee"] },
        { title: "Fees Plan", buttons: ["One Time Fee", "Monthly Fee"] },
        { title: "Income/Expense", buttons: ["Income", "Expense"] },
      ],
    },
    {
      category: "Attendance",
      cards: [
        {
          title: "Attendance",
          buttons: ["Std-Attendance", "Staff Attendance"],
        },
      ],
    },
    {
      category: "Academics",
      cards: [
        { title: "Examinations", buttons: ["Admit Card", "Marksheet"] },
        { title: "Timetable", buttons: ["Class", "Teacher"] },
        { title: "Lesson Plan", buttons: ["Create", "View"] },
      ],
    },
    {
      category: "Communication",
      cards: [{ title: "Communicate", buttons: ["SMS", "Notice"] }],
    },
    {
      category: "Facilities",
      cards: [
        { title: "Transport/Hostel", buttons: ["Routes", "Hostel Rooms"] },
      ],
    },
    {
      category: "Reports",
      cards: [
        {
          title: "Financial Reports",
          buttons: ["Fees Report", "Collection Report"],
        },
        { title: "Academic Reports", buttons: ["Attendance", "Examinations"] },
        { title: "HR Reports", buttons: ["Staff", "Payroll"] },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-white py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        {/* <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-3">🎓 School Dashboard</h1>
          <p className="text-gray-600 text-lg">Quick access to all core modules and reports</p>
        </div> */}

        {/* Category Sections */}
        {actionCategories.map((category, idx) => (
          <section key={idx} className="mb-16">
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-6 bg-blue-600 mr-3 rounded"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                {category.category}
              </h2>
              <div className="flex-1 ml-4 h-px bg-gray-300"></div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.cards.map((card, index) => (
                <ActionCard
                  key={`${idx}-${index}`}
                  title={card.title}
                  buttons={card.buttons}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
