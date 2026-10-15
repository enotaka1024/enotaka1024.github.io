// 共通の日英(ja/en)切り替えモジュール
// - UI文言の辞書を保持する
// - 現在の言語を localStorage に保存/復元する
// - 初回訪問時は navigator.language を見て自動判定する
// - [data-i18n] 属性を持つ要素のテキストを差し替える
// - 言語切り替え時はカスタムイベント "languagechange-app" を発火し、
//   各ページのJSがデータの再描画に使えるようにする
(function (global) {
  const STORAGE_KEY = "lang";

  const DICT = {
    ja: {
      "nav.home": "Home",
      "nav.diary": "Diary",
      "nav.music": "Music",
      "nav.instagram": "Instagram",
      "lang.toggle": "English",
      "lang.toggle.aria": "English表示に切り替える",
      "hero.title": "こんにちは、Enoです。",
      "hero.body":
        "日々の出来事を綴った日記と、趣味で作っている自作音楽をのんびり公開しています。\n（このプロフィール文章はプレースホルダーです。自由に書き換えてください。）",
      "hero.instagramCta": "Instagramをフォローする",
      "section.latestDiary": "最新の日記",
      "section.latestMusic": "最新の音楽",
      "section.viewAll": "すべて見る →",
      "page.diary.title": "Diary",
      "page.music.title": "Music",
      "state.loading": "読み込み中...",
      "state.diaryEmpty": "まだ日記がありません。",
      "state.diaryError": "日記の読み込みに失敗しました。",
      "state.musicEmpty": "まだ公開中の曲がありません。",
      "state.musicError": "音楽の読み込みに失敗しました。",
      "state.unsupportedTrack": "対応していないトラック形式です。",
      "player.audioUnsupported": "お使いのブラウザは audio タグに対応していません。",
      "footer.rights": "All rights reserved.",
      "meta.description.home": "日々の日記と自作音楽を公開している個人ブログです。",
      "meta.description.diary": "日々の日記の一覧です。",
      "meta.description.music": "自作音楽の一覧です。",
      "title.home": "Eno's Blog",
      "title.diary": "Diary | Eno's Blog",
      "title.music": "Music | Eno's Blog",
    },
    en: {
      "nav.home": "Home",
      "nav.diary": "Diary",
      "nav.music": "Music",
      "nav.instagram": "Instagram",
      "lang.toggle": "日本語",
      "lang.toggle.aria": "Switch to Japanese",
      "hero.title": "Hi, I'm Eno.",
      "hero.body":
        "I casually share a diary of everyday moments along with music I make as a hobby.\n(This profile text is a placeholder — feel free to rewrite it.)",
      "hero.instagramCta": "Follow on Instagram",
      "section.latestDiary": "Latest Diary",
      "section.latestMusic": "Latest Music",
      "section.viewAll": "View all →",
      "page.diary.title": "Diary",
      "page.music.title": "Music",
      "state.loading": "Loading...",
      "state.diaryEmpty": "No diary entries yet.",
      "state.diaryError": "Failed to load diary entries.",
      "state.musicEmpty": "No tracks published yet.",
      "state.musicError": "Failed to load tracks.",
      "state.unsupportedTrack": "Unsupported track format.",
      "player.audioUnsupported": "Your browser does not support the audio tag.",
      "footer.rights": "All rights reserved.",
      "meta.description.home": "A personal blog sharing a daily diary and original music.",
      "meta.description.diary": "A list of daily diary entries.",
      "meta.description.music": "A list of original music tracks.",
      "title.home": "Eno's Blog",
      "title.diary": "Diary | Eno's Blog",
      "title.music": "Music | Eno's Blog",
    },
  };

  function detectDefaultLang() {
    const nav = global.navigator || {};
    const langs = nav.languages && nav.languages.length ? nav.languages : [nav.language];
    for (const l of langs) {
      if (l && l.toLowerCase().startsWith("ja")) return "ja";
    }
    return "en";
  }

  function getLang() {
    try {
      const stored = global.localStorage.getItem(STORAGE_KEY);
      if (stored === "ja" || stored === "en") return stored;
    } catch (e) {
      /* localStorage が使えない環境では無視 */
    }
    return detectDefaultLang();
  }

  function setLang(lang) {
    try {
      global.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* 無視 */
    }
  }

  function t(key, lang) {
    const dict = DICT[lang] || DICT.en;
    return dict[key] !== undefined ? dict[key] : key;
  }

  // ja/en のどちらかのキーを持つオブジェクト(例: {ja: "...", en: "..."})から
  // 現在言語の値を取得する。無ければ ja -> en -> 空文字 の順にフォールバックする。
  function pick(field, lang) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    return field[lang] || field.ja || field.en || "";
  }

  function applyI18n(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = t(key, lang);
      el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      // data-i18n-attr="aria-label:lang.toggle.aria,title:lang.toggle.aria"
      const spec = el.getAttribute("data-i18n-attr");
      spec.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key, lang));
      });
    });

    const toggleBtn = document.getElementById("lang-toggle");
    if (toggleBtn) {
      toggleBtn.textContent = t("lang.toggle", lang);
      toggleBtn.setAttribute("aria-label", t("lang.toggle.aria", lang));
    }

    const titleKey = document.body && document.body.getAttribute("data-i18n-title");
    if (titleKey) {
      document.title = t(titleKey, lang);
    }

    const descKey = document.body && document.body.getAttribute("data-i18n-description");
    if (descKey) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", t(descKey, lang));
    }
  }

  function formatDate(dateStr, lang) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const locale = lang === "ja" ? "ja-JP" : "en-US";
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function init() {
    let currentLang = getLang();
    applyI18n(currentLang);

    const toggleBtn = document.getElementById("lang-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        currentLang = currentLang === "ja" ? "en" : "ja";
        setLang(currentLang);
        applyI18n(currentLang);
        global.dispatchEvent(
          new CustomEvent("languagechange-app", { detail: { lang: currentLang } })
        );
      });
    }
  }

  global.I18N = {
    getLang,
    setLang,
    t,
    pick,
    applyI18n,
    formatDate,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
