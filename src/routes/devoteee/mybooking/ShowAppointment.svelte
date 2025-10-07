<script lang="ts">
    import { onMount, createEventDispatcher, onDestroy } from "svelte";
    import { Button, Modal, P } from "flowbite-svelte";
    import { get_appointment } from "@src/helper_devoteee.js";

    export let appointmentId: string;
    const dispatch = createEventDispatcher();

    let loading = false;
    let error: string | null = null;
    let data: any = null;
    let showRaw = false;
    let open = true;

    function formatDateTime(dateStr: string, timeStr: string) {
        try {
            if (!dateStr && !timeStr) return "—";
            const candidate =
                dateStr && timeStr
                    ? `${dateStr}T${timeStr}`
                    : (dateStr ?? timeStr);
            const d = new Date(candidate);
            if (isNaN(+d)) {
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
            const payload = await get_appointment(appointmentId);
            data = payload?.message ?? payload;
        } catch (err: any) {
            error = err?.message ?? String(err);
        } finally {
            loading = false;
        }
    }

    function close() {
        open = false;
        dispatch("close");
    }

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

<!-- Flowbite modal usage: title prop + snippet footer() for footer -->
<Modal bind:open title="Appointment Details" size="lg" on:close={close}>
    {#if loading}
        <div class="text-center text-gray-500 py-6">Loading appointment…</div>
    {:else if error}
        <div class="p-3 bg-red-50 text-red-600 rounded-md">Error: {error}</div>
    {:else if data}
        <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
                <strong>Appointment ID:</strong>
                {data.name ?? data.appointment_id ?? "—"}
            </div>
            <div>
                <strong>Status:</strong>
                {data.workflow_state ?? data.status ?? "—"}
            </div>
            <div><strong>Type:</strong> {data.darshan_type ?? "—"}</div>
            <div>
                <strong>Date & Time:</strong>
                {formatDateTime(data.darshan_date, data.darshan_time)}
            </div>
            <div>
                <strong>With Protocol:</strong>
                {data.darshan_with_protocol ? "Yes" : "No"}
            </div>
            {#if data.protocol_rank}
                <div><strong>Protocol Rank:</strong> {data.protocol_rank}</div>
            {/if}
            {#if data.government_authority_letter}
                <div class="col-span-2">
                    <strong>Authority Letter:</strong>
                    {data.government_authority_letter}
                </div>
            {/if}
            {#if data.devoteee_profile}
                <div class="col-span-2">
                    <strong>Devotee Profile:</strong>
                    {data.devoteee_profile}
                </div>
            {/if}
        </div>

        <div class="mb-3">
            <h3 class="font-semibold mb-1">Companions</h3>
            {#if Array.isArray(data.darshan_companion) && data.darshan_companion.length > 0}
                <ul class="divide-y divide-gray-200 border rounded-md">
                    {#each data.darshan_companion as c}
                        <li class="flex justify-between items-center p-2">
                            <div>
                                <div class="font-semibold text-gray-800">
                                    {c.companion_name ?? "Unknown"}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {c.companion_gender ?? ""}
                                </div>
                            </div>
                            <div class="text-gray-800 font-medium">
                                {c.companion_phone ?? "—"}
                            </div>
                        </li>
                    {/each}
                </ul>
            {:else}
                <div class="text-gray-500 text-sm italic p-2">
                    No companions listed.
                </div>
            {/if}
        </div>

        <div>
            <Button
                color="light"
                size="sm"
                on:click={() => (showRaw = !showRaw)}
            >
                {showRaw ? "Hide JSON" : "Show raw JSON"}
            </Button>
            {#if showRaw}
                <pre
                    class="bg-gray-900 text-gray-100 mt-2 p-2 rounded overflow-auto max-h-60 text-sm">{JSON.stringify(
                        data,
                        null,
                        2,
                    )}</pre>
            {/if}
        </div>
    {:else}
        <div class="text-center text-gray-500 py-6">No data available.</div>
    {/if}

    {#snippet footer()}
        <Button color="primary" on:click={close}>Close</Button>
    {/snippet}
</Modal>
