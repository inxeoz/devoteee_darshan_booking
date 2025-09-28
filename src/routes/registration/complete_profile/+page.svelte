<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // progress shown in the thin bar under the header
  export let progress = 80; // percent

  // form model
  let name = "";
  let gender = "";
  let dob = "";
  let address = "";

  let touched = { name: false, gender: false, dob: false };

  const errors = () => {
    const e = {};
    if (!name.trim()) e.name = "Please enter your full name.";
    if (!gender) e.gender = "Please select a gender.";
    if (!dob) e.dob = "Please choose your date of birth.";
    return e;
  };

  function handleSubmit(e) {
    e.preventDefault();
    touched = { name: true, gender: true, dob: true };
    const eobj = errors();
    if (Object.keys(eobj).length) return;
    dispatch("submit", { name: name.trim(), gender, dob, address: address.trim() });
  }
  function goBack() {
    dispatch("back");
  }
</script>

<div class="page">
  <div class="card" role="region" aria-labelledby="title">
    <h1 id="title" class="title">Register with Us</h1>
    <p class="subtitle">Create your account to get started.</p>

    <div class="progress" aria-label="Progress">
      <span class="bar" style="width: {Math.max(0, Math.min(100, progress))}%"></span>
    </div>

    <h2 class="heading">Complete Your Profile</h2>
    <p class="copy">Please provide a few more details to finish your registration.</p>

    <form on:submit={handleSubmit} novalidate>
      <!-- Full Name -->
      <label class="label" for="name">Full Name</label>
      <input
        id="name"
        class="input {touched.name && errors().name ? 'invalid' : ''}"
        type="text"
        placeholder="John Doe"
        bind:value={name}
        on:blur={() => (touched.name = true)}
        aria-invalid={touched.name && errors().name ? 'true' : 'false'}
      />
      {#if touched.name && errors().name}
        <div class="error">{errors().name}</div>
      {/if}

      <!-- Gender -->
      <label class="label" for="gender">Gender</label>
      <select
        id="gender"
        class="input {touched.gender && errors().gender ? 'invalid' : ''}"
        bind:value={gender}
        on:blur={() => (touched.gender = true)}
        aria-invalid={touched.gender && errors().gender ? 'true' : 'false'}
      >
        <option value="" disabled selected>Select Gender</option>
        <option>Female</option>
        <option>Male</option>
        <option>Non-binary</option>
        <option>Prefer not to say</option>
      </select>
      {#if touched.gender && errors().gender}
        <div class="error">{errors().gender}</div>
      {/if}

      <!-- Date of Birth -->
      <label class="label" for="dob">Date of Birth</label>
      <div class="date-wrap">
        <input
          id="dob"
          class="input {touched.dob && errors().dob ? 'invalid' : ''}"
          type="date"
          bind:value={dob}
          on:blur={() => (touched.dob = true)}
          aria-invalid={touched.dob && errors().dob ? 'true' : 'false'}
        />
        <span class="calendar" aria-hidden="true">📅</span>
      </div>
      {#if touched.dob && errors().dob}
        <div class="error">{errors().dob}</div>
      {/if}

      <!-- Address -->
      <label class="label" for="addr">Address</label>
      <textarea
        id="addr"
        class="input textarea"
        placeholder="123 Main St, Anytown, USA"
        rows="3"
        bind:value={address}
      />

      <button class="btn primary" type="submit">Complete Registration</button>
    </form>

    <button class="back" type="button" on:click={goBack}>← Back</button>

    <p class="footnote">
      Already registered?
      <a href="/login?method=mobile" class="link">Login with Mobile Number</a>
    </p>
  </div>
</div>

<style>
  :global(html, body) { height: 100%; }
  .page {
    min-height: 100vh;
    background: #f4f6f8;
    display: grid;
    place-items: center;
    padding: 24px;
  }
  .card {
    width: min(640px, 92vw);
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 10px 28px rgba(16,24,40,.12);
    padding: 36px 40px 32px;
  }
  .title {
    margin: 0 0 6px;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
  }
  .subtitle {
    margin: 0 0 18px;
    color: #6b7280;
    font-size: 14px;
    text-align: center;
  }
  .progress { height: 4px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
  .bar { display: block; height: 100%; background: #2151ea; transition: width .25s ease; }
  .heading {
    text-align: center;
    margin: 18px 0 6px;
    font-size: 20px; font-weight: 700; color: #111827;
  }
  .copy {
    text-align: center; margin: 0 0 14px;
    color: #6b7280; font-size: 14px;
  }
  form { margin-top: 6px; }
  .label { display: block; margin: 14px 0 6px; font-size: 13px; color: #4b5563; }
  .input {
    width: 100%; height: 44px; padding: 0 14px;
    border: 1px solid #e5e7eb; border-radius: 10px; background: #fff;
    font-size: 14px; outline: none;
    transition: box-shadow .15s ease, border-color .15s ease;
  }
  .textarea { height: auto; padding: 10px 14px; resize: vertical; }
  .input:focus { border-color: #2151ea; box-shadow: 0 0 0 3px rgba(33,81,234,.15); }
  .input.invalid { border-color: #dc2626; }
  .error { margin-top: 6px; font-size: 12px; color: #b91c1c; }

  .date-wrap { position: relative; }
  .date-wrap .calendar {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    pointer-events: none; font-size: 16px; opacity: .7;
  }

  .btn.primary {
    width: 100%; height: 46px; margin-top: 18px;
    border: 0; border-radius: 10px; background: #2151ea; color: #fff;
    font-weight: 600; font-size: 15px; cursor: pointer;
    transition: transform .02s ease, opacity .15s ease;
  }
  .btn.primary:active { transform: translateY(1px); }

  .back {
    margin-top: 10px;
    appearance: none; background: transparent; border: 0;
    color: #6b7280; font-size: 14px; cursor: pointer; display: block; width: 100%; text-align: center;
  }
  .back:hover { text-decoration: underline; }

  .footnote { text-align: center; margin: 14px 0 0; color: #6b7280; font-size: 13px; }
  .link { color: #2151ea; text-decoration: none; }
  .link:hover { text-decoration: underline; }
</style>
