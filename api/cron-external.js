export default async function handler(req, res) {
  const token = process.env.TG_BOT_TOKEN || '8821723673:AAHJPxBsGFZqPyCIEsSCeXkyxheCkAe9U4g';
  const newsList = [
    { title: "CPI Inflation YoY (USD)", time: "2026-09-10T19:30:00+07:00", forecast: "3.2%", previous: "3.4%" },
    { title: "Non-Farm Payroll (NFP)", time: "2026-09-11T19:30:00+07:00", forecast: "175K", previous: "187K" },
    { title: "PPI & Jobless Claims", time: "2026-09-12T19:30:00+07:00", forecast: "0.2% / 230K", previous: "0.3% / 228K" },
    { title: "Retail Sales MoM", time: "2026-09-16T19:30:00+07:00", forecast: "0.3%", previous: "0.6%" },
    { title: "FOMC Interest Rate Decision", time: "2026-09-17T01:00:00+07:00", forecast: "5.25%", previous: "5.50%" },
    { title: "GDP Advance QoQ", time: "2026-09-25T19:30:00+07:00", forecast: "1.8%", previous: "2.1%" },
    { title: "PCE Price Index", time: "2026-09-26T19:30:00+07:00", forecast: "2.6%", previous: "2.8%" },
  ];
  const now = Date.now();
  const chatIds = (process.env.TG_CHAT_IDS || '6899123766').split(',').map(s=>s.trim()).filter(Boolean);
  let sent=[];
  for(const n of newsList){
    const t=new Date(n.time).getTime();
    const diffMin=(t-now)/60000;
    let msg=null,tag=null;
    if(diffMin>59 && diffMin<=60){tag='60m';msg=`XAUUSD - 60 Menit Menuju Rilis\n${n.title}\nJadwal: ${new Date(n.time).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})} WIB\nForecast ${n.forecast} | Previous ${n.previous}\nSiaga 1: Kurangi eksposur, spread berpotensi melebar.\nhttps://${req.headers.host}`;}
    else if(diffMin>4 && diffMin<=5){tag='5m';msg=`XAUUSD - 5 Menit Menuju Rilis\n${n.title}\nSiaga 2: Tahan posisi. Sinyal akan dirilis setelah data Actual keluar.`;}
    else if(diffMin>-1 && diffMin<=0){tag='rilis';msg=`XAUUSD - Sinyal\n${n.title}\nForecast ${n.forecast} | Previous ${n.previous}\n\nSinyal dan detail entry akan tersedia di website setelah data Actual dirilis.\nFundamental: Actual di bawah ekspektasi cenderung melemahkan USD (mendukung Gold), di atas ekspektasi sebaliknya.\nTeknikal: RSI, MA, dan area Support-Resistance menjadi konfirmasi.\nhttps://${req.headers.host}`;}
    if(msg) for(const cid of chatIds){
      try{const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:cid,text:msg})});const j=await r.json();sent.push({news:n.title,tag,ok:j.ok});}catch(e){sent.push({news:n.title,tag,ok:false})}
    }
  }
  return res.status(200).json({ok:true, at:new Date().toISOString(), sent: sent.length?sent:'standby'});
}
