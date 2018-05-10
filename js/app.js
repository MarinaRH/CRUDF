window.onload = inicializar;
var formConvalidaciones;
var refConvalidaciones;
var refConvalidacionAEditar;
var CREATE="Añadir convalidacion";
var UPDATE="Modificar convalidacion";
var modo=CREATE;

function inicializar(){
  
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyATUbzZ4LyNlt2PuaQH63fnb0H8V-QI_Z0",
        authDomain: "crud-c5c6c.firebaseapp.com",
        databaseURL: "https://crud-c5c6c.firebaseio.com",
        projectId: "crud-c5c6c",
        storageBucket: "crud-c5c6c.appspot.com",
        messagingSenderId: "175041399647"
    };
    firebase.initializeApp(config);

    formConvalidaciones = document.getElementById("form-convalidaciones");
    tbodyTablaConvalidaciones=document.getElementById("tbody-tabla-convalidaciones");
    formConvalidaciones.addEventListener("submit", enviarConvalidacionesAFirebase, false);

    refConvalidaciones = firebase.database().ref().child("convalidaciones");
    mostrarConvalidacionesDeFirebase();
    // borrarConvalidacionDeFirebase();
}

function mostrarConvalidacionesDeFirebase(){
    refConvalidaciones.on("value", function(snap){
        var datos=snap.val();
        var filasAMostrar = "";
        for(var key in datos){
            filasAMostrar += "<tr>"+
                            "<td>"+ datos[key].moduloAConvalidar+ "</td>"+
                            "<td>"+ datos[key].cicloAConvalidar+ "</td>"+
                            "<td>"+ datos[key].moduloAportado+ "</td>"+
                            "<td>"+ datos[key].cicloAportado+ "</td>"+
                            '<td><button class="borrar" data-convalidacion="' + key + '">eliminar</button></td>'+
                            '<td><button class="editar" data-convalidacion="' + key + '">editar</button></td>'+
                            "</tr>";
        }
        tbodyTablaConvalidaciones.innerHTML = filasAMostrar;
        if(filasAMostrar != ""){
            var elementosBorrables = document.getElementsByClassName("borrar");
            for(var i = 0 ; i < elementosBorrables.length; i++){
                elementosBorrables[i].addEventListener("click", borrarConvalidacionDeFirebase);
            }

            var elementosEditables = document.getElementsByClassName("editar");
            for(var i = 0 ; i < elementosEditables.length; i++){
              elementosEditables[i].addEventListener("click", editarConvalidacionDeFirebase);
            }
        }
    });
}

function editarConvalidacionDeFirebase(){
  var keyDeConvalidacionAEditar = this.getAttribute("data-convalidacion");
  refConvalidacionAEditar = refConvalidaciones.child(keyDeConvalidacionAEditar);
  refConvalidacionAEditar.once("value", function(snap){
    var datos=snap.val();
    document.getElementById("modulo-a-convalidar").value=datos.moduloAConvalidar;
    document.getElementById("ciclo-a-convalidar").value=datos.cicloAConvalidar;
    document.getElementById("modulo-aportado").value=datos.moduloAportado;
    document.getElementById("ciclo-aportado").value=datos.cicloAportado;
    
    document.getElementById('btn-enviar').value = UPDATE;
    modo= UPDATE;
  });
}



function borrarConvalidacionDeFirebase(){
    var keyDeConvalidacionABorrar = this.getAttribute("data-convalidacion");
    var refConvalidacionABorrar = refConvalidaciones.child(keyDeConvalidacionABorrar);
    refConvalidacionABorrar.remove();
}


function enviarConvalidacionesAFirebase(event){
    event.preventDefault();
    switch(modo){

        case CREATE:
        refConvalidaciones.push({
            moduloAConvalidar: event.target.moduloAConvalidar.value,
            cicloAConvalidar: event.target.cicloAConvalidar.value,
            moduloAportado: event.target.moduloAportado.value,
            cicloAportado: event.target.cicloAportado.value
        });
        break;

        case UPDATE:
        refConvalidacionAEditar.update({
            moduloAConvalidar: event.target.moduloAConvalidar.value,
            cicloAConvalidar: event.target.cicloAConvalidar.value,
            moduloAportado: event.target.moduloAportado.value,
            cicloAportado: event.target.cicloAportado.value
        });
        
        document.getElementById('btn-enviar').value = CREATE;
        modo=CREATE;
        break;
    }
    
    formConvalidaciones.reset();
}