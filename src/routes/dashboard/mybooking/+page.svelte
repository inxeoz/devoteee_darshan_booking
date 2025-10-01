<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";

    type Status = "Approved" | "Pending" | "Pending Verification" | "Completed";

    export type Booking = {
        id: string;
        title: string; // e.g. "Shigra Darshan"
        status: Status;
        datetime: string; // ISO date string
        timeNote?: string; // e.g. "Flexible Time"
    };

    type Events = {
        back: void;
        open: { id: string };
    };

    const dispatch = createEventDispatcher<Events>();

    export let heading = "My Bookings";
    export let subtitle = "View your upcoming and past darshan bookings.";
    export let sectionTitle = "My Bookings";

    // API configuration (can be overridden by parent)
    export let apiUrl: string = "http://localhost:1880/get_appointment_list";
    export let authToken: string = "18ad6b1e9144a9069024092cfc2e47d0";

    // UI state
    let loading = false;
    let error: string | null = null;

    // Bookings arrays (initial sample data kept for preview; will be replaced on fetch)
    export let upcoming: Booking[] = [];

    export let past: Booking[] = [];

    const fmt = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    function formatDate(s: string, note?: string) {
        const d = new Date(s);
        return `Date/Time: ${fmt.format(d)}${note ? ` at ${note}` : ""}`;
    }

    function badgeClass(status: string) {
        switch (status) {
            case "Approved":
                return "badge green";
            case "Pending":
                return "badge blue";
            case "Pending Verification":
                return "badge indigo";
            case "Completed":
                return "badge gray";
            case "Draft":
                return "badge gray";
        }
    }

    const open = (id: string) => dispatch("open", { id });
    const back = () => dispatch("back");

    // Convert API row to Booking
    function mapApiRowToBooking(row: any): Booking {
        // API fields from your example:
        // { "name":"DA00008","darshan_date":"2025-10-05","darshan_time":"7:30:00","darshan_type":"Vip Darshan",...,"workflow_state":"Pending"}
        const datePart = row.darshan_date ?? "";
        const timePart = row.darshan_time ?? "00:00:00";

        // Try build full ISO string using local timezone assumption.
        // If darshan_date is 'YYYY-MM-DD' and timePart is 'HH:mm:ss'
        let iso = "";
        try {
            // Construct "YYYY-MM-DDTHH:mm:ss" — treat as local time by not appending Z
            iso = `${datePart}T${timePart}`;
            // validate
            const d = new Date(iso);
            if (Number.isNaN(d.getTime())) {
                // fallback to just date
                iso = `${datePart}T00:00:00`;
            }
        } catch {
            iso = `${datePart}T00:00:00`;
        }

        return {
            id: row.name ?? String(Math.random()).slice(2),
            title: row.darshan_type ?? "Darshan",
            status: row.workflow_state,
            datetime: iso,
            // show a time note if provided by API (none in example)
            timeNote: row.time_note ?? row.timeNote ?? undefined,
        };
    }

    // Split bookings into upcoming vs past relative to now
    function splitBookings(all: Booking[]) {
        const now = Date.now();
        const up: Booking[] = [];
        const pa: Booking[] = [];
        for (const b of all) {
            const t = new Date(b.datetime).getTime();
            if (!isNaN(t) && t >= now) up.push(b);
            else pa.push(b);
        }
        // sort upcoming ascending by date, past descending
        up.sort(
            (a, b) =>
                new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
        );
        pa.sort(
            (a, b) =>
                new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
        );
        return { up, pa };
    }

    async function loadBookings() {
        loading = true;
        error = null;
        try {
            const res = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    auth_token: authToken,
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`HTTP ${res.status}: ${txt}`);
            }

            const payload = await res.json();
            // You showed an example where the response is { "message": [ ...rows... ] }
            // Be defensive: allow either top-level array or { message: array }
            const rows = Array.isArray(payload)
                ? payload
                : Array.isArray(payload.message)
                  ? payload.message
                  : [];
            const bookings = rows.map(mapApiRowToBooking);

            const { up, pa } = splitBookings(bookings);
            upcoming = up;
            past = pa;
        } catch (err: any) {
            console.error("Failed to load bookings", err);
            error = err?.message ?? String(err);
            // keep existing data if any
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        loadBookings();
    });
</script>

