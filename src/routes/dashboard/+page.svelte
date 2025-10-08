<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Card, Button, Alert , Badge} from "flowbite-svelte";
    import { get_profile } from "@src/helper_devoteee.js";

    interface ProfileDetails {
        devoteee_name?: string;
        is_ekyc_complete?: number;
        [key: string]: any;
    }

    export let title = "Dashboard";
    export let welcome = "Welcome back!";

    let devoteee_details: ProfileDetails | null = null;
    let devoteee_name = "";
    let is_ekyc_complete = 0;

    const defaultActions = [
        { id: "myProfile", label: "My Profile", site: "/dashboard/profile/", button_color: "green" },
        { id: "viewBookings", label: "View Bookings", site: "/dashboard/mybooking", button_color: "blue" },
        { id: "bookShigra", label: "Book - Shigra Darshan", site: "/dashboard/shigra", button_color: "dark" },
        { id: "bookVip", label: "Book - VIP Darshan", site: "/dashboard/vipdarshan", button_color: "blue" },
        { id: "bookLocalide", label: "Book - Localide Darshan", site: "/dashboard/localide", button_color: "dark" },
        { id: "bookBhasm", label: "Book - Bhasm Arti", site: "/dashboard/bhasmarti", button_color: "dark" },
    ];

    onMount(async () => {
        try {
            const devoteee_details = await get_profile();



            if (devoteee_details) {
                console.log(devoteee_details);
                console.log(devoteee_details.is_ekyc_complete);
                devoteee_name = devoteee_details.devoteee_name || "";
                is_ekyc_complete = devoteee_details.is_ekyc_complete || 0;
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
    });

    function onActionClicked(site?: string) {
        if (site) goto(site);
    }

    function completeKYC() {
        goto("/registration/complete_profile");
    }

    function logout() {
        goto("/registration/login");
    }
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <Card class="w-full max-w-2xl text-center p-10">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        <p class="text-gray-600 mb-4">
            {welcome}
            {#if devoteee_name}
               {devoteee_name}
            {/if}
        </p>

        {#if is_ekyc_complete === 0}

            <Alert color="red"  >
                <span class="font-medium">Danger alert!</span>
                Please complete your profile to continue.
                <Badge color="gray"  outline size="sm" class="ml-2" onclick={()=>goto("/login")}>
                   Complete the Profile
                </Badge>
            </Alert>

        {/if}

        <div class="grid gap-3 mt-4">
            {#each defaultActions as action (action.id)}
                <Button color={action.button_color} onclick={() => onActionClicked(action.site)}>
                    {action.label}
                </Button>
            {/each}
        </div>

        <div class="mt-5">
            <Button color="light" on:click={logout}>Logout</Button>
        </div>
    </Card>
</div>
