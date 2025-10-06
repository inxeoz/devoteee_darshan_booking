<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    import { login_devoteee } from "@src/helper_devoteee.js";

    // phone as string to allow leading + / 0 etc; we'll validate before sending
    let phone = 0;
    let temp_pwd = "";
    let loading = false;
    let message = ""; // success/info from API
    let error = ""; // error messages to show
    let accepted = false; // optional: show confirmation to proceed to dashboard

    async function requestLogin() {
        error = "";
        message = "";

        loading = true;

        const json_data = await login_devoteee(phone, temp_pwd);

        message = JSON.stringify(json_data);
    }

    // optional: allow enter key to submit from phone input
    function onKeydown(e) {
        if (e.key === "Enter") {
            requestLogin();
        }
    }
</script>

<div class="page">
    <div class="card">
        <h2>Login Request (Phone)</h2>

        <div class="form-row">
            <label>Phone number</label>
            <input
                type="text"
                bind:value={phone}
                placeholder="Enter phone number (e.g. 919900112233)"
                on:keydown={onKeydown}
                inputmode="tel"
                autocomplete="tel"
            />
        </div>

        <div class="form-row">
            <label>Temp Password</label>
            <input
                type="text"
                bind:value={temp_pwd}
                placeholder="Enter temp password"
                on:keydown={onKeydown}
                inputmode="tel"
                autocomplete="tel"
            />
        </div>

        <div class="form-row">
            <button
                class="login-btn"
                on:click={requestLogin}
                disabled={loading}
            >
                {#if loading}
                    Requesting...
                {:else}
                    Request Login
                {/if}
            </button>
        </div>

        {#if message}
            <div class="api-message">{message}</div>
        {/if}

        {#if error}
            <div class="api-error">{error}</div>
        {/if}
    </div>
</div>

<style>
    .page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f3f6f8;
    }

    .card {
        background: #fff;
        padding: 24px;
        border-radius: 10px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
        width: 380px;
        text-align: center;
    }

    h2 {
        margin-bottom: 16px;
    }

    .form-row {
        margin-bottom: 14px;
        text-align: left;
    }

    label {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
    }

    input {
        width: 100%;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }

    button {
        padding: 10px;
        border: none;
        border-radius: 6px;
        background: #2563eb;
        color: white;
        cursor: pointer;
        font-weight: bold;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .login-btn {
        width: 100%;
        margin-top: 10px;
    }

    .api-message {
        margin-top: 12px;
        padding: 10px;
        background: #ecfdf5;
        border: 1px solid #bbf7d0;
        border-radius: 6px;
        color: #065f46;
        text-align: left;
    }

    .api-error {
        margin-top: 12px;
        padding: 10px;
        background: #fff1f2;
        border: 1px solid #fecaca;
        border-radius: 6px;
        color: #991b1b;
        text-align: left;
    }
</style>
