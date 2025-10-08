<script>
    // Import global CSS once
    import "../app.css";

    import { Breadcrumb, BreadcrumbItem, Navbar, NavHamburger, NavBrand , NavUl, NavLi} from "flowbite-svelte";


    // Import Toaster once (global notifications)
    import { Toaster } from "svelte-sonner";
</script>


<Navbar>
    <NavUl>
        <NavLi href="/">Home</NavLi>
        <NavLi href="/registration">registration</NavLi>
        <NavLi href="/login">login</NavLi>
        <NavLi href="/dashboard">Dashboard</NavLi>
        <NavLi href="/dashboard/profile">profile</NavLi>
    </NavUl>
    <NavHamburger />

    <NavBrand href="/">
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Darshan Mahakaal</span>
    </NavBrand>

</Navbar>

<!-- 🧩 Every page will render inside this slot -->
<slot />

<!-- 🔔 Global toast notification container -->
<Toaster position="top-right" richColors closeButton />
