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
  limitStart: number | null,
  pageLength: number | null,
  darshan_type: string | null,
  workflow_state: string | null,
) {
  try {
    const res = await fetch(COMMON + "get_appointment_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        limitStart: limitStart,
        pageLength: pageLength,
        darshan_type: darshan_type,
        workflow_state: workflow_state,
      }),
    });

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

export async function get_appointment_stats() {
  try {
    const res = await fetch(COMMON + "get_appointment_stats", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error(err);

    return null;
  }
}

const VIP_BOOKING =
  "/api/method/mahakaal.darshan_booking.doctype.vip_darshan_booking_slot.vip_darshan_booking_slot.";

export async function get_vip_booking_slot_info(slot_date: string) {
  try {
    const res = await fetch(VIP_BOOKING + "get_slot_occupancy_info", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        slot_date: slot_date,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error(err);

    return null;
  }
}
