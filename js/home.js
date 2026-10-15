// トップページ: 最新の日記エントリーと最新の音楽トラックをプレビュー表示する
(function () {
  const diaryContainer = document.getElementById("latest-diary");
  const musicContainer = document.getElementById("latest-music");

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

  function excerpt(body, length) {
    const plain = String(body || "").replace(/<[^>]*>/g, " ").replace(/\n/g, " ");
    return plain.length > length ? plain.slice(0, length) + "…" : plain;
  }

  // 最新の日記を2件プレビュー表示
  fetch("data/posts.json")
    .then((res) => (res.ok ? res.json() : []))
    .then((posts) => {
      if (!posts.length) {
        diaryContainer.innerHTML =
          '<p class="state-message">まだ日記がありません。</p>';
        return;
      }
      const latest = [...posts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);

      diaryContainer.innerHTML = latest
        .map(
          (post) => `
          <article class="card">
            <h3>${escapeHtml(post.title)}</h3>
            <div class="meta">${formatDate(post.date)}</div>
            <p class="excerpt">${escapeHtml(excerpt(post.body, 60))}</p>
          </article>
        `
        )
        .join("");
    })
    .catch(() => {
      diaryContainer.innerHTML =
        '<p class="state-message">日記の読み込みに失敗しました。</p>';
    });

  // 最新の音楽トラックを2件プレビュー表示
  fetch("data/tracks.json")
    .then((res) => (res.ok ? res.json() : []))
    .then((tracks) => {
      if (!tracks.length) {
        musicContainer.innerHTML =
          '<p class="state-message">まだ公開中の曲がありません。</p>';
        return;
      }
      const latest = [...tracks]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);

      musicContainer.innerHTML = latest
        .map(
          (track) => `
          <article class="card">
            <h3>${escapeHtml(track.title)}</h3>
            <div class="meta">${formatDate(track.date)}</div>
            <p class="excerpt">${escapeHtml(track.description || "")}</p>
          </article>
        `
        )
        .join("");
    })
    .catch(() => {
      musicContainer.innerHTML =
        '<p class="state-message">音楽の読み込みに失敗しました。</p>';
    });
})();
