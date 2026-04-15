<template> 
<div class="layout"> 
<aside class="sidebar">

<nav aria-label="Menu principal">
      <ul class="navbar__lista">
        <li><RouterLink to="/" class="navbar__link">Home</RouterLink></li>
        <li><RouterLink to="/cadastro" class="navbar__link">Cadastro</RouterLink></li>
        <li><RouterLink to="/estoque" class="navbar__link">Estoque</RouterLink></li>
        <li><RouterLink to="/login" class="navbar__link">Login</RouterLink></li>
        <li><RouterLink to="/relatorios" class="navbar__link">Relatórios</RouterLink></li>
        <li><RouterLink to="/reserva" class="navbar__link">Reserva</RouterLink></li>
      </ul>
    </nav>
<button @click="logout"> 
</button> 
</aside> 
<main class="conteudo"> 
<RouterView /> 
</main> 
</div> 
</template>

<style scoped> 
.layout { 
display: flex;
height: 100vh; 
} 
.sidebar { 
width: 250px;
background: #212529; 
color: white; 
padding: 20px; 
} 
.sidebar a { 
display: block; 
color: white; 
margin-bottom: 15px; 
} 
.conteudo {
flex: 1; 
padding: 20px; 
} 

</style> 

