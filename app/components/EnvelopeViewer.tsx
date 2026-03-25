'use client';

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Card, Signature } from "../lib/supabase";

type EnvelopeViewerProps = {
    card: Card
    signatures: Signature[]
}

type Stage = 'closed' | 'opening' | 'risen' | 'flipped'

export default function EnvelopeViewer({ card, signatures }: EnvelopeViewerProps) {
    const [stage, setStage] = useState<Stage>('closed')
    const [cardHeight, setCardHeight] = useState<number>(0)
    const frontRef = useRef<HTMLDivElement>(null)
    const backRef = useRef<HTMLDivElement>(null)

    function handleEnvelopeClick() {
        if (stage === 'closed') {
            setStage('opening')
            setTimeout(() => setStage('risen'), 1200)
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
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-lg flex flex-col items-center gap-5">
                
                {/* Instruction hints */}
                <p className="font-sans text-xs text-ink/35 tracking-wide mt-10 no-print">
                    {stage === 'closed' && 'Click the envelope to open'}
                    {stage === 'opening' && '...'}
                    {stage === 'risen' && 'Click the card for more'}
                    {stage === 'flipped' && 'Click the card to flip to front'}
                </p>

                <div 
                    className="relative w-full"
                    style={{ 
                        height: isRisen ? cardHeight || 'auto' : 380,
                        transition: 'height 0.5s ease',
                        overflow: isRisen ? 'visible' : 'hidden',
                     }}
                >
                    {/* Card */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                className="w-full card-scene cursor-pointer"
                                style={{
                                    position: isRisen ? 'relative' : 'absolute',
                                    inset: 0,
                                }}
                                initial={{ y: 80, opacity: 0 }}
                                animate={isRisen ? { y: 0, opacity: 1} : { y: 60, opacity: 0 } }
                                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                                onClick={handleCardClick}
                            >
                                <div
                                    className={`card-flipper ${isFlipped ? 'is-flipped' : ''}`}
                                    style={{ minHeight: cardHeight || 'auto' }}
                                >
                                    <div className="card-face" ref={frontRef}>
                                        <div
                                            className="rounded-2xl overflow-hidden"
                                            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
                                        >
                                            <img
                                                src={card.front_image_url}
                                                alt={`Card for ${card.recipient_name}`}
                                                className="w-full h-auto block"
                                                onLoad={() => {
                                                    if (frontRef.current) {
                                                        setCardHeight(frontRef.current.offsetHeight)
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="card-face card-face--back" ref={backRef}>
                                        <CardBack card={card} signatures={signatures} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Envelope */}
                    <AnimatePresence>
                        {!isRisen && (
                            <motion.div
                                className="absolute inset-0 w-full"
                                exit={{ opacity: 0, transition: { duration: 0.4 } }}
                            >
                                <div
                                    className="absolute inset-0 w-full rounded-2xl cursor-pointer select-none"
                                    style={{
                                        backgroundColor: 'var(--envelope-tan)',
                                        filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.13))',
                                    }}
                                    onClick={handleEnvelopeClick}
                                >
                                    <svg
                                        viewBox="0 0 500 380"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-full block"
                                        style={{ borderRadius: '16px', overflow: 'hidden' }}
                                    >
                                        {/* Envelope bg */}
                                        <rect 
                                            width="500"
                                            height="380"
                                            fill="var(--envelope-tan)"
                                            rx="16"
                                        />

                                        {/* Bottom flap triangle */}
                                        <polygon
                                            points="0,380 500,380 250,230"
                                            fill="var(--envelope-shadow)"
                                            opacity="0.6"
                                        />
                                    </svg>

                                    {/* Separate top flap */}
                                    <motion.div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            transformOrigin: 'top center',
                                            transformPerspective: 600,
                                        }}
                                        animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
                                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                        <svg
                                            viewBox="0 0 500 200"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-full block"
                                        >
                                            <polygon 
                                                points="0, 0 500, 0 250, 190"
                                                fill="var(--envelope-shadow)"
                                                opacity="0.85"
                                            />
                                            <line 
                                                x1="0" y1="0" x2="250" y2="190"
                                                stroke="var(--envelope-tan)"
                                                strokeWidth="1"
                                                opacity="0.3"
                                            />
                                            <line 
                                                x1="500" y1="0" x2="250" y2="190"
                                                stroke="var(--envelope-tan)"
                                                strokeWidth="1"
                                                opacity="0.3"
                                            />
                                        </svg>
                                    </motion.div>

                                    {/* Seal */}
                                    <AnimatePresence>
                                        {!isOpen && (
                                            <motion.div
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2 }}
                                                style={{ position: 'absolute', top: '54%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 }}
                                            >
                                                <span
                                                    className="font-semibold select-none"
                                                    style={{
                                                        fontSize: '6rem',
                                                        color: 'var(--sage)',
                                                        display: 'block',
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    *
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* {isOpen && (
                        <div
                            className="absolute inset-0 w-full card-scene cursor-pointer"
                            style={{
                                opacity: isRisen ? 1 : 0,
                                transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease',
                                transform: isRisen ? 'translateY(0)' : 'translateY(20px)',
                                marginBottom: isRisen ? '16px' : '0',
                            }}
                            onClick={handleCardClick}
                        >
                            <div 
                                className={`card-flipper ${isFlipped ? 'is-flipped' : ''}`}
                                style={{ minHeight: cardHeight || 'auto' }}
                            >
                                <div className="card-face" ref={frontRef}>
                                    <div 
                                        className="rounded-2xl overflow-hidden"
                                        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
                                    >
                                    <img
                                        src={card.front_image_url}
                                        alt={`Card for ${card.recipient_name}`}
                                        className="w-full h-auto block"
                                        onLoad={() => {
                                            if (frontRef.current) {
                                                setCardHeight(frontRef.current.offsetHeight)
                                            }
                                        }}
                                    />
                                    </div>
                                </div>
                                <div className="card-face card-face--back" ref={backRef}>
                                    <CardBack card={card} signatures={signatures} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Envelope body - fades out after card rises 
                    <div
                        style={{
                            opacity: isRisen ? 0 : 1,
                            pointerEvents: isRisen ? 'none' : 'auto',
                            transition: 'opacity 0.5s ease',
                            visibility: isRisen ? 'hidden' : 'visible',
                        }}
                    >
                        <div
                            className="absolute inset-0 w-full rounded-2xl cursor-pointer select-none"
                            style={{
                                backgroundColor: 'var(--envelope-tan)',
                                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.13))',
                            }}
                            onClick={handleEnvelopeClick}
                        >
                            <svg
                                viewBox="0 0 500 380"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full block"
                                style={{ borderRadius: '16px', overflow: 'hidden' }}
                            >
                                {/* Envelope bg
                                <rect 
                                    width="500"
                                    height="380"
                                    fill="var(--envelope-tan)"
                                    rx="16"
                                />

                                {/* Bottom flap triangle 
                                <polygon
                                    points="0,380 500,380 250,230"
                                    fill="var(--envelope-shadow)"
                                    opacity="0.6"
                                />
                            </svg>

                            {/* Separate top flap 
                            <div
                                className={`envelope-flap ${isOpen ? 'is-open' : ''}`}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transformOrigin: 'top center',
                                }}
                            >
                                <svg
                                    viewBox="0 0 500 200"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full block"
                                >
                                    <polygon 
                                        points="0, 0 500, 0 250, 190"
                                        fill="var(--envelope-shadow)"
                                        opacity="0.85"
                                    />
                                    <line 
                                        x1="0" y1="0" x2="250" y2="190"
                                        stroke="var(--envelope-tan)"
                                        strokeWidth="1"
                                        opacity="0.3"
                                    />
                                    <line 
                                        x1="500" y1="0" x2="250" y2="190"
                                        stroke="var(--envelope-tan)"
                                        strokeWidth="1"
                                        opacity="0.3"
                                    />
                                </svg>
                            </div>

                            {/* Seal 
                            {!isOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '54%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 20,
                                    }}
                                >
                                    <span
                                        className="font-semibold select-none"
                                        style={{
                                            fontSize: '6rem',
                                            color: 'var(--sage)',
                                            display: 'block',
                                            lineHeight: 1
                                        }}
                                    >
                                        *
                                    </span>
                                </div>
                            )}
                        </div>
                    </div> */}
                </div> 

                {/* Recipient label */}
                <p className="font-serif text-lg italic text-ink/40 mb-10 no-print">
                    For {card.recipient_name}
                </p>

                {/* Download */}
                {isRisen && (
                    <button
                        onClick={() => window.print()}
                        className="
                            px-4 py-2
                            border border-ink/15 rounded-xl
                            font-sans text-sm tracking-wider text-ink/50
                            hover:border-ink/30 hover:text-ink/70
                            transition cursor-pointer no-print
                        "
                    >
                        Download card
                    </button>
                )}
            </div>
        </div>
    )
}

function CardBack({ card, signatures }: { card: Card; signatures: Signature[] }) {
    return (
        <div
            className="rounded-2xl bg-white p-8"
            style={{ minHeight: '300px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
        >
            {/* Greeting */}
            <p className="font-handwriting text-xl text-ink/80 mb-2">
                Dear {card.recipient_name},
            </p>
            <p className="font-handwriting text-xl text-ink/70 leading-relaxed mb-8">
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
                                <div className="border border-ink/8 rounded-xl p-3 bg-(--cream)/40">
                                    <p className="font-handwriting text-base text-ink font-semibold mb-1 leading-tight">
                                        {sig.name}
                                    </p>
                                    <div className="border-t border-ink/8 my-1.5"/>
                                    <p className="font-handwriting text-base text-ink/65 leading-snug">
                                        {sig.personal_message}
                                    </p>
                                </div>
                            ) : (
                                // Name only
                                <div className="border border-ink/8 rounded-xl px-3 py-2 bg-(--cream)/40 flex items-center">
                                    <p className="font-handwriting text-base text-ink font-semibold">
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