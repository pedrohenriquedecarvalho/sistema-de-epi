<template>
  <main>
    <h1>Bem-Vindo ao Sistemas <br> de Gestão de EPIs</h1>
    <p class="principal">
      Monitore, controle e garanta a segurança na distribuição de <br>
      equipamentos de proteção individual de forma simples <br>
      e eficiente.
    </p>
    <img src="../assets/inicial.png" alt="sistema de epi" id="tela">
  </main>

  <div class="container-cards">
    <section class="card">
        <img src="../assets/1.png" alt="logo" id="gerencie">
      <h2>Gerencie EPIs</h2>
      <p>Cadastre e mantenha seu <br> estoque de EPIs atualizado <br> para reposição rápida.</p>
    </section>

    <section class="card">
      <h2>Controle de <br>Movimentações</h2>
      <p>Registre quais EPIs foram <br> retirados, devolvidos ou estão <br> vencidos.</p>
    </section>

    <section class="card">
      <h2>Análise Relatórios</h2>
      <p>Visualize dados de distribuição,<br> uso e vencimento dos EPIs.</p>
    </section>

     <section class="card">
      <h2>Análise Relatórios</h2>
      <p>Visualize dados de distribuição,<br> uso e vencimento dos EPIs.</p>
    </section>
   
  </div>
     <footer>
        <h4 class="ajuste">Contato</h4>
        <p class="ajuste">Telefone: (19)97361-2538</p>
        <p class="ajuste">E-mail: gerenciamentodeepi@gmail.com</p>
    </footer>
</template>

<script>
export default {
name: 'home'
}
</script>

<style>
  * { 
    margin: 0px;
    padding: 0px;
   
    
  }

  main {
    margin-top: 80px;
    background-color: #d0caca6c;
    display: flex;       
    align-items: center;   
    justify-content: space-between;
   border: 1px solid top hsl(0, 1%, 56%);
   box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.288);
 

  }

  .container-cards {
    display: flex;
    justify-content: center; 
    gap: 300px;              
    margin: 60px ;      
    margin-bottom: 200px;
    padding: 80px;
    
  }

  
  .card {
    display: flexbox;
    background-color: white;
    border: 1px solid hwb(0 80% 20%);
    border-radius: 8px;
    padding: 40px;
    flex: 1;                 
    max-width: 350px;   
    height: 350px;     
    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
    margin-top: 100px;
     box-sizing: border-box; 
   
  }

  .card h2 {
    font-size: 30px;
    margin-bottom: 10px;
  }

  .card p {
    font-size: 20px;
    color: #555;
  }
  .principal{
    margin-top: 150px;
    font-size: 40px;
    padding-bottom: 100px;
    
  
    
  }
  h1{
    padding-left: 50px;
    font-size: 70px;
    padding-bottom: 250px;
  }
  #tela{
    max-width: 700px;     
    height: auto;
    border-radius: 10px;
    padding-right: 200px;
  }
  p{
    font-size: 40px;
  }
  #gerencie{
    display: flex;        
    align-items: center;   
    gap: 15px;             
    margin-bottom: 20px;   
    width: 28px;           
    height: 28px;
    
    
  }

footer {
    background-color: #111827;
    padding: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    width: 100%;
    
}

.ajuste{
    color: rgb(255, 255, 255);
    margin-top: 31px;
}

</style>