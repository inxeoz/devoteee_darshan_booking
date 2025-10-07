<script lang="ts">
    import { Card, Button, Avatar } from "flowbite-svelte";
</script>

<!-- nano Tailwind layout wrapper -->
<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <Card class="max-w-2xl w-full">
        <div style="text-align:center;">
            <Avatar
                img="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Mahakaleshwar_Ujjain.jpg/320px-Mahakaleshwar_Ujjain.jpg"
                size="xl"
                bordered
            />

            <h2
                style="font-size:1.8rem; font-weight:700; color:#673ab7; margin:1rem 0 0.5rem;"
            >
                Welcome
            </h2>

            <p style="color:#444; max-width:480px; margin:0 auto 1.5rem;">
                Visit the sacred
                <span style="color:#8e24aa; font-weight:500"
                    >@Mahakaal Darshan</span
                >
                or enjoy
                <span style="color:#ffa000; font-weight:500">@VIP Darshan</span>
                for a memorable experience.
            </p>

            <div
                style="display:flex; flex-wrap:wrap; justify-content:center; gap:1rem; margin-bottom:1.5rem;"
            >
                <Card>
                    <h3
                        style="color:#673ab7; font-weight:600; margin-bottom:0.3rem;"
                    >
                        @Mahakaal Darshan
                    </h3>
                    <p style="font-size:0.9rem; color:#555;">
                        Join regular devotees for blessings — family-friendly
                        and open during standard hours.
                    </p>
                </Card>

                <Card>
                    <h3
                        style="color:#fbbf24; font-weight:600; margin-bottom:0.3rem;"
                    >
                        @VIP Darshan
                    </h3>
                    <p style="font-size:0.9rem; color:#555;">
                        Faster entry with exclusive care, guided by temple
                        staff, and special mementos.
                    </p>
                </Card>
            </div>
        </div>
    </Card>
</div>
