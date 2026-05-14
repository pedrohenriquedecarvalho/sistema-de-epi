<template>
  <div class="page">
    <div class="layout-container">
      <header class="header-section">
        <h1>Painel de Controle de EPIs</h1>
        <p>Gestão de inventário e rastreabilidade de entregas.</p>
      </header>

      <div v-if="loadingEstoque || loading" class="info-banner">Sincronizando dados com o servidor...</div>

      <!-- Grid de Gráficos -->
      <div class="dashboard-grid">
        <div class="card chart-card">
          <div class="card-header"><h3>Saúde do Inventário</h3></div>
          <div class="chart-container">
            <Pie 
              v-if="estoqueProcessado.length > 0" 
              :data="pieChartData" 
              :options="chartOptions" 
              :key="'pie-' + componentKey"
            />
            <div v-else class="placeholder">Aguardando dados...</div>
          </div>
        </div>

        <div class="card chart-card">
          <div class="card-header"><h3>Níveis Críticos</h3></div>
          <div class="chart-container">
            <Bar 
              v-if="estoqueProcessado.length > 0" 
              :data="barChartData" 
              :options="chartOptions" 
              :key="'bar-' + componentKey"
            />
            <div v-else class="placeholder">Analisando níveis...</div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card filter-card">
        <div class="filter-grid">
          <div class="form-group">
            <label>Funcionário</label>
            <select v-model="filtros.funcionario_id">
              <option value="">Todos os Colaboradores</option>
              <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Data Início</label>
            <input type="date" v-model="filtros.data_inicio" />
          </div>
          <div class="form-group">
            <label>Data Fim</label>
            <input type="date" v-model="filtros.data_fim" />
          </div>
        </div>
        <div class="action-bar">
          <button class="btn btn-primary" @click="buscarTudo" :disabled="loading">🔄 Atualizar</button>
          <button class="btn btn-pdf" @click="exportarPDF" :disabled="entregas.length === 0">📄 Gerar PDF</button>
        </div>
      </div>

      <!-- Tabela -->
      <div class="card table-card">
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Funcionário</th>
                <th>EPI</th>
                <th class="text-center">Qtd</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in entregas" :key="e.id">
                <td>{{ formatarData(e.data_entrega) }}</td>
                <td><strong>{{ e.funcionarios?.nome || 'N/A' }}</strong></td>
                <td>{{ e.cadastro_epi?.nome_epi || 'EPI não vinculado' }}</td>
                <td class="text-center">{{ e.quantidade_entregue }}</td>
                <td class="text-center">
                  <span :class="e.assinatura_digital ? 'badge badge-ok' : 'badge badge-warn'">
                    {{ e.assinatura_digital ? 'OK' : 'Pendente' }}
                  </span>
                </td>
              </tr>
              <tr v-if="entregas.length === 0">
                <td colspan="5" class="text-center">Nenhuma entrega encontrada.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* ... Mantendo sua lógica de Script Setup original ... */
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)

const { supabase } = useSupabase()
const entregas = ref([])
const funcionarios = ref([])
const estoqueProcessado = ref([])
const loading = ref(false)
const loadingEstoque = ref(false)
const componentKey = ref(0)
const filtros = ref({ funcionario_id: '', data_inicio: '', data_fim: '' })

const pieChartData = computed(() => {
  const data = estoqueProcessado.value || []
  return {
    labels: ['OK', 'Baixo', 'Esgotado'],
    datasets: [{
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      data: [
        data.filter(i => i.quantidade >= 10).length,
        data.filter(i => i.quantidade < 10 && i.quantidade > 0).length,
        data.filter(i => i.quantidade <= 0).length
      ]
    }]
  }
})

const barChartData = computed(() => {
  const criticos = [...estoqueProcessado.value].sort((a, b) => a.quantidade - b.quantidade).slice(0, 5)
  return {
    labels: criticos.map(i => i.nome_epi),
    datasets: [{ label: 'Estoque', backgroundColor: '#ef4444', data: criticos.map(i => i.quantidade) }]
  }
})

const chartOptions = { responsive: true, maintainAspectRatio: false }

