<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{
        action: { id: string; label: string };
        logout: void;
    }>();

    // Title/subtitle
    export let title: string = "Dashboard";
    export let welcome: string = "Welcome back!";

    // Secondary headline and helper text inside the card
    export let panelTitle: string = "Dashboard";
    export let panelHelp: string = "Welcome! Please select an option below.";

    // Actions shown as full-width buttons
    export interface Action {
        id: string;
        label: string;
    }

    export let actions: Action[] = [
        { id: "viewBookings", label: "View Bookings" },
        { id: "bookShigra", label: "Book - Shigra Darshan" },
        { id: "bookVip", label: "Book - VIP Darshan" },
        { id: "bookLocalide", label: "Book - Localide Darshan" },
        { id: "bookBhasm", label: "Book - Bhasm Arti" },
    ];

    // Which action (index) should use the alternate (purple) color
    export let accentIndex: number = 2;

    function onClick(action: Action) {
        dispatch("action", action);
    }
    function logout() {
        dispatch("logout");
    }
</script>

<div class="page">
    <div class="card" role="region" aria-labelledby="title">
        <h1 id="title" class="title">{title}</h1>
        <p class="subtitle">{welcome}</p>

        <h2 class="panel-title">{panelTitle}</h2>
        <p class="panel-help">{panelHelp}</p>

        <div class="stack">
            {#each actions as action, i}
                <button
                    class="btn {i === accentIndex ? 'alt' : 'primary'}"
                    type="button"
                    on:click={() => onClick(action)}
                >
                    {action.label}
                </button>
            {/each}
        </div>

        <button type="button" class="logout" on:click={logout}>Logout</button>
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
        line-height: 1.2;
        color: #1f2937;
    }
    .subtitle {
        margin: 0 12px 18px;
        color: #6b7280;
        font-size: 14px;
    }
    .panel-title {
        margin: 4px 0 6px;
        font-size: 20px;
        font-weight: 700;
        color: #111827;
    }
    .panel-help {
        margin: 0 0 16px;
        color: #6b7280;
        font-size: 14px;
    }
    .stack {
        display: grid;
        gap: 12px;
        margin: 16px 0 10px;
    }

    .btn {
        height: 44px;
        border: 0;
        border-radius: 10px;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition:
            transform 0.02s ease,
            filter 0.15s ease,
            opacity 0.15s ease;
        width: 100%;
        color: #fff;
    }
    .btn:active {
        transform: translateY(1px);
    }
    .btn.primary {
        background: #2151ea;
    }
    .btn.alt {
        background: #443de0;
    }

    .logout {
        appearance: none;
        background: transparent;
        border: 0;
        color: #6b7280;
        font-size: 14px;
        margin-top: 8px;
        cursor: pointer;
    }
    .logout:hover {
        text-decoration: underline;
    }
</style>
