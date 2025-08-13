import React from "react";
import grap from "../assets/graph_1378621.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const IncomeExpenseCard = () => {
  const fullData = [
    { name: "Jan", income: 4000, expense: 2400 },
    { name: "Feb", income: 3000, expense: 1398 },
    { name: "Mar", income: 8000, expense: 3800 },
    { name: "Apr", income: 2780, expense: 3908 },
    { name: "May", income: 1890, expense: 4800 },
    { name: "Jun", income: 2390, expense: 3800 },
    { name: "Jul", income: 3490, expense: 4300 },
    { name: "Aug", income: 4200, expense: 2900 },
    { name: "Sep", income: 3800, expense: 2100 },
    { name: "Oct", income: 4500, expense: 2700 },
    { name: "Nov", income: 3900, expense: 3200 },
    { name: "Dec", income: 5000, expense: 2500 },
  ];

  const data = fullData.slice(0, 5);

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl m-6 max-w-4xl mx-auto  ">
      <h2 className="text-2xl font-bold text-start mb-6 text-gray-800 flex gap-2">
        <img src={grap} className="w-[2rem] h-[2rem]" /> Income v/s Expense -
        Last 5 Months
      </h2>
      <div className="flex items-center justify-center gap-2 ml-4">
        <div className="inline-block w-6 h-4 bg-blue-500 rounded"></div>
        <span className="text-lg font-normal">Expense</span>
        <div className="inline-block w-6 h-4 bg-red-500 rounded ml-2"></div>
        <span className="text-lg font-normal">Income</span>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "#9e9e9e" }}
          />

          <YAxis tickLine={false} axisLine={{ stroke: "#9e9e9e" }} />

          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ fontWeight: "bold", color: "#333" }}
            itemStyle={{ padding: "2px 0" }}
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          />

          <Legend wrapperStyle={{ paddingTop: "20px" }} />

          <Bar dataKey="income" fill="#ef4444" name="Income" />

          <Bar dataKey="expense" fill="#3b82f6" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseCard;
