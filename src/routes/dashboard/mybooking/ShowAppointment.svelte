<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { fly, fade } from "svelte/transition";

    export type Companion = {
        name: string;
        phone?: string | null;
        gender?: string | null;
    };

    export type Booking = {
        name: string;
        darshan_date: string; // YYYY-MM-DD
        darshan_time: string; // HH:MM:SS
        darshan_type: string;
        attender: string | null;
        workflow_state: string;
        darshan_companion?: Companion[];
    };

    // Props
    export let open: boolean = false;
    export let booking: Booking | null = null;

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    function confirm() {
        dispatch("confirm", { booking });
    }

    // small helper to display a nicer time/date
    function formatDate(dateIso: string | undefined | null) {
        if (!dateIso) return "-";
        try {
            const d = new Date(dateIso + "T00:00:00");
            return d.toLocaleDateString();
        } catch (e) {
            return dateIso;
        }
    }

    function formatTime(time: string | undefined | null) {
        if (!time) return "-";
        // assume HH:MM:SS
        const parts = time.split(":");
        if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
        return time;
    }
</script>

{#if open && booking}
    <div class="modal-backdrop" on:click|self={close} transition:fade>
        <div
            class="modal"
            transition:fly={{ y: 12, duration: 180 }}
            on:click|stopPropagation
        >
            <header class="modal-header">
                <h2>Booking — {booking.name}</h2>
                <button class="close-btn" aria-label="Close" on:click={close}
                    >✕</button
                >
            </header>

            <section class="modal-body">
                <div class="grid">
                    <div class="field">
                        <div class="label">Darshan Date</div>
                        <div class="value">
                            {formatDate(booking.darshan_date)}
                        </div>
                    </div>

                    <div class="field">
                        <div class="label">Darshan Time</div>
                        <div class="value">
                            {formatTime(booking.darshan_time)}
                        </div>
                    </div>

                    <div class="field">
                        <div class="label">Darshan Type</div>
                        <div class="value">{booking.darshan_type}</div>
                    </div>

                    <div class="field">
                        <div class="label">Attender</div>
                        <div class="value">{booking.attender ?? "-"}</div>
                    </div>

                    <div class="field full">
                        <div class="label">Workflow State</div>
                        <div class="value state">{booking.workflow_state}</div>
                    </div>
                </div>

                <hr />

                <div class="companions">
                    <h3>
                        Companions ({booking.darshan_companion?.length ?? 0})
                    </h3>
                    {#if booking.darshan_companion && booking.darshan_companion.length > 0}
                        <ul>
                            {#each booking.darshan_companion as c, i}
                                <li>
                                    <div class="comp-name">{c.name}</div>
                                    <div class="comp-meta">
                                        {c.phone ?? "—"} · {c.gender ?? "—"}
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <div class="empty">No companions</div>
                    {/if}
                </div>
            </section>

            <footer class="modal-footer">
                <button class="btn-secondary" on:click={close}>Close</button>
                <button class="btn-primary" on:click={confirm}>Confirm</button>
            </footer>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: 9999;
    }

    .modal {
        width: min(740px, 96%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #eee;
    }

    .modal-body {
        padding: 1rem 1.25rem;
        overflow: auto;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }

    .field {
        background: #fbfbfb;
        padding: 0.6rem;
        border-radius: 8px;
    }
    .field.full {
        grid-column: 1 / -1;
    }
    .label {
        font-size: 0.8rem;
        color: #666;
    }
    .value {
        font-weight: 600;
        margin-top: 0.25rem;
    }

    .state {
        color: #1a73e8;
    }

    .companions {
        margin-top: 0.75rem;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0;
    }
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        border-radius: 6px;
    }
    .comp-name {
        font-weight: 600;
    }
    .comp-meta {
        font-size: 0.85rem;
        color: #666;
    }

    .modal-footer {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
        padding: 0.75rem 1.25rem;
        border-top: 1px solid #eee;
    }

    .btn-primary {
        background: #0b5fff;
        color: white;
        border: none;
        padding: 0.5rem 0.9rem;
        border-radius: 8px;
    }
    .btn-secondary {
        background: transparent;
        border: 1px solid #ddd;
        padding: 0.5rem 0.9rem;
        border-radius: 8px;
    }

    .close-btn {
        background: transparent;
        border: none;
        font-size: 1.1rem;
    }
</style>
