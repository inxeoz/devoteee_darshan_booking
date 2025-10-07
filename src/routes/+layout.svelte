<script>
    // Import global CSS once
    import "../app.css";

    // Import Toaster once (global notifications)
    import { Toaster } from "svelte-sonner";
</script>

<!-- 🌐 Global navigation bar -->
<nav class="bg-blue-500 text-white flex flex-wrap gap-x-4 px-4 py-3">
    <a href="/" class="hover:underline">Home</a>
    <a href="/registration/devoteee_registration" class="hover:underline"
        >Registration</a
    >
    <a href="/login" class="hover:underline">Login</a>
    <a href="/dashboard" class="hover:underline">Dashboard</a>
    <a href="/darshan_management" class="hover:underline">Darshan Management</a>
    <a href="/attender" class="hover:underline">Attender</a>
    <a href="/demo" class="hover:underline">Demo</a>
</nav>

<!-- 🧩 Every page will render inside this slot -->
<slot />

<!-- 🔔 Global toast notification container -->
<Toaster position="top-right" richColors closeButton />
