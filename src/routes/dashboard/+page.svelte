<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { getCookieByName, getProfileDetails } from "../../helper.js";
    import { goto } from "$app/navigation";

    const dispatch = createEventDispatcher();

    const defaultActions = [
        {
            id: "viewBookings",
            label: "View Bookings",
            site: "/dashboard/mybooking",
        },
        {
            id: "bookShigra",
            label: "Book - Shigra Darshan",
            site: "/dashboard/shigra",
        },
        {
            id: "bookVip",
            label: "Book - VIP Darshan",
            site: "/dashboard/vipdarshan",
        },
        {
            id: "bookLocalide",
            label: "Book - Localide Darshan",
            site: "/dashboard/localide",
        },
        {
            id: "bookBhasm",
            label: "Book - Bhasm Arti",
            site: "/dashboard/bhasmarti",
        },
    ];

    interface ProfileDetails {
        devoteee_name?: string;
        is_ekyc_complete?: number;
        [key: string]: any;
    }

    let devoteee_details: ProfileDetails | null = null;
    let devoteee_name = "";

    export let title = "Dashboard";
    export let welcome = "Welcome back!";
    export let accentIndex = 2;

    function onActionClicked(site: string | undefined) {
        if (site) goto(site);
    }

    onMount(async () => {
        const data = await getProfileDetails();
        if (data !== null) {
            devoteee_details = data.message;
            devoteee_name = data.message.devoteee_name || "";

            console.log(data.message);
        }
    });

    function complete_kyc() {
        goto("/registration/complete_profile");
    }
</script>

<div class="page">
    <div class="card">
        <div class="main_details">
            <h1 class="title">{title}</h1>
            <p class="subtitle">
                {welcome}
                {#if devoteee_details?.devoteee_name}
                    {devoteee_details?.devoteee_name}
                {/if}
            </p>

            {#if devoteee_details?.is_ekyc_complete == 0}
                <button
                    class="btn danger bg-orange-400"
                    on:click={complete_kyc}
                >
                    complete your kyc
                </button>
            {/if}
        </div>

        <div class="stack">
            {#each defaultActions as action, i}
                <button
                    class="btn {i === accentIndex ? 'alt' : 'primary'}"
                    on:click={() => onActionClicked(action.site)}
                >
                    {action.label}
                </button>
            {/each}
        </div>

        <button class="logout" on:click={() => goto("/registration/login")}>
            Logout
        </button>
    </div>
</div>

<style>
    .page {
        min-height: 100vh;
        background: #f4f6f8;
        display: grid;
        place-items: center;
        padding: 24px;
    }
    .card {
        width: min(620px, 92vw);
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        padding: 32px;
        text-align: center;
    }
    .title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 6px;
    }
    .subtitle,
    .panel-help,
    .logout {
        color: #6b7280;
        font-size: 14px;
    }
    .panel-title {
        font-size: 18px;
        font-weight: 600;
        margin: 8px 0;
    }
    .stack {
        display: grid;
        gap: 10px;
        margin: 16px 0;
    }
    .btn {
        height: 44px;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        color: #fff;
    }
    .btn.primary {
        background: #2151ea;
    }
    .btn.alt {
        background: #443de0;
    }
    .logout {
        background: none;
        border: none;
        margin-top: 10px;
        cursor: pointer;
    }
    .logout:hover {
        text-decoration: underline;
    }
</style>
