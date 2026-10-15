// 日記ページ: data/posts.json を読み込んで一覧表示する
(function () {
  const container = document.getElementById("diary-list");

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

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function renderPosts(posts) {
    if (!posts.length) {
      container.innerHTML = '<p class="state-message">まだ日記がありません。</p>';
      return;
    }

    const sorted = [...posts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    container.innerHTML = sorted
      .map(
        (post) => `
        <article class="card">
          <h3>${escapeHtml(post.title)}</h3>
          <div class="meta">${formatDate(post.date)}</div>
          <div class="body">${formatBody(post.body)}</div>
        </article>
      `
      )
      .join("");
  }

  fetch("data/posts.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load posts.json");
      return res.json();
    })
    .then(renderPosts)
    .catch((err) => {
      console.error(err);
      container.innerHTML =
        '<p class="state-message">日記の読み込みに失敗しました。</p>';
    });
})();
