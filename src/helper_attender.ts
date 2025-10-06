const COMMON =
  "/api/method/mahakaal.darshan_booking.doctype.darshan_attender_profile.darshan_attender_profile.";

export async function get_profile() {
  try {
    const res = await fetch(COMMON + "get_profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching profile details:", err);

    return null;
  }
}

export async function login_request_attender(phone: number) {
  try {
    const res = await fetch(COMMON + "login_request", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error(err);

    return null;
  }
}
