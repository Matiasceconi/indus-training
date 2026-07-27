import { createContext, useContext } from "react";

const StudentProfileContext = createContext(null);

export function StudentProfileProvider({ children, value }) {
  return <StudentProfileContext.Provider value={value}>{children}</StudentProfileContext.Provider>;
}

export function useStudentProfile() {
  return useContext(StudentProfileContext);
}