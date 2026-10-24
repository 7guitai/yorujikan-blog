/* よるじかん - site.js（テンプレートの script.js をベースに移植） */
(function () {
  'use strict';

  /* ---------- スマホメニュー ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var gNav = document.getElementById('gNav');
  var overlay = document.getElementById('overlay');
  function toggleMenu(open) {
    if (gNav) gNav.classList.toggle('is-open', open);
    if (overlay) overlay.classList.toggle('is-show', open);
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { toggleMenu(true); });
  if (overlay) overlay.addEventListener('click', function () { toggleMenu(false); });
  if (gNav) gNav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') toggleMenu(false);
  });

  /* ---------- ヘッダーの検索ボタン → サイドバー検索へ ---------- */
  var searchBtn = document.getElementById('searchBtn');
  var searchInput = document.getElementById('searchInput');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function () {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () { searchInput.focus({ preventScroll: true }); }, 350);
    });
  }

  /* ---------- 目次（サーバー生成）の開閉 ---------- */
  var toc = document.getElementById('toc');
  var tocList = document.getElementById('tocList');
  var tocToggle = document.getElementById('tocToggle');
  if (toc && tocList) {
    // 目次項目が少なすぎる記事では非表示
    if (tocList.querySelectorAll('a').length < 3) toc.style.display = 'none';
  }
  if (tocToggle && toc) {
    tocToggle.addEventListener('click', function () {
      var closed = toc.classList.toggle('is-closed');
      tocToggle.textContent = closed ? '開く' : '閉じる';
    });
  }

  /* ---------- 目次モーダル（スマホ固定ボタン用） ---------- */
  var tocModal = document.getElementById('tocModal');
  var modalToc = document.getElementById('modalToc');
  var fixToc = document.getElementById('fixToc');
  var tocClose = document.getElementById('tocClose');
  if (modalToc && tocList) modalToc.innerHTML = tocList.innerHTML;
  if (fixToc && tocModal) {
    if (!tocList) fixToc.style.display = 'none';
    fixToc.addEventListener('click', function () { tocModal.classList.add('is-open'); });
  }
  if (tocClose && tocModal) {
    tocClose.addEventListener('click', function () { tocModal.classList.remove('is-open'); });
  }
  if (tocModal) {
    tocModal.addEventListener('click', function (e) {
      if (e.target === tocModal || e.target.tagName === 'A') tocModal.classList.remove('is-open');
    });
  }

  /* ---------- サイドバー目次のハイライト ---------- */
  var sideToc = document.getElementById('sideToc');
  var content = document.querySelector('.post-content');
  if (sideToc && content && 'IntersectionObserver' in window) {
    var links = sideToc.querySelectorAll('a');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '0px 0px -70% 0px' });
    content.querySelectorAll('h2').forEach(function (h) { if (h.id) io.observe(h); });
  }

  /* ---------- 固定ボタン（TOP / 目次） ---------- */
  var fixBtns = document.querySelector('.fix-btns');
  window.addEventListener('scroll', function () {
    if (fixBtns) fixBtns.classList.toggle('is-show', window.scrollY > 400);
  }, { passive: true });

  var toTop = document.getElementById('toTop');
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- シェアボタン ---------- */
  var url = encodeURIComponent(location.href);
  var title = encodeURIComponent(document.title);
  var shareUrls = {
    x: 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title,
    fb: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
    hb: 'https://b.hatena.ne.jp/add?mode=confirm&url=' + url,
    line: 'https://social-plugins.line.me/lineit/share?url=' + url
  };
  document.querySelectorAll('[data-share]').forEach(function (a) {
    a.href = shareUrls[a.dataset.share];
    a.target = '_blank';
    a.rel = 'noopener';
  });

  var copyBtn = document.getElementById('copyBtn');
  var copied = document.getElementById('copied');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(location.href).then(function () {
      if (copied) {
        copied.classList.add('is-show');
        setTimeout(function () { copied.classList.remove('is-show'); }, 2000);
      }
    });
  });

  /* ---------- 検索サジェスト（全記事タイトル対象） ---------- */
  var searchForm = document.getElementById('searchForm');
  var suggest = document.getElementById('searchSuggest');
  var indexEl = document.getElementById('search-index');
  var index = [];
  if (indexEl) {
    try { index = JSON.parse(indexEl.textContent || '[]'); } catch (e) { index = []; }
  }
  function closeSuggest() {
    if (suggest) { suggest.classList.remove('is-open'); suggest.innerHTML = ''; }
  }
  if (searchInput && suggest) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim();
      if (!q) { closeSuggest(); return; }
      var hits = index.filter(function (item) {
        return item.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
      }).slice(0, 8);
      if (!hits.length) { closeSuggest(); return; }
      suggest.innerHTML = hits.map(function (item) {
        var a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title;
        var li = document.createElement('li');
        li.appendChild(a);
        return li.outerHTML;
      }).join('');
      suggest.classList.add('is-open');
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSuggest();
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-wrap')) closeSuggest();
    });
  }
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = suggest ? suggest.querySelector('a') : null;
      if (first) location.href = first.href;
    });
  }
})();
