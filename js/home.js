// トップページ: 最新の日記エントリーと最新の音楽トラックをプレビュー表示する
(function () {
  const diaryContainer = document.getElementById("latest-diary");
  const musicContainer = document.getElementById("latest-music");

  let postsCache = null;
  let tracksCache = null;

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function excerpt(body, length) {
    const plain = String(body || "").replace(/<[^>]*>/g, " ").replace(/\n/g, " ");
    return plain.length > length ? plain.slice(0, length) + "…" : plain;
  }

  function renderDiary() {
    const lang = window.I18N.getLang();
    if (!postsCache) return;
    if (!postsCache.length) {
      diaryContainer.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.diaryEmpty",
        lang
      )}</p>`;
      return;
    }
    const latest = [...postsCache]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2);

    diaryContainer.innerHTML = latest
      .map((post) => {
        const title = window.I18N.pick(post.title, lang);
        const body = window.I18N.pick(post.body, lang);
        return `
          <article class="card">
            <h3>${escapeHtml(title)}</h3>
            <div class="meta">${window.I18N.formatDate(post.date, lang)}</div>
            <p class="excerpt">${escapeHtml(excerpt(body, 60))}</p>
          </article>
        `;
      })
      .join("");
  }

  function renderMusic() {
    const lang = window.I18N.getLang();
    if (!tracksCache) return;
    if (!tracksCache.length) {
      musicContainer.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.musicEmpty",
        lang
      )}</p>`;
      return;
    }
    const latest = [...tracksCache]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2);

    musicContainer.innerHTML = latest
      .map((track) => {
        const title = window.I18N.pick(track.title, lang);
        const description = window.I18N.pick(track.description, lang);
        return `
          <article class="card">
            <h3>${escapeHtml(title)}</h3>
            <div class="meta">${window.I18N.formatDate(track.date, lang)}</div>
            <p class="excerpt">${escapeHtml(description)}</p>
          </article>
        `;
      })
      .join("");
  }

  // 最新の日記を2件プレビュー表示
  fetch("data/posts.json")
    .then((res) => (res.ok ? res.json() : []))
    .then((posts) => {
      postsCache = posts;
      renderDiary();
    })
    .catch(() => {
      const lang = window.I18N.getLang();
      diaryContainer.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.diaryError",
        lang
      )}</p>`;
    });

  // 最新の音楽トラックを2件プレビュー表示
  fetch("data/tracks.json")
    .then((res) => (res.ok ? res.json() : []))
    .then((tracks) => {
      tracksCache = tracks;
      renderMusic();
    })
    .catch(() => {
      const lang = window.I18N.getLang();
      musicContainer.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.musicError",
        lang
      )}</p>`;
    });

  window.addEventListener("languagechange-app", () => {
    renderDiary();
    renderMusic();
  });
})();
