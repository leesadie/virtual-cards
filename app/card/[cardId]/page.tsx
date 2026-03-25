import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import EnvelopeViewer from "@/app/components/EnvelopeViewer";

export default async function CardPage({
    params,
}: {
    params: Promise<{ cardId: string }>
}) {
    const { cardId } = await params

    const { data: card, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', cardId)
        .single()

    if (error || !card) notFound()

    const { data: signatures } = await supabase
        .from('signatures')
        .select('*')
        .eq('card_id', cardId)
        .order('created_at', { ascending: true })

    return (
        <main className="bg-(--cream)">
            <EnvelopeViewer card={card} signatures={signatures ?? []} />
        </main>
    )
}