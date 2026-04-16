<?php

$mensaje = $_POST['mensaje'];

$respuesta = "Lo siento, no entendí.";

if(strpos($mensaje, "ayuda") !== false){
    $respuesta = "Puedes ir a 'Solicitar ayuda' en el panel.";
}

if(strpos($mensaje, "violencia") !== false){
    $respuesta = "No estás sola 💜 Puedes buscar apoyo inmediato.";
}

echo $respuesta;
?>