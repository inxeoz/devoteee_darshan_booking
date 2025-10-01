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
      method: "GET",
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

export async function request_otp(phone: number) {
  try {
    const res = await fetch("http://localhost:1880/request_otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
      }),
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log("errr", e);

    return null;
  }
}

export async function verify_token_and_get_token(phone: number, otp: string) {
  try {
    const res = await fetch("http://localhost:1880/verify_otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
        otp: otp,
      }),
    });

    const data = await res.json();

    if (data.message) {
      document.cookie = `auth_token=${data.message}; path=/;`;
    }

    return data;
  } catch (e) {
    console.log("errr", e);

    return null;
  }
}

export async function loadBookings() {
  try {
    const res = await fetch("http://localhost:1880/get_appointment_list", {
      method: "GET",
      headers: {
        auth_token: getCookieByName("auth_token") || "",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`HTTP ${res.status}: ${txt}`);
    }

    const data = await res.json();

    return data;
  } catch (err: any) {
    console.error("Failed to load bookings", err);
    return null;
    // keep existing data if any
  }
}

export async function create_appointment(body_data: object) {
  try {
    // NOTE: curl used GET with body — that's unusual. We use POST here (recommended).
    const res = await fetch("http://localhost:1880/create_appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth_token: getCookieByName("auth_token") || "",
      },
      body: JSON.stringify(body_data),
    });

    const data = await res.json();
  } catch (err: any) {
    console.error(err);

    return null;
  }
}
