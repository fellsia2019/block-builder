/**
 * GallerySliderBlock - Пример сложного компонента со Swiper слайдером
 * Это код ПОЛЬЗОВАТЕЛЯ, демонстрирующий работу пакета со сложными компонентами
 * 
 * ВАЖНО: Использует императивный подход Swiper (new Swiper)
 * так как Vue компоненты требуют одного экземпляра Vue, а у нас их два (global + esm)
 */

const Vue = window.Vue;

export default Vue.defineComponent({
  name: 'GallerySliderBlock',
  props: {
    title: { type: String, default: 'Галерея изображений' },
    image1_url: { type: String, default: '../static-files/img/fwfw.jpg' },
    image1_title: { type: String, default: 'Изображение 1' },
    image1_description: { type: String, default: 'Описание первого изображения' },
    image2_url: { type: String, default: '../static-files/img/spanch.jpg' },
    image2_title: { type: String, default: 'Изображение 2' },
    image2_description: { type: String, default: 'Описание второго изображения' },
    image3_url: { type: String, default: '../static-files/img/мэдвэд.jpg' },
    image3_title: { type: String, default: 'Изображение 3' },
    image3_description: { type: String, default: 'Описание третьего изображения' },
    image4_url: { type: String, default: '../static-files/img/Квантовое_4D-кодирование_картинка.jpg' },
    image4_title: { type: String, default: 'Изображение 4' },
    image4_description: { type: String, default: 'Описание четвёртого изображения' },
    // Props приходят как строки из формы, нужно преобразование
    autoplay: { type: [Boolean, String], default: true },
    autoplayDelay: { type: [Number, String], default: 3000 },
    loop: { type: [Boolean, String], default: true },
    spaceBetween: { type: [Number, String], default: 30 }
  },
  data() {
    return {
      swiper: null,
      swiperLoaded: false
    };
  },
  computed: {
    slides() {
      return [
        { url: this.image1_url, title: this.image1_title, description: this.image1_description },
        { url: this.image2_url, title: this.image2_title, description: this.image2_description },
        { url: this.image3_url, title: this.image3_title, description: this.image3_description },
        { url: this.image4_url, title: this.image4_title, description: this.image4_description }
      ].filter(slide => slide.url && slide.title);
    },
    // Преобразование props из строк
    autoplayValue() {
      if (typeof this.autoplay === 'string') {
        return this.autoplay === 'on' || this.autoplay === 'true';
      }
      return this.autoplay;
    },
    autoplayDelayValue() {
      return typeof this.autoplayDelay === 'string' ? parseInt(this.autoplayDelay, 10) : this.autoplayDelay;
    },
    loopValue() {
      if (typeof this.loop === 'string') {
        return this.loop === 'on' || this.loop === 'true';
      }
      return this.loop;
    },
    spaceBetweenValue() {
      return typeof this.spaceBetween === 'string' ? parseInt(this.spaceBetween, 10) : this.spaceBetween;
    }
  },
  mounted() {
    this.loadSwiper();
  },
  beforeUnmount() {
    // Уничтожаем Swiper при удалении компонента
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
  },
  methods: {
    loadSwiper() {
      // Проверяем, загружен ли Swiper
      if (typeof window.Swiper !== 'undefined') {
        this.initSwiper();
        return;
      }

      // Загружаем CSS
      if (!document.querySelector('link[href*="swiper-bundle"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        document.head.appendChild(link);
      }

      // Загружаем JS
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
      script.onload = () => {
        this.swiperLoaded = true;
        this.$nextTick(() => {
          this.initSwiper();
        });
      };
      document.head.appendChild(script);
    },
    initSwiper() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.swiper');
        if (container && window.Swiper) {
          this.swiper = new window.Swiper(container, {
            slidesPerView: 2,
            spaceBetween: this.spaceBetweenValue,
            loop: this.loopValue,
            autoplay: this.autoplayValue ? {
              delay: this.autoplayDelayValue,
              disableOnInteraction: false,
            } : false,
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
              dynamicBullets: true,
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            effect: 'slide',
            grabCursor: true,
          });
        }
      });
    }
  },
  template: `
    <div class="gallery-slider-block" style="padding: 20px; background: #f8f9fa; border-radius: 8px;">
      <h2 v-if="title" style="text-align: center; margin-bottom: 30px; font-size: 28px; font-weight: 700; color: #333;">
        {{ title }}
      </h2>
      
      <div class="swiper" style="width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div class="swiper-wrapper">
          <div v-for="(slide, index) in slides" :key="index" class="swiper-slide">
            <div style="position: relative; background: white;">
              <img :src="slide.url" :alt="slide.title" style="width: 100%; height: 400px; object-fit: cover; display: block;" />
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 30px 20px 20px; color: white;">
                <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">{{ slide.title }}</h3>
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">{{ slide.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation -->
        <div class="swiper-button-next" style="color: white;"></div>
        <div class="swiper-button-prev" style="color: white;"></div>
        
        <!-- Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      
      <div v-if="!swiperLoaded && !swiper" style="text-align: center; padding: 40px; color: #666;">
        Загрузка слайдера...
      </div>
    </div>
  `
});
