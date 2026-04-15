<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-left">
        <header class="header-title">
          <h1>Gestão de EPIs</h1>
        </header>

        <form @submit.prevent="fazerLogin" class="form-content">
          <h2>Login</h2>
          
          <div class="input-group">
            <input v-model="email" type="text" placeholder="E-mail ou usuário" required />
            <input v-model="senha" type="password" placeholder="Senha" required />
          </div>

          <button type="submit" :disabled="carregando" class="btn-submit">
            {{ carregando ? 'ENTRANDO...' : 'ENTRAR' }}
          </button>

          <p v-if="erro" class="error-msg">{{ erro }}</p>
        </form>
      </div>

      <div class="login-right">
        <div class="image-overlay"></div>
        <img src="../assets/login.png" alt="Equipamentos de Proteção">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabase } from '../composables/useSupabase'

const { supabase } = useSupabase()
const router = useRouter()

const email = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)

async function fazerLogin() {
  erro.value = ''
  carregando.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: senha.value,
    })
    if (error) throw error
    router.push('/dashboard')
  } catch (err) {
    erro.value = 'Credenciais inválidas ou erro de conexão.'
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
/* Estilização Geral */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  display: flex;
  width: 900px;
  height: 550px;
  background: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-radius: 8px;
}

/* Coluna Esquerda */
.login-left {
  flex: 1.2;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-title h1 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 50px;
  font-weight: 700;
}

.form-content {
  width: 100%;
  max-width: 300px;
  text-align: center;
}

.form-content h2 {
  text-align: left;
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #222;
}

.input-group input {
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 25px; 
  background: #fff;
  font-size: 0.9rem;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background-color: #4361ee; /* Azul vibrante */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover {
  background-color: #3046c4;
}

/* Coluna Direita (Imagem) */
.login-right {
  flex: 1;
  position: relative;
  /* O segredo do corte diagonal */
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
}

.login-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.error-msg {
  color: #e63946;
  font-size: 0.8rem;
  margin-top: 15px;
}
</style>

