<script lang="ts">
    import { goto } from "$app/navigation";
    import { create_appointment } from "@src/helper_devoteee.js";

    // Props
    export let title = "Book VIP Darshan (Protocol)";
    export let subtitle = "Select your protocol category to proceed.";
    export let sectionTitle = "Book VIP Darshan";
    export let primaryDevotee = "SASA";

    export let protocols = [
        {
            value: "state-guest-class-1",
            label: "State Guest - Class I",
            fee: 500,
        },
        {
            value: "state-guest-class-2",
            label: "State Guest - Class II",
            fee: 500,
        },
        { value: "mp-govt-official", label: "MP Govt. Official", fee: 500 },
    ];

    // State
    let selectedProtocolValue = "";
    let companions: { name: string; phone: string; age: number }[] = [];
    let visitDate = "";
    let selectedSlot = "";
    let authorityLetterFile: File | null = null;
    let saveAsDraft = true;

    let loading = false;
    let bookingSuccess = false;
    let bookingId: string | number | null = null;

    const slots = [
        { time: "08:00 AM", seats: 9 },
        { time: "09:30 AM", seats: 29 },
        { time: "11:00 AM", seats: 24 },
        { time: "01:00 PM", seats: 42 },
        { time: "03:00 PM", seats: 5 },
        { time: "04:30 PM", seats: 36 },
    ];

    $: feePerPerson =
        protocols.find((p) => p.value === selectedProtocolValue)?.fee ?? 0;
    $: total = feePerPerson * (1 + companions.length);

    // Add companion (blank row) its opening the companion row to edit  / enter values ,
    function addCompanion() {
        companions = [...companions, { name: "", phone: "", age: 0 }];
    }

    // Remove companion by index
    function removeCompanion(i: number) {
        companions = companions.filter((_, idx) => idx !== i);
    }

    function slotTimeTo24hr(slotLabel: string) {
        const [time, meridian] = slotLabel.split(" ");
        if (!meridian) return time;
        const [hStr, mStr] = time.split(":");
        let h = parseInt(hStr, 10);
        const m = mStr || "00";
        if (meridian.toUpperCase() === "PM" && h !== 12) h += 12;
        if (meridian.toUpperCase() === "AM" && h === 12) h = 0;
        return `${h.toString().padStart(2, "0")}:${m}`;
    }

    async function submitBooking() {
        loading = true;

        const details = {
            darshan_date: visitDate,
            darshan_time: selectedSlot ? slotTimeTo24hr(selectedSlot) : "",
            darshan_with_protocol: 1,
            protocol_rank: selectedProtocolValue || "",
            government_authority_letter: authorityLetterFile
                ? authorityLetterFile.name
                : "",
            darshan_type: "Vip Darshan",
            darshan_companion: companions.map((c) => ({
                companion_name: c.name || "",
                companion_phone: c.phone || "",
                companion_age: c.age ?? "",
            })),
            save_as_draft: saveAsDraft,
        };
        try {
            const res = await create_appointment(details);
            bookingId = res?.id ?? null;
            bookingSuccess = true;
        } catch (err) {
            console.error(err);
            alert("Failed to submit. Check console.");
        } finally {
            loading = false;
        }
    }

    function handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        authorityLetterFile = input.files?.[0] ?? null;
    }

    function slotClass(s) {
        return `${selectedSlot === s.time ? "selected" : ""} ${s.seats === 0 ? "disabled" : ""}`;
    }
</script>

