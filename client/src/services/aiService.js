import api from "./api";

export const askTutor = async (question, options = {}) => {
  const response = await api.post("/ai/tutor", {
    question,
    mode: options.mode || "Explain",
    language: options.language || "JavaScript",
    conversation: options.conversation || [],
    previousCode: options.previousCode || ""
  });
  return response.data.data;
};