/* Catalogue. All names, notes, prices and performance figures are sample content written for the first version:
   replace them with the real perfumes. Images: assets/render/<id>-<bottle|pack|bag>.webp (+ -md) */
window.MDATA = {
  families: { citrus: '#e6c34a', floral: '#d97a8f', spice: '#c9643c', wood: '#8d6c45', resin: '#c9953a', musk: '#d3c8b2', green: '#7fa46c', sweet: '#b98b58', fruit: '#a73b4d' },
  notes: {
    'bergamot': ['citrus', 'Bergamot', 'برغموت', 'Bergamot'], 'black-pepper': ['spice', 'Black pepper', 'فلفل أسود', 'Karabiber'], 'cardamom': ['spice', 'Cardamom', 'هيل', 'Kakule'],
    'damask-rose': ['floral', 'Damask rose', 'ورد شامي', 'Şam gülü'], 'saffron': ['spice', 'Saffron', 'زعفران', 'Safran'], 'incense': ['resin', 'Incense', 'بخور', 'Tütsü'],
    'oud': ['wood', 'Oud', 'عود', 'Ud'], 'amber': ['resin', 'Amber', 'عنبر', 'Amber'], 'patchouli': ['wood', 'Patchouli', 'باتشولي', 'Paçuli'],
    'pink-pepper': ['spice', 'Pink pepper', 'فلفل وردي', 'Pembe biber'], 'mandarin': ['citrus', 'Mandarin', 'يوسفي', 'Mandalina'], 'cinnamon': ['spice', 'Cinnamon', 'قرفة', 'Tarçın'],
    'leather': ['wood', 'Leather', 'جلد', 'Deri'], 'labdanum': ['resin', 'Labdanum', 'لادن', 'Labdanum'], 'iris': ['floral', 'Iris', 'سوسن', 'İris'],
    'tonka': ['sweet', 'Tonka bean', 'فول التونكا', 'Tonka fasulyesi'], 'vanilla': ['sweet', 'Vanilla', 'فانيلا', 'Vanilya'], 'cashmere-wood': ['wood', 'Cashmere wood', 'خشب الكشمير', 'Kaşmir ağacı'],
    'raspberry': ['fruit', 'Raspberry', 'توت العليق', 'Ahududu'], 'geranium': ['green', 'Geranium', 'غرنوقي', 'Sardunya'], 'turkish-rose': ['floral', 'Turkish rose', 'ورد تركي', 'Türk gülü'],
    'sandalwood': ['wood', 'Sandalwood', 'خشب الصندل', 'Sandal ağacı'], 'honey': ['sweet', 'Honey', 'عسل', 'Bal'], 'jasmine': ['floral', 'Jasmine sambac', 'ياسمين سمبك', 'Sambak yasemin'],
    'orange-blossom': ['floral', 'Orange blossom', 'زهر البرتقال', 'Portakal çiçeği'], 'white-musk': ['musk', 'White musk', 'مسك أبيض', 'Beyaz misk'], 'grapefruit': ['citrus', 'Grapefruit', 'جريب فروت', 'Greyfurt'],
    'lemon': ['citrus', 'Lemon', 'ليمون', 'Limon'], 'mint': ['green', 'Mint', 'نعناع', 'Nane'], 'neroli': ['floral', 'Neroli', 'نيرولي', 'Neroli'],
    'white-tea': ['green', 'White tea', 'شاي أبيض', 'Beyaz çay'], 'cedar': ['wood', 'Cedar', 'أرز', 'Sedir'], 'ambroxan': ['musk', 'Ambroxan', 'أمبروكسان', 'Ambroxan'],
  },
  products: [
    {
      id: 'tadmur-noir', name: { en: 'Tadmur Noir', ar: 'تدمر نوار', tr: 'Tadmur Noir' }, type: 'edp', families: ['oriental', 'woody'], price: 2950,
      bg: ['#14574a', '#06201a'], tone: '#124a3b', liquid: '#f4e3a0',
      notes: { top: ['bergamot', 'black-pepper', 'cardamom'], heart: ['damask-rose', 'saffron', 'incense'], base: ['oud', 'amber', 'patchouli'] },
      perf: { hours: '9–10', projection: 4, intensity: 4 }, season: [0, 0, 1, 1], time: 'night', occasions: ['evening', 'special'],
      tag: { en: 'Dark, resinous, unforgettable.', ar: 'داكن، راتنجي، لا يُنسى.', tr: 'Koyu, reçineli, unutulmaz.' },
      desc: {
        en: 'A deep oriental built on oud and amber, opened with black pepper and cardamom and softened by Damask rose. Made for long evenings and quiet rooms.',
        ar: 'عطر شرقي عميق يقوم على العود والعنبر، يبدأ بالفلفل الأسود والهيل ويلين مع الورد الشامي. صُنع للأمسيات الطويلة والأماكن الهادئة.',
        tr: 'Ud ve amber üzerine kurulu derin bir oryantal; karabiber ve kakule ile açılır, Şam gülüyle yumuşar. Uzun akşamlar ve sessiz odalar için.',
      },
    },
    {
      id: 'qays-signature', name: { en: 'Qays Signature', ar: 'قيس سيغنتشر', tr: 'Qays Signature' }, type: 'extrait', families: ['oriental', 'woody'], price: 3950,
      bg: ['#4a4f51', '#121515'], tone: '#3a3d3e', liquid: '#f2dc8a',
      notes: { top: ['pink-pepper', 'mandarin', 'cinnamon'], heart: ['leather', 'labdanum', 'iris'], base: ['amber', 'tonka', 'vanilla', 'cashmere-wood'] },
      perf: { hours: '11–12', projection: 5, intensity: 5 }, season: [0, 0, 1, 1], time: 'night', occasions: ['special', 'evening'],
      tag: { en: 'The one people ask about.', ar: 'العطر الذي يسأل عنه الجميع.', tr: 'Herkesin sorduğu koku.' },
      desc: {
        en: 'A concentrated extrait of leather, labdanum and iris over a warm base of amber, tonka and vanilla. Soft at first, then it stays on skin all day.',
        ar: 'خلاصة عطرية مركّزة من الجلد واللادن والسوسن فوق قاعدة دافئة من العنبر والتونكا والفانيلا. ناعمة في البداية ثم تبقى على البشرة طوال اليوم.',
        tr: 'Deri, labdanum ve irisin yoğun bir ekstresi; altında amber, tonka ve vanilyanın sıcak tabanı. Önce yumuşak, sonra bütün gün ciltte kalıcı.',
      },
    },
    {
      id: 'rouge-damas', name: { en: 'Rouge Damas', ar: 'روج دمشق', tr: 'Rouge Damas' }, type: 'edp', families: ['floral', 'oriental'], price: 2950,
      bg: ['#7a1e33', '#25060f'], tone: '#5e1425', liquid: '#f6e4b4',
      notes: { top: ['raspberry', 'saffron', 'pink-pepper'], heart: ['damask-rose', 'geranium', 'turkish-rose'], base: ['patchouli', 'sandalwood', 'honey'] },
      perf: { hours: '8–9', projection: 4, intensity: 4 }, season: [1, 0, 1, 1], time: 'night', occasions: ['date', 'evening'],
      tag: { en: 'A Damask rose, dressed for the evening.', ar: 'وردة شامية بثوب السهرة.', tr: 'Akşama giyinmiş bir Şam gülü.' },
      desc: {
        en: 'Raspberry and saffron open onto a full Damask rose, resting on patchouli, sandalwood and a thread of honey. Rich, warm and a little daring.',
        ar: 'يفتتح التوت والزعفران على وردة شامية ممتلئة، تستقر على الباتشولي والصندل وخيط من العسل. غنيّ ودافئ وجريء قليلاً.',
        tr: 'Ahududu ve safran dolgun bir Şam gülüne açılır; paçuli, sandal ağacı ve bir tutam bal üzerine yerleşir. Zengin, sıcak ve biraz cesur.',
      },
    },
    {
      id: 'layl-al-sham', name: { en: 'Layl Al-Sham', ar: 'ليل الشام', tr: 'Layl Al-Sham' }, type: 'edp', families: ['oriental', 'floral'], price: 3250,
      bg: ['#3a3a3c', '#070707'], tone: '#151515', liquid: '#f1dd94',
      notes: { top: ['cardamom', 'bergamot'], heart: ['jasmine', 'orange-blossom', 'incense'], base: ['oud', 'white-musk', 'amber'] },
      perf: { hours: '9–10', projection: 4, intensity: 4 }, season: [0, 0, 1, 1], time: 'night', occasions: ['evening', 'date'],
      tag: { en: 'A warm night in old Damascus.', ar: 'ليلة دافئة في دمشق القديمة.', tr: "Eski Şam'da sıcak bir gece." },
      desc: {
        en: 'Jasmine sambac and orange blossom drift over incense and oud, finished with white musk. Sweet, smoky and made for after dark.',
        ar: 'ياسمين سمبك وزهر البرتقال فوق البخور والعود، وتنتهي بالمسك الأبيض. حلو ودخاني ومصنوع لما بعد الغروب.',
        tr: 'Sambak yasemin ve portakal çiçeği, tütsü ve udun üzerinde süzülür; beyaz miskle biter. Tatlı, dumanlı ve gece için.',
      },
    },
    {
      id: 'fajr', name: { en: 'Fajr', ar: 'فجر', tr: 'Fajr' }, type: 'edp', families: ['fresh', 'floral'], price: 2650,
      bg: ['#6b5a3a', '#241c10'], tone: '#e8dec8', liquid: '#f7edc0',
      notes: { top: ['grapefruit', 'lemon', 'mint'], heart: ['neroli', 'white-tea', 'orange-blossom'], base: ['white-musk', 'cedar', 'ambroxan'] },
      perf: { hours: '6–7', projection: 3, intensity: 3 }, season: [1, 1, 0, 0], time: 'day', occasions: ['daily', 'office'],
      tag: { en: 'Clean light, first thing in the morning.', ar: 'نور نظيف مع أول الصباح.', tr: 'Sabahın ilk, temiz ışığı.' },
      desc: {
        en: 'Grapefruit, lemon and mint over neroli and white tea, settling into white musk and cedar. Fresh, airy and easy to wear every day.',
        ar: 'جريب فروت وليمون ونعناع فوق النيرولي والشاي الأبيض، تستقر على المسك الأبيض والأرز. منعش وخفيف ومناسب لكل يوم.',
        tr: 'Greyfurt, limon ve nane; neroli ve beyaz çayın üzerinde; beyaz misk ve sedirde son bulur. Ferah, havadar, her gün için.',
      },
    },
  ],
};
