<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from "svelte";

    // ---- Types ----
    export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

    export type Doc = {
        label: string; // e.g. "Aadhar Card", "Voter ID"
        maskedId: string; // e.g. "1234xxxx9012"
    };

    export type Person = {
        name: string;
        age?: number;
        gender?: Gender;
        docs?: Doc[]; // identification docs
        badge?: string; // "Primary Devotee" | "Companion 1" | ...
    };

    export type BookingDetails = {
        id: string;
        type: string; // e.g. "VIP Darshan Booking"
        visitDateISO: string; // "yyyy-mm-dd"
        companionsCount?: number; // display only; companions.length if omitted
        protocol?: string; // primary protocol text (if any)
        primary: Person;
        companions?: Person[];
        supportingDocumentUrl?: string;
        supportingDocumentLabel?: string; // defaults to "View Document"
    };

    type Events = {
        close: void;
        approve: { id: string };
        reject: { id: string };
        viewDocument: { url: string };
    };

    const dispatch = createEventDispatcher<Events>();

    // ---- Props ----
    export let open = false;
    export let booking!: BookingDetails;

    // ---- Helpers ----
    const fmtDate = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    function initial(name: string) {
        return (name?.trim()?.[0] ?? "P").toUpperCase();
    }

    // ---- Events ----
    function close() {
        dispatch("close");
    }
    function approve() {
        dispatch("approve", { id: booking.id });
    }
    function reject() {
        dispatch("reject", { id: booking.id });
    }
    function viewDocument() {
        if (booking.supportingDocumentUrl) {
            dispatch("viewDocument", { url: booking.supportingDocumentUrl });
        }
    }

    // ---- Accessibility: ESC to close + focus handling ----
    let closeBtn: HTMLButtonElement | null = null;

    function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") {
            e.preventDefault();
            close();
        }
    }

    onMount(() => {
        document.addEventListener("keydown", onKey);
    });
    onDestroy(() => {
        document.removeEventListener("keydown", onKey);
    });

    $: if (open) {
        // Focus the close button when modal opens
        queueMicrotask(() => closeBtn?.focus());
    }

    // derived
    $: companionCount =
        booking?.companionsCount ?? booking?.companions?.length ?? 0;

    $: visitDateStr = booking
        ? fmtDate.format(new Date(booking.visitDateISO))
        : "";
</script>

