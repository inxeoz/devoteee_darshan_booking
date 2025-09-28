<script>
    export let user = "Guest";
    function mahakaalDarshan() {
        alert("जय महाकाल! Mahakaal Darshan is booked.");
    }
    function vipDarshan() {
        alert("VIP Darshan booked!");
    }
</script>

<div class="main-bg">
    <div class="welcome-section">
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Mahakaleshwar_Ujjain.jpg/320px-Mahakaleshwar_Ujjain.jpg"
            class="mahakaal-image"
            alt="Mahakaal"
        />
        <div class="main-title">Welcome, {user}!</div>
        <div class="subtitle">
            Visit the sacred <span style="color:#8e24aa;font-weight:500"
                >@Mahakaal Darshan</span
            >
            or enjoy
            <span style="color:#ffa000;font-weight:500">@VIP Darshan</span> for a
            memorable experience.
        </div>
        <div class="darshan-options">
            <div class="option-card">
                <div class="option-title">@Mahakaal Darshan</div>
                <div class="option-desc">
                    Join regular devotees for blessings, family-friendly,
                    available during standard hours.
                </div>
            </div>
            <div class="option-card">
                <div class="option-title">@VIP Darshan</div>
                <div class="option-desc">
                    Faster entry with exclusive care, guided by temple staff,
                    with special mementos.
                </div>
            </div>
        </div>
        <div class="darshan-btns">
            <button class="darshan-btn" on:click={mahakaalDarshan}
                >Book Mahakaal Darshan</button
            >
            <button class="darshan-btn vip" on:click={vipDarshan}
                >Book VIP Darshan</button
            >
        </div>
    </div>
</div>

<style>
    body,
    .main-bg {
        min-height: 100vh;
        margin: 0;
        background: #f8f8fb;
        font-family: "Segoe UI", "Roboto", Arial, sans-serif;
    }
    .welcome-section {
        max-width: 700px;
        margin: 3rem auto;
        padding: 2.5rem 1.3rem;
        background: #fff;
        border: 1.5px solid #ede7f6;
        border-radius: 1.7rem;
        box-shadow: 0 4px 24px 0 rgba(140, 120, 170, 0.07);
    }
    .main-title {
        font-size: 2.2rem;
        color: #5033a2;
        font-weight: 800;
        text-align: center;
        margin-bottom: 0.8rem;
    }
    .subtitle {
        text-align: center;
        color: #334;
        font-size: 1.13rem;
        margin-bottom: 2.2rem;
    }
    .mahakaal-image {
        width: 128px;
        height: 128px;
        margin: 0 auto 1.2rem auto;
        border-radius: 50%;
        object-fit: cover;
        display: block;
        border: 2.5px solid #ede7f6;
    }
    .darshan-options {
        display: flex;
        gap: 1.2rem;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 2.1rem;
    }
    .option-card {
        background: #f3f0fa;
        border: 1px solid #e0dbef;
        border-radius: 1.2rem;
        padding: 1.1rem 1.2rem;
        width: 270px;
        box-shadow: 0 2px 7px rgba(130, 110, 160, 0.06);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .option-title {
        font-size: 1.11rem;
        color: #673ab7;
        font-weight: bold;
        margin-bottom: 0.37rem;
    }
    .option-desc {
        color: #413656;
        font-size: 0.98rem;
        text-align: center;
        margin-bottom: 0.1rem;
    }
    .darshan-btns {
        display: flex;
        justify-content: center;
        gap: 1.4rem;
        margin-top: 1.2rem;
    }
    .darshan-btn {
        padding: 0.72rem 2.2rem;
        font-size: 1.03rem;
        color: #fff;
        background: #6a3cb4;
        border: none;
        border-radius: 2em;
        font-weight: 600;
        box-shadow: 0 1px 8px rgba(110, 70, 150, 0.06);
        cursor: pointer;
        transition:
            background 0.16s,
            box-shadow 0.13s;
    }
    .darshan-btn.vip {
        background: #ffa000;
        color: #23211b;
    }
    .darshan-btn:hover {
        filter: brightness(1.11);
        box-shadow: 0 2px 16px 0 rgba(100, 80, 120, 0.13);
    }
    @media (max-width: 600px) {
        .welcome-section {
            padding: 1.1rem;
        }
        .darshan-options {
            flex-direction: column;
            gap: 0.6rem;
        }
        .main-title {
            font-size: 1.5rem;
        }
        .option-card {
            width: 96vw;
        }
    }
</style>
