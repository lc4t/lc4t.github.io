export const initQaFilter = () => {
  const chips = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".qa-chip")
  );
  const rows = Array.from(document.querySelectorAll<HTMLElement>(".qa-row"));
  const emptyHint = document.getElementById("qa-empty");

  const knownTags = new Set(
    chips.map(chip => chip.dataset.tag || "").filter(Boolean)
  );

  const apply = (tag: string) => {
    for (const chip of chips) {
      const on = (chip.dataset.tag || "") === tag;
      chip.classList.toggle("on", on);
      chip.setAttribute("aria-pressed", String(on));
    }
    for (const row of rows) {
      const tags = (row.dataset.tags || "").split("|").filter(Boolean);
      row.hidden = tag !== "" && !tags.includes(tag);
    }
    if (emptyHint) {
      emptyHint.hidden = tag === "" || rows.some(row => !row.hidden);
    }

    const url = new URL(window.location.href);
    if (tag) url.searchParams.set("tag", tag);
    else url.searchParams.delete("tag");
    window.history.replaceState(null, "", url);
  };

  for (const chip of chips) {
    chip.addEventListener("click", () => apply(chip.dataset.tag || ""));
  }

  const initial = new URL(window.location.href).searchParams.get("tag") || "";
  apply(knownTags.has(initial) ? initial : "");
};
