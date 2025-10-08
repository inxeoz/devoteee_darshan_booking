<script lang="ts">
    import { onMount } from "svelte";
    import { Card, Avatar, Badge, Button, Tooltip } from "flowbite-svelte";
    import { get_profile } from "@src/helper_devoteee.js";

    let profile = null;
    let error = null;
    let loading = true;

    onMount(async () => {
        try {
            const response = await get_profile();
            profile = response.message.profile;
        } catch (e) {
            error = "Failed to load profile";
            console.error(e);
        } finally {
            loading = false;
        }
    });
</script>

<div
    class="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
>
    {#if loading}
        <div class="animate-pulse text-gray-600 text-lg">
            Loading profile...
        </div>
    {:else if error}
        <div
            class="text-red-600 bg-red-100 border border-red-300 px-4 py-3 rounded-lg shadow-sm"
        >
            {error}
        </div>
    {:else if profile}
        <Card
            class="w-full max-w-lg p-6 bg-white shadow-xl rounded-3xl transition-transform transform hover:scale-[1.02] hover:shadow-2xl"
        >
            <div class="flex flex-col items-center space-y-4">
                <Avatar
                    src={`https://ui-avatars.com/api/?name=${profile.owner}&background=random`}
                    alt="Avatar"
                    size="xl"
                    cornerStyle="rounded"
                />
                <div class="text-center">
                    <h2 class="text-2xl font-bold text-gray-800 mb-1">
                        {profile.owner}
                    </h2>
                    <p class="text-gray-500 text-sm">Darshan Devotee</p>
                </div>
            </div>

            <div class="mt-6 space-y-3 text-gray-700">
                <div class="flex justify-between border-b pb-2">
                    <span class="font-medium">Phone</span>
                    <span>{profile.phone}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="font-medium">Gender</span>
                    <span class="capitalize">{profile.gender}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="font-medium">E-KYC</span>
                    <Badge
                        color={profile.is_ekyc_complete ? "success" : "warning"}
                    >
                        {profile.is_ekyc_complete ? "Completed" : "Pending"}
                    </Badge>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="font-medium">Companion</span>
                    <Badge
                        color={profile.is_devoteee_companion ? "info" : "gray"}
                    >
                        {profile.is_devoteee_companion ? "Yes" : "No"}
                    </Badge>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="font-medium">Created On</span>
                    <span>{new Date(profile.creation).toLocaleString()}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-medium">DocType</span>
                    <span class="text-sm text-gray-500">{profile.doctype}</span>
                </div>
            </div>

            <div class="mt-8 flex justify-center space-x-4">
                <Tooltip content="Edit your profile details" placement="top">
                    <Button
                        color="light"
                        class="rounded-full px-5 py-2 font-medium">Edit</Button
                    >
                </Tooltip>
                <Tooltip content="Proceed to Darshan Booking" placement="top">
                    <Button
                        color="blue"
                        class="rounded-full px-5 py-2 font-medium"
                        >Book Darshan</Button
                    >
                </Tooltip>
            </div>
        </Card>
    {:else}
        <p class="text-gray-600">No profile found.</p>
    {/if}
</div>
