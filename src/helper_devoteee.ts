const COMMON =
  "/api/method/mahakaal.darshan_booking.doctype.darshan_devoteee_profile.darshan_devoteee_profile.";

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

export async function get_appointment_list(
  limitStart: number,
  pageLength: number,
) {
  try {
    const res = await fetch(COMMON + "get_appointment_list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      // body: JSON.stringify({
      //   token: getCookieByName("auth_token"),
      //   login_as: login_as,
      // }),
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

export async function create_appointment(info: {}) {
  try {
    // NOTE: curl used GET with body — that's unusual. We use POST here (recommended).
    const res = await fetch(COMMON + "create_appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        info: info,
      }),
    });

    const data = await res.json();

    return data;
  } catch (err: any) {
    console.error(err);

    return null;
  }
}

export async function get_appointment(appointment_id: string) {
  try {
    const res = await fetch(COMMON + "get_appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointment_id: appointment_id,
      }),
    });

    const data = await res.json();

    console.log("booking ++++ ", data);

    return data;
  } catch (err: any) {
    console.error(err);

    return null;
  }
}

export async function update_profile(info: {}, login_as: string) {
  try {
    const res = await fetch(COMMON + "update_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        info: info,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error(err);

    return null;
  }
}

export async function login_request_devoteee(phone: number) {
  try {
    const res = await fetch(COMMON + "login_request", {
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
  } catch (err: any) {
    console.error(err);

    return null;
  }
}

export async function login_devoteee(phone: number, pwd: string) {
  try {
    const res = await fetch("/api/method/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usr: phone + "",
        pwd: pwd,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error(err);

    return null;
  }
}

export async function registration_devoteee(phone: number) {
  try {
    const res = await fetch(COMMON + "create_devoteee_user", {
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
  } catch (err: any) {
    console.error(err);

    return null;
  }
}
