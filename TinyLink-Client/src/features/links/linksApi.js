
const BASE_URL = "/api/links";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export async function fetchAllLinks() {
  const response = await fetch(`${BACKEND_URL}${BASE_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch links");
  }
  return response.json();
}

export async function createLink(linkData) {
  const response = await fetch(`${BACKEND_URL}${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(linkData),
  });

  if (response.status === 409) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Custom code already exists.");
  }

  if (!response.ok) {
    throw new Error("Failed to create link. Please check your URL.");
  }
  return response.json();
}

export async function deleteLinkByCode(code) {
  const response = await fetch(`${BACKEND_URL}${BASE_URL}/${code}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete link with code: ${code}`);
  }
}

export async function fetchLinkStats(code) {
  const response = await fetch(`${BACKEND_URL}${BASE_URL}/${code}`);
  if (!response.ok) {
    throw new Error(`Link not found for code: ${code}`);
  }
  return response.json();
}

export async function fetchHealthStatus() {
  const response = await fetch(`${BACKEND_URL}/healthz`);
  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }
  return response.json();
}