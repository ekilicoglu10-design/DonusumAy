// Belediye paneli authentication JavaScript

// Demo kullanıcı bilgileri
const MUNICIPALITY_USERS = [
    {
        email: 'belediye@demo.com',
        password: 'demo123',
        name: 'İstanbul Büyükşehir Belediyesi',
        role: 'municipality',
        municipality: 'İstanbul',
        district: 'Merkez',
        permissions: ['announcements', 'projects', 'support', 'districts']
    },
    {
        email: 'ankara@belediye.gov.tr',
        password: 'ankara123',
        name: 'Ankara Büyükşehir Belediyesi',
        role: 'municipality',
        municipality: 'Ankara',
        district: 'Çankaya',
        permissions: ['announcements', 'projects', 'support', 'districts']
    },
    {
        email: 'izmir@belediye.gov.tr',
        password: 'izmir123',
        name: 'İzmir Büyükşehir Belediyesi',
        role: 'municipality',
        municipality: 'İzmir',
        district: 'Konak',
        permissions: ['announcements', 'projects', 'support', 'districts']
    }
];

// Sayfa yüklenirken oturum kontrolü
document.addEventListener('DOMContentLoaded', () => {
    // Eğer kullanıcı zaten oturum açmışsa dashboard'a yönlendir
    const isLoggedIn = localStorage.getItem('municipality_logged_in');
    const userRole = localStorage.getItem('user_role');
    
    if (isLoggedIn === 'true' && userRole === 'municipality') {
        showNotification('Zaten oturum açmışsınız, dashboard\'a yönlendiriliyorsunuz...', 'success');
        setTimeout(() => {
            window.location.href = 'municipality-dashboard.html';
        }, 1000);
        return;
    }
});

// Bildirim gösterme fonksiyonu
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Buton yükleme durumu
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Şifre görünürlüğü toggle
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePasswordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Belediye giriş işlemi
async function handleMunicipalityLogin(event) {
    event.preventDefault();
    
    const loginBtn = document.getElementById('loginBtn');
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    // Validation
    if (!email || !password) {
        showNotification('Lütfen tüm alanları doldurun.', 'error');
        return;
    }

    setLoading(loginBtn, true);

    try {
        // Demo authentication - gerçek uygulamada API çağrısı yapılacak
        const user = MUNICIPALITY_USERS.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Başarılı giriş
            showNotification(`Hoş geldiniz, ${user.name}!`, 'success');
            
            // Oturum bilgilerini kaydet
            localStorage.setItem('municipality_logged_in', 'true');
            localStorage.setItem('user_role', 'municipality');
            localStorage.setItem('user_email', user.email);
            localStorage.setItem('user_name', user.name);
            localStorage.setItem('user_municipality', user.municipality);
            localStorage.setItem('user_district', user.district);
            localStorage.setItem('user_permissions', JSON.stringify(user.permissions));
            
            if (remember) {
                localStorage.setItem('municipality_remember', 'true');
            }
            
            // Dashboard'a yönlendir
            setTimeout(() => {
                window.location.href = 'municipality-dashboard.html';
            }, 1500);
            
        } else {
            // Hatalı giriş
            showNotification('E-posta adresi veya şifre hatalı!', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    } finally {
        setLoading(loginBtn, false);
    }
}

// Şifremi unuttum modal
function showForgotPassword() {
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
}

function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').classList.add('hidden');
    document.getElementById('forgotPasswordForm').reset();
}

// Şifre sıfırlama işlemi
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('resetEmail');
    
    if (!email) {
        showNotification('Lütfen e-posta adresinizi girin.', 'error');
        return;
    }
    
    // Demo için - gerçek uygulamada API çağrısı yapılacak
    const user = MUNICIPALITY_USERS.find(u => u.email === email);
    
    if (user) {
        showNotification('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.', 'success');
        closeForgotPassword();
    } else {
        showNotification('Bu e-posta adresi sistemde kayıtlı değil.', 'error');
    }
}

// Klavye kısayolları
document.addEventListener('keydown', (event) => {
    // Enter tuşu ile form gönderimi
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
        const form = event.target.closest('form');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape tuşu ile modal kapatma
    if (event.key === 'Escape') {
        closeForgotPassword();
    }
});

// Form validasyonu
document.addEventListener('input', (event) => {
    if (event.target.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (event.target.value && !emailRegex.test(event.target.value)) {
            event.target.setCustomValidity('Geçerli bir e-posta adresi girin');
        } else {
            event.target.setCustomValidity('');
        }
    }
});

// Otomatik form doldurma (demo için)
function fillDemoCredentials() {
    document.getElementById('email').value = 'belediye@demo.com';
    document.getElementById('password').value = 'demo123';
}

// Demo bilgileri tıklanabilir yap
document.addEventListener('DOMContentLoaded', () => {
    const demoInfo = document.querySelector('.bg-white.bg-opacity-10');
    if (demoInfo) {
        demoInfo.style.cursor = 'pointer';
        demoInfo.addEventListener('click', fillDemoCredentials);
        demoInfo.title = 'Demo bilgilerini otomatik doldurmak için tıklayın';
    }
});

