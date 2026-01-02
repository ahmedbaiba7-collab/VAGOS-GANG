// js/admin.js

// كود الدخول السريع (يمكنك تغييره)
const ADMIN_SECRET_CODE = "VAGOS123";

// إظهار/إخفاء أيقونة المشرفين
function toggleAdminIcon(show) {
  const adminIcon = document.getElementById('adminAccessIcon');
  if (!adminIcon) return;
  
  if (show) {
    adminIcon.classList.remove('hidden');
    setTimeout(() => {
      adminIcon.classList.add('visible');
    }, 100);
  } else {
    adminIcon.classList.remove('visible');
    setTimeout(() => {
      adminIcon.classList.add('hidden');
    }, 300);
  }
}

// إعداد مستمعات الأحداث
function setupAdminAccess() {
  // تفعيل إظهار الأيقونة عند الضغط على Ctrl + Alt + V
  let keySequence = [];
  document.addEventListener('keydown', function(e) {
    // تسلسل مفاتيح سري: اضغط Ctrl + Alt + V
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      toggleAdminIcon(true);
      
      // إخفاء الأيقونة بعد 10 ثواني
      setTimeout(() => {
        toggleAdminIcon(false);
      }, 10000);
    }
    
    // طريقة بديلة: كتابة كلمة "admin" (اختياري)
    keySequence.push(e.key.toLowerCase());
    if (keySequence.length > 5) keySequence.shift();
    
    if (keySequence.join('') === 'admin') {
      toggleAdminIcon(true);
      keySequence = [];
      setTimeout(() => {
        toggleAdminIcon(false);
      }, 10000);
    }
  });

  // فتح نافذة الدخول عند النقر على الأيقونة
  const secretAdminBtn = document.getElementById('secretAdminBtn');
  if (secretAdminBtn) {
    secretAdminBtn.addEventListener('click', function() {
      document.getElementById('adminQuickLogin').classList.add('active');
    });
  }

  // إغلاق نافذة الدخول
  const closeBtn = document.getElementById('closeQuickLogin');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      document.getElementById('adminQuickLogin').classList.remove('active');
      const errorElement = document.getElementById('quickLoginError');
      if (errorElement) errorElement.style.display = 'none';
      const codeInput = document.getElementById('quickLoginCode');
      if (codeInput) codeInput.value = '';
    });
  }

  // معالجة تسجيل الدخول السريع
  const loginForm = document.getElementById('quickLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const codeInput = document.getElementById('quickLoginCode');
      const errorElement = document.getElementById('quickLoginError');
      
      if (!codeInput || !errorElement) return;
      
      const enteredCode = codeInput.value.trim();
      
      if (enteredCode === ADMIN_SECRET_CODE) {
        // نجاح الدخول - الانتقال إلى صفحة المشرفين
        window.location.href = 'pages/admin.html'; // أو رابط لوحة التحكم
      } else {
        // فشل الدخول
        errorElement.style.display = 'block';
        codeInput.value = '';
        codeInput.focus();
        
        // تأثير اهتزاز
        codeInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
          codeInput.style.animation = '';
        }, 500);
      }
    });
  }

  // إغلاق نافذة الدخول عند النقر خارجها
  const loginModal = document.getElementById('adminQuickLogin');
  if (loginModal) {
    loginModal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        const errorElement = document.getElementById('quickLoginError');
        if (errorElement) errorElement.style.display = 'none';
        const codeInput = document.getElementById('quickLoginCode');
        if (codeInput) codeInput.value = '';
      }
    });
  }

  // إضافة أنيميشن الاهتزاز إن لم تكن موجودة
  addShakeAnimation();
}

// إضافة أنيميشن الاهتزاز
function addShakeAnimation() {
  if (!document.querySelector('style[data-shake-animation]')) {
    const style = document.createElement('style');
    style.setAttribute('data-shake-animation', 'true');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
      }
    `;
    document.head.appendChild(style);
  }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  setupAdminAccess();
  console.log('نظام الدخول السريع للمشرفين جاهز');
});
// js/admin.js - تحديث الرسائل

// في معالجة تسجيل الدخول، عدل الرسائل:
if (enteredCode === ADMIN_SECRET_CODE) {
    // نجاح الدخول
    showSuccessMessage('✅ تم الدخول بنجاح، جارٍ التوجيه...');
    setTimeout(() => {
        window.location.href = 'pages/admin.html';
    }, 1500);
} else {
    // فشل الدخول
    errorElement.textContent = '❌ كود الدخول غير صحيح، حاول مرة أخرى';
    errorElement.style.display = 'block';
    codeInput.value = '';
    codeInput.focus();
    
    // تأثير اهتزاز
    codeInput.style.animation = 'shake 0.5s';
    setTimeout(() => {
        codeInput.style.animation = '';
    }, 500);
}

// دالة لعرض رسالة النجاح
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        font-family: 'Cairo', sans-serif;
        font-weight: bold;
        z-index: 2000;
        box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}