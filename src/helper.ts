import { user_logged_in } from "@src/store.js";

export async function get_logged_user() {
  try {
    const res = await fetch("api/method/frappe.auth.get_logged_user", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data?.message) {
      user_logged_in.set(true);
    } else {
      user_logged_in.set(false);
    }

    return data;
  } catch (err: any) {
    console.error(err);

    return null;
  }
}

export function deleteAllCookies(phone: number, pwd: string) {
  document.cookie.split(";").forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  });
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