<div class="page">
    <div class="card">
        <h1 class="title">{heading}</h1>
        <p class="subtitle">{subtitle}</p>

        <div class="row">
            <h2 class="section">{sectionTitle}</h2>
            <div style="display:flex; gap:10px; align-items:center">
                <button
                    class="link"
                    type="button"
                    on:click={() => {
                        goto("/dashboard");
                    }}>← Back to Dashboard</button
                >
                <button
                    class="link"
                    type="button"
                    on:click={loadBookings}
                    aria-label="Refresh bookings"
                >
                    {#if loading}
                        Refreshing...
                    {:else}
                        Refresh
                    {/if}
                </button>
            </div>
        </div>

        {#if error}
            <div style="color: #b91c1c; margin-bottom:12px">
                Error loading bookings: {error}
            </div>
        {/if}

        <h3 class="subhead">Upcoming Bookings</h3>
        <div class="list">
            {#if loading && upcoming.length === 0}
                <div class="empty">Loading upcoming bookings…</div>
            {:else}
                {#each upcoming as b}
                    <button
                        class="item"
                        type="button"
                        on:click={() => open(b.id)}
                        aria-label={`Open booking ${b.id}`}
                    >
                        <div class="left">
                            <div class="name">{b.title}</div>
                            <div class="meta">Booking ID: {b.id}</div>
                            <div class="meta">
                                {formatDate(b.datetime, b.timeNote)}
                            </div>
                        </div>
                        <div class="right">
                            <span class={badgeClass(b.status)}>{b.status}</span>
                        </div>
                    </button>
                {/each}
                {#if upcoming.length === 0 && !loading}
                    <div class="empty">No upcoming bookings.</div>
                {/if}
            {/if}
        </div>

        <h3 class="subhead">Past Bookings</h3>
        <div class="list">
            {#if loading && past.length === 0}
                <div class="empty">Loading past bookings…</div>
            {:else}
                {#each past as b}
                    <button
                        class="item"
                        type="button"
                        on:click={() => open(b.id)}
                    >
                        <div class="left">
                            <div class="name">{b.title}</div>
                            <div class="meta">Booking ID: {b.id}</div>
                            <div class="meta">
                                {formatDate(b.datetime, b.timeNote)}
                            </div>
                        </div>
                        <div class="right">
                            <span class={badgeClass(b.status)}>{b.status}</span>
                        </div>
                    </button>
                {/each}
                {#if past.length === 0 && !loading}
                    <div class="empty">No past bookings.</div>
                {/if}
            {/if}
        </div>
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
        place-items: start center;
        padding: 24px;
    }
    .card {
        width: min(720px, 94vw);
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 10px 28px rgba(16, 24, 40, 0.12);
        padding: 28px 24px 24px;
        margin-top: 8px;
    }

    .title {
        text-align: center;
        margin: 0 0 6px;
        font-size: 28px;
        font-weight: 800;
        color: #1f2937;
    }
    .subtitle {
        text-align: center;
        margin: 0 0 18px;
        color: #6b7280;
        font-size: 14px;
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    .section {
        margin: 0;
        font-size: 20px;
        font-weight: 800;
        color: #111827;
    }
    .link {
        background: transparent;
        border: 0;
        color: #2151ea;
        cursor: pointer;
        font-size: 14px;
    }
    .link:hover {
        text-decoration: underline;
    }

    .subhead {
        margin: 12px 0 8px;
        font-size: 16px;
        color: #374151;
        font-weight: 700;
    }

    .list {
        display: grid;
        gap: 10px;
    }
    .item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        width: 100%;
        text-align: left;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 14px 16px;
        background: #fff;
        cursor: pointer;
        transition:
            box-shadow 0.15s ease,
            transform 0.02s ease;
    }
    .item:hover {
        box-shadow: 0 6px 16px rgba(16, 24, 40, 0.08);
    }
    .item:active {
        transform: translateY(1px);
    }

    .name {
        font-weight: 700;
        color: #111827;
    }
    .meta {
        font-size: 12px;
        color: #6b7280;
        margin-top: 2px;
    }
    .right {
        display: grid;
        align-content: start;
    }

    .badge {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 999px;
        border: 1px solid transparent;
        background: #eef2ff;
        color: #3730a3;
    }
    .badge.green {
        background: #ecfdf5;
        color: #065f46;
        border-color: #a7f3d0;
    }
    .badge.gray {
        background: #eef2ff;
        color: #4b5563;
        border-color: #e5e7eb;
    }
    .badge.indigo {
        background: #eef2ff;
        color: #4338ca;
        border-color: #c7d2fe;
    }

    .empty {
        color: #6b7280;
        font-size: 14px;
        padding: 10px 0 4px;
    }
</style>
