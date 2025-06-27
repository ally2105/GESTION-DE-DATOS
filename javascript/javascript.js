const productosUnicos = new Set();
const productosPorCategoria = new Map();
let enEdicion = null;

function agregarProducto() {
    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value;
    const precio = parseFloat(document.getElementById("precio").value.trim());

    if (!nombre) {
        Swal.fire("Escribe un nombre");
        return;
    }
    if (isNaN(precio) || precio <= 0) {
        Swal.fire("El precio debe ser mayor a 0");
        return;
    }

    if (enEdicion) {
        actualizarProducto(enEdicion, nombre, categoria, precio);
        return;
    }

    if (productosUnicos.has(nombre)) {
        Swal.fire("Ese producto ya está en la lista");
        return;
    }

    productosUnicos.add(nombre);

    if (!productosPorCategoria.has(categoria)) {
        productosPorCategoria.set(categoria, []);
    }
    productosPorCategoria.get(categoria).push({ nombre, precio });

    limpiarFormulario();
    mostrarProductos();
}

function mostrarProductos() {
    const lista = document.getElementById("listaProductos");
    lista.innerHTML = "";

    productosPorCategoria.forEach((productos, categoria) => {
        productos.forEach(({ nombre, precio }) => {
            const div = document.createElement("div");
            div.className = "producto";
            div.innerHTML = `
                <strong>${nombre}</strong> <em>(${categoria})</em> <em>Precio: $${precio.toFixed(2)}</em><br>
                <button onclick="editar('${nombre}', '${categoria}', ${precio})">Editar</button>
                <button onclick="eliminar('${nombre}', '${categoria}')">Eliminar</button>
            `;
            lista.appendChild(div);
        });
    });
}

function editar(nombre, categoria, precio) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("categoria").value = categoria;
    document.getElementById("precio").value = precio;
    enEdicion = { nombreOriginal: nombre, categoriaOriginal: categoria };
}

function actualizarProducto(original, nuevoNombre, nuevaCategoria, nuevoPrecio) {
    eliminar(original.nombreOriginal, original.categoriaOriginal);

    productosUnicos.add(nuevoNombre);

    if (!productosPorCategoria.has(nuevaCategoria)) {
        productosPorCategoria.set(nuevaCategoria, []);
    }
    productosPorCategoria.get(nuevaCategoria).push({ nombre: nuevoNombre, precio: nuevoPrecio });

    enEdicion = null;
    limpiarFormulario();
    mostrarProductos();
}

function eliminar(nombre, categoria) {
    productosUnicos.delete(nombre);

    const productos = productosPorCategoria.get(categoria);
    const nuevos = productos.filter((p) => p.nombre !== nombre);

    if (nuevos.length === 0) {
        productosPorCategoria.delete(categoria);
    } else {
        productosPorCategoria.set(categoria, nuevos);
    }

    mostrarProductos();
    limpiarFormulario();
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    enEdicion = null;
}