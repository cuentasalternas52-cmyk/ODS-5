<?php 
session_start();
if(!isset($_SESSION['usuario'])) {
    header("Location: login.html");
    exit(); 
} 
?>

<div class="header">
    <h1>¡Bienvenida, <?php echo $_SESSION['nombre']; ?>! 💜</h1>
    <p>Estamos aquí para apoyarte en todo momento.</p>
</div>

<div class="cards">

    <div class="card card-dashboard" onclick="cargarSeccion('contacto.html')">
        <div class="card-top">📣</div>
        <div class="card-bottom">Solicitar ayuda</div>
    </div>

    <div class="card card-dashboard" onclick="cargarSeccion('info.html')">
        <div class="card-top">📚</div>
        <div class="card-bottom">Recursos educativos</div>
    </div>

  <div class="card card-dashboard" onclick="cargarSeccion('prevencion.html')">
    <div class="card-top">🛡</div>
    <div class="card-bottom">Prevenir</div>
</div>


    <div class="card card-dashboard" onclick="cargarSeccion('perfil.php')">
        <div class="card-top">👤</div>
        <div class="card-bottom">Mi perfil</div>
    </div>

</div>