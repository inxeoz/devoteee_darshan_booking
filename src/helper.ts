export function getCookieByName(name: string): string | null {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

export async function getProfileDetails() {
  try {
    const res = await fetch("http://localhost:1880/get_profile_details", {
      headers: {
        auth_token: getCookieByName("auth_token") || "",
      },
    });

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching profile details:", err);

    return null;
  }
}
