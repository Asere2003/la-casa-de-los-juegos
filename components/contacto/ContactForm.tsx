// components/contacto/ContactForm.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function ContactForm() {
  const t = useTranslations('contacto')
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
        <h3 className="font-serif text-xl text-[#2c1810] mb-2">{t('form_success_title')}</h3>
        <p className="text-[#2c1810]/70 text-sm">
          {t('form_success_desc')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1">{t('form_name')}</label>
        <input
          className="input-base w-full"
          required
          value={form.nombre}
          onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1">{t('form_email')}</label>
        <input
          type="email"
          className="input-base w-full"
          required
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1">{t('form_subject')}</label>
        <select
          className="input-base w-full"
          value={form.asunto}
          onChange={e => setForm(p => ({ ...p, asunto: e.target.value }))}
          required
        >
          <option value="">{t('form_subject_placeholder')}</option>
          <option value="pedido">{t('form_subject_order')}</option>
          <option value="devolucion">{t('form_subject_return')}</option>
          <option value="producto">{t('form_subject_product')}</option>
          <option value="otro">{t('form_subject_other')}</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1">{t('form_message')}</label>
        <textarea
          className="input-base w-full h-32 resize-none"
          required
          value={form.mensaje}
          onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">
          {t('form_error', { email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '' })}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full align-middle justify-center"
      >
        {status === 'sending' ? t('form_sending') : t('form_submit')}
      </button>
    </form>
  )
}