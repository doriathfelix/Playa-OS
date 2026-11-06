import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { reservation } = await req.json()
    const RESEND_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_KEY) throw new Error('RESEND_API_KEY not set')

    const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
    const d = new Date(reservation.date + 'T12:00:00')
    const dateLabel = days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()

    const gParts = []
    if (reservation.grands > 0)         gParts.push(reservation.grands + ' grand' + (reservation.grands > 1 ? 's' : ''))
    if (reservation.presqueGrands > 0)  gParts.push(reservation.presqueGrands + ' presque-grand' + (reservation.presqueGrands > 1 ? 's' : ''))
    if (reservation.petitsLoups > 0)    gParts.push(reservation.petitsLoups + ' petit' + (reservation.petitsLoups > 1 ? 's' : '') + ' loup' + (reservation.petitsLoups > 1 ? 's' : ''))
    if (reservation.toutDoux > 0)       gParts.push(reservation.toutDoux + ' tout-doux')
    const totalPersons = reservation.grands + reservation.presqueGrands + reservation.petitsLoups + reservation.toutDoux

    const transatLine = reservation.formula === 'table+transats' && reservation.transats > 0
      ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Transats</td><td style="padding:8px 0;font-size:14px;font-weight:600">${reservation.transats} transat(s)${reservation.firstRow === 'oui' ? ' · 1ère ligne' : ''}</td></tr>`
      : ''

    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#124f5c,#1a6b7c);padding:32px 32px 24px;text-align:center">
          <p style="margin:0 0 6px;color:rgba(255,255,255,.7);font-size:12px;letter-spacing:3px;text-transform:uppercase">La Playa · Camargue</p>
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:600">Réservation confirmée 🎉</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px">
          <p style="margin:0 0 24px;font-size:16px;color:#1a1a1a">Bonjour <strong>${reservation.prenom}</strong>,</p>
          <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.6">Votre réservation à <strong>La Playa</strong> est confirmée. Nous avons hâte de vous accueillir !</p>

          <!-- Référence -->
          <div style="background:#f7f0e3;border:1px solid #c9a96e;border-radius:8px;padding:12px 16px;text-align:center;margin-bottom:28px">
            <p style="margin:0;font-size:12px;color:#78350f;text-transform:uppercase;letter-spacing:1px">Référence</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:2px">${reservation.ref}</p>
          </div>

          <!-- Détails -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e1d8">
            <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Date</td><td style="padding:8px 0;font-size:14px;font-weight:600">${dateLabel}</td></tr>
            <tr style="border-top:1px solid #f3f4f6"><td style="padding:8px 0;color:#6b7280;font-size:14px">Heure d'arrivée</td><td style="padding:8px 0;font-size:14px;font-weight:600">${reservation.slot}</td></tr>
            <tr style="border-top:1px solid #f3f4f6"><td style="padding:8px 0;color:#6b7280;font-size:14px">Groupe</td><td style="padding:8px 0;font-size:14px;font-weight:600">${gParts.join(', ')} (${totalPersons} pers.)</td></tr>
            ${transatLine}
          </table>

          <!-- Note -->
          ${reservation.note ? `<div style="background:#e8f4f7;border-radius:8px;padding:12px 16px;margin-top:20px"><p style="margin:0;font-size:13px;color:#124f5c"><strong>Votre message :</strong> ${reservation.note}</p></div>` : ''}

          <!-- Info box -->
          <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-top:24px">
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#1a1a1a">À savoir</p>
            <p style="margin:0;font-size:13px;color:#4b5563;line-height:1.6">
              • Annulation gratuite jusqu'à 48h avant votre réservation<br>
              • En cas de retard, pensez à nous prévenir par téléphone
            </p>
          </div>

          <p style="margin:28px 0 0;font-size:15px;color:#1a1a1a">À très bientôt,<br><strong>L'équipe La Playa 🌊</strong></p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e1d8">
          <p style="margin:0;font-size:12px;color:#9ca3af">La Playa · Camargue · laplaya-camargue.fr</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: 'La Playa <onboarding@resend.dev>',
        to: [reservation.email],
        subject: `✓ Réservation confirmée — ${dateLabel} à ${reservation.slot} · Réf. ${reservation.ref}`,
        html,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify({ ok: true, email_id: data.id }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    })

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }
})
