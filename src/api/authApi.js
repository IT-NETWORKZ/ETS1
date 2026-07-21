import api from "../api/axios";
 
export const loginCandidate = (email, password) =>
  api.post("/CandidateLogin", {
    sEmail: email,
    sPassword: password,
  });

export const loginAdmin = (email, password) =>
  api.post("/log", {
    Email: email,
    Password: password,
  });

export const registerCandidate = (payload) =>
  api.post("/CandidateRegister", payload);

export const registerAdmin = (payload) =>
  api.post("/OrganizationRegister", payload);