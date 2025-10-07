<script lang="ts">
    import { goto } from "$app/navigation";
    import { Toaster, toast } from "svelte-sonner";
    import { login_request_admin } from "@src/helper_admin.js";
    import { login_request_devoteee } from "@src/helper_devoteee.js";
    import { login_request_attender } from "@src/helper_attender.js";

    // import Flowbite components
    import { Label, Input, Select, Button, Card } from "flowbite-svelte";

    let user_type = "Admin";
    let phone = "";
    let loading = false;
    let res;

    const requestMap = {
        Admin: login_request_admin,
        Devoteee: login_request_devoteee,
        Attender: login_request_attender,
    };

    async function requestLogin(e?: SubmitEvent) {
        e?.preventDefault();
        loading = true;

        localStorage.setItem("Mphone", phone);
        localStorage.setItem("Muser_type", user_type);

        const fn = requestMap[user_type];
        res = await fn(phone);

        if (res?.message?.err) {
            toast.error(res.message.err);
        } else {
            toast.success("OTP sent successfully");
            goto("/login_verify");
        }

        loading = false;
    }
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <Card class="w-full max-w-md p-10">
        <h2 class="text-2xl font-bold text-center mb-4">Login Request</h2>

        <form class="space-y-4" on:submit|preventDefault={requestLogin}>
            <div>
                <Label for="phone">Phone</Label>
                <Input
                    id="phone"
                    type="tel"
                    bind:value={phone}
                    placeholder="000"
                    required
                />
            </div>

            <div>
                <Label for="user_type">User Type</Label>
                <Select id="user_type" bind:value={user_type}>
                    <option>Admin</option>
                    <option>Devoteee</option>
                    <option>Attender</option>
                </Select>
            </div>

            <Button
                type="submit"
                color="blue"
                class="w-full"
                disabled={loading}
            >
                {#if loading}
                    Requesting...
                {:else}
                    Request Login
                {/if}
            </Button>
        </form>
    </Card>
</div>
