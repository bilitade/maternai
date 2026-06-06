import type { Food } from '@/lib/types';

export const FOODS: Food[] = [
  { name: 'Shiro', amharic: 'ሽሮ', nutrient: 'Iron', tip: 'Rich in iron and protein', trimesters: [1, 2, 3] },
  { name: 'Gomen (Kale)', amharic: 'ጎመን', nutrient: 'Iron', tip: 'Iron and folate-rich green vegetable', trimesters: [1, 2, 3] },
  { name: 'Lentils (Misir)', amharic: 'ምስር', nutrient: 'Iron', tip: 'High iron and plant protein', trimesters: [1, 2, 3] },
  { name: 'Chickpeas', amharic: 'ሽምብራ', nutrient: 'Protein', tip: 'Protein and folate for fetal development', trimesters: [2, 3] },
  { name: 'Eggs', amharic: 'እንቁላል', nutrient: 'Protein', tip: 'Complete protein and choline for brain development', trimesters: [1, 2, 3] },
  { name: 'Milk', amharic: 'ወተት', nutrient: 'Calcium', tip: 'Calcium for bone development', trimesters: [2, 3] },
  { name: 'Ater Kik', amharic: 'አተር ቅቅ', nutrient: 'Folate', tip: 'High in folate — critical in first trimester', trimesters: [1, 2] },
  { name: 'Liver', amharic: 'ጉበት', nutrient: 'Folate', tip: 'Excellent folate and iron source', trimesters: [1, 2] },
  { name: 'Injera', amharic: 'እንጀራ', nutrient: 'Energy', tip: 'Fermented teff provides energy and probiotics', trimesters: [1, 2, 3] },
  { name: 'Atmit', amharic: 'አጥሚት', nutrient: 'Energy', tip: 'Barley porridge — easy to digest, high energy', trimesters: [1, 3] },
  { name: 'Sesame (Selit)', amharic: 'ሰሊጥ', nutrient: 'Calcium', tip: 'Calcium and healthy fats', trimesters: [2, 3] },
  { name: 'Yogurt (Ayib)', amharic: 'አይብ', nutrient: 'Calcium', tip: 'Calcium and protein for bone and muscle health', trimesters: [2, 3] },
];