{#if open}
    <div
        class="overlay"
        role="presentation"
        on:click={(e) => e.target === e.currentTarget && close()}
    >
        <section
            class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bd-title"
            aria-describedby="bd-subtitle"
        >
            <!-- Header -->
            <header class="header">
                <h2 id="bd-title">Booking Details</h2>
                <button
                    class="icon"
                    aria-label="Close"
                    bind:this={closeBtn}
                    on:click={close}>✕</button
                >
            </header>

            <div class="divider"></div>

            <!-- Title row -->
            <div class="title-row">
                <div class="head-strong">
                    {booking.type} - ID: {booking.id}
                </div>
                <div id="bd-subtitle" class="subline">
                    <b>Visit Date:</b>
                    {visitDateStr}
                    {#if typeof companionCount === "number"}
                        | <b>Companions:</b> {companionCount}{/if}
                </div>
            </div>

            <!-- Primary Devotee card -->
            <section class="card">
                <div class="avatar">{initial(booking.primary.name)}</div>
                <div class="info">
                    <div class="line">
                        <span class="name">{booking.primary.name}</span>
                        {#if booking.primary.badge}
                            <span class="chip indigo"
                                >{booking.primary.badge}</span
                            >
                        {/if}
                    </div>

                    <div class="grid">
                        {#if booking.primary.age !== undefined}
                            <div>
                                <span class="muted">Age:</span>
                                <b>{booking.primary.age}</b>
                            </div>
                        {/if}
                        {#if booking.primary.gender}
                            <div>
                                <span class="muted">Gender:</span>
                                <b>{booking.primary.gender}</b>
                            </div>
                        {/if}
                    </div>

                    <!-- Docs & protocol -->
                    <div class="grid">
                        {#if booking.primary.docs}
                            {#each booking.primary.docs as d}
                                <div>
                                    <span class="muted">{d.label}:</span>
                                    <b>{d.maskedId}</b>
                                </div>
                            {/each}
                        {/if}
                        {#if booking.protocol}
                            <div>
                                <span class="muted">Protocol:</span>
                                <b class="danger">{booking.protocol}</b>
                            </div>
                        {/if}
                    </div>

                    <!-- Supporting document -->
                    {#if booking.supportingDocumentUrl}
                        <div class="docbox">
                            <div class="muted small">Supporting Document:</div>
                            <button
                                class="link"
                                type="button"
                                on:click={viewDocument}
                            >
                                {booking.supportingDocumentLabel ??
                                    "View Document"}
                            </button>
                        </div>
                    {/if}
                </div>
            </section>

            <!-- Companion list -->
            {#if booking.companions && booking.companions.length}
                <h3 class="section-title">Companion Details</h3>
                {#each booking.companions as c, i}
                    <section class="card light">
                        <div class="avatar green">{initial(c.name)}</div>
                        <div class="info">
                            <div class="line">
                                <span class="name">{c.name}</span>
                                <span class="chip">{`Companion ${i + 1}`}</span>
                            </div>
                            <div class="grid">
                                {#if c.age !== undefined}
                                    <div>
                                        <span class="muted">Age:</span>
                                        <b>{c.age}</b>
                                    </div>
                                {/if}
                                {#if c.gender}
                                    <div>
                                        <span class="muted">Gender:</span>
                                        <b>{c.gender}</b>
                                    </div>
                                {/if}
                            </div>
                            {#if c.docs}
                                <div class="grid">
                                    {#each c.docs as d}
                                        <div>
                                            <span class="muted">{d.label}:</span
                                            > <b>{d.maskedId}</b>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </section>
                {/each}
            {/if}

            <!-- Footer actions -->
            <footer class="footer">
                <button class="btn danger" on:click={reject}
                    >Reject Booking</button
                >
                <button class="btn success" on:click={approve}
                    >Approve Booking</button
                >
            </footer>
        </section>
    </div>
{/if}

<style>
    /* Backdrop */
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(3, 7, 18, 0.55);
        display: grid;
        place-items: center;
        padding: 16px;
        z-index: 50;
    }

    /* Modal frame */
    .modal {
        width: min(880px, 96vw);
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 24px 60px rgba(16, 24, 40, 0.35);
        overflow: hidden;
    }

    .header {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        padding: 14px 18px;
    }
    .header h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 800;
        color: #111827;
    }
    .icon {
        appearance: none;
        border: 0;
        background: transparent;
        cursor: pointer;
        font-size: 18px;
        color: #6b7280;
        padding: 6px;
        line-height: 1;
    }
    .icon:focus {
        outline: 3px solid rgba(37, 99, 235, 0.25);
        border-radius: 6px;
    }

    .divider {
        height: 1px;
        background: #e5e7eb;
    }

    .title-row {
        padding: 14px 18px 8px;
    }
    .head-strong {
        font-size: 16px;
        font-weight: 800;
        color: #111827;
    }
    .subline {
        margin-top: 6px;
        color: #4b5563;
        font-size: 14px;
    }

    /* Cards */
    .card {
        margin: 10px 18px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        background: #eaf1ff;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 12px;
        padding: 12px;
    }
    .card.light {
        background: #f8fafc;
    }
    .avatar {
        width: 54px;
        height: 54px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: #2563eb;
        color: #fff;
        font-weight: 800;
        font-size: 20px;
    }
    .avatar.green {
        background: #10b981;
    }
    .info {
        align-self: center;
    }
    .line {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 4px;
    }
    .name {
        font-weight: 800;
        color: #111827;
    }
    .chip {
        background: #e5e7eb;
        color: #111827;
        border-radius: 999px;
        font-size: 11px;
        padding: 4px 8px;
        font-weight: 700;
    }
    .chip.indigo {
        background: #e0e7ff;
        color: #3730a3;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        font-size: 14px;
        color: #111827;
        margin: 6px 0;
    }
    @media (max-width: 640px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }
    .muted {
        color: #6b7280;
    }
    .small {
        font-size: 12px;
    }
    .danger {
        color: #b91c1c;
    }

    /* Document box */
    .docbox {
        margin-top: 8px;
        padding: 10px 12px;
        border: 2px dashed #bfd0ff;
        border-radius: 10px;
        background: #f6f9ff;
        display: flex;
        gap: 10px;
        align-items: center;
    }
    .link {
        appearance: none;
        border: 0;
        background: transparent;
        color: #2563eb;
        text-decoration: none;
        cursor: pointer;
        font-weight: 700;
        padding: 0;
    }
    .link:hover {
        text-decoration: underline;
    }

    .section-title {
        margin: 12px 18px 4px;
        font-size: 15px;
        font-weight: 800;
        color: #374151;
    }

    /* Footer buttons */
    .footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 14px 18px 16px;
        border-top: 1px solid #e5e7eb;
    }
    .btn {
        height: 40px;
        padding: 0 14px;
        border: 0;
        border-radius: 10px;
        color: #fff;
        font-weight: 800;
        cursor: pointer;
    }
    .btn.success {
        background: #16a34a;
    }
    .btn.danger {
        background: #dc2626;
    }
</style>
