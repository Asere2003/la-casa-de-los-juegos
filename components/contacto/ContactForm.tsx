// components/contacto/ContactForm.tsx
'use client'

import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="border border-[#004317]/20 bg-[#004317]/5 p-8 rounded-[2px] text-center">
        <p className="text-4xl mb-4">✓</p>
        <h3 className="font-serif text-xl text-[#2c1810] mb-2">Mensaje enviado</h3>
        <p className="text-[#2c1810]/70 text-sm">
          Te responderemos en menos de 48 horas hábiles.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1">Nombre</label>
        <input
          className="input-base w-full"
          required
          value={form.nombre}
          onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1">Email</label>
        <input
          type="email"
          className="input-base w-full"
          required
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1">Asunto</label>
        <select
          className="input-base w-full"
          value={form.asunto}
          onChange={e => setForm(p => ({ ...p, asunto: e.target.value }))}
          required
        >
          <option value="">Selecciona un asunto...</option>
          <option value="pedido">Consulta sobre un pedido</option>
          <option value="devolucion">Devolución o cambio</option>
          <option value="producto">Información sobre un producto</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1">Mensaje</label>
        <textarea
          className="input-base w-full h-32 resize-none"
          required
          value={form.mensaje}
          onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">
          Error al enviar. Escríbenos directamente a {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}