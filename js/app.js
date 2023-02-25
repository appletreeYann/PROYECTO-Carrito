//variables

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

//Listeners
cargarEventListeners();
function cargarEventListeners () {
    //AGregar curso al presionar boton
    listaCursos.addEventListener('click', agregarCurso);

    //Eliminar cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Vaciar carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        limpiarHTML(contenedorCarrito);
    })

    //Mostrar cursos de localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML(contenedorCarrito);
    });
}

//Funciones

function agregarCurso(e){
    if(e.target.classList.contains('agregar-carrito')){
        e.preventDefault();
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    };
}

function eliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        //llamamos ala funcion para cambiar el html
        carritoHTML();
    }
}

//Extraer info del curso

function leerDatosCurso(curso) {
    //console.log(curso);
    //Objeto con el contenido del curso seleccionado
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    //console.log(infoCurso);

    //Revisa si un elemento ya existe y actualiza la cantidad

    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if(existe){
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso;
            }else {
                return curso;
            }
        });
        articulosCarrito = [...cursos];
    }else {
        //Agrega elemntos al carrito (array)
        articulosCarrito = [...articulosCarrito, infoCurso];
    }


    console.log(articulosCarrito);

    carritoHTML();
}

//muestra carrito en html

function carritoHTML(){
    //Limpiar HTML

    limpiarHTML(contenedorCarrito);

    //Recorrer carrito y agregar html
    articulosCarrito.forEach( curso => {
        //Extraer propiedades de curso y crear variables con destructuring
        const {imagen, titulo, precio, cantidad, id} = curso;
        //
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>
                ${titulo}
            </td>
            <td>
                ${precio}
            </td>
            <td>
                ${cantidad}
            </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;
        //Agrega HTML al tbdy
        contenedorCarrito.appendChild(row);
    });
    //Agregar carrito a localSTorage
    sincronizarStorage()
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function limpiarHTML(elemento){
    //Forma lenta
    //elemento.innerHTML = '';

    //Mejor performance

    while(elemento.firstChild){
        elemento.removeChild(elemento.firstChild);
    }
}