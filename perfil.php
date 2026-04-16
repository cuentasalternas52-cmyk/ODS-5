<?php 
session_start(); 
if(!isset($_SESSION['usuario'])) {
    echo "<p>No has iniciado sesión</p>"; 
    exit; 
} 
?>

<div class="header">
    <h1>Mi Perfil 👤</h1>
    <p>Gestiona tu información personal</p>
</div>

<div class="perfil-grid">

    <div class="perfil-card">
        <div class="icon">👤</div>
        <span class="label">Nombre</span>
        <span class="value"><?php echo $_SESSION['nombre']; ?></span>
    </div>

    <div class="perfil-card">
        <div class="icon">🆔</div>
        <span class="label">Usuario</span>
        <span class="value"><?php echo $_SESSION['usuario']; ?></span>
    </div>

    <div class="perfil-card full">
        <div class="icon">📧</div>
        <span class="label">Correo</span>
        <span class="value"><?php echo $_SESSION['correo']; ?></span>
    </div>

</div>

<!-- BOTÓN EDITAR -->
<div class="perfil-actions">
    <button class="btn primary">Editar perfil</button>
</div>