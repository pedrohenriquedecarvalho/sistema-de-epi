<template>
  <main class="container">

    <!-- CARDS -->
    <section class="cards">

      <article class="card">
        <header class="card-header">
          📉 EPIs em estoque
        </header>
        <p class="numero">150</p>
      </article>

      <article class="card">
        <header class="card-header">
          ⚠️ EPIs vencidos
        </header>
        <p class="numero">50</p>
      </article>

      <article class="card">
        <header class="card-header">
          📦 EPIs em uso
        </header>
        <p class="numero">5</p>
      </article>

    </section>

    <!-- TABELA -->
    <section class="tabela">

      <header class="table-header">
        <span>Nome do EPI</span>
        <span>CA</span>
        <span>Quantidade</span>
        <span>Última atualização</span>
      </header>

      <!-- LINHAS FIXAS -->
      <article class="table-row">
        <span>Sapato de Segurança</span>
        <span>1222</span>
        <span>10</span>
        <span>20/05/26</span>
      </article>

      <article class="table-row">
        <span>Óculos de proteção</span>
        <span>1222</span>
        <span>10</span>
        <span>20/05/26</span>
      </article>

      <article class="table-row">
        <span>Protetor Auricular</span>
        <span>1222</span>
        <span>10</span>
        <span>20/05/26</span>
      </article>

      <article class="table-row">
        <span>Capacete de segurança</span>
        <span>1222</span>
        <span>10</span>
        <span>20/05/26</span>
      </article>

      <article class="table-row">
        <span>Luvas</span>
        <span>1222</span>
        <span>10</span>
        <span>20/05/26</span>
      </article>

    </section>

  </main>
</template>

<style scoped>
.container {
  padding: 30px;
  background: #ffffff;
  font-family: Arial, sans-serif;
  margin-top: 50px;
}

/* CARDS */
.cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.card {
  width: 30%;
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  border: 1px solid #00000036;
}

.card-header {
  font-weight: bold;
  margin-bottom: 40px;
}

.numero {
  font-size: 40px;
  margin: 0;
  color: #000;
}

/* TABELA */
.tabela {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 0 10px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background: #dbdbdb;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>

