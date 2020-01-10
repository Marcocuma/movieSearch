var key="apikey=3695b132";
var enlace="https://www.omdbapi.com/?";
var pagina=1;
$(window).scroll(anadirPortadas);
$('#cerrar').on('click',() => $('#modalCenter').fadeOut())
function mostrarPortadas(){
    $('#movies').empty();
    pagina=1;
    anadirPortadas();
}
function anadirPortadas(){
    if($(window).scrollTop() + $(window).height() >= $(document).height()-100){
        var peticion=enlace;
        var nombre=$('#name').val();
        var anio=$('#year').val();
        nombre=nombre.split(" ");
        console.log(nombre);
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
        var pelicula=$('<div>');
        pelicula.id=element.imdbID;
        $(pelicula).on("click",() =>buscarPelicula(pelicula.id));
        $(pelicula).attr('class','col-12 col-sm-4');
        var portada=$('<img>');
        if(element.Poster!="N/A")
            $(portada).attr("src",element.Poster);
        else
            $(portada).attr("src",'./img/notFound.jpg');
        console.log($('portada'))
        $(pelicula).append(portada);
        $('#movies').append(pelicula);
    });
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
function maquetarModal(datos){
    $('#modalTitle').text(datos.Title)
    $('#img').attr("src",datos.Poster);
    $('#descripcion').html("<strong>Genre</strong> "+datos.Genre+"<br>"+
    "<strong>Release</strong> "+datos.Release+"<br>"+
    "<strong>Director</strong> "+datos.Director+"<br>"+
    "<strong>Writer</strong> "+datos.Writer+"<br>"+
    "<strong>Actors</strong> "+datos.Actors+"<br>"+
    "<strong>Plot</strong> "+datos.Plot+"<br>"+
    "<strong>Rating</strong> "+datos.imdbRating+"<br>")
    $('#modalCenter').fadeIn();
}
