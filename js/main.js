var key="apikey=3695b132";
var enlace="https://www.omdbapi.com/?";
var pagina=1;
var bloqueo=false;
$(window).scroll(comprobarBloqueo);
$('#cerrar').on('click',function(){
    $('#modalCenter').fadeOut();
    limpiarModal();
})
function mostrarPortadas(){
    $('#movies').empty();
    pagina=1;
    anadirPortadas();
}
function comprobarBloqueo(){
    if(!bloqueo)
        anadirPortadas();
}
function anadirPortadas(){
    if(($(window).scrollTop() + $(window).height() >= $(document).height()-100)){
        $('#carga').attr("style",'');
        bloqueo=true;
        var peticion=enlace;
        var nombre=$('#name').val();
        var anio=$('#year').val();
        nombre=nombre.split(" ");
        peticion+="s=";
        for (let index = 0; index < nombre.length; index++) {
            if(index==0&&nombre.length>1)
                peticion+=nombre[index]+"+";
            else if(index<nombre.length-1)
                peticion+=nombre[index]+"+";
            else
                peticion+=nombre[index];
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
function limpiarModal(){
    $('#genre').text("");
    $('#release').text("");
    $('#director').text("");
    $('#writer').text("");
    $('#actors').text("");
    $('#plot').text("");
    $('#rating').text("");
}
function maquetarModal(datos){
    $('#modalTitle').text(datos.Title)
    $('#img').attr("src",datos.Poster);
    $('#genre').text(datos.Genre)
    $('#release').text(datos.Release)
    $('#director').text(datos.Director)
    $('#writer').text(datos.Writer)
    $('#actors').text(datos.Actors)
    $('#plot').text(datos.Plot)
    $('#rating').text(datos.imdbRating)
    $('#modalCenter').fadeIn();
}
