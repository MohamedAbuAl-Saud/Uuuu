export interface CrewMember {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  descAr: string;
  avatarIcon: string;
  firstAppearance: string;
}

export interface ShipSection {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  eventsAr: string;
}

export interface SeaLocation {
  id: string;
  nameAr: string;
  nameEn: string;
  dangerLevel: 'low' | 'medium' | 'high' | 'deadly';
  descAr: string;
}

export const CREW_MEMBERS: CrewMember[] = [
  {
    id: 'sable',
    nameAr: 'القبطان سابل كرو',
    nameEn: 'Captain Sable Crowe',
    roleAr: 'قبطان السفينة',
    roleEn: 'Captain',
    descAr: 'قائد سفينة "نوكتيس". قاطع طريق بحري مهيب بعينين بلون رمادي العاصفة ووشوم أخطبوط وعظام حفرت على جسده. يخفي لعنة تفصل ظله عن جسده وتسلبه ذكرياته وإنسانيته.',
    avatarIcon: '⚓',
    firstAppearance: 'الفصل الثالث'
  },
  {
    id: 'eryse',
    nameAr: 'إيريس',
    nameEn: 'Eryse',
    roleAr: 'حورية البحر الهجين (البطلة)',
    roleEn: 'Siren Stowaway',
    descAr: 'ابنة حورية بحر وقرصان. ولدت بدون ذيل سمكة كامل ولا تستطيع التحول كلياً، لكنها تمتلك سحر الهمس والترنيمة التنويمية. تهرب من صيادي الحوريات وتختبئ في سفينة نوكتيس.',
    avatarIcon: '🧜‍♀️',
    firstAppearance: 'الفصل الأول'
  },
  {
    id: 'grim',
    nameAr: 'غريم',
    nameEn: 'Grim',
    roleAr: 'النائب الأول للقبطان',
    roleEn: 'First Mate',
    descAr: 'ذراع سابل الأيمن ورجل المهمات الصعبة. يحافظ على النظام والعدل بين القراصنة. لديه ندوب قديمة وشعر أحمر ووجه حاسم ولكنه يحمل جانباً إنصافياً.',
    avatarIcon: '⚔️',
    firstAppearance: 'الفصل الثاني'
  },
  {
    id: 'cailia',
    nameAr: 'كايليا',
    nameEn: 'Cailia',
    roleAr: 'ساحرة البحر',
    roleEn: 'Sea Witch',
    descAr: 'شقيقة سابل كرو. تمتك سحر البحر العتيق وتتواصل مع أسرار الأمواج وتعيش في منزل متداخل مع صخور الجرف المرجاني.',
    avatarIcon: '🔮',
    firstAppearance: 'الفصل السابع عشر'
  },
  {
    id: 'lark',
    nameAr: 'لارك',
    nameEn: 'Lark',
    roleAr: 'فتى المقصورة',
    roleEn: 'Cabin Boy',
    descAr: 'صبي في الثانية عشرة من عمره، ابن المرقاب نايتغلاس. طموح ويريد أن يصبح قرصاناً حقيقياً. أول من اكتشف إيريس على سطح السفينة.',
    avatarIcon: '🕯️',
    firstAppearance: 'الفصل الثاني'
  },
  {
    id: 'nightglass',
    nameAr: 'نايتغلاس',
    nameEn: 'Nightglass',
    roleAr: 'المرقاب (المستكشف)',
    roleEn: 'Lookout',
    descAr: 'والد لارك وعيون السفينة في عش الغراب. يمتلك نظرة حادة ومراقبة دقيقة للبريق الفضي "غليم" والأخطار البحرية.',
    avatarIcon: '🔭',
    firstAppearance: 'الفصل الثالث'
  },
  {
    id: 'harrow',
    nameAr: 'هارو',
    nameEn: 'هارو (الجراح ومجبر العظام)',
    roleAr: 'جراح السفينة',
    roleEn: 'Bonesetter / Surgeon',
    descAr: 'رجل مسن ذو تجاعيد عميقة وأسنان ذهبية وخبرة طويلة في طب القراصنة وتضميد الجراح وتجهيز الأعشاب.',
    avatarIcon: '🩺',
    firstAppearance: 'الفصل السابع'
  },
  {
    id: 'saint',
    nameAr: 'سينت',
    nameEn: 'Saint',
    roleAr: 'النجار',
    roleEn: 'Carpenter',
    descAr: 'المسؤول عن سلامة هيكل السفينة وسد الشقوق والألواح المتضررة من العواصف.',
    avatarIcon: '🪓',
    firstAppearance: 'الفصل الثالث'
  },
  {
    id: 'match',
    nameAr: 'ماتش',
    nameEn: 'Match',
    roleAr: 'فتى البارود',
    roleEn: 'Powder Monkey',
    descAr: 'عداء سريع وجريء ينقل البارود إلى المدافع وقت المعارك، ورحيم القلب مع إيريس.',
    avatarIcon: '💥',
    firstAppearance: 'الفصل الرابع'
  },
  {
    id: 'rat',
    nameAr: 'رات',
    nameEn: 'Rat',
    roleAr: 'المدفعي الحاقد',
    roleEn: 'Gunner',
    descAr: 'قرصان غليظ الرقبة ومليء بالضغينة ضد الحوريات، يسعى لبيع إيريس في أسواق العبيد أو إلقائها للبحر.',
    avatarIcon: '☠️',
    firstAppearance: 'الفصل الرابع'
  }
];

