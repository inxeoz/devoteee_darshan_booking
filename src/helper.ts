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

export async function login_verify(phone: number, pwd: string) {
  try {
    const res = await fetch("/api/method/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usr: phone,
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

// export async function get_profile(login_as: string) {
//   try {
//     const res = await fetch("http://localhost:1880/get_profile", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         token: getCookieByName("auth_token"),
//         login_as: login_as,
//       }),
//     });

//     if (!res.ok) throw new Error("Network response was not ok");

//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error("Error fetching profile details:", err);

//     return null;
//   }
// }

// export async function request_otp(phone: number, login_as: string) {
//   try {
//     const res = await fetch("http://localhost:1880/request_otp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         phone: phone,
//         login_as: login_as,
//       }),
//     });

//     const data = await res.json();

//     return data;
//   } catch (e) {
//     console.log("errr", e);

//     return null;
//   }
// }

// export async function verify_token_and_get_token(
//   phone: number,
//   otp: string,
//   login_as: string,
// ) {
//   try {
//     const res = await fetch("http://localhost:1880/verify_otp_and_get_token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         phone: phone,
//         otp: otp,
//         login_as: login_as,
//       }),
//     });

//     const data = await res.json();

//     if (data.message) {
//       document.cookie = `auth_token=${data.message}; path=/;`;

//       console.log("token", data.message);
//     }

//     return data;
//   } catch (e) {
//     console.log("errr", e);

//     return null;
//   }
// }

// export async function get_appointment_list(
//   limitStart: number,
//   pageLength: number,
//   login_as: string,
// ) {
//   try {
//     const url = new URL("http://localhost:1880/get_appointment_list");

//     url.searchParams.set("limit_start", String(limitStart));
//     url.searchParams.set("limit_page_length", String(pageLength));

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         token: getCookieByName("auth_token"),
//         login_as: login_as,
//       }),
//     });

//     if (!res.ok) {
//       const txt = await res.text();
//       throw new Error(`HTTP ${res.status}: ${txt}`);
//     }

//     const data = await res.json();

//     return data;
//   } catch (err: any) {
//     console.error("Failed to load bookings", err);
//     return null;
//     // keep existing data if any
//   }
// }

// export async function create_appointment(details: {}, login_as: string) {
//   try {
//     // NOTE: curl used GET with body — that's unusual. We use POST here (recommended).
//     const res = await fetch("http://localhost:1880/create_appointment", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         details: details,
//         login_as: login_as,
//         token: getCookieByName("auth_token") || "",
//       }),
//     });

//     const data = await res.json();

//     return data;
//   } catch (err: any) {
//     console.error(err);

//     return null;
//   }
// }

// export async function get_appointment(appointmentId: string, login_as: string) {
//   try {
//     const res = await fetch("http://localhost:1880/get_appointment", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         token: getCookieByName("auth_token"),
//         login_as: login_as,
//         appointment_id: appointmentId,
//       }),
//     });

//     const data = await res.json();

//     console.log("booking ++++ ", data);

//     return data;
//   } catch (err: any) {
//     console.error(err);

//     return null;
//   }
// }

// export async function update_profile(info: {}, login_as: string) {
//   try {
//     const res = await fetch("http://localhost:1880/update_profile", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         info: info,
//         token: getCookieByName("auth_token") || "",
//         login_as: login_as,
//       }),
//     });

//     const data = await res.json();
//     return data;
//   } catch (err: any) {
//     console.error(err);

//     return null;
//   }
// }

// export async function login_request_devoteee(phone: number) {
//   try {
//     const res = await fetch(
//       "http://127.0.0.1:8001/api/method/mahakaal.darshan_booking.doctype.darshan_devoteee_profile.darshan_devoteee_profile.login_request",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           phone: phone,
//         }),
//       },
//     );

//     const data = await res.json();
//     return data;
//   } catch (err: any) {
//     console.error(err);

//     return null;
//   }
// }

// export async function login_devoteee(phone: number, pwd: string) {
//   try {
//     const res = await fetch("http://127.0.0.1:8001/api/method/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         usr: phone,
//         pwd: pwd,
//       }),
//     });

//     const data = await res.json();
//     return data;
//   } catch (err: any) {
//     console.error(err);

//     return null;
//   }
// }
