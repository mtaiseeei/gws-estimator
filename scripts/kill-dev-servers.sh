#!/bin/bash
# 開発サーバー停止スクリプト

echo "🔍 検出された開発サーバー:"
lsof -i :3000-3010 | grep LISTEN

echo ""
read -p "これらのプロセスを停止しますか？ (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    for port in {3000..3010}
    do
        PID=$(lsof -ti:$port)
        if [ ! -z "$PID" ]; then
            echo "🛑 Port $port のプロセス (PID: $PID) を停止しています..."
            kill -9 $PID
        fi
    done
    echo "✅ 完了しました"
else
    echo "❌ キャンセルされました"
fi
