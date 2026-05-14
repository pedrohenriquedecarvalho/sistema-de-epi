<template>
  <div class="layout">
    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
      <div class="sidebar__logo">
        <img src="../assets/image.png" class="icon" alt="Logo">
        <h2 v-if="!isCollapsed">Controle EPI</h2>
      </div>

      <nav aria-label="Menu principal" class="sidebar__nav">
        <ul class="navbar__lista">
          <li>
            <RouterLink to="/funcionarios" class="navbar__link" title="Funcionários">
              <span v-if="!isCollapsed">Funcionários</span>
              <span v-else>👥</span> <!-- Ícone visual para quando estiver fechado -->
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/cadastro" class="navbar__link" title="Cadastro de EPI">
              <span v-if="!isCollapsed">Cadastro de EPI</span>
              <span v-else>📝</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/estoque" class="navbar__link" title="Estoque">
              <span v-if="!isCollapsed">Estoque</span>
              <span v-else>📦</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/relatorio" class="navbar__link" title="Relatório">
              <span v-if="!isCollapsed">Relatório</span>
              <span v-else>📊</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/entrega" class="navbar__link" title="Entrega">
              <span v-if="!isCollapsed">Entrega</span>
              <span v-else>🚚</span>
            </RouterLink>
          </li>
        </ul>
        
        <div class="item-sair">
          <button @click="sair" class="btn-sair" title="Sair">
            <span v-if="!isCollapsed">Sair</span>
            <span v-else>🚪</span>
          </button>
        </div>
      </nav>
    </aside> 

    <!-- CONTEÚDO DA DIREITA -->
    <div class="main-wrapper">
      <nav class="navbar">
        <div class="nav-left">
          <button @click="toggleSidebar" class="btn-toggle">☰</button>
        </div>
        <div class="nav-center"></div>
        <div class="nav-right">
          <img src="../assets/conta.png" alt="User" class="conta">
          <RouterLink to="/login" class="conta1">Acesse sua conta</RouterLink>
        </div>
      </nav>

      <main class="conteudo-scroll">
        <RouterView />
      </main>
    </div>
  </div> 
</template>

<script setup>
import { ref } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import { useRouter, RouterLink, RouterView } from 'vue-router'

const { supabase } = useSupabase()
const router = useRouter()

// Começa fechado (true)
const isCollapsed = ref(true)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

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
  transition: width 0.3s ease;
} 

/* Estado quando recolhido */
.sidebar.is-collapsed {
  width: 70px; 
  padding: 25px 10px;
  align-items: center;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  overflow: hidden;
  justify-content: center;
}

.icon { height: 32px; width: 32px; flex-shrink: 0; }

.sidebar__nav { 
  display: flex; 
  flex-direction: column; 
  flex: 1; 
  width: 100%;
}

.navbar__lista { 
  list-style: none; 
  flex: 1; 
  width: 100%;
}

.navbar__link {
  display: flex;
  align-items: center;
  color: #9ca3af; 
  text-decoration: none; 
  padding: 12px 15px;
  border-radius: 8px;
  transition: all 0.2s;
  margin-bottom: 5px;
  white-space: nowrap;
}

.sidebar.is-collapsed .navbar__link {
  justify-content: center;
  padding: 12px 0;
}

.navbar__link:hover { color: white; background-color: #1f2937; }
.router-link-active { color: white; background-color: #374151; font-weight: 600; }

.item-sair { 
  padding-top: 20px; 
  border-top: 1px solid #1f2937; 
  width: 100%;
}

.btn-sair {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* NAVBAR SUPERIOR */
.navbar { 
  background-color: #111827; 
  color: white; 
  display: flex; 
  align-items: center; 
  padding: 0 30px; 
  height: 64px;
}

.btn-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.nav-center { flex: 1; }
.nav-right { display: flex; align-items: center; gap: 10px; }
.conta { width: 28px; }
.conta1 { text-decoration: none; color: white; font-size: 14px; }

/* CONTEÚDO */
.main-wrapper { flex: 1; display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.conteudo-scroll { flex: 1; overflow-y: auto; padding: 20px; }
</style>