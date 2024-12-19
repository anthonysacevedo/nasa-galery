const search = document.getElementById('search');
const btn = document.getElementById('search-button');
const url = 'https://images-api.nasa.gov/search';
const swiperWrapper = document.querySelector('.swiper-wrapper'); // Accede al contenedor del carrusel
const modalContent = document.getElementById('modalContent');
const modalTitle = document.getElementById('exampleModalLabel');

// Inicializamos Swiper
const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: false,
    effect: 'zoom',
    slidesPerView: 1.1,
    spaceBetween: 20,
    centeredSildes: true,
    grabCursor: true,

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Scrollbar (opcional)
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});

// Función para imprimir imágenes en el carrusel
function imprimirContenido(array) {
    const fragment = document.createDocumentFragment();

    for (let i = 6; i < array.length; i++) {
        let item = array[i];
        let imageUrl = item.links?.[0]?.href;
    
        if (imageUrl) {
            // Crear el enlace <a>
            const a = document.createElement('a');
            a.classList.add('img-link');
            a.setAttribute('href', '#');
            a.setAttribute('data-index', `${i}`);
            a.setAttribute('data-bs-toggle', 'modal');
            a.setAttribute('data-bs-target', '#exampleModal');
    
            // Crear el contenedor <div> con la clase swiper-slide
            const colDiv = document.createElement('div');
            colDiv.classList.add('swiper-slide');
    
            // Crear la imagen <img>
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'NASA Image';
    
            // Añadir la imagen al <div>
            colDiv.appendChild(a);
    
            // Añadir el <div> al enlace <a>
            a.appendChild(img);
    
            // Añadir el enlace <a> al fragmento
            fragment.appendChild(colDiv);
        }
    }
    
    // Añadir todo el fragmento al contenedor del carrusel
    swiperWrapper.appendChild(fragment);
    
    // Actualizamos Swiper para que detecte las nuevas diapositivas
    swiper.update();

    const imgLinks = document.querySelectorAll('.img-link');
    imgLinks.forEach(link => {
        link.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            recorrerJson(array, index);
        });
    });
}


function recorrerJson(array, index) {
    const item = array[index];
    const imageUrl = item.links?.[0]?.href;
    const title = item.data?.[0]?.title;
    const description = item.data?.[0]?.description || 'No description available.';

    // Mostrar contenido en el modal
    modalTitle.textContent = title;
    modalContent.innerHTML = `
        <div>
            <img src="${imageUrl}" alt="NASA image" class="img-fluid">
            <p class="mt-3">${description}</p>
        </div>`;
}

// Función para obtener datos de la API de NASA
function mostrarContenido(funcion, imagen) {
    const searchInUrl = `${url}?q=${imagen}`;

    fetch(searchInUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const elements = data.collection.items || [];
            funcion(elements);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

// Ejecutamos el código cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    mostrarContenido(imprimirContenido, 'sun');
});

// Evento para el botón de búsqueda - imprime las imagenes en el carousel segun lo que busque el usuario
btn.addEventListener('click', function () {
    const request = search.value;
    swiperWrapper.innerHTML = '';
    mostrarContenido(imprimirContenido, request);
    swiperWrapper.scrollIntoView({ behavior: 'smooth' });

        
});
