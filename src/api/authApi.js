import api from "../api/axios";

export const loginCandidate = (email, password) =>
  api.post("/CandidateLogin", {
    sEmail: email,
    sPassword: password,
  });

export const loginAdmin = (email, password) =>
  api.post("/AdminLogin", {
    Email: email,
    Password: password,
  });

export const registerCandidate = (payload) =>
  api.post("/CandidateRegister", payload);

export const registerAdmin = (payload) =>
  api.post("/OrganizationRegister", payload);


export const addQuestion = (payload) =>
  api.post("/SubCatQuestion/Add", payload); 

export const getSubjects  = (payload) =>
  api.get("/AddSubject/GetAll", payload); 