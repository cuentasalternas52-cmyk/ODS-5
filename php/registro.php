<?php
include("conexion.php");

// Validar datos
if(isset($_POST['nombre'], $_POST['usuario'], $_POST['correo'], $_POST['password'])){

    $nombre = trim($_POST['nombre']);
    $usuario = trim($_POST['usuario']);
    $correo = trim($_POST['correo']);
    $passwordPlano = $_POST['password'];

    // 🔥 VALIDACIONES

    // Nombre vacío
    if(empty($nombre)){
        header("Location: ../registro.html?error=nombre");
        exit();
    }

    // Usuario vacío
    if(empty($usuario)){
        header("Location: ../registro.html?error=usuario_vacio");
        exit();
    }

    // Correo inválido
    if(!filter_var($correo, FILTER_VALIDATE_EMAIL)){
        header("Location: ../registro.html?error=correo_invalido");
        exit();
    }

    // Contraseña corta
    if(strlen($passwordPlano) < 6){
        header("Location: ../registro.html?error=clave_corta");
        exit();
    }

    $password = password_hash($passwordPlano, PASSWORD_DEFAULT);

    // 🔎 Verificar usuario
    $checkUser = $conexion->prepare("SELECT id FROM usuarios WHERE usuario = ?");
    $checkUser->bind_param("s", $usuario);
    $checkUser->execute();
    $resUser = $checkUser->get_result();

    if($resUser->num_rows > 0){
        header("Location: ../registro.html?error=usuario");
        exit();
    }

    // 🔎 Verificar correo
    $checkCorreo = $conexion->prepare("SELECT id FROM usuarios WHERE correo = ?");
    $checkCorreo->bind_param("s", $correo);
    $checkCorreo->execute();
    $resCorreo = $checkCorreo->get_result();

    if($resCorreo->num_rows > 0){
        header("Location: ../registro.html?error=correo");
        exit();
    }

    // 💾 Insertar
    $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, usuario, correo, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nombre, $usuario, $correo, $password);

    if($stmt->execute()){
        header("Location: ../login.html?success=1");
        exit();
    } else {
        header("Location: ../registro.html?error=bd");
        exit();
    }

} else {
    header("Location: ../registro.html?error=datos");
    exit();
}
?>