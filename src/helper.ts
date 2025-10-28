import { goto } from "$app/navigation";
import { user_logged_in } from "@src/store.js";

// Dynamically choose API base depending on environment
const API_BASE = import.meta.env.PROD
  ? import.meta.env.VITE_TARGET     // use full backend URL in production
  : "";                             // use relative path in dev (Vite proxy)

export async function get_logged_user() {
  try {
    const res = await fetch(`${API_BASE}/api/method/frappe.auth.get_logged_user`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log(data);

    if (data?.message) {
      user_logged_in.set(true);
    } else {
      user_logged_in.set(false);
      await logout();
    }

    return data;
  } catch (err: any) {
    return null;
  }
}

export async function logout() {
  try {
    const res = await fetch(`${API_BASE}/api/method/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    user_logged_in.set(false);
    goto("/");

    return data;
  } catch (err: any) {
    console.error(err);
    return null;
  }
}

export function deleteAllCookies() {}

export async function login_verify(phone: number, pwd: string) {
  try {
    const res = await fetch(`${API_BASE}/api/method/login`, {
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


export async function get_auth_token(phone: number) {
  try {
     const url  = "http://127.0.0.1:8001/api/method/mahakaal.darshan_booking.doctype.session_login.session_login.get_auth_token"
     const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
         "phone" : phone + ""
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error(err);
    return null;
  }
}
