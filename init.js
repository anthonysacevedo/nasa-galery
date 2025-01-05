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

    array.forEach(item => {
        const videoManifestUrl = item.href; // URL del manifiesto de video
        const thumbnailUrl = item.links?.[0]?.href;

        if (videoManifestUrl) {
            // Crear la slide con una imagen de marcador de posición
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.setAttribute('data-video-manifest', videoManifestUrl); // Guardar la URL del manifiesto
            slide.innerHTML = `
                <div class="video-container">
                    <img src="${thumbnailUrl || ''}" alt="Cargando..." class="w-100 video-placeholder" />
                </div>
            `;
            swiperVidWrapper.appendChild(slide);
        }
    });

    // Inicializar o actualizar Swiper
    swiperVideos.update();

    // Agregar el evento de clic a cada slide para cargar y reproducir el video
    swiperVidWrapper.addEventListener('click', (event) => {
        const slide = event.target.closest('.swiper-slide');
        if (!slide) return; // Salir si no se hizo clic en una slide

        const videoManifestUrl = slide.getAttribute('data-video-manifest');
        const videoContainer = slide.querySelector('.video-container');

        if (videoManifestUrl && !videoContainer.querySelector('video')) {
            // Obtener la URL del video desde el manifiesto
            fetch(videoManifestUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener el manifiesto de video');
                    }
                    return response.json();
                })
                .then(videoFiles => {
                    const videoUrl = videoFiles.find(file => file.endsWith('.mp4'));
                    if (videoUrl) {
                        // Reemplazar la imagen por el video
                        videoContainer.innerHTML = `
                            <video controls autoplay muted playsinline class="w-100">
                                <source src="${videoUrl}" type="video/mp4">
                                Tu navegador no soporta reproducción de video.
                            </video>
                        `;

                        // Asegurarse de que el video comience a reproducirse
                        const videoElement = videoContainer.querySelector('video');
                        videoElement.addEventListener('loadeddata', () => {
                            videoElement.play();
                        });
                    }
                })
                .catch(error => console.error('Error al procesar el manifiesto de video:', error));
        } else if (videoContainer.querySelector('video')) {
            // Reproducir el video existente si ya fue cargado
            const videoElement = videoContainer.querySelector('video');
            videoElement.play();
        }
    });

    // Pausar videos en slides inactivas al cambiar de slide
    swiperVideos.on('transitionStart', () => {
        const allSlides = swiperVidWrapper.querySelectorAll('.swiper-slide video');
        allSlides.forEach(video => {
            video.pause();
        });
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
