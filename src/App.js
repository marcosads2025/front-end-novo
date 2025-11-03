// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Cadastro from './Cadastro';

function App() {
  return (
    // O BrowserRouter fica aqui, envolvendo todas as rotas
    <BrowserRouter>
      {/* Este div geral pode ser usado para estilização global */}
      <div style={{ minHeight: '100vh' }}>

        {/* Header que aparecerá em todas as páginas */}
        <header className="py-3">
          <div className="container">
            <h1 className="text-center mb-4 text-primary">API Dog</h1>
            {/* Um bom lugar para adicionar um menu de navegação no futuro */}
          </div>
        </header>

        {/* Conteúdo principal que muda de acordo com a rota */}
        <main className="container mb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro" element={<Cadastro />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;