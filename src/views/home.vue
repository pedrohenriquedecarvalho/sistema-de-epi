<template>
    <header>
        <nav class="menu">
            <ul>
                    <li><router-link to="/home">Home</router-link></li>
                    <li><router-link to="/cadastro">Cadastro</router-link></li>
                    <li><router-link to="/estoque">Estoque</router-link></li>
                    <li><router-link to="/reserva">reserva</router-link></li>
                    <li><router-link to="/relatorio">Relatório</router-link></li>
                    <li><router-link to="/login">Login</router-link></li>
            </ul>
        </nav>
</header>
</template>

<script>
export default {
name: 'home'
}
</script>

