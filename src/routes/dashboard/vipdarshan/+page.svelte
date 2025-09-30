<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";

    // ----- Types -----
    export type Protocol = {
        value: string;
        label: string;
        fee: number;
    };

    type Companion = {
        companion_name: string;
        companion_phone?: string;
        companion_gender?: string;
    };

    type SubmitEvent = {
        protocol?: Protocol;
        visitDate?: string;
        primaryDevotee: string;
        companions: Companion[];
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
    // companions now store objects with name, phone, gender
    let companions: Companion[] = [];
    let visitDate = "";
    let selectedSlot = "";
    let authorityLetterFile: File | null = null;
    let protocolRank = ""; // maps to protocol_rank in payload
    let saveAsDraft = true;

    // API / UI state
    let loading = false;
    let successMessage = "";
    let errorMessage = "";

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
    $: total =
        feePerPerson * (1 + companions.filter((c) => c.companion_name).length);

    $: invalid =
        !selectedProtocolValue || !visitDate || !selectedSlot
            ? "Please fill all required fields, select a protocol and a time slot."
            : "";

    // ----- Lifecycle -----
    onMount(() => {
        // default protocolRank to selectedProtocol label when protocol changes
        $: if (selectedProtocol()) {
            protocolRank = selectedProtocol()?.label ?? "";
        }
    });

    // ----- Actions -----
    const addCompanion = () => {
        if (companions.length < maxCompanions) {
            companions = [
                ...companions,
                {
                    companion_name: "",
                    companion_phone: "",
                    companion_gender: "male",
                },
            ];
            dispatch("addCompanion");
        }
    };

    const removeCompanion = (index: number) => {
        companions = companions.filter((_, i) => i !== index);
    };

    const updateCompanionField = (
        index: number,
        field: keyof Companion,
        value: string,
    ) => {
        companions = companions.map((c, i) =>
            i === index ? { ...c, [field]: value } : c,
        );
    };

    const back = () => dispatch("back");

    function slotTimeTo24hr(slotLabel: string) {
        // Example slotLabel: "08:00 AM" or "04:30 PM" -> return "08:00" / "16:30"
        const [time, meridian] = slotLabel.split(" ");
        if (!meridian) return time; // fallback
        const [hStr, mStr] = time.split(":");
        let h = parseInt(hStr, 10);
        const m = mStr || "00";
        if (meridian.toUpperCase() === "PM" && h !== 12) h += 12;
        if (meridian.toUpperCase() === "AM" && h === 12) h = 0;
        const hh = h.toString().padStart(2, "0");
        return `${hh}:${m}`;
    }

    async function submitBooking() {
        successMessage = "";
        errorMessage = "";
        if (invalid) return;

        // validate companions: require name and phone (phone optional? but your API includes phone)
        const validCompanions = companions
            .filter((c) => c.companion_name && c.companion_name.trim())
            .map((c) => ({
                companion_name: c.companion_name.trim(),
                companion_phone: c.companion_phone?.trim() || "",
                companion_gender: c.companion_gender || "male",
            }));

        // Build payload similar to your curl example
        const payload = {
            details: {
                darshan_date: visitDate, // expected "YYYY-MM-DD"
                darshan_time: slotTimeTo24hr(selectedSlot), // "HH:MM"
                darshan_with_protocol: 1, // set 1 to indicate protocol
                protocol_rank: protocolRank || selectedProtocol()?.label || "",
                government_authority_letter: authorityLetterFile
                    ? authorityLetterFile.name
                    : "", // filename only
                darshan_type: "Vip Darshan",
                darshan_companion: validCompanions,
            },
            save_as_draft: !!saveAsDraft,
        };

        loading = true;
        try {
            // NOTE: curl used GET with body — that's unusual. We use POST here (recommended).
            const res = await fetch(
                "http://localhost:1880/create_appointment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        auth_token: "18ad6b1e9144a9069024092cfc2e47d0",
                    },
                    body: JSON.stringify(payload),
                },
            );

            if (!res.ok) {
                // try to read error text/json
                let errText = await res.text();
                try {
                    const j = JSON.parse(errText);
                    errText = j.message || JSON.stringify(j);
                } catch (e) {
                    // keep errText
                }
                throw new Error(`Server returned ${res.status}: ${errText}`);
            }

            const data = await res.json().catch(() => null);
            successMessage = "Booking created successfully.";
            // dispatch submit for parent handlers
            dispatch("submit", {
                protocol: selectedProtocol(),
                visitDate,
                primaryDevotee,
                companions: validCompanions,
                total,
                slot: selectedSlot,
            });

            // optionally show response details
            if (data && data.booking_id) {
                successMessage += ` Booking ID: ${data.booking_id}`;
            }
        } catch (err: any) {
            console.error(err);
            errorMessage = err?.message
                ? String(err.message)
                : "Failed to create booking.";
        } finally {
            loading = false;
        }
    }

    function handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const f = input.files && input.files[0];
        authorityLetterFile = f ?? null;
    }

    // Helper to format slot button classname
    function slotClass(s: Slot) {
        return `${selectedSlot === s.time ? "selected" : ""} ${s.seats === 0 ? "disabled" : ""}`;
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
                    without refund.
                </b>
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
            on:change={() => (protocolRank = selectedProtocol()?.label ?? "")}
        >
            <option value="" disabled selected>Select Protocol</option>
            {#each protocols as p}
                <option value={p.value}>{p.label}</option>
            {/each}
        </select>

        <!-- Protocol Rank (editable) -->
        <label class="label">Protocol Rank (editable)</label>
        <input
            class="input"
            type="text"
            bind:value={protocolRank}
            placeholder="e.g. Chief Minister (of State)"
        />

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
                    <div class="companion-grid">
                        <input
                            class="input"
                            type="text"
                            placeholder="Full name"
                            bind:value={companions[i].companion_name}
                            on:input={(e) =>
                                updateCompanionField(
                                    i,
                                    "companion_name",
                                    (e.target as HTMLInputElement).value,
                                )}
                        />
                        <input
                            class="input"
                            type="tel"
                            placeholder="Phone (10 digits)"
                            bind:value={companions[i].companion_phone}
                            on:input={(e) =>
                                updateCompanionField(
                                    i,
                                    "companion_phone",
                                    (e.target as HTMLInputElement).value,
                                )}
                        />
                        <select
                            class="input"
                            bind:value={companions[i].companion_gender}
                            on:change={(e) =>
                                updateCompanionField(
                                    i,
                                    "companion_gender",
                                    (e.target as HTMLSelectElement).value,
                                )}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="companion-actions">
                        <button
                            class="icon danger"
                            type="button"
                            on:click={() => removeCompanion(i)}
                            aria-label="Remove companion">✕</button
                        >
                    </div>
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
                        class="slot-btn {slotClass(s)}"
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

        <!-- Authority Letter -->
        <label class="label">Government Authority Letter (PDF)</label>
        <input
            class="input"
            type="file"
            accept=".pdf"
            on:change={handleFileChange}
        />
        {#if authorityLetterFile}
            <div class="muted small">Selected: {authorityLetterFile.name}</div>
        {/if}

        <!-- Draft toggle -->
        <div class="draft-row">
            <label class="label">Save as Draft</label>
            <div>
                <input id="draft" type="checkbox" bind:checked={saveAsDraft} />
                <label for="draft" class="muted"
                    >Save this booking as draft (you can complete later)</label
                >
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

        {#if errorMessage}
            <p class="error small">{errorMessage}</p>
        {/if}

        {#if successMessage}
            <p class="success small">{successMessage}</p>
        {/if}

        <button
            class="btn primary xl"
            type="button"
            on:click={submitBooking}
            disabled={loading}
        >
            {#if loading}Processing...{:else}Complete Booking{/if}
        </button>
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

    .fee-line {
        text-align: center;
        margin: 12px 0 0;
        color: #4b5563;
        font-size: 14px;
    }
    .total {
        text-align: center;
        margin: 6px 0 0;
        font-size: 20px;
        font-weight: 800;
        color: #111827;
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
