<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // You can tweak these from the parent if needed
  export let progress = 50;   // percent for the progress bar
  export let loading = false; // disable buttons / show pending state

  const complete = () => dispatch("complete");
  const skip = () => dispatch("skip");
  const back = () => dispatch("back");
</script>

<div class="page">
  <div class="card" role="region" aria-labelledby="title">
    <h1 id="title" class="title">Register with Us</h1>
    <p class="subtitle">Create your account to get started.</p>

    <div class="progress" aria-label="Progress">
      <span class="bar" style="width: {Math.max(0, Math.min(100, progress))}%"></span>
    </div>

    <h2 class="heading">Complete your eKYC</h2>
    <p class="copy">
      Complete your eKYC now to unlock all features. You can also skip this
      step and do it later.
    </p>

    <div class="actions">
      <button class="btn primary" on:click={complete} disabled={loading} aria-busy={loading ? 'true' : 'false'}>
        {#if loading}Processing…{/if}{#if !loading}Complete eKYC{/if}
      </button>

      <button class="btn secondary" on:click={skip} disabled={loading}>
        Skip for now
      </button>
    </div>

    <button class="back" type="button" on:click={back} aria-label="Go back">
      ← Back
    </button>

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
    width: min(620px, 92vw);
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 10px 28px rgba(16, 24, 40, 0.12);
    padding: 36px 40px 32px;
    text-align: center;
  }
  .title {
    margin: 0 0 6px;
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
  }
  .subtitle {
    margin: 0 0 18px;
    color: #6b7280;
    font-size: 14px;
  }
  .progress {
    height: 4px;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
    margin: 10px 0 22px;
  }
  .bar {
    display: block;
    height: 100%;
    background: #2151ea;
    transition: width .25s ease;
  }
  .heading {
    margin: 6px 0 6px;
    font-size: 20px;
    color: #111827;
    font-weight: 700;
  }
  .copy {
    margin: 0 auto 18px;
    color: #6b7280;
    font-size: 14px;
    max-width: 520px;
    line-height: 1.5;
  }
  .actions { display: grid; gap: 12px; margin-top: 14px; }
  .btn {
    height: 46px;
    border: 0;
    border-radius: 10px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: transform .02s ease, filter .15s ease, opacity .15s ease;
    width: 100%;
  }
  .btn:active { transform: translateY(1px); }
  .btn:disabled { opacity: .7; cursor: not-allowed; }
  .btn.primary { background: #2151ea; color: #fff; }
  .btn.secondary { background: #e5e7eb; color: #111827; }
  .back {
    appearance: none;
    background: transparent;
    border: 0;
    color: #6b7280;
    font-size: 14px;
    cursor: pointer;
    margin: 12px 0 0;
  }
  .back:hover { text-decoration: underline; }
  .footnote {
    margin: 14px 0 0;
    color: #6b7280;
    font-size: 13px;
  }
  .link { color: #2151ea; text-decoration: none; }
  .link:hover { text-decoration: underline; }
</style>
