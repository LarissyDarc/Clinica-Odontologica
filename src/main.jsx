import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import AppointmentForm from './AppointmentForm.jsx';
import AdminPage from './AdminPage.jsx';

function Tooth({ className = '' }) {
  return <svg className={className} viewBox="0 0 64 72" fill="none" aria-hidden="true"><path d="M32 12C19 2 6 9 8 25c1 10 7 14 8 27 1 16 9 18 12 2 2-12 6-12 8 0 3 16 11 14 12-2 1-13 7-17 8-27C58 9 45 2 32 12Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="m25 10 13 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
}
const services = [
  ['01', 'Prevenção e cuidado', 'Consultas de rotina e limpeza para cuidar da saúde do seu sorriso em todas as fases da vida.', 'Clínica geral'],
  ['02', 'Sorrisos alinhados', 'Avaliação personalizada para encontrar o tratamento ortodôntico que combina com você.', 'Ortodontia'],
  ['03', 'Sua melhor versão', 'Clareamento e cuidados estéticos planejados com atenção à naturalidade do seu sorriso.', 'Estética dental'],
  ['04', 'Confiança ao sorrir', 'Planejamento de implantes e reabilitação para recuperar conforto e função no dia a dia.', 'Implantodontia'],
];
function App() {
  const [menu, setMenu] = useState(false);

  const [faq, setFaq] = useState(null);
  const questions = [
    ['Como funciona a primeira consulta?', 'A proposta é começar com uma conversa sobre suas necessidades, seguida de uma avaliação. O plano de tratamento é explicado de forma individual, com espaço para todas as suas dúvidas.'],
    ['Posso agendar uma avaliação pelo site?', 'Você pode registrar uma solicitação pelo formulário. Os dados são salvos neste navegador e enviados ao banco online quando a conexão está configurada. A solicitação não confirma um horário de consulta.'],
    ['Qual tratamento é ideal para mim?', 'A indicação depende de uma avaliação individual com um profissional de odontologia. As informações desta página apresentam serviços de forma geral.'],
  ];
  return <>
    <a className="skip" href="#principal">Pular para o conteúdo</a>

    <header><div className="container nav">
      <a className="brand" href="#inicio" aria-label="Sorriso, início"><Tooth/><span>sorriso<small>ODONTOLOGIA & BEM-ESTAR</small></span></a>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="navigation">{menu ? 'Fechar ✕' : 'Menu ☰'}</button>
      <nav id="navigation" className={menu ? 'open' : ''} aria-label="Navegação principal" onClick={() => setMenu(false)}><a href="#inicio">Início</a><a href="#tratamentos">Tratamentos</a><a href="#sobre">Sobre nós</a><a href="#clinica">A clínica</a><a className="button small" href="#agendamento">Agende uma avaliação <span>↗</span></a></nav>
    </div></header>
    <main id="principal">
      <section className="hero" id="inicio">
        <img className="hero-photo" src={`${import.meta.env.BASE_URL}images/clinic.jpg`} alt="" fetchPriority="high" width="1200" height="802"/>
        <div className="hero-shade"/>
        <div className="container hero-inner"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line"/> ODONTOLOGIA & BEM-ESTAR</p><h1>Um sorriso saudável.<br/>Uma vida com<br/><em>mais confiança.</em></h1><p className="lead">Cuidado atento, acolhimento e um olhar especial para a saúde e a beleza do seu sorriso.</p><a className="button" href="#agendamento">Agendar uma avaliação <span>↗</span></a><div className="hero-note"><span>✓</span> Cuidado individual em cada etapa</div></div><div className="hero-caption"><span>CLÍNICA SORRISO</span><p>Seu bem-estar.<br/>Nossa inspiração.</p><small>Imagem ilustrativa</small></div></div>
        <a className="hero-scroll" href="#tratamentos" aria-label="Conheça nossos tratamentos">CONHEÇA NOSSOS CUIDADOS <span>↓</span></a>
      </section>
      <div className="values-wrap"><div className="values container"><div><span>✧</span> Atenção aos detalhes</div><div><span>♡</span> Atendimento acolhedor</div><div><span>◎</span> Cuidado personalizado</div><div><span>↗</span> Foco no seu bem-estar</div></div></div>
      <section className="section container" id="tratamentos"><div className="section-heading"><div><p className="eyebrow">PARA CADA SORRISO, UM CAMINHO</p><h2>Tratamentos para o seu<br/><em>melhor sorriso.</em></h2></div><p>Da prevenção à transformação, encontre o cuidado que acompanha o seu momento.</p></div><div className="service-grid">{services.map(([n, title, description, label]) => <article className="service" key={n}><div className="service-top"><Tooth/><span>{n}</span></div><p className="service-label">{label}</p><h3>{title}</h3><p>{description}</p><a href="#agendamento">Saiba mais <span>↗</span></a></article>)}</div></section>
      <section className="about-wrap" id="sobre"><div className="container about"><figure className="about-photo"><img src={`${import.meta.env.BASE_URL}images/dental-care.jpg`} alt="Detalhe de uma avaliação odontológica com instrumentos de exame" loading="lazy" width="1800" height="1350"/><figcaption>ATENÇÃO EM CADA DETALHE <span>Imagem ilustrativa</span></figcaption></figure><div><p className="eyebrow">CONHEÇA A CLÍNICA SORRISO</p><h2>Odontologia feita<br/>com cuidado.<br/><em>De pessoa para pessoa.</em></h2><p>Por trás de cada sorriso existe uma história. Nossa proposta começa pela escuta: entender o que você precisa, acolher suas dúvidas e planejar cada etapa junto com você.</p><p>Prevenção, saúde e estética se encontram em um atendimento individual, com orientações claras e respeito ao seu tempo.</p><div className="about-signature"><Tooth/><span>Cuidar é a nossa essência.<small>CLÍNICA SORRISO · ODONTOLOGIA & BEM-ESTAR</small></span></div><a className="button outline" href="#agendamento">Vamos conversar? <span>↗</span></a></div></div></section>
      <section className="section container clinic" id="clinica"><div className="section-heading"><div><p className="eyebrow">BEM-VINDO A UM NOVO CUIDADO</p><h2>Um ambiente que também<br/><em>cuida de você.</em></h2></div><p>Conforto e tranquilidade fazem parte da experiência que imaginamos para a Sorriso.</p></div><div className="clinic-gallery"><figure><img src={`${import.meta.env.BASE_URL}images/clinic.jpg`} alt="Consultório claro com cadeira odontológica e iluminação natural" loading="lazy" width="1200" height="802"/><figcaption>Um espaço para se sentir à vontade <span>01 / AMBIENTE</span></figcaption></figure><div className="clinic-detail"><span className="detail-flower">✳</span><p>O cuidado está<br/>nos detalhes.</p><span>DA PRIMEIRA CONVERSA<br/>AO SEU PRÓXIMO SORRISO.</span><a href="#agendamento" aria-label="Solicitar avaliação">↗</a></div></div><p className="image-disclaimer">Fotografias ilustrativas · Projeto de uma clínica fictícia.</p></section>
      <section className="section container" id="cuidado"><div className="center"><p className="eyebrow">DO PRIMEIRO OLÁ AO SEU NOVO SORRISO</p><h2>Você participa de <em>cada etapa.</em></h2></div><div className="steps">{[['01','A gente escuta','Uma conversa para entender suas expectativas e acolher suas dúvidas.'],['02','Planejamos juntos','Uma avaliação para apresentar possibilidades e construir seu plano de cuidado.'],['03','Cuidamos de você','Acompanhamento e orientações para que o cuidado continue no dia a dia.']].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
      <section className="container booking" id="agendamento"><div><p className="eyebrow">SEU PRIMEIRO PASSO COMEÇA AQUI</p><h2>Vamos cuidar<br/>do seu <em>sorriso?</em></h2><p>Preencha seus dados para registrar uma solicitação de avaliação. Após o envio, você verá a confirmação do salvamento.</p></div><AppointmentForm/></section>
      <section className="section container faq"><div><p className="eyebrow">PODE PERGUNTAR</p><h2>Mais clareza.<br/><em>Mais tranquilidade.</em></h2></div><div>{questions.map(([q,a], i) => <div className="faq-item" key={q}><h3><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} aria-controls={`answer-${i}`}>{q}<span>{faq === i ? '−' : '+'}</span></button></h3><p id={`answer-${i}`} hidden={faq !== i}>{a}</p></div>)}</div></section>
    </main><a className="floating-contact" href="#agendamento" aria-label="Ir para o formulário de avaliação"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.2A8 8 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.7"/><path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg><span>Agende sua avaliação</span></a><footer><div className="container footer-main"><a className="brand" href="#inicio"><Tooth/><span>sorriso<small>ODONTOLOGIA & BEM-ESTAR</small></span></a><p>Cuidar de você.<br/>Fazer o seu sorriso acontecer.</p><a href="#inicio">Voltar ao início ↑</a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Sorriso · Projeto acadêmico em React.</span><a href="#/admin">Administração</a><span>Clínica fictícia. Conteúdo ilustrativo.</span></div></footer>
  </>;
}
function Router() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const admin = hash === '#/admin' || hash === '#/admin/';
  useEffect(() => { window.scrollTo(0, 0); }, [admin]);
  return admin ? <AdminPage/> : <App/>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><Router/></React.StrictMode>);
