// tools/site_balance.mjs（ゲームの src/game/balance_notes.js）から作る。手で直さない
window.TE_BALANCE = [
 {
  "id": "2026-10-27a",
  "date": "2026-10-27",
  "title": {
   "ja": "アップデート Ver 2.5.0：カードの見直し・デッキ20個・攻撃の予約",
   "en": "Update 2.5.0: card refresh, 20 deck slots, and queued attacks"
  },
  "intro": {
   "ja": "あまり使われていなかったカード10枚を見直しました。山札から探すカードを増やし、ほかのカードと役目が重なっていたものは役目を変えました。",
   "en": "We reworked 10 underused cards: more of them now search your deck, and cards that overlapped with others got a new role."
  },
  "cards": [
   {
    "id": "z_sg2",
    "name": {
     "ja": "輪廻の環",
     "en": "Circle of Rebirth"
    },
    "element": "grass",
    "support": true,
    "rarity": "rare",
    "kind": "change",
    "before": {
     "cost": 3,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "自分の墓地からモンスター1体を手札に戻し、カードを1枚引く。",
      "en": "Return 1 monster from your graveyard to your hand and draw 1 card."
     }
    },
    "after": {
     "cost": 2,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "山札から、コスト2以下の草モンスターを2枚 手札に加える。",
      "en": "Search your deck for 2 Grass monsters that cost 2 or less and add them to your hand."
     }
    },
    "why": null
   },
   {
    "id": "z_sw3",
    "name": {
     "ja": "万象の鏡",
     "en": "Mirror of All Things"
    },
    "element": "water",
    "support": true,
    "rarity": "epic",
    "kind": "change",
    "before": {
     "cost": 5,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "相手モンスターを全て持ち主の手札に戻し、カードを1枚引く。",
      "en": "Return all enemy monsters to their owner’s hand and draw 1 card."
     }
    },
    "after": {
     "cost": 6,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "相手モンスターを全て持ち主の山札に戻して、混ぜる。",
      "en": "Shuffle all enemy monsters into their owner’s deck."
     }
    },
    "why": null
   },
   {
    "id": "b_sw1",
    "name": {
     "ja": "隊列を組め",
     "en": "Fall In!"
    },
    "element": "water",
    "support": true,
    "rarity": "common",
    "kind": "up",
    "before": {
     "cost": 2,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "自分のモンスター1体に【隊列】を与え、カードを1枚引く。",
      "en": "Give a friendly monster [Formation] and draw 1 card."
     }
    },
    "after": {
     "cost": 2,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "自分のモンスター1体に【隊列】を与え、山札から【隊列】を持つモンスターを1枚 手札に加える。",
      "en": "Give a friendly monster [Formation], then search your deck for a monster with [Formation] and add it to your hand."
     }
    },
    "why": null
   },
   {
    "id": "b_sw2",
    "name": {
     "ja": "氷の防壁",
     "en": "Ice Barrier"
    },
    "element": "water",
    "support": true,
    "rarity": "uncommon",
    "kind": "up",
    "before": {
     "cost": 3,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "次の相手のターンが終わるまで、隣にモンスターがいる自分のモンスターは戦闘で破壊されない。",
      "en": "Until the end of your opponent’s next turn, your monsters that have an adjacent monster can’t be destroyed in battle."
     }
    },
    "after": {
     "cost": 3,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "次の相手のターンが終わるまで、自分のモンスターは戦闘で破壊されない。",
      "en": "Until the end of your opponent’s next turn, your monsters can’t be destroyed in battle."
     }
    },
    "why": {
     "ja": "並びの条件をなくしました。どの属性のデッキでも使えます",
     "en": "The adjacency condition is gone, so any deck can use it"
    }
   },
   {
    "id": "i_sn3",
    "name": {
     "ja": "継承の軍旗",
     "en": "Banner of Succession"
    },
    "element": "none",
    "support": true,
    "rarity": "epic",
    "kind": "change",
    "before": {
     "cost": 4,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "自分のモンスター全てに【旗】と【継承】を与える。",
      "en": "Give every friendly monster [Banner] and [Legacy]."
     }
    },
    "after": {
     "cost": 3,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "山札から【旗】を持つモンスターを2枚まで 手札に加える。",
      "en": "Search your deck for up to 2 monsters with [Banner] and add them to your hand."
     }
    },
    "why": null
   },
   {
    "id": "i_w1",
    "name": {
     "ja": "忘れ形見のクラゲ",
     "en": "Keepsake Jelly"
    },
    "element": "water",
    "support": false,
    "rarity": "common",
    "kind": "up",
    "before": {
     "cost": 1,
     "atk": 1,
     "def": 2,
     "kw": [
      {
       "key": "inherit",
       "ja": "継承",
       "en": "Legacy"
      }
     ],
     "text": {
      "ja": "【継承】【断末魔】カードを1枚引く。",
      "en": "[Legacy] [Last Breath] Draw a card."
     }
    },
    "after": {
     "cost": 1,
     "atk": 1,
     "def": 2,
     "kw": [
      {
       "key": "inherit",
       "ja": "継承",
       "en": "Legacy"
      }
     ],
     "text": {
      "ja": "【継承】【断末魔】山札から【継承】を持つカードを1枚 手札に加える。",
      "en": "[Legacy] [Last Breath] Search your deck for a card with [Legacy] and add it to your hand."
     }
    },
    "why": null
   },
   {
    "id": "i_sw2",
    "name": {
     "ja": "静かな継承",
     "en": "Quiet Succession"
    },
    "element": "water",
    "support": true,
    "rarity": "rare",
    "kind": "change",
    "before": {
     "cost": 3,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "自分のモンスター全てに【継承】を与える。",
      "en": "Give every friendly monster [Legacy]."
     }
    },
    "after": {
     "cost": 3,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "山札から【継承】を持つモンスターを2枚まで 手札に加える。",
      "en": "Search your deck for up to 2 monsters with [Legacy] and add them to your hand."
     }
    },
    "why": null
   },
   {
    "id": "x_sg3",
    "name": {
     "ja": "大地の反撃",
     "en": "Earth’s Counter"
    },
    "element": "grass",
    "support": true,
    "rarity": "uncommon",
    "kind": "up",
    "before": {
     "cost": 3,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "このターン、自分の草モンスター1体は防御力を攻撃力として扱う。",
      "en": "This turn, 1 friendly Grass monster uses its DEF as its ATK."
     }
    },
    "after": {
     "cost": 2,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "このターン、自分の草モンスター1体は防御力を攻撃力として扱う。",
      "en": "This turn, 1 friendly Grass monster uses its DEF as its ATK."
     }
    },
    "why": null
   },
   {
    "id": "x_sn2",
    "name": {
     "ja": "入れ替えの符",
     "en": "Recall Talisman"
    },
    "element": "none",
    "support": true,
    "rarity": "uncommon",
    "kind": "up",
    "before": {
     "cost": 2,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "自分のモンスター1体を手札に戻す。",
      "en": "Return 1 of your monsters to your hand."
     }
    },
    "after": {
     "cost": 1,
     "atk": null,
     "def": null,
     "kw": [],
     "text": {
      "ja": "自分のモンスター1体を手札に戻す。",
      "en": "Return 1 of your monsters to your hand."
     }
    },
    "why": null
   },
   {
    "id": "g10",
    "name": {
     "ja": "世界樹の化身 ユグドラ",
     "en": "Yggdra, World Tree Avatar"
    },
    "element": "grass",
    "support": false,
    "rarity": "rare",
    "kind": "change",
    "before": {
     "cost": 6,
     "atk": 5,
     "def": 7,
     "kw": [],
     "text": {
      "ja": "【登場時】自分のモンスター全てを+2/+2する。",
      "en": "On Summon: Give all your monsters +2/+2."
     }
    },
    "after": {
     "cost": 5,
     "atk": 5,
     "def": 6,
     "kw": [],
     "text": {
      "ja": "【登場時】自分の草モンスター全てを+2/+2する。",
      "en": "On Summon: Give all your Grass monsters +2/+2."
     }
    },
    "why": {
     "ja": "「星環の門」と役目が重なっていたため、草のデッキの切り札にしました",
     "en": "It overlapped too much with Star Ring Gate, so it’s now a Grass deck finisher"
    }
   }
  ]
 },
 {
  "id": "2026-10-05a",
  "date": "2026-10-05",
  "title": {
   "ja": "強すぎた大型2枚を調整しました",
   "en": "Two oversized cards adjusted"
  },
  "intro": {
   "ja": "6コストの大型2枚が、ほかのカードより明らかに強かったので弱めました。どちらも、AIどうしの試し対戦2,000戦で、ほかの強いカードと同じくらいになる数字を選んでいます。",
   "en": "Two 6-cost cards were clearly stronger than the rest, so they’ve been toned down. Both numbers were chosen after 2,000 simulated AI games to match other strong cards."
  },
  "cards": [
   {
    "id": "z_f6",
    "name": {
     "ja": "炉心の巨像",
     "en": "Core Colossus"
    },
    "element": "fire",
    "support": false,
    "rarity": "rare",
    "kind": "down",
    "before": {
     "cost": 6,
     "atk": 9,
     "def": 6,
     "kw": [
      {
       "key": "pierce",
       "ja": "貫通",
       "en": "Pierce"
      }
     ],
     "text": {
      "ja": "【貫通】【登場時】防御力5以下の相手モンスター1体を破壊する。",
      "en": "[Pierce] On Summon: Destroy 1 enemy monster with 5 or less DEF."
     }
    },
    "after": {
     "cost": 6,
     "atk": 8,
     "def": 3,
     "kw": [],
     "text": {
      "ja": "【登場時】防御力4以下の相手モンスター1体を破壊する。",
      "en": "On Summon: Destroy 1 enemy monster with 4 or less DEF."
     }
    },
    "why": {
     "ja": "出たあとに倒しやすくしました",
     "en": "Easier to answer once it lands"
    }
   },
   {
    "id": "i_g4",
    "name": {
     "ja": "大樹の後継",
     "en": "Heir of the Great Tree"
    },
    "element": "grass",
    "support": false,
    "rarity": "rare",
    "kind": "down",
    "before": {
     "cost": 6,
     "atk": 6,
     "def": 7,
     "kw": [],
     "text": {
      "ja": "【登場時】自分の墓地のモンスター1体につき +1/+1（最大+3/+3）。",
      "en": "On Summon: +1/+1 for each monster in your graveyard (max +3/+3)."
     }
    },
    "after": {
     "cost": 6,
     "atk": 6,
     "def": 7,
     "kw": [],
     "text": {
      "ja": "【登場時】自分の墓地のモンスター1体につき +1/+1（最大+2/+2）。",
      "en": "On Summon: +1/+1 for each monster in your graveyard (max +2/+2)."
     }
    },
    "why": {
     "ja": "ほぼ毎回 9/10 で出ていたのが、最大 8/9 になります",
     "en": "It used to land as a 9/10 almost every time; it now tops out at 8/9"
    }
   }
  ]
 }
];
