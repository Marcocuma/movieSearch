//Inicializacion de variables globales
var key="apikey=3695b132";
var enlace="https://www.omdbapi.com/?";
var pagina=1;
var nombre,anio;
var bloqueo=false;


//Añade la funcion comprobarBloqueo al evento scroll
$(window).scroll(comprobarBloqueo);
//Añade un evento click al boton de X del modal , para que lo cierre y lo limpie.
$('#cerrar').on('click',function(){
    $('#modalCenter').fadeOut();
    limpiarModal();
})
//Limpia el contenedor que contiene las portadas, resetea la variable pagina a 1 y coge el valor de los campos de texto 
//llama a la funcion de anadirPortadas
function mostrarPortadas(){
    $('#movies').empty();
    pagina=1;
    nombre=$('#name').val();
    anio=$('#year').val();
    anadirPortadas();
}
//Comprueba que no se este realizando una peticion ayax en ese instante, si no lo esta haciendo,
// llama al metodo anadirPortadas.
function comprobarBloqueo(){
    if(!bloqueo)
        anadirPortadas();
}
//Pone en true la variable bloqueo. Crea el enlace por el que va a enviar la peticion, añadiendole el nombre y el año (si existe) , la pagina que se va a mostrar y la clave de la api. Una vez recibida la respuesta
//Si no ha ocurrido ningun error, se maqueta la informacion de la respuesta mediante el metodo maquetar portadas 
//Si ha ocurrido un error avisa por consola. Al final de la funcion se incrementa la pagina para cuando se llame de nuevo mendiante el scroll del navegador.
function anadirPortadas(){
    if(($(window).scrollTop() + $(window).height() >= $(document).height()-100)){
        $('#carga').attr("style",'');
        bloqueo=true;
        var peticion=enlace;
        nombreDividido=nombre.split(" ");
        peticion+="s=";
        for (let index = 0; index < nombreDividido.length; index++) {
            if(index==0&&nombreDividido.length>1)
                peticion+=nombreDividido[index]+"+";
            else if(index<nombreDividido.length-1)
                peticion+=nombreDividido[index]+"+";
            else
                peticion+=nombreDividido[index];
        }
        if(anio!="")
            peticion+="&y="+anio;
        peticion+="&page="+pagina+"&"+key;
        console.log(peticion);
        $.ajax({
            url: peticion,
            success: function(respuesta) {
                console.log(respuesta);
                maquetarPortadas(respuesta);
                $('#carga').attr("style",'display:none');
            },
            error: function() {
                console.log("No se ha podido obtener la información");
            }
        });
        pagina++;
    }
}
//Este metodo recoge la informacion obtenida en la peticion, y por cada una de las peliculas, crea una Card de boostrap a la cual le añade la imagen de la pelicula (Cuya url la devuelve la peticion ayax)
// y añade el titulo de esta en un div hover (Va po encima de la imagen),al que se le añade dos eventos (Mouse enter y mouse leave) que van a controlar si se muestra el titulo o no (Mediante css). Por cada pelicula
//Se guarda el imdbID como una variable del objeto, variable que se utilizara en el metodo al que llama el evento click añadido al div global de la card.
//Coloca la variable de bloqueo en falso
function maquetarPortadas(peliculas){
    console.log(peliculas)
    $.each(peliculas.Search,function(indice,element){
        //Div global de la card
        var pelicula=$('<div>');
        pelicula.id=element.imdbID;
        $(pelicula).on("click",() =>buscarPelicula(pelicula.id));
        $(pelicula).attr('class','card col-12 col-sm-6 col-lg-3');
        //Imagen de la card
        var contenedorPortada=$("<div>");
        $(contenedorPortada).attr('id','imgPelicula');
        var portada=$('<img>');
        if(element.Poster!="N/A")
            $(portada).attr("src",element.Poster);
        else
            $(portada).attr("src",'./img/notFound.jpg');
        $(portada).attr("class","card-img-top");
        console.log($('portada'))
        //Cuerpo de la card
        var body=$("<div>");
        $(body).attr("class","card-img-overlay d-flex align-items-center justify-content-center tituloPelicula")
        $(body).mouseenter(function(){
            $(contenedorPortada).css({"opacity": "0.3","transition": "1s"})
        })
        $(body).mouseleave(function(){
            $(contenedorPortada).css({"opacity": "1","transition": "1s"})
        })
        //Titulo de la card
        var titulo=$("<h5>");
        $(titulo).attr("class","card-title");
        $(titulo).text(element.Title);
        $(contenedorPortada).append(portada);
        $(pelicula).append(contenedorPortada);
        $(body).append(titulo);
        $(pelicula).append(body);
        $('#movies').append(pelicula);
    });
    bloqueo=false;
}
//Funcion que busca el detalle de la pelicula cuyo id es pasado como parametro. Vuelve a crear el enlace esta vez para una pelicula en concreto y realiza la peticion ayax
//Si se realiza correctamente, llama al metodo maquetarModal
function buscarPelicula(id){
    var peticion=enlace;
    peticion+='i='+id;
    peticion+="&"+key;
    $.ajax({
        url: peticion,
        success: function(respuesta) {
            console.log(respuesta);
            maquetarModal(respuesta);
        },
        error: function() {
            console.log("No se ha podido obtener la información");
        }
    });
}
//Limpia el modal y lo deja en estado por defecto (Vacia todos los parrafos y cambia las estrellas por estrellas vacias)
function limpiarModal(){
    $('i').attr('class','far fa-star')
    $('#genre').text("");
    $('#release').text("");
    $('#director').text("");
    $('#writer').text("");
    $('#actors').text("");
    $('#plot').text("");
    $('#rating').text("");
}
function ponerEstrellas(imdbRating){
    var rating=parseInt(imdbRating.split(".")[0]);
    let estrella = parseInt(rating/2);
    //Hace la media de la puntuacion y redondea el resultado, y cambia todas las estrellas (tag i) menores al numero resultante
    // y pone estrellas rellenas
    $('i:lt('+estrella+')').attr("class","fas fa-star");
    //Hace la media de la puntuacion y si el resto es igual a 1, cambia la estrella numero igual a la media del resultado
    //por una estrella rellena a la mitad
    rating%2==1 ? $('i:eq('+(estrella)+')').attr("class","fas fa-star-half-alt"): null;
}
//Utilizando el detalle de la pelicula pasada como parametro, rellena los parrafos que se encuentran en el modal y lo muestra.
//Las estrellas de la calificacion se colocan en el metodo ponerEstrellas()
function maquetarModal(datos){
    $('#modalTitle').text(datos.Title);
    if(datos.Poster!="N/A")
        $('#img').attr("src",datos.Poster);
    else
        $('#img').attr("src",'./img/notFound.jpg');
    $('#genre').text(datos.Genre)
    $('#release').text(datos.Released)
    $('#director').text(datos.Director)
    $('#writer').text(datos.Writer)
    $('#actors').text(datos.Actors)
    $('#plot').text(datos.Plot)
    $('#numPuntuacion').text(datos.imdbRating);
    ponerEstrellas(datos.imdbRating);
    $('#modalCenter').fadeIn();
}
