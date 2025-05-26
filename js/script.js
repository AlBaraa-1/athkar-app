document.addEventListener('DOMContentLoaded', () => {
    const adhkar = [
      { text: 'سُبْحَانَ الله', count: 33 },
      { text: 'الْحَمْدُ لِلَّه', count: 33 },
      { text: 'اللَّهُ أَكْبَر', count: 34 }
    ];
  
    const container = document.getElementById('adhkar-container');
  
    adhkar.forEach(itemData => {
      const item = document.createElement('div');
      item.classList.add('dhikr-item');
  
      const textEl = document.createElement('p');
      textEl.textContent = itemData.text;
      item.appendChild(textEl);
  
      const btn = document.createElement('button');
      btn.textContent = `Count: ${itemData.count}`;
      btn.addEventListener('click', () => {
        if (itemData.count > 0) {
          itemData.count--;
          btn.textContent = `Count: ${itemData.count}`;
        }
      });
      item.appendChild(btn);
  
      container.appendChild(item);
    });
  
    // Tasbeeh Counter Logic
    const counterDisplay = document.getElementById('counter-display');
    const incrementBtn = document.getElementById('increment-btn');
    const resetBtn = document.getElementById('reset-btn');
    let counter = 0;
  
    incrementBtn.addEventListener('click', () => {
      counter++;
      counterDisplay.textContent = counter;
    });
  
    resetBtn.addEventListener('click', () => {
      counter = 0;
      counterDisplay.textContent = counter;
    });
  });