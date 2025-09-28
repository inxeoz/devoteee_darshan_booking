<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import BookingDetailsModal, {
        type BookingDetails,
    } from "./BookingDetailsModal.svelte";

    // ---- Types ----
    export type DarshanKind =
        | "VIP Darshan"
        | "Bhasm Arti"
        | "Shigra Darshan"
        | "Localide Darshan";

    export type Summary = {
        kind: DarshanKind;
        received: number;
        approved: number;
        rejected: number;
        accent?: "blue" | "red" | "indigo" | "teal"; // controls top-border color
    };

    export type PendingRow = {
        id: string;
        kind: DarshanKind;
        devotee: string;
        dateISO: string; // yyyy-mm-dd
    };

    type Events = {
        approve: { id: string };
        reject: { id: string };
        view: { id: string };
        approveBulk: { ids: string[] };
        rejectBulk: { ids: string[] };
    };

    const dispatch = createEventDispatcher<Events>();

    // ---- Props (seeded with demo data for preview) ----
    export let asOf = new Date();
    export let summaries: Summary[] = [
        {
            kind: "VIP Darshan",
            received: 2,
            approved: 1,
            rejected: 1,
            accent: "red",
        },
        {
            kind: "Bhasm Arti",
            received: 3,
            approved: 1,
            rejected: 0,
            accent: "red",
        },
        {
            kind: "Shigra Darshan",
            received: 1,
            approved: 1,
            rejected: 1,
            accent: "blue",
        },
        {
            kind: "Localide Darshan",
            received: 1,
            approved: 0,
            rejected: 0,
            accent: "red",
        },
    ];

    export let pending: PendingRow[] = [
        {
            id: "1001",
            kind: "VIP Darshan",
            devotee: "Ramesh Sharma",
            dateISO: "2025-10-15",
        },
        {
            id: "2001",
            kind: "Bhasm Arti",
            devotee: "Amit Varma",
            dateISO: "2025-11-01",
        },
        {
            id: "3003",
            kind: "Shigra Darshan",
            devotee: "Rajesh Kumar",
            dateISO: "2025-10-07",
        },
        {
            id: "2003",
            kind: "Bhasm Arti",
            devotee: "Vikas Gupta",
            dateISO: "2025-10-10",
        },
        {
            id: "1004",
            kind: "VIP Darshan",
            devotee: "Deepak Jain",
            dateISO: "2025-10-12",
        },
        {
            id: "2004",
            kind: "Bhasm Arti",
            devotee: "Geeta Iyer",
            dateISO: "2025-10-08",
        },
        {
            id: "4001",
            kind: "Localide Darshan",
            devotee: "Pooja Tiwari",
            dateISO: "2025-10-20",
        },
    ];

    // ---- Local UI State ----
    let selected: Set<string> = new Set();
    let selectAllChecked = false;
    let search = "";
    let kindFilter: "" | DarshanKind = "";

    // Modal state
    let showDetails = false;
    let details: BookingDetails | null = null;

    const fmtDate = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }); // yyyy-mm-dd

    // ---- Derived ----
    $: filtered = pending
        .filter((r) => (kindFilter ? r.kind === kindFilter : true))
        .filter((r) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return (
                r.id.toLowerCase().includes(q) ||
                r.kind.toLowerCase().includes(q) ||
                r.devotee.toLowerCase().includes(q)
            );
        });

    $: selectAllChecked =
        filtered.length > 0 && filtered.every((r) => selected.has(r.id));

    // ---- Actions ----
    function toggleRow(id: string, checked: boolean) {
        const s = new Set(selected);
        checked ? s.add(id) : s.delete(id);
        selected = s;
    }

    function toggleAll(checked: boolean) {
        const s = new Set(selected);
        filtered.forEach((r) => (checked ? s.add(r.id) : s.delete(r.id)));
        selected = s;
    }

    function approve(id: string) {
        dispatch("approve", { id });
    }
    function reject(id: string) {
        dispatch("reject", { id });
    }

    // Build data for the modal (replace with API fetch in real app)
    function buildBookingDetails(row: PendingRow): BookingDetails {
        return {
            id: row.id,
            type: `${row.kind} Booking`,
            visitDateISO: row.dateISO,
            protocol:
                row.kind === "VIP Darshan"
                    ? "Joint Secretary, MP Govt."
                    : undefined,
            primary: {
                name: row.devotee,
                age: row.kind === "VIP Darshan" ? 45 : 40,
                gender: "Male",
                docs: [{ label: "Aadhar Card", maskedId: "1234xxxx9012" }],
                badge: "Primary Devotee",
            },
            companions: [
                {
                    name: "Priya Sharma",
                    age: 40,
                    gender: "Female",
                    docs: [{ label: "Voter ID", maskedId: "XYZ987xxxx21" }],
                },
                {
                    name: "Ankit Sharma",
                    age: 12,
                    gender: "Male",
                    docs: [
                        { label: "Birth Certificate", maskedId: "BC-00xxxx34" },
                    ],
                },
            ],
            supportingDocumentUrl: "/api/document/sample.pdf",
            supportingDocumentLabel: "View Document",
        };
    }

    function openDetails(id: string) {
        const row = pending.find((p) => p.id === id);
        if (!row) return;
        details = buildBookingDetails(row);
        showDetails = true;
    }

    function view(id: string) {
        // Keep the original event for parent listeners…
        dispatch("view", { id });
        // …and open the modal locally
        openDetails(id);
    }

    function approveSelected() {
        if (selected.size) dispatch("approveBulk", { ids: [...selected] });
    }
    function rejectSelected() {
        if (selected.size) dispatch("rejectBulk", { ids: [...selected] });
    }

    // totals shown at the bottom of each card
    function totalBookings(s: Summary) {
        return s.received + s.approved + s.rejected;
    }
