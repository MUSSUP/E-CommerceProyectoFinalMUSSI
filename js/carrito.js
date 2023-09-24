//recupero datos del carrito desde local storage:
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

//Sección de query selectors:
const ContenedorCarritoVacio = document.getElementById("carrito-vacio");
const ContenedorCarritoProductos = document.getElementById("carrito-productos");
const ContenedorCarritoAcciones = document.getElementById("carrito-acciones");
const ContenedorCarritoComprado = document.getElementById("carrito-comprado");
const botonVaciar = document.querySelector(".carrito-acciones-vaciar");
const ContenedorTotal = document.querySelector("#total")
const botonComprar = document.querySelector(".carrito-acciones-comprar");

//si hay productos.. modificamos las clases para que se muestren los divs que corresponden
//y cargamos los productos en cuestión
//sino se sigue mostrando el div de "carrito vacio":
function mostrarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        ContenedorCarritoVacio.classList.add("disabled");
        ContenedorCarritoProductos.classList.remove("disabled");
        ContenedorCarritoAcciones.classList.remove("disabled");
        ContenedorCarritoComprado.classList.add("disabled");

        ContenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const detalleCarrito = document.createElement("div");
            detalleCarrito.classList.add("carrito-producto");
            detalleCarrito.innerHTML = `
        <img class="carrito-producto-imagen" src="${producto.imagen}">
                        <div class="carrito-producto-descri">
                            <small>Detalle</small>
                            <h3>${producto.nombre}</h3>
                        </div>
                        <div class="carrito-producto-cantidad">
                            <small>Cantidad</small>
                            <p>${producto.cantidad}</p>
                        </div>
                        <div class="carrito-producto-precio">
                            <small>Precio</small>
                            <p>$${producto.precio}</p>
                        </div>
                        <div class="carrito-producto-subtotal">
                            <small>Subtotal</small>
                            <p>$ ${producto.precio * producto.cantidad}</p>
                        </div>
                        <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash3"></i></button>`

            ContenedorCarritoProductos.appendChild(detalleCarrito)
        })
    } else {
        ContenedorCarritoVacio.classList.remove("disabled");
        ContenedorCarritoProductos.classList.add("disabled");
        ContenedorCarritoAcciones.classList.add("disabled");
        ContenedorCarritoComprado.classList.add("disabled");
    }
    actualizarBotonesEliminar();
    actualizarTotal()
}

mostrarProductosCarrito();

//al igual que en el index... actualizamos los botones para eliminar:
function actualizarBotonesEliminar() {
    let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    })

}

//función para eliminar Items y actualizacion de LS:
function eliminarDelCarrito(e) {

    Toastify({                                                      //agregado de libreria toastify!!
        text: "Producto eliminado!",
        duration: 3000,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #EF637E, #f09cad)",
            borderRadius: "2rem"
        },
        onClick: function () { }, // Callback after click
        offset: {
            x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
    }).showToast();


    let idBoton = e.currentTarget.id;

    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito.splice(index, 1);

    mostrarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

//vaciado de carrito:

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({                                                                  //agregado de libreria sweet alert!!
        title: 'Estas seguro?',
        text: "Se borrarán todos los productos de tu carrito!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF637E',
        cancelButtonColor: '#47f541',
        confirmButtonText: 'Sí, vaciar!'
      }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            mostrarProductosCarrito();
          Swal.fire(
            'Vaciado!',
            'Tu carrito ha sido vaciado correctamente',
            'success'
          )
        }
      })

            


}

//actualización del valor Total:

function actualizarTotal() {
    let totalAcumulado = productosEnCarrito.reduce((acumulador, producto) => acumulador + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalAcumulado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));


    ContenedorCarritoVacio.classList.add("disabled");
    ContenedorCarritoProductos.classList.add("disabled");
    ContenedorCarritoAcciones.classList.add("disabled");
    ContenedorCarritoComprado.classList.remove("disabled");
}
