const fs = require('fs');

const data = `export interface Wilaya {
  code: string;
  name: string;
  communes: string[];
  deliveryHome: number;
  deliveryOffice: number;
}

export const wilayas: Wilaya[] = [
  { code: "01", name: "أدرار", communes: ["أدرار", "تيميمون", "رقان", "أولف", "تسابيت", "شروين", "فنوغيل", "زاوية كنتة"], deliveryHome: 1200, deliveryOffice: 800 },
  { code: "02", name: "الشلف", communes: ["الشلف", "تنس", "الأبيض مجاجة", "بوقادير", "الكريمية", "وادي الفضة", "عين مران"], deliveryHome: 800, deliveryOffice: 500 },
  { code: "03", name: "الأغواط", communes: ["الأغواط", "آفلو", "حاسي الرمل", "قلتة سيدي سعد", "عين ماضي", "بريدة"], deliveryHome: 1000, deliveryOffice: 700 },
  { code: "04", name: "أم البواقي", communes: ["أم البواقي", "عين البيضاء", "عين مليلة", "عين فكرون", "سيقوس", "مسكيانة"], deliveryHome: 800, deliveryOffice: 500 },
  { code: "05", name: "باتنة", communes: ["باتنة", "بريكة", "عين التوتة", "مروانة", "نقاوس", "أريس", "تازولت", "سريانة"], deliveryHome: 800, deliveryOffice: 500 },
  { code: "06", name: "بجاية", communes: ["بجاية", "أقبو", "سيدي عيش", "خراطة", "تيشي", "أميزور", "الكلج"], deliveryHome: 800, deliveryOffice: 500 },
  { code: "07", name: "بسكرة", communes: ["بسكرة", "سيدي عقبة", "طولقة", "أوماش", "فوغالة", "جمورة", "القنطرة"], deliveryHome: 900, deliveryOffice: 600 },
  { code: "08", name: "بشار", communes: ["بشار", "بني ونيف", "العبادلة", "القنادسة", "تاغيت", "كرزاز"], deliveryHome: 1200, deliveryOffice: 800 },
  { code: "09", name: "البليدة", communes: ["البليدة", "بوفاريك", "موزاية", "بوعرفة", "بوقرة", "الأربعاء", "بني مراد"], deliveryHome: 600, deliveryOffice: 400 },
  { code: "10", name: "البويرة", communes: ["البويرة", "سور الغزلان", "عين بسام", "الأخضرية", "بئر غبالو", "برج أوخريص"], deliveryHome: 700, deliveryOffice: 500 },
  { code: "11", name: "تمنراست", communes: ["تمنراست", "عين قزام", "عين صالح", "إن أمقل", "تاظروق"], deliveryHome: 1600, deliveryOffice: 1120 },
  { code: "12", name: "تبسة", communes: ["تبسة", "بئر العاتر", "الشريعة", "العوينات", "بكارية", "مرسط"], deliveryHome: 850, deliveryOffice: 520 },
  { code: "13", name: "تلمسان", communes: ["تلمسان", "مغنية", "الغزوات", "ندرومة", "سبدو", "الرمشي", "هنين"], deliveryHome: 900, deliveryOffice: 570 },
  { code: "14", name: "تيارت", communes: ["تيارت", "سوقر", "فرندة", "مهدية", "عين الذهب", "قصر الشلالة"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "15", name: "تيزي وزو", communes: ["تيزي وزو", "عزازقة", "ذراع الميزان", "عين الحمام", "لربعة نايث يراثن", "بوزقن"], deliveryHome: 750, deliveryOffice: 520 },
  { code: "16", name: "الجزائر", communes: ["الجزائر الوسطى", "سيدي أمحمد", "باب الوادي", "بولوغين", "القصبة", "بئر مراد رايس", "الأبيار", "بوزريعة", "الدار البيضاء", "حسين داي", "الحراش", "براقي", "سيدي موسى", "دار البيضاء", "الرويبة", "رغاية"], deliveryHome: 600, deliveryOffice: 470 },
  { code: "17", name: "الجلفة", communes: ["الجلفة", "مسعد", "حاسي بحبح", "عين وسارة", "الإدريسية", "بيرين"], deliveryHome: 950, deliveryOffice: 520 },
  { code: "18", name: "جيجل", communes: ["جيجل", "الطاهير", "الميلية", "سيدي معروف", "العنصر", "زيامة منصورية"], deliveryHome: 750, deliveryOffice: 520 },
  { code: "19", name: "سطيف", communes: ["سطيف", "العلمة", "عين ولمان", "بوعنداس", "عين أزال", "عين الكبيرة", "بني ورتيلان"], deliveryHome: 500, deliveryOffice: 370 },
  { code: "20", name: "سعيدة", communes: ["سعيدة", "عين الحجر", "يوب", "الحساسنة", "أولاد إبراهيم"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "21", name: "سكيكدة", communes: ["سكيكدة", "القل", "عزابة", "الحروش", "تمالوس", "سيدي مزغيش"], deliveryHome: 750, deliveryOffice: 520 },
  { code: "22", name: "سيدي بلعباس", communes: ["سيدي بلعباس", "عين التبنت", "تلاغ", "بن بادس", "سفيزف", "مسيد"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "23", name: "عنابة", communes: ["عنابة", "برحال", "الحجار", "سيدي عمار", "العلمة", "شطايبي"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "24", name: "قالمة", communes: ["قالمة", "بوشقوف", "وادي الزناتي", "عين مخلوف", "حلوفة", "حمام دباغ"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "25", name: "قسنطينة", communes: ["قسنطينة", "الخروب", "عين سمارة", "حامة بوزيان", "ديدوش مراد", "زيغود يوسف"], deliveryHome: 750, deliveryOffice: 520 },
  { code: "26", name: "المدية", communes: ["المدية", "قصر البخاري", "بني سليمان", "البرواقية", "تابلاط", "شلالة العذاورة"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "27", name: "مستغانم", communes: ["مستغانم", "عين تادلس", "سيدي علي", "ماسرة", "خير الدين", "حاسي ماماش"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "28", name: "المسيلة", communes: ["المسيلة", "بوسعادة", "سيدي عيسى", "عين الملح", "حمام الضلعة", "مقرة"], deliveryHome: 850, deliveryOffice: 570 },
  { code: "29", name: "معسكر", communes: ["معسكر", "تيغنيف", "سيق", "بوحنيفية", "وادي الأبطال", "عين فكان"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "30", name: "ورقلة", communes: ["ورقلة", "حاسي مسعود", "تقرت", "الطيبات", "المقارين", "نقوسة"], deliveryHome: 1000, deliveryOffice: 700 },
  { code: "31", name: "وهران", communes: ["وهران", "بئر الجير", "السانية", "العنصر", "أرزيو", "عين الترك", "وادي تليلات", "مسرغين"], deliveryHome: 700, deliveryOffice: 500 },
  { code: "32", name: "البيض", communes: ["البيض", "بوقطب", "آربوات", "بريزينة", "الأبيض سيدي الشيخ"], deliveryHome: 1100, deliveryOffice: 800 },
  { code: "33", name: "إليزي", communes: ["إليزي", "جانت", "برج عمر ادريس", "عين أمناس"], deliveryHome: 1500, deliveryOffice: 1000 },
  { code: "34", name: "برج بوعريريج", communes: ["برج بوعريريج", "رأس الوادي", "المنصورة", "سيدي عيسى", "عين تاغروت"], deliveryHome: 800, deliveryOffice: 500 },
  { code: "35", name: "بومرداس", communes: ["بومرداس", "الثنية", "خميس الخشنة", "برج منايل", "دلس", "بغلية", "نسيسة"], deliveryHome: 600, deliveryOffice: 400 },
  { code: "36", name: "الطارف", communes: ["الطارف", "القالة", "بوحجار", "الذرعان", "بن مهيدي", "البسباس"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "37", name: "تندوف", communes: ["تندوف"], deliveryHome: 1500, deliveryOffice: 1000 },
  { code: "38", name: "تيسمسيلت", communes: ["تيسمسيلت", "برج بوعنداس", "ثنية الحد", "لرجام", "الأربعاء"], deliveryHome: 800, deliveryOffice: 450 },
  { code: "39", name: "الوادي", communes: ["الوادي", "قمار", "الرباح", "الدبيلة", "حاسي خليفة", "المغير"], deliveryHome: 950, deliveryOffice: 670 },
  { code: "40", name: "خنشلة", communes: ["خنشلة", "قايس", "بغاي", "الحامة", "ششار", "أولاد رشاش"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "41", name: "سوق أهراس", communes: ["سوق أهراس", "سدراتة", "مداوروش", "حنانشة", "أويلان"], deliveryHome: 750, deliveryOffice: 520 },
  { code: "42", name: "تيبازة", communes: ["تيبازة", "الحمدانية", "شرشال", "القليعة", "الداموس", "فوكة", "سيدي أعمر"], deliveryHome: 750, deliveryOffice: 520 },
  { code: "43", name: "ميلة", communes: ["ميلة", "فرجيوة", "شلغوم العيد", "وادي العثمانية", "تاجنانت", "عين التين"], deliveryHome: 700, deliveryOffice: 520 },
  { code: "44", name: "عين الدفلى", communes: ["عين الدفلى", "خميس مليانة", "مليانة", "الأصنام", "الأربعطاش", "بوميدفع"], deliveryHome: 750, deliveryOffice: 520 },
  { code: "45", name: "النعامة", communes: ["النعامة", "المشرية", "عين الصفراء", "تيوت", "مكمن بن عمار"], deliveryHome: 1100, deliveryOffice: 670 },
  { code: "46", name: "عين تموشنت", communes: ["عين تموشنت", "بني صاف", "الأمير عبد القادر", "حمام بوحجر", "عين الكيحل"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "47", name: "غرداية", communes: ["غرداية", "المنيعة", "متليلي", "بريان", "الغرارة", "ضاية بن ضحوة"], deliveryHome: 950, deliveryOffice: 620 },
  { code: "48", name: "غليزان", communes: ["غليزان", "مازونة", "وادي رهيو", "عمي موسى", "الرمكة", "سيدي لزرق"], deliveryHome: 800, deliveryOffice: 520 },
  { code: "49", name: "تيميمون", communes: ["تيميمون", "أوقروت", "طالمين", "المطارفة"], deliveryHome: 1100, deliveryOffice: 970 },
  { code: "50", name: "برج باجي مختار", communes: ["برج باجي مختار", "تيمياوين"], deliveryHome: 1500, deliveryOffice: 1000 },
  { code: "51", name: "أولاد جلال", communes: ["أولاد جلال", "سيدي خالد", "الدوسن", "الشعيبة"], deliveryHome: 900, deliveryOffice: 520 },
  { code: "52", name: "بني عباس", communes: ["بني عباس", "الوطاء", "إقلي", "تامتريت"], deliveryHome: 1400, deliveryOffice: 970 },
  { code: "53", name: "عين صالح", communes: ["عين صالح", "فقارة الزوى", "إن قزام"], deliveryHome: 1600, deliveryOffice: 1120 },
  { code: "54", name: "عين قزام", communes: ["عين قزام", "تين زاواتين"], deliveryHome: 1600, deliveryOffice: 1600 },
  { code: "55", name: "تقرت", communes: ["تقرت", "الحجيرة", "تماسين", "النزلة", "سيدي سليمان"], deliveryHome: 950, deliveryOffice: 670 },
  { code: "56", name: "جانت", communes: ["جانت", "برج الحواس"], deliveryHome: 1500, deliveryOffice: 1000 },
  { code: "57", name: "المغير", communes: ["المغير", "جامعة", "سيدي خليل", "أم الطيور"], deliveryHome: 950, deliveryOffice: 620 },
  { code: "58", name: "المنيعة", communes: ["المنيعة", "حاسي الغلة"], deliveryHome: 1000, deliveryOffice: 670 },
];

export const getWilayaByCode = (code: string): Wilaya | undefined => {
  return wilayas.find(w => w.code === code);
};

export const getCommunesByWilaya = (code: string): string[] => {
  const wilaya = getWilayaByCode(code);
  return wilaya ? wilaya.communes : [];
};
`;

fs.writeFileSync('c:\\Users\\Admin\\Desktop\\PC ITCH\\src\\data\\algerianWilayas.ts', data);
