// Obtener referencias a elementos HTML
const nombreInput = document.getElementById('nombre');
const guardarNombreButton = document.getElementById('guardarNombre');
const productoInput = document.getElementById('producto');
const precioInput = document.getElementById('precio');
const descuentoInput = document.getElementById('descuento');
const agregarButton = document.getElementById('agregar');
const finalizarButton = document.getElementById('finalizar');
const listaCompraUl = document.getElementById('listaCompra');
const resultadoDiv = document.getElementById('resultado');
const compraNuevaButton = document.getElementById('compraNueva');
const popupModal = new bootstrap.Modal(document.getElementById('popupModal'));

document.addEventListener('DOMContentLoaded', function () {
    const popupModal = new bootstrap.Modal(document.getElementById('popupModal'));

    // Agrega un event listener para el evento 'shown.bs.modal'
    popupModal._element.addEventListener('shown.bs.modal', function () {
        document.getElementById('salirButton').addEventListener('click', function () {
            window.location.href = 'https://www.google.com';
        });
    });

    popupModal.show(); // Abre el modal al cargar la página
});



// Inicialización de la lista de compra y el total
let listaCompra = [];
let totalCompra = 0;

// Función para agregar un producto a la lista
function agregarProducto() {
    const nombreProducto = productoInput.value.trim();
    const precioProducto = parseFloat(precioInput.value);
    const descuento = parseFloat(descuentoInput.value) || 0;

    if (nombreProducto === '') {
        mostrarMensaje("Por favor, ingrese un nombre válido para el producto.");
        return;
    }

    if (isNaN(precioProducto) || precioProducto <= 0) {
        mostrarMensaje("Por favor, ingrese un precio válido y mayor que cero para el producto.");
        return;
    }

    const producto = { nombre: nombreProducto, precio: precioProducto, descuento: descuento };
    listaCompra.push(producto);
    actualizarTotalCompra();
    actualizarListaCompra();
    guardarListaCompra();
    limpiarCampos();
}

// Función para calcular el subtotal de un producto (considerando el descuento)
function calcularSubtotal(producto) {
    return producto.precio - producto.descuento;
}

// Función para actualizar el total de la compra
function actualizarTotalCompra() {
    totalCompra = listaCompra.reduce((total, producto) => total + calcularSubtotal(producto), 0);
}

// Función para actualizar la lista de compra en HTML
function actualizarListaCompra() {
    listaCompraUl.innerHTML = ''; // Limpiar la lista antes de volver a dibujarla
    listaCompra.forEach((producto, index) => {
        const subtotal = calcularSubtotal(producto);

        // Crear un elemento li para el producto
        const productoLi = document.createElement('li');
        productoLi.className = 'list-group-item';

        // Agregar el contenido del producto con los botones
        productoLi.innerHTML = `
            <span>${index + 1}. ${producto.nombre} - ${numeral(subtotal).format('$0,0.00')}</span>
            <span class="descuento">Descuento: ${numeral(producto.descuento).format('$0,0.00')}</span>
            <button onclick="eliminarProducto(${index})" class="btn btn-danger btn-sm">Eliminar</button>
            <button onclick="repetirProducto(${index})" class="btn btn-success btn-sm">Repetir</button>
        `;

        // Agregar el producto a la lista
        listaCompraUl.appendChild(productoLi);
    });

    // Actualizar el total
    const total = document.createElement('li');
    total.className = 'list-group-item';
    total.innerHTML = `Total actual: ${numeral(totalCompra).format('$0,0.00')}`;
    listaCompraUl.appendChild(total);
}

// Función para eliminar un producto de la lista
function eliminarProducto(index) {
    listaCompra.splice(index, 1);
    actualizarTotalCompra();
    actualizarListaCompra();
    guardarListaCompra();
}

// Función para repetir un producto en la lista
function repetirProducto(index) {
    const producto = listaCompra[index];
    const productoDuplicado = { ...producto }; // Duplicar el producto
    listaCompra.splice(index + 1, 0, productoDuplicado); // Insertar el producto duplicado después del original
    actualizarTotalCompra();
    actualizarListaCompra();
    guardarListaCompra();
}

// Función para mostrar un mensaje en la página
function mostrarMensaje(mensaje) {
    resultadoDiv.innerHTML = mensaje;
}

// Función para finalizar la compra y mostrar los resultados en HTML
function finalizarCompra() {
    const nombre = nombreInput.value.trim();
    let mensajeFinal = `${nombre}, su compra se ha completado.<br>Productos en la lista de compra:<br>`;

    listaCompra.forEach((producto, index) => {
        mensajeFinal += `${index + 1}. ${producto.nombre} - $${producto.precio.toFixed(2)} (Descuento: $${producto.descuento.toFixed(2)})<br>`;
    });

    mensajeFinal += `El total de la compra es: $${totalCompra.toFixed(2)}`;

    resultadoDiv.innerHTML = mensajeFinal;
}

// Función para limpiar los campos de entrada después de agregar un producto
function limpiarCampos() {
    productoInput.value = '';
    precioInput.value = '';
    descuentoInput.value = '';
}

// Función para guardar la lista de compra en el almacenamiento local
function guardarListaCompra() {
    localStorage.setItem('listaCompra', JSON.stringify(listaCompra));
}

// Cargar lista de compra desde el almacenamiento local (si existe)
function cargarListaCompra() {
    const listaGuardada = localStorage.getItem('listaCompra');
    if (listaGuardada) {
        listaCompra = JSON.parse(listaGuardada);
        actualizarTotalCompra();
        actualizarListaCompra();
    }
}

// Función para iniciar una compra nueva (borra todos los datos anteriores)
function iniciarCompraNueva() {
    listaCompra = [];
    totalCompra = 0;
    actualizarListaCompra();
    guardarListaCompra();
    nombreInput.value = ''; // Borra el nombre del cliente del campo de entrada
    localStorage.removeItem('nombreCliente'); // Borra el nombre del cliente del almacenamiento local
    limpiarCampos();
    mostrarMensaje("Compra nueva iniciada. Por favor, ingrese los datos del nuevo cliente y productos.");
}

guardarNombreButton.addEventListener('click', function () {
    const nombre = nombreInput.value.trim();
    if (nombre === '') {
        mostrarMensaje("Por favor, ingrese un nombre válido.");
    } else {
        mostrarMensaje(`Nombre del cliente: ${nombre}`);
    }
});

// Agregar evento de clic para el botón 'Agregar Producto'
agregarButton.addEventListener('click', function () {
    agregarProducto();
});

// Agregar evento de clic para el botón 'Finalizar Compra'
finalizarButton.addEventListener('click', function () {
    finalizarCompra();
});

// Agregar evento de clic para el botón 'Compra Nueva'
compraNuevaButton.addEventListener('click', function () {
    iniciarCompraNueva();
});

// Llamar a la función para cargar la lista de compra al cargar la página
cargarListaCompra();

// Utilizar fetch para obtener datos de una API externa
fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((data) => {
        console.log('Datos de usuarios obtenidos:', data);
        // Puedes procesar los datos aquí y mostrarlos en tu aplicación
    })
    .catch((error) => {
        console.error('Error al obtener datos de la API:', error);
    });
