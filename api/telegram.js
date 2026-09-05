export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ok:false});
  const token = process.env.TG_BOT_TOKEN || '8821723673:AAHJPxBsGFZqPyCIEsSCeXkyxheCkAe9U4g';
  const body = req.body;
  const msg = body?.message || body?.channel_post;
  if (!msg) return res.status(200).json({ok:true});
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();
  let reply = null;
  if (text.startsWith('/start')) {
    reply = `✅ XAUUSD SIGNAL PRO - BOT AKTIF (24 JAM)\n\nHalo! Bot @zalltrader_bot online 24 jam via Vercel.\nChat ID kamu: ${chatId}\n\nWeb akan online di Vercel - no mistakke - sinyal refresh otomatis tiap 5 menit.\nNotifikasi:\n⏰ 60m sebelum news\n🚨 5m sebelum news\n💥 Saat RILIS + sinyal BUY/SELL\n\nPerintah:\n/test - test notif\n/status - cek status\n/help - bantuan`;
  } else if (text.startsWith('/test')) {
    reply = `🧪 TEST OK\n\nXAUUSD: live di web\nNext: NFP 11 Sep 19:30 WIB\nSinyal: WAIT (tunggu rilis)\n\nJika kamu terima ini, webhook 24 jam berfungsi ✅`;
  } else if (text.startsWith('/status')) {
    reply = `📊 STATUS 24 JAM\n\nBot: ON (Vercel Webhook)\nCron: tiap 5 menit cek news\nWeb: https://${req.headers.host}\n\nTidak perlu laptop nyala lagi.`;
  } else if (text.startsWith('/help')) {
    reply = `Bantuan @zalltrader_bot:\n/start - aktifkan\n/test - test\n/status - status\n\nWeb rangkuman fundamental + teknikal ada di Vercel. Countdown & sinyal auto-refresh.`;
  }
  if (reply) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: chatId, text: reply })
    });
  }
  return res.status(200).json({ok:true});
}
