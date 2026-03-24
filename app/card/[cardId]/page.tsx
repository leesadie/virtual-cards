import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import EnvelopeViewer from "@/app/components/EnvelopeViewer";

export default async function Cardpage({
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
        .select('*')
        .eq('card_id', params.cardId)
        .order('created_at', { ascending: true })

    return (
        <main className="min-h-screen bg-(--cream) flex items-center justify-center py-16 px-4">
            <EnvelopeViewer card={card} signatures={signatures ?? []} />
        </main>
    )
}