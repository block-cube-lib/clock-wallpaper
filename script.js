// ローカルストレージからテーマを即座に読み込み（DOMの前に実行）
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    // bodyがまだ存在しない可能性があるため、DOMContentLoadedで再適用
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('dark-mode');
    });
} else if (currentTheme === 'light') {
    // 明示的にライトモードが保存されている場合
    document.documentElement.classList.remove('dark-mode');
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.remove('dark-mode');
    });
}

// DOMContentLoaded後にテーマ切り替え機能を初期化
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
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

// Three.jsで3D立方体アニメーションを作成
let scene, camera, renderer;
let cubes = [];

function initThreeJS() {
    // シーン作成
    scene = new THREE.Scene();
    
    // カメラ作成
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // レンダラー作成
    const canvas = document.getElementById('cubesCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // 透明背景
    
    // ライト追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // 立方体を作成
    for (let i = 0; i < 20; i++) {
        createThreeCube();
    }
    
    // ウィンドウリサイズ対応
    window.addEventListener('resize', onWindowResize);
    
    // テーマ変更時に立方体の色を更新
    const observer = new MutationObserver(() => {
        updateCubeColors();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    // アニメーション開始
    animate();
}

function createThreeCube() {
    // ランダムなサイズ（0.4～1.2）
    const size = 0.4 + Math.random() * 0.8;
    const geometry = new THREE.BoxGeometry(size, size, size);
    
    // マテリアル（透明で光沢のある）
    const isDarkMode = document.body.classList.contains('dark-mode');
    const color = isDarkMode ? 0x667eea : 0xffffff;
    const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        shininess: 100,
        specular: 0x444444
    });
    
    const cube = new THREE.Mesh(geometry, material);
    
    // ランダムな開始位置
    cube.position.x = (Math.random() - 0.5) * 30;
    cube.position.y = -10 - Math.random() * 5;
    cube.position.z = -10 + Math.random() * 10;
    
    // ランダムな回転速度
    cube.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    };
    
    // ランダムな上昇速度
    cube.floatSpeed = 0.01 + Math.random() * 0.02;
    
    // 初期の不透明度（フェードイン用）
    cube.material.opacity = 0;
    cube.fadeIn = true;
    cube.fadeOut = false;
    
    scene.add(cube);
    cubes.push(cube);
}

function updateCubeColors() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const color = isDarkMode ? 0x667eea : 0xffffff;
    
    cubes.forEach(cube => {
        cube.material.color.setHex(color);
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    // 各立方体を回転・移動
    cubes.forEach(cube => {
        // 回転
        cube.rotation.x += cube.rotationSpeed.x;
        cube.rotation.y += cube.rotationSpeed.y;
        cube.rotation.z += cube.rotationSpeed.z;
        
        // 上昇
        cube.position.y += cube.floatSpeed;
        
        // フェードイン（画面下部で）
        if (cube.fadeIn && cube.material.opacity < 0.3) {
            cube.material.opacity += 0.005;
            if (cube.material.opacity >= 0.3) {
                cube.fadeIn = false;
            }
        }
        
        // 通常表示中はopacityを維持
        if (!cube.fadeIn && !cube.fadeOut && cube.material.opacity < 0.3) {
            cube.material.opacity = 0.3;
        }
        
        // フェードアウト開始判定（画面上部に達したら）
        if (!cube.fadeIn && !cube.fadeOut && cube.position.y > 20) {
            cube.fadeOut = true;
        }
        
        // フェードアウト処理
        if (cube.fadeOut) {
            cube.material.opacity -= 0.01;
        }
        
        // 画面外に完全に出たらリセット
        if (cube.position.y > 30 || (cube.fadeOut && cube.material.opacity <= 0)) {
            cube.position.y = -10 - Math.random() * 5;
            cube.position.x = (Math.random() - 0.5) * 30;
            cube.position.z = -10 + Math.random() * 10;
            cube.material.opacity = 0;
            cube.fadeIn = true;
            cube.fadeOut = false;
        }
    });
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Three.jsの初期化（DOMContentLoadedで実行してテーマを正しく読み込む）
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        // テーマが適用された後に初期化
        setTimeout(initThreeJS, 0);
    } else {
        console.error('Three.js is not loaded');
    }
});
