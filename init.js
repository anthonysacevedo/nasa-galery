const url = 'https://images-api.nasa.gov/search';
const search = document.getElementById('search');
const btn = document.getElementById('button-addon2');
const contenido = document.getElementById('contenido');
const modalContent = document.getElementById('modalContent');
const modalTitle = document.getElementById('exampleModalLabel');

// Función para mostrar las imágenes
function imprimirContenido(array) {
    let htmlContentToAppear = `
    <div class="container-fluid p-0">
        <div class="row g-4 justify-content-center" style="padding: 1rem;">`; // Cambié g-3 por g-4 para más espacio

for (let i = 0; i < array.length; i++) {
    let item = array[i];
    let imageUrl = item.links?.[0]?.href; // Verifica si hay links con datos
    let nasaId = item.data?.[0]?.nasa_id;
    let keyWords = item.data?.[0].keywords;

    if (imageUrl) {
        htmlContentToAppear += `
        <div class="col-3 d-flex justify-content-center tarjetas">
            <div class="card shadow-sm" style="width: 18rem;"> <!-- Ajusta el tamaño uniforme de las tarjetas -->
                <a href="#" class="img-link" data-index="${i}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img class="card-img-top" src="${imageUrl}" alt="NASA image" 
                        style="height: 200px; object-fit: cover;"> <!-- Tamaño uniforme para imágenes -->
                        <p class="p-2">Palabras claves: ${imprimirMaximoTres(keyWords)}</p>
                        
                </a>
            </div>
        </div>`;
    }
}

htmlContentToAppear += `
    </div>
</div>`;


    contenido.innerHTML = htmlContentToAppear;

    // Agregar eventos a las imágenes generadas
    const imgLinks = document.querySelectorAll('.img-link');
    imgLinks.forEach(link => {
        link.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            recorrerJson(array, index);
        });
    });
}

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

// Evento para el botón de búsqueda
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
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
});

