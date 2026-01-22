// ダークモード切り替え
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// ローカルストレージからテーマを読み込み
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

// トグルボタンのクリックイベント
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // ローカルストレージに保存
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// 時計の更新関数
function updateClock() {
    const now = new Date();
    
    // 時間の取得
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 日付の取得
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // 曜日の取得
    const weekdays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
    const weekday = weekdays[now.getDay()];
    
    // DOM要素の更新
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('year').textContent = year;
    document.getElementById('month').textContent = month;
    document.getElementById('day').textContent = day;
    document.getElementById('weekday').textContent = weekday;
}

// 初回実行
updateClock();

// 1秒ごとに更新
setInterval(updateClock, 1000);

// 背景のグラデーションを時間帯によって変更（オプション）
function updateBackgroundByTime() {
    // ダークモードの場合は時間帯による変更をスキップ
    if (body.classList.contains('dark-mode')) {
        return;
    }
    
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
        // 朝（6時〜12時）
        body.style.background = 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)';
    } else if (hour >= 12 && hour < 18) {
        // 昼（12時〜18時）
        body.style.background = 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)';
    } else if (hour >= 18 && hour < 21) {
        // 夕方（18時〜21時）
        body.style.background = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
    } else {
        // 夜（21時〜6時）
        body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)';
    }
}

// 背景を初期化
updateBackgroundByTime();

// 1分ごとに背景をチェック
setInterval(updateBackgroundByTime, 60000);
