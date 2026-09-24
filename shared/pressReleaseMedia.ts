export type PressReleaseMediaSeed = {
  media: string;
  price: number;
  note?: string;
};

export const pressReleaseMediaSeeds: PressReleaseMediaSeed[] = [
  { media: '15網聯播', price: 18000, note: '3 圖可影音' },
  { media: '東森新聞網', price: 24000, note: '3 圖' },
  { media: '東森財經網', price: 24000, note: '3 圖' },
  { media: '民視新聞', price: 15000 },
  { media: '中央社', price: 9000, note: '1 圖無超連結' },
  { media: '風傳媒', price: 9000, note: '1 圖無超連結' },
  { media: '科技新報', price: 15000 },
  { media: '電子時報', price: 15000 },
  { media: 'LINE', price: 9000 },
  { media: '奇摩', price: 9000 },
  { media: '女子漾', price: 9000 },
  { media: '民眾日報', price: 9000 },
  { media: '痞客邦', price: 9000, note: '3 圖' },
  { media: 'Nownews', price: 18000, note: '1 圖' },
  { media: '理財周刊', price: 9000 },
  { media: '工商時報', price: 9000 },
  { media: '經濟日報', price: 9000, note: '3 圖' },
  { media: '鏡電視', price: 18000, note: '要藝人' },
  { media: '波波焦莉', price: 9000, note: '3 圖' },
  { media: '行遍天下', price: 15000, note: '3 圖' },
  { media: '矩亨號', price: 9000, note: '3 圖' },
  { media: '好新聞', price: 15000 },
  { media: '壹蘋', price: 9000, note: '1 圖文章來源' },
  { media: 'T客邦', price: 15000, note: '科技' },
  { media: '中時電子報', price: 12000, note: '內網' },
  { media: '創業小聚', price: 18000, note: '要與創業有關' },
  { media: 'CTWANT', price: 12000, note: '無超連結' },
  { media: '粉健康', price: 15000 },
  { media: 'Fun-game', price: 15000 },
  { media: '摩方網', price: 24000 },
  { media: '富客島', price: 15000 },
  { media: '媽媽寶寶', price: 30000 },
  { media: '三立電子報', price: 30000, note: '1–3 圖' },
  { media: 'TVBS', price: 45000 },
  { media: '自由電子報', price: 45000 },
  { media: '東森新聞雲', price: 45000 },
  { media: '中天新聞網', price: 30000 },
  { media: '商業周刊網', price: 150000 },
  { media: '信傳媒', price: 15000 },
  { media: '巴哈姆特', price: 9000 },
  { media: 'Mobile 01', price: 9000 },
  { media: '醫師好生活', price: 15000 },
  { media: '營養師說健康', price: 15000 },
  { media: '健康EZGO', price: 15000 },
  { media: '健康好生活', price: 15000 },
  { media: '健康好ez', price: 15000 },
];

export const getPressReleaseMediaServiceId = (media: string) =>
  `press-release-media-${Array.from(media)
    .map((character) => character.codePointAt(0)!.toString(36))
    .join('-')}`;

export const pressReleaseMediaServices = pressReleaseMediaSeeds.map((item) => ({
  id: getPressReleaseMediaServiceId(item.media),
  title: `${item.media}新聞稿刊登`,
  description: item.note ? `特殊稿子／刊登條件：${item.note}` : '新聞稿媒體刊登費',
  price: item.price,
}));
