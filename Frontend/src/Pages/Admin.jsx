import Card from "../Components/Card";
import AdminNav from "../Components/AdminNav";
import graph from "../assets/graph.png";
import IncomeExpenseCard from "../Components/IncomeExpenseCard";

const Admin = () => {
  const skill = [
    {
      bg: "bg-blue-600",
      header: "Total Student Present Today",
      number: 450,
      index: 1,
    },
    { bg: "bg-green-600", header: "Total Staff Present", number: 52, index: 2 },
    {
      bg: "bg-purple-600",
      header: "Total Fees Collections",
      number: 45000,
      index: 3,
    },
    {
      bg: "bg-yellow-600",
      header: "Monthly fee Collections",
      number: "₹ 2,10,100",
      index: 4,
    },
    { bg: "bg-red-500", header: "Total Monthly Expense", number: 23, index: 5 },
    { bg: "bg-black", header: "Total Income", number: "₹ 45,700", index: 6 },
  ];
  return (
    <div className="select-none bg-[#F5F5F5] w-full h-max-full">
      <AdminNav />

      <div className=" flex flex-center justify-center mt-4 gap-3">
        <img src={graph} className="w-[2rem] h-[2rem]  " />
        <h1 className="text-zinc-800 font-mono font-bold text-2xl select-none">
          Welcome to Dashboard
        </h1>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 select-none ">
          {skill.map((item, index) => (
            <Card
              key={index}
              bg={item.bg}
              header={item.header}
              number={item.number}
            />
          ))}
        </div>
        <div>
          <IncomeExpenseCard />
        </div>
      </div>
    </div>
  );
};

export default Admin;
