// Bare package names, resolved and bundled by Vite — no CDN <script> tags,
// no vendored copies checked into the repo.
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import confetti from "canvas-confetti";

// CSS as a module. Vite injects it in dev and extracts it to one hashed file on build.
import "./style.css";

import { sites } from "./data/sites.js";
import guideFace from "./assets/guide.jpg";

// Reassigned by the HMR handler at the bottom of this file.
let places = sites;

// import.meta.glob picks up every photo in assets/sites/ at build time and gives
// back its final URL, so sites.js only has to name a file.
const photos = import.meta.glob("./assets/sites/*.{jpg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
});

const photoFor = (file) => photos[`./assets/sites/${file}`];
const mapLink = (name) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", Telangana, India")}`;

const visited = new Set(JSON.parse(localStorage.getItem("visited") ?? "[]"));

function cardHTML(site, i) {
    return `
        <article class="card reveal" style="--delay:${i * 70}ms">
            <div class="card__photo">
                <img src="${photoFor(site.image)}" alt="${site.name}" loading="lazy">
                <span class="card__district">${site.district}</span>
            </div>
            <div class="card__body">
                <h3>${site.name}</h3>
                <p class="card__blurb">${site.blurb}</p>
                <div class="card__story"><p>${site.story}</p></div>
                <div class="card__actions">
                    <button class="pill" data-visited="${site.id}" aria-pressed="${visited.has(site.id)}">
                        ${visited.has(site.id) ? "Been there ✓" : "Been there"}
                    </button>
                    <a class="pill pill--ghost" href="${mapLink(site.name)}" target="_blank" rel="noopener">Map ↗</a>
                </div>
            </div>
        </article>`;
}

function render() {
    document.querySelector("#app").innerHTML = `
        <header class="hero">
            <div class="hero__inner">
                <p class="eyebrow reveal">A field guide · Telangana, India</p>
                <h1 class="reveal" style="--delay:80ms">Telangana's<br><em>Secrets</em></h1>
                <p class="lede reveal" style="--delay:160ms">
                    Lesser-known places in a Telugu-speaking state of India — a shrine for visa
                    seekers, a table set for a hundred, bricks that float.
                    Inspired by Atlas Obscura.
                </p>
                <a class="scroll-cue reveal" style="--delay:240ms" href="#places">Start exploring</a>
            </div>
        </header>

        <main id="places" class="places">
            <div class="section-head reveal">
                <h2>${places.length} little-known sites</h2>
                <p>Tap a card to read the story.</p>
            </div>
            <div class="grid">${places.map(cardHTML).join("")}</div>
        </main>

        <section class="guide">
            <div class="guide__card reveal">
                <img class="guide__face" src="${guideFace}" alt="Srihith Singam">
                <div>
                    <p class="eyebrow">Your guide</p>
                    <blockquote>"Indian states can be treated like their own countries."</blockquote>
                    <p class="guide__name">Srihith Singam</p>
                    <a class="pill pill--ghost" href="https://www.linkedin.com/in/srihith-r-singam/" target="_blank" rel="noopener">LinkedIn ↗</a>
                </div>
            </div>
        </section>

        <footer class="foot">
            <span>Built with Vite</span>
            <span class="dot"></span>
            <span>${import.meta.env.DEV ? "dev server · edit src/data/sites.js and watch it hot-swap" : "production build"}</span>
        </footer>`;

    wireUp();
}

function wireUp() {
    // Expand a card to reveal its story.
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.closest("a, button")) return;
            card.classList.toggle("is-open");
        });
    });

    // The one place canvas-confetti earns its keep.
    document.querySelectorAll("[data-visited]").forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.visited;
            const isNew = !visited.has(id);
            isNew ? visited.add(id) : visited.delete(id);
            localStorage.setItem("visited", JSON.stringify([...visited]));

            button.textContent = isNew ? "Been there ✓" : "Been there";
            button.setAttribute("aria-pressed", String(isNew));

            if (isNew) {
                const box = button.getBoundingClientRect();
                confetti({
                    particleCount: 60,
                    spread: 60,
                    scalar: 0.8,
                    colors: ["#ff9933", "#ffffff", "#8fe3a0"],
                    origin: {
                        x: (box.left + box.width / 2) / window.innerWidth,
                        y: (box.top + box.height / 2) / window.innerHeight,
                    },
                });
            }
        });
    });

    // Fade sections in as they scroll into view.
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

render();

// Hot module replacement: swap in new site data without reloading the page.
if (import.meta.hot) {
    import.meta.hot.accept("./data/sites.js", (updated) => {
        places = updated.sites;
        render();
    });
}
