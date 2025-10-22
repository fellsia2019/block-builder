# ✅ Модалка для деталей карточки в Pure JS примере

## Что добавлено

Реализована модалка с деталями карточки для **pure-js** примера, аналогично Vue3 примеру.

**Важно:** Вся логика модалки находится в **пользовательском коде**, НЕ в пакете!

---

## 📝 Изменённые файлы

### 1. `src/examples/pure-js/block-config.js`

#### Изменения в template функции:

```javascript
template: (props) => {
  // ...
  
  // ✅ Добавлен data-card-index для идентификации
  const cardsHtml = cards.map((card, index) => `
    <div class="card" data-card-index="${index}" style="...cursor:pointer;">
      ${card.image ? `<div class="card-image">...</div>` : ''}
      <h3 class="card-title">...</h3>
      <p class="card-text">...</p>
      
      <!-- ✅ Изменено: <a> → <span> (без перехода по ссылке) -->
      ${card.button && card.link ? 
        `<span class="card-button" style="...">...</span>` : ''}
    </div>
  `).join('');

  // ✅ Добавлен data-cards с JSON данными
  const cardsData = JSON.stringify(cards).replace(/"/g, '&quot;');

  return `
    <div class="card-list-block" data-cards='${cardsData}'>
      ...
    </div>
  `;
}
```

**Что изменилось:**
- ✅ Карточка получила `data-card-index` для идентификации
- ✅ Добавлен `cursor: pointer` для визуальной подсказки
- ✅ `<a>` заменён на `<span>` (клик обрабатывается JS)
- ✅ Данные карточек сохранены в `data-cards` атрибуте

---

### 2. `src/examples/pure-js/index.html`

#### Добавлено: CSS стили для модалки

```css
/* Модалка для деталей карточки (код пользователя, НЕ пакета!) */
.card-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: none;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.card-modal-overlay.show {
  display: flex;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

#### Добавлено: HTML модалки

```html
<!-- Модалка для деталей карточки (код пользователя, НЕ пакета!) -->
<div class="card-modal-overlay" id="cardModal">
  <div class="card-modal-content">
    <div class="modal-header">
      <h3 id="modalTitle"></h3>
      <button class="modal-close-btn" onclick="closeCardModal()">×</button>
    </div>
    <div class="modal-body">
      <img id="modalImage" class="modal-image" src="" alt="">
      <h4 id="modalSubtitle" class="modal-title"></h4>
      <p id="modalDescription" class="modal-description"></p>
      <div class="modal-actions">
        <a id="modalLink" class="modal-link-btn" href="#" target="_blank"></a>
      </div>
    </div>
  </div>
</div>
```

#### Добавлено: JavaScript логика

```javascript
// ===== ПОЛЬЗОВАТЕЛЬСКАЯ ЛОГИКА ДЛЯ МОДАЛКИ КАРТОЧЕК =====

// Показ модалки
window.showCardModal = function(card) {
  const modal = document.getElementById('cardModal');
  // Заполняем данные
  document.getElementById('modalTitle').textContent = card.title;
  document.getElementById('modalDescription').textContent = card.text;
  // ...
  modal.classList.add('show');
};

// Закрытие модалки
window.closeCardModal = function() {
  document.getElementById('cardModal').classList.remove('show');
};

// Обработчик кликов по карточкам
document.addEventListener('click', function(e) {
  const card = e.target.closest('.card[data-card-index]');
  if (card) {
    e.preventDefault();
    const cardListBlock = card.closest('.card-list-block');
    const cardsData = cardListBlock.getAttribute('data-cards');
    const cards = JSON.parse(cardsData);
    const cardIndex = parseInt(card.getAttribute('data-card-index'), 10);
    showCardModal(cards[cardIndex]);
  }
});

// Закрытие по ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeCardModal();
});
```

---

## 🎯 Как это работает

### Поток данных

```
1. Пользователь кликает на карточку
   ↓
2. Event listener ловит клик на .card[data-card-index]
   ↓
