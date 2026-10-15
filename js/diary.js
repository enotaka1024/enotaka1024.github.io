// 日記ページ: data/posts.json を読み込んで一覧表示する
(function () {
  const container = document.getElementById("diary-list");
  let postsCache = null;
  let loadError = false;

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // 本文中の改行を <br> に変換しつつ、意図的なHTMLタグはそのまま許可したいので
  // ここではエスケープせず、改行のみ <br> に変換する(簡易Markdown風対応)。
  function formatBody(body) {
    return body.replace(/\n/g, "<br>");
  }

  function render() {
    const lang = window.I18N.getLang();

    if (loadError) {
      container.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.diaryError",
        lang
      )}</p>`;
      return;
    }

    if (!postsCache) {
      container.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.loading",
        lang
      )}</p>`;
      return;
    }

    if (!postsCache.length) {
      container.innerHTML = `<p class="state-message">${window.I18N.t(
        "state.diaryEmpty",
        lang
      )}</p>`;
      return;
    }

    const sorted = [...postsCache].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    container.innerHTML = sorted
      .map((post) => {
        const title = window.I18N.pick(post.title, lang);
        const body = window.I18N.pick(post.body, lang);
        return `
        <article class="card">
          <h3>${escapeHtml(title)}</h3>
          <div class="meta">${window.I18N.formatDate(post.date, lang)}</div>
          <div class="body">${formatBody(body)}</div>
        </article>
      `;
      })
      .join("");
  }

  fetch("data/posts.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load posts.json");
      return res.json();
    })
    .then((posts) => {
      postsCache = posts;
      render();
    })
    .catch((err) => {
      console.error(err);
      loadError = true;
      render();
    });

  window.addEventListener("languagechange-app", render);
})();
