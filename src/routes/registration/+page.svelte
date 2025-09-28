<script>
  let mobile = "";
  let touched = false;
  let loading = false;

  const validate = (v) => /^\d{7,15}$/.test(v); // tweak to your locale (here: 7–15 digits)
  $: error = touched && !validate(mobile) ? "Please enter a valid mobile number (digits only)." : "";

  async function handleSubmit(e) {
    e.preventDefault();
    touched = true;
    if (!validate(mobile)) return;
    loading = true;
    // TODO: call your API to start registration / send OTP, etc.
    // await api.sendOtp(mobile);
    loading = false;
    // navigate or update UI as needed
  }
</script>

<div class="page">
  <div class="card">
    <h1 class="title">Register with Us</h1>
    <p class="subtitle">Create your account to get started.</p>

    <!-- Progress -->
    <div class="progress">
      <span class="bar" style="width: 25%"></span>
    </div>

    <form on:submit|preventDefault={handleSubmit} novalidate>
      <label class="label" for="mobile">Mobile Number</label>
      <input
        id="mobile"
        class="input {error ? 'invalid' : ''}"
        type="tel"
        inputmode="numeric"
        placeholder="Enter your mobile number"
        bind:value={mobile}
        on:blur={() => (touched = true)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby="mobile-help"
      />
      {#if error}
        <div id="mobile-help" class="error">{error}</div>
      {/if}

      <button class="btn" type="submit" disabled={loading}>
        {#if loading}…{/if} Next
      </button>
    </form>

    <p class="footnote">
      Already registered?
      <a href="/login?method=mobile" class="link">Login with Mobile Number</a>
    </p>
  </div>
</div>

<style>
  :global(html, body) {
    height: 100%;
  }
  .page {
    min-height: 100vh;
    background: #f4f6f8;
    display: grid;
    place-items: center;
    padding: 24px;
  }
  .card {
    width: min(560px, 92vw);
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 10px 28px rgba(16, 24, 40, 0.12);
    padding: 36px 40px 32px;
    text-align: center;
  }
  .title {
    margin: 0 0 6px;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 700;
    color: #1f2937;
  }
  .subtitle {
    margin: 0 0 22px;
    color: #6b7280;
    font-size: 14px;
  }
  .progress {
    height: 4px;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
    margin: 8px 0 20px;
  }
  .bar {
    display: block;
    height: 100%;
    background: #2151ea; /* brand blue */
  }
  form {
    text-align: left;
  }
  .label {
    display: block;
    font-size: 13px;
    color: #4b5563;
    margin-bottom: 8px;
  }
  .input {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    transition: box-shadow .15s ease, border-color .15s ease;
    background: #fff;
  }
  .input:focus {
    border-color: #2151ea;
    box-shadow: 0 0 0 3px rgba(33, 81, 234, .15);
  }
  .input.invalid {
    border-color: #dc2626;
  }
  .error {
    margin-top: 6px;
    font-size: 12px;
    color: #b91c1c;
  }
  .btn {
    width: 100%;
    height: 46px;
    margin-top: 16px;
    border: 0;
    border-radius: 10px;
    background: #2151ea;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: transform .02s ease, filter .15s ease, opacity .15s ease;
  }
  .btn:active { transform: translateY(1px); }
  .btn:disabled {
    opacity: .7;
    cursor: not-allowed;
  }
  .footnote {
    text-align: center;
    margin: 18px 0 0;
    color: #6b7280;
    font-size: 13px;
  }
  .link {
    color: #2151ea;
    text-decoration: none;
  }
  .link:hover { text-decoration: underline; }
</style>
