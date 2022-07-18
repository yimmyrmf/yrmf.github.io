//Definicion de las clases
class Libro{
    constructor(titulo, autor, isbn){
        this.Libro = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

class UI{
    static mostrarLibros(){
        const libros = Datos.traerLibros();
        libros.forEach((libro)=> UI.agregarLibroLista(libro));
    }

    static agregarLibroLista(libro){
        const lista = document.querySelector("#libro-list");
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${libro.Libro}</td>
        <td>${libro.autor}</td>
        <td>${libro.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
        `;
        lista.appendChild(fila);
    }

    static eliminarLibro(el){
        if(el.classList.contains("delete")){
            el.parentElement.parentElement.remove();
        }
    }

    static mostarAlerta(mensaje, className){
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));

        const container = document.querySelector(".container");
        const form = document.querySelector("#libroForm");

        container.insertBefore(div,form);
        setTimeout(()=> document.querySelector(".alert").remove(), 3000);
    }

    static limpiarCampos(){
        document.querySelector("#titulo").value = "";
        document.querySelector("#autor").value = "";
        document.querySelector("#isbn").value = "";
    }
}

class Datos{
    static traerLibros(){
        let libros;
        if(localStorage.getItem("libros") === null){
            libros = [];
        }else{
            libros = JSON.parse(localStorage.getItem("libros"));
        }
        return libros;
    }   
    static agregarLibro(libro){
        const libros = Datos.traerLibros();
        libros.push(libro);
        localStorage.setItem("libros", JSON.stringify(libros));
    }     
    static removerLibro(isbn){ 
        const libros = Datos.traerLibros();
        libros.forEach((libro, index)=>{
            if(libro.isbn === isbn){
                libros.splice(index,1);
            }
        });
        localStorage.setItem("libros", JSON.stringify(libros));
    }
}

//Carga de la pagina
document.addEventListener("DOMContentLoaded", UI.mostrarLibros());

//Controlar el evento submit del formulario
document.querySelector("#libroForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    //Obtener los valores de los campos
    const titulo = document.querySelector("#titulo").value;
    const autor = document.querySelector("#autor").value;
    const isbn = document.querySelector("#isbn").value;

    if(titulo === "" || autor === "" || isbn === ""){
        UI.mostarAlerta("Error Campos vacios", "danger");
    }else{
        const libro = new Libro(titulo, autor, isbn);
        Datos.agregarLibro(libro);
        UI.limpiarCampos();
        UI.agregarLibroLista(libro);
        UI.mostarAlerta("Libro agragado a la colección", "success");
    }
});

document.querySelector("#libro-list").addEventListener("click", (e) => {
    UI.eliminarLibro(e.target);
    Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
    UI.mostarAlerta("Libro eliminado correctamente", "success");
});

