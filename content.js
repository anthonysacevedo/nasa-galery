const url = 'https://images-api.nasa.gov/search';
const search = document.getElementById('search'); // Input de búsqueda
const btn = document.getElementById('button'); // Botón de búsqueda
const content = document.getElementById('content'); // Contenedor para mostrar las imágenes
const modalTitle = document.getElementById('exampleModalLabel'); // Título del modal
const modalContent = document.getElementById('modalContent'); // Contenido del modal
const searchValue = localStorage.getItem('content');
const searchTitle = document.querySelector('.searchTitle');

// Función para imprimir imágenes en el carrusel
function imprimirContenido(array) {
    content.innerHTML = ''; // Limpiar contenido anterior
    content.classList.add('galery'); // Asegurar que el contenedor tenga la clase de grilla
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        let imageUrl = item.links?.[0]?.href;

        if (imageUrl) {
            // Crear el contenedor <div> para cada imagen
            const div = document.createElement('div');
            div.classList.add('galery-item');
            div.setAttribute('data-index', `${i}`);
            div.setAttribute('data-bs-toggle', 'modal'); // Vincular al modal de Bootstrap
            div.setAttribute('data-bs-target', '#exampleModal'); // ID del modal

            // Crear la imagen <img>
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'NASA Image';
            img.classList.add('img-fluid', 'hover-effect'); // Clase para hover y responsividad

            // Añadir la imagen al contenedor
            div.appendChild(img);

            // Añadir el contenedor al fragmento
            fragment.appendChild(div);
        }
    }

    // Añadir todo el fragmento al contenedor
    content.appendChild(fragment);

    // Configurar eventos para abrir modal con detalles
    const galeryItems = document.querySelectorAll('.galery-item');
    galeryItems.forEach(item => {
        item.addEventListener('click', function () {
            const index = this.getAttribute('data-index'); // Obtener índice del elemento
            recorrerJson(array, index); // Llamar a la función para mostrar detalles
        });
    });
}




// Función para mostrar detalles en el modal
function recorrerJson(array, index) {
    const item = array[index];
    const imageUrl = item.links?.[0]?.href;
    const title = item.data?.[0]?.title || 'Sin título';
    const description = item.data?.[0]?.description || 'No hay descripción disponible.';

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
    const searchInUrl = `${url}?q=${imagen}&media_type=image`; // Aseguramos que solo traiga imágenes

    fetch(searchInUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
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
    const h3 = document.createElement('h3');
    h3.textContent = `Resultados de la busqueda: ${searchValue}`;
    searchTitle.appendChild(h3);

    search.value = searchValue;

    mostrarContenido(imprimirContenido, searchValue); // Mostrar contenido por defecto
});

// Evento para el botón de búsqueda - imprime las imágenes según lo que busque el usuario
btn.addEventListener('click', function (event) {
    event.preventDefault(); // Evita que se recargue la página

    const request = search.value.trim(); // Obtener el texto de búsqueda
    if (request !== '') {
        searchTitle.innerHTML ='';
        const h3 = document.createElement('h3');
        h3.textContent = `Resultados de la busqueda: ${request}`;
        searchTitle.appendChild(h3);

        mostrarContenido(imprimirContenido, request);
        content.scrollIntoView({ behavior: 'smooth' }); // Desplazar a los resultados
    } else {
        alert('Por favor, ingrese un término de búsqueda.'); // Validar si el campo está vacío
    }
});
