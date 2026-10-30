// TRI-ELEMENTS ホームページ。言語の切り替え・ライバル・カード・更新履歴・声のフォーム。
(function () {
  'use strict';
  // ---- 言語（端末の言語で決め、ボタンで切り替え。選んだものは覚える） ----
  var lang = 'ja';
  try { lang = localStorage.getItem('te-site-lang') || (/^ja/i.test(navigator.language) ? 'ja' : 'en'); } catch (e) {}
  // ゲームのリンク（?lang=ja / ?lang=en）から来たら、その言語で開く
  var qlang = (location.search.match(/[?&]lang=(ja|en)/) || [])[1];
  if (qlang) lang = qlang;
  var body = document.body, btn = document.getElementById('langbtn');
  function applyLang(l) {
    lang = l; body.dataset.lang = l; document.documentElement.lang = l;
    btn.textContent = l === 'ja' ? 'EN' : '日本語';
    document.title = l === 'ja' ? 'TRI-ELEMENTS 三属の戦記｜ブラウザで遊べる無料カードバトル' : 'TRI-ELEMENTS: Chronicle of the Three — a free browser card battle game';
    try { localStorage.setItem('te-site-lang', l); } catch (e) {}
    // 遊ぶボタン：日本語は PLiCy、英語は itch.io（どちらも同じ最新版）
    var url = l === 'ja' ? 'https://html5.plicy.net/GamePlay/237147' : 'https://chicken-ball.itch.io/tri-elements';
    ['playmain', 'playtop'].forEach(function (id) { var a = document.getElementById(id); if (a) a.href = url; });
    renderAll();
  }
  btn.addEventListener('click', function () { applyLang(lang === 'ja' ? 'en' : 'ja'); });

  // ---- どこから来たかを数える（2026-10-23）。YouTube・Bluesky の説明欄のリンクは ?from=yt / ?from=bsky 付き ----
  //   送るのは「開いた」「遊ぶボタンを押した（itch・PLiCy のどちら）」と、来た元（from か、リンク元のサイト名）だけ。名前などは送らない
  (function () {
    try {
      if (navigator.webdriver || /^(localhost|127\.|192\.168\.)/.test(location.hostname)) return;   // 確認の道具・手元では送らない
      var EP = 'https://te.161-33-217-165.nip.io/e';
      var id = '';
      try { id = localStorage.getItem('te-site-id') || ''; } catch (e) {}
      if (!id) { id = 's' + Math.random().toString(36).slice(2, 10); try { localStorage.setItem('te-site-id', id); } catch (e) {} }
      var q = (location.search.match(/[?&]from=([a-z0-9_-]{1,16})/i) || [])[1];
      var ref = '';
      try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '').slice(0, 30) : ''; } catch (e) {}
      if (ref === location.hostname) ref = '';
      var from = (q || ref || 'direct').toLowerCase();
      var send = function (extra) {
        var u = EP + '?v=1&e=site&u=' + encodeURIComponent(id) + '&f=' + encodeURIComponent(from) + '&l=' + lang + extra;
        try { if (navigator.sendBeacon && navigator.sendBeacon(u)) return; } catch (e) {}
        try { new Image().src = u; } catch (e) {}
      };
      send('&a=open');
      document.addEventListener('click', function (ev) {
        var a = ev.target.closest && ev.target.closest('a[href]'); if (!a) return;
        var to = /itch\.io\/tri-elements/.test(a.href) ? 'itch' : /plicy\.net\/GamePlay/.test(a.href) ? 'plicy' : /freegame-mugen/.test(a.href) ? 'mugen' : '';
        if (to) send('&a=go&to=' + to);
      }, true);
    } catch (e) { /* 数えられなくても、ページはそのまま */ }
  })();

  // ---- スマホのメニュー（≡）。項目を押したら閉じる ----
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  function setMenu(open) { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (ev) { if (ev.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') setMenu(false); });
  var T = function (ja, en) { return lang === 'ja' ? ja : en; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // ---- 動画（押すまで YouTube を読まない＝軽い） ----
  var yt = document.getElementById('yt');
  yt.querySelector('button').addEventListener('click', function () {
    var f = document.createElement('iframe');
    // 広告ムービー（日本語ページは日本語版、英語ページは英語版）。紹介動画は data-play
    f.src = 'https://www.youtube-nocookie.com/embed/' + (lang === 'ja' ? yt.dataset.ja : yt.dataset.en) + '?autoplay=1&rel=0';
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
    ['a9', '継承の間', 'Hall of Succession', [['area-09-01-hinata', '灯守りのヒナタ', 'Hinata, Keeper of the Flame'], ['area-09-02-souen', '墓守のソウエン', 'Souen, the Gravekeeper'], ['area-09-03-regalis', '継承王 レガリス', 'Regalis, the Inherited Crown']]],
    ['a10', 'ゼンジの作業場の夜', 'Zenji’s Workshop at Night', [['area-10-01-tantaka', '鼓笛隊長 タンタカ', 'Drum Major Tantaka'], ['area-10-02-penpen', '司書長 ペンペン', 'Head Librarian Penpen'], ['area-10-03-tsugihagi', '未完の竜 ツギハギ', 'Unfinished Dragon Tsugihagi']]]
  ];
  function renderRivals() {
    var h = '';
    AREAS.forEach(function (a, ai) {
      h += '<div class="area-h">' + T('エリア', 'Area ') + (ai + 1) + ' ' + esc(T(a[1], a[2])) + (ai >= 8 ? '<span>' + T('クリア後', 'post-game') + '</span>' : '') + '</div>';
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

  // ---- おすすめデッキ（decks.js） ----
  function renderDecks() {
    var D = window.TE_DECKS || [];
    document.getElementById('deckgrid').innerHTML = D.map(function (d) {
      return '<article class="deck ' + d.el + '"><div class="deck-h"><h3>' + esc(T(d.ja, d.en)) + '</h3><span class="deck-tag">' + esc(T(d.tag[0], d.tag[1])) + '</span></div>'
        + '<div class="deck-keys">' + d.key.map(function (k) {
          return '<figure><img src="assets/cards/' + k[0] + '.webp" alt="" loading="lazy" width="256" height="256"><figcaption>' + esc(T(k[1], k[2])) + '</figcaption></figure>';
        }).join('') + '</div>'
        + '<p>' + esc(T(d.sja, d.sen)) + '</p>'
        + '<ul class="tips">' + (lang === 'ja' ? d.tip : d.tipen).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'
        + '<details><summary>' + T('30枚のリストを見る', 'See all 30 cards') + '</summary><table>' + d.list.map(function (r) {
          return '<tr><td class="c">' + r[0] + '</td><td><span class="dot ' + r[3] + '"></span>' + esc(T(r[1], r[2])) + '</td><td class="n">×' + r[4] + '</td></tr>';
        }).join('') + '</table></details></article>';
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
    ["2026-10-31", "Ver 2.6.2", ["カードの調整の窓・不具合の修正・新しいレギュレーション戦", "Card-change window, a battle fix, and a new Regulation Battle"], [
      ["カードの調整のお知らせに「調整したカードを見る」ボタンがつきました。イラストと、調整前後の効果を見比べられます", "Card-change news now has a “See the changed cards” button that shows the card art and the effects before and after."],
      ["11/5（木）〜11/11（水）は、レギュレーション戦「鉄旗の陣」。第4弾のカードだけで戦います", "Nov 5–11: the Regulation Battle “Iron Banner Formation”. Only Set 4 cards may be used."],
      ["対戦中、押した瞬間に札が変わると、画面が止まることがあった不具合を直しました", "Fixed a bug where the battle screen could freeze if a card changed at the moment you tapped."],
      ["文章の変な改行を直しました", "Fixed awkward line breaks in text."]
    ]],
    ["2026-10-30", "Ver 2.6.1", ["検索の欄で日本語が打ちやすく", "Typing in the search box"], [
      ["カードを探す欄で、日本語を変換している途中に確定してしまう不具合を直しました（ひとことの声から）", "Fixed the card search box confirming Japanese input before you finished converting it (from player feedback)"],
    ]],
    ["2026-10-29", "Ver 2.6.0", ["カードショップとパック開封が新しく", "A new Card Shop and pack opening"], [
      ["カードショップがお店になりました。棚のパックを押すと大きく見られて、左右にめくれます。まだ持っていないカードと、集めた枚数も見られます", "The Card Shop is now a real shop. Tap a pack on the shelf to see it up close and swipe through the others, with the cards you don’t have yet and how many you’ve collected"],
      ["日替わりのセール（ひとり1日1つ）と、5パックまとめ買い（1パックぶんお得）を足しました。ダブったカードの買取もお店の中にあります", "Added a daily sale (one per player per day) and a 5-pack bundle (one pack cheaper). Duplicate buyback is in the shop too"],
      ["火・木・日は旅の商人が来ます。火曜は炎・水・草のパック、木曜はサポートパックとプリズムパックのセール、日曜は前に景品で配った絵違いを1枚（11/1から）", "A traveling merchant visits on Tue, Thu and Sun: Fire, Water and Grass Packs on Tuesday, Support Packs and a Prism Pack sale on Thursday, and one past alt-art prize on Sunday (from Nov 1)"],
      ["パックの開け方を作り直しました。上の帯を横に切って開け、1枚ずつ大きくめくります。「すぐ開ける」も選べます", "Pack opening is all new: slice the top strip, then flip the cards one by one up close. You can also choose to open quickly"],
      ["第1〜6弾とプリズムパックに、新しいパックの絵を付けました", "New pack art for Sets 1–6 and the Prism Pack"],
      ["第1〜3弾のパックの名前を、図鑑の弾の名前にそろえました", "Set 1–3 packs now use the same names as the sets in the Library"],
      ["試練の塔：炎の最初のデッキの火吹きヒナを1枚、火炎弾にしました（ひとことの声から）", "Tower of Trials: the Fire starting deck swaps one Fire-Breathing Chick for a Fireball (from player feedback)"],
      ["いくつかの不具合を修正しました", "Fixed a few bugs"],
    ]],
    ["2026-10-27", "Ver 2.5.0", ["カードの見直し・デッキ20個・攻撃の予約", "Card refresh, 20 deck slots and queued attacks"], [
      ["あまり使われていなかったカード10枚を見直しました", "Reworked 10 underused cards"],
      ["山札から探すカード：輪廻の環（コスト2以下の草モンスター2枚・2コストに）、継承の軍旗（【旗】のモンスター2枚まで・3コストに）、静かな継承（【継承】のモンスター2枚まで）、隊列を組め（【隊列】のモンスター1枚）、忘れ形見のクラゲ（断末魔で【継承】のカード1枚）", "Deck-search cards: Circle of Rebirth (2 Grass monsters costing 2 or less, now 2 cost), Banner of Succession (up to 2 [Banner] monsters, now 3 cost), Quiet Succession (up to 2 [Legacy] monsters), Fall In! (a [Formation] monster), Keepsake Jelly (Last Breath: a [Legacy] card)"],
      ["氷の防壁：並びの条件をなくし、自分のモンスター全部を次の相手のターンが終わるまで戦闘で守るように（どの属性でも）。万象の鏡：相手の場を山札に戻して混ぜる（6コスト）", "Ice Barrier no longer needs adjacent monsters: all your monsters can’t be destroyed in battle until the end of the opponent’s next turn. Mirror of All Things now shuffles all enemy monsters into their deck (6 cost)"],
      ["大地の反撃は2コストに、入れ替えの符は1コストになりました", "Earth’s Counter now costs 2, and Recall Talisman costs 1"],
      ["世界樹の化身 ユグドラ：5コスト・5/6になり、【登場時】自分の草モンスター全てを+2/+2するように（星環の門と役目が重なっていたため）", "Yggdra, World Tree Avatar now costs 5 and is 5/6. On Summon, it gives all your Grass monsters +2/+2 (it overlapped too much with Star Ring Gate)"],
      ["図鑑の詳細検索に「山札から探す」を足しました", "Added “Search deck” to the Library’s advanced search"],
      ["保存できるデッキが8個から20個になりました（ひとことの案から）", "You can now save 20 decks instead of 8 (from player feedback)"],
      ["攻撃の演出中に次の攻撃を押すと、いまの攻撃が当たったらすぐに行うようにしました（ひとことの案から）", "Tap your next attack during an attack animation and it goes off as soon as the current one lands (from player feedback)"],
      ["停止中のモンスターを攻撃モードにするときの確認は、防御モードのほうが守りが固いときだけ出るようにしました（ひとことの案から）", "The check when switching a stunned monster to Attack Mode now appears only when Defense Mode protects it better (from player feedback)"],
      ["レギュレーション戦の印を新しくしました", "New look for Regulation Battle marks"],
      ["いくつかの不具合を修正しました", "Fixed a few bugs"],
    ]],
    ["2026-10-26", "Ver 2.4.1", ["「作者から」の赤丸・小さきものの行進の予告", "New-message dot and March of the Small preview"], [
      ["タイトルの「作者から」に新しい文が届いたら、赤い丸で知らせるようにしました", "When a new message from the creator arrives, the “From the creator” button on the title screen now shows a red dot"],
      ["10/29（木）から11/4（水）まで、レギュレーション戦「小さきものの行進」を開きます（コスト3以下のモンスターだけ・勝つと印がたまり、9つで絵違い「群れの先達」）", "Regulation Battle “March of the Small” runs Oct 29 – Nov 4: monsters costing 3 or less only. Wins earn marks, and nine marks get the alt-art Herd Leader"],
    ]],
    ["2026-10-25", "Ver 2.4.0", ["「イベント」の入口", "The new Events hub"], [
      ["タイトルの「週替わりチャレンジ」が「イベント」になりました。開催中のイベントがバナーで並びます。これからのイベントも、ここに増えていきます", "The Weekly Challenge button on the title screen is now “Events” — live events appear as banners, and more are on the way"],
      ["週替わりチャレンジの画面を作り直しました。今週の切り札が大きく出て、終了までの時間が分かります。ランキングは称号とアイコンの枠つきです", "The Weekly Challenge screen is redesigned: this week’s ace up front, a countdown to the end, and a ranking with titles and avatar frames"],
      ["勝った相手の顔アイコン「チャレンジの顔」は、「討伐の証」という名前になりました", "Challenge face avatars are now called “Trophies”"],
    ]],
    ["2026-10-25", "Ver 2.3.2", ["試練の塔の最初のデッキを見直し", "Tower of Trials starter decks reworked"], [
      ["試練の塔の最初のデッキに、どの属性でも「落とし穴」（防御モードの相手1体を破壊）を1枚入れました。守りを固められても崩せます", "Every Tower starter deck now has a Pitfall (destroy 1 enemy monster in Defense Mode), so walls can be broken"],
      ["最初のデッキのうち2枚が、登るたびにランダムで変わるようになりました", "Two cards in the starter deck now change at random every climb"],
      ["水のデッキの「威圧」を「挑発」に変えました", "The water starter deck’s Intimidate is now Provoke"],
      ["勝ったあとのカードを選ぶ画面に、「これにする」ボタンを付けました", "Added a “Take this” button on the card-choice screen after a win"],
      ["不具合を調べるため、ゲームの中でエラーが起きたときに、その場所だけを匿名で送るようにしました（設定 → データ で止められます）", "To track down bugs, the game now sends only where an error happened, anonymously (you can turn this off in Settings → Data)"],
    ]],
    ["2026-10-23", "Ver 2.3.1", ["はじめての人はすぐ対戦へ", "New players start battling right away"], [
      ["はじめて開いた人は、名前を決める前に、すぐ最初の対戦が始まるようにしました（名前は対戦のあとで決めます）", "First-time players now jump straight into their first battle; you choose your name afterwards"],
      ["覚醒したトゲの門番・積み木のゴーレムのトゲが、倒されたときも攻撃してきた相手に効くようにしました（カードの文のとおり）", "The thorns of awakened Thorn Gatekeeper and Block Golem now hit the attacker even when they are destroyed, as the card text says"],
    ]],
    ["2026-10-22", "Ver 2.3.0", ["試練の塔に限定カードと特別なボス", "Tower-exclusive cards and special bosses"], [
      ["試練の塔だけで手に入る限定カードを追加しました（全8枚・どれも1枚まで）", "Added cards you can only get in the Tower of Trials (8 in all, one copy each)"],
      ["はじめて頂上に着く前に、最後の相手として「工房の主 ゼンジ」が待っています", "Before your first summit, Zenji the workshop master waits as your final opponent"],
      ["塔の階位3・6・10の最後には、特別なボス（塔の記録係 シオリ・終わらぬ挑戦者 グレン・頂の結晶 プリズマ）が待っています。勝つと、そのボスのカードがもらえます", "At Tower ranks 3, 6 and 10, a special boss waits at the top (Shiori, Glen and Prisma). Beat one to get their card"],
      ["同じ属性のデッキで、ちがうリーダー3人が頂上に着くと、その属性の「風」のカードがもらえます", "Reach the top with three different leaders using the same element’s deck to get that element’s Wind card"],
      ["塔のふもとに「ミッション」を置きました。もう条件を満たしている人は、ボタンを押して受け取ってください（赤い丸が目印です）", "Added “Missions” at the foot of the tower. If you’ve already met a goal, just tap to claim it (look for the red dot)"],
      ["いくつかの不具合を修正しました", "Fixed a few bugs"],
    ]],
    ["2026-10-20", "Ver 2.2.0", ["新モード「試練の塔」（β版）", "New mode: Tower of Trials (beta)"], [
      ["タイトルに「試練の塔」を追加しました。15枚の小さなデッキで、3章・36階の頂上をめざすモードです（冒険のエリア10をクリアすると遊べます）", "New on the title screen: Tower of Trials. Climb 3 acts and 36 floors with a small 15-card deck (unlocks after clearing Adventure Area 10)"],
      ["勝つたびにカードを手に入れてデッキを育て、リーダーの技は1戦に1回使えます。章のボスを倒すと、そのボスがリーダーとして仲間になります", "Win to collect cards and grow your deck. Your leader’s skill works once per battle, and defeated act bosses join you as leaders"],
      ["勝つと星屑がもらえます（いつものモードで使えます）。頂上に着くと、星屑のおまけ・称号・新しい形のアイコンの枠がもらえます", "Wins earn Stardust for the main game. Reach the top for bonus Stardust, a title and a new-shaped icon frame"],
      ["登っている途中で「中断」すると、次に塔へ入ったとき続きから遊べます（対戦中に中断した戦いは、最初からになります）", "Press “Pause” mid-climb and continue next time you enter the tower (a battle paused midway restarts from the beginning)"],
      ["塔のふもとと、登っている途中の上の帯に「遊び方」を置きました", "Added “How to play” at the foot of the tower and in the top bar while climbing"],
      ["キャラのカードの絵の位置を見直して、顔が見えやすくなりました", "Re-framed the character card art so faces are easier to see"],
      ["週替わりチャレンジのランキングを、6位から下も見られるようにしました", "The Weekly Challenge ranking now shows 6th place and below"],
      ["試練の塔の地図：部屋のまんなかに相手の顔、右下に相手の属性を出しました。風の部屋は、丸のまわりを風が回ります。塔にいるあいだは曲が途切れないようにしました", "Tower map: rooms now show the enemy’s face in the middle and its element at the lower right. Windy rooms have wind circling them. The music no longer cuts between tower screens"],
      ["はじめて試練の塔に入ると、ゼンジが画面の上で遊び方を案内します（遊び方の窓から、もう一度見られます）", "First time in the tower, Zenji walks you through it on screen (replay it from “How to play”)"],
      ["PLiCy で、対戦の右上の「投了」などがPLiCyのボタンに隠れて押せなかったのを直しました", "On PLiCy, the top-right battle buttons (like Surrender) were hidden under PLiCy’s own buttons — fixed"],
      ["試練の塔：章の後半（7階から）で、次の弾のカードが出るようにしました（1章後半で第3弾、2章で第4弾、2章後半で第5弾、3章で第6弾）", "Tower: the next set’s cards now appear from floor 7 of each act (Set 3 late in Act 1, Set 4 in Act 2, Set 5 late in Act 2, Set 6 in Act 3)"],
      ["対戦の下のボタンを見やすくしました。「鍛錬」とリーダーの技は、長押し（PCは右クリック）で説明が見られます", "Tidied the battle buttons. Long-press (right-click on PC) Forge or a leader skill to see what it does"],
      ["β版のため、これから調整していきます。塔のふもとの「感想を送る」から、ボタンを押すだけで感想を送れます", "It’s a beta and will keep changing. Use “Send feedback” at the foot of the tower to tell us what you think with a tap"],
      ["β版のため、これから調整していきます", "It’s a beta and will keep changing"],
    ]],
    ["2026-10-17", "Ver 2.1.8", ["キャラのカットイン・ダブりを星屑に", "Character cut-ins and duplicates to Stardust"], [
      ["■対戦", "■Battle"],
      ["キャラカード（30人）を出すと、そのキャラの全身の絵が画面に現れて、名前と決めゼリフが出ます（1秒ちょっと）。盤面は透けて見えたままで、画面を押すとすぐ飛ばせます。相手が出したときも出ます。", "Playing any of the 30 character cards brings that character's full-body art on screen with their name and a catchphrase (just over a second). The board stays visible underneath, and a tap skips it. It also plays when your opponent plays one."],
      ["■図鑑", "■Library"],
      ["図鑑の「絵違いの予定」の横に「ダブりを星屑に」を足しました。デッキに入れられる枚数（3枚・レジェンドは1枚）より多いカードだけを星屑に交換します。レートは、コモン10枚で1・アンコモン5枚で1・レア2枚で1・エピック1枚で2・レジェンド1枚で5。割り切れない分は手元に残り、次に交換するときに一緒に数えます。キャラカードなどの特別なカードは対象外です。", "Added “Duplicates → Stardust” next to the alt-art schedule in the Library. Only copies beyond what a deck can hold (3, or 1 for Legends) are traded: 10 Commons, 5 Uncommons or 2 Rares for 1, 2 per Epic, 5 per Legend. Leftovers stay in your collection and count toward the next trade. Character cards and other special cards are not included."],
    ]],
    ["2026-10-16", "Ver 2.1.7", ["山札の枚数の位置・PLiCyのボタン", "Deck count position and PLiCy buttons"], [
      ["■対戦", "■Battle"],
      ["自分の山札と墓地の枚数を、札の下から上に移しました。相手の枚数は札の下のままなので、どちらも盤面のまんなか側に並びます。スマホの縦画面では、自分の枚数が盤面の下のふちで切れて見えないことがありました。", "Your deck and graveyard counts moved from below the piles to above them. The opponent’s stay below theirs, so both sit toward the middle of the board. On some phones in portrait, your count was cut off at the bottom edge of the board."],
      ["■不具合の修正", "■Fixes"],
      ["PLiCy：画面の右上に PLiCy の「ミニ実況」ボタンが重なり、その下にある「×」や「デッキ編集」「保存」「挑戦する」などが押せなかったのを直しました（PLiCy 版だけの直しです）。", "PLiCy: PLiCy’s “mini let’s-play” button sits in the top-right corner, so the × and buttons such as Edit Deck, Save and Challenge underneath couldn’t be tapped. Fixed (PLiCy version only)."],
    ]],
    ["2026-10-14", "Ver 2.1.6", ["出すときのモード・景品の印・カードの書き方", "Summon mode, prize marks and clearer card text"], [
      ["■対戦", "■Battle"],
      ["設定の「プレイヤー」に「モンスターを出すときのモード」を足しました。「いつも攻撃モードで出す」にすると、空いている枠に出すときのモードの選択がなくなります。防御モードにしたいときは、出したあとにそのモンスターを2回押します。入れ替えて出すときは、これまでどおり選べます。", "Added “Mode when summoning” to Settings → Player. With “Always Attack Mode”, summoning into an empty slot skips the mode choice; tap the monster twice afterwards for Defense Mode. You still choose when replacing a monster."],
      ["■選定の儀", "■Daily Rite"],
      ["景品のある日は、まだ挑戦していないとき・ランキングに参加していないとき・いまの順位が景品の外のときに、タイトルの「選定の儀」に印が出て、今日の一行にも理由が出ます。", "On prize days, the Rite button on the title screen gets a mark — with the reason in today’s line — if you haven’t tried yet, haven’t joined the ranking, or are outside the prize ranks."],
      ["■カードの書き方", "■Card text"],
      ["モンスターへの効果は「防御力を-2する」のように書くことにして、「ダメージ」はプレイヤーのライフを減らすときだけに使うようにしました（鉄靴の擲弾兵・挟撃の一手・花火大王 ドンドコ・トゲの門番・積み木のゴーレム・【突撃】）。対戦の記録も「防御力 -2（残り1）」と出ます。", "Effects on monsters now read like “give -2 DEF”, and “damage” only means damage to a player’s Life (Ironboot Grenadier, Pincer Move, Dondoko, Thorn Gatekeeper, Block Golem, [Cleave]). The battle log shows “-2 DEF (1 left)” too."],
      ["詳細検索の「ダメージ」を「プレイヤーにダメージ」と「防御力を下げる」に分けました。", "Advanced search now splits “Damage” into “Damage to player” and “Lower DEF”."],
      ["■不具合の修正", "■Fixes"],
      ["溶岩の申し子：断末魔で防御力が0になった相手が、破壊されずに残ることがあったのを直しました。", "Lava Spawn: a monster brought to 0 DEF by its Last Breath sometimes stayed on the field. Fixed."],
    ]],
    ["2026-10-14", "Ver 2.1.5", ["選定の儀のライバルの点数", "Daily Rite rival scores"], [
      ["選定の儀のライバルの点数を出すとき、対戦相手がプレイヤーと戦うときと違う動き（最初の手札の引き直しの決まりと、迷い方）をしていたのを直しました。10/14 の点数から、プレイヤーとまったく同じ条件で計算しています。", "When the Daily Rite rival scores were calculated, the opponents behaved differently from how they play against you (their opening redraw rule and how they hesitate). From October 14, rival scores use exactly the same conditions as yours."],
      ["タイトルの「作者から」を、ゲームを更新しなくてもお届けできるようにしました。", "“From the maker” on the title screen can now be updated without a game update."],
    ]],
    ["2026-10-13", "Ver 2.1.4", ["対戦の操作と絵違いの予定", "Quicker battle controls and an alt-art schedule"], [
      ["■対戦", "■Battle"],
      ["自分のモンスターを押して、相手のモンスターか相手の顔を押すだけで攻撃できるようにしました。選んだモンスターは金色に光ります。同じモンスターをもう一度押すとモード変更です。攻撃もモード変更もできないモンスターを押すと、カードの説明が出ます。", "Tap your monster, then tap an enemy monster or your opponent to attack. The chosen monster glows gold, and tapping it again switches its mode. Tapping a monster that can do neither shows its card."],
      ["■絵違いの予定", "■Alt-art schedule"],
      ["図鑑とショップに「絵違いの予定」を足しました。選定の儀は2週間ぶん、週替わりチャレンジは4週ぶんの景品と、いつでも取れる絵違いが、取り方と一緒に見られます。", "Added “Alt-art schedule” to the Library and Shop: the next two weeks of Daily Rite prizes, four weeks of Weekly Challenge prizes, and the always-available ones, with how to get each."],
      ["■そのほか", "■Other"],
      ["PC：画面の縦が短いとき、タイトルのロゴが上に隠れていたのを直しました。上下の矢印キー・PageUp/PageDown・Home で画面をスクロールできます。", "PC: the title logo no longer hides off the top on short screens. Arrow keys, PageUp/PageDown and Home now scroll the screen."],
      ["冒険：エリア名の横の ▶ と「一覧」が、エリア名の長さで動かないようにしました（▶ の連打で「一覧」を押してしまうことがありました）。", "Adventure: the ▶ and “All areas” buttons no longer move with the area name’s length."],
      ["苗床の守り手・突撃合図：効果に合うよう説明文を直しました（苗床の守り手は自分には効きません。突撃合図の +1/+1 はターンが終わっても残ります）。", "Seedbed Keeper and Battle Cry: card texts now match their effects (Seedbed Keeper doesn’t boost itself; Battle Cry’s +1/+1 lasts beyond the turn)."],
    ]],
    ["2026-10-13", "Ver 2.1.3", ["覚醒の説明と不具合の修正", "Awakening tips and bug fixes"], [
      ["覚醒を持つカードを初めて場に出したとき、覚醒の3種類（夜明け・撃破・堅守）とそのカードの効果を説明するようにしました。初めて覚醒したときにも、何が起きたかを1回だけ説明します。", "The first time you play a card with Awaken, a short note explains the three kinds (Dawn, Defeat, Hold) and that card’s effect. The first time one awakens, it explains what happened."],
      ["再生の芽吹き：墓地から選ぶとき、草以外のモンスターも並んでいて、選ぶと何も出ずにカードだけ使われていたのを直しました。草のモンスターだけが並びます。", "Rebirth Sprout: non-Grass monsters were listed when choosing from the graveyard, and picking one used up the card with no effect. Now only Grass monsters are listed."],
      ["甦りの森：2体目が「選んだカードの次のカード」になり、別の属性だと出なかったのを直しました。2枚まで選んでから「出す」を押す形にしました。", "Forest Reborn: the second monster was whichever card came after your pick, and nothing came out if it was another element. You now choose up to two cards, then press Summon."],
      ["最初の対戦の「防御モード」の説明：守る側の属性の有利（防御+1）が数字に入っておらず、結果と食い違うことがあったのを直しました。攻撃の知らせにも、防御+1 で受け止めたことが出ます。", "First-battle Defense Mode tip: the numbers left out the defender’s element advantage (+1 DEF) and could contradict the result. The attack notice now shows the +1 DEF as well."],
      ["はじめの名前とアバターの画面：スマホでキーボードを出すとアバターの並びが崩れていたのを直しました。", "First-time name and avatar screen: avatars no longer fall out of line when the phone keyboard opens."],
      ["AI が再生の芽吹きで草以外を選んで空振りすることがあったのを直しました。", "The AI no longer wastes Rebirth Sprout on a non-Grass monster."],
    ]],
    ["2026-10-12", "Ver 2.1.2", ["冒険のエリア選びと図鑑を使いやすく", "Easier area picking and Card Library"], [
      ["冒険：エリアを1〜10の番号で全部並べました。押すとそのエリアへすぐ行けます。番号の下の印で、倒した数・報酬が残っているか・報酬も受け取り済みかが分かり、次に進むエリアには赤い点が付きます。", "Adventure: all ten areas are lined up by number — tap one to jump there. Marks show how many rivals you beat, whether rewards are left, or if everything is claimed, and a red dot marks the next area."],
      ["図鑑：「絞り込みをたたむ」で上の部分を1行にまとめ、カードを広く見られるようにしました。", "Library: “Hide filters” folds the top into one row so you can see more cards."],
      ["図鑑：絵違いカードを持っている人は「✦ 絵違い」で絞り込めます。カードの詳細から、そのカードを持っていなくても、絵違いと通常の絵を切り替えられます。", "Library: filter for your alternate art with “✦ Alt art”, and switch between alternate and standard art from the card details — even if you don’t own the card itself."],
    ]],
    ["2026-10-12", "Ver 2.1.1", ["新しい絵違いカード：ビビッドアートポスター風の6枚", "New alternate art: six vivid-poster cards"], [
      ["フリーバトルの「極」で属性の王に10勝すると、竜の絵違いが届きます（炎皇バルガ→業火のドラゴン／海皇ネプト→海淵のリヴァイアサン／世界樹の守護者 ヴェルダ→棘竜ソーンドレイク）。これまでに勝った数も数えます。", "Beat an elemental ruler 10 times on Extreme in Free Battle to receive a dragon’s alternate art (Varga → Inferno Dragon / Nept → Abyssal Leviathan / Verda → Thorn Drake). Earlier wins count too."],
      ["カードショップで、シンダーウィッチ・フロストウィッチ・世界樹の化身 ユグドラの絵違いを星屑100で交換できます。", "Trade 100 Stardust each in the Card Shop for alternate art of Cinder Witch, Frost Witch and Yggdra."],
      ["フリーバトルの相手の札とショップの並びをそろえ、相手のターンの表示は肩書きと名前を2行に分けました。", "Free Battle opponents and Shop items now line up neatly, and the opponent turn banner shows title and name on separate lines."],
      ["みんなのデッキに、第6弾のカードが入ったデッキも出せるようにしました。", "Decks with Set 6 cards can now be shared on the deck board."],
    ]],
    ["2026-10-12", "Ver 2.1.0", ["図鑑とデッキ編集を新しく", "A new Card Library and Deck Builder"], [
      ["■図鑑とデッキ編集", "■Card Library and Deck Builder"],
      ["詳細検索を付けました。カード名・効果文の文字と、タイミング（登場時・断末魔・ターンの始め・覚醒3種・ゼンマイ・装備）、キーワード、効果（ダメージ・破壊・強化・弱体化・停止・手札に戻す・山札を削る・ドロー・回復・墓地から戻す など）、レア度で探せます。選んだ条件をすべて満たすカードが出て、ボタンの数字は選んだときに何種になるかです。", "Added an advanced search: find cards by name or text, timing (On Summon, Last Breath, turn start, the three Awaken types, Wind-up, Equip), keyword, effect (damage, destroy, buff, debuff, stun, return to hand, mill, draw, heal, from the graveyard and more) and rarity. Cards must match every condition you pick, and each button shows how many cards you would get."],
      ["図鑑：第何弾かはプルダウンで選ぶ形にしました。絞り込みは1行目が属性、2行目が種類・入手済／未入手・詳細検索です。", "Library: pick a set from a dropdown. Filters: elements on the first row; type, owned/missing and advanced search on the second."],
      ["デッキ編集：デッキはプルダウンで選ぶ形にしました（そろっているか・あと何枚かも表示）。スマホは「カードを選ぶ」と「デッキの中身」を上のボタンか左右のスワイプで切り替えられ、どちらも画面いっぱいに使えます。", "Deck Builder: pick decks from a dropdown that shows how many cards each has. On phones, switch between “Add cards” and “Your deck” with the tabs or by swiping — each uses the full screen."],
      ["■カードの説明・ルール", "■Card details and rules"],
      ["覚醒などで出すカード（火喰い鳥 ヒクイ・鼓笛隊の大太鼓など）を、カードの説明から開いて読めるようにしました。", "Cards brought out by effects (such as Hikui or the Drum Corps Bass Drum) can be opened from the card details."],
      ["ゼンマイのカードの説明に「巻きほどく」の使い方を足し、ルールにもゼンマイの節を作りました。キーワードの並びは2列にそろえました。", "Wind-up cards now explain how to Unwind, and the rules have a Wind-up section. Keywords are laid out in an even two-column grid."],
      ["■対戦", "■Battle"],
      ["場のモンスターに「覚醒 夜明け」などの札を大きく出すようにしました。", "Monsters on the field show a clear “Awaken: Dawn”-style badge."],
      ["攻撃は、カードが相手に届いた瞬間にダメージや破壊が出るようにしました（前は動き始めで出ていました）。", "Damage and destruction now land the moment the attacker reaches its target (they used to appear as it started moving)."],
      ["■そのほか", "■Other"],
      ["一部のカードの絵の背景が消えることがあったのを直しました。", "Fixed card art backgrounds sometimes disappearing."],
    ]],
    ["2026-10-10", "Ver 2.0.2", ["遊びやすく（「ひとこと」の案から）", "Easier to play (ideas from your messages)"], [
      ["キャラクターカードやパックで手に入れたカードを長押し（PCは右クリック）すると、入手の画面の上に説明が出るようにしました（前は後ろに隠れていました）。", "Long-press (right-click on PC) a card you just got to read its details on top of the reward screen (it used to hide behind it)."],
      ["週替わりチャレンジに受け取っていない報酬（今週の初勝利・その日の初勝利）があると、タイトルの「週替わりチャレンジ」に赤い印が付きます。", "A red dot on Weekly Challenge in the title menu shows when a reward (first win of the week or of the day) is still waiting."],
      ["PCでは画面の上にメニューが付き、どの画面からでも「タイトルへ」（金）と「デッキ編集」（青）に行けます。", "On PC, a top menu takes you to Title (gold) or Deck Builder (blue) from any screen."],
      ["フリーバトルと週替わりチャレンジで、デッキの選択と難易度・「挑戦する」が、スクロールしても上に残るようにしました。", "In Free Battle and the Weekly Challenge, deck choice, difficulty and Fight stay at the top while you scroll."],
      ["停止中のモンスターに大きく「停止」と出ます。停止中のモンスターを攻撃モードにしようとすると、確認が出ます。", "Stunned monsters show a big STUN, and you are asked before switching one to Attack Mode."],
      ["そのターンに攻撃していないモンスターは、何度でもモードを変えられます（押し間違いを直せます）。攻撃したモンスターは変えられません。", "A monster that hasn’t attacked this turn can switch modes as often as you like; once it attacks, its mode is fixed."],
    ]],
    ["2026-10-10", "", ["エリア10のキャラクターカード3枚", "3 Area 10 character cards"], [
      ["フリーバトルの「極」で、エリア10の3人にそれぞれ5回勝つと、そのキャラクターのカードが手に入ります。", "Beat each of the three Area 10 rivals 5 times in Free Battle on Extreme to get their character card."],
      ["鼓笛隊長 タンタカ（炎・4コスト 5/3）：撃破で覚醒し、場に残る「鼓笛隊の大太鼓」をサポートの場に置きます。大太鼓があるあいだ、味方みんなの攻撃力+1。", "Drum Major Tantaka (Fire, 4-cost 5/3): awakens on Defeat and places the Drum Corps Bass Drum in your support zone. While it stays, all your monsters get +1 ATK."],
      ["司書長 ペンペン（水・5コスト 4/7）：登場時に山札の上から3枚を見て2枚を手札に。堅守で覚醒し、攻撃力が最も高い相手モンスターを手札に戻します。", "Head Librarian Penpen (Water, 5-cost 4/7): on summon, look at the top 3 cards and add 2 to your hand. Awakens on Hold and returns the enemy monster with the highest ATK to its owner’s hand."],
      ["未完の竜 ツギハギ（無・7コスト 5/6）：墓地のモンスターの数だけ育ち（最大+3/+3）、夜明けで完成して+2/+2と【貫通】。", "Unfinished Dragon Tsugihagi (Neutral, 7-cost 5/6): grows with the monsters in your graveyard (up to +3/+3), and is finished at Dawn with +2/+2 and [Pierce]."],
      ["3枚とも、何千回もの試し対戦で強さを確かめてから入れました。", "All three went in after thousands of test games to check their strength."],
      ["タイトル画面のいちばん下に、ホームページ・Bluesky・YouTube へのボタンを付けました。", "Added buttons for this website, Bluesky and YouTube at the bottom of the title screen."],
    ]],
    ["2026-10-10", "Ver 2.0.0", ["第6弾『おもちゃ箱の夜』・覚醒・エリア10", "Set 6 “The Toy Box at Night”, Awakening, Area 10"], [
      ["■第6弾『おもちゃ箱の夜』とエリア10が始まりました", "■Set 6 “The Toy Box at Night” and Area 10 are here"],
      ["第6弾は34枚。ぬいぐるみ・ブリキ・積み木など、持ち主が眠ったあとに動き出すおもちゃたちです。", "Set 6 has 34 cards: plush toys, tin toys, building blocks and more — toys that come alive after their owners fall asleep."],
      ["ゼンマイ：場に残るサポートのうち4枚は、自分のターンの始めにゼンマイが1ずつたまります。好きな時に「巻きほどく」と墓地へ行き、ためた数だけ大きな効果が出ます。", "Wind-up: 4 of the supports stay on the field and gain 1 Wind-up at the start of your turn. Unwind whenever you like — the card goes to your graveyard and its effect grows with every charge."],
      ["新しいキーワード：【大物食い】（自分より攻撃力が高いモンスターを攻撃するとき、攻撃力+3）／【身代わり】（戦闘で倒されても、あふれたダメージが自分のライフに入らない）。", "New keywords: [Giant Slayer] (+3 ATK when it attacks a monster with higher ATK) / [Decoy] (if it is destroyed in combat, the excess damage does not reach your life)."],
      ["新しいパック「おもちゃ箱の夜」は、エリア10の相手に勝つともらえます（1人につき3回まで）。エリア10のボスを倒すと、カードショップにも並びます（星屑6）。プリズムパックにも、第6弾のレア以上が入るようになりました。", "Win against the rivals in Area 10 to get the new “Toy Box at Night” pack (up to 3 times each). Beat the Area 10 boss and it also appears in the Card Shop (6 Stardust). Prism Packs can now contain Set 6 cards of Rare or higher."],
      ["冒険にエリア10『ゼンジの作業場の夜』を足しました。継承の間（エリア9）を越えると挑めます。相手は鼓笛隊長タンタカ・司書長ペンペン・未完の竜ツギハギの3人です。", "Adventure has a new Area 10, “Zenji’s Workshop at Night,” open once you are past the Hall of Succession (Area 9). Your rivals: Drum Major Tantaka, Head Librarian Penpen and the Unfinished Dragon Tsugihagi."],
      ["カード図鑑は全216種になりました。カードを集める実績の目標も増えますが、もう取った実績はそのままです。", "The Card Library now has 216 cards. Card-collecting achievements have higher goals, but achievements you already earned stay earned."],
      ["第6弾のカードは、選定の儀と週替わりチャレンジには、まだ入りません。", "Set 6 cards are not used in the Rite of Choosing or the Weekly Challenge yet."],
      ["■新しい仕組み「覚醒」が始まりました", "■New: Awakening"],
      ["カードに【覚醒：○○】と書いてあるモンスターは、条件を満たすと1回だけ目覚めて、追加の効果が働きます。目覚めた枠は金色に光ります（絵は変わりません）。", "Monsters with [Awaken: …] on their cards awaken once when the condition is met, triggering an extra effect. An awakened monster’s frame glows gold (the art doesn’t change)."],
      ["条件は3つ。【夜明け】出した次の自分のターンの始め／【撃破】攻撃で相手のモンスターを倒したとき／【堅守】防御モードのまま相手のターンを終えたとき。", "Three conditions: [Dawn] the start of your next turn / [Defeat] when it destroys an enemy monster by attacking / [Hold] when it ends the opponent’s turn still in Defense Mode."],
      ["前からある12枚（火吹きヒナ・シンダーウィッチ・シズククラゲ・潮見の巫女・トゲの門番・森羅の守り手・火山の巫女・忘却のクラゲ・若木の戦士・火の星屑・雫の結晶・星種）に覚醒がつきました。たとえば火吹きヒナは次の自分のターンにヒクイに変身、シズククラゲは2枚引きます。第6弾にも覚醒のカードがたくさんあります。", "Awakening has been added to 12 existing cards (Fire-Breath Chick, Cinder Witch, Droplet Jelly, Tide Priestess, Thorn Gatekeeper, Grove Keeper, Volcano Priestess, Oblivion Jelly, Sapling Warrior, Fire Stardust, Droplet Crystal and Star Seed). For example, Fire-Breath Chick turns into Hikui on your next turn, and Droplet Jelly draws 2. Set 6 has lots of Awaken cards too."],
      ["相手の場のモンスターも、カードを見れば、あと何で覚醒するか分かります。カード図鑑の「覚醒」のタブで、覚醒のカードだけを並べられます。", "You can check what an enemy monster still needs by looking at its card. The “Awaken” tab in the Card Library lists only Awaken cards."],
      ["覚醒は、選定の儀でも働きます。", "Awakening also works in the Rite of Choosing."],
      ["■ひとことの案から：属性とデッキ編集を見やすく", "■From your messages: clearer elements and deck building"],
      ["対戦で攻撃するモンスターを選ぶと、攻撃できる相手の枠が色分けされます。オレンジ＝こちらが有利（下に「攻+2」）、青＝相手が有利（防御モードなら上に「防御+1」）、白＝ふつう。", "When you pick an attacker, each target is outlined by matchup: orange = your advantage (“ATK+2” below), blue = their advantage (“DEF+1” above if in Defense Mode), white = neutral."],
      ["デッキ編集の所持カードを、属性（炎・水・草・無）と種類（モンスター・サポート）で絞り込めます。いくつでも組み合わせられ、「すべて表示」で戻せます。", "In the Deck Builder you can filter your cards by element (Fire, Water, Grass, Neutral) and type (Monsters, Supports). Combine as many as you like; “Show all” resets."],
      ["デッキ編集のコストのグラフを、モンスター（青）とサポート（紫）に分けました。グラフの下に、モンスターとサポートの枚数と、属性ごとの枚数も出ます。", "The Deck Builder’s cost chart now splits monsters (blue) and supports (purple), with counts for each and for every element shown below it."],
      ["効果文の「草モンスター」「水属性のカード」などの属性の字を、属性の色にしました。属性しばりのある効果が一目で分かります。", "Element words in card text (like “Grass monster” or “Water card”) are now shown in their element’s color, so element-restricted effects stand out."],
      ["カード図鑑で弾を切り替えたときや、カードの詳しい説明を見て閉じたときに、見ていた場所が先頭へ戻らないようにしました。ほかの画面や、対戦中の墓地の窓でも同じです。", "The Card Library no longer jumps back to the top when you switch sets or close a card’s details. The same goes for other screens and the graveyard window in battle."],
      ["■そのほかの変更（冒険の画面・敵の紹介・選定の儀の景品とお題）", "■Other changes (Adventure screen, rival profiles, Rite prizes and rules)"],
      ["冒険の画面の上をすっきりさせました。◀ ▶ でエリアを切り替え、「一覧」からどのエリアへも行けます。デッキの切り替えは、小さなボタンから選びます。", "The top of the Adventure screen is tidier: switch areas with ◀ ▶, jump to any area from the list, and pick your deck from a small button."],
      ["冒険の敵30人の紹介文に、少しずつ物語を足しました。ほかの人とのつながりも、探してみてください。", "The profiles of all 30 Adventure rivals now carry a bit of their story. See if you can spot how they connect."],
      ["今日の選定の儀の景品が、新しい絵違いカードになりました。10/10からは「サイバーパンク」8枚（第4弾のカード。1枚目は氷壁の軍師セルカ）、10/24からは第3弾の8枚。そのあとは第1弾から順にもう一度回します。", "The Rite of Choosing prizes are new alternate-art cards: 8 “Cyberpunk” cards from Oct 10 (Set 4 — first up: Selka, Icewall Tactician), then 8 Set 3 cards from Oct 24. After that, every set comes around again starting with Set 1."],
      ["10月12日（月）から、選定の儀の「特別ルールの日」に金曜が加わり、月・水・金・土の週4日になります。お題も10種類に増えます（新しく「第○弾＋第○弾」「コモンとアンコモンだけ」「三属性だけ（無色なし）」「モンスターだけ」「はじまりの3弾」）。", "From Monday, October 12, Friday joins the Rite’s special rule days (Mon, Wed, Fri & Sat), and there will be 10 kinds of rules. New ones: “Sets X + Y”, “Commons and uncommons only”, “Three elements, no neutrals”, “Monsters only” and “The first three sets”."],
      ["タイトル画面のいちばん下に、作者のもう一つのゲーム「1ぷんダンジョン」へのアイコンを置きました。", "There is now an icon at the bottom of the title screen for my other game, “1-Minute Dungeon”."],
]],
    ["2026-10-08", "Ver 1.9.6", ["パソコンの小さめの画面でも遊びやすくしました", "Easier to play in a small PC window"], [
      ["週替わりチャレンジ・カードショップ・冒険の画面が、窓が低くても下までスクロールできるようになりました。カード図鑑の上の弾のタブも、全部見えるように折り返します。", "Weekly Challenge, Card Shop and Adventure now scroll all the way down in a short window. The set tabs at the top of the Card Library wrap so you can see them all."],
      ["戦闘で、自分のカードのメニューが出ているときに別のカードを押すと、そのカードのメニューに切り替わります（前は画面の左上に出ていました）。", "In battle, clicking another of your cards while a menu is open now switches to that card’s menu (it used to appear in the top-left corner)."],
      ["墓地を開いたまま右クリックで見たカードの詳しい説明が、墓地の窓の手前に出るようになりました。", "Card details opened by right-clicking in the graveyard now show in front of the graveyard window."],
      ["デッキ編集・週替わりチャレンジ・カードショップの上に「タイトルへ」を置きました。冒険の画面には、パックが無いときも「パックを開ける（0）」が見えるようにしました。", "Added “Title” buttons at the top of the Deck Builder, Weekly Challenge and Card Shop. Adventure now shows “Open packs (0)” even when you have none."],
      ["週替わりチャレンジのランキングは、「ランキングに参加する」を選んだ人だけが載ります。参加していないときは、ランキングの下に参加のボタンが出るようにしました（参加すると、今週の記録もすぐ載ります）。", "Only players who joined the ranking appear on the Weekly Challenge ranking. If you haven’t joined, a Join button now appears under it (your best this week shows up right away when you join)."],
]],
    ["2026-10-06", "", ["不具合を直しました", "Bug fixes"], [
      ["フリーバトルに入れない不具合を直しました。ご迷惑をおかけしました（10/4 の午後から、進行の途中までいった方で起きていました）。", "Fixed a bug that kept some players out of Free Battle (since the afternoon of Oct 4, for players partway through the game). Sorry for the trouble."],
      ["設定の「読み込む」「戻す」を押したときに画面が先頭へ戻ってしまうのを直しました。", "Fixed Settings jumping back to the top when you press Load / Restore."],
]],
    ["2026-10-05", "", ["守る側にも、属性の相性がつきました・強すぎた大型2枚を調整しました", "Defenders now get element advantage too / Two oversized cards adjusted"], [
      ["■守る側にも、属性の相性がつきました", "■Defenders now get element advantage too"],
      ["防御モードのモンスターが、攻撃してきた相手に有利な属性なら、その戦闘だけ防御力+1されます（例：水の防御モードに、炎のモンスターが攻撃したとき）。攻める側の+2はこれまでどおりです。", "A monster in Defense Mode gets +1 DEF when its element beats the attacker’s (e.g. Water defending against Fire). The attacker’s +2 stays as before."],
      ["攻撃先を選ぶとき、相性で守りが固くなる相手には「防御+1」と出ます。", "When you pick a target, defenders who get the bonus are marked “DEF+1”."],
      ["試し対戦2,000回で、試合が長引きすぎたり、山札切れの勝負が増えすぎたりしないことを確かめてから入れました。数日ようすを見ます。", "Checked over 2,000 test games first: matches don’t drag on and deck-outs barely change. I’ll keep an eye on it for a few days."],
      ["■強すぎた大型2枚を調整しました", "■Two oversized cards adjusted"],
      ["6コストの大型2枚が、ほかのカードより明らかに強かったので、弱めました。", "Two 6-cost cards were clearly stronger than the rest, so they’ve been toned down."],
      ["炉心の巨像：9/6【貫通】・防御力5以下を破壊 → 8/3・貫通なし・防御力4以下を破壊。出たあとに倒しやすくなりました。", "Core Colossus: 9/6 [Pierce], destroys DEF 5 or less → 8/3, no Pierce, destroys DEF 4 or less. Easier to answer once it lands."],
      ["大樹の後継：墓地のモンスター1体につき+1/+1（最大+3/+3）→ 最大+2/+2。ほぼ毎回 9/10 で出ていたのが、最大 8/9 になります。", "Heir of the Great Tree: max +3/+3 → max +2/+2 (it now tops out at 8/9 instead of 9/10)."],
      ["どちらも、このゲームのAIどうしで2,000戦ずつ試し対戦をして、ほかの強いカードと同じくらいになる数字を選びました。", "Both numbers were chosen after 2,000 simulated AI games each, to bring them in line with other strong cards."],
]],
    ["2026-10-04", "", ["週替わりチャレンジに、報酬が増えました", "New rewards for the Weekly Challenge"], [
      ["いつも週替わりチャレンジに挑んでくれて、ありがとうございます。最短ターンのランキングを見るのが、作者のひそかな楽しみになっています。そのお礼に、報酬を用意しました。", "Thank you for taking on the Weekly Challenge so often. Watching the fastest-clear ranking has become my quiet joy, so here are some rewards as a thank-you."],
      ["金（最短ターン1位。同率は全員）：その週のキャラの絵違いカード、その週のアイコン、称号「週間最短王」。", "Gold (fastest clear #1, ties included): an alternate-art card of that week’s character, that week’s avatar, and the title “Fastest of the Week”."],
      ["銀（9ターン以下で勝つ）：金と同じ絵違いカードと、称号「最短の挑戦者」。10月は、ハロウィンの衣装のキャラたちです。", "Silver (win in 9 turns or fewer): the same alternate-art card, plus the title “Swift Challenger”. In October, they’re in Halloween costumes."],
      ["銅（参加賞）：その季節に勝つと、期間限定の枠と称号。10月は「ハロウィンの枠」と「ハロウィン挑戦者」です。金・銀の人にも届きます。", "Bronze (participation): win during the season for a limited-time frame and title — in October, the “Halloween Frame” and “Halloween Challenger”. Gold and silver get them too."],
      ["ランキングの結果は毎週月曜の13時ごろに出て、ゲームを開くと自動で届きます。設定 → データ の「今日の選定の儀のランキングに参加する」がオンの人が対象です。くわしくは、週替わりチャレンジの「報酬」ボタンから。", "Ranking results come out around 13:00 (JST) every Monday and arrive automatically when you open the game, for players who turned on “Join the Daily Rite ranking” in Settings → Data. Details are under the “Rewards” button in the Weekly Challenge."],
]],
    ["2026-10-02", "", ["いつも遊んでくれている方へ", "To everyone who keeps playing"], [
      ["何日も続けて遊んでくれている方がいること、とても励みになっています。ありがとうございます。", "It means a lot that some of you keep coming back, day after day. Thank you."],
      ["これからも良くしていきます。要望があれば、なんでも言ってください。一緒にこのゲームを面白くしてくれると嬉しいです。", "I will keep improving it. If you want anything changed or added, please say so — I would love to make this game better together."],
      ["設定の「ひとこと」から送れます。名前もアカウントも要りません。", "You can send it from the “Message” tab in Settings. No name or account needed."],
]],
    ["2026-09-30", "", ["カード図鑑が「バインダー」に", "The Card Library is now a binder"], [
      ["カード図鑑を、カードをファイルに入れて眺めるような「バインダー」にしました。1ページ9枚で、ペラッとめくれます（画面が広いときは見開き）。", "The Card Library is now a binder: nine cards to a page, and you flip through it. On a wide screen you get a two-page spread."],
      ["めくるには、ボタン・左右のスワイプ・キーボードの ← → が使えます。めくる音もつきました。", "Turn pages with the buttons, a swipe left or right, or the ← → keys. There is a page-turning sound, too."],
      ["これまでの「一覧」も残してあります。図鑑の上のボタンで切り替えられます。", "The old list view is still there — switch with the button at the top of the Library."],
]],
    ["2026-09-29", "", ["作者に「ひとこと」を送れるように", "Send a message to the developer"], [
      ["設定に「ひとこと」タブを足しました。感想・不具合・「ここが難しい」・好きなカード、なんでも書いて送れます。名前もアカウントも要りません。", "A new “Message” tab in Settings. Send feedback, bugs, “this is too hard”, favorite cards — anything. No name or account needed."],
      ["ラスボスを倒したときと、キャラクターカードを初めて手に入れたときのお礼の画面にも、同じ欄が出ます。Bluesky で感想を送るボタンも付きました。", "The same box appears on the thank-you screen after you beat the final boss or get your first character card, along with a button to share on Bluesky."],
      ["送られるのは書いた文だけです。作者が読みます（返信はできません）。1日3通まで。", "Only the text you write is sent. The developer reads it (replies are not possible). Up to three a day."],
]],
    ["2026-09-28", "", ["みんなのデッキ・デッキをコードで渡せるように・チャレンジ：毎日の星屑と、週の景品", "Shared Decks / Share decks with a code / Challenge: daily Stardust and a weekly prize"], [
      ["■みんなのデッキ", "■Shared Decks"],
      ["タイトルに「みんなのデッキ」を足しました。ほかの人が作ったデッキを、コンセプトと回し方の文つきで見られます。気に入ったら「このデッキを組む」で、自分のデッキ枠にそのまま入ります（持っていないカードは外れます）。", "A new “Shared Decks” screen on the title. Browse decks other players made, with their concept and how they play it. Press “Build this deck” and it drops straight into a deck slot of your own (cards you don’t own are left out)."],
      ["自分のデッキも出せます。デッキ編集の「テキストで書き出す」か、この画面の「デッキを出す」から。出せるのは1日2件までで、あとから自分で消せます。", "You can share your own, too — from the Deck Builder’s text export or the “Share a deck” button. Up to two a day, and you can delete yours later."],
      ["「キャラあり」「キャラなし」で分けて見られます。最初は、はじめての人向けのデッキを3つ並べてあります。", "Filter by whether a deck uses character cards. Three decks for new players are listed from the start."],
      ["■デッキをコードで渡せるように", "■Share decks with a code"],
      ["デッキ編集の「テキストで書き出す」に、1行のコードが付くようになりました。そのコードを渡すと、相手の手元で同じデッキが組めます。", "The Deck Builder’s text export now includes a one-line code. Give it to someone and they can rebuild the same deck."],
      ["受け取った人は、同じ画面の「コードで読み込む」に貼って「このコードで組む」。持っていないカードは自動で外れ、何が足りないかを教えます。", "To use one, paste it into “Load from code” and press “Build this deck”. Cards you don’t own are left out, and the game tells you which."],
      ["■チャレンジ：毎日の星屑と、週の景品", "■Challenge: daily Stardust and a weekly prize"],
      ["週替わりチャレンジのごほうびを変えました。星屑は「その日の初勝利」で10、同じ日の2回目からは2です。毎日1回、挑む理由ができました。", "Weekly Challenge rewards changed: 10 Stardust for your first win each day, 2 for later wins that day. A reason to drop in daily."],
      ["さらに、その週に初めて勝つと、絵違いカードを1枚お届けします。第2弾ぶんの8枚（ステンドグラス風）を、週ごとに順番に。", "On top of that, your first win of the week earns an alternate-art card — eight new stained-glass illustrations, one per week."],
      ["自己ベスト（いちばん短いターン数）も残るようにしました。同じ相手をどこまで速く倒せるか、試してみてください。", "Your best clear (fewest turns) is now recorded, too. See how fast you can take the same deck down."],
      ["ランキングも入りました。今週の相手を何ターンで倒せたか、参加している人の中で競えます（参加は 設定 → データ の「今日の選定の儀のランキングに参加する」と共通です）。", "A ranking joined in as well: the fewest turns to beat this week’s deck, among everyone taking part (it uses the same opt-in as the Daily Rite ranking)."],
]],
    ["2026-09-26", "", ["特別ルールの日が週3日に（月曜を追加）", "Special rule days are now three a week"], [
      ["今日の選定の儀の「特別ルールの日」に月曜が加わり、月曜・水曜・土曜の週3日になりました（9月28日から）。", "Monday joins the Daily Rite’s special rule days: they are now Monday, Wednesday and Saturday (from September 28)."],
      ["特別ルールの日は、3位までに絵違いカードを1枚お届けします。景品は日ごとに決まっていて、誰が見ても同じです。", "On those days the top 3 each receive an alternate-art card. The prize is fixed per day, the same for everyone."],
      ["景品の絵違いカードに、第2弾ぶんの8枚（ステンドグラス風）が加わりました。イグナ・ヒクイ・レヴィオン・大渦のうねり・ガイオン・ペタルダンサー・英雄の紋章・入れ替えの符です。", "Eight new alternate-art prizes joined the rotation, in a stained-glass style: Igna, Hikui, Levion, Maelstrom Surge, Gaion, Petal Dancer, Hero’s Crest and the Swap Talisman."],
      ["難しすぎた3人（森の狩人ヨナ、双子の術士 フレア＆ミスト、罠師のガロ）を調整しました。ヨナとフレア＆ミストは、ほかの相手と同じようにミスをするようになりました。", "Three rivals were toned down (Yona, Flare & Mist, and Garo). Yona and Flare & Mist now make mistakes like the others do."],
      ["デッキ編集に「テキストで書き出す」を追加。組んだデッキを、そのまま人に見せられます。", "The Deck Builder can now export your deck as text, so you can share it."],
]],
    ["2026-09-21", "", ["週替わりチャレンジと、手詰まりの助言", "Weekly Challenge, and hints when you’re stuck"], [
      ["タイトルに「週替わりチャレンジ」が増えました。毎週月曜に相手が変わり、AIが本気で戦ってくる強いデッキです。その週に初めて勝つと星屑10、2回目からは2。", "A new Weekly Challenge on the title screen. The opponent changes every Monday: a strong deck played at full strength. First win of the week earns 10 Stardust, later wins 2."],
      ["相手のデッキは、AI同士で何万回も戦わせて強くした10種類。図鑑の全カードが相手になり得ます。実績と称号も3つ足しました。", "The 10 opponent decks were tuned by tens of thousands of AI-vs-AI games. Three new achievements and titles to go with it."],
      ["タイトルの上に「今日の選定の儀のお題と景品」「今週のチャレンジ」を1行で出すようにしました。", "The title screen now shows today’s Rite theme and prize, and this week’s challenge, at a glance."],
      ["音楽を見直しました：タイトル・マップ・デッキ編集に静かな曲を3つ追加。音楽の初期音量も下げました。設定 → サウンドで「メニューの曲」「戦闘の曲」を選べます。戦闘の曲は新曲2つ（軽快な曲・荘厳な曲）と静かな曲も選べます。戦闘中も右上の「音量」から変えられます。", "Music pass: three calm tracks for the title, map, and deck builder, and a lower default music volume. In Settings → Sound you can pick the menu and battle music, including two new battle tracks (Upbeat, Majestic) and a calm option. You can also change the volume mid-battle from the “Sound” button at the top right."],
      ["手詰まりのとき（攻撃が3ターン通らない、攻められるのに攻めない、山札が5枚を切った）に、ひとこと助言が出ます。各試合1回、通算3試合まで。", "When you’re stuck (attacks not connecting for 3 turns, not attacking when you could, or your deck down to 5 cards), a one-line hint appears. Once per battle, at most 3 battles."],
      ["選定の儀の限定カードを3枚調整：シエナは登場時3ダメージ、ミルテは回復に加えて相手の山札を毎ターン1枚削る、エルシオンは6/6に。", "Three Rite cards were tuned: Shiena now deals 3 on summon, Mirte heals and mills 1 card each turn, Elsion is 6/6."],
]],
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
      // 1件ずつ「更新日・版・題」の1行にたたみ、押すと中身が開く（スマホで画面14枚ぶんあった。2026-10-13）
      return '<li><details><summary><time>' + u[0] + (u[1] ? ' · ' + u[1] : '') + '</time><h3>' + esc(T(u[2][0], u[2][1])) + '</h3></summary><ul>'
        + u[3].map(function (x) {
          var t = T(x[0], x[1]);
          return t.charAt(0) === '■' ? '<li class="tl-sub">' + esc(t.slice(1)) + '</li>' : '<li>' + esc(t) + '</li>';
        }).join('') + '</ul></details></li>';
    }).join('');
  }

  // ---- カードの調整（balance.js。ゲームのお知らせの「調整したカード」の窓と同じ中身。2026-10-30） ----
  var BAL_KIND = { up: ['強化', 'Buff'], down: ['弱体化', 'Nerf'], change: ['変更', 'Reworked'] };
  // 調整前と後の効果文の、変わったところに印を付ける。日本語は1字ずつ、英語は1語ずつ（【キーワード】と +2/+2 はひとかたまり）。ほとんど全部変わったときは印を付けない
  function balDiff(a, b) {
    var ja = /[\u3000-\u9fff\uff00-\uffef]/.test(a + b);
    var re = ja ? /【[^】]*】|[+-]?\d+(?:\/[+-]?\d+)?|[\s\S]/g : /\[[^\]]*\]|[+-]?\d+(?:\/[+-]?\d+)?|\w+|\s+|[\s\S]/g;
    var x = a.match(re) || [], y = b.match(re) || [], n = x.length, m = y.length, i, j, d = [];
    for (i = 0; i <= n; i++) d.push(new Uint16Array(m + 1));
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) d[i][j] = x[i] === y[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
    var runs = [];
    function put(k, s) { var r = runs[runs.length - 1]; if (r && r.k === k) r.s += s; else runs.push({ k: k, s: s }); }
    for (i = 0, j = 0; i < n || j < m;) {
      if (i < n && j < m && x[i] === y[j]) { put('=', x[i]); i++; j++; }
      else if (j >= m || (i < n && d[i + 1][j] >= d[i][j + 1])) put('-', x[i++]);
      else put('+', y[j++]);
    }
    var same = runs.reduce(function (t, r) { return t + (r.k === '=' ? r.s.length : 0); }, 0);
    if (same < 0.3 * Math.max(a.length, b.length)) return [esc(a), esc(b)];
    function short(s) { return ja ? s.trim().length <= 2 : s.trim().split(/\s+/).filter(Boolean).length <= 1; }
    function side(drop) {
      var out = [];
      runs.forEach(function (r, k) {
        if (r.k === drop) return;
        var mid = r.k === '=' && k > 0 && k < runs.length - 1 && runs[k - 1].k !== '=' && runs[k + 1].k !== '=' && short(r.s);
        var on = r.k !== '=' || mid, o = out[out.length - 1];
        if (o && o.on === on) o.s += r.s; else out.push({ on: on, s: r.s });
      });
      var tag = drop === '+' ? 'del' : 'ins';
      return out.map(function (o) { return o.on ? '<' + tag + '>' + esc(o.s) + '</' + tag + '>' : esc(o.s); }).join('');
    }
    return [side('+'), side('-')];
  }
  // 数字とキーワードの変わったところ。遊ぶ側に得なら up、損なら down
  function balChips(b, a) {
    var out = [];
    function num(label, x, y, lowIsGood) {
      if (x == null || y == null || x === y) return;
      out.push('<span class="bal-chip ' + ((lowIsGood ? y < x : y > x) ? 'up' : 'down') + '">' + label + ' <s>' + x + '</s><i>→</i><b>' + y + '</b></span>');
    }
    num(T('コスト', 'Cost'), b.cost, a.cost, true);
    num(T('攻撃力', 'ATK'), b.atk, a.atk);
    num(T('防御力', 'DEF'), b.def, a.def);
    var ak = a.kw.map(function (k) { return k.key; }), bk = b.kw.map(function (k) { return k.key; });
    b.kw.filter(function (k) { return ak.indexOf(k.key) < 0; }).forEach(function (k) { out.push('<span class="bal-chip down">' + esc(T('【' + k.ja + '】がなくなった', 'Lost [' + k.en + ']')) + '</span>'); });
    a.kw.filter(function (k) { return bk.indexOf(k.key) < 0; }).forEach(function (k) { out.push('<span class="bal-chip up">' + esc(T('【' + k.ja + '】がついた', 'Gained [' + k.en + ']')) + '</span>'); });
    if (b.text.ja !== a.text.ja) out.push('<span class="bal-chip eff">' + T('効果の文が変わった', 'Effect text changed') + '</span>');
    return out.join('');
  }
  // 小さなカード（名前・コスト・絵・攻守）。効果の文は小さなカードでは切れるので、下の行に出す
  function balCard(c, s) {
    return '<div class="ccard ' + c.element + (c.rarity === 'legend' ? ' legend' : '') + '">'
      + '<span class="nm">' + esc(T(c.name.ja, c.name.en)) + '</span><span class="cost">' + s.cost + '</span>'
      + '<img src="assets/cards/' + c.id + '.webp" alt="" loading="lazy" width="300" height="300">'
      + (c.support ? '<span class="st sup">' + T('✦ サポート', '✦ Support') + '</span>'
        : '<span class="st"><span class="a">⚔ ' + s.atk + '</span><span class="d">🛡 ' + s.def + '</span></span>') + '</div>';
  }
  function balItem(c) {
    var kind = BAL_KIND[c.kind] ? c.kind : 'change';
    var changed = c.before.text.ja !== c.after.text.ja;
    var t = changed ? balDiff(T(c.before.text.ja, c.before.text.en), T(c.after.text.ja, c.after.text.en)) : null;
    var row = function (cls, lab, html) { return '<div class="bt-row ' + cls + '"><span class="bt-lab">' + lab + '</span><p>' + html + '</p></div>'; };
    return '<article class="balitem">'
      + '<div class="bal-h"><span class="bal-kind ' + kind + '">' + T(BAL_KIND[kind][0], BAL_KIND[kind][1]) + '</span><h4 class="' + c.element + '">' + esc(T(c.name.ja, c.name.en)) + '</h4></div>'
      + '<div class="bal-pair"><figure class="bal-side before"><figcaption>' + T('調整前', 'Before') + '</figcaption>' + balCard(c, c.before) + '</figure>'
      + '<span class="bal-arrow" aria-hidden="true">▶</span>'
      + '<figure class="bal-side after"><figcaption>' + T('調整後', 'After') + '</figcaption>' + balCard(c, c.after) + '</figure></div>'
      + '<div class="bal-chips">' + balChips(c.before, c.after) + '</div>'
      + '<div class="bal-text">' + (t ? row('before', T('調整前', 'Before'), t[0]) + row('after', T('調整後', 'After'), t[1])
        : row('same', T('効果（同じ）', 'Effect (same)'), esc(T(c.after.text.ja, c.after.text.en)))) + '</div>'
      + (c.why ? '<p class="bal-why">' + esc(T(c.why.ja, c.why.en)) + '</p>' : '')
      + '</article>';
  }
  function renderBalance() {
    var N = window.TE_BALANCE || [], box = document.getElementById('ballist');
    if (!box) return;
    if (!N.length) { document.getElementById('balance').hidden = true; return; }
    // 開いていた回は、言語を切り替えて描き直しても開いたまま
    var open = {};
    box.querySelectorAll('details').forEach(function (d) { open[d.dataset.id] = d.open; });
    box.innerHTML = N.map(function (n, i) {
      var count = function (k) { return n.cards.filter(function (c) { return (BAL_KIND[c.kind] ? c.kind : 'change') === k; }).length; };
      var isOpen = n.id in open ? open[n.id] : i === 0;
      return '<details class="balnote" data-id="' + esc(n.id) + '"' + (isOpen ? ' open' : '') + '><summary><time>' + esc(n.date) + '</time>'
        + '<h3>' + esc(T(n.title.ja, n.title.en)) + '</h3>'
        + '<span class="bal-sum">' + ['up', 'down', 'change'].filter(count).map(function (k) { return '<span class="bal-kind ' + k + '">' + T(BAL_KIND[k][0], BAL_KIND[k][1]) + ' ' + count(k) + '</span>'; }).join('') + '</span></summary>'
        + (n.intro ? '<p class="bal-intro">' + esc(T(n.intro.ja, n.intro.en)) + '</p>' : '')
        + '<div class="balgrid">' + n.cards.map(balItem).join('') + '</div></details>';
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

  function renderAll() { renderDecks(); renderRivals(); renderCards(); renderShots(); renderBalance(); renderUpdates(); }
  applyLang(lang);
})();
