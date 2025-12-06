const API_BASE = "http://localhost:8080/api/encode";

export const base64Encode = async (input) => {
  const response = await fetch(`${API_BASE}/base64?input=${encodeURIComponent(input)}`);
  return response.json();
};

export const base64Decode = async (input) => {
  const response = await fetch(`${API_BASE}/base64/decode?input=${encodeURIComponent(input)}`);
  return response.json();
};
