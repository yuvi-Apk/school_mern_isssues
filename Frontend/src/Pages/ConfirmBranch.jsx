import { useLocation, useNavigate } from "react-router-dom";

const ConfirmBranch = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="mb-4">No data submitted</p>
          <button
            onClick={() => navigate("/add-branch")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-center mb-6">
          Submitted Branch Details
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <p className="font-medium">Branch Name:</p>
            <p>{state.branchName}</p>
          </div>
          <div>
            <p className="font-medium">Address:</p>
            <p className="whitespace-pre-line">{state.address}</p>
          </div>
          <div>
            <p className="font-medium">Access Code:</p>
            <p>{state.accessCode}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/public")}
          className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Return to Form
        </button>
      </div>
    </div>
  );
};

export default ConfirmBranch;
