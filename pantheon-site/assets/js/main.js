/* Pantheon Properties — progressive enhancement only.
   The site is fully usable without this file (nav, listings, links, forms fall back gracefully). */
(() => {
  "use strict";

  /* ---- Mobile navigation ------------------------------------------------ */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.dataset.open = String(open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", () => setOpen(nav.dataset.open !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.dataset.open === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
  }

  /* ---- Property filters ------------------------------------------------- */
  const filters = document.querySelector("[data-filters]");
  if (filters) {
    const cards = Array.from(document.querySelectorAll("[data-property]"));
    const status = document.querySelector("[data-filter-status]");
    const buttons = Array.from(filters.querySelectorAll("[data-filter]"));
    filters.hidden = false;

    const matches = (card, key) => {
      if (key === "all") return true;
      if (key === "available") return card.dataset.status === "available";
      return card.dataset.state === key;
    };

    const apply = (key) => {
      let shown = 0;
      cards.forEach((card) => {
        const ok = matches(card, key);
        card.hidden = !ok;
        if (ok) shown += 1;
      });
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === key)));
      if (status) status.textContent = `Showing ${shown} of ${cards.length} properties`;
    };

    buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.filter)));
    apply("all");
  }

  /* ---- Contact form ----------------------------------------------------- */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const statusEl = form.querySelector("[data-form-status]");
    const show = (msg, kind) => {
      statusEl.textContent = msg;
      statusEl.className = `form-status form-status--${kind}`;
      statusEl.hidden = false;
      statusEl.focus();
    };

    // Pre-fill from links such as /contact/?property=401-penhorn-avenue&type=leasing
    const params = new URLSearchParams(window.location.search);
    ["property", "type"].forEach((key) => {
      const value = params.get(key);
      const field = form.elements[key];
      if (value && field && Array.from(field.options || []).some((o) => o.value === value)) {
        field.value = value;
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.elements.company_website && form.elements.company_website.value) return; // honeypot
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const submitBtn = form.querySelector("[type=submit]");

      submitBtn.disabled = true;
      try {
        // Netlify Forms: POST URL-encoded fields (including the hidden form-name) to the site.
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(data).toString(),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        show("Thank you. Your message has been sent and our team will respond shortly.", "ok");
      } catch (err) {
        show("Sorry, something went wrong. Please call 212.277.7500 or email leasing@pantheonproperties.com.", "err");
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
