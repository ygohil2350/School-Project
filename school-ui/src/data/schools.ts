import { School } from "@/types/school";

const schools: Record<string, School> = {
  school1: {
    id: "school1",
    name: "School One",
    description: "This is the first school.",
    contactEmail: "info@schoolone.com",
    phone: "123-456-7890",
  },
  school2: {
    id: "school2",
    name: "School Two",
    description: "The second school in our system.",
    contactEmail: "admin@schooltwo.org",
    phone: "987-654-3210",
  },
};

export default schools;