export const SHIP_SECTIONS: ShipSection[] = [
  {
    id: 'main-deck',
    nameAr: 'السطح الرئيسي (Main Deck)',
    nameEn: 'Main Deck',
    descAr: 'المساحة الأكبر في السفينة حيث تدور الأنشطة اليومية وربط الأشرعة ومواجهة العواصف والقتال.',
    eventsAr: 'هنا صعدت إيريس لأول مرة، وهنا عُقدت محاكمة القراصنة وواجهت إيريس لوح الغرق.'
  },
  {
    id: 'quarterdeck',
    nameAr: 'منصة القيادة (Quarterdeck)',
    nameEn: 'Quarterdeck',
    descAr: 'السطح المرتفع في مؤخرة السفينة حيث توجد عجلة القيادة ويصدر القبطان سابل أوامره للبحارة.',
    eventsAr: 'وقف القبطان سابل وغريم هنا للتوجيه وسط الدوامات وفي مواجهة بحر الظلال.'
  },
  {
    id: 'captains-cabin',
    nameAr: 'مقصورة القبطان (Captain’s Cabin)',
    nameEn: 'Captain’s Cabin',
    descAr: 'مساحة خاصة وواسعة تحتوي على مكتب خشبي ضخم وملاحة الخرائط وكتب المذكرات وسرير دافئ.',
    eventsAr: 'شهدت المحادثات الحميمية بين إيريس وسابل، واكتشاف دفتر مذكرات سابل ومواجهة حقيقة الظل.'
  },
  {
    id: 'hold',
    nameAr: 'عنبر الشحن (The Hold)',
    nameEn: 'The Hold',
    descAr: 'المنطقة الأكثر انخفاضاً وتخزيناً للبراميل والصناديق وغنائم الرحلات والماء العذب.',
    eventsAr: 'المخبأ الأول لإيريس خلف الصناديق والمكان الذي أصيبت فيه قدمها بالمسمار الصدئ.'
  },
  {
    id: 'orlop-deck',
    nameAr: 'سطح الأرجوحات والسجن (Orlop Deck)',
    nameEn: 'Orlop Deck',
    descAr: 'السطح الواقع تحت خط الماء، يحتوي على الأرجوحات الشبكية للبحارة وزنزانتين حديديتين.',
    eventsAr: 'سُجنت فيه إيريس واكتشفت فيه انفصال ظل القبطان لأول مرة ليلاً.'
  },
  {
    id: 'galley',
    nameAr: 'المطبخ (The Galley)',
    nameEn: 'Galley',
    descAr: 'مطبخ السفينة المجهز بفرن حديدي ومائدة عمل طويلة وتوابل وأوانٍ معلقة وشرفة خلفية صغيرة.',
    eventsAr: 'خرجت منه إيريس إلى الشرفة المقابلة للبحر المفتوح حيث التقت بالسابل لأول مرة وجه لوجه.'
  },
  {
    id: 'crows-nest',
    nameAr: 'عش الغراب (Crow’s Nest)',
    nameEn: 'Crow’s Nest',
    descAr: 'منصة عالية جداً أعلى الصاري الرئيسي ترقب الأفق والبحر المفتوح وخيط "غليم" المضيء.',
    eventsAr: 'صعدت إليه إيريس رغم خوفها من الارتفاعات لتراقب خيط البريق الفضي مع نايتغلاس وسابل.'
  },
  {
    id: 'helm',
    nameAr: 'عجلة القيادة (The Helm)',
    nameEn: 'Helm',
    descAr: 'موقع التوجيه المباشر للسفينة للتحكم في الأشرعة ومواجهة التيارات المائية.',
    eventsAr: 'المكان الذي أبحر فيه سابل في أحلك العواصف والتف حوله القراصنة لمواجهة الأمواج.'
  }
];

