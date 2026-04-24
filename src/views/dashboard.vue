<template> 
  <div class="layout"> 
    <aside class="sidebar">
      <div class="sidebar__logo">
        <img src="../assets/image.png" class="icon">
        
        <h2>Controle EPI</h2>
      </div>

      <nav aria-label="Menu principal">
        <ul class="navbar__lista">
          <li><RouterLink to="/" class="navbar__link">Home</RouterLink></li>
          <li><RouterLink to="/cadastro" class="navbar__link">Cadastro de EPI</RouterLink></li>
          <li><RouterLink to="/estoque" class="navbar__link">Estoque</RouterLink></li>
          <li><RouterLink to="/login" class="navbar__link">Login</RouterLink></li>
          <li><RouterLink to="/relatorio" class="navbar__link">Relatório</RouterLink></li>
          <li><RouterLink to="/reserva" class="navbar__link">Reserva</RouterLink></li>
          
          <li class="item-sair">
            <button @click="sair" class="btn-sair">Sair</button>
          </li>
        </ul>
      </nav>
    </aside> 
    <!-- ===== CONTEÚDO CENTRAL ===== -->
    <!-- Aqui é onde as páginas aparecem (Dashboard, Funcionários, etc.) -->
    <main class="conteudo">
      <!-- RouterView: espaço vazio onde o Vue coloca o componente da rota atual -->
      <!-- Cada rota filha (children) aparece aqui automaticamente -->
      <RouterView />
    </main>
  </div> 
</template>

<script setup>
import { useSupabase } from '../composables/useSupabase'
import { useRouter } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'
const { supabase } = useSupabase()
const router = useRouter()

async function sair() {
  // try = tenta executar o código dentro
  // Se houver um erro, vai para o catch
  try {
    // ===== PASSO 1: DESCONECTAR DO SUPABASE =====
    // supabase.auth.signOut() = função do Supabase que desconecta o usuário
    // Isso remove a sessão do usuário do navegador
    // await = espera a operação terminar antes de continuar
    await supabase.auth.signOut()
    // Depois de desconectar, o usuário não está mais autenticado
    // Se tentar acessar uma página protegida, será redirecionado para login

    // ===== PASSO 2: REDIRECIONAR PARA A PÁGINA DE LOGIN =====
    // router.push('/login') = navega para a página /login
    // Isso leva o usuário de volta para a tela de login
    // A navegação acontece sem recarregar a página (SPA)
    router.push('/login')
    // Agora o usuário está na página de login e pode fazer login novamente
  }
 catch (err) {
    // Se houver um erro ao fazer logout, mostrar no console
    // Isso ajuda o desenvolvedor a entender o que deu errado
    console.error('Erro ao fazer logout:', err)
    // Nota: mesmo com erro, o usuário pode estar desconectado
    // Mas é bom avisar o desenvolvedor sobre o problema
  }
}

</script>

<style scoped> 
*{
  margin: 0;
  padding: 0;
}
/* Layout Base */
.layout { 
  display: flex;
  height: 100vh; 
  background-color: #f4f7f6; 
} 


.sidebar { 
  width: 250px;
  background-color: #111827;
  color: white; 
  padding: 20px;
  display: flex;
  flex-direction: column;
} 

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  
}

img{
  height: 30px;
  width: 30px;
}

.navbar__lista {
  list-style: none; 
  padding: 0;
  margin: 0;
}

.navbar__link {
  display: block; 
  color: #adb5bd; 
  text-decoration: none; 
  padding: 12px 0;
  transition: 0.3s;
}

.navbar__link:hover {
  color: white;
}

.item-sair {
  margin-top: 40px;
  padding-top: 20px;
  
}

.btn-sair {
  background-color: red;
  color:white;
  border: 1px solid #ff4d4d;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 4px;
  width: 100px;
  text-align: center;
}

.btn-sair:hover {
  background: #ff4d4d;
  color: white;
}
.conteudo {
  width: 100%;
}

.header-tabela {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.btn-novo {
  background: #1e1e2d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.card-tabela {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  color: #adb5bd;
  font-size: 12px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

td {
  padding: 15px 0;
  border-bottom: 1px solid #f9f9f9;
  font-size: 14px;
}

.btn-excluir {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>