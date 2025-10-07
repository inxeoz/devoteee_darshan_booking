<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import ShowAppointment from "./ShowAppointment.svelte";
    import { get_appointment_list } from "@src/helper_devoteee.js";
    import type { Booking, Status } from "@src/appointment.js";

    export let limitStart = 0;
    export let pageLength = 10;

    export let heading = "My Bookings";
    export let subtitle = "View your darshan bookings.";
    export let sectionTitle = "My Bookings";

    let loading = false;
    let error: string | null = null;
    export let bookings: Booking[] = [];

    let show = false;
    let selectedId: string | null = null;

    function badgeClass(status: Status | string) {
        switch (status) {
            case "Approved":
                return "bg-emerald-50 text-emerald-700 ring-emerald-100";
            case "Pending":
                return "bg-sky-50 text-sky-700 ring-sky-100";
            case "Pending Verification":
                return "bg-indigo-50 text-indigo-700 ring-indigo-100";
            default:
                return "bg-gray-50 text-gray-600 ring-gray-100";
        }
    }

    async function FetchBookings() {
        loading = true;
        error = null;

        const data = await get_appointment_list(limitStart, pageLength);
        bookings = (data as any).message as Booking[];
        loading = false;
    }

    onMount(() => FetchBookings());

    function openModal(details: Booking) {
        selectedId = details.name;
        show = true;
    }
    function handleModalClose() {
        show = false;
    }
</script>

<div class="min-h-screen bg-slate-50 p-6 flex justify-center">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <div class="text-center mb-4">
            <h1 class="text-2xl font-extrabold text-slate-800">{heading}</h1>
            <p class="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>

        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-700">{sectionTitle}</h2>
            <div class="flex items-center gap-3">
                <button
                    class="text-sky-600 hover:underline"
                    on:click={() => goto("/dashboard")}
                    >← Back to Dashboard</button
                >
                <button
                    class="btn inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white shadow-sm text-sm text-slate-700"
                    on:click={FetchBookings}
                    disabled={loading}
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
            <div class="text-red-600 mb-3">Error: {error}</div>
        {/if}

        <section>
            <h3 class="text-sm font-semibold text-slate-700 mb-2">Bookings</h3>
            <div class="grid gap-3">
                {#if loading && bookings.length === 0}
                    <div class="text-slate-500">Loading bookings…</div>
                {:else}
                    {#each bookings as b}
                        <button
                            class="flex items-start justify-between p-4 rounded-xl border bg-white hover:shadow-sm"
                            on:click={() => openModal(b)}
                            aria-label={`Open booking ${b.name}`}
                        >
                            <div class="text-left">
                                <div class="font-semibold text-slate-800">
                                    {b.name}
                                </div>
                                <div class="text-xs text-slate-500 mt-1">
                                    Darshan: {b.darshan_type}
                                </div>
                                <div class="text-xs text-slate-400 mt-1">
                                    {b.darshan_date}

                                    {b.darshan_time}
                                </div>
                            </div>
                            <div class="ml-4">
                                <span
                                    class={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ring-1 ${badgeClass(b.workflow_state)}`}
                                >
                                    {b.workflow_state}
                                </span>
                            </div>
                        </button>
                    {/each}
                    {#if bookings.length === 0 && !loading}
                        <div class="text-slate-500">No bookings.</div>
                    {/if}
                {/if}
            </div>
        </section>
    </div>
</div>

{#if show && selectedId}
    <ShowAppointment appointmentId={selectedId} on:close={handleModalClose} />
{/if}
