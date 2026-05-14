<template>
  <main class="container">
    <header class="header-section">
      <div class="header-content">
        <h1>Controle de Estoque de EPI</h1>
        <p>Monitoramento baseado nos itens cadastrados e entregues</p>
      </div>
      <button class="btn-refresh" @click="carregarDados" :disabled="loading">
        {{ loading ? 'Sincronizando...' : '🔄 Atualizar' }}
      </button>
    </header>

    <!-- Cards Responsivos -->
    <section class="cards">
      <article class="card">
        <header class="card-header">📉 Total em Estoque</header>
        <p class="numero">{{ totais.estoque }}</p>
      </article>
      <article class="card">
        <header class="card-header">⚠️ Itens Vencidos</header>
        <p class="numero" :class="{ 'text-danger': totais.vencidos > 0 }">{{ totais.vencidos }}</p>
      </article>
      <article class="card">
        <header class="card-header">📦 EPIs em Uso</header>
        <p class="numero">{{ totais.uso }}</p>
      </article>
    </section>

    <!-- Formulário Responsivo -->
    <section class="card-form">
      <div class="form-row">
        <div class="form-group select-group">
          <label>Selecione o EPI Cadastrado</label>
          <select v-model="form.id" class="custom-input">
            <option value="">Escolha um item...</option>
            <option v-for="item in itens" :key="item.id" :value="item.id">
              {{ item.nome_epi }} (Saldo atual: {{ item.quantidade }})
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Quantidade</label>
          <input type="number" v-model.number="form.quantidade" class="custom-input" min="0" />
        </div>
        <div class="form-group btn-group">
          <button class="btn-primary" @click="atualizarEstoque" :disabled="!form.id || loading">
            Salvar Alteração
          </button>
        </div>
      </div>
    </section>

    <!-- Tabela Responsiva com Scroll -->
    <section class="tabela-container">
      <div class="tabela-scroll">
        <div class="tabela">
          <header class="table-header">
            <span>Nome do EPI</span>
            <span>C.A.</span>
            <span>Saldo</span>
            <span>Validade</span>
            <span>Situação</span>
          </header>

          <div v-if="loading" class="loading-state">Carregando...</div>

          <article v-for="item in itens" :key="item.id" class="table-row">
            <span class="text-bold">{{ item.nome_epi }}</span>
            <span>{{ item.ca }}</span>
            <span class="text-bold">{{ item.quantidade }}</span>
            <span class="date-text">{{ formatarData(item.validade) }}</span>
            <span>
              <span :class="verificarVencimento(item.validade) ? 'badge-danger' : 'badge-ok'" class="badge">
                {{ verificarVencimento(item.validade) ? 'Vencido' : 'Regular' }}
              </span>
            </span>
          </article>
          
          <div v-if="!loading && itens.length === 0" class="empty-state">
            Nenhum EPI encontrado no cadastro.
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useSupabase } from '../composables/useSupabase'

const { supabase } = useSupabase()
const itens = ref([])
const loading = ref(true)
const form = ref({ id: '', quantidade: 0 })
const totais = reactive({ estoque: 0, vencidos: 0, uso: 0 })

function verificarVencimento(dataString) {
  if (!dataString) return false
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const dataValidade = new Date(dataString)
  return dataValidade < hoje
}

function formatarData(data) {
  if (!data) return 'N/A'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

async function carregarDados() {
  loading.value = true
  try {
    const { data: epiData, error: epiError } = await supabase
      .from('cadastro_epi')
      .select('id, nome_epi, ca, quantidade, validade')
      .order('nome_epi', { ascending: true })

    if (epiError) throw epiError

    const { data: entregasData, error: entregasError } = await supabase
      .from('entregas')
      .select('quantidade_entregue')

    if (entregasError) throw entregasError

    itens.value = epiData || []
    totais.estoque = (epiData || []).reduce((acc, curr) => acc + (Number(curr.quantidade) || 0), 0)
    totais.vencidos = (epiData || []).filter(i => verificarVencimento(i.validade)).length
    totais.uso = (entregasData || []).reduce((acc, curr) => acc + (Number(curr.quantidade_entregue) || 0), 0)
    
  } catch (error) {
    console.error('Erro:', error.message)
  } finally {
    loading.value = false
  }
}

async function atualizarEstoque() {
  if (!form.value.id) return
  loading.value = true
  try {
    const { error } = await supabase
      .from('cadastro_epi')
      .update({ quantidade: form.value.quantidade })
      .eq('id', form.value.id)

    if (error) throw error
    await carregarDados()
    form.value = { id: '', quantidade: 0 }
    alert('Estoque atualizado!')
  } catch (error) {
    alert('Erro ao salvar: ' + error.message)
  } finally {
    loading.value = false
  }
}

onMounted(carregarDados)
</script>

<style scoped>
.container { padding: 20px; max-width: 1100px; margin: 0 auto; font-family: sans-serif; color: #334155; }

/* Header Responsivo */
.header-section { 
  display: flex; 
  flex-direction: row; 
  justify-content: space-between; 
  align-items: center; 
  gap: 15px; 
  margin-bottom: 30px; 
}
.header-content h1 { font-size: 1.5rem; margin: 0; }
.header-content p { margin: 5px 0 0 0; color: #64748b; }

.btn-refresh { 
  background: white; 
  border: 1px solid #cbd5e1; 
  padding: 8px 16px; 
  border-radius: 8px; 
  cursor: pointer; 
  white-space: nowrap;
}

/* Cards em Grid */
.cards { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 20px; 
  margin-bottom: 30px; 
}
.card { 
  background: #fff; 
  border: 1px solid #e2e8f0; 
  border-radius: 12px; 
  padding: 20px; 
  text-align: center; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
}
.card-header { font-size: 0.85rem; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
.numero { font-size: 28px; font-weight: 800; margin: 0; color: #1e293b; }
.text-danger { color: #dc2626; }

/* Formulário Responsivo */
.card-form { background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 30px; }
.form-row { 
  display: grid; 
  grid-template-columns: 2fr 1fr 1fr; 
  gap: 15px; 
  align-items: flex-end; 
}
.form-group { display: flex; flex-direction: column; gap: 8px; }
.custom-input { padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; width: 100%; box-sizing: border-box; }
.btn-primary { background: #2563eb; color: white; border: none; padding: 11px; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; }

/* Tabela com Scroll Lateral */
.tabela-container { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.tabela-scroll { overflow-x: auto; }
.tabela { min-width: 700px; } /* Garante que a tabela não esprema colunas */

.table-header { 
  display: grid; 
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr; 
  font-weight: 700; 
  padding: 14px; 
  background: #f1f5f9; 
  font-size: 0.85rem; 
}
.table-row { 
  display: grid; 
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr; 
  padding: 16px 14px; 
  border-bottom: 1px solid #f1f5f9; 
  align-items: center; 
}

.badge { padding: 4px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.badge-ok { background: #dcfce7; color: #166534; }
.badge-danger { background: #fee2e2; color: #991b1b; }
.text-bold { font-weight: 600; }
.loading-state, .empty-state { padding: 40px; text-align: center; color: #94a3b8; }

/* Mobile adjustments (Breakpoints) */
@media (max-width: 768px) {
  .header-section { flex-direction: column; align-items: flex-start; }
  .btn-refresh { width: 100%; }
  
  .form-row { 
    grid-template-columns: 1fr; /* Coluna única no mobile */
  }
  
  .select-group { order: 1; }
  .form-group:nth-child(2) { order: 2; }
  .btn-group { order: 3; margin-top: 10px; }
  
  .numero { font-size: 24px; }
}
</style>