export const saveRegisterData = (data) => {
  const current = JSON.parse(localStorage.getItem("registroTemp")) || {};

  const updated = { ...current, ...data };

  localStorage.setItem("registroTemp", JSON.stringify(updated));
};

export const getRegisterData = () => {
  return JSON.parse(localStorage.getItem("registroTemp")) || {};
};

export const clearRegisterData = () => {
  localStorage.removeItem("registroTemp");
};