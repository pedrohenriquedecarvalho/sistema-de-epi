<template>
  <div class="page">
    <div class="layout-container">
      <header class="header-section">
        <h1>Painel de Controle de EPIs</h1>
        <p>Gestão de inventário e rastreabilidade de entregas.</p>
      </header>

      <div v-if="loadingEstoque || loading" class="info-banner">Sincronizando dados com o servidor...</div>

      <!-- Grid de Gráficos Responsivo -->
      <div class="dashboard-grid">
        <div class="card chart-card">
          <div class="card-header"><h3>Saúde do Inventário</h3></div>
          <div class="chart-box">
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
          <div class="chart-box">
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

      <!-- Filtros Responsivos -->
      <div class="card filter-card">
        <div class="form-row">
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
          <button class="btn btn-primary" @click="buscarTudo" :disabled="loading">🔄 Atualizar Dados</button>
          <button class="btn btn-pdf" @click="exportarPDF" :disabled="entregas.length === 0">📄 Gerar PDF</button>
        </div>
      </div>

      <!-- Tabela Responsiva com Scroll Lateral -->
      <div class="card table-card">
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Funcionário</th>
                <th>EPI Fornecido</th>
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
                    {{ e.assinatura_digital ? 'Assinado' : 'Pendente' }}
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
.page { 
  background-color: #f3f4f6; 
  min-height: 100vh; 
  padding: clamp(10px, 3vw, 20px); 
  font-family: sans-serif; 
}

.layout-container { 
  max-width: 1100px; 
  margin: 0 auto; 
  background: white; 
  padding: clamp(15px, 4vw, 30px); 
  border-radius: 16px; 
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.header-section { margin-bottom: 25px; }
.header-section h1 { font-size: clamp(20px, 5vw, 24px); color: #111827; margin-bottom: 5px; }
.header-section p { color: #6b7280; font-size: 14px; }

.dashboard-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 20px; 
  margin-bottom: 30px; 
}

.chart-box { height: 250px; position: relative; }
.card { border: 1px solid #e5e7eb; padding: 20px; border-radius: 12px; background: #fff; }
.card-header h3 { font-size: 16px; margin-bottom: 15px; color: #374151; }

/* Formulário Responsivo */
.form-row { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
  gap: 15px; 
  margin-bottom: 20px; 
}

.form-group { display: flex; flex-direction: column; font-weight: bold; font-size: 14px; color: #4b5563; }
.form-group label { margin-bottom: 5px; }

input, select { 
  padding: 10px; 
  border: 1px solid #d1d5db; 
  border-radius: 8px; 
  background: #f9fafb;
  width: 100%;
}

.action-bar { 
  display: flex; 
  gap: 10px; 
  flex-wrap: wrap; /* Faz os botões quebrarem linha no mobile */
}

.btn { 
  padding: 12px 20px; 
  border-radius: 8px; 
  border: none; 
  cursor: pointer; 
  font-weight: bold; 
  flex: 1; /* Botões crescem igualmente */
  min-width: 150px;
  transition: opacity 0.2s;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: #2563eb; color: white; }
.btn-pdf { background: #10b981; color: white; }

/* Tabela Responsiva */
.table-responsive { 
  width: 100%; 
  overflow-x: auto; /* Scroll horizontal */
  -webkit-overflow-scrolling: touch;
  margin-top: 10px;
}

.styled-table { 
  width: 100%; 
  border-collapse: collapse; 
  min-width: 600px; /* Garante que a tabela não fique ilegível */
}

.styled-table th { 
  background: #f9fafb; 
  padding: 12px; 
  text-align: left; 
  font-size: 13px; 
  color: #6b7280;
  border-bottom: 2px solid #f3f4f6;
}

.styled-table td { 
  padding: 14px 12px; 
  border-bottom: 1px solid #f3f4f6; 
  font-size: 14px;
}

.badge { 
  padding: 4px 10px; 
  border-radius: 20px; 
  font-size: 12px; 
  font-weight: 600;
  display: inline-block;
}

.badge-ok { background: #dcfce7; color: #15803d; }
.badge-warn { background: #fee2e2; color: #b91c1c; }

.info-banner { 
  background: #dbeafe; 
  color: #1e40af;
  padding: 10px; 
  text-align: center; 
  margin-bottom: 20px; 
  border-radius: 8px; 
  font-size: 14px;
}

/* Media Queries para ajustes finos */
@media (max-width: 640px) {
  .layout-container { padding: 15px; border-radius: 0; }
  .action-bar .btn { width: 100%; flex: none; }
  .dashboard-grid { grid-template-columns: 1fr; }
}
</style>