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
        
        // ✅ НОВЫЙ подход: используем массив slides из props
        const slides = (props.slides || []).filter(slide => slide.url && slide.title)

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
      // ✅ НОВЫЙ подход: массив слайдов через repeater
      {
        field: 'slides',
        label: 'Слайды',
        type: 'repeater',
        rules: [
          { type: 'required', message: 'Необходим хотя бы один слайд' }
        ],
        defaultValue: [
          {
            url: '/qw.jpg',
            title: 'Природа',
            description: 'Красивый пейзаж природы'
          },
          {
            url: '/Edvard_Grieg.jpg',
            title: 'Эдвард Григ',
            description: 'Знаменитый норвежский композитор'
          },
          {
            url: '/bear.jpg',
            title: 'Медведь',
            description: 'Дикая природа'
          },
          {
            url: '/spanch.jpg',
            title: 'Губка Боб',
            description: 'Популярный мультипликационный персонаж'
          }
        ],
        repeaterConfig: {
          itemTitle: 'Слайд',
          addButtonText: 'Добавить слайд',
          removeButtonText: 'Удалить',
          min: 3, // ✅ РАБОТАЕТ! т.к. есть required в rules (минимум 3 слайда)
          max: 20,
          collapsible: true,
          fields: [
            {
              field: 'url',
              label: 'URL изображения',
              type: 'text',
              placeholder: '/путь/к/изображению.jpg',
              rules: [{ type: 'required', message: 'URL обязателен' }],
              defaultValue: ''
            },
            {
              field: 'title',
              label: 'Заголовок',
              type: 'text',
              placeholder: 'Заголовок слайда',
              rules: [{ type: 'required', message: 'Заголовок обязателен' }],
              defaultValue: ''
            },
            {
              field: 'description',
              label: 'Описание',
              type: 'textarea',
              placeholder: 'Описание слайда',
              rules: [],
              defaultValue: ''
            }
          ]
        }
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
  },

  cardList: {
    title: 'Список карточек',
    icon: '🃏',
    description: 'Сетка из карточек с изображениями и описаниями',
    render: {
      kind: 'custom',
      mount: (container, props) => {
        const cards = (props.cards || []).filter(card => card.title && card.text);
        
        container.innerHTML = `
          <div class="card-list-block" style="padding: 40px 20px; background: #f8f9fa;">
            ${props.title ? `<h2 style="text-align: center; margin-bottom: 40px; font-size: 32px; font-weight: 700; color: #333;">${props.title}</h2>` : ''}
            
            <div class="cards-grid" style="
              display: grid;
              grid-template-columns: repeat(${props.columns || 3}, 1fr);
              gap: ${props.gap || 16}px;
              max-width: 1200px;
              margin: 0 auto;
            ">
              ${cards.map(card => `
                <div class="card" style="
                  background: ${props.cardBackground || '#ffffff'};
                  border-radius: ${props.cardBorderRadius || 8}px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  transition: all 0.3s ease;
                  cursor: pointer;
                  display: flex;
                  flex-direction: column;
                ">
                  ${card.image ? `
                    <div style="
                      width: 100%;
                      height: 200px;
                      overflow: hidden;
                      background: #e9ecef;
                    ">
                      <img 
                        src="${card.image}" 
                        alt="${card.title}"
                        style="width: 100%; height: 100%; object-fit: cover; display: block;"
                      />
                    </div>
                  ` : ''}
                  
                  <div style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                    <h3 style="
                      margin: 0 0 12px 0;
                      font-size: 20px;
                      font-weight: 600;
                      color: ${props.cardTextColor || '#333333'};
                    ">${card.title}</h3>
                    
                    <p style="
                      margin: 0 0 20px 0;
                      font-size: 14px;
                      line-height: 1.6;
                      color: ${props.cardTextColor || '#333333'};
                      opacity: 0.8;
                      flex: 1;
                    ">${card.text}</p>
                    
                    ${card.button && card.link ? `
                      <a 
                        href="${card.link}" 
                        style="
                          display: inline-block;
                          padding: 10px 20px;
                          background: #007bff;
                          color: white;
                          text-decoration: none;
                          border-radius: 4px;
                          font-size: 14px;
                          font-weight: 500;
                          transition: background 0.2s ease;
                          text-align: center;
                        "
                        onmouseover="this.style.background='#0056b3'"
                        onmouseout="this.style.background='#007bff'"
                      >${card.button}</a>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

        // Добавляем hover эффект для карточек
        const cardElements = container.querySelectorAll('.card');
        cardElements.forEach(card => {
          card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
          });
          card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          });
        });
      }
    },
    fields: [
      {
        field: 'title',
        label: 'Заголовок секции',
        type: 'text',
        placeholder: 'Наши услуги',
        rules: [],
        defaultValue: 'Наши услуги'
      },
      // ✅ Массив карточек через repeater
      {
        field: 'cards',
        label: 'Карточки',
        type: 'repeater',
        defaultValue: [
          {
            title: 'Веб-разработка',
            text: 'Создание современных веб-приложений',
            button: 'Подробнее',
            link: 'https://example.com',
            image: '/2.jpg'
          },
          {
            title: 'Мобильные приложения',
            text: 'Разработка мобильных приложений для iOS и Android',
            button: 'Узнать больше',
            link: 'https://example.com',
            image: '/spanch.jpg'
          },
          {
            title: 'Дизайн',
            text: 'Создание уникального дизайна для вашего бренда',
            button: 'Посмотреть работы',
            link: 'https://example.com',
            image: '/bear.jpg'
          }
        ],
        repeaterConfig: {
          itemTitle: 'Карточка',
          addButtonText: 'Добавить карточку',
          removeButtonText: 'Удалить',
          min: 1, // ⚠️ ИГНОРИРУЕТСЯ! т.к. нет required в rules (можно удалить все)
          max: 12,
          collapsible: true,
          fields: [
            {
              field: 'title',
              label: 'Заголовок',
              type: 'text',
              placeholder: 'Заголовок карточки',
              rules: [{ type: 'required', message: 'Заголовок обязателен' }],
              defaultValue: ''
            },
            {
              field: 'text',
              label: 'Описание',
              type: 'textarea',
              placeholder: 'Описание карточки',
              rules: [{ type: 'required', message: 'Описание обязательно' }],
              defaultValue: ''
            },
            {
              field: 'image',
              label: 'Изображение (URL)',
              type: 'text',
              placeholder: '/путь/к/изображению.jpg',
              rules: [],
              defaultValue: '/2.jpg'
            },
            {
              field: 'button',
              label: 'Текст кнопки',
              type: 'text',
              placeholder: 'Подробнее',
              rules: [],
              defaultValue: 'Подробнее'
            },
            {
              field: 'link',
              label: 'Ссылка',
              type: 'text',
              placeholder: 'https://example.com',
              rules: [],
              defaultValue: 'https://example.com'
            }
          ]
        }
      },
      // Настройки отображения
      {
        field: 'cardBackground',
        label: 'Цвет фона карточек',
        type: 'color',
        rules: [],
        defaultValue: '#ffffff'
      },
      {
        field: 'cardTextColor',
        label: 'Цвет текста карточек',
        type: 'color',
        rules: [],
        defaultValue: '#333333'
      },
      {
        field: 'cardBorderRadius',
        label: 'Скругление карточек',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 50, message: 'Максимум: 50' }
        ],
        defaultValue: 8
      },
      {
        field: 'columns',
        label: 'Количество колонок',
        type: 'select',
        options: [
          { value: 1, label: '1 колонка' },
          { value: 2, label: '2 колонки' },
          { value: 3, label: '3 колонки' },
          { value: 4, label: '4 колонки' }
        ],
        rules: [],
        defaultValue: 3
      },
      {
        field: 'gap',
        label: 'Отступ между карточками',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 50, message: 'Максимум: 50' }
        ],
        defaultValue: 16
      }
    ]
  }
}

