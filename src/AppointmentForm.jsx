import React, { useRef, useState } from 'react';
import { createRequest, databaseConfigured, saveRequest, sendRequest, TREATMENTS } from './requests.js';

const config = { url: import.meta.env.VITE_SUPABASE_URL || '', key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '' };
const onlineReady = databaseConfigured(config);

export default function AppointmentForm() {

  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const inFlight = useRef(false);
  const pendingSubmission = useRef(null);



  async function store(record) {
    if (inFlight.current) return false;
    inFlight.current = true;
    setBusy(true);
    setMessage('Salvando sua solicitação…');
    let localSaved = false;
    try {
      try {
        saveRequest(window.localStorage, record);

        localSaved = true;
      } catch { /* O banco ainda pode receber a solicitação. */ }
      if (!onlineReady) {
        setMessage(localSaved ? 'Solicitação salva neste navegador. O envio ao banco online ainda não está disponível. Nenhuma consulta foi confirmada.' : 'Não foi possível salvar. O armazenamento do navegador está indisponível e o banco online não está conectado. Seus dados continuam no formulário.');
        return localSaved;
      }
      let synced;
      try { synced = await sendRequest(record, config); }
      catch {
        setMessage(localSaved ? 'Salva neste navegador. O envio ao banco não foi confirmado; sua solicitação permanece pendente de envio.' : 'Não foi possível confirmar o salvamento no navegador ou no banco. Tente novamente.');
        return localSaved;
      }
      try {
        saveRequest(window.localStorage, synced);

        setMessage('Solicitação salva neste navegador e recebida pelo banco online. O horário da consulta ainda precisa ser confirmado.');
      } catch {


        setMessage('Solicitação recebida pelo banco online. Não foi possível atualizar a cópia neste navegador.');
      }
      return true;
    } finally { inFlight.current = false; setBusy(false); }
  }

  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const record = createRequest({ name: data.get('name'), email: data.get('email'), service: data.get('service'), consent: data.get('consent') === 'on' }, pendingSubmission.current);
      pendingSubmission.current = record;
      if (await store(record)) { pendingSubmission.current = null; form.reset(); }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível salvar. Tente novamente.');
    }
  }


  return <div className="appointment-panel">
    <form onSubmit={submit} onChange={() => { if (!inFlight.current) setMessage(''); }} aria-busy={busy}>
      <fieldset disabled={busy}>
        <label htmlFor="name">Como podemos chamar você?</label>
        <input id="name" name="name" autoComplete="given-name" placeholder="Seu primeiro nome" required minLength={2} maxLength={60}/>
        <label htmlFor="email">Seu e-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required maxLength={254}/>
        <label htmlFor="service">Qual cuidado você procura?</label>
        <select id="service" name="service" required defaultValue=""><option value="" disabled>Selecione um tratamento</option>{TREATMENTS.map(service => <option key={service}>{service}</option>)}</select>
        <label className="consent"><input type="checkbox" name="consent" required/><span>Autorizo salvar meu nome, e-mail e tratamento neste navegador e enviá-los ao banco online para esta solicitação, quando disponível.</span></label>
        <button className="button" type="submit">{busy ? 'Salvando…' : 'Solicitar avaliação'} <span aria-hidden="true">↗</span></button>
      </fieldset>
      <p className="form-status" role="status" aria-live="polite">{message || 'O envio da solicitação não confirma um horário de consulta.'}</p>
    </form>

  </div>;
}