<div class="page">
    <div class="card">
        <h1 class="title">{title}</h1>
        <p class="subtitle">{subtitle}</p>

        <div class="header-row">
            <h2 class="section">{sectionTitle}</h2>
            <button
                class="link"
                type="button"
                on:click={() => goto("/dashboard")}>← Back</button
            >
        </div>

        {#if !bookingSuccess}
            <!-- Primary Devotee -->
            <label class="label">Primary Devotee</label>
            <div class="display-box">
                <div class="strong">{primaryDevotee}</div>
            </div>

            <!-- Protocol -->
            <label class="label">Protocol</label>
            <select class="input" bind:value={selectedProtocolValue}>
                <option value="" disabled selected>Select Protocol</option>
                {#each protocols as p}
                    <option value={p.value}>{p.label}</option>
                {/each}
            </select>

            <!-- Companions -->
            <label class="label">Companions List ({companions.length})</label>
            <div class="companions">
                {#each companions as c, i}
                    <div class="companion-item">
                        <div class="companion-grid">
                            <input
                                class="input"
                                type="text"
                                placeholder="Full name"
                                bind:value={companions[i].name}
                            />
                            <input
                                class="input"
                                type="tel"
                                placeholder="Phone"
                                bind:value={companions[i].phone}
                            />
                            <input
                                class="input"
                                type="number"
                                placeholder="Age"
                                bind:value={companions[i].age}
                            />
                        </div>
                        <div class="companion-actions">
                            <button
                                class="icon danger"
                                type="button"
                                on:click={() => removeCompanion(i)}>✕</button
                            >
                        </div>
                    </div>
                {/each}
                <button
                    class="btn success subtle"
                    type="button"
                    on:click={addCompanion}>+ Add Companion</button
                >
            </div>

            <!-- Date -->
            <label class="label">Date of Visit</label>
            <input class="input" type="date" bind:value={visitDate} />

            <!-- Slots -->
            <label class="label">Available Slots</label>
            <div class="slots-grid">
                {#each slots as s}
                    <button
                        class="slot-btn {slotClass(s)}"
                        on:click={() =>
                            (selectedSlot =
                                s.seats === 0 ? selectedSlot : s.time)}
                        disabled={s.seats === 0}
                    >
                        <div class="slot-time">{s.time}</div>
                        <div class="slot-seats">{s.seats} Seats</div>
                    </button>
                {/each}
            </div>

            <!-- File -->
            <label class="label">Authority Letter (PDF)</label>
            <input
                class="input"
                type="file"
                accept=".pdf"
                on:change={handleFileChange}
            />
            {#if authorityLetterFile}
                <div class="muted small">
                    Selected: {authorityLetterFile.name}
                </div>
            {/if}

            <!-- Draft -->
            <div class="draft-row">
                <input id="draft" type="checkbox" bind:checked={saveAsDraft} />
                <label for="draft" class="muted">Save as Draft</label>
            </div>

            <!-- Totals -->
            <div class="muted small">Fee: {feePerPerson} | Total: {total}</div>

            <!-- Submit -->
            <button
                class="btn primary xl"
                on:click={submitBooking}
                disabled={loading}
            >
                {#if loading}Processing...{:else}Apply For Appointment{/if}
            </button>
        {:else}
            <div class="success-card">
                <h2 class="section">Success</h2>
                <p class="success">Appointment applied.</p>
                {#if bookingId}<p class="muted small">
                        Application ID: {bookingId}
                    </p>{/if}
                <div
                    style="display:flex; gap:12px; margin-top:14px; justify-content:center;"
                >
                    <button
                        class="btn success xl"
                        on:click={() => goto("/dashboard/mybooking")}
                        >See your bookings</button
                    >
                    <button
                        class="btn primary subtle xl"
                        on:click={() => goto("/dashboard")}
                        >Back to Dashboard</button
                    >
                </div>
            </div>
        {/if}
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
        width: min(780px, 96vw);
        margin-top: 16px;
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 10px 28px rgba(16, 24, 40, 0.12);
        padding: 22px 28px 28px;
    }

    .title {
        margin: 0 0 6px;
        font-size: 26px;
        font-weight: 800;
        text-align: center;
        color: #1f2937;
    }
    .subtitle {
        text-align: center;
        margin: 0 0 18px;
        font-size: 13px;
        color: #6b7280;
    }
    .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 8px 0 12px;
    }
    .section {
        margin: 0;
        font-size: 18px;
        font-weight: 800;
        color: #111827;
    }
    .link {
        background: transparent;
        border: 0;
        color: #2151ea;
        cursor: pointer;
        font-size: 14px;
        padding: 0;
    }
    .link:hover {
        text-decoration: underline;
    }

    .alert {
        display: grid;
        gap: 6px;
        border-radius: 10px;
        padding: 14px 16px;
        margin: 10px 0 16px;
        background: #fee2e2;
        border: 1px solid #fecaca;
        color: #7f1d1d;
    }
    .strong {
        font-weight: 700;
    }
    .muted {
        color: #6b7280;
    }
    .small {
        font-size: 12px;
    }
    .mb0 {
        margin-bottom: 0;
    }

    .label {
        display: block;
        margin: 12px 0 6px;
        font-size: 13px;
        color: #4b5563;
        font-weight: 600;
    }

    .display-box {
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 12px 14px;
        background: #f9fafb;
    }

    .input {
        width: 100%;
        height: 44px;
        padding: 0 14px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        background: #fff;
        font-size: 14px;
        outline: none;
        transition:
            box-shadow 0.15s ease,
            border-color 0.15s ease;
        margin-bottom: 6px;
    }
    .input:focus {
        border-color: #2151ea;
        box-shadow: 0 0 0 3px rgba(33, 81, 234, 0.12);
    }

    .row-between {
        display: flex;
        justify-content: space-between;
        align-items: end;
    }

    .companions {
        display: grid;
        gap: 10px;
    }
    .companion-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        align-items: start;
    }
    .companion-grid {
        display: grid;
        grid-template-columns: 1fr 160px 120px;
        gap: 8px;
    }
    .companion-actions {
        display: flex;
        align-items: center;
    }
    .icon {
        height: 44px;
        padding: 0 12px;
        border: 0;
        border-radius: 10px;
        background: #f3f4f6;
        cursor: pointer;
    }
    .icon.danger {
        background: #fee2e2;
    }

    /* SLOTS */
    .slots-wrap {
        margin-top: 12px;
    }
    .slots-head {
        display: grid;
        gap: 4px;
    }
    .slots-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-top: 8px;
    }
    .slot-btn {
        display: grid;
        gap: 6px;
        align-content: center;
        justify-items: center;
        height: 66px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        background: #fff;
        cursor: pointer;
        transition:
            box-shadow 0.15s ease,
            border-color 0.15s ease,
            transform 0.02s ease;
    }
    .slot-btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(33, 81, 234, 0.12);
        border-color: #2151ea;
    }
    .slot-btn:active {
        transform: translateY(1px);
    }
    .slot-btn.selected {
        border-color: #2151ea;
        box-shadow: 0 0 0 3px rgba(33, 81, 234, 0.12);
    }
    .slot-btn.disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
    .slot-time {
        font-weight: 800;
        font-size: 16px;
        color: #111827;
    }
    .slot-seats {
        font-size: 12px;
        color: #059669;
    }

    .error {
        text-align: center;
        margin: 8px 0 0;
        color: #b91c1c;
        font-size: 13px;
    }

    .success {
        text-align: center;
        margin: 8px 0 0;
        color: #065f46;
        font-size: 13px;
    }

    .btn {
        height: 44px;
        border: 0;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
        transition:
            transform 0.02s ease,
            opacity 0.15s ease;
        color: #fff;
    }
    .btn:active {
        transform: translateY(1px);
    }
    .btn.primary {
        background: #443de0;
    }
    .btn.success {
        background: #22c55e;
        color: #fff;
    }
    .btn.success.subtle {
        background: #e8f8ee;
        color: #166534;
        border: 1px solid #bbf7d0;
    }
    .btn.xl {
        width: 100%;
        height: 48px;
        margin-top: 12px;
    }
    .draft-row {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-top: 8px;
    }
</style>
