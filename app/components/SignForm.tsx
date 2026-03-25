'use client';

import { useState } from "react";
import { supabase } from "../lib/supabase";

type SignFormProps = {
    cardId: string
    existingNames: string[]
}

type Status = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error'

export default function SignForm({ cardId, existingNames }: SignFormProps) {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<Status>('idle')

    const isDuplicate = existingNames.includes(name.trim().toLowerCase())

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        if (!name.trim()) return

        if (isDuplicate) {
            setStatus('duplicate')
            return
        }

        setStatus('submitting')

        const { error } = await supabase.from('signatures').insert({
            card_id: cardId,
            name: name.trim(),
            personal_message: message.trim() || null,
        })

        if (error) {
            // Catch DB-level duplicate
            if (error.code === '23505') {
                setStatus('duplicate')
            } else {
                setStatus('error')
            }
            return
        }

        setStatus('success')
    }

    if (status === 'success') {
        return (
            <div className="text-center, py-12">
                <div className="text-5xl mb-4">
                    <h2 className="font-serif text-2xl text-ink mb-2">You&apos;re on the card!</h2>
                    <p className="font-sans text-sm text-ink/50">
                        Thanks for signing, {name}.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-ink/40 mb-2">
                    Your name <span className="text-red-400">*</span>
                </label>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        if (status === 'duplicate') setStatus('idle')
                    }}
                    placeholder="Jane Doe"
                    required
                    className="
                        w-full 
                        bg-white/80 border border-ink/10 
                        rounded-xl px-4 py-3 
                        font-handwriting text-lg text-ink 
                        placeholder:text-ink/25 
                        focus:outline-none 
                        focus:ring-2 focus:ring-sage/40 
                        transition"
                />
                {(status === 'duplicate' || (isDuplicate && name.trim())) && (
                    <p className="mt-1.5 text-xs text-red-400 font-sans">
                        Someone with this name has already signed the card.
                    </p>
                )}
            </div>

            <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-ink/40 mb-2">
                    Message <span className="text-ink/25">(optional)</span>
                </label>
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal note..."
                    rows={4}
                    className="
                        w-full 
                        bg-white/80 border border-ink/10 
                        rounded-xl px-4 py-3 
                        font-handwriting text-lg text-ink 
                        placeholder:text-ink/25 
                        focus:outline-none 
                        focus:ring-2 focus:ring-sage/40 
                        transition resize-none
                    "
                />
            </div>

            {status === 'error' && (
                <p className="text-xs text-red-400 font-sans text-center">
                    Something went wrong. Please try again.
                </p>
            )}

            <button
                type="submit"
                disabled={status === 'submitting' || !name.trim()}
                className="
                    w-full
                    bg-ink
                    text-cream font-sans text-sm
                    tracking-wide py-4
                    rounded-xl
                    hover:bg-ink/80
                    cursor-pointer
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                "
            >
                {status === 'submitting' ? 'Signing...' : 'Sign the card'}
            </button>
        </form>
    )
}