export const STORAGE_KEY = 'sorriso.requests.v1';
export const TREATMENTS = ['Clínica geral', 'Ortodontia', 'Estética dental', 'Implantodontia', 'Quero uma avaliação geral'];

export function validateRequest(record) {
  return record && typeof record.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(record.id)
    && typeof record.name === 'string' && record.name.trim().length >= 2 && record.name.length <= 60
    && typeof record.email === 'string' && record.email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)
    && TREATMENTS.includes(record.service) && record.consent === true
    && typeof record.createdAt === 'string' && Number.isFinite(Date.parse(record.createdAt))
    && ['pending', 'synced'].includes(record.status);
}

export function readRequests(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const records = JSON.parse(raw);
  if (!Array.isArray(records) || !records.every(validateRequest)) throw new Error('Histórico local inválido.');
  return records;
}

export function saveRequest(storage, record) {
  if (!validateRequest(record)) throw new Error('Verifique os dados e a autorização de armazenamento.');
  const records = readRequests(storage);
  const index = records.findIndex(item => item.id === record.id);
  if (index === -1) records.unshift(record);
  else records[index] = record;
  storage.setItem(STORAGE_KEY, JSON.stringify(records));
  return records;
}

export function removeRequest(storage, id) {
  const records = readRequests(storage).filter(item => item.id !== id);
  storage.setItem(STORAGE_KEY, JSON.stringify(records));
  return records;
}

export function databaseConfigured(config) {
  try {
    const url = new URL(config.url);
    return url.protocol === 'https:' && !!config.key && config.key.startsWith('sb_publishable_');
  } catch { return false; }
}

export async function sendRequest(record, config, fetcher = fetch) {
  if (!validateRequest(record)) throw new Error('Dados inválidos.');
  if (!databaseConfigured(config)) throw new Error('Banco online não configurado.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
  const response = await fetcher(`${config.url.replace(/\/$/, '')}/rest/v1/rpc/submit_appointment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: config.key },
    body: JSON.stringify({ p_id: record.id, p_name: record.name, p_email: record.email, p_service: record.service, p_consent: record.consent }),
    signal: controller.signal,
  });
  if (!response.ok) throw new Error('O banco não confirmou o recebimento.');
  return { ...record, status: 'synced' };
  } finally { clearTimeout(timeout); }
}
export function createRequestId(cryptoProvider = globalThis.crypto) {
  if (typeof cryptoProvider?.randomUUID === 'function') return cryptoProvider.randomUUID();
  if (typeof cryptoProvider?.getRandomValues !== 'function') throw new Error('Este navegador não permite gerar o identificador. Abra o site em um navegador atualizado.');
  const bytes = cryptoProvider.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function createRequest(fields, previous = null, cryptoProvider = globalThis.crypto) {
  const values = { name: String(fields.name || '').trim(), email: String(fields.email || '').trim().toLowerCase(), service: fields.service, consent: fields.consent === true };
  if (previous && validateRequest(previous) && Object.keys(values).every(key => previous[key] === values[key])) return previous;
  const record = { ...values, id: createRequestId(cryptoProvider), createdAt: new Date().toISOString(), status: 'pending' };
  if (!validateRequest(record)) throw new Error('Informe um nome com pelo menos 2 caracteres, um e-mail válido, o tratamento e a autorização de armazenamento.');
  return record;
}