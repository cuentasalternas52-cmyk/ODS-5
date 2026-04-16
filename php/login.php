<?php
session_start();
include("conexion.php");

if(isset($_POST['usuario'], $_POST['password'])){

    $usuario = trim($_POST['usuario']);
    $password = $_POST['password'];

    // 🔥 Validar campos vacíos
    if(empty($usuario) || empty($password)){
        header("Location: ../login.html?error=datos");
        exit();
    }

    // 🔎 Buscar usuario
    $stmt = $conexion->prepare("SELECT id, nombre, usuario, correo, password FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if($resultado->num_rows === 1){

        $user = $resultado->fetch_assoc();

        // 🔥 Validar que el nombre exista
        if(empty($user['nombre'])){
            header("Location: ../login.html?error=nombre");
            exit();
        }

        // 🔐 Verificar contraseña
        if(password_verify($password, $user['password'])){

            session_regenerate_id(true);

            $_SESSION['id'] = $user['id'];
            $_SESSION['usuario'] = $user['usuario'];
            $_SESSION['nombre'] = $user['nombre'];
            $_SESSION['correo'] = $user['correo'];

            header("Location: ../dashboard.html");
            exit();

        } else {
            header("Location: ../login.html?error=clave");
            exit();
        }

    } else {
        header("Location: ../login.html?error=usuario");
        exit();
    }

} else {
    header("Location: ../login.html?error=datos");
    exit();
}
?>