<script lang="ts">
    import { goto } from "$app/navigation";
    import { Toaster, toast } from "svelte-sonner";
    import { login_request_admin } from "@src/helper_admin.js";
    import { login_request_devoteee } from "@src/helper_devoteee.js";
    import { login_request_attender } from "@src/helper_attender.js";

    let user_type = "Devoteee";
    let phone = "";
    let loading = false;
    let res;

    const requestMap = {
        Admin: login_request_admin,
        Devoteee: login_request_devoteee,
        Attender: login_request_attender,
    };

    async function requestLogin(e?: SubmitEvent) {
        e?.preventDefault();
        loading = true;

        localStorage.setItem("Mphone", phone);
        localStorage.setItem("Muser_type", user_type);

        const fn = requestMap[user_type];
        res = await fn(phone);

        if (res?.message?.err) {
            toast.error(res.message.err);
        } else {
            toast.success("OTP sent successfully");
            goto("/login_verify");
        }

        loading = false;
    }
</script>

<!-- Remove if Toaster is already in +layout.svelte -->
<Toaster position="top-right" />

<form class="card" on:submit|preventDefault={requestLogin}>
    <h2>Login Request</h2>

    <label>
        Phone
        <input type="tel" bind:value={phone} placeholder="e.g. +919900112233" />
    </label>

    <label>
        User Type
        <select bind:value={user_type}>
            <option>Admin</option>
            <option>Devoteee</option>
            <option>Attender</option>
        </select>
    </label>

    <button disabled={loading}>
        {#if loading}Requesting...{:else}Request Login{/if}
    </button>
</form>

<style>
    :global(body) {
        font-family:
            system-ui,
            Segoe UI,
            Roboto,
            Arial,
            sans-serif;
        background: #f3f6f8;
    }
    .card {
        width: 340px;
        margin: 10vh auto;
        padding: 22px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        text-align: center;
    }
    label {
        display: block;
        margin: 12px 0;
        text-align: left;
        font-size: 14px;
    }
    input,
    select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
    }
    button {
        width: 100%;
        padding: 10px;
        margin-top: 12px;
        border: none;
        border-radius: 6px;
        background: #2563eb;
        color: white;
        font-weight: 600;
    }
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>
