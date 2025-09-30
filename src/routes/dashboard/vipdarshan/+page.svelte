<script lang="ts">
    import { createEventDispatcher } from "svelte";

    // ----- Types -----
    export type Protocol = {
        value: string;
        label: string;
        fee: number;
    };

    type SubmitEvent = {
        protocol?: Protocol;
        visitDate?: string;
        primaryDevotee: string;
        companions: string[];
        total: number;
        slot?: string;
    };

    type Events = {
        submit: SubmitEvent;
        back: void;
        addCompanion: void;
    };

    const dispatch = createEventDispatcher<Events>();

    // ----- Props -----
    export let title = "Book VIP Darshan (Protocol)";
    export let subtitle = "Select your protocol category to proceed.";
    export let sectionTitle = "Book VIP Darshan";
    export let primaryDevotee = "SASA";

    export let protocols: Protocol[] = [
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

    export let maxCompanions = 10;

    // ----- Local state -----
    let selectedProtocolValue = "";
    let companions: string[] = [];
    let visitDate = "";
    let selectedSlot = "";

    // Time-slots (mock data)
    type Slot = { time: string; seats: number };
    let slots: Slot[] = [
        { time: "08:00 AM", seats: 9 },
        { time: "09:30 AM", seats: 29 },
        { time: "11:00 AM", seats: 24 },
        { time: "01:00 PM", seats: 42 },
        { time: "03:00 PM", seats: 5 },
        { time: "04:30 PM", seats: 36 },
    ];

    // ----- Derived -----
    const inr = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    });

    const selectedProtocol = () =>
        protocols.find((p) => p.value === selectedProtocolValue);

    $: feePerPerson = selectedProtocol()?.fee ?? 0;
    $: total = feePerPerson * (1 + companions.length);

    $: invalid =
        !selectedProtocolValue || !visitDate || !selectedSlot
            ? "Please fill all required fields, select a protocol and a time slot."
            : "";

    // ----- Actions -----
    const addCompanion = () => {
        if (companions.length < maxCompanions) {
            companions = [...companions, ""];
            dispatch("addCompanion");
        }
    };

    const removeCompanion = (index: number) => {
        companions = companions.filter((_, i) => i !== index);
    };

    const updateCompanion = (index: number, name: string) => {
        companions[index] = name;
    };

    const back = () => dispatch("back");

    const submit = () => {
        if (invalid) return;
        dispatch("submit", {
            protocol: selectedProtocol(),
            visitDate,
            primaryDevotee,
            companions: companions.filter(Boolean),
            total,
            slot: selectedSlot,
        });
    };
</script>

