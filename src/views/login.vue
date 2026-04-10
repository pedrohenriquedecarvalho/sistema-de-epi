<template>
  <div class="login-container">
    <form @submit.prevent="fazerLogin">
      <input v-model="email" type="email" placeholder="E-mail" required />
      <input v-model="senha" type="password" placeholder="Senha" required />
      
      <button type="submit" :disabled="carregando">
        {{ carregando ? 'Entrando...' : 'Entrar' }}
      </button>

      <p v-if="erro" style="color: red;">{{ erro }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabase } from '../composables/useSupabase'

// Inicialização de ferramentas
const { supabase } = useSupabase()
const router = useRouter()

// Estado reativo (Ref)
const email = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)

// Função de Login
async function fazerLogin() {
  erro.value = ''
  carregando.value = true

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: senha.value,
    })

    if (error) throw error

    // Redireciona após login com sucesso
    router.push('/dashboard')
  } catch (err) {
    erro.value = 'Credenciais inválidas ou erro de conexão.'
    console.error('Erro de login:', err.message)
  } finally {
    carregando.value = false
  }
}
</script>

