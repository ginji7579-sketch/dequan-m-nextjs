import {
  getPressReleaseMediaServiceId,
  pressReleaseMediaSeeds,
} from '@shared/pressReleaseMedia';

export type ComparisonRow = {
  label: string;
  basic: string[];
  advanced: string[];
};

export type ComparisonTable = {
  title: string;
  headers: [string, string, string];
  rows: ComparisonRow[];
  totalLabel: string;
  totals: [string, string];
  totalNote?: string;
};

export const websiteSocialGeoTables: ComparisonTable[] = [
  {
    title: '季度維護費（每季訂閱代操費用）',
    headers: ['項目', '基礎方案', '進階方案'],
    rows: [
      {
        label: '適合對象',
        basic: ['維持熱度與基本轉換'],
        advanced: ['包含短影音，適合想做品牌的客戶'],
      },
      {
        label: '社群運營',
        basic: [
          '每月 2 支網站產業相關專欄文企劃＋撰寫＋投放',
          '每月 4 篇高質感圖文＋8 篇限時動態（含節慶問候、商品介紹、知識懶人包）',
          '臉書相關社團內容投放每月 2 篇',
        ],
        advanced: [
          '每月 4 支網站產業相關專欄文企劃＋撰寫＋投放',
          '額外文章企劃＋撰寫＋投放 4500 元／支',
          '每月 8 篇高質感圖文＋12 篇限時動態（含節慶問候、商品介紹、知識懶人包）',
          '臉書相關社團內容投放每月 4 篇',
          '每月 2 次社群主題更新（配合半個月檔期的農曆節慶／促銷）',
          '活動檔期 IG 九宮格排版視覺企劃（以 3 個為一組，同一視覺製作）',
        ],
      },
      {
        label: '短影音（Reels/Shorts）',
        basic: [
          '每月企劃＋拍攝＋剪輯 1 支短影音（或由客戶提供影片，代為上架）',
          '額外短影音拍攝企劃＋拍攝＋剪輯 24000 元／支',
        ],
        advanced: [
          '每月企劃＋拍攝＋剪輯 4 支短影音（內容涵蓋產業 QA、展示金工細節、教學等，加強品牌互動）',
          '額外短影音拍攝企劃＋拍攝＋剪輯 24000 元／支',
        ],
      },
      {
        label: 'LINE OA 經營',
        basic: [
          '基礎 LINE OA 設定',
          '每月 2 次群發圖文訊息（綁定官網導購）',
        ],
        advanced: [
          '基礎 LINE OA 設定',
          '每月 8 則群發圖文訊息',
          '每月 2 次圖文選單更新',
          '每月集點卡、優惠券、問卷活動設計（若因 LINE 顧客眾多，導致訊息數量過多，會有 LINE OA 方案升級之衍生費用，會與品牌方討論如何承擔方案費用）',
        ],
      },
      {
        label: '廣告代操（可選購項目）',
        basic: ['手續費 30% 為操盤費用，可視成效決定是否續用'],
        advanced: ['手續費 25% 為操盤費用，可視成效決定是否續用'],
      },
      {
        label: 'KOL 宣傳（可選購項目）',
        basic: [
          '依 KOL 報價確定 KOL 數量',
          '手續費 30% 為操盤費用，可視成效決定是否再操作',
        ],
        advanced: [
          '依 KOL 報價確定 KOL 數量',
          '手續費 25% 為操盤費用，可視成效決定是否再操作',
        ],
      },
      {
        label: '數據與會議',
        basic: [
          '每季確保 5 萬以上社群流量',
          '每月提供 1 份數據報表與優化建議',
        ],
        advanced: [
          '每季確保 20 萬以上社群流量',
          '每月提供報表＋1 次線上／線下覆盤會議',
        ],
      },
    ],
    totalLabel: '總計費用（每月費用，不含選購）',
    totals: ['NT$90,000', 'NT$210,000'],
  },
  {
    title: '專案啟動費（第一個月的隱形成本，可攤提進總價）',
    headers: ['項目', '方案A（基礎視覺整合方案）', '方案B（旗艦品牌升級方案）'],
    rows: [
      {
        label: '策略諮詢內容',
        basic: ['基礎訪談＋架構建議'],
        advanced: ['深入分析＋行銷應用'],
      },
      {
        label: '視覺設計內容',
        basic: [
          '輕量品牌色彩與字體規範（收斂現有品牌色，指定社群與官網的標準中英文字體，確保閱讀體驗一致）',
          '設計 3 款基礎 IG／FB 共用貼文 Canva 版型（內容包含「商品展示款」、「知識懶人包款」、「通用公告款」版型設計，限修改 2 次，額外調整 3000 元／次）',
        ],
        advanced: [
          '重新定義品牌的高級色調與標準字體設定',
          '設計 5 款基礎 IG／FB 共用貼文 Canva 版型（內容包含方案 A 的 3 款，新增「節慶專屬問候款」、「客戶分享／作品」；限修改 4 次，額外調整 3000 元／次）',
          '社群視覺常用 ICON 設計 5 個',
          'IG 精選動態（Highlight）質感封面 icon 1 套',
          '短影音（Reels／Shorts）專用標準封面底圖',
        ],
      },
      {
        label: 'LINE OA 設定',
        basic: [
          '設計圖文選單 1 組',
          '歡迎訊息設定＋迎賓圖文設計 1 張',
          '設定常用自動回覆文案 5 組',
        ],
        advanced: [
          '配合季度設計當季農曆節慶系列圖文選單 6 組',
          '歡迎訊息設定＋迎賓圖文設計 2 張',
          '設定常用自動回覆文案 8 組文案＋回覆內容圖示化吸引點擊互動',
        ],
      },
      {
        label: '社群額外項目',
        basic: [
          'META 帳號優化（將視覺與顧客流程資訊優化，品牌介紹、品牌理念、聯絡資訊、自動回覆等統一設定）',
          '品牌貼文 1 篇',
        ],
        advanced: [
          'META 帳號優化（將視覺與顧客流程資訊優化，品牌介紹、品牌理念、聯絡資訊、自動回覆等統一設定）',
          '品牌貼文 3 篇（品牌故事、理念、服務內容）',
          '品牌短影音介紹 1 篇',
          '制定商品攝影風格指引',
        ],
      },
    ],
    totalLabel: '總計費用',
    totals: ['NT$45,000', 'NT$75,000'],
  },
];

export type MediaListingRow = {
  serviceId: string;
  media: string;
  priceValue: number;
  price: string;
  note: string;
};

export type MediaListingTable = {
  headers: [string, string, string, string];
  rows: MediaListingRow[];
  footerNotes?: string[];
};

export const pressReleaseMediaTable: MediaListingTable = {
  headers: ['媒體', '報價', '特殊稿子', '加入購物車'],
  rows: pressReleaseMediaSeeds.map(({ media, price, note }) => ({
    serviceId: getPressReleaseMediaServiceId(media),
    media,
    priceValue: price,
    price: `NT$${price.toLocaleString('en-US')}`,
    note: note || '—',
  })),
  footerNotes: [
    '標題 25 字內、內文 1,000 字左右，三張圖片以照片為主',
    '不要 DM 格式，修改費一次 NT$3,000，內容最終以該編輯台修改為主',
  ],
};