<div class="page">
    <div class="card">
        <h1 class="title">{title}</h1>
        <p class="subtitle">{subtitle}</p>

        <div class="header-row">
            <h2 class="section">{sectionTitle}</h2>
            <button class="link" type="button" on:click={back}
                >← Back to Dashboard</button
            >
        </div>

        <div class="alert" role="alert">
            <strong>STATUTORY WARNING:</strong>
            <div>
                This booking is under the MP Government Protocol category.
                <b>
                    If any detail or document submitted is found to be fake or
                    incorrect during verification, legal action will be
                    initiated, and the booking will be immediately cancelled
                    without refund.</b
                >
            </div>
        </div>

        <!-- Primary Devotee -->
        <label class="label">Primary Devotee</label>
        <div class="display-box">
            <div class="strong">{primaryDevotee}</div>
            <div class="muted">
                You will be the primary person for this booking.
            </div>
        </div>

        <!-- Protocol Select -->
        <label class="label"
            >Protocol under which State Government of MP List</label
        >
        <select
            class="input"
            bind:value={selectedProtocolValue}
            aria-invalid={!selectedProtocolValue ? "true" : "false"}
        >
            <option value="" disabled selected>Select Protocol</option>
            {#each protocols as p}
                <option value={p.value}>{p.label}</option>
            {/each}
        </select>

        <!-- Companions -->
        <div class="row-between">
            <label class="label mb0">Companions (max {maxCompanions})</label>
            <span class="muted small">{companions.length} added</span>
        </div>

        <div class="companions">
            {#if companions.length === 0}
                <button
                    type="button"
                    class="btn success"
                    on:click={addCompanion}>Add Companion</button
                >
            {/if}

            {#each companions as c, i}
                <div class="companion-item">
                    <input
                        class="input"
                        type="text"
                        placeholder="Companion full name"
                        bind:value={companions[i]}
                        on:input={(e) =>
                            updateCompanion(
                                i,
                                (e.target as HTMLInputElement).value,
                            )}
                    />
                    <button
                        class="icon danger"
                        type="button"
                        on:click={() => removeCompanion(i)}
                        aria-label="Remove companion">✕</button
                    >
                </div>
            {/each}

            {#if companions.length > 0 && companions.length < maxCompanions}
                <button
                    type="button"
                    class="btn success subtle"
                    on:click={addCompanion}>+ Add Companion</button
                >
            {/if}
        </div>

        <!-- Date of Visit -->
        <label class="label">Date of Visit</label>
        <div class="date-wrap">
            <input
                class="input"
                type="date"
                bind:value={visitDate}
                aria-invalid={!visitDate ? "true" : "false"}
            />
            <span class="calendar" aria-hidden="true">📅</span>
        </div>

        <!-- AVAILABLE SLOTS -->
        <div class="slots-wrap">
            <div class="slots-head">
                <div class="label mb0">Available Slots</div>
                <div class="muted small">Please select a time slot below.</div>
            </div>
            <div
                class="slots-grid"
                role="listbox"
                aria-label="Available time slots"
            >
                {#each slots as s}
                    <button
                        type="button"
                        class="slot-btn {selectedSlot === s.time
                            ? 'selected'
                            : ''} {s.seats === 0 ? 'disabled' : ''}"
                        aria-pressed={selectedSlot === s.time}
                        aria-disabled={s.seats === 0}
                        on:click={() =>
                            (selectedSlot =
                                s.seats === 0 ? selectedSlot : s.time)}
                    >
                        <div class="slot-time">{s.time}</div>
                        <div class="slot-seats">{s.seats} Seats</div>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Fees & Total -->
        <p class="fee-line">
            Protocol Fee per person: <span class="strong"
                >{inr.format(feePerPerson)}</span
            >
        </p>
        <h3 class="total">Total Payable: <span>{inr.format(total)}</span></h3>

        {#if invalid}
            <p class="error">{invalid}</p>
        {/if}

        <button class="btn primary xl" type="button" on:click={submit}
            >Complete Booking</button
        >
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
        width: min(680px, 94vw);
        margin-top: 16px;
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 10px 28px rgba(16, 24, 40, 0.12);
        padding: 28px 32px 32px;
    }

    .title {
        margin: 0 0 6px;
        font-size: 28px;
        font-weight: 800;
        text-align: center;
        color: #1f2937;
    }
    .subtitle {
        text-align: center;
        margin: 0 0 18px;
        font-size: 14px;
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
    }
    .input:focus {
        border-color: #2151ea;
        box-shadow: 0 0 0 3px rgba(33, 81, 234, 0.15);
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

    .date-wrap {
        position: relative;
    }
    .calendar {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        opacity: 0.7;
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
        box-shadow: 0 0 0 3px rgba(33, 81, 234, 0.15);
        border-color: #2151ea;
    }
    .slot-btn:active {
        transform: translateY(1px);
    }
    .slot-btn.selected {
        border-color: #2151ea;
        box-shadow: 0 0 0 3px rgba(33, 81, 234, 0.15);
    }
    .slot-btn.disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
    .slot-time {
        font-weight: 800;
        font-size: 18px;
        color: #111827;
    }
    .slot-seats {
        font-size: 12px;
        color: #059669;
    }

    .fee-line {
        text-align: center;
        margin: 12px 0 0;
        color: #4b5563;
        font-size: 14px;
    }
    .total {
        text-align: center;
        margin: 6px 0 0;
        font-size: 22px;
        font-weight: 800;
        color: #111827;
    }

    .error {
        text-align: center;
        margin: 8px 0 0;
        color: #b91c1c;
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
</style>
