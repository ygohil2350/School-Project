"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { School } from "@/types/school";
import { FaPlus, FaLock } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import "next-auth";

interface SchoolForm {
  name: string;
  description: string;
  contactEmail: string;
  phone: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      token?: string; // Assuming token is used
      admin?: boolean; // Add the admin property
    };
  }
}
export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [schoolsList, setSchoolsList] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [schoolData, setSchoolData] = useState<SchoolForm>({
    name: "",
    description: "",
    contactEmail: "",
    phone: "",
  });
  const [isAddingNewSchool, setIsAddingNewSchool] = useState(false);
  const [newSchoolData, setNewSchoolData] = useState<Omit<SchoolForm, "id">>({
    name: "",
    description: "",
    contactEmail: "",
    phone: "",
  });
  const [addSchoolError, setAddSchoolError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.admin !== true) {
      router.push("/"); // Redirect non-admin users
    } else if (status === "authenticated" && session?.user?.admin === true) {
      fetchSchools();
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const fetchSchools = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/school`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`, // Assuming your API expects Bearer token
          },
        }
      );
      if (!res.ok) {
        console.error("Failed to fetch schools:", res.status);
        return;
      }
      const data = await res.json();
      setSchoolsList(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const handleSchoolSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const schoolId = event.target.value;
    setSelectedSchoolId(schoolId);
    setIsAddingNewSchool(false);
    if (schoolId) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/school/${schoolId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        if (!res.ok) {
          console.error("Failed to fetch school details:", res.status);
          setSchoolData({
            name: "",
            description: "",
            contactEmail: "",
            phone: "",
          });
          return;
        }
        const data = await res.json();
        setSchoolData({
          name: data.name,
          description: data.description,
          contactEmail: data.contactEmail,
          phone: data.phone,
        });
      } catch (error) {
        console.error("Error fetching school details:", error);
        setSchoolData({
          name: "",
          description: "",
          contactEmail: "",
          phone: "",
        });
      }
    } else {
      setSchoolData({ name: "", description: "", contactEmail: "", phone: "" });
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setSchoolData((prevData) => ({
      ...prevData,
      [name === "phone" ? "phone" : name]: value,
    }));
  };

  const handleUpdateSchool = async () => {
    if (!selectedSchoolId) {
      alert("Please select a school to update.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/school`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({ id: selectedSchoolId, ...schoolData }),
        }
      );

      if (res.ok) {
        alert("School information updated successfully!");
        fetchSchools(); // Refresh the list of schools
      } else {
        const errorData = await res.json();
        alert(
          `Error updating school: ${
            errorData.message || "Something went wrong"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating school:", error);
      alert("Failed to update school information.");
    }
  };

  const handleAddNewSchool = () => {
    setIsAddingNewSchool(true);
    setSelectedSchoolId(null);
    setSchoolData({ name: "", description: "", contactEmail: "", phone: "" });
  };

  const handleNewSchoolInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewSchoolData((prevData) => ({
      ...prevData,
      [name === "phone" ? "phone" : name]: value,
    }));
  };

  const handleCreateSchool = async () => {
    setAddSchoolError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/school`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify(newSchoolData),
        }
      );

      if (res.ok) {
        alert("New school added successfully!");
        setNewSchoolData({
          name: "",
          description: "",
          contactEmail: "",
          phone: "",
        });
        setIsAddingNewSchool(false);
        fetchSchools(); // Refresh the list
      } else {
        const errorData = await res.json();
        setAddSchoolError(errorData.message || "Failed to add school");
      }
    } catch (error) {
      console.error("Error creating school:", error);
      setAddSchoolError("Failed to add school");
    }
  };

  if (status === "authenticated" && session?.user?.admin !== true) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 text-center">
            <FaLock className="text-red-500 text-4xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You do not have permission to access this page.
            </p>
            <button
              className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mb-4 focus:outline-none focus:shadow-outline"
            onClick={handleAddNewSchool}
          >
            <FaPlus className="inline mr-2" /> Add New School
          </button>

          {isAddingNewSchool && (
            <div className="mb-6 p-4 border rounded">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Add New School
              </h3>
              {addSchoolError && (
                <p className="text-red-500 mb-2">{addSchoolError}</p>
              )}
              <div className="mb-4">
                <label
                  htmlFor="newName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="newName"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newSchoolData.name}
                  onChange={handleNewSchoolInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newDescription"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description:
                </label>
                <textarea
                  id="newDescription"
                  name="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={newSchoolData.description}
                  onChange={handleNewSchoolInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newContactEmail"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Contact Email:
                </label>
                <input
                  type="email"
                  id="newContactEmail"
                  name="contactEmail"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newSchoolData.contactEmail}
                  onChange={handleNewSchoolInputChange}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="newPhone"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Contact Phone:
                </label>
                <input
                  type="tel"
                  id="newPhone"
                  name="phone"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newSchoolData.phone}
                  onChange={handleNewSchoolInputChange}
                />
              </div>
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline"
                onClick={handleCreateSchool}
              >
                Add School
              </button>
              <button
                className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => setIsAddingNewSchool(false)}
              >
                Cancel
              </button>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="schoolSelect"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select School to Edit:
            </label>
            <select
              id="schoolSelect"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleSchoolSelect}
              value={selectedSchoolId || ""}
            >
              <option value="">-- Select a School --</option>
              {schoolsList.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          {selectedSchoolId && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Edit School Information
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={schoolData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={schoolData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contactEmail"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Contact Email:
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={schoolData.contactEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Contact Phone:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={schoolData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline"
                onClick={handleUpdateSchool}
              >
                Update School
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
