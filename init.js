const search = document.getElementById('search');
const btn = document.getElementById('search-button');
const url = 'https://images-api.nasa.gov/search';
const swiperImgWrapper = document.querySelector('#swiperImg .swiper-wrapper'); // Contenedor del carrusel de imágenes
const swiperVidWrapper = document.querySelector('#swiperVid .swiper-wrapper'); // Contenedor del carrusel de videos
const modalContent = document.getElementById('modalContent');
const modalTitle = document.getElementById('exampleModalLabel');
const verTodo = document.querySelector('.vertodo');

// Configuración de Swiper para imágenes
const swiperImages = new Swiper('#swiperImg', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1.1,
    spaceBetween: 20,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});

// Configuración de Swiper para videos
const swiperVideos = new Swiper('#swiperVid', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1.1,
    spaceBetween: 20,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});

// Función para imprimir imágenes en el carrusel
function imprimirImagenes(array) {
    swiperImgWrapper.innerHTML = ''; // Limpiar carrusel anterior
    array.forEach((item, index) => {
        const imageUrl = item.links?.[0]?.href;
        if (imageUrl) {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.innerHTML = `
                <a href="#" class="img-link" data-index="${index}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img src="${imageUrl}" alt="NASA Image" class="img-fluid">
                </a>
            `;
            swiperImgWrapper.appendChild(slide);
        }
    });

    swiperImages.update(); // Actualizar Swiper

    document.querySelectorAll('.img-link').forEach(link => {
        link.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            mostrarDetalle(array[index]);
        });
    });
}

// Función para imprimir videos en el carrusel
function imprimirVideos(array) {
    swiperVidWrapper.innerHTML = ''; // Limpiar carrusel anterior

    // Iterar sobre los videos y obtener sus URLs reales
    array.forEach(item => {
        const videoManifestUrl = item.href; // URL del manifiesto de video
        const thumbnailUrl = item.links?.[0]?.href;
        if (videoManifestUrl) {
            // Realizar una solicitud para obtener los videos disponibles
            fetch(videoManifestUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener el manifiesto de video');
                    }
                    return response.json();
                })
                .then(videoFiles => {
                    // Usar el primer archivo MP4 disponible
                    const videoUrl = videoFiles.find(file => file.endsWith('.mp4'));
                    if (videoUrl) {
                        const slide = document.createElement('div');
                        slide.classList.add('swiper-slide');
                        slide.innerHTML = `
                            <video controls class="w-100" poster="${thumbnailUrl || ''}">
                                <source src="${videoUrl}" type="video/mp4">
                                Tu navegador no soporta reproducción de video.
                            </video>
                        `;
                        swiperVidWrapper.appendChild(slide);
                        swiperVideos.update(); // Actualizar Swiper
                    }
                })
                .catch(error => console.error('Error al procesar el manifiesto de video:', error));
        }
    });
}

// Mostrar detalles en el modal
function mostrarDetalle(item) {
    const imageUrl = item.links?.[0]?.href;
    const title = item.data?.[0]?.title || 'Sin título';
    const description = item.data?.[0]?.description || 'Sin descripción.';
    modalTitle.textContent = title;
    modalContent.innerHTML = `
        <img src="${imageUrl}" alt="NASA Image" class="img-fluid">
        <p class="mt-3">${description}</p>
    `;
}

// Función para obtener datos de la API
function obtenerContenido(query, tipo, callback) {
    const searchUrl = `${url}?q=${query}&media_type=${tipo}`;
    fetch(searchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos de la API');
            }
            return response.json();
        })
        .then(data => {
            const items = data.collection.items || [];
            callback(items);
        })
        .catch(error => {
            console.error(error);
        });
}

// Inicializar contenido al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerContenido('sun', 'image', imprimirImagenes);
    obtenerContenido('sun', 'video', imprimirVideos);
});

// Buscar contenido al presionar el botón
btn.addEventListener('click', () => {
    const query = search.value.trim();
    if (query) {
        obtenerContenido(query, 'image', imprimirImagenes);
        obtenerContenido(query, 'video', imprimirVideos);
        swiperImgWrapper.scrollIntoView({ behavior: 'smooth' });
    }
});

// Almacenar búsqueda en localStorage para la sección "Ver Todo"
verTodo.addEventListener('click', () => {
    const query = search.value.trim();
    localStorage.setItem('content', query || 'sun');
});
