import api from "./axios";


//------------------------------AUTH APIS------------------------------------------------------
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const completeFirstLogin = (data) => {
  return api.post("/auth/activate-account", data);
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};

//------------------------------HR APIS------------------------------------------------------
export const fetchPendingUsers = async () => {
  return await api.get("/hr/pending-users");
};

export const approveUser = (data) => {
  return api.post("/hr/approve-user", data);
};

export const rejectUser = (data) => {
  return api.post("/hr/reject-user", data);
};

//------------------------------HR APIS------------------------------------------------------

export const bulkUploadEmployeesAPI = async (file, { adminId, dryRun }) => {
  const formData = new FormData();
  formData.append("file", file);

  if (adminId) {
    formData.append("adminId", adminId); // optional
  }

  const res = await api.post(
    `/employees/bulk-upload?dryRun=${dryRun}`,
    formData
  );

  return res.data.data;
};

//--------------------------MANAGER APIS--------------------------------------------------


export const fetchManagerData = () => {
  return api.get("/org/manager-data");
}


//--------------------------EMPLOYEE APIS--------------------------------------------------

export const getEmployees = () => {
  return api.get("/employees");
};

//--------------------------DASHBOARD APIS--------------------------------------------------
export const getDashboard = () => {
  return api.get("/dashboard");
};

//--------------------------ATTENDANCE APIS--------------------------------------------------

export const getAttendanceSheet = (month, page, limit) => {
  return api.get("/attendance/sheet", {
    params: {
      month,
      page,
      limit
    }
  })
}

export const markAttendance = (employeeId, date, status) => {
  return api.post("/attendance/mark", {
    employeeId,
    date,
    status
  });
};

export const markBulkAttendance = (today, employeeIds, status = "PRESENT") => { 
  return api.post("/attendance/bulk", {
  date: today,
  status,
  employeeIds
})};
//--------------------------ORGANISATION APIS--------------------------------------------------


export const fetchDesignationData = () => {
    return api.get("/org/designation-data");
}

export const fetchTeamData = () => {
    return api.get("/org/team-data");
}