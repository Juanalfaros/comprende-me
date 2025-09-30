// --- SCRIPT DE CAL.COM ---
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === "init") { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (namespace) { cal.ns[namespace] = api; C[namespace] = api; } else { C.Cal = api; } return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init");

// =================================================================
// --- DATOS CENTRALIZADOS DE LA APLICACIÓN ---
// =================================================================

const servicesData = [
  { "slug": "asesoria-psicologica-y-o-judicial-para-padres", "icon": "ph-scales", "title": "Asesoría Psicológica y/o Judicial para Padres", "description": "Sesión de orientación para padres que requieren apoyo en aspectos psicológicos o asesoría legal.", "tags": ["Padres", "Asesorías", "Judicial"], "price": "$30.000", "oldPrice": "$50.000", "duration": "45 min"},
  { "slug": "psicologia-infantil-y-adolescente", "icon": "ph-users-three", "title": "Psicología Infantil y Adolescente", "description": "Sesión de apoyo y desarrollo personal para niños y adolescentes.", "tags": ["Infantil", "Adolescente", "Psicología"], "price": "$25.000", "oldPrice": "$40.000", "duration": "45 min" },
  { "slug": "psicologia-para-adultos", "icon": "ph-user", "title": "Psicología para Adultos", "description": "Consulta especializada para adultos que enfrentan dificultades emocionales o buscan mejorar su bienestar.", "tags": ["Adultos", "Psicología", "Consultas"], "price": "$25.000", "oldPrice": "$40.000", "duration": "45 min" },
  { "slug": "fortalecimiento-de-habilidades-parentales", "icon": "ph-hand-heart", "title": "Fortalecimiento de Habilidades Parentales", "description": "Sesión enfocada en el desarrollo de habilidades para mejorar la relación y educación de los hijos.", "tags": ["Padres", "Habilidades", "Educación"], "price": "$30.000", "oldPrice": "$50.000", "duration": "45 min" },
  { "slug": "supervision-y-analisis-de-caso-para-psicologos", "icon": "ph-chalkboard-teacher", "title": "Supervisión y Análisis de Caso para Psicólogos", "description": "Sesión de supervisión de la práctica clínica y/o análisis de caso para enriquecer tu labor.", "tags": ["Psicólogos", "Supervisión", "Casos Clínicos"], "price": "$25.000", "oldPrice": "$40.000", "duration": "45 min" }
];

const blogData = [
    { "slug": "el-efecto-del-ejercicio", "title": "El Efecto del Ejercicio Físico en la Salud Mental", "image": "img/blogs/saludfisicaymental.webp", "alt": "Persona meditando", "duration": "5 min de lectura", "tags": ["Salud Mental", "Bienestar"], "excerpt": "El ejercicio es una poderosa herramienta para mejorar nuestro estado de ánimo y claridad mental.", "fullContentHTML": "<h2>El Efecto del Ejercicio Físico en la Salud Mental</h2><p>El ejercicio físico no solo tiene beneficios para el cuerpo, sino que también es esencial para la salud mental. Diversos estudios han demostrado que mantener una rutina de actividad física regular puede mejorar el estado de ánimo, reducir el estrés y prevenir problemas como la ansiedad y la depresión.</p>" },
    { "slug": "ciberacoso-y-salud-mental", "title": "Ciberacoso y Salud Mental: Cómo Protegerse", "image": "img/blogs/ciberacoso.webp", "alt": "Persona estresada", "duration": "4 min de lectura", "tags": ["Adolescentes", "Tecnología"], "excerpt": "El ciberacoso es una realidad creciente y sus efectos pueden ser profundos. Aprende a protegerte.", "fullContentHTML": "<h2>Ciberacoso y Salud Mental: Cómo Protegerse</h2><p>El ciberacoso es una realidad creciente en el mundo digital, y sus efectos pueden ser devastadores para la salud mental. A diferencia del acoso tradicional, el ciberacoso puede ocurrir en cualquier momento del día, es difícil de escapar, y a menudo se lleva a cabo de forma anónima, lo que lo convierte en una experiencia profundamente angustiante.</p>" },
    { "slug": "autocuidado-cotidiano", "title": "Autocuidado Cotidiano y Salud Mental", "image": "img/blogs/autocuidado.webp", "alt": "Mujer estirándose", "duration": "5 min de lectura", "tags": ["Autocuidado", "Estrés"], "excerpt": "¿Cuánto tiempo dedicamos a nuestro propio cuidado intencional? Descubre su importancia.", "fullContentHTML": "<h2>Autocuidado Cotidiano y Salud Mental</h2><p>En el día a día, solemos preocuparnos por cumplir con nuestras responsabilidades en el trabajo, los estudios, la familia y las relaciones personales, dejando en segundo plano algo esencial: nuestro propio bienestar. El autocuidado es una pieza clave para prevenir problemas de salud mental.</p>" },
    { "slug": "impacto-de-la-tecnologia", "title": "El Impacto de la Tecnología en la Salud Mental", "image": "img/blogs/blog-tecnologia.webp", "alt": "Niña usando una tablet", "duration": "5 min de lectura", "tags": ["Crianza", "Tecnología"], "excerpt": "La tecnología está en todas partes. Analizamos sus efectos y cómo mantener un equilibrio saludable.", "fullContentHTML": "<h2>El Impacto de la Tecnología en la Salud Mental</h2><p>Vivimos en un mundo donde la tecnología está presente en casi todos los aspectos de nuestra vida diaria. Aunque la tecnología nos ha brindado grandes beneficios, también ha generado preocupaciones sobre cómo está afectando nuestra salud mental, tanto en niños como en adultos.</p>" }
];

const faqData = [
    {"question": "¿Cómo es la primera sesión?", "answer": "La primera sesión es una conversación tranquila para conocernos. Exploraremos el motivo de tu consulta, tus expectativas y objetivos. Es también una oportunidad para que veas si te sientes a gusto con mi forma de trabajar. El objetivo es crear un plan inicial y asegurar que sientas que este es el espacio adecuado para ti o tu familia."},
    {"question": "Si la terapia es para mi hijo/a, ¿cuál es mi rol como padre/madre?", "answer": "Tu participación es fundamental. El proceso se diseña de forma colaborativa. Generalmente, incluye sesiones individuales con tu hijo/a, y también sesiones o contactos periódicos contigo para entregarte orientación, herramientas de crianza y trabajar en conjunto por el bienestar del niño o adolescente."},
    {"question": "¿Cómo funciona la terapia online?", "answer": "Todas las sesiones se realizan por videollamada a través de una plataforma segura como Google Meet o Zoom. Antes de tu cita, recibirás un enlace único para conectarte. Solo necesitas un dispositivo con conexión a internet y, muy importante, un espacio tranquilo y privado donde no tengas interrupciones."},
    {"question": "¿Valores y posibilidad de reembolso con Isapre/Seguro?", "answer": "Los valores están detallados en cada tipo de sesión al momento de agendar en la plataforma. Al finalizar la atención, se emite una <strong>boleta de honorarios</strong> que puedes presentar en tu <strong>Isapre o Seguro Complementario</strong> para solicitar el reembolso correspondiente según las condiciones de tu plan de salud."},
    {"question": "¿Qué duración y frecuencia tienen las sesiones?", "answer": "Cada sesión tiene una duración aproximada de 45-50 minutos. La frecuencia ideal (semanal, quincenal) se conversa y define en conjunto durante las primeras sesiones, adaptándose a tus necesidades y al proceso terapéutico."},
    {"question": "¿Es totalmente confidencial?", "answer": "Absolutamente. La confidencialidad es la base de la terapia y un deber ético. Todo lo conversado está protegido por el secreto profesional, regido por el Código de Ética del Psicólogo en Chile, al igual que en una consulta presencial."},
    {"question": "¿Qué pasa si tengo una emergencia?", "answer": "Es importante que sepas que la terapia online agendada no constituye un servicio de emergencia o crisis 24/7. En caso de una emergencia o crisis de salud mental, debes contactar a los servicios de urgencia locales o llamar a la línea de prevención del suicidio y ayuda del Minsal, <strong>*4141</strong>."}
];


// =================================================================
// --- LÓGICA PRINCIPAL DE LA APLICACIÓN ---
// =================================================================

/**
 * Función reutilizable para renderizar artículos del blog en un contenedor.
 * @param {string} selector - El selector CSS del contenedor donde se insertarán los artículos.
 * @param {number|null} maxItems - El número máximo de artículos a mostrar. Si es null, muestra todos.
 */
function renderBlogArticles(selector, maxItems = null) {
    const container = document.querySelector(selector);
    if (!container) return;

    const articlesToShow = maxItems ? blogData.slice(0, maxItems) : blogData;
    
    container.innerHTML = articlesToShow.map(post => {
        const tagsHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        return `
            <a href="articulo.html?slug=${post.slug}" class="card blog-card">
                <img src="${post.image}" alt="${post.alt}">
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span>${post.duration}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="tags">${tagsHTML}</div>
                </div>
            </a>
        `;
    }).join('');
}


document.addEventListener('DOMContentLoaded', function() {
    
    // --- Menú móvil ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    // --- Cargar servicios dinámicamente ---
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid) {
        servicesData.forEach(service => {
            const oldPriceHTML = service.oldPrice ? `<span class="old-price">${service.oldPrice}</span>` : '';
            servicesGrid.innerHTML += `
                <div class="card service-card">
                    <div class="card-content">
                        <div class="icon-badge">
                            <i class="ph ${service.icon} icon"></i>
                            <p><i class="ph ph-clock"></i> ${service.duration}</p>
                        </div>
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                        <div class="tags">
                            ${service.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div>
                        <p class="price">${service.price} ${oldPriceHTML}</p>
                        <button data-cal-link="natalia-beiza/${service.slug}" class="btn btn-secondary">
                            Reserva Ahora
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    // --- Cargar blog dinámicamente usando la nueva función ---
    renderBlogArticles('#blog-grid', 4); // Para la página de inicio (index.html)
    renderBlogArticles('#blog-grid-full'); // Para la página de blog (blog.html)

    // --- Cargar FAQ dinámicamente ---
    const faqAccordion = document.getElementById('faq-accordion');
    if (faqAccordion) {
        faqData.forEach(item => {
            faqAccordion.innerHTML += `
                <div class="faq-item">
                    <button class="faq-question" aria-expanded="false">
                        <span>${item.question}</span>
                        <i class="ph ph-plus faq-icon"></i>
                    </button>
                    <div class="faq-answer hidden">
                        <p>${item.answer}</p>
                    </div>
                </div>
            `;
        });
    }

    // --- Lógica del acordeón de FAQ ---
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            button.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('hidden');
        });
    });
});