<script lang="ts">
    import { onMount, createEventDispatcher, onDestroy } from "svelte";
    import { get_appointment } from "@src/helper.js";
    // Props
    export let appointmentId: string; // required
    const dispatch = createEventDispatcher();

    // UI state
    let loading = false;
    let error: string | null = null;
    let data: any = null; // the API "message" object
    let showRaw = false;

    // Format date/time nicely
    function formatDateTime(dateStr: string, timeStr: string) {
        try {
            if (!dateStr && !timeStr) return "—";
            const candidate =
                dateStr && timeStr
                    ? `${dateStr}T${timeStr}`
                    : (dateStr ?? timeStr);
            const d = new Date(candidate);
            if (isNaN(+d)) {
                // fallback: try space-separated
                const d2 = new Date(`${dateStr} ${timeStr}`);
                if (!isNaN(+d2)) return d2.toLocaleString();
                return `${dateStr ?? ""} ${timeStr ?? ""}`.trim();
            }
            return new Intl.DateTimeFormat(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }).format(d);
        } catch {
            return `${dateStr ?? ""} ${timeStr ?? ""}`.trim();
        }
    }

    async function fetchAppointment() {
        if (!appointmentId) {
            error = "No appointment id provided.";
            return;
        }
        loading = true;
        error = null;
        data = null;

        try {
            console.log("appointmentId", appointmentId);
            const payload = await get_appointment(appointmentId);

            if (payload && payload.message) {
                data = payload.message;
            } else {
                data = payload;
            }
        } catch (err: any) {
            error = err?.message ?? String(err);
        } finally {
            loading = false;
        }
    }

    // close helpers
    function close() {
        dispatch("close");
    }

    // close on ESC
    function onKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") close();
    }

    onMount(() => {
        fetchAppointment();
        window.addEventListener("keydown", onKeydown);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", onKeydown);
    });
</script>

{#if true}
    <!-- Backdrop -->
    <div
        class="backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Appointment details"
        on:click={(e) => {
            // close only when clicking backdrop (not modal content)
            if ((e.target as HTMLElement)?.classList?.contains("backdrop"))
                close();
        }}
    >
        <div class="modal" on:click|stopPropagation>
            <header class="modal-header">
                <h2>Appointment Details</h2>
                <button class="icon-btn" aria-label="Close" on:click={close}
                    >✕</button
                >
            </header>

            <main class="modal-body">
                {#if loading}
                    <div class="center">Loading appointment…</div>
                {:else if error}
                    <div class="error">Error: {error}</div>
                {:else if data}
                    <section class="grid">
                        <div class="row">
                            <strong>Appointment ID</strong><span
                                >{data.name ?? data.appointment_id ?? "—"}</span
                            >
                        </div>
                        <div class="row">
                            <strong>Status</strong><span
                                >{data.workflow_state ??
                                    data.status ??
                                    "—"}</span
                            >
                        </div>
                        <div class="row">
                            <strong>Type</strong><span
                                >{data.darshan_type ?? "—"}</span
                            >
                        </div>
                        <div class="row">
                            <strong>Date & Time</strong>
                            <span
                                >{formatDateTime(
                                    data.darshan_date,
                                    data.darshan_time,
                                )}</span
                            >
                        </div>
                        <div class="row">
                            <strong>With Protocol</strong><span
                                >{data.darshan_with_protocol
                                    ? "Yes"
                                    : "No"}</span
                            >
                        </div>
                        {#if data.protocol_rank}
                            <div class="row">
                                <strong>Protocol Rank</strong><span
                                    >{data.protocol_rank}</span
                                >
                            </div>
                        {/if}
                        {#if data.government_authority_letter}
                            <div class="row">
                                <strong>Authority Letter</strong><span
                                    >{data.government_authority_letter}</span
                                >
                            </div>
                        {/if}
                        {#if data.devoteee_profile}
                            <div class="row">
                                <strong>Devotee Profile</strong><span
                                    >{data.devoteee_profile}</span
                                >
                            </div>
                        {/if}
                    </section>

                    <section class="subsection">
                        <h3>Companions</h3>
                        {#if Array.isArray(data.darshan_companion) && data.darshan_companion.length > 0}
                            <ul class="companions">
                                {#each data.darshan_companion as c}
                                    <li>
                                        <div class="comp-left">
                                            <div class="comp-name">
                                                {c.companion_name ??
                                                    c.companion_name ??
                                                    "Unknown"}
                                            </div>
                                            <div class="comp-meta">
                                                {c.companion_gender ??
                                                    c.companion_gender ??
                                                    ""}
                                            </div>
                                        </div>
                                        <div class="comp-right">
                                            {c.companion_phone ??
                                                c.companion_phone ??
                                                "—"}
                                        </div>
                                    </li>
                                {/each}
                            </ul>
                        {:else}
                            <div class="empty">No companions listed.</div>
                        {/if}
                    </section>

                    <!-- optional raw JSON toggle -->
                    <section class="subsection">
                        <button
                            class="small"
                            on:click={() => (showRaw = !showRaw)}
                        >
                            {showRaw ? "Hide JSON" : "Show raw JSON"}
                        </button>

                        {#if showRaw}
                            <pre class="raw">{JSON.stringify(
                                    data,
                                    null,
                                    2,
                                )}</pre>
                        {/if}
                    </section>
                {:else}
                    <div class="center">No data available.</div>
                {/if}
            </main>

            <footer class="modal-footer">
                <button class="primary" on:click={close}>Close</button>
            </footer>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(14, 20, 30, 0.56);
        display: grid;
        place-items: center;
        z-index: 1200;
        padding: 20px;
    }

    .modal {
        width: min(820px, 98vw);
        max-height: 90vh;
        overflow: auto;
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 12px 40px rgba(16, 24, 40, 0.5);
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    }
    .modal-header h2 {
        margin: 0;
        font-size: 18px;
    }
    .icon-btn {
        border: 0;
        background: transparent;
        font-size: 18px;
        cursor: pointer;
    }

    .modal-body {
        padding: 4px 2px;
    }

    .grid {
        display: grid;
        gap: 8px;
        grid-template-columns: 1fr 1fr;
    }
    .row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 8px;
        background: #fafafa;
    }
    .row strong {
        color: #374151;
    }
    .subsection {
        margin-top: 8px;
    }
    .companions {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 6px;
    }
    .companions li {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid #eee;
    }
    .comp-left {
        display: flex;
        flex-direction: column;
    }
    .comp-name {
        font-weight: 700;
        color: #111827;
    }
    .comp-meta {
        font-size: 12px;
        color: #6b7280;
    }
    .comp-right {
        color: #111827;
        font-weight: 600;
    }

    .empty {
        color: #6b7280;
        padding: 8px;
    }

    .raw {
        background: #0f172a;
        color: #e6eef8;
        padding: 10px;
        border-radius: 8px;
        overflow: auto;
        max-height: 240px;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 6px;
    }
    .primary {
        background: #2151ea;
        color: #fff;
        border: 0;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
    }
    .small {
        background: transparent;
        border: 1px solid #e5e7eb;
        padding: 6px 8px;
        border-radius: 8px;
        cursor: pointer;
    }
    .center {
        padding: 18px;
        text-align: center;
        color: #6b7280;
    }
    .error {
        color: #b91c1c;
        padding: 8px;
        background: #fff5f5;
        border-radius: 8px;
    }
</style>
