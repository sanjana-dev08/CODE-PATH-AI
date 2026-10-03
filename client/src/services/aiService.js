import api from "./api";

export const askTutor = async (question) => {
  const response = await api.post("/ai/tutor", { question });
  return response.data.data;
};