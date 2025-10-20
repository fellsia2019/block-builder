const Vue = window.Vue;

export default Vue.defineComponent({
  name: 'CardListBlock',
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
    handleCardHover(event) {
      event.currentTarget.style.transform = 'translateY(-4px)';
      event.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    },
    handleCardLeave(event) {
      event.currentTarget.style.transform = 'translateY(0)';
      event.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    },
    handleCardClick(link) {
      console.log('Переход по ссылке:', link);
    }
  },
  template: `
    <div class="card-list-block">
      <h2 v-if="title" class="list-title">{{ title }}</h2>
      <div class="cards-container" :style="{ display: 'grid', gridTemplateColumns: 'repeat(' + columns + ', 1fr)', gap: gap + 'px', padding: '20px 0' }">
        <div v-for="(card, index) in cards" :key="index" class="card" :style="{ backgroundColor: cardBackground, color: cardTextColor, borderRadius: cardBorderRadius + 'px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s ease' }" @mouseenter="handleCardHover" @mouseleave="handleCardLeave">
          <div class="card-image" v-if="card.image">
            <img :src="card.image" :alt="card.title" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 15px;" />
          </div>
          <h3 class="card-title" style="margin-bottom: 10px; font-size: 18px; font-weight: 600;">{{ card.title }}</h3>
          <p class="card-text" style="margin-bottom: 15px; line-height: 1.5; opacity: 0.8;">{{ card.text }}</p>
          <a v-if="card.button && card.link" :href="card.link" class="card-button" :style="{ display: 'inline-block', backgroundColor: '#007bff', color: '#ffffff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s ease' }" @click="handleCardClick(card.link)">{{ card.button }}</a>
        </div>
      </div>
    </div>
  `
});


