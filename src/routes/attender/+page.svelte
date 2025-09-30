<script>
    // mock data (replace with real API calls)
    let user = { name: "Suresh Kumar", id: 101 };

    let stats = { assigned: 1, exit: 0, attended: 0 };

    let devotees = [
        {
            bookingId: 1002,
            type: "VIP Darshan",
            primary: "Sneha Patel",
            date: "2025-09-30",
            groupSize: 1,
            notes: "Vegetarian, wheelchair assistance",
        },
        {
            bookingId: 4001,
            type: "VIP Darshan",
            primary: "Ramesh Sharma",
            date: "2025-10-15",
            groupSize: 3,
            notes: "Arriving in one vehicle",
        },
    ];

    // modal state
    let showModal = false;
    let current = null;

    function openDetails(dev) {
        current = dev;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        current = null;
    }

    // simulate marking exit (replace with API)
    function markExit(bookingId) {
        // update stats and remove from assigned list (mock logic)
        stats.exit += 1;
        stats.assigned = Math.max(0, stats.assigned - 1);
        devotees = devotees.filter((d) => d.bookingId !== bookingId);
        closeModal();
    }

    // nicer formatted date heading
    const todayLabel = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <!-- Header -->
            <header class="px-8 py-6 border-b">
                <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800">
                    Darshan Attender Console
                </h1>
                <p class="mt-2 text-sm text-slate-600">
                    Welcome back,
                    <span class="text-blue-600 font-semibold"
                        >{user.name} (ID: {user.id})</span
                    >. Here is your current devotee roster.
                </p>
            </header>

            <!-- Body -->
            <main class="bg-amber-50 p-8">
                <h2 class="text-lg font-semibold text-slate-800 mb-6">
                    My Duties - {todayLabel}
                </h2>

                <!-- Stats cards -->
                <div class="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
                    <div class="relative bg-white rounded-xl p-5 shadow-md">
                        <div class="text-sm text-slate-500">
                            Assigned Today (Active)
                        </div>
                        <div class="mt-3 flex items-center justify-between">
                            <div class="text-3xl font-extrabold text-blue-600">
                                {stats.assigned}
                            </div>
                            <svg
                                class="w-6 h-6 text-slate-300"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden
                            >
                                <path
                                    d="M12 4v16M4 12h16"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </div>
                    </div>

                    <div class="relative bg-white rounded-xl p-5 shadow-md">
                        <div class="text-sm text-slate-500">Exit Today</div>
                        <div class="mt-3 flex items-center justify-between">
                            <div class="text-3xl font-extrabold text-green-600">
                                {stats.exit}
                            </div>
                            <svg
                                class="w-6 h-6 text-green-200"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden
                            >
                                <path
                                    d="M5 13l4 4L19 7"
                                    stroke="currentColor"
                                    stroke-width="1.6"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </div>
                    </div>

                    <div class="relative bg-white rounded-xl p-5 shadow-md">
                        <div class="text-sm text-slate-500">
                            Total Devotees Attended
                        </div>
                        <div class="mt-3 flex items-center justify-between">
                            <div class="text-3xl font-extrabold text-slate-800">
                                {stats.attended}
                            </div>
                            <svg
                                class="w-6 h-6 text-slate-300"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    stroke="currentColor"
                                    stroke-width="1.4"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Active Assigned Devotees -->
                <section>
                    <h3 class="text-slate-800 font-semibold mb-3">
                        Active Assigned Devotees
                    </h3>

                    <div class="bg-white rounded-lg shadow overflow-hidden">
                        <!-- table header -->
                        <div
                            class="hidden md:grid grid-cols-6 gap-0 bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-3 border-b"
                        >
                            <div class="col-span-1">Booking ID</div>
                            <div class="col-span-1">Darshan Type</div>
                            <div class="col-span-2">Primary Devotee</div>
                            <div class="col-span-1">Date</div>
                            <div class="col-span-1">Group Size</div>
                            <!-- action column will be inline on small too -->
                        </div>

                        <!-- rows -->
                        <div class="divide-y">
                            {#if devotees.length === 0}
                                <div
                                    class="px-6 py-8 text-center text-slate-500"
                                >
                                    No assigned devotees for today.
                                </div>
                            {/if}

                            {#each devotees as d}
                                <div
                                    class="grid grid-cols-1 md:grid-cols-6 items-center gap-3 px-4 py-4 md:px-6"
                                >
                                    <!-- Booking (mobile stacked view / clickable) -->
                                    <div class="col-span-1">
                                        <a
                                            class="text-blue-600 font-semibold hover:underline"
                                            href="#"
                                            on:click|preventDefault={() =>
                                                openDetails(d)}
                                        >
                                            {d.bookingId}
                                        </a>
                                    </div>

                                    <div class="col-span-1 text-slate-700">
                                        {d.type}
                                    </div>

                                    <div
                                        class="col-span-2 font-semibold text-slate-800"
                                    >
                                        {d.primary}
                                    </div>

                                    <div class="col-span-1 text-slate-600">
                                        {d.date}
                                    </div>

                                    <div class="col-span-1 text-slate-600">
                                        {d.groupSize} Devotee(s)
                                    </div>

                                    <div
                                        class="col-span-full md:col-span-1 flex md:justify-end mt-3 md:mt-0"
                                    >
                                        <button
                                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                            on:click={() => openDetails(d)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="mt-6">
                        <button
                            class="px-4 py-2 rounded-lg bg-slate-400 text-white hover:bg-slate-500 shadow"
                            >Logout</button
                        >
                    </div>
                </section>
            </main>
        </div>
    </div>
</div>

<!-- Modal -->
{#if showModal && current}
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" on:click={closeModal} />

        <div class="relative w-full max-w-2xl mx-4">
            <div class="bg-white rounded-xl shadow-xl overflow-hidden">
                <div
                    class="px-6 py-4 border-b flex items-start justify-between"
                >
                    <div>
                        <h4 class="text-lg font-semibold text-slate-800">
                            Booking #{current.bookingId}
                        </h4>
                        <p class="text-sm text-slate-600 mt-1">
                            {current.type} • {current.date}
                        </p>
                    </div>
                    <button
                        class="text-slate-400 hover:text-slate-600"
                        aria-label="Close"
                        on:click={closeModal}
                    >
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M6 18L18 6M6 6l12 12"
                                stroke="currentColor"
                                stroke-width="1.6"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                <div class="px-6 py-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <dt class="text-xs text-slate-500">
                                Primary Devotee
                            </dt>
                            <dd class="font-semibold text-slate-800">
                                {current.primary}
                            </dd>
                        </div>

                        <div>
                            <dt class="text-xs text-slate-500">Group Size</dt>
                            <dd class="font-semibold text-slate-800">
                                {current.groupSize} Devotee(s)
                            </dd>
                        </div>

                        <div class="sm:col-span-2">
                            <dt class="text-xs text-slate-500">Notes</dt>
                            <dd class="text-slate-700 mt-1">{current.notes}</dd>
                        </div>
                    </div>
                </div>

                <div
                    class="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3"
                >
                    <button
                        class="px-4 py-2 rounded-md bg-white border text-slate-700 hover:bg-slate-100"
                        on:click={closeModal}
                    >
                        Close
                    </button>

                    <button
                        class="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                        on:click={() => markExit(current.bookingId)}
                    >
                        Mark Exit
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
