<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Card, Button, Label, Input } from "flowbite-svelte";
    import { Badge } from "flowbite-svelte";

    import { login_verify } from "@src/helper.js";
    import { toast } from "svelte-sonner";

    // phone as string to allow leading + / 0 etc
    export let phone: string = "";
    export let user_type: string = "";

    let temp_pwd: string = "A12345678Hz";
    let loading: boolean = false;
    let message: string = ""; // success/info from API
    let error: string = ""; // error messages to show

    async function login_verify_action(e: SubmitEvent) {
        e?.preventDefault();

        message = "";
        loading = true;

        const json_data = await login_verify(phone, temp_pwd);

        // store/display the API response in a friendly way
        message =
            typeof json_data === "string"
                ? json_data
                : JSON.stringify(json_data);

        if (json_data?.full_name) {
            toast.success("Login successful");
            // correct common typo "Devoteee" -> "Devotee"
            if (user_type === "Approver") await goto("/approver");
            else if (user_type === "Devoteee") await goto("/devoteee");
            else if (user_type === "Attender") await goto("/attender");
            else {
                // fallback route if user_type isn't set
                await goto("/");
            }
        } else {
            // show API message or generic error
            toast.error(message || "Login failed");
            loading = false;
        }
    }

    onMount(() => {
        const stored = localStorage.getItem("Mphone");
        user_type = localStorage.getItem("Muser_type") || "";

        if (stored != null) phone = String(stored);
    });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card class="w-full max-w-md p-10">
        <form
            class="space-y-4"
            on:submit={login_verify_action}
            aria-busy={loading}
        >
            <h2 class="text-xl font-semibold text-gray-800">
                Login (Phone & Temp Password)
            </h2>

            <Badge color="indigo">{user_type}</Badge>

            <div>
                <Label for="phone">Phone</Label>
                <Input
                    id="phone"
                    type="text"
                    bind:value={phone}
                    placeholder="Phone"
                    inputmode="tel"
                    autocomplete="tel"
                />
            </div>

            <div>
                <Label for="temp">Temp Password</Label>
                <Input
                    id="temp"
                    type="text"
                    bind:value={temp_pwd}
                    placeholder="Enter temp password"
                    disabled={loading}
                />
            </div>

            <Button type="submit" disabled={loading} aria-disabled={loading}>
                {#if loading}Verifying...{:else}Verify Login{/if}
            </Button>
        </form>
    </Card>
</div>
