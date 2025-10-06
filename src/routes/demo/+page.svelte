<script>
    let usr = "";
    let pwd = "";
    let loginResponse = "";
    let profileResponse = "";

    async function login(event) {
        event.preventDefault();

        try {
            const res = await fetch("/api/method/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ usr, pwd }),
            });

            if (res.ok) {
                loginResponse = await res.json();
                console.log("Login success:", loginResponse);
            } else {
                loginResponse = `Login failed: ${await res.text()}`;
            }
        } catch (err) {
            console.error("Login error:", err);
            loginResponse = `Error: ${err}`;
        }
    }

    async function getProfile() {
        try {
            const res = await fetch(
                "/api/method/mahakaal.darshan_booking.doctype.darshan_devoteee_profile.darshan_devoteee_profile.get_profile",
                {
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                },
            );

            if (res.ok) {
                profileResponse = await res.json();
            } else {
                profileResponse = "Failed to fetch profile";
            }
        } catch (err) {
            console.error("Profile error:", err);
            profileResponse = `Error: ${err}`;
        }
    }
</script>

<div class="container">
    <h2>Login Portal</h2>
    <form on:submit={login}>
        <label>
            Username:
            <input type="text" bind:value={usr} required />
        </label>
        <label>
            Password:
            <input type="password" bind:value={pwd} required />
        </label>
        <button type="submit">Login</button>
    </form>

    <button class="secondary-btn" on:click={getProfile}>Get Profile</button>

    <h3>Login Response:</h3>
    <pre>{JSON.stringify(loginResponse, null, 2)}</pre>

    <h3>Profile Response:</h3>
    <pre>{JSON.stringify(profileResponse, null, 2)}</pre>
</div>

<style>
    body {
        font-family: "Inter", Arial, sans-serif;
        background: #f4f6f8;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }

    .container {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        padding: 2rem 3rem;
        width: 400px;
        max-width: 90%;
        text-align: center;
    }

    h2 {
        margin-bottom: 1.5rem;
        color: #333;
        font-size: 1.5rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    label {
        text-align: left;
        font-weight: 500;
        color: #444;
        display: flex;
        flex-direction: column;
        font-size: 0.9rem;
    }

    input {
        margin-top: 0.4rem;
        padding: 0.6rem 0.8rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    input:focus {
        outline: none;
        border-color: #0078d4;
        box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.15);
    }

    button {
        background-color: #0078d4;
        color: #fff;
        border: none;
        padding: 0.7rem 1rem;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s;
    }

    button:hover {
        background-color: #005fa3;
    }

    pre {
        background: #f1f3f5;
        border-radius: 8px;
        padding: 1rem;
        text-align: left;
        overflow-x: auto;
        font-size: 0.9rem;
        color: #333;
    }

    h3 {
        text-align: left;
        margin-top: 1.5rem;
        font-size: 1rem;
        color: #222;
    }

    .secondary-btn {
        background: #6c757d;
        margin-top: 1rem;
    }

    .secondary-btn:hover {
        background: #5a6268;
    }
</style>