async function carregarEstoqueEfetivo() {
  loadingEstoque.value = true
  try {
    const [resEstoque, resEpis] = await Promise.all([
      supabase.from('estoque').select('*'),
      supabase.from('cadastro_epi').select('id, nome_epi')
    ])
    if (resEstoque.error) throw resEstoque.error
    if (resEpis.error) throw resEpis.error
    const episMap = Object.fromEntries(resEpis.data.map(item => [item.id, item.nome_epi]))
    estoqueProcessado.value = (resEstoque.data || []).map(item => ({
      ...item,
      nome_epi: episMap[item.epi_id] || 'EPI Desconhecido'
    }))
    componentKey.value++
  } catch (err) {
    console.error("Erro estoque:", err.message)
  } finally {
    loadingEstoque.value = false
  }
}

async function buscarEntregas() {
  loading.value = true
  try {
    let query = supabase
      .from('entregas')
      .select('*, funcionarios(nome), cadastro_epi(nome_epi, ca)')
      .order('data_entrega', { ascending: false })
    if (filtros.value.funcionario_id) query = query.eq('funcionario_id', filtros.value.funcionario_id)
    if (filtros.value.data_inicio) query = query.gte('data_entrega', filtros.value.data_inicio)
    if (filtros.value.data_fim) query = query.lte('data_entrega', filtros.value.data_fim)
    const { data, error } = await query
    if (error) throw error
    entregas.value = data || []
  } catch (err) {
    console.error("Erro entregas:", err.message)
  } finally {
    loading.value = false
  }
}

async function carregarFuncionarios() {
  const { data } = await supabase.from('funcionarios').select('id, nome').order('nome')
  funcionarios.value = data || []
}

function exportarPDF() {
  const doc = new jsPDF()
  doc.text('Relatório de Entregas', 14, 20)
  autoTable(doc, {
    startY: 30,
    head: [['Data', 'Funcionário', 'EPI', 'Qtd', 'Status']],
    body: entregas.value.map(e => [
      formatarData(e.data_entrega),
      e.funcionarios?.nome || 'N/A',
      e.cadastro_epi?.nome_epi || 'N/A',
      e.quantidade_entregue,
      e.assinatura_digital ? 'Assinado' : 'Pendente'
    ]),
  })
  doc.save('relatorio.pdf')
}

const buscarTudo = () => { carregarEstoqueEfetivo(); buscarEntregas(); }
const formatarData = (d) => d ? new Date(d).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '—'

onMounted(() => { carregarFuncionarios(); buscarTudo(); })
</script>

<style scoped>
/* Reset e Base */
.page {
  background-color: #f3f4f6;
  min-height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}

.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Card General Style */
.card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
}

/* Header */
.header-section h1 { font-size: 1.5rem; color: #111827; margin: 0; }
.header-section p { color: #6b7280; margin: 5px 0 0 0; }

/* Grid de Gráficos - Responsivo */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr; /* 1 coluna no mobile */
  gap: 15px;
}

@media (min-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr 1fr; } /* 2 colunas no tablet/desktop */
}

.chart-container {
  height: 250px;
  position: relative;
}

/* Filtros */
.filter-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

@media (min-width: 640px) {
  .filter-grid { grid-template-columns: 2fr 1fr 1fr; }
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
}

/* Action Bar */
.action-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (min-width: 640px) {
  .action-bar { flex-direction: row; }
}

.btn {
  padding: 12px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
}

.btn-primary { background: #2563eb; color: white; }
.btn-pdf { background: #10b981; color: white; }

/* Tabela Responsiva */
.table-responsive {
  width: 100%;
  overflow-x: auto; /* Scroll horizontal habilitado */
  -webkit-overflow-scrolling: touch;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px; /* Garante que a tabela não "esprema" no mobile */
}

.styled-table th {
  background: #f9fafb;
  padding: 12px;
  text-align: left;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #6b7280;
  border-bottom: 2px solid #f3f4f6;
}

.styled-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.9rem;
}

/* Badges */
.badge {
  padding: 4px 8px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-ok { background: #dcfce7; color: #15803d; }
.badge-warn { background: #fee2e2; color: #b91c1c; }

/* Feedback */
.info-banner {
  background: #dbeafe;
  color: #1e40af;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: center;
}

.text-center { text-align: center; }
</style>
