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
      return '<li><time>' + u[0] + (u[1] ? ' · ' + u[1] : '') + '</time><h3>' + esc(T(u[2][0], u[2][1])) + '</h3><ul>'
        + u[3].map(function (x) {
          var t = T(x[0], x[1]);
          return t.charAt(0) === '■' ? '<li class="tl-sub">' + esc(t.slice(1)) + '</li>' : '<li>' + esc(t) + '</li>';
        }).join('') + '</ul></li>';
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

  function renderAll() { renderDecks(); renderRivals(); renderCards(); renderShots(); renderUpdates(); }
  applyLang(lang);
})();
