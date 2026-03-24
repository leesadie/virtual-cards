'use client';

import { useState } from "react";
import type { Card, Signature } from "../lib/supabase";

type EnvelopeViewerProps = {
    card: Card
    signatures: Signature[]
}

type Stage = 'closed' | 'opening' | 'risen' | 'flipped'

export default function EnvelopeViewer({ card, signatures }: EnvelopeViewerProps) {
    const [stage, setStage] = useState<Stage>('closed')

    function handleEnvelopeClick() {
        if (stage === 'closed') {
            setStage('opening')
            setTimeout(() => setStage('risen'), 800)
        }
    }

    function handleCardClick() {
        if (stage === 'risen') setStage('flipped')
        else if (stage === 'flipped') setStage('risen')
    }

    const isOpen = stage !== 'closed'
    const isRisen = stage === 'risen' || stage === 'flipped'
    const isFlipped = stage === 'flipped'

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Instructions */}
            <p className="font-sans text-xs text-ink/35 tracking-widest">
                {stage === 'closed' && 'Click the envelope to open'}
                {stage === 'opening' && '...'}
                {stage === 'risen' && 'Click the card for more'}
                {stage === 'flipped' && 'Click the card to flip back to front'}
            </p>

            {/* Envelope + card */}
            <div
                className="relative w-full"
                style={{ paddingBottom: isRisen ? '80px' : '0' }}
            >
                {/* Card sits above envelope */}
                {isOpen && (
                    <div
                        className="absolute left-0 right-0 z-10 card-scene cursor-pointer"
                        style={{
                            bottom: isRisen ? '100%' : '60%',
                            marginBottom: isRisen ? '16px' : '0',
                            transition: 'bottom 0.8s cubic-bezier(0.4, 0, 0.2, 1), margin 0.8s ease',
                        }}
                        onClick={handleCardClick}
                    >
                        <div className={`card-flipper ${isFlipped ? 'is-flipped' : ''}`}>
                            {/* Front */}
                            <div className="card-face">
                                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-3/2">
                                    <img 
                                        src={card.front_image_url}
                                        alt={`Card for ${card.recipient_name}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Back */}
                            <div className="card-face card-face--back">
                                <CardBack card={card} signatures={signatures} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Envelope body */}
                <div
                    className="relative w-full rounded-2xl overflow-hidden cursor-pointer select-none"
                    style={{
                        backgroundColor: 'var(--envelope-tan)',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                    }}
                    onClick={handleEnvelopeClick}
                >
                    <div
                        className={`envelope-flap relative z-50 ${isOpen ? 'is-open' : ''}`}
                        style={{ perspective: '600px' }}
                    >
                        <svg
                            viewBox="0 0 400 200"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full"
                            style={{ display: 'block' }}
                        >
                            <polygon 
                                points="0,0 400,0 200,180"
                                fill="var(--envelope-shadow)"
                            />
                            <line 
                                x1="0" y1="0" x2="200" y2="180"
                                stroke="var(--envelope-tan)"
                                strokeWidth="1"
                                opacity="0.4"
                            />
                            <line 
                                x1="400" y1="0" x2="200" y2="180"
                                stroke="var(--envelope-tan)"
                                strokeWidth="1"
                                opacity="0.4"
                            />
                        </svg>
                    </div>

                    {/* Card slot in envelope */}
                    <div
                        className="relative z-10"
                        style={{
                            backgroundColor: 'var(--envelope-tan)',
                            height: '120px',
                            marginTop: '-2px',
                        }}
                    >
                        <svg
                            viewBox="0 0 400 120"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute inset-0 w-full h-full"
                        >
                            <polygon 
                                points="0,120 200,60 400,120"
                                fill="var(--envelope-shadow)"
                                opacity="0.5"
                            />
                            <line 
                                x1="0" y1="120" x2="200" y2="60"
                                stroke="var(--envelope-tan)"
                                strokeWidth="1"
                                opacity="0.4"
                            />
                            <line 
                                x1="400" y1="120" x2="200" y2="60"
                                stroke="var(--envelope-tan)"
                                strokeWidth="1"
                                opacity="0.4"
                            />
                        </svg>

                        {/* Seal */}
                        {!isOpen && (
                            <div
                                className="absolute inset-0 flex items-center justify-center z-10"
                                style={{ paddingTop: '20px' }}
                            >
                                <span
                                    className="font-serif text-2xl"
                                    style={{ color: 'var(--envelope-shadow)', opacity: 0.8}}
                                >
                                    *
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recipient label */}
            <p className="font-serif italic text-ink/40 text-sm">
                For {card.recipient_name}
            </p>
        </div>
    )
}

function CardBack({ card, signatures }: { card: Card; signatures: Signature[] }) {
    return (
        <div
            className="rounded-2xl bg-white shadow-2xl p-8 min-h-50"
            style={{ minHeight: '300px' }}
        >
            {/* Greeting */}
            <p className="font-handwriting text-xl text-ink/80 mb-1">
                Dear {card.recipient_name},
            </p>
            <p className="font-handwriting text-lg text-ink/70 leading-relaxed mb-8">
                {card.message}
            </p>

            <div className="border-t border-ink/8 mb-6" />

            {/* Signatures grid */}
            {signatures.length === 0 ? (
                <p className="font-handwriting text-ink/30 text-center text-base">
                    No signatures yet.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {signatures.map((sig, i) => (
                        <div
                            key={sig.id}
                            className="sig-item"
                            style={{ animationDelay: `${i * 60}ms`}}
                        >
                            {sig.personal_message ? (
                                // Full message card
                                <div className="border border-ink/8 rounded-xl p-3 bg-(--cream)/60">
                                    <p className="font-handwriting text-base text-ink font-semibold mb-1 leading-tight">
                                        {sig.name}
                                    </p>
                                    <div className="border-t border-ink/8 my-1.5"/>
                                    <p className="font-handwriting text-sm text-ink/65 leading-snug">
                                        {sig.personal_message}
                                    </p>
                                </div>
                            ) : (
                                // Name only
                                <div className="border border-ink/8 rounded-xl px-3 py-2 bg-(--cream)/60 flex items-center">
                                    <p className="font-handwriting text-base text-ink">
                                        {sig.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}