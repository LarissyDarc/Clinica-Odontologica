import React, { useEffect, useRef, useState } from 'react';
import { databaseConfigured, readRequests, removeRequest, saveRequest, sendRequest, STORAGE_KEY } from './requests.js';

const config = { url: import.meta.env.VITE_SUPABASE_URL || '', key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '' };

export default function AdminPage() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [confirmId, setConfirmId] = useState(null);

  function refresh() {
    try { setRecords(readRequests(window.localStorage)); setError(''); }
    catch { setRecords([]); setError('Não foi possível ler as solicitações deste navegador. Os dados existentes não foram alterados.'); }
  }
  useEffect(() => {
    document.title = 'Administração — Sorriso';
    refresh();
    function onStorage(event) { if (event.key === STORAGE_KEY || event.key === null) refresh(); }
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('focus', refresh); document.title = 'Sorriso — Odontologia & bem-estar'; };
  }, []);

  async function sync(record) {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setMessage('Enviando solicitação…');
    try {
      const synced = await sendRequest(record, config);
      try { setRecords(saveRequest(window.localStorage, synced)); setMessage('Solicitação recebida pelo banco online.'); }
      catch { setMessage('O banco recebeu a solicitação, mas não foi possível atualizar a cópia local.'); }
    } catch { setMessage('O envio não foi confirmado. A solicitação continua salva neste navegador para uma nova tentativa.'); }
    finally { inFlight.current = false; setBusy(false); }
  }
  function forget(id) {
    try { setRecords(removeRequest(window.localStorage, id)); setConfirmId(null); setMessage('Cópia local removida. Registros já enviados ao banco não foram excluídos.'); }
    catch { setMessage('Não foi possível remover a cópia local.'); }
  }
  const visible = records.filter(record => (filter === 'all' || record.status === filter) && `${record.name} ${record.email} ${record.service}`.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR')));
  return <div className="admin-page">
    <header><div className="container admin-header"><a className="brand" href="#inicio"><span>sorriso<small>PAINEL DE ADMINISTRAÇÃO</small></span></a><a href="#inicio">← Voltar ao site</a></div></header>
    <main className="container admin-main"><p className="eyebrow">ADMINISTRAÇÃO</p><h1>Solicitações de avaliação</h1><p className="admin-intro">Consulte os contatos e acompanhe o envio das solicitações.</p>
      <aside className="admin-notice">Painel local: mostra somente os registros salvos neste navegador e neste endereço. Não possui login e não reúne contatos de outros dispositivos. A consulta centralizada está disponível no painel do Supabase após configurar o banco.</aside>
      <div className="admin-stats"><article><span>Total de solicitações</span><strong>{records.length}</strong></article><article><span>Pendentes de envio</span><strong>{records.filter(item => item.status === 'pending').length}</strong></article><article><span>Recebidas pelo banco</span><strong>{records.filter(item => item.status === 'synced').length}</strong></article></div>
      <div className="admin-toolbar"><label>Buscar solicitação<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Nome, e-mail ou tratamento"/></label><label>Estado do envio<select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">Todas</option><option value="pending">Pendentes</option><option value="synced">Recebidas pelo banco</option></select></label><button className="button" type="button" disabled={busy} onClick={refresh}>Atualizar</button></div>
      {error && <p className="admin-error" role="alert">{error}</p>}<p className="admin-feedback" role="status">{message}</p>
      {!error && !visible.length && <div className="admin-empty">{records.length ? 'Nenhuma solicitação corresponde aos filtros.' : 'Nenhuma solicitação neste navegador. Os novos registros aparecerão aqui após o preenchimento do formulário.'}</div>}
      <div className="admin-list">{visible.map(record => <article className="admin-request" key={record.id}><div className="admin-request-heading"><h2>{record.name}</h2><span className={`admin-badge ${record.status}`}>{record.status === 'synced' ? 'Recebida pelo banco' : 'Pendente de envio'}</span></div><dl><div><dt>E-mail</dt><dd><a href={`mailto:${record.email}`}>{record.email}</a></dd></div><div><dt>Tratamento</dt><dd>{record.service}</dd></div><div><dt>Registrada em</dt><dd><time dateTime={record.createdAt}>{new Date(record.createdAt).toLocaleString('pt-BR')}</time></dd></div></dl><div className="admin-actions">{record.status === 'pending' && databaseConfigured(config) && <button className="button" disabled={busy} onClick={() => sync(record)}>Enviar ao banco</button>}{confirmId === record.id ? <><span>Remover somente a cópia deste navegador?</span><button className="admin-delete" disabled={busy} onClick={() => forget(record.id)}>Confirmar remoção</button><button disabled={busy} onClick={() => setConfirmId(null)}>Cancelar</button></> : <button className="admin-delete" disabled={busy} onClick={() => setConfirmId(record.id)}>Remover cópia local</button>}</div></article>)}</div>
    </main>
  </div>;
}