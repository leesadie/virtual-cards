import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import SignForm from "@/app/components/SignForm";

export default async function SignPage({
    params,
}: {
    params: { cardId: string }
}) {
    const { data: card, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', params.cardId)
        .single()

    if (error || !card) notFound()

    const { data: signatures } = await supabase
        .from('signatures')
        .select('name')
        .eq('card_id', params.cardId)

    const existingNames = (signatures ?? []).map((s) => s.name.toLowerCase())

    return (
        <main className="min-h-screen bg-(--cream) py-16 px-4">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="font-sans text-xs tracking-wider text-ink/40 mb-2">
                        You&apos;re signing a card for
                    </p>
                    <h1 className="font-serif text-4xl text-ink">{card.recipient_name}</h1>
                </div>

                {/* Card front preview */}
                <div className="rounded-2xl overflow-hidden shadow-xl mb-10 aspect-3/2 relative">
                    <img 
                        src={card.front_image_url}
                        alt={`Card for ${card.recipient_name}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Messsage preview */}
                <div className="bg-white/50 rounded-xl px-6 py-5 mb-10 border border-ink/5">
                    <p className="font-handwriting text-lg text-ink/80 leading-relaxed">
                        Dear {card.recipient_name},
                    </p>
                    <p className="font-handwriting text-lg text-ink/80 leading-relaxed mt-2">
                        {card.message}
                    </p>
                </div>

                {/* Sign form */}
                <SignForm cardId={card.id} existingNames={existingNames} />

                {/* Existing signature count */}
                <p className="text-center font-sans text-xs text-ink/30 mt-8">
                    {existingNames.length} {existingNames.length === 1 ? 'person has' : 'people have'} signed this card.
                </p>
            </div>
        </main>
    )
}