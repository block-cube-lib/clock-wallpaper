// ダークモード切り替え
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// ローカルストレージからテーマを読み込み
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

// テーマ切り替え関数
function toggleTheme(event) {
    // イベントの伝播を防止
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    body.classList.toggle('dark-mode');
    
    // ローカルストレージに保存
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// クリックイベントとタッチイベントの両方に対応
themeToggle.addEventListener('click', toggleTheme);
themeToggle.addEventListener('touchend', (event) => {
    toggleTheme(event);
}, { passive: false });

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

// 立方体アニメーションの初期化
function createCube() {
    const cube = document.createElement('div');
    cube.className = 'cube';
    
    // 立方体の6つの面を作成
    const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    faces.forEach(face => {
        const faceDiv = document.createElement('div');
        faceDiv.className = `cube-face ${face}`;
        cube.appendChild(faceDiv);
    });
    
    // ランダムな水平位置
    const leftPosition = Math.random() * 100;
    cube.style.left = `${leftPosition}%`;
    cube.style.bottom = '-80px';
    
    // ランダムなサイズ（40px～80px）
    const size = 40 + Math.random() * 40;
    cube.style.width = `${size}px`;
    cube.style.height = `${size}px`;
    
    // 各面のサイズを調整
    const cubeFaces = cube.querySelectorAll('.cube-face');
    cubeFaces.forEach(face => {
        face.style.width = `${size}px`;
        face.style.height = `${size}px`;
        
        // transformを更新
        const halfSize = size / 2;
        if (face.classList.contains('front')) {
            face.style.transform = `rotateY(0deg) translateZ(${halfSize}px)`;
        } else if (face.classList.contains('back')) {
            face.style.transform = `rotateY(180deg) translateZ(${halfSize}px)`;
        } else if (face.classList.contains('right')) {
            face.style.transform = `rotateY(90deg) translateZ(${halfSize}px)`;
        } else if (face.classList.contains('left')) {
            face.style.transform = `rotateY(-90deg) translateZ(${halfSize}px)`;
        } else if (face.classList.contains('top')) {
            face.style.transform = `rotateX(90deg) translateZ(${halfSize}px)`;
        } else if (face.classList.contains('bottom')) {
            face.style.transform = `rotateX(-90deg) translateZ(${halfSize}px)`;
        }
    });
    
    // ランダムなアニメーション時間（8秒～15秒）
    const duration = 8 + Math.random() * 7;
    cube.style.animationDuration = `${duration}s`;
    
    // ランダムな遅延
    const delay = Math.random() * 5;
    cube.style.animationDelay = `${delay}s`;
    
    return cube;
}

function initCubes() {
    const cubesBackground = document.getElementById('cubesBackground');
    
    // 15個の立方体を作成
    for (let i = 0; i < 15; i++) {
        const cube = createCube();
        cubesBackground.appendChild(cube);
        
        // アニメーション終了後に再作成
        cube.addEventListener('animationiteration', () => {
            // 位置とタイミングをランダムに再設定
            cube.style.left = `${Math.random() * 100}%`;
            const duration = 8 + Math.random() * 7;
            cube.style.animationDuration = `${duration}s`;
        });
    }
}

// ページ読み込み時に立方体を初期化
initCubes();
