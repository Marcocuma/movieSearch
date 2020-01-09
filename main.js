var key="apikey=3695b132";
var titulo=document.createElement("h2");
document.getElementById("data").appendChild(titulo);
var image=document.createElement("img");
document.getElementById("image").appendChild(image);
var data=document.createElement("p");
document.getElementById("data").appendChild(data);
function buscar(){
    var peticion="http://www.omdbapi.com/?"
    var name=document.getElementById("name").value;
    var year=document.getElementById("year").value;
    name=name.split(" ");
    for (let index = 0; index < name.length; index++) {
        if(index==0)
            peticion+="t="+name[index]+"+";
        else if(index<name.length-1)
            peticion+=name[index]+"+";
        else
            peticion+=name[index];
    }
    if(year!="")
        peticion+="&y="+year;
    peticion+="&"+key;
    console.log(peticion);
    $.ajax({
        url: peticion,
        success: function(respuesta) {
            console.log(respuesta);
            maquetar(respuesta);
        },
        error: function() {
            console.log("No se ha podido obtener la información");
        }
    });
}
function maquetar(datos){
    titulo.innerText=datos.Title;
    image.src=datos.Poster;
    data.innerHTML="<strong>Genre</strong> "+datos.Genre+"<br>"+
    "<strong>Release</strong> "+datos.Release+"<br>"+
    "<strong>Director</strong> "+datos.Director+"<br>"+
    "<strong>Writer</strong> "+datos.Writer+"<br>"+
    "<strong>Actors</strong> "+datos.Actors+"<br>"+
    "<strong>Plot</strong> "+datos.Plot+"<br>"+
    "<strong>Rating</strong> "+datos.imdbRating+"<br>"
}