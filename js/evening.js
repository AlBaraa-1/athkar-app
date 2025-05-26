// أذكار المساء
const eveningAdhkar = [
  { text: "أمسينا وأمسى الملك لله والحمد لله..." },
  { text: "اللّهـمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا..." },
  // ... (تابع إضافة الأذكار حسب الحاجة)
];

function renderEveningAdhkar() {
  const listDiv = document.getElementById('evening-adhkar-list');
  if (!listDiv) return;
  // عرض كل ذكر في div مستقل (يمكن إضافة خانة اختيار لكل ذكر إذا أردنا تتبع الإنجاز)
  listDiv.innerHTML = eveningAdhkar.map(item => 
    `<div style="margin-bottom: 1rem;">${item.text}</div>`
  ).join('');
  // يمكن توسيع الوظيفة لإضافة عناصر تحكم أو تتبع إنجاز المستخدم إن لزم
}

document.addEventListener('DOMContentLoaded', renderEveningAdhkar);
