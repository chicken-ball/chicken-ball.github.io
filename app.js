// TRI-ELEMENTS ホームページ。言語の切り替え・ライバル・カード・更新履歴・声のフォーム。
(function () {
  'use strict';
  // ---- 言語（端末の言語で決め、ボタンで切り替え。選んだものは覚える） ----
  var lang = 'ja';
  try { lang = localStorage.getItem('te-site-lang') || (/^ja/i.test(navigator.language) ? 'ja' : 'en'); } catch (e) {}
  var body = document.body, btn = document.getElementById('langbtn');
  function applyLang(l) {
    lang = l; body.dataset.lang = l; document.documentElement.lang = l;
    btn.textContent = l === 'ja' ? 'EN' : '日本語';
    document.title = l === 'ja' ? 'TRI-ELEMENTS 三属の戦記｜ブラウザで遊べる無料カードバトル' : 'TRI-ELEMENTS: Chronicle of the Three — a free browser card battle game';
    try { localStorage.setItem('te-site-lang', l); } catch (e) {}
    // 遊ぶボタン：日本語は PLiCy、英語は itch.io（どちらも同じ最新版）
    var url = l === 'ja' ? 'https://plicy.net/GamePlay/237147' : 'https://chicken-ball.itch.io/tri-elements';
    ['playmain', 'playtop'].forEach(function (id) { var a = document.getElementById(id); if (a) a.href = url; });
    renderAll();
  }
  btn.addEventListener('click', function () { applyLang(lang === 'ja' ? 'en' : 'ja'); });
  var T = function (ja, en) { return lang === 'ja' ? ja : en; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // ---- 動画（押すまで YouTube を読まない＝軽い） ----
  var yt = document.getElementById('yt');
  yt.querySelector('button').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + yt.dataset.id + '?autoplay=1&rel=0';
    f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.title = 'Trailer';
    yt.innerHTML = ''; yt.appendChild(f);
  });

  // ---- ライバル ----
  var AREAS = [
    ['a1', 'はじまりの草原', 'Meadow of Beginnings', [['area-01-01-toto', '見習いのトト', 'Toto the Apprentice'], ['area-01-02-garo', '罠師のガロ', 'Garo the Trapper'], ['area-01-03-morley', '草原の主 モーリー', 'Morley, Meadow Lord']]],
    ['a2', '燃える丘', 'Burning Hills', [['area-02-01-pirika', '火の子ピリカ', 'Pirika, Child of Flame'], ['area-02-02-gou', '溶岩守りゴウ', 'Gou, Lava Keeper'], ['area-02-03-balga', '炎皇バルガ', 'Varga, Flame Emperor']]],
    ['a3', '凍る入り江', 'Frozen Cove', [['area-03-01-mina', '潮見のミナ', 'Mina the Tidewatcher'], ['area-03-02-val', '氷壁のヴァル', 'Val of the Ice Wall'], ['area-03-03-nept', '海皇ネプト', 'Nept, Sea Emperor']]],
    ['a4', '古代の森', 'Ancient Forest', [['area-04-01-rim', '蔦使いリム', 'Rim the Vinecaller'], ['area-04-02-yona', '森の狩人ヨナ', 'Yona, Forest Hunter'], ['area-04-03-world-tree-guardian', '世界樹の守護者 ヴェルダ', 'Verda, World Tree Guardian']]],
    ['a5', '三属の頂', 'Summit of Three', [['area-05-01-twin-mages', '双子の術士 フレア & ミスト', 'Flare & Mist, Twin Mages'], ['area-05-02-nameless-swordsman', '無銘の剣士', 'The Nameless Swordsman'], ['area-05-03-triades', '三属の王 トリアデス', 'Triades, King of Three']]],
    ['a6', '黄昏の回廊', 'Twilight Corridor', [['area-06-01-riina', '観測者リィナ', 'Riina the Observer'], ['area-06-02-gear-pilgrim', '歯車の巡礼者 カルダン', 'Cardan, Pilgrim of Gears'], ['area-06-03-ordo', '黄昏の門番 オルド', 'Ordo, Twilight Gatekeeper']]],
    ['a7', '星辰の門', 'Gate of Stars', [['area-07-01-yue', '星読みのユエ', 'Yue the Stargazer'], ['area-07-02-kairos', '彗星騎士 カイロス', 'Kairos, Comet Knight'], ['area-07-03-astel', '門の守り手 アステル', 'Astel, Keeper of the Gate']]],
    ['a8', '王たちの座', 'Throne of Kings', [['area-08-01-nox', '無貌の使者 ノクス', 'Nox, the Faceless Envoy'], ['area-08-02-queen', '双極の女王 ディオーネ', 'Dione, Twin-Pole Queen'], ['area-08-03-astralis', '星辰王 アストラリス', 'Astralis, Star King']]],
    ['a9', '継承の間', 'Hall of Succession', [['area-09-01-hinata', '灯守りのヒナタ', 'Hinata, Keeper of the Flame'], ['area-09-02-souen', '墓守のソウエン', 'Souen, the Gravekeeper'], ['area-09-03-regalis', '継承王 レガリス', 'Regalis, the Inherited Crown']]]
  ];
  function renderRivals() {
    var h = '';
    AREAS.forEach(function (a, ai) {
      h += '<div class="area-h">' + T('エリア', 'Area ') + (ai + 1) + ' ' + esc(T(a[1], a[2])) + (ai === 8 ? '<span>' + T('クリア後', 'post-game') + '</span>' : '') + '</div>';
      a[3].forEach(function (e, i) {
        h += '<figure class="rival' + (i === 2 ? ' boss' : '') + '"><img src="assets/rivals/' + e[0] + '.webp" alt="' + esc(T(e[1], e[2])) + '" loading="lazy" width="360" height="360">'
          + '<b>' + (i === 2 ? '<small>' + T('ボス', 'BOSS') + '</small>' : '') + esc(T(e[1], e[2])) + '</b></figure>';
      });
    });
    document.getElementById('rivalgrid').innerHTML = h;
  }

  // ---- カード ----
  var CARDS = [
    ['f03', 'フレイムウルフ', 'Flame Wolf', 'fire', 2, 4, 2, 'common', '', ''],
    ['w03', 'アイスシャーク', 'Ice Shark', 'water', 2, 4, 3, 'common', '', ''],
    ['g07', '大樹のトレント', 'Great Treant', 'grass', 4, 6, 6, 'rare', '', ''],
    ['b_n3', '一騎打ちのカイ', 'Kai the Duelist', 'none', 4, 4, 3, 'uncommon', '【単騎】他のモンスターがいないとき +3/+2', '[Lone Wolf] +3/+2 while alone'],
    ['i_f3', '火継ぎの鍛冶', 'Flame-Passing Smith', 'fire', 3, 3, 4, 'uncommon', '【継承（+2/+2）】', '[Legacy (+2/+2)]'],
    ['i_w4', '蒼の後継者', 'Azure Successor', 'water', 5, 4, 6, 'rare', '【登場時】墓地からコスト3以下を1体出す', 'On Summon: revive a cost-3-or-less monster'],
    ['z_w6', '深淵の天球儀', 'Abyssal Orrery', 'water', 6, 4, 8, 'rare', '【守護】【加速】', '[Guard] [Accelerate]'],
    ['f10', '煉獄竜 ヴォルカニス', 'Volcanis, Purgatory Wyrm', 'fire', 6, 7, 5, 'rare', '【貫通】【登場時】相手に3ダメージ', '[Pierce] On Summon: 3 damage'],
    ['x_g6', '大地竜ガイオン', 'Gaion, Earth Dragon', 'grass', 6, 8, 7, 'epic', '【登場時】墓地からコスト4以下を1体出す', 'On Summon: revive a cost-4-or-less monster'],
    ['x_w6', '深海王 アビスガルド', 'Abyssgard, Deep King', 'water', 6, 6, 7, 'epic', '【守護】【登場時】相手1体を手札に戻し2枚引く', '[Guard] On Summon: bounce 1, draw 2'],
    ['b_lw1', '不凍の総督 リヴィエル', 'Riviel, Unfrozen Governor', 'water', 7, 4, 9, 'legend', '【守護】【隊列】全員に【隊列】、2枚引く', '[Guard] [Formation] All gain Formation, draw 2'],
    ['b_lg1', '千年樹の旗将 ユグドライン', 'Yggdraline, Banner Lord', 'grass', 8, 7, 9, 'legend', '【旗】【守護】全員に【旗】を与える', '[Banner] [Guard] All gain Banner'],
    ['z_lf1', '恒星炉 イグニシス', 'Ignisis, Stellar Furnace', 'fire', 8, 10, 7, 'legend', '【貫通】相手を全滅させ、数×2ダメージ', '[Pierce] Destroy all, 2 dmg each'],
    ['i_ln1', '継承王 レガリス', 'Regalis, the Inherited Crown', 'none', 7, 6, 6, 'legend', '【継承（+3/+3）】墓地から1体出す', '[Legacy (+3/+3)] Revive 1'],
    ['r_elsion', '三晶の大祭司 エルシオン', 'Elsion, High Priest', 'fire', 6, 5, 5, 'legend', '【三属】【選定】全員 +1/+1', '[Tri] [Choose] All +1/+1'],
    ['c_astralis', '星辰王 アストラリス', 'Astralis, Star King', 'none', 8, 7, 7, 'legend', '【登場時】相手を全て停止。毎ターン1ダメージ', 'On Summon: stun all. 1 dmg each turn']
  ];
  function renderCards() {
    document.getElementById('cardgrid').innerHTML = CARDS.map(function (c) {
      return '<div class="ccard ' + c[3] + (c[7] === 'legend' ? ' legend' : '') + '" title="' + esc(T(c[1], c[2])) + '">'
        + '<span class="nm">' + esc(T(c[1], c[2])) + '</span><span class="cost">' + c[4] + '</span>'
        + '<img src="assets/cards/' + c[0] + '.webp" alt="" loading="lazy" width="300" height="300">'
        + '<span class="tx">' + esc(T(c[8], c[9])) + '</span>'
        + '<span class="st"><span class="a">⚔ ' + c[5] + '</span><span class="d">🛡 ' + c[6] + '</span></span></div>';
    }).join('');
  }

  // ---- スクリーンショット ----
  function renderShots() {
    var l = lang, names = ['02-battle', '04-adventure', '05-deck', '06-collection', '01-set5-library', '03-legend-pull', '04-holo-characters', 'mobile'];
    document.getElementById('shotrow').innerHTML = names.map(function (n) {
      return '<img src="assets/shots/' + l + '-' + n + '.webp" alt="" loading="lazy">';
    }).join('');
  }

  // ---- 更新履歴 ----
  var UPDATES = [
    ['2026-09-20', 'Ver 1.3', ['景品・バックアップ・はじめての人', 'Prizes, backup, and a faster start'], [
      ['水曜・土曜の特別ルールの日に、ランキング3位までへ「絵違いカード」の景品', 'Alternate-art card prizes for the top 3 on special rule days (Wed & Sat)'],
      ['絵違いカードは、デッキ編集でカードごとに切り替え可能', 'Switch each card between alternate and standard art in the Deck Builder'],
      ['セーブの自動バックアップと「復元コード」', 'Automatic save backup with a recovery code'],
      ['はじめての人は、名前を決めるとそのまま最初の対戦へ（言語は自動判定）', 'New players go straight into the first battle (language follows your device)'],
      ['読み込み中の画面（遊び方のヒント付き）', 'A loading screen with gameplay tips'],
      ['背景画像が表示されない不具合を修正', 'Fixed missing background art on itch and PLiCy']]],
    ['2026-09-17', 'Ver 1.2', ['第5弾『継ぐ者たち』', 'Set 5: The Inheritors'], [
      ['新キーワード【継承】のカード24枚', '24 cards built around the new [Legacy] keyword'],
      ['クリア後の新エリア『継承の間』とキャラクターカード3枚', 'Post-game area "Hall of Succession" with 3 new character cards'],
      ['レア・エピック・レジェンドで変わるパック開封の演出。キャラクターカードはホロ仕様に', 'Tiered pack reveals; holographic character cards'],
      ['今日の選定の儀に「特別ルールの日」', 'Special rule days in the Daily Rite'],
      ['【観測】の作り直し、【傭兵】の強化、第4弾カードの調整', '[Observe] rebuilt, [Mercenary] buffed, Set 4 adjustments'],
      ['タイトルの「お知らせ」ボタン、霊獣のアイコン5種とアイコンの枠6種', '"What\'s new" button, 5 spirit-beast avatars and 6 avatar frames'],
      ['図鑑・デッキ編集の読み込みを軽く', 'Faster Library and Deck Builder']]],
    ['2026-09-13', 'Ver 1.1', ['実績と毎日のランキング', 'Achievements and the daily ranking'], [
      ['実績と称号、敵キャラ24人のアイコン', 'Achievements, titles, and 24 rival avatars'],
      ['「今日の選定の儀」— 全員が同じ条件で競う毎日のランキング', 'Daily Rite — a daily ranking where everyone plays the same cards'],
      ['勝利画面からパックをその場で開けるように', 'Open reward packs right from the victory screen'],
      ['BGMを差し替え', 'New music']]],
    ['2026-09-12', 'Ver 1.1', ['新モード「選定の儀」', 'New mode: Rite of Choosing'], [
      ['2枚1組から選んでその場でデッキを組み、5人と連戦', 'Draft a deck from pairs and fight 5 rivals'],
      ['ここでしか手に入らない限定カード4枚と、新しい能力【選定】', '4 exclusive cards and the new [Choose] ability'],
      ['最初の対戦に手引きを追加', 'A guided first battle']]],
    ['2026-09-11', 'Ver 1.0', ['公開', 'Release'], [
      ['第1〜4弾のカード158種、8エリア・24人のライバル', '158 cards across Sets 1–4, 8 areas and 24 rivals'],
      ['日本語／英語対応。itch.io と フリーゲーム夢現で公開', 'Japanese and English. Released on itch.io and Freegame Mugen']]]
  ];
  function renderUpdates() {
    document.getElementById('timeline').innerHTML = UPDATES.map(function (u) {
      return '<li><time>' + u[0] + ' · ' + u[1] + '</time><h3>' + esc(T(u[2][0], u[2][1])) + '</h3><ul>'
        + u[3].map(function (x) { return '<li>' + esc(T(x[0], x[1])) + '</li>'; }).join('') + '</ul></li>';
    }).join('');
  }

  // ---- 声を届ける（サーバー経由で作者へ。アドレスは出さない） ----
  var form = document.getElementById('voiceform'), msg = document.getElementById('formmsg');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var text = form.msg.value.trim();
    if (!text) { msg.textContent = T('内容を書いてください', 'Please write a message'); form.msg.focus(); return; }
    var b = form.querySelector('button'); b.disabled = true;
    msg.textContent = T('送っています…', 'Sending…');
    fetch('https://te.161-33-217-165.nip.io/say/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name.value.trim(), msg: text, lang: lang, hp: form.hp.value })
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      form.msg.value = ''; msg.textContent = T('届きました。ありがとうございます！', 'Received — thank you!');
    }).catch(function () {
      msg.textContent = T('送れませんでした。時間をおいてもう一度お願いします。', 'Could not send. Please try again later.');
    }).finally(function () { b.disabled = false; });
  });

  function renderAll() { renderRivals(); renderCards(); renderShots(); renderUpdates(); }
  applyLang(lang);
})();
