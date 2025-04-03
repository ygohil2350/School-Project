import { School } from "@/types/school";
import { FaEnvelope, FaPhone } from "react-icons/fa";

interface Props {
  params: {
    subdomain: string;
  };
}

async function getSchool(id: string): Promise<School | undefined> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/school/${id}`
    );
    if (!res.ok) {
      if (res.status === 404) {
        return undefined;
      }
      throw new Error(`Failed to fetch school: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching school:", error);
    return undefined;
  }
}

export default async function SchoolProfile({ params }: Props) {
  const school = await getSchool(params.subdomain);

  if (!school) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              School Not Found
            </h2>
            <p className="text-gray-600">
              Sorry, the school profile for &apos;{params.subdomain}&apos; could
              not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-extrabold text-indigo-600 mb-6">
            {school.name}
          </h1>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              About Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {school.description}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-2" />
                <p className="text-gray-600">
                  Email:{" "}
                  <span className="font-medium">{school.contactEmail}</span>
                </p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-500 mr-2" />
                <p className="text-gray-600">
                  Phone: <span className="font-medium">{school.phone}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <p className="text-sm text-gray-500">
            School ID: <span className="font-mono">{school.id}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
