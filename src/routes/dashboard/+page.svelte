<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { onMount, onDestroy } from "svelte";

    const dispatch = createEventDispatcher();

    export let title = "Dashboard";
    export let welcome = "Welcome back!";
    export let panelTitle = "Dashboard";
    export let panelHelp = "Welcome! Please select an option below.";
    let devoteee_name = "";

    export let actions = [
        { id: "viewBookings", label: "View Bookings" },
        { id: "bookShigra", label: "Book - Shigra Darshan" },
        { id: "bookVip", label: "Book - VIP Darshan" },
        { id: "bookLocalide", label: "Book - Localide Darshan" },
        { id: "bookBhasm", label: "Book - Bhasm Arti" },
    ];

    export let accentIndex = 2;

    function onClick(action) {
        dispatch("action", action);
    }

    onMount(() => {
        console.log("Component mounted!");

        getProfileDetails();
        // You can also return a cleanup function here (like onDestroy).
        return () => {
            console.log("Cleanup on unmount!");
        };
    });

    async function getProfileDetails() {
        try {
            const res = await fetch(
                "http://localhost:1880/get_profile_details",
                {
                    method: "GET",
                    headers: {
                        auth_token: "18ad6b1e9144a9069024092cfc2e47d0",
                    },
                },
            );

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await res.json();
            console.log(data.message);
            console.log(data.message.devoteee_name);

            devoteee_name = data.message.devoteee_name;
        } catch (err) {
            console.error("Error fetching profile details:", err);
        }
    }
</script>

<div class="page">
    <div class="card">
        <h1 class="title">{title}</h1>
        <p class="subtitle">
            {welcome}
            {#if devoteee_name.length > 0}
                {devoteee_name}
            {/if}
        </p>

        <h2 class="panel-title">{panelTitle}</h2>
        <p class="panel-help">{panelHelp}</p>

        <div class="stack">
            {#each actions as action, i}
                <button
                    class="btn {i === accentIndex ? 'alt' : 'primary'}"
                    on:click={() => onClick(action)}
                >
                    {action.label}
                </button>
            {/each}
        </div>

        <button class="logout" on:click={() => dispatch("logout")}
            >Logout</button
        >
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
