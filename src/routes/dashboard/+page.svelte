<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Card, Button, Alert } from "flowbite-svelte";
    import { get_profile } from "@src/helper_devoteee.js";

    const defaultActions = [
        {
            id: "My Profile",
            label: "My Profile",
            site: "/dashboard/profile/",
            button_color: "green",
        },
        {
            id: "viewBookings",
            label: "View Bookings",
            site: "/dashboard/mybooking",
            button_color: "blue",
        },
        {
            id: "bookShigra",
            label: "Book - Shigra Darshan",
            site: "/dashboard/shigra",
            button_color: "dark",
        },
        {
            id: "bookVip",
            label: "Book - VIP Darshan",
            site: "/dashboard/vipdarshan",
            button_color: "blue",
        },
        {
            id: "bookLocalide",
            label: "Book - Localide Darshan",
            site: "/dashboard/localide",
            button_color: "dark",
        },
        {
            id: "bookBhasm",
            label: "Book - Bhasm Arti",
            site: "/dashboard/bhasmarti",
            button_color: "dark",
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

    function onActionClicked(site: string | undefined) {
        console.log(site);
        if (site) goto(site);
    }

    onMount(async () => {
        const data = await get_profile();
        if (data) {
            devoteee_details = data.message;
            devoteee_name = data.message.devoteee_name || "";
        }
    });

    function complete_kyc() {
        goto("/registration/complete_profile");
    }

    function logout() {
        goto("/registration/login");
    }
</script>

<!-- 💠 Flowbite layout -->
<div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <Card class="w-full max-w-2xl text-center p-10">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        <p class="text-gray-600 mb-4">
            {welcome}
            {#if devoteee_details?.devoteee_name}
                <span class="font-medium bg-gray-500 ml-1">
                    {devoteee_details.devoteee_name}
                </span>
            {/if}
        </p>

        {#if devoteee_details?.is_ekyc_complete == 0}
            <Alert color="warning" class="mb-4" rounded>
                <span class="font-medium">KYC Pending:</span>
                Please complete your profile to continue.
                <Button
                    color="warning"
                    size="sm"
                    class="ml-2"
                    on:click={complete_kyc}
                >
                    Complete KYC
                </Button>
            </Alert>
        {/if}

        <!-- 💡 Actions -->
        <div class="grid gap-3 mt-4">
            {#each defaultActions as action, i}
                <Button
                    color={action.button_color}
                    onclick={() => onActionClicked(action.site)}
                >
                    {action.label}
                </Button>
            {/each}
        </div>

        <div class="mt-5">
            <Button color="light" on:click={logout}>Logout</Button>
        </div>
    </Card>
</div>
