// 音楽ページ: data/tracks.json を読み込んで一覧表示する
(function () {
  const container = document.getElementById("music-list");

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function renderPlayer(track) {
    if (track.type === "local") {
      return `
        <audio controls preload="none">
          <source src="${escapeHtml(track.src)}" />
          お使いのブラウザは audio タグに対応していません。
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
            title="${escapeHtml(track.title)}"
          ></iframe>
        </div>
      `;
    }

    return '<p class="state-message">対応していないトラック形式です。</p>';
  }

  function renderTracks(tracks) {
    if (!tracks.length) {
      container.innerHTML = '<p class="state-message">まだ公開中の曲がありません。</p>';
      return;
    }

    const sorted = [...tracks].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    container.innerHTML = sorted
      .map(
        (track) => `
        <article class="track">
          <h3>${escapeHtml(track.title)}</h3>
          <div class="meta">
            ${formatDate(track.date)}${
          track.description ? " ・ " + escapeHtml(track.description) : ""
        }
          </div>
          ${renderPlayer(track)}
        </article>
      `
      )
      .join("");
  }

  fetch("data/tracks.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load tracks.json");
      return res.json();
    })
    .then(renderTracks)
    .catch((err) => {
      console.error(err);
      container.innerHTML =
        '<p class="state-message">音楽の読み込みに失敗しました。</p>';
    });
})();
