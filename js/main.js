let productos = []
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        crearTarjetaProducto(productos);
    })

//Sección de query selectors: 
const ContenedorTarjetaProducto = document.querySelector("#contenedor-productos")
const BotonesCategorias = document.querySelectorAll(".boton-categoria")
const TituloPrincipal = document.getElementById("titulo-principal")
let BotonesAgregar = document.querySelectorAll(".producto-agregar")
const itemsCarrito = document.getElementById("items")


//función para la creacion de los contenedores de productos o "tarjetas productos"
function crearTarjetaProducto (productosPorCategoria) {

    ContenedorTarjetaProducto.innerHTML = "";
    

    productosPorCategoria.forEach(producto => {

        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.className = "tarjeta-producto"
        tarjetaProducto.innerHTML = `
        <img class = "img-producto" src="${producto.imagen}">
        <div class = "descri-producto">
            <h3 class = "producto-nombre">${producto.nombre}</h3>
            <p class = "producto-precio"> $${producto.precio}</p>
            <p class = "producto-stock"> unidades disponibles: ${producto.stock}</p>
            <button class = "producto-agregar" id= "${producto.id}"> Agregar a Carrito </button>
        </div>`;
        ContenedorTarjetaProducto.appendChild(tarjetaProducto);
        ActualizarBotonesAgregar()
    })
}


//funcionalidad a los botones de las categorías (el boton de "todos los productos" contienen inicialmente 
//la clase active y aca se la agrego al boton que es clickeado y se la quito al que la contiene actualmente.
//Se agrega filter para que muestre los productos que coincida el ID Categoria, con el ID del botón
//y para cambiar el título de apica de igual manera un find.  

BotonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
       
        BotonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const tituloCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            TituloPrincipal.innerText = tituloCategoria.categoria.nombre.toUpperCase();

            const productosFiltrados = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            crearTarjetaProducto(productosFiltrados);

        } else {
            TituloPrincipal.innerText = "Todos los productos";
            crearTarjetaProducto(productos);
        }


    })
})

//AGREGADO DE PRODUCTOS A CARRITO:
//1º actualizo los botones "Agregar" para poder tomarlos en el DOM .. ya que con la función anterior.. se limpian las tarjetas de los productos 
//2º agrego la funcion de actualización en la cracion de la tarjeta del producto
//3º creo el array vacio para los productos que se iran agregando al carrito y defino la función utlizando el ID y un FIND
//4º para no duplicar un mismo producto al hacer 2 click.. utilizo un If + Some y si ya esta ese producto.. le aumento la cantidad (creo dicha variable en este punto).
//5º paso le dato de cantidades de productos agregados.. en el campo "ITEM". 
//6º guardo en local storage
//7º modifico los array de productos e items.. con un if para consultar si hay algo en local storage que me traiga eso. 


function ActualizarBotonesAgregar() {
    BotonesAgregar = document.querySelectorAll(".producto-agregar");

    BotonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    })

}

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");  // recupero el dato de las cantidades

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizaItem ();
}else{
    productosEnCarrito = []
}



function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1
        productosEnCarrito.push(productoAgregado)
    }
    actualizaItem ();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizaItem (){
    let cantidadItems = productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    itemsCarrito.innerText = cantidadItems;

}
