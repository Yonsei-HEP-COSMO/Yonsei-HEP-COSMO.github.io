(() => {
  "use strict";

  const parseCalendarDate = (value) =>
    Number.parseInt(value.slice(0, 10).replaceAll("-", ""), 10);

  const todayParts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value])
  );
  const today = Number.parseInt(
    todayParts.year + todayParts.month + todayParts.day,
    10
  );

  document.querySelectorAll("[data-event-section]").forEach((section) => {
    const list = section.querySelector("[data-event-list]");
    if (!list) {
      return;
    }

    const mode = section.dataset.mode;
    const limit = Number.parseInt(section.dataset.limit || "0", 10);
    const items = Array.from(list.querySelectorAll("[data-event-item]"));

    const matching = items.filter((item) => {
      const endDate = item.dataset.endDate || item.dataset.startDate;
      const eventEnd = parseCalendarDate(endDate);
      return mode === "upcoming" ? eventEnd >= today : eventEnd < today;
    });

    if (mode === "upcoming") {
      matching.sort(
        (a, b) =>
          parseCalendarDate(a.dataset.startDate) -
          parseCalendarDate(b.dataset.startDate)
      );
    }

    const visibleItems = limit > 0 ? matching.slice(0, limit) : matching;
    const visibleSet = new Set(visibleItems);
    items.forEach((item) => {
      item.hidden = !visibleSet.has(item);
    });
    if (mode === "upcoming") {
      visibleItems.forEach((item) => list.appendChild(item));
    }

    const fallback = section.querySelector("[data-event-fallback]");
    const empty = section.querySelector("[data-event-empty]");

    if (visibleItems.length > 0) {
      list.hidden = false;
      if (fallback) {
        fallback.hidden = true;
      }
    } else {
      list.hidden = true;
      if (fallback) {
        fallback.hidden = false;
      }
      if (empty) {
        empty.hidden = false;
      }
    }
  });
})();
