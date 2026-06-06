import type { Locale } from '@/lib/i18n';
import type { DangerSign } from '@/lib/types';

export interface DangerSignItem extends DangerSign {
  /** English label sent to AI (clinical consistency) */
  aiLabel: string;
}

const DANGER_SIGNS: Record<Locale, DangerSignItem[]> = {
  en: [
    { id: 'bleeding', label: 'Bleeding from vagina', icon: 'Droplets', aiLabel: 'Vaginal bleeding' },
    { id: 'headache', label: 'Very bad headache', icon: 'Zap', aiLabel: 'Severe headache' },
    { id: 'vision', label: 'Blurry vision', icon: 'Eye', aiLabel: 'Blurred vision' },
    { id: 'convulsions', label: 'Fits or shaking', icon: 'Activity', aiLabel: 'Convulsions or fits' },
    { id: 'fetal', label: 'Baby moving less', icon: 'Baby', aiLabel: 'Reduced fetal movement' },
    { id: 'swelling', label: 'Face or hands very swollen', icon: 'AlertCircle', aiLabel: 'Severe facial/hand swelling' },
    { id: 'fever', label: 'High fever', icon: 'Thermometer', aiLabel: 'High fever' },
    { id: 'breathing', label: 'Hard to breathe', icon: 'Wind', aiLabel: 'Difficulty breathing' },
  ],
  am: [
    { id: 'bleeding', label: 'ከሽንት bleeding', icon: 'Droplets', aiLabel: 'Vaginal bleeding' },
    { id: 'headache', label: 'ከባድ ራስ ምታት', icon: 'Zap', aiLabel: 'Severe headache' },
    { id: 'vision', label: 'የማየት ጭ糊', icon: 'Eye', aiLabel: 'Blurred vision' },
    { id: 'convulsions', label: 'ሽብርተኝነት / መንቀጥቀጥ', icon: 'Activity', aiLabel: 'Convulsions or fits' },
    { id: 'fetal', label: 'ሕፃኑ کم يتحرك', icon: 'Baby', aiLabel: 'Reduced fetal movement' },
    { id: 'swelling', label: 'ፊት ወይም እጅ በጣም ተነፍጎ', icon: 'AlertCircle', aiLabel: 'Severe facial/hand swelling' },
    { id: 'fever', label: 'ከፍተኛ ትኩሳት', icon: 'Thermometer', aiLabel: 'High fever' },
    { id: 'breathing', label: 'መተንፈስ መከታተል', icon: 'Wind', aiLabel: 'Difficulty breathing' },
  ],
};

const FOOD_GROUPS: Record<Locale, string[]> = {
  en: [
    'Bread, injera, or grains',
    'Beans or lentils',
    'Nuts or seeds',
    'Milk or dairy',
    'Meat, chicken, or fish',
    'Eggs',
    'Green vegetables (gomen, kale)',
    'Orange or yellow fruits/vegetables',
    'Other vegetables',
    'Fruits',
  ],
  am: [
    'ዳቦ፣ injera ወይም cereals',
    'ባቄላ ወይም ሽንብራ',
    'አጥብቶች ወይም ዘሮች',
    'ወተት',
    'ስጋ፣ ዶሮ ወይም ዓሳ',
    'እንቁላል',
    'አረንጓዴ አትክልት',
    'ብርቱካማ/ቢጫ ፍራፍሬ',
    'ሌሎች አትክልቶች',
    'ፍራፍሬ',
  ],
};

const WELLNESS_QUESTIONS: Record<Locale, string[]> = {
  en: [
    'How do you feel today?',
    'Did you feel very sad or hopeless this week?',
    'Are you sleeping okay?',
    'Do people at home support you?',
    'Did you have enough food this week?',
  ],
  am: [
    'ዛሬ እንዴት ይሰማዎታል?',
    'በዚህ ሳምንት በጣም حزين ወይም hopeless ነበር?',
    'በጥሩ ሁኔታ ትنام?',
    'ቤት ውስጥ የሚረዱዎት አሉ?',
    'በዚህ ሳምንት በቂ ምግብ በሉ?',
  ],
};

const DELIVERY_CHECKLIST: Record<Locale, string[]> = {
  en: [
    'I know which health facility to go to for birth',
    'Transport to the facility is arranged',
    'Someone to call in an emergency',
    'Someone to come with me (husband, mother, or friend)',
    'Baby clothes and blanket ready',
    'Money saved for facility costs',
    'Blood donor identified (if needed)',
    'My health worker knows my birth plan',
  ],
  am: [
    'ለወሊድ የሚሄድበት health center አውቃለሁ',
    'መጓዝ ተዘጋጅቷል',
    'በ emergency የሚደውል ሰው አለ',
    'ከእኔ ጋር የሚመጣ ሰው አለ',
    'የሕፃን ልብስ እና blanket ዝግጁ',
    'ለ health center ገንዘብ ተዘጋጅቷል',
    'የደም donor (ከሚያስፈልግ)',
    'health worker birth plan አውቀዋል',
  ],
};

const ANC_FOCUS: Record<Locale, Record<number, string>> = {
  en: {
    1: 'First visit — tests and check-up',
    2: 'Ultrasound and baby check',
    3: 'Blood pressure and blood check',
    4: 'Baby growth check',
    5: 'Getting ready for birth',
    6: 'Final tests before birth',
    7: 'Review warning signs',
    8: 'Confirm birth plan',
  },
  am: {
    1: 'መጀመሪያ ጉዞ — መመረmaq',
    2: 'Ultrasound',
    3: 'የደም ግፊት እና anemia',
    4: 'የሕፃን እድገት',
    5: 'ለወሊድ መዘጋጀት',
    6: 'መጨረሻ መመረmaq',
    7: 'አደገኛ ምልክቶች',
    8: 'birth plan',
  },
};

export function getDangerSigns(locale: Locale): DangerSignItem[] {
  return DANGER_SIGNS[locale];
}

export function getFoodGroups(locale: Locale): string[] {
  return FOOD_GROUPS[locale];
}

export function getWellnessQuestions(locale: Locale): string[] {
  return WELLNESS_QUESTIONS[locale];
}

export function getDeliveryChecklist(locale: Locale): string[] {
  return DELIVERY_CHECKLIST[locale];
}

export function getAncFocus(locale: Locale, contactId: number): string {
  return ANC_FOCUS[locale][contactId] ?? ANC_FOCUS.en[contactId] ?? '';
}
