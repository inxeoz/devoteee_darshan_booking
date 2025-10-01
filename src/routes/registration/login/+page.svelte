<script>
    import { goto } from "$app/navigation";
    import {
        request_otp,
        verify_token_and_get_token,
    } from "../../../helper.js";

    let phone = 0;
    let otp = "";

    async function sendOtp() {
        // alert(`OTP sent to ${phone} (simulation)`);
        await request_otp(phone);
    }

    async function login() {
        const data = await verify_token_and_get_token(phone, otp);

        if (data !== null) {
            goto("/dashboard");
        }
    }
</script>

<div class="page">
    <div class="card">
        <h2>Login</h2>

        <div class="form-row">
            <label>phone Number</label>
            <input
                type="text"
                bind:value={phone}
                placeholder="Enter phone number"
            />
        </div>

        <div class="form-row">
            <label>OTP</label>
            <div class="otp-row">
                <input type="text" bind:value={otp} placeholder="Enter OTP" />
                <button type="button" on:click={sendOtp}>Send OTP</button>
            </div>
        </div>

        <button class="login-btn" on:click={login}>Login</button>
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
        width: 350px;
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

    .otp-row {
        display: flex;
        gap: 8px;
    }

    .otp-row input {
        flex: 1;
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

    .login-btn {
        width: 100%;
        margin-top: 10px;
    }
</style>
