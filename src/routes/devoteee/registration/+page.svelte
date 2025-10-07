<script lang="ts">
    import { goto } from "$app/navigation";
    import { Card, Button, Label, Input } from "flowbite-svelte";
    import { registration_devoteee } from "@src/helper_devoteee.js";
    import { toast, Toaster } from "svelte-sonner";

    // phone as string (allows leading + / 0)
    let phone = "";
    let loading = false;
    let message = ""; // optional UI
    let error = ""; // optional UI

    async function register_devoteee(e?: SubmitEvent) {
        e?.preventDefault();
        loading = true;
        message = "";

        const json_data = await registration_devoteee(phone);

        if (json_data?.message?.err) {
            loading = false;
            toast.error(json_data?.message?.err);
        } else {
            goto("/login");
        }

        loading = false;
    }
</script>

<!-- minimal layout wrapper (tiny Tailwind usage for centering) -->
<div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <Card class="w-full max-w-md p-10">
        <form class="space-y-4" on:submit|preventDefault={register_devoteee}>
            <h2 class="text-xl font-semibold">Registration</h2>

            <div>
                <Label for="phone">Phone number</Label>
                <Input
                    id="phone"
                    type="tel"
                    bind:value={phone}
                    placeholder="Enter phone number (e.g. 1234567890)"
                    inputmode="tel"
                    autocomplete="tel"
                />
            </div>

            <div>
                <Button type="submit" class="w-full" disabled={loading}>
                    {#if loading}Requesting...{:else}Register{/if}
                </Button>
            </div>

            <a
                href="/login"
                class="text-blue-600 hover:text-blue-800 font-small"
            >
                Already registered? login
            </a>
        </form>
    </Card>
</div>