</script>

<div class="wrap">
    <header class="header">
        <h1>Darshan Management Console</h1>
        <p class="muted">
            Workspace for Protocol Officer &amp; Admin. Monitoring status as of
            {asOf.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}.
        </p>
    </header>

    <h3 class="block-title">Booking Summaries</h3>
    <section class="cards">
        {#each summaries as s}
            <article
                class="card {s.accent ?? 'blue'}"
                aria-label={`Summary for ${s.kind}`}
            >
                <h4 class="kind">{s.kind}</h4>
                <div class="rows">
                    <div class="row">
                        <span>Received (Pending)</span><span class="num red"
                            >{s.received}</span
                        >
                    </div>
                    <div class="row">
                        <span>Approved</span><span class="num green"
                            >{s.approved}</span
                        >
                    </div>
                    <div class="row">
                        <span>Rejected</span><span class="num gray"
                            >{s.rejected}</span
                        >
                    </div>
                </div>
                <div class="total">
                    TOTAL BOOKINGS <span class="num">{totalBookings(s)}</span>
                </div>
            </article>
        {/each}
    </section>

    <h3 class="block-title">Bookings Pending Verification</h3>

    <div class="toolbar">
        <div class="filters">
            <input
                class="input"
                placeholder="Search by ID, name, or type"
                bind:value={search}
            />
            <select class="input" bind:value={kindFilter}>
                <option value="">All Types</option>
                <option value="VIP Darshan">VIP Darshan</option>
                <option value="Bhasm Arti">Bhasm Arti</option>
                <option value="Shigra Darshan">Shigra Darshan</option>
                <option value="Localide Darshan">Localide Darshan</option>
            </select>
        </div>
        <div class="bulk">
            <button
                class="btn success"
                on:click={approveSelected}
                disabled={!selected.size}>Approve Selected</button
            >
            <button
                class="btn danger"
                on:click={rejectSelected}
                disabled={!selected.size}>Reject Selected</button
            >
        </div>
    </div>

    <section
        class="table-wrap"
        role="region"
        aria-label="Bookings Pending Verification"
    >
        <table class="table">
            <thead>
                <tr>
                    <th style="width:36px">
                        <input
                            type="checkbox"
                            bind:checked={selectAllChecked}
                            on:change={(e) =>
                                toggleAll(
                                    (e.target as HTMLInputElement).checked,
                                )}
                            aria-label="Select all"
                        />
                    </th>
                    <th>Booking ID</th>
                    <th>Type</th>
                    <th>Devotee Name</th>
                    <th>Date</th>
                    <th style="text-align:center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each filtered as r}
                    <tr>
                        <td>
                            <input
                                type="checkbox"
                                checked={selected.has(r.id)}
                                on:change={(e) =>
                                    toggleRow(
                                        r.id,
                                        (e.target as HTMLInputElement).checked,
                                    )}
                                aria-label={`Select booking ${r.id}`}
                            />
                        </td>
                        <td>{r.id}</td>
                        <td
                            ><span
                                class="type {r.kind
                                    .replace(/\s+/g, '-')
                                    .toLowerCase()}">{r.kind}</span
                            ></td
                        >
                        <td>{r.devotee}</td>
                        <td>{fmtDate.format(new Date(r.dateISO))}</td>
                        <td class="actions">
                            <button
                                class="link green"
                                on:click={() => approve(r.id)}>Approve</button
                            >
                            <span class="sep">|</span>
                            <button class="link" on:click={() => view(r.id)}
                                >View</button
                            >
                            <span class="sep">|</span>
                            <button
                                class="link red"
                                on:click={() => reject(r.id)}>Reject</button
                            >
                        </td>
                    </tr>
                {/each}
                {#if filtered.length === 0}
                    <tr
                        ><td colspan="6" class="empty"
                            >No bookings found for the current filters.</td
                        ></tr
                    >
                {/if}
            </tbody>
        </table>
    </section>

    <!-- Booking Details Modal -->
    {#if details}
        <BookingDetailsModal
            bind:open={showDetails}
            booking={details}
            on:close={() => (showDetails = false)}
            on:approve={(e) => {
                dispatch("approve", { id: e.detail.id });
                showDetails = false;
            }}
            on:reject={(e) => {
                dispatch("reject", { id: e.detail.id });
                showDetails = false;
            }}
            on:viewDocument={(e) => window.open(e.detail.url, "_blank")}
        />
    {/if}
</div>

<style>
    .wrap {
        padding: 18px 18px 28px;
        background: #f6f7f9;
        min-height: 100vh;
    }
    .header h1 {
        margin: 4px 0 2px;
        font-size: 28px;
        color: #101828;
    }
    .muted {
        color: #6b7280;
    }

    .block-title {
        margin: 18px 0 8px;
        font-size: 18px;
        color: #1f2937;
        font-weight: 800;
    }

    /* Summary cards */
    .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
    }
    @media (max-width: 980px) {
        .cards {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 560px) {
        .cards {
            grid-template-columns: 1fr;
        }
    }

    .card {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 6px 16px rgba(16, 24, 40, 0.08);
        padding: 12px 14px 10px;
        border-top: 4px solid #3b82f6;
    }
    .card.red {
        border-top-color: #ef4444;
    }
    .card.blue {
        border-top-color: #2563eb;
    }
    .card.indigo {
        border-top-color: #4f46e5;
    }
    .card.teal {
        border-top-color: #14b8a6;
    }

    .kind {
        margin: 0 0 6px;
        color: #0f172a;
        font-size: 16px;
        font-weight: 800;
    }
    .rows {
        display: grid;
        gap: 6px;
        font-size: 13px;
        color: #334155;
    }
    .row {
        display: flex;
        justify-content: space-between;
    }
    .num {
        font-weight: 700;
    }
    .num.red {
        color: #ef4444;
    }
    .num.green {
        color: #16a34a;
    }
    .num.gray {
        color: #6b7280;
    }
    .total {
        margin-top: 6px;
        padding-top: 6px;
        border-top: 2px solid #e5e7eb;
        font-weight: 800;
        color: #111827;
        font-size: 12px;
        letter-spacing: 0.02em;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* Toolbar */
    .toolbar {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        margin: 8px 0 10px;
    }
    .filters {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }
    .input {
        height: 36px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 0 10px;
        background: #fff;
        outline: none;
        transition:
            box-shadow 0.15s ease,
            border-color 0.15s ease;
    }
    .input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .bulk {
        display: flex;
        gap: 8px;
    }
    .btn {
        height: 36px;
        border: 0;
        border-radius: 8px;
        padding: 0 12px;
        color: #fff;
        font-weight: 700;
        cursor: pointer;
    }
    .btn.success {
        background: #16a34a;
    }
    .btn.danger {
        background: #dc2626;
    }
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    /* Table */
    .table-wrap {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 6px 16px rgba(16, 24, 40, 0.08);
        padding: 10px;
        overflow-x: auto;
    }
    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }
    thead th {
        text-align: left;
        font-size: 12px;
        color: #6b7280;
        font-weight: 700;
        letter-spacing: 0.02em;
        padding: 10px 8px;
        border-bottom: 1px solid #e5e7eb;
    }
    tbody td {
        padding: 10px 8px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
        color: #0f172a;
    }
    tbody tr:hover {
        background: #f8fafc;
    }

    .type {
        font-weight: 700;
    }
    .type.vip-darshan {
        color: #b91c1c;
    }
    .type.bhasm-arti {
        color: #b91c1c;
    }
    .type.shigra-darshan {
        color: #b45309;
    }
    .type.localide-darshan {
        color: #2563eb;
    }

    .actions {
        text-align: center;
    }
    .link {
        background: transparent;
        border: 0;
        color: #2563eb;
        cursor: pointer;
        padding: 0;
        font-weight: 600;
    }
    .link.green {
        color: #16a34a;
    }
    .link.red {
        color: #dc2626;
    }
    .sep {
        color: #cbd5e1;
        margin: 0 8px;
    }
    .empty {
        text-align: center;
        color: #6b7280;
        padding: 20px 0;
    }
</style>
