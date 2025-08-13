import { useState, useEffect } from "react";
import Port from "../Components/link.js";
import { FiSearch, FiDownload } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import "../index.css";
import MainLayout from "../layout/MainLayout.jsx";

const StudentAdmissionForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [classesWithSections, setClassesWithSections] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  const [customCategories, setCustomCategories] = useState([
    "New Student",
    "Old Student",
    "General",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [formData, setFormData] = useState({
    admissionNumber: "",
    admissionDate: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    class: "",
    routeName: "",
    section: "",
    house: "",
    rollNo: "",
    email: "",
    bloodGroup: "",
    gender: "",
    height: "",
    weight: "",
    category: "",
    religion: "",
    caste: "",
    asOnDate: "",
    routeList: "",
    penNo: "",
    aparId: "",
    fatherName: "",
    fatherPhoneNumber: "",
    fatherOccupation: "",
    fatherQualification: "",
    fatherAdharNo: "",
    fatherImage: null,
    motherName: "",
    motherPhoneNumber: "",
    motherOccupation: "",
    motherAdharNo: "",
    motherImage: null,
    guardianName: "",
    guardianRelation: "",
    guardianEmail: "",
    guardianOccupation: "",
    oneTimeFee: "",
    monthlyFee: "",
    currentAddress: "",
    permanentAddress: "",
    hostel: "",
    roomNo: "",
    bankAccountNo: "",
    bankName: "",
    ifscCode: "",
    adharNo: "",
    localIdentificationNo: "",
    previousSchoolDetails: "",
    note: "",
    documents: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const classesResponse = await axios.get(
          `${Port}/api/classes/with-sections`
        );
        setClassesWithSections(classesResponse.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load initial data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (classesWithSections.length > 0) {
      if (formData.class) {
        const selectedClass = classesWithSections.find(
          (cls) => cls.name === formData.class
        );

        if (selectedClass) {
          setAvailableSections(selectedClass.sections);
          if (
            formData.section &&
            !selectedClass.sections.includes(formData.section)
          ) {
            setFormData((prev) => ({ ...prev, section: "" }));
          }
        } else {
          setFormData((prev) => ({ ...prev, class: "", section: "" }));
          setAvailableSections([]);
        }
      } else {
        setAvailableSections([]);
      }
    }
  }, [formData.class, classesWithSections, formData.section]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "admissionNumber",
      "admissionDate",
      "firstName",
      "lastName",
      "dob",
      "class",
      "section",
      "rollNo",
     
      "gender",
      "fatherName",
      "fatherPhoneNumber",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const phoneFields = ["fatherPhoneNumber", "motherPhoneNumber"];
    phoneFields.forEach((field) => {
      if (formData[field] && !/^[0-9]{10}$/.test(formData[field])) {
        newErrors[field] = "Phone number must be 10 digits";
      }
    });

    const validateImage = (file, fieldName) => {
      if (file && !file.type.match(/image\/(jpeg|png)/)) {
        newErrors[fieldName] = "Only JPEG/PNG images allowed";
      }
    };

    validateImage(formData.fatherImage, "fatherImage");
    validateImage(formData.motherImage, "motherImage");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data } = await axios.get(`${Port}/routes`);
        setRoutes(data);
      } catch (err) {
        console.error("Failed to fetch routes:", err);
      }
    };
    fetchRoutes();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file) {
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
          setErrors((prev) => ({
            ...prev,
            [name]: "File size must be less than 5MB",
          }));
          return;
        }

        if (name.includes("Image") && !file.type.match(/image\/(jpeg|png)/)) {
          setErrors((prev) => ({
            ...prev,
            [name]: "Only JPEG/PNG images allowed",
          }));
          return;
        }

        if (name === "documents") {
          const validTypes = ["application/pdf", "image/jpeg", "image/png"];
          const invalidFiles = Array.from(files).filter(
            (f) => !validTypes.includes(f.type)
          );
          if (invalidFiles.length > 0) {
            setErrors((prev) => ({
              ...prev,
              documents: "Only PDF, JPG, or PNG files allowed",
            }));
            return;
          }
        }
      }

      setFormData({
        ...formData,
        [name]: name === "documents" ? Array.from(files) : files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const MAX_SIZE = 5 * 1024 * 1024;

    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type) || file.size > MAX_SIZE
    );

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        documents: "Only PDF, JPG, or PNG files under 5MB allowed",
      }));
      return;
    }

    setFormData({
      ...formData,
      documents: [...formData.documents, ...files],
    });

    if (errors.documents) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.documents;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setSubmitStatus(null);
      setError(null);

      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (
          key !== "fatherImage" &&
          key !== "motherImage" &&
          key !== "documents"
        ) {
          const fieldValue = value === undefined || value === null ? "" : value;
          if (key === "class") {
            formDataToSend.append("class", formData.class || "");
          } else {
            formDataToSend.append(key, fieldValue);
          }
        }
      });

      if (formData.fatherImage instanceof File) {
        formDataToSend.append("fatherImage", formData.fatherImage);
      }
      if (formData.motherImage instanceof File) {
        formDataToSend.append("motherImage", formData.motherImage);
      }

      if (Array.isArray(formData.documents)) {
        formData.documents.forEach((file) => {
          if (file instanceof File) {
            formDataToSend.append("documents", file);
          }
        });
      }

      const response = await axios.post(
        `${Port}/api/students/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      if (response.data.success) {
        setSubmitStatus("success");
        setFormData({
          admissionNumber: "",
          admissionDate: "",
          firstName: "",
          middleName: "",
          lastName: "",
          dob: "",
          class: "",
          section: "",
          house: "",
          rollNo: "",
          routeName: "",
          email: "",
          bloodGroup: "",
          gender: "",
          height: "",
          weight: "",
          category: "",
          religion: "",
          caste: "",
          asOnDate: "",
          routeList: "",
          penNo: "",
          aparId: "",
          fatherName: "",
          fatherPhoneNumber: "",
          fatherOccupation: "",
          fatherQualification: "",
          fatherAdharNo: "",
          fatherImage: null,
          motherName: "",
          motherPhoneNumber: "",
          motherOccupation: "",
          motherAdharNo: "",
          motherImage: null,
          guardianName: "",
          guardianRelation: "",
          guardianEmail: "",
          guardianOccupation: "",
          oneTimeFee: "",
          monthlyFee: "",
          currentAddress: "",
          permanentAddress: "",
          hostel: "",
          roomNo: "",
          bankAccountNo: "",
          bankName: "",
          ifscCode: "",
          adharNo: "",
          localIdentificationNo: "",
          previousSchoolDetails: "",
          note: "",
          documents: [],
        });
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");

      let errorMessage = "Submission failed. Please try again.";

      if (error.response) {
        errorMessage = error.response.data?.error || error.response.statusText;
        if (error.response.data?.details) {
          if (Array.isArray(error.response.data.details)) {
            errorMessage += `: ${error.response.data.details.join(", ")}`;
          } else {
            errorMessage += `: ${JSON.stringify(error.response.data.details)}`;
          }
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your network connection.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timeout. Please try again.";
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  if (isLoading && !submitStatus) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-pulse">
          <svg
            className="w-16 h-16 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">
          Loading Student Admission Form
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MainLayout>
        <div className="">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Student Admission
              </h1>
              <p className="text-gray-600 mt-1">
                Add new students to the school system
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                <FiSearch className="mr-2" /> Search Student
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                <FiDownload className="mr-2" /> Import Students
              </button>
            </div>
          </div>

          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <div className="font-bold">✓ Success</div>
              <p>Student admission submitted successfully!</p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div className="font-bold">⚠️ Error</div>
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-green-500 p-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Basic Information
              </h2>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  {
                    id: "admissionNumber",
                    label: "Admission Number",
                    type: "text",
                    name: "admissionNumber",
                    required: true,
                  },
                  {
                    id: "admissionDate",
                    label: "Admission Date",
                    type: "date",
                    name: "admissionDate",
                    required: true,
                  },
                  {
                    id: "firstName",
                    label: "First Name",
                    name: "firstName",
                    required: true,
                  },
                  {
                    id: "middleName",
                    label: "Middle Name",
                    name: "middleName",
                  },
                  {
                    id: "lastName",
                    label: "Last Name",
                    name: "lastName",
                    required: true,
                  },
                  {
                    id: "dob",
                    label: "Date of Birth",
                    type: "date",
                    name: "dob",
                    required: true,
                  },
                  {
                    id: "class",
                    label: "Class",
                    name: "class",
                    required: true,
                    type: "select",
                    options: classesWithSections.map((cls) => ({
                      value: cls.name,
                      label: cls.name,
                    })),
                  },
                  {
                    id: "section",
                    label: "Section",
                    name: "section",
                    required: true,
                    type: "select",
                    options: availableSections.map((sec) => ({
                      value: sec,
                      label: sec,
                    })),
                  },
                  { id: "house", label: "House", name: "house" },
                  {
                    id: "rollNo",
                    label: "Roll Number",
                    name: "rollNo",
                    required: true,
                  },
                  { id: "email", label: "Email", type: "email", name: "email" },
                  {
                    id: "bloodGroup",
                    label: "Blood Group",
                    name: "bloodGroup",
                  },
                  {
                    id: "gender",
                    label: "Gender",
                    name: "gender",
                    required: true,
                  },
                  {
                    id: "height",
                    label: "Height (cm)",
                    type: "number",
                    name: "height",
                  },
                  {
                    id: "weight",
                    label: "Weight (kg)",
                    type: "number",
                    name: "weight",
                  },
                  {
                    id: "category",
                    label: "Category",
                    name: "category",
                    type: "select",
                    options: customCategories.map((cat) => ({
                      value: cat,
                      label: cat,
                    })),
                    additionalContent: (
                      <div className="mt-2">
                        {showAddCategory ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              placeholder="Enter new category"
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  newCategory.trim() &&
                                  !customCategories.includes(newCategory.trim())
                                ) {
                                  setCustomCategories([
                                    ...customCategories,
                                    newCategory.trim(),
                                  ]);
                                  setFormData((prev) => ({
                                    ...prev,
                                    category: newCategory.trim(),
                                  }));
                                }
                                setNewCategory("");
                                setShowAddCategory(false);
                              }}
                              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddCategory(false)}
                              className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowAddCategory(true)}
                            className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                          >
                            + Add New Category
                          </button>
                        )}
                      </div>
                    ),
                  },
                  { id: "religion", label: "Religion", name: "religion" },
                  { id: "caste", label: "Caste", name: "caste" },
                  {
                    id: "asOnDate",
                    label: "As On Date",
                    type: "date",
                    name: "asOnDate",
                  },
                  {
                    id: "routeList",
                    label: "Route List",
                    name: "routeName",
                    type: "select",
                    options: [
                      { value: "", label: "" },
                      ...routes.map((route) => ({
                        value: route.route_name,
                        label: route.route_name,
                      })),
                    ],
                    additionalContent: (
                      <div className="flex space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() => window.location.replace(`/routes`)}
                          className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200"
                        >
                          ➕
                        </button>
                      </div>
                    ),
                  },
                  { id: "penNo", label: "Pen No", name: "penNo" },
                  { id: "aparId", label: "Apar ID", name: "aparId" },
                ].map(
                  ({
                    id,
                    label,
                    type = "text",
                    name,
                    required = false,
                    options,
                    disabled = false,
                    additionalContent,
                  }) => (
                    <div key={id} className="space-y-1">
                      <label
                        htmlFor={id}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                      </label>

                      {type === "select" ? (
                        <div>
                          <select
                            id={id}
                            name={name}
                            className={`w-full px-3 py-2 border ${
                              errors[name]
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                              disabled ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                            required={required}
                            value={formData[name] || ""}
                            onChange={handleChange}
                            disabled={disabled}
                          >
                            <option value="">Select {label}</option>
                            {options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {additionalContent}
                        </div>
                      ) : (
                        <input
                          type={type}
                          id={id}
                          name={name}
                          className={`w-full px-3 py-2 border ${
                            errors[name] ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                          required={required}
                          value={formData[name] || ""}
                          onChange={handleChange}
                        />
                      )}

                      {errors[name] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[name]}
                        </p>
                      )}
                    </div>
                  )
                )}

                <div className="bg-gray-100 border-b-2 border-green-500 rounded-lg overflow-hidden mt-6 mb-6 w-full col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Parents/Guardian Details
                    </h2>
                  </div>
                </div>

                {[
                  {
                    id: "fatherName",
                    label: "Father's Name",
                    name: "fatherName",
                    required: true,
                  },
                  {
                    id: "fatherPhoneNumber",
                    label: "Phone",
                    name: "fatherPhoneNumber",
                    required: true,
                  },
                  {
                    id: "fatherOccupation",
                    label: "Occupation",
                    name: "fatherOccupation",
                  },
                  {
                    id: "fatherQualification",
                    label: "Qualification",
                    name: "fatherQualification",
                  },
                  {
                    id: "fatherAdharNo",
                    label: "Aadhar No",
                    name: "fatherAdharNo",
                  },
                  {
                    id: "fatherImage",
                    label: "Father Image",
                    type: "file",
                    name: "fatherImage",
                    accept: "image/*",
                  },
                  {
                    id: "motherName",
                    label: "Mother's Name",
                    name: "motherName",
                  },
                  {
                    id: "motherPhoneNumber",
                    label: "Phone",
                    name: "motherPhoneNumber",
                  },
                  {
                    id: "motherOccupation",
                    label: "Occupation",
                    name: "motherOccupation",
                  },
                  {
                    id: "motherAdharNo",
                    label: "Aadhar No",
                    name: "motherAdharNo",
                  },
                  {
                    id: "motherImage",
                    label: "Mother Image",
                    type: "file",
                    name: "motherImage",
                    accept: "image/*",
                  },
                  {
                    id: "guardianName",
                    label: "Guardian Name",
                    name: "guardianName",
                  },
                  {
                    id: "guardianRelation",
                    label: "Relation",
                    name: "guardianRelation",
                  },
                  {
                    id: "guardianEmail",
                    label: "Email",
                    type: "email",
                    name: "guardianEmail",
                  },
                  {
                    id: "guardianOccupation",
                    label: "Occupation",
                    name: "guardianOccupation",
                  },
                ].map(
                  ({
                    id,
                    label,
                    type = "text",
                    name,
                    required = false,
                    accept,
                  }) => (
                    <div key={id} className="space-y-1">
                      <label
                        htmlFor={id}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                      </label>
                      {type === "file" ? (
                        <>
                          <input
                            type={type}
                            id={id}
                            name={name}
                            accept={accept}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            onChange={handleChange}
                          />
                          {formData[name] && (
                            <p className="text-sm text-gray-600 mt-1">
                              Selected: {formData[name].name}
                            </p>
                          )}
                        </>
                      ) : (
                        <input
                          type={type}
                          id={id}
                          name={name}
                          className={`w-full px-3 py-2 border ${
                            errors[name] ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                          required={required}
                          value={formData[name] || ""}
                          onChange={handleChange}
                        />
                      )}
                      {errors[name] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[name]}
                        </p>
                      )}
                    </div>
                  )
                )}

                <div className="bg-gray-100 border-b-2 border-green-500 rounded-lg overflow-hidden mt-6 mb-6 w-full col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Fee Details
                    </h2>
                  </div>
                </div>

                {[
                  {
                    id: "oneTimeFee",
                    label: "One Time Fee",
                    type: "number",
                    name: "oneTimeFee",
                  },
                  {
                    id: "monthlyFee",
                    label: "Monthly Fee",
                    type: "number",
                    name: "monthlyFee",
                  },
                ].map(
                  ({ id, label, type = "text", name, required = false }) => (
                    <div key={id} className="space-y-1">
                      <label
                        htmlFor={id}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={type}
                        id={id}
                        name={name}
                        className={`w-full px-3 py-2 border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                        required={required}
                        value={formData[name] || ""}
                        onChange={handleChange}
                      />
                      {errors[name] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[name]}
                        </p>
                      )}
                    </div>
                  )
                )}

                <div className="bg-gray-100 border-b-2 border-green-500 rounded-lg overflow-hidden mt-6 mb-6 w-full col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Student Address Details
                    </h2>
                  </div>
                </div>

                {[
                  {
                    id: "currentAddress",
                    label: "Current Address",
                    type: "text",
                    name: "currentAddress",
                    textarea: true,
                  },
                  {
                    id: "permanentAddress",
                    label: "Permanent Address",
                    name: "permanentAddress",
                    textarea: true,
                  },
                ].map(({ id, label, name, textarea }) => (
                  <div
                    key={id}
                    className={`space-y-1 ${
                      textarea ? "col-span-1 md:col-span-2 lg:col-span-3" : ""
                    }`}
                  >
                    <label
                      htmlFor={id}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    {textarea ? (
                      <textarea
                        id={id}
                        name={name}
                        rows="3"
                        className={`w-full px-3 py-2 border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                        value={formData[name] || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      <input
                        type="text"
                        id={id}
                        name={name}
                        className={`w-full px-3 py-2 border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                        value={formData[name] || ""}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}

                <div className="bg-gray-100 border-b-2 border-green-500 rounded-lg overflow-hidden mt-6 mb-6 w-full col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Hostel Details
                    </h2>
                  </div>
                </div>

                {[
                  { id: "hostel", label: "Hostel", name: "hostel" },
                  { id: "roomNo", label: "Room No", name: "roomNo" },
                ].map(({ id, label, name }) => (
                  <div key={id} className="space-y-1">
                    <label
                      htmlFor={id}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      id={id}
                      name={name}
                      className={`w-full px-3 py-2 border ${
                        errors[name] ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                      value={formData[name] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <div className="bg-gray-100 border-b-2 border-green-500 rounded-lg overflow-hidden mt-6 mb-6 w-full col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Miscellaneous Details
                    </h2>
                  </div>
                </div>

                {[
                  {
                    id: "bankAccountNo",
                    label: "Bank Account No",
                    name: "bankAccountNo",
                  },
                  { id: "bankName", label: "Bank Name", name: "bankName" },
                  { id: "ifscCode", label: "IFSC Code", name: "ifscCode" },
                  { id: "adharNo", label: "Aadhar No", name: "adharNo" },
                  {
                    id: "localIdentificationNo",
                    label: "Local ID No",
                    name: "localIdentificationNo",
                  },
                  {
                    id: "previousSchoolDetails",
                    label: "Previous School",
                    name: "previousSchoolDetails",
                    textarea: true,
                  },
                  { id: "note", label: "Note", name: "note", textarea: true },
                ].map(({ id, label, name, textarea }) => (
                  <div
                    key={id}
                    className={`space-y-1 ${
                      textarea ? "col-span-1 md:col-span-2 lg:col-span-3" : ""
                    }`}
                  >
                    <label
                      htmlFor={id}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    {textarea ? (
                      <textarea
                        id={id}
                        name={name}
                        rows="3"
                        className={`w-full px-3 py-2 border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                        value={formData[name] || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      <input
                        type="text"
                        id={id}
                        name={name}
                        className={`w-full px-3 py-2 border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                        value={formData[name] || ""}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}

                <div className="bg-gray-100 border-b-2 border-green-500 rounded-lg overflow-hidden mt-6 mb-6 w-full col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Upload Documents
                    </h2>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Student Documents (PDF, JPG, PNG - max 5MB each)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                  {errors.documents && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.documents}
                    </p>
                  )}
                  {formData.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Selected files:
                      </p>
                      <ul className="space-y-2">
                        {formData.documents.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded"
                          >
                            <span className="text-sm text-gray-600 truncate max-w-xs">
                              {file.name} (
                              {(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200 col-span-1 md:col-span-2 lg:col-span-3">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => window.location.reload()}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Admission
                          <IoIosArrowForward className="ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default StudentAdmissionForm;
