<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Card, Button, Label, Input } from "flowbite-svelte";

    import { login_verify } from "@src/helper.js";

    // phone as string to allow leading + / 0 etc
    export let phone = "";

    let temp_pwd = "";
    let loading = false;
    let message = ""; // success/info from API
    let error = ""; // error messages to show

    async function requestLogin(e?: SubmitEvent) {
        e?.preventDefault();
        error = "";
        message = "";
        loading = true;

        const json_data = await login_verify(phone, temp_pwd);

        message = JSON.stringify(json_data);

        const user_type = localStorage.getItem("Muser_type");

        if (json_data?.message) {
            if (user_type === "Admin") goto("/admin");
            if (user_type === "Devoteee") goto("/devoteee");
            if (user_type === "Attender") goto("/attender");
        }

        loading = false;
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") requestLogin();
    }

    onMount(() => {
        const stored = localStorage.getItem("Mphone");
        if (stored != null) phone = String(stored);
    });
</script>

<!-- minimal layout wrapper (tiny Tailwind for centering) -->
<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card class="w-full max-w-md p-10">
        <form class="space-y-4" on:submit|preventDefault={requestLogin}>
            <h2 class="text-xl font-semibold text-gray-800">
                Login (Phone & Temp Password)
            </h2>

            <div>
                <Label for="phone">Phone</Label>
                <Input
                    id="phone"
                    type="text"
                    bind:value={phone}
                    placeholder="Phone"
                    on:keydown={onKeydown}
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
                    on:keydown={onKeydown}
                />
            </div>

            <div>
                <Button type="submit" class="w-full" disabled={loading}>
                    {#if loading}Requesting...{:else}Request Login{/if}
                </Button>
            </div>
        </form>
    </Card>
</div>
