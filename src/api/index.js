import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3005"
});

export const fetchResume = async () => {
  const res = await api.get("/resume");
  return res.data;
}

export const updatePersonalSection = async (data) => {
  const resumeData = (await api.get("/resume")).data;
  resumeData.personal = data;
  await api.post("/resume", resumeData);
}

export const updateEducationInResume = async (data, type) => {
  const resumeData = (await api.get("/resume")).data;
  resumeData.education = resumeData.education || [];
  if (type == "add") {
    resumeData.education.push({ id: Math.floor(Math.random() * 1000), ...data });
  }
  else {
    resumeData.education = resumeData.education.map(ed => ed.id != data.id ? ed : data);
  }
  await api.put("/resume", resumeData);
}

export const deleteEducationItem = async (id) => {
  const resumeData = (await api.get("/resume")).data;
  resumeData.education = resumeData.education.filter(edu => edu.id != id);
  await api.put("/resume", resumeData);
}


export const updateJobsInResume = async (data, type) => {
  const resumeData = (await api.get("/resume")).data;
  resumeData.jobs = resumeData.jobs || [];
  if (type == "add") {
    resumeData.jobs.push({ id: Math.floor(Math.random() * 1000), ...data });
  }
  else {
    resumeData.jobs = resumeData.jobs.map(job => job.id != data.id ? job : data);
  }
  await api.put("/resume", resumeData);
}

export const deleteJobItem = async (id) => {
  const resumeData = (await api.get("/resume")).data;
  resumeData.jobs = resumeData.jobs.filter(job => job.id != id);
  await api.put("/resume", resumeData);
}