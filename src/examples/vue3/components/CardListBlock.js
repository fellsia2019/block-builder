const Vue = window.Vue;

export default Vue.defineComponent({
  name: 'CardListBlock',
  data() {
    return {
      selectedCard: null,
      showModal: false
    };
  },
  props: {
    title: { type: String, default: 'Наши услуги' },
    card1_title: { type: String, default: 'Веб-разработка' },
    card1_text: { type: String, default: 'Создание современных веб-приложений' },
    card1_button: { type: String, default: 'Подробнее' },
    card1_link: { type: String, default: 'https://example.com' },
    card1_image: { type: String, default: 'https://i.pinimg.com/736x/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg' },
    card2_title: { type: String, default: 'Мобильные приложения' },
    card2_text: { type: String, default: 'Разработка мобильных приложений для iOS и Android' },
    card2_button: { type: String, default: 'Узнать больше' },
    card2_link: { type: String, default: 'https://example.com' },
    card2_image: { type: String, default: 'https://i.pinimg.com/736x/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg' },
    card3_title: { type: String, default: 'Дизайн' },
    card3_text: { type: String, default: 'Создание уникального дизайна для вашего бренда' },
    card3_button: { type: String, default: 'Посмотреть работы' },
    card3_link: { type: String, default: 'https://example.com' },
    card3_image: { type: String, default: 'https://i.pinimg.com/736x/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg' },
    cardBackground: { type: String, default: '#ffffff' },
    cardTextColor: { type: String, default: '#333333' },
    cardBorderRadius: { type: Number, default: 8 },
    columns: { type: [String, Number], default: '3' },
    gap: { type: Number, default: 16 }
  },
  computed: {
    cards() {
      return [
        { title: this.card1_title, text: this.card1_text, button: this.card1_button, link: this.card1_link, image: this.card1_image },
        { title: this.card2_title, text: this.card2_text, button: this.card2_button, link: this.card2_link, image: this.card2_image },
        { title: this.card3_title, text: this.card3_text, button: this.card3_button, link: this.card3_link, image: this.card3_image }
      ].filter(card => card.title && card.text);
    }
  },
  methods: {
    handleCardClick(event, card) {
      // Предотвращаем переход по ссылке
      event.preventDefault();
      
      // Показываем свою модалку (логика пользователя)
      this.selectedCard = card;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedCard = null;
    },
    openLink(link) {
      window.open(link, '_blank');
      this.closeModal();
    }
  },
  template: `
    <div class="card-list-block">
      <h2 v-if="title" class="list-title">{{ title }}</h2>
      <div class="cards-container" :style="{ display: 'grid', gridTemplateColumns: 'repeat(' + columns + ', 1fr)', gap: gap + 'px', padding: '20px 0' }">
        <div v-for="(card, index) in cards" :key="index" class="card" :style="{ backgroundColor: cardBackground, color: cardTextColor, borderRadius: cardBorderRadius + 'px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s ease', cursor: 'pointer' }" @click="handleCardClick($event, card)">
          <div class="card-image" v-if="card.image">
            <img :src="card.image" :alt="card.title" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 15px;" />
          </div>
          <h3 class="card-title" style="margin-bottom: 10px; font-size: 18px; font-weight: 600;">{{ card.title }}</h3>
          <p class="card-text" style="margin-bottom: 15px; line-height: 1.5; opacity: 0.8;">{{ card.text }}</p>
          <span v-if="card.button && card.link" class="card-button" :style="{ display: 'inline-block', backgroundColor: '#007bff', color: '#ffffff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s ease' }">{{ card.button }}</span>
        </div>
      </div>
      
      <!-- Модалка с деталями карточки (логика пользователя, НЕ пакета) -->
      <div v-if="showModal" class="card-modal-overlay" @click="closeModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(4px);">
        <div class="card-modal-content" @click.stop style="background: white; border-radius: 12px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: modalSlideIn 0.3s ease;">
          <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 1.5rem;">{{ selectedCard?.title }}</h3>
            <button @click="closeModal" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">×</button>
          </div>
          <div class="modal-body" style="padding: 24px;">
            <img v-if="selectedCard?.image" :src="selectedCard.image" :alt="selectedCard.title" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
            <h4 style="margin: 0 0 12px 0; font-size: 1.25rem; color: #333;">{{ selectedCard?.title }}</h4>
            <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">{{ selectedCard?.text }}</p>
            <div style="text-align: center; margin-top: 24px;">
              <button v-if="selectedCard?.link" @click="openLink(selectedCard.link)" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 12px rgba(79,172,254,0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(79,172,254,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(79,172,254,0.3)'">
                {{ selectedCard?.button }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});