export const SEA_LOCATIONS: SeaLocation[] = [
  {
    id: 'sea-of-crowns',
    nameAr: 'بحر التيجان (Sea of Crowns)',
    nameEn: 'Sea of Crowns',
    dangerLevel: 'medium',
    descAr: 'بحر معروف بالعواصف المفاجئة وتوجد فيه جزيرة كانثورا (أوريليث) المليئة باللصوص وصيادي الحوريات.'
  },
  {
    id: 'intermaria',
    nameAr: 'منطقة بين البحار (The Intermaria)',
    nameEn: 'The Intermaria',
    dangerLevel: 'deadly',
    descAr: 'نقطة التلاق العنيف بين بحرين، حيث تتولد دوامات مائية غادرة تبتلع السفن ما لم يُتبع مسار التيارات الصحيحة.'
  },
  {
    id: 'sea-of-renewal',
    nameAr: 'بحر التجدد (Sea of Renewal)',
    nameEn: 'Sea of Renewal',
    dangerLevel: 'high',
    descAr: 'بحر سحري مياهه تعافى الجراح والأجساد فوراً، ولكنه يأخذ ذكريات عزيزة مقابل كل شفاء.'
  },
  {
    id: 'sea-of-bones',
    nameAr: 'بحر العظام (Sea of Bones)',
    nameEn: 'Sea of Bones',
    dangerLevel: 'deadly',
    descAr: 'مقبرة القراصنة الملعونين حيث تتراكم العظام في القاع ويُسحب البحارة الملتحقون بلعنة البحر للغرق.'
  },
  {
    id: 'sea-of-shadows',
    nameAr: 'بحر الظلال (Sea of Shadows)',
    nameEn: 'Sea of Shadows',
    dangerLevel: 'deadly',
    descAr: 'عدم مظلم زيتي المياه لا تشرق فيه الشمس كلياً، موطن حوريات المياه المظلمة البدائية والشرسة.'
  },
  {
    id: 'sea-of-dreams',
    nameAr: 'بحر الأحلام (Sea of Dreams)',
    nameEn: 'Sea of Dreams',
    dangerLevel: 'high',
    descAr: 'بحر زجاجي هادئ كالمرآة ينعدم فيه الهواء ويغرق البحارة في نوم وأحلام أو كوابيس مشتركة قاتلة.'
  },
  {
    id: 'sea-of-first-song',
    nameAr: 'بحر الأغنية الأولى (Sea of the First Song)',
    nameEn: 'Sea of the First Song',
    dangerLevel: 'medium',
    descAr: 'الرحم المقدس والموطن البدائي للبحر حيث وُلدت الحوريات والساحرات والقراصنة وبدأت الأسطورة.'
  }
];
