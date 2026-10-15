// 音楽ページ: data/tracks.json を読み込んで一覧表示する
(function () {
  const container = document.getElementById("music-list");
  let tracksCache = null;
  let loadError = false;

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderPlayer(track, lang) {
    const title = window.I18N.pick(track.title, lang);

    if (track.type === "local") {
      return `
        <audio controls preload="none">
          <source src="${escapeHtml(track.src)}" />
          ${window.I18N.t("player.audioUnsupported", lang)}
        </audio>
      `;
    }

    if (track.type === "embed") {
      return `
        <div class="embed-wrapper">
          <iframe
            src="${escapeHtml(track.embedUrl)}"
            height="166"
            allow="autoplay"
            loading="lazy"
            title="${escapeHtml(title)}"
          ></iframe>
        </div>
      `;
    }

    return `<p class="state-message">${window.I18N.t(
      "state.unsupportedTrack",
      lang
    )}</p>`;
  }

  function render() {
    const lang = window.I18N.getLang();

    if (loadError) {
      container.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.musicError",
        lang
      )}</p>`;
      return;
    }

    if (!tracksCache) {
      container.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.loading",
        lang
      )}</p>`;
      return;
    }

    if (!tracksCache.length) {
      container.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.musicEmpty",
        lang
      )}</p>`;
      return;
    }

    const sorted = [...tracksCache].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    container.innerHTML = sorted
      .map((track) => {
        const title = window.I18N.pick(track.title, lang);
        const description = window.I18N.pick(track.description, lang);
        return `
        <article class="track">
          <h3>${escapeHtml(title)}</h3>
          <div class="meta">
            ${window.I18N.formatDate(track.date, lang)}${
          description ? " ・ " + escapeHtml(description) : ""
        }
          </div>
          ${renderPlayer(track, lang)}
        </article>
      `;
      })
      .join("");
  }

  fetch("data/tracks.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load tracks.json");
      return res.json();
    })
    .then((tracks) => {
      tracksCache = tracks;
      render();
    })
    .catch((err) => {
      console.error(err);
      loadError = true;
      render();
    });

  window.addEventListener("languagechange-app", render);
})();
