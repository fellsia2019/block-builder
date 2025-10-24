/**
 * Конфигурация блоков для чистого JS
 * Демонстрирует использование BlockBuilder без фреймворков
 * ✅ Современный ES модули с Vite
 * ✅ Настоящий Swiper из npm
 */

import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export const blockConfigs = {
  spacedText: {
    title: 'Текст с отступами',
    icon: '📐',
    description: 'Текстовый блок с управлением отступами',
    render: {
      kind: 'html',
      template: (props) => {
        // Используем CSS переменные для padding (они автоматически устанавливаются на .block-builder-block)
        // margin применяется автоматически к .block-builder-block
        return `
          <div class="spaced-text-block" style="
            padding-top: var(--spacing-padding-top, 0px);
            padding-bottom: var(--spacing-padding-bottom, 0px);
            text-align: ${props.textAlign}; 
            font-size: ${props.fontSize}px; 
            color: ${props.color};
            background: ${props.backgroundColor};
            border-radius: 8px;
            transition: all 0.3s ease;
          " >
            ${props.content}
          </div>
        `
      }
    },
    fields: [
      {
        field: 'content',
        label: 'Текст',
        type: 'textarea',
        placeholder: 'Введите текст...',
        rules: [
          { type: 'required', message: 'Текст обязателен' }
        ],
        defaultValue: 'Текст с управляемыми отступами'
      },
      {
        field: 'fontSize',
        label: 'Размер шрифта',
        type: 'number',
        rules: [
          { type: 'min', value: 12, message: 'Минимум: 12px' },
          { type: 'max', value: 48, message: 'Максимум: 48px' }
        ],
        defaultValue: 18
      },
      {
        field: 'color',
        label: 'Цвет текста',
        type: 'color',
        defaultValue: '#333333'
      },
      {
        field: 'backgroundColor',
        label: 'Цвет фона',
        type: 'color',
        defaultValue: '#f8f9fa'
      },
      {
        field: 'textAlign',
        label: 'Выравнивание',
        type: 'select',
        options: [
          { value: 'left', label: 'По левому краю' },
          { value: 'center', label: 'По центру' },
          { value: 'right', label: 'По правому краю' }
        ],
        defaultValue: 'center'
      }
    ],
    // 🧪 Кастомные брекпоинты для тестирования (так же как во Vue примере)
    spacingOptions: {
      config: {
        min: 0,
        max: 120,
        step: 8,
        // Кастомные брекпоинты (когда указаны, заменяют дефолтные)
        breakpoints: [
          { name: 'xlarge', label: 'XL (Desktop)', maxWidth: undefined }, // Desktop без ограничения
          { name: 'large', label: 'L (Laptop)', maxWidth: 1440 },
          { name: 'medium', label: 'M (Tablet)', maxWidth: 1024 },
          { name: 'small', label: 'S (Mobile)', maxWidth: 640 }
        ]
      }
    }
  },

  text: {
    title: 'Текстовый блок',
    icon: '📝',
    description: 'Добавьте текстовый контент',
    render: {
      kind: 'html',
      template: (props) => `
        <div class="text-block" style="
          text-align: ${props.textAlign}; 
          font-size: ${props.fontSize}px; 
          color: ${props.color};
          padding: 10px;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          background: #f8f9fa;
          transition: all 0.2s ease;
        " onmouseover="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
          ${props.content}
        </div>
      `
    },
    fields: [
      {
        field: 'content',
        label: 'Текст',
        type: 'textarea',
        placeholder: 'Введите ваш текст...',
        rules: [
          { type: 'required', message: 'Текст обязателен' },
          { type: 'minLength', value: 1, message: 'Текст не может быть пустым' }
        ],
        defaultValue: 'Пример текста'
      },
      {
        field: 'fontSize',
        label: 'Размер шрифта',
        type: 'number',
        rules: [
          { type: 'required', message: 'Размер шрифта обязателен' },
          { type: 'min', value: 8, message: 'Минимальный размер: 8px' },
          { type: 'max', value: 72, message: 'Максимальный размер: 72px' }
        ],
        defaultValue: 16
      },
      {
        field: 'color',
        label: 'Цвет текста',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет обязателен' }],
        defaultValue: '#333333'
      },
      {
        field: 'textAlign',
        label: 'Выравнивание',
        type: 'select',
        options: [
          { value: 'left', label: 'По левому краю' },
          { value: 'center', label: 'По центру' },
          { value: 'right', label: 'По правому краю' }
        ],
        rules: [{ type: 'required', message: 'Выравнивание обязательно' }],
        defaultValue: 'left'
      }
    ]
  },

  image: {
    title: 'Изображение',
    icon: '🖼️',
    description: 'Добавьте изображение',
    render: {
      kind: 'html',
      template: (props) => `
        <div class="image-block" style="text-align: center; margin: 20px 0;">
          <img 
            src="${props.src}" 
            alt="${props.alt}" 
            style="
              border-radius: ${props.borderRadius}px;
              max-width: 100%;
              height: auto;
              object-fit: cover;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              transition: transform 0.3s ease;
            "
            onmouseover="this.style.transform='scale(1.02)'"
            onmouseout="this.style.transform='scale(1)'"
          />
        </div>
      `
    },
    fields: [
      {
        field: 'src',
        label: 'URL изображения',
        type: 'text',
        placeholder: 'https://example.com/image.jpg',
        rules: [
          { type: 'required', message: 'URL обязателен' }
        ],
        defaultValue: '/1.jpeg'
      },
      {
        field: 'alt',
        label: 'Описание',
        type: 'text',
        placeholder: 'Описание изображения',
        defaultValue: 'Изображение'
      },
      {
        field: 'borderRadius',
        label: 'Скругление углов',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 50, message: 'Максимум: 50' }
        ],
        defaultValue: 8
      }
    ]
  },

  button: {
    title: 'Кнопка',
    icon: '🔘',
    description: 'Интерактивная кнопка',
    render: {
      kind: 'html',
      template: (props) => `
        <div class="button-block" style="text-align: center; margin: 20px 0;">
          <button 
            class="custom-button"
            style="
              background-color: ${props.backgroundColor};
              color: ${props.color};
              border-radius: ${props.borderRadius}px;
              padding: ${props.padding};
              border: none;
              cursor: pointer;
              font-size: 16px;
              font-weight: 500;
              transition: all 0.2s ease;
            "
            onclick="console.log('Кнопка нажата: ${props.text.replace(/'/g, "\\'")}'); this.textContent='Загрузка...'; setTimeout(() => this.textContent='${props.text.replace(/'/g, "\\'")}', 1000)"
            onmouseover="this.style.transform='scale(1.05)'; this.style.filter='brightness(1.1)'"
            onmouseout="this.style.transform='scale(1)'; this.style.filter='brightness(1)'"
          >
            ${props.text}
          </button>
        </div>
      `
    },
    fields: [
      {
        field: 'text',
        label: 'Текст кнопки',
        type: 'text',
        placeholder: 'Нажми меня',
        rules: [
          { type: 'required', message: 'Текст кнопки обязателен' },
          { type: 'minLength', value: 1, message: 'Текст не может быть пустым' }
        ],
        defaultValue: 'Нажми меня'
      },
      {
        field: 'backgroundColor',
        label: 'Цвет фона',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет обязателен' }],
        defaultValue: '#007bff'
      },
      {
        field: 'color',
        label: 'Цвет текста',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет текста обязателен' }],
        defaultValue: '#ffffff'
      },
      {
        field: 'borderRadius',
        label: 'Скругление',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 50, message: 'Максимум: 50' }
        ],
        defaultValue: 4
      },
      {
        field: 'padding',
        label: 'Отступы',
        type: 'text',
        placeholder: '8px 16px',
        rules: [{ type: 'required', message: 'Отступы обязательны' }],
        defaultValue: '8px 16px'
      }
    ]
  },

  gallerySlider: {
    title: 'Слайдер галереи',
    icon: '🎠',
    description: '✅ НАСТОЯЩИЙ Swiper из npm! (только с Vite сборкой)',
    render: {
      kind: 'custom',
      // Функция рендеринга с императивным Swiper
      mount: (container, props) => {
        // Генерируем уникальный ID для слайдера
        const sliderId = `swiper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        // Фильтруем слайды
        const slides = [
          { url: props.image1_url, title: props.image1_title, description: props.image1_description },
          { url: props.image2_url, title: props.image2_title, description: props.image2_description },
          { url: props.image3_url, title: props.image3_title, description: props.image3_description },
          { url: props.image4_url, title: props.image4_title, description: props.image4_description }
        ].filter(slide => slide.url && slide.title)

        // Преобразуем значения
        const autoplayValue = typeof props.autoplay === 'string' 
          ? (props.autoplay === 'on' || props.autoplay === 'true') 
          : props.autoplay
        const autoplayDelay = typeof props.autoplayDelay === 'string' 
          ? parseInt(props.autoplayDelay, 10) 
          : props.autoplayDelay
        const loopValue = typeof props.loop === 'string' 
          ? (props.loop === 'on' || props.loop === 'true') 
          : props.loop
        const spaceBetween = typeof props.spaceBetween === 'string' 
          ? parseInt(props.spaceBetween, 10) 
          : props.spaceBetween

        // Создаем HTML
        container.innerHTML = `
          <div class="gallery-slider-block" style="padding: 20px; background: #f8f9fa; border-radius: 8px;">
            ${props.title ? `<h2 style="text-align: center; margin-bottom: 30px; font-size: 28px; font-weight: 700; color: #333;">${props.title}</h2>` : ''}
            
            <div class="swiper" id="${sliderId}" style="width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div class="swiper-wrapper">
                ${slides.map(slide => `
                  <div class="swiper-slide">
                    <div style="position: relative; background: white;">
                      <img src="${slide.url}" alt="${slide.title}" style="width: 100%; height: 400px; object-fit: cover; display: block;" />
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 30px 20px 20px; color: white;">
                        <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">${slide.title}</h3>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">${slide.description}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
              <div class="swiper-pagination"></div>
            </div>
          </div>
        `

        // Инициализируем Swiper после рендера
        setTimeout(() => {
          const swiperEl = container.querySelector(`#${sliderId}`)
          if (swiperEl) {
            new Swiper(swiperEl, {
              modules: [Navigation, Pagination, Autoplay],
              slidesPerView: 2,
              spaceBetween: spaceBetween,
              loop: loopValue,
              autoplay: autoplayValue ? {
                delay: autoplayDelay,
                disableOnInteraction: false
              } : false,
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
              },
              grabCursor: true
            })
          }
        }, 0)
      }
    },
    fields: [
      {
        field: 'title',
        label: 'Заголовок галереи',
        type: 'text',
        placeholder: 'Галерея изображений',
        defaultValue: 'Галерея изображений'
      },
      // Изображение 1
      {
        field: 'image1_url',
        label: 'Изображение 1 - URL',
        type: 'text',
        rules: [{ type: 'required', message: 'URL обязателен' }],
        defaultValue: '/qw.jpg'
      },
      {
        field: 'image1_title',
        label: 'Изображение 1 - Заголовок',
        type: 'text',
        rules: [{ type: 'required', message: 'Заголовок обязателен' }],
        defaultValue: 'Природа'
      },
      {
        field: 'image1_description',
        label: 'Изображение 1 - Описание',
        type: 'textarea',
        defaultValue: 'Красивый пейзаж природы'
      },
      // Изображение 2
      {
        field: 'image2_url',
        label: 'Изображение 2 - URL',
        type: 'text',
        defaultValue: '/Edvard_Grieg.jpg'
      },
      {
        field: 'image2_title',
        label: 'Изображение 2 - Заголовок',
        type: 'text',
        defaultValue: 'Эдвард Григ'
      },
      {
        field: 'image2_description',
        label: 'Изображение 2 - Описание',
        type: 'textarea',
        defaultValue: 'Знаменитый норвежский композитор'
      },
      // Изображение 3
      {
        field: 'image3_url',
        label: 'Изображение 3 - URL',
        type: 'text',
        defaultValue: '/bear.jpg'
      },
      {
        field: 'image3_title',
        label: 'Изображение 3 - Заголовок',
        type: 'text',
        defaultValue: 'Медведь'
      },
      {
        field: 'image3_description',
        label: 'Изображение 3 - Описание',
        type: 'textarea',
        defaultValue: 'Дикая природа'
      },
      // Изображение 4
      {
        field: 'image4_url',
        label: 'Изображение 4 - URL',
        type: 'text',
        defaultValue: '/spanch.jpg'
      },
      {
        field: 'image4_title',
        label: 'Изображение 4 - Заголовок',
        type: 'text',
        defaultValue: 'Губка Боб'
      },
      {
        field: 'image4_description',
        label: 'Изображение 4 - Описание',
        type: 'textarea',
        defaultValue: 'Популярный мультипликационный персонаж'
      },
      // Настройки слайдера
      {
        field: 'autoplay',
        label: 'Автопрокрутка',
        type: 'checkbox',
        defaultValue: true
      },
      {
        field: 'autoplayDelay',
        label: 'Задержка (мс)',
        type: 'number',
        rules: [
          { type: 'min', value: 1000, message: 'Минимум: 1000мс' },
          { type: 'max', value: 10000, message: 'Максимум: 10000мс' }
        ],
        defaultValue: 3000
      },
      {
        field: 'loop',
        label: 'Зациклить',
        type: 'checkbox',
        defaultValue: true
      },
      {
        field: 'spaceBetween',
        label: 'Расстояние между слайдами',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 100, message: 'Максимум: 100' }
        ],
        defaultValue: 30
      }
    ]
  }
}

