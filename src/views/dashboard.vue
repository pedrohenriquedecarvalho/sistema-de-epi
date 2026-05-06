<template> 
  <div class="layout"> 
    <!-- SIDEBAR FIXA ESQUERDA -->
    <aside class="sidebar">
      <div class="sidebar__logo">
        <img src="../assets/image.png" class="icon" alt="Logo">
        <h2>Controle EPI</h2>
      </div>

      <nav aria-label="Menu principal" class="sidebar__nav">
        <ul class="navbar__lista">
          <li><RouterLink to="/funcionarios" class="navbar__link">Funcionários</RouterLink></li>
          <li><RouterLink to="/cadastro" class="navbar__link">Cadastro de EPI</RouterLink></li>
          <li><RouterLink to="/estoque" class="navbar__link">Estoque</RouterLink></li>
          <li><RouterLink to="/relatorio" class="navbar__link">Relatório</RouterLink></li>
          <li><RouterLink to="/reserva" class="navbar__link">Reserva</RouterLink></li>
        </ul>
        
        <div class="item-sair">
          <button @click="sair" class="btn-sair">Sair</button>
        </div>
      </nav>
    </aside> 

    <!-- CONTEÚDO DA DIREITA (NAVBAR + PÁGINAS) -->
    <div class="main-wrapper">
      <!-- NAVBAR SUPERIOR -->
     <nav class="navbar">
      <div class="nav-center">
        <input type="text" placeholder="Pesquisar..." class="input">
      </div>
      <div class="nav-right">
        <img src="../assets/conta.png" alt="User" class="conta">
        <RouterLink to="/login" class="conta1">Acesse sua conta</RouterLink>
      </div>
    </nav>

      <!-- CONTEÚDO DINÂMICO (PÁGINAS) -->
      <main class="conteudo-scroll">
        <RouterView />
      </main>
    </div>
  </div> 
</template>

<script setup>
import { useSupabase } from '../composables/useSupabase'
import { useRouter, RouterLink, RouterView } from 'vue-router'

const { supabase } = useSupabase()
const router = useRouter()

async function sair() {
  try {
    await supabase.auth.signOut()
    router.push('/login')
  } catch (err) {
    console.error('Erro ao fazer logout:', err)
  }
}
</script>

<style scoped>


* { margin: 0; padding: 0; box-sizing: border-box; }
.navbar { background-color: #111827; color: white; display: flex; align-items: center; padding: 15px 50px; }
.nav-center { flex: 1; display: flex; justify-content: center; }
.nav-right { display: flex; align-items: center; gap: 10px; }
.input { width: 400px; padding: 10px; border-radius: 6px; border: none; background-color: #374151; color: white; }
.conta { width: 28px; }
.conta1 { text-decoration: none; color: white; margin-left: 10px; font-size: 14px; }
.layout { 
  display: flex;
  width: 100vw;
  height: 100vh; 
  background-color: #f3f4f6; 
  overflow: hidden;
} 

/* SIDEBAR */
.sidebar { 
  width: 260px;
  background-color: #111827;
  color: white; 
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
} 

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.icon { height: 32px; width: 32px; }

.sidebar__nav { display: flex; flex-direction: column; flex: 1; }

.navbar__lista { list-style: none; flex: 1; }

.navbar__link {
  display: block; 
  color: #9ca3af; 
  text-decoration: none; 
  padding: 12px 15px;
  border-radius: 8px;
  transition: all 0.2s;
  margin-bottom: 5px;
}

.navbar__link:hover { color: white; background-color: #1f2937; }
.router-link-active { color: white; background-color: #374151; font-weight: 600; }

.item-sair { padding-top: 20px; border-top: 1px solid #1f2937; }

.btn-sair {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
  font-weight: 600;
}

/* ÁREA DA DIREITA */
.main-wrapper { flex: 1; display: flex; flex-direction: column; height: 100%; }

.top-navbar {
  height: 64px;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  color: white;
}

.input-search {
  background: #374151;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  color: white;
  width: 300px;
}

.user-profile { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.avatar { width: 24px; height: 24px; }

.conteudo-scroll { flex: 1; overflow-y: auto; padding-bottom: 40px; }
</style>