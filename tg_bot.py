import time, json, urllib.request, urllib.parse
TOKEN="8821723673:AAHJPxBsGFZqPyCIEsSCeXkyxheCkAe9U4g"
URL=f"https://api.telegram.org/bot{TOKEN}"
offset=0
print("Bot @zalltrader_bot polling started...", flush=True)
def api(method, data=None):
    url=f"{URL}/{method}"
    if data is not None:
        b=json.dumps(data).encode()
        req=urllib.request.Request(url, data=b, headers={"Content-Type":"application/json"})
    else:
        req=urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())
def get_updates(off):
    qs=urllib.parse.urlencode({"offset":off,"timeout":25})
    with urllib.request.urlopen(f"{URL}/getUpdates?{qs}", timeout=35) as r:
        return json.loads(r.read().decode())
while True:
    try:
        data=get_updates(offset)
        if not data.get("ok"):
            time.sleep(3); continue
        for upd in data.get("result",[]):
            offset=upd["update_id"]+1
            msg=upd.get("message") or upd.get("channel_post")
            if not msg: continue
            chat_id=msg["chat"]["id"]
            text=(msg.get("text") or "").strip()
            print(f"msg {text!r} from {chat_id}", flush=True)
            if text.startswith("/start"):
                reply="XAUUSD SIGNAL PRO - BOT AKTIF\n\nHalo! Bot sudah terhubung.\nChat ID kamu: "+str(chat_id)+"\n\nWeb: http://localhost:8080\nNotifikasi akan masuk otomatis:\n- 60 menit sebelum news\n- 5 menit sebelum news\n- Saat RILIS + sinyal BUY/SELL\n\nLangkah di web:\n1. DETEKSI ID (auto)\n2. SIMPAN & AKTIFKAN\n3. TEST KIRIM\n4. Biarkan tab web tetap terbuka\n\nKetik /test untuk test."
                api("sendMessage", {"chat_id":chat_id,"text":reply})
            elif text.startswith("/test"):
                api("sendMessage", {"chat_id":chat_id,"text":"TEST SINYAL\n\nXAUUSD: $2,584.32\nNext: NFP - 11 Sep 19:30 WIB\nSinyal: WAIT (tunggu rilis)\n\nJika kamu terima ini, notif berfungsi."})
            elif text.startswith("/status"):
                api("sendMessage", {"chat_id":chat_id,"text":"STATUS BOT\n\nBot ON\nWeb: http://localhost:8080\nPolling: aktif\nBuka web untuk countdown real-time."})
    except Exception as e:
        print("err",e, flush=True)
        time.sleep(5)
