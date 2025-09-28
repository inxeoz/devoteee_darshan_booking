<script lang="ts">
    import { createEventDispatcher } from "svelte";

    // ----- Types -----
    export type Protocol = {
        value: string;
        label: string;
        fee: number; // per person
    };

    type Events = {
        submit: {
            protocol?: Protocol;
            visitDate?: string; // yyyy-mm-dd
            primaryDevotee: string;
            companions: string[];
            total: number;
        };
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
    let selectedProtocolValue: string = "";
    let companions: string[] = []; // simple names list
    let visitDate = ""; // yyyy-mm-dd

    // ----- Derived / helpers -----
    const inr = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    });

    function selectedProtocol(): Protocol | undefined {
        return protocols.find((p) => p.value === selectedProtocolValue);
    }

    $: feePerPerson = selectedProtocol()?.fee ?? 0;
    $: total = feePerPerson * (1 + companions.length); // primary + companions

    $: invalid =
        !selectedProtocolValue || !visitDate
            ? "Please fill all required fields and select a protocol."
            : "";

    // ----- Actions -----
    function addCompanion() {
        if (companions.length >= maxCompanions) return;
        companions = [...companions, ""];
        dispatch("addCompanion");
    }

    function removeCompanion(index: number) {
        companions = companions.filter((_, i) => i !== index);
    }

    function updateCompanion(index: number, name: string) {
        companions = companions.map((c, i) => (i === index ? name : c));
    }

    function back() {
        dispatch("back");
    }

    function submit() {
        if (invalid) return;
        dispatch("submit", {
            protocol: selectedProtocol(),
            visitDate,
            primaryDevotee,
            companions: companions.filter(Boolean),
            total,
        });
    }
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
