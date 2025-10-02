<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";
    import { get_appointment_list } from "../../../helper.js";
    import ShowAppointment from "./ShowAppointment.svelte";

    export let limitStart = 0;
    export let pageLength = 10;

    // ---- Types ----
    type Status =
        | "Approved"
        | "Pending"
        | "Pending Verification"
        | "Completed"
        | "Draft";

    type Booking = {
        name: string; // display title
        darshan_type: string; // e.g. "Shigra Darshan"
        darshan_time: string; // e.g. "10:00 AM" (or "10:00")
        workflow_state: Status;
        darshan_date: string; // ISO date string (YYYY-MM-DD or full ISO)
        timeNote?: string; // e.g. "Flexible Time"
        darshan_companion: { name: string; phone: number; gender: string }[];
        attender: string;
    };

    export let heading = "My Bookings";
    export let subtitle = "View your upcoming and past darshan bookings.";
    export let sectionTitle = "My Bookings";

    // UI state
    let loading = false;
    let error: string | null = null;

    // Data
    export let upcoming: Booking[] = [];
    export let past: Booking[] = [];

    // Modal state for <ShowAppointment>
    let showDetails = false;
    let selected: Booking | null = null;

    const dispatch = createEventDispatcher();

    // ---- Helpers ----
    function badgeClass(status: Status) {
        switch (status) {
            case "Approved":
                return "badge green";
            case "Pending":
                return "badge blue";
            case "Pending Verification":
                return "badge indigo";
            case "Completed":
            case "Draft":
                return "badge gray";
        }
    }

    // Join date + time into a JS Date (best-effort, tolerant of formats)
    function toDate(b: Booking): Date | null {
        const datePart = b.darshan_date?.trim();
        const timePart = b.darshan_time?.trim();
        if (!datePart && !timePart) return null;

        // Try "YYYY-MM-DDTHH:mm" first if both exist
        if (datePart && timePart) {
            // Normalize common time formats (e.g., "10:00 AM" -> "10:00 AM")
            const dt1 = new Date(`${datePart} ${timePart}`);
            if (!isNaN(+dt1)) return dt1;

            const dt2 = new Date(`${datePart}T${timePart}`);
            if (!isNaN(+dt2)) return dt2;
        }

        // Fall back to either piece
        const d1 = datePart ? new Date(datePart) : null;
        if (d1 && !isNaN(+d1)) return d1;

        const d2 = timePart ? new Date(timePart) : null;
        if (d2 && !isNaN(+d2)) return d2;

        return null;
    }

    function splitBookings(all: Booking[]) {
        const now = Date.now();
        const up: Booking[] = [];
        const pa: Booking[] = [];
        for (const b of all) {
            const t = toDate(b)?.getTime();
            if (typeof t === "number" && !isNaN(t) && t >= now) up.push(b);
            else pa.push(b);
        }
        // sort upcoming ascending by datetime, past descending
        up.sort(
            (a, b) => (toDate(a)?.getTime() ?? 0) - (toDate(b)?.getTime() ?? 0),
        );
        pa.sort(
            (a, b) => (toDate(b)?.getTime() ?? 0) - (toDate(a)?.getTime() ?? 0),
        );
        return { up, pa };
    }

    function formatDate(b: Booking) {
        const d = toDate(b);
        if (!d) return b.timeNote ? b.timeNote : "—";
        try {
            // Adjust locale/format as needed:
            const date = new Intl.DateTimeFormat(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "2-digit",
            }).format(d);
            const time = new Intl.DateTimeFormat(undefined, {
                hour: "2-digit",
                minute: "2-digit",
            }).format(d);
            return `${date} • ${time}${b.timeNote ? ` (${b.timeNote})` : ""}`;
        } catch {
            return d.toLocaleString();
        }
    }

    function openDetails(b: Booking) {
        selected = b;
        showDetails = true;
        // If you prefer navigation instead of a modal, replace with:
        // goto(`/bookings/${encodeURIComponent(b.name)}`);
    }

    async function FetchBookings() {
        loading = true;
        error = null;
        try {
            const data = await get_appointment_list(limitStart, pageLength);

            // The helper may return either an array directly or { message: [...] }
            const bookings: Booking[] = Array.isArray(data)
                ? data
                : Array.isArray((data as any)?.message)
                  ? (data as any).message
                  : [];

            const { up, pa } = splitBookings(bookings);
            upcoming = up;
            past = pa;
        } catch (e: any) {
            error = e?.message ?? "Unknown error";
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        FetchBookings();
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
                    on:click={() => goto("/dashboard")}
                >
                    ← Back to Dashboard
                </button>
                <button
                    class="link"
                    type="button"
                    on:click={FetchBookings}
                    aria-label="Refresh bookings"
                    disabled={loading}
                >
                    {#if loading}Refreshing...{:else}Refresh{/if}
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
                        on:click={() => openDetails(b)}
                        aria-label={`Open booking ${b.name}`}
                    >
                        <div class="left">
                            <div class="name">{b.name}</div>
                            <div class="meta">Darshan: {b.darshan_type}</div>
                            <div class="meta">{formatDate(b)}</div>
                        </div>
                        <div class="right">
                            <span class={badgeClass(b.workflow_state)}
                                >{b.workflow_state}</span
                            >
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
                        on:click={() => openDetails(b)}
                        aria-label={`Open booking ${b.name}`}
                    >
                        <div class="left">
                            <div class="name">{b.name}</div>
                            <div class="meta">Darshan: {b.darshan_type}</div>
                            <div class="meta">{formatDate(b)}</div>
                        </div>
                        <div class="right">
                            <span class={badgeClass(b.workflow_state)}
                                >{b.workflow_state}</span
                            >
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

{#if showDetails && selected}
    <!-- Expect ShowAppointment to accept `booking` and dispatch `close` -->
    <ShowAppointment
        {selected}
        booking={selected}
        on:close={() => (showDetails = false)}
    />
{/if}

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
    .badge.blue {
        background: #eff6ff;
        color: #1e40af;
        border-color: #bfdbfe;
    }

    .empty {
        color: #6b7280;
        font-size: 14px;
        padding: 10px 0 4px;
    }
</style>
