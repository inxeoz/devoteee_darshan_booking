<script lang="ts">
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

    // Provide data from parent; seeded with sample rows for quick preview.
    export let upcoming: Booking[] = [
        {
            id: "123456",
            title: "Shigra Darshan",
            status: "Approved",
            datetime: "2025-12-25T10:30:00",
        },
        {
            id: "345678",
            title: "Bhasm Arti",
            status: "Pending",
            datetime: "2025-11-01T04:00:00",
        },
        {
            id: "901234",
            title: "VIP Darshan",
            status: "Approved",
            datetime: "2025-10-01T12:00:00",
        },
        {
            id: "RJWQ250",
            title: "VIP Darshan (Protocol)",
            status: "Pending Verification",
            datetime: "2025-09-30T00:00:00",
            timeNote: "Flexible Time",
        },
    ];

    export let past: Booking[] = [
        {
            id: "789010",
            title: "Localide Darshan",
            status: "Completed",
            datetime: "2024-05-10T14:00:00",
        },
    ];

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

    function badgeClass(status: Status) {
        switch (status) {
            case "Approved":
                return "badge green";
            case "Pending":
                return "badge gray";
            case "Pending Verification":
                return "badge indigo";
            case "Completed":
                return "badge gray";
        }
    }

    const open = (id: string) => dispatch("open", { id });
    const back = () => dispatch("back");
</script>

<div class="page">
    <div class="card">
        <h1 class="title">{heading}</h1>
        <p class="subtitle">{subtitle}</p>

        <div class="row">
            <h2 class="section">{sectionTitle}</h2>
            <button class="link" type="button" on:click={back}
                >← Back to Dashboard</button
            >
        </div>

        <h3 class="subhead">Upcoming Bookings</h3>
        <div class="list">
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
            {#if upcoming.length === 0}
                <div class="empty">No upcoming bookings.</div>
            {/if}
        </div>

        <h3 class="subhead">Past Bookings</h3>
        <div class="list">
            {#each past as b}
                <button class="item" type="button" on:click={() => open(b.id)}>
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
            {#if past.length === 0}
                <div class="empty">No past bookings.</div>
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
