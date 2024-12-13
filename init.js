const url = 'https://images-api.nasa.gov/search';
const search = document.getElementById('search');
const btn = document.getElementById('button-addon2');
const contenido = document.getElementById('contenido');
const modalContent = document.getElementById('modalContent');
const modalTitle = document.getElementById('exampleModalLabel');
const carouselContent = document.getElementById('carouselContenido');
const staticContent = document.getElementById('staticContent');





// Función para mostrar las imágenes cuando se utiliza el buscador.
function imprimirContenido(array) {
    let htmlContentToAppear = `
    <div id="carouselExample" class="carousel slide mt-5" data-bs-ride="carousel">
        <div class="carousel-inner p-2">`; // Aquí empieza el carrusel

    // Número de tarjetas por "slide"
    const tarjetasPorSlide = 4; 
    let slideIndex = 0;

    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        let imageUrl = item.links?.[0]?.href; // Verifica si hay links con datos
        let nasaId = item.data?.[0]?.nasa_id;
        let keyWords = item.data?.[0]?.keywords;

        // Iniciar un nuevo "slide" si es el primero o al llegar al límite de tarjetas
        if (i % tarjetasPorSlide === 0) {
            slideIndex++;
            htmlContentToAppear += `
            <div class="carousel-item ${slideIndex === 1 ? 'active' : ''}">
                <div class="row justify-content-center gx-1 gy-1">`; // Ajustar gx y gy para reducir espacio
        }

        if (imageUrl) {
            htmlContentToAppear += `
            <div class="col-md-2 d-flex justify-content-center">
                <div class="card shadow-sm" style="width: 18rem; margin: 0.2rem;"> <!-- Ajusta el tamaño y márgenes de las tarjetas -->
                    <a href="#" class="img-link" data-index="${i}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <img class="card-img-top" src="${imageUrl}" alt="NASA image" 
                            style="height: 180px; object-fit: cover;"> <!-- Tamaño uniforme para imágenes -->
                        <div class="card-body">
                            <p class="card-text">Palabras claves: ${imprimirMaximoTres(keyWords)}</p>
                        </div>
                    </a>
                </div>
            </div>`;
        }

        // Cerrar el "slide" al llegar al límite de tarjetas o al final de la lista
        if ((i + 1) % tarjetasPorSlide === 0 || i === array.length - 1) {
            htmlContentToAppear += `
                </div> <!-- Cierra fila -->
            </div> <!-- Cierra slide -->`;
        }
    }

    htmlContentToAppear += `
        </div> <!-- Cierra carousel-inner -->
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" style="background-color: black;" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span class="carousel-control-next-icon" style="background-color: black;" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div> <!-- Cierra carouselExample -->`;

    // Inserta el contenido en el carrusel
    contenido.innerHTML = htmlContentToAppear;

    // Agregar eventos a las imágenes generadas
    const imgLinks = document.querySelectorAll('.img-link');
    imgLinks.forEach(link => {
        link.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            recorrerJson(array, index);
        });
    });
};



// Función para procesar la imagen seleccionada
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


function imprimirMaximoTres(lista) {
    // Determinar el número máximo de elementos a imprimir
    const maxElementos = 3;
    let listaDeTres=[];

    // Iterar sobre la lista hasta el número menor entre su longitud y el máximo permitido
    for (let i = 0; i < Math.min(lista.length, maxElementos); i++) {
        listaDeTres.push(lista[i]); // Aquí puedes reemplazar con la lógica de impresión o renderizado
    }
    return listaDeTres;
}

//Esta funcion imprime todas las imagenes del arreglo -Actualmente no se utiliza-
/*function imprimirImagenes(array) {
    const row = staticContent.querySelector('.row');
    if (!row) {
        console.error('El contenedor .row no existe en staticContent');
        return;
    }

    row.innerHTML = ''; // Limpia contenido previo

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        let imageUrl = item.links?.[0]?.href;

        if (imageUrl) {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-3', 'mb-3'); // Diseño ajustado

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'NASA image';
            img.classList.add('img-fluid,'); // Estilo para imágenes
            img.style.objectFit = 'cover';
            img.style.width = '250px';
            img.style.height = '250px';
            colDiv.appendChild(img);

            fragment.appendChild(colDiv);
        }
    }

    row.appendChild(fragment);
}*/

function mostrarContenido() {
    const endPoint = 'jupiter';
    const searchInUrl = `${url}?q=${endPoint}`;

    fetch(searchInUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const elements = data.collection.items || [];
            imprimirContenido(elements);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

// imprime contenido cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    mostrarContenido();
});


// Evento para el botón de búsqueda - imprime las imagenes en el carousel segun lo que busque el usuario
btn.addEventListener('click', function () {
    const request = search.value;
    const searchUrl = `${url}?q=${request}`;

    fetch(searchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parseamos la respuesta como JSON
        })
        .then(data => {
            const items = data.collection.items || [];
            imprimirContenido(items);
            contenido.scrollIntoView({ behavior: 'smooth' });
           
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });

        
});