3. Получаем data-card-index из атрибута
   ↓
4. Парсим JSON из data-cards родительского элемента
   ↓
5. Находим нужную карточку по индексу
   ↓
6. Вызываем showCardModal(card)
   ↓
7. Заполняем модалку данными
   ↓
8. Показываем модалку (.show класс)
```

### Закрытие модалки

Модалка закрывается при:
- ✅ Клике на кнопку ×
- ✅ Клике вне модалки (на overlay)
- ✅ Нажатии ESC

---

## 🔄 Сравнение: Vue3 vs Pure JS

| Аспект | Vue3 | Pure JS |
|--------|------|---------|
| **Состояние** | `data() { showModal, selectedCard }` | Глобальные функции |
| **Реактивность** | Vue реактивность | Прямая манипуляция DOM |
| **Шаблон** | В template компонента | Отдельный HTML блок |
| **Стили** | В `<style>` Vue файла / index.html | В `<style>` index.html |
| **Обработчики** | `@click="handleCardClick"` | `addEventListener('click')` |

---

## ✅ Принципы чистой архитектуры соблюдены

### Пакет (универсальный)
```
❌ НЕ содержит:
- Логику модалки карточек
- Обработчики кликов по карточкам
- Знания о "деталях карточки"

✅ Содержит только:
- Управление блоками
- Рендеринг компонентов
- CRUD операции
```

### Пользовательский код (специфичный)
```
✅ Содержит:
- Модалку с деталями карточки
- Обработчики кликов
- CSS стили модалки
- Логику показа/закрытия
```

---

## 📚 Использование

### 1. Создать блок "Список карточек"

```
1. Запустить dev-server: node dev-server.js
2. Открыть http://localhost:3000/src/examples/pure-js/index.html
3. Нажать "📝 Добавить Список карточек"
4. Заполнить форму
5. Нажать "Добавить"
```

### 2. Кликнуть на карточку

```
1. Кликнуть на любую карточку в списке
2. ✅ Откроется модалка с деталями:
   - Заголовок
   - Изображение
   - Описание
   - Кнопка со ссылкой
3. Закрыть модалку:
   - Кнопкой ×
   - Кликом вне модалки
   - Клавишей ESC
```

---

## 🎨 Особенности реализации

### CSS анимации
- `fadeIn` для overlay
- `slideIn` для контента модалки
- Hover эффекты на карточках

### Адаптивность
- Модалка адаптируется под размер экрана
- `max-width: 600px`, `width: 90%`
- `max-height: 90vh` с прокруткой

### UX улучшения
- ✅ Backdrop blur для overlay
- ✅ Плавные анимации
- ✅ Визуальная подсказка (cursor: pointer)
- ✅ Закрытие по ESC
- ✅ Закрытие по клику вне модалки

---

## 🔍 Технические детали

### Передача данных

Данные карточек передаются через `data-cards` атрибут:

```javascript
const cardsData = JSON.stringify(cards).replace(/"/g, '&quot;');
// <div class="card-list-block" data-cards='[{...},{...}]'>
```

**Почему так:**
- ✅ Простота реализации
- ✅ Не нужно хранить состояние глобально
- ✅ Данные всегда синхронизированы с DOM

### Event delegation

Используется делегирование событий:

```javascript
document.addEventListener('click', function(e) {
  const card = e.target.closest('.card[data-card-index]');
  // Работает даже для динамически добавленных карточек
});
```

**Преимущества:**
- ✅ Один обработчик на весь документ
- ✅ Работает с динамическим контентом
- ✅ Меньше памяти

---

## ✅ Итог

Модалка с деталями карточки успешно реализована в pure-js примере:

- ✅ **Пакет остаётся универсальным** — не знает о модалке
- ✅ **Логика у пользователя** — в примерах
- ✅ **Чистая архитектура** — соблюдена
- ✅ **Работает в Vue3** — своя реализация
- ✅ **Работает в Pure JS** — своя реализация

**Два разных подхода для одной задачи — правильная архитектура!** 🎉

