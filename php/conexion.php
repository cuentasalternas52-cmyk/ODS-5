<?php
$conexion = new mysqli("localhost","root","","vozsegura");

if($conexion->connect_error){
    die("Error de conexión");
}
?>