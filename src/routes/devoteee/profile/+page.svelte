<script lang="ts">
    import { onMount } from "svelte";
    import { Avatar, Card } from "flowbite-svelte";
    import { get_profile } from "@src/helper_devoteee.js";

    let profile = null;
    let error = null;

    onMount(async () => {
        try {
            const response = await get_profile();

            profile = response.message.profile;
        } catch (e) {
            error = "Failed to load profile";
            console.error(e);
        }
    });
</script>

{#if error}
    <p class="text-red-600">{error}</p>
{:else if profile}
    <Card class="max-w-md mx-auto mt-10 p-6">
        <div class="flex space-x-4 items-center">
            <Avatar class="w-16 h-16" cornerStyle="rounded" />
            <div>
                <h2 class="text-xl font-bold">{profile.owner}</h2>
                <p class="text-gray-600">Phone: {profile.phone}</p>
                <p class="text-gray-600">Gender: {profile.gender}</p>
                <p class="text-gray-600">
                    E-KYC Complete: {profile.is_ekyc_complete ? "Yes" : "No"}
                </p>
                <p class="text-gray-600">
                    Companion: {profile.is_devoteee_companion ? "Yes" : "No"}
                </p>
                <p class="text-gray-600">Profile Created: {profile.creation}</p>
            </div>
        </div>
    </Card>
{:else}
    <p>Loading profile...</p>
{/if}
