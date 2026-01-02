// assets/js/apply.js

/**
 * OG VAGOS - نموذج التقديم
 * معالجة وإدارة نموذج التقديم للانضمام للعصابة
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('نموذج التقديم لـ OG VAGOS جاهز');
  
  // تهيئة نموذج التقديم
  initApplyForm();
  
  // تهيئة المدخلات التفاعلية
  initFormInputs();
  
  // تهيئة المحاكاة والاختبار
  initSimulation();
  
  // تهيئة التأثيرات البصرية
  initFormEffects();
});

/**
 * تهيئة نموذج التقديم الرئيسي
 */
function initApplyForm() {
  const applyForm = document.getElementById('applyForm');
  
  if (!applyForm) {
    console.error('لم يتم العثور على نموذج التقديم');
    return;
  }
  
  // إرسال النموذج
  applyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // التحقق من صحة النموذج
    if (validateApplyForm()) {
      // إرسال النموذج
      submitApplication();
    } else {
      // إظهار رسالة خطأ
      showFormError('يرجى تصحيح الأخطاء في النموذج قبل الإرسال');
    }
  });
  
  // إعادة تعيين النموذج
  const resetBtn = applyForm.querySelector('button[type="reset"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      resetForm();
    });
  }
  
  // التحقق الفوري للحقول
  setupLiveValidation();
}

/**
 * التحقق من صحة النموذج كاملاً
 */
function validateApplyForm() {
  let isValid = true;
  const form = document.getElementById('applyForm');
  
  // الحقول المطلوبة
  const requiredFields = form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  // التحقق من عمر المتقدم
  const ageField = document.getElementById('age');
  if (ageField) {
    const age = parseInt(ageField.value);
    if (age < 16 || age > 60) {
      showFieldError(ageField, 'العمر يجب أن يكون بين 16 و 60 سنة');
      isValid = false;
    }
  }
  
  // التحقق من سبب الانضمام (طول النص)
  const reasonField = document.getElementById('reason');
  if (reasonField && reasonField.value.trim().length < 50) {
    showFieldError(reasonField, 'يرجى كتابة سبب انضمامك بشكل مفصل (50 حرف على الأقل)');
    isValid = false;
  }
  
  // التحقق من قبول الشروط
  const termsField = document.getElementById('agreeTerms');
  if (termsField && !termsField.checked) {
    showTermsError('يجب الموافقة على شروط وقوانين العصابة');
    isValid = false;
  }
  
  return isValid;
}

/**
 * التحقق من صحة حقل معين
 */
function validateField(field) {
  const value = field.value.trim();
  
  // الحقل مطلوب
  if (field.hasAttribute('required') && value === '') {
    showFieldError(field, 'هذا الحقل مطلوب');
    return false;
  }
  
  // إعادة تعيين حالة الخطأ
  clearFieldError(field);
  
  // التحقق حسب نوع الحقل
  switch (field.type) {
    case 'text':
    case 'textarea':
      return validateTextField(field, value);
      
    case 'number':
      return validateNumberField(field, value);
      
    case 'select-one':
      return validateSelectField(field, value);
      
    default:
      return true;
  }
}

/**
 * التحقق من حقل النص
 */
function validateTextField(field, value) {
  // التحقق من طول النص
  if (field.hasAttribute('minlength')) {
    const minLength = parseInt(field.getAttribute('minlength'));
    if (value.length < minLength) {
      showFieldError(field, `يرجى إدخال ${minLength} حرف على الأقل`);
      return false;
    }
  }
  
  // التحقق من طول النص الأعلى
  if (field.hasAttribute('maxlength')) {
    const maxLength = parseInt(field.getAttribute('maxlength'));
    if (value.length > maxLength) {
      showFieldError(field, `يرجى إدخال ${maxLength} حرف كحد أقصى`);
      return false;
    }
  }
  
  // التحقق من تنسيق Discord
  if (field.id === 'discord' && value !== '') {
    const discordRegex = /^.{3,32}#[0-9]{4}$/;
    if (!discordRegex.test(value)) {
      showFieldError(field, 'تنسيق Discord غير صحيح (مثال: user#1234)');
      return false;
    }
  }
  
  return true;
}

/**
 * التحقق من حقل الأرقام
 */
function validateNumberField(field, value) {
  if (value === '') return true;
  
  const numValue = parseInt(value);
  
  // التحقق من الحد الأدنى
  if (field.hasAttribute('min')) {
    const min = parseInt(field.getAttribute('min'));
    if (numValue < min) {
      showFieldError(field, `القيمة يجب أن تكون ${min} أو أكثر`);
      return false;
    }
  }
  
  // التحقق من الحد الأقصى
  if (field.hasAttribute('max')) {
    const max = parseInt(field.getAttribute('max'));
    if (numValue > max) {
      showFieldError(field, `القيمة يجب أن تكون ${max} أو أقل`);
      return false;
    }
  }
  
  return true;
}

/**
 * التحقق من حقل الاختيار
 */
function validateSelectField(field, value) {
  if (value === '' || value === null) {
    showFieldError(field, 'يرجى اختيار قيمة من القائمة');
    return false;
  }
  
  return true;
}

/**
 * إظهار خطأ لحقل معين
 */
function showFieldError(field, message) {
  // إزالة أي أخطاء سابقة
  clearFieldError(field);
  
  // إنشاء عنصر الخطأ
  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.textContent = message;
  errorElement.style.cssText = `
    color: #ff4444;
    font-size: 0.9rem;
    margin-top: 5px;
    padding: 5px 10px;
    background-color: rgba(255, 68, 68, 0.1);
    border-radius: 4px;
    border-right: 3px solid #ff4444;
    animation: fadeIn 0.3s ease;
  `;
  
  // إضافة العنصر بعد الحقل
  field.parentNode.appendChild(errorElement);
  
  // إضافة كلاس الخطأ للحقل
  field.classList.add('field-error-highlight');
  
  // تأثير اهتزاز للحقل
  field.style.animation = 'fieldShake 0.5s';
  setTimeout(() => {
    field.style.animation = '';
  }, 500);
  
  // التركيز على الحقل
  field.focus();
  
  // تسجيل الخطأ في وحدة التحكم للتطوير
  console.warn(`خطأ في حقل ${field.id || field.name}: ${message}`);
}

/**
 * مسح أخطاء الحقل
 */
function clearFieldError(field) {
  // إزالة عناصر الخطأ الموجودة
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  
  // إزالة كلاس التمييز
  field.classList.remove('field-error-highlight');
}

/**
 * إظهار خطأ في الشروط
 */
function showTermsError(message) {
  // إزالة أي أخطاء سابقة
  const existingError = document.querySelector('.terms-error');
  if (existingError) {
    existingError.remove();
  }
  
  // إنشاء عنصر الخطأ
  const errorElement = document.createElement('div');
  errorElement.className = 'terms-error';
  errorElement.textContent = message;
  errorElement.style.cssText = `
    color: #ff4444;
    font-size: 0.9rem;
    margin-top: 10px;
    padding: 10px 15px;
    background-color: rgba(255, 68, 68, 0.1);
    border-radius: 5px;
    border: 1px solid #ff4444;
    text-align: center;
    animation: fadeIn 0.3s ease;
  `;
  
  // إضافة العنصر بعد خانة الاختيار
  const termsCheckbox = document.getElementById('agreeTerms');
  if (termsCheckbox) {
    termsCheckbox.parentNode.parentNode.appendChild(errorElement);
  }
  
  // تسجيل الخطأ
  console.warn(`خطأ في الشروط: ${message}`);
}

/**
 * إظهار خطأ عام في النموذج
 */
function showFormError(message) {
  // إزالة أي أخطاء سابقة
  const existingError = document.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  
  // إنشاء عنصر الخطأ
  const errorElement = document.createElement('div');
  errorElement.className = 'form-error';
  errorElement.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    <span>${message}</span>
  `;
  errorElement.style.cssText = `
    color: #ff9900;
    font-size: 1rem;
    margin: 20px auto;
    padding: 15px 20px;
    background-color: rgba(255, 153, 0, 0.1);
    border-radius: 8px;
    border: 2px solid #ff9900;
    text-align: center;
    max-width: 600px;
    animation: fadeIn 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  `;
  
  // إضافة العنصر قبل النموذج
  const form = document.getElementById('applyForm');
  if (form) {
    form.parentNode.insertBefore(errorElement, form);
  }
  
  // إزالة الخطأ بعد 5 ثوانٍ
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.style.opacity = '0';
      errorElement.style.transform = 'translateY(-10px)';
      errorElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.remove();
        }
      }, 300);
    }
  }, 5000);
}

/**
 * إرسال التقديم
 */
function submitApplication() {
  const form = document.getElementById('applyForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  if (!form || !submitBtn) return;
  
  // تغيير حالة زر الإرسال
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
  submitBtn.disabled = true;
  
  // جمع بيانات النموذج
  const formData = collectFormData();
  
  // محاكاة تأخير الشبكة
  setTimeout(() => {
    // إرسال البيانات (في التطبيق الحقيقي: fetch إلى الخادم)
    simulateServerResponse(formData)
      .then(response => {
        // عرض رسالة النجاح
        showSuccessMessage(response);
        
        // إعادة تعيين النموذج
        setTimeout(() => {
          form.reset();
          resetCharacterCounter();
        }, 2000);
      })
      .catch(error => {
        // عرض رسالة الخطأ
        showSubmissionError(error.message);
        
        // إعادة تعيين زر الإرسال
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  }, 2000);
}

/**
 * جمع بيانات النموذج
 */
function collectFormData() {
  const form = document.getElementById('applyForm');
  const data = {};
  
  // جمع البيانات من الحقول
  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(field => {
    if (field.name && field.type !== 'submit' && field.type !== 'reset') {
      if (field.type === 'checkbox') {
        data[field.name] = field.checked;
      } else {
        data[field.name] = field.value.trim();
      }
    }
  });
  
  // إضافة معلومات إضافية
  data.timestamp = new Date().toISOString();
  data.userAgent = navigator.userAgent;
  data.referrer = document.referrer;
  
  return data;
}

/**
 * محاكاة استجابة الخادم
 */
function simulateServerResponse(formData) {
  return new Promise((resolve, reject) => {
    // محاكاة نسبة نجاح 90%
    const isSuccess = Math.random() < 0.9;
    
    setTimeout(() => {
      if (isSuccess) {
        resolve({
          success: true,
          message: 'تم إرسال التقديم بنجاح! 🔥',
          details: 'سيتم مراجعة طلبك خلال 3-5 أيام عمل. سنتواصل معك على Discord في حال الموافقة المبدئية.',
          applicationId: 'APP-' + Date.now().toString().slice(-8),
          data: formData
        });
      } else {
        reject({
          success: false,
          message: 'فشل في إرسال التقديم',
          details: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
          code: 'SERVER_ERROR'
        });
      }
    }, 1500);
  });
}

/**
 * عرض رسالة النجاح
 */
function showSuccessMessage(response) {
  // إخفاء النموذج
  const form = document.getElementById('applyForm');
  const successMessage = document.getElementById('successMessage');
  
  if (form) {
    form.style.display = 'none';
  }
  
  if (successMessage) {
    // تحديث محتوى رسالة النجاح
    const messageText = successMessage.querySelector('p');
    if (messageText) {
      messageText.textContent = response.details;
    }
    
    // إضافة رقم الطلب
    const appIdElement = document.createElement('div');
    appIdElement.className = 'application-id';
    appIdElement.innerHTML = `
      <strong>رقم طلبك:</strong> ${response.applicationId}
    `;
    appIdElement.style.cssText = `
      margin: 15px 0;
      padding: 10px;
      background-color: rgba(0, 100, 0, 0.1);
      border-radius: 5px;
      border: 1px solid #00aa00;
      font-family: monospace;
      font-size: 1.2rem;
    `;
    
    successMessage.insertBefore(appIdElement, successMessage.querySelector('.back-link'));
    
    // إظهار رسالة النجاح
    successMessage.style.display = 'block';
    
    // تأثير الظهور
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      successMessage.style.opacity = '1';
      successMessage.style.transform = 'translateY(0)';
      successMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }, 100);
    
    // تسجيل النجاح
    console.log('تم إرسال التقديم بنجاح:', response);
    
    // إشعار صوتي (إذا كان مسموحاً)
    playSuccessSound();
  }
}

/**
 * عرض خطأ في الإرسال
 */
function showSubmissionError(errorMessage) {
  // إنشاء رسالة خطأ
  const errorElement = document.createElement('div');
  errorElement.className = 'submission-error';
  errorElement.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <div>
      <h4>فشل في إرسال التقديم</h4>
      <p>${errorMessage}</p>
      <button id="retrySubmit" class="btn">إعادة المحاولة</button>
    </div>
  `;
  errorElement.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--dark-gray);
    padding: 30px;
    border-radius: 10px;
    border: 3px solid #ff4444;
    z-index: 1000;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    animation: fadeIn 0.3s ease;
  `;
  
  // إضافة زر إعادة المحاولة
  document.body.appendChild(errorElement);
  
  // حدث إعادة المحاولة
  document.getElementById('retrySubmit').addEventListener('click', function() {
    errorElement.remove();
    submitApplication();
  });
  
  // إغلاق النافذة عند النقر خارجها
  errorElement.addEventListener('click', function(e) {
    if (e.target === this) {
      this.remove();
    }
  });
  
  // إغلاق بالزر ESC
  const closeHandler = function(e) {
    if (e.key === 'Escape') {
      errorElement.remove();
      document.removeEventListener('keydown', closeHandler);
    }
  };
  
  document.addEventListener('keydown', closeHandler);
}

/**
 * تهيئة المدخلات التفاعلية
 */
function initFormInputs() {
  // عداد الأحرف لسبب الانضمام
  const reasonField = document.getElementById('reason');
  if (reasonField) {
    setupCharacterCounter(reasonField);
    
    // اقتراحات تلقائية
    reasonField.addEventListener('focus', function() {
      showReasonSuggestions();
    });
  }
  
  // محدد العمر
  const ageField = document.getElementById('age');
  if (ageField) {
    setupAgeSlider();
  }
  
  // اقتراحات أسماء RP
  const rpNameField = document.getElementById('rpName');
  if (rpNameField) {
    setupNameSuggestions(rpNameField);
  }
}

/**
 * إعداد عداد الأحرف
 */
function setupCharacterCounter(textarea) {
  // إنشاء العداد
  const counter = document.createElement('div');
  counter.className = 'char-counter';
  counter.style.cssText = `
    font-size: 0.8rem;
    color: var(--text-gray);
    text-align: left;
    margin-top: 5px;
    padding: 0 5px;
  `;
  
  textarea.parentNode.appendChild(counter);
  
  // تحديث العداد
  function updateCounter() {
    const length = textarea.value.length;
    const minLength = textarea.getAttribute('minlength') || 50;
    
    counter.textContent = `${length} / ${minLength} حرف`;
    
    if (length < minLength) {
      counter.style.color = '#ff4444';
    } else if (length < minLength * 1.5) {
      counter.style.color = '#ff9900';
    } else {
      counter.style.color = '#00aa00';
    }
  }
  
  // أحداث التحديث
  textarea.addEventListener('input', updateCounter);
  textarea.addEventListener('change', updateCounter);
  
  // التحديث الأولي
  updateCounter();
}

/**
 * إعادة تعيين عداد الأحرف
 */
function resetCharacterCounter() {
  const counter = document.querySelector('.char-counter');
  if (counter) {
    counter.textContent = '0 / 50 حرف';
    counter.style.color = 'var(--text-gray)';
  }
}

/**
 * إعداد محدد العمر
 */
function setupAgeSlider() {
  const ageField = document.getElementById('age');
  if (!ageField) return;
  
  // إنشاء محدد
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '16';
  slider.max = '60';
  slider.value = ageField.value || '18';
  slider.className = 'age-slider';
  slider.style.cssText = `
    width: 100%;
    margin-top: 10px;
    -webkit-appearance: none;
    height: 8px;
    background: var(--light-gray);
    border-radius: 4px;
    outline: none;
  `;
  
  // تحديث حقل العمر عند تحريك المحدد
  slider.addEventListener('input', function() {
    ageField.value = this.value;
    
    // إطلاق حدث التغيير
    ageField.dispatchEvent(new Event('change', { bubbles: true }));
  });
  
  // تحديث المحدد عند تغيير حقل العمر
  ageField.addEventListener('input', function() {
    const value = parseInt(this.value) || 18;
    
    if (value < 16) this.value = 16;
    if (value > 60) this.value = 60;
    
    slider.value = this.value;
  });
  
  // إضافة المحدد بعد حقل العمر
  ageField.parentNode.appendChild(slider);
}

/**
 * إعداد اقتراحات الأسماء
 */
function setupNameSuggestions(field) {
  const suggestions = [
    'VENOM.SHADOW', 'BLOOD.RIDER', 'DARK.SPIRIT', 'SILENT.WOLF',
    'GHOST.KILLER', 'IRON.FIST', 'DEADLY.SHOT', 'SHADOW.WALKER',
    'NIGHT.HUNTER', 'CRIMSON.BLADE', 'PHANTOM.STRIKE', 'VENGEANCE.SOUL'
  ];
  
  // إنشاء قائمة الاقتراحات
  const suggestionList = document.createElement('div');
  suggestionList.className = 'name-suggestions';
  suggestionList.style.cssText = `
    display: none;
    position: absolute;
    background: var(--dark-gray);
    border: 1px solid var(--primary-red);
    border-radius: 5px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 100;
    margin-top: 5px;
    width: 100%;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  `;
  
  // إضافة الاقتراحات
  suggestions.forEach(name => {
    const suggestion = document.createElement('div');
    suggestion.className = 'name-suggestion';
    suggestion.textContent = name;
    suggestion.style.cssText = `
      padding: 10px 15px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    suggestion.addEventListener('mouseenter', function() {
      this.style.backgroundColor = 'var(--primary-red)';
    });
    
    suggestion.addEventListener('mouseleave', function() {
      this.style.backgroundColor = '';
    });
    
    suggestion.addEventListener('click', function() {
      field.value = this.textContent;
      suggestionList.style.display = 'none';
      
      // إطلاق حدث التغيير
      field.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    suggestionList.appendChild(suggestion);
  });
  
  // إضافة القائمة
  field.parentNode.style.position = 'relative';
  field.parentNode.appendChild(suggestionList);
  
  // إظهار/إخفاء القائمة
  field.addEventListener('focus', function() {
    suggestionList.style.display = 'block';
  });
  
  field.addEventListener('blur', function() {
    setTimeout(() => {
      suggestionList.style.display = 'none';
    }, 200);
  });
}

/**
 * إظهار اقتراحات لسبب الانضمام
 */
function showReasonSuggestions() {
  const suggestions = [
    "أبحث عن مجتمع RP جاد ومنظم",
    "أريد تطوير مهاراتي في لعب الأدوار",
    "أعجبني نظام وقوانين العصابة",
    "أبحث عن تحدٍ جديد في عالم FiveM",
    "أريد الانضمام لمجتمع متماسك وملتزم"
  ];
  
  // إنشاء عنصر الاقتراحات
  const suggestionBox = document.createElement('div');
  suggestionBox.className = 'reason-suggestions';
  suggestionBox.innerHTML = `
    <div class="suggestion-header">
      <i class="fas fa-lightbulb"></i>
      <span>اقتراحات لسبب الانضمام:</span>
    </div>
    <div class="suggestion-list">
      ${suggestions.map(s => `<div class="suggestion-item">${s}</div>`).join('')}
    </div>
  `;
  suggestionBox.style.cssText = `
    margin-top: 10px;
    padding: 15px;
    background-color: rgba(196, 8, 8, 0.05);
    border-radius: 8px;
    border: 1px solid var(--primary-red);
    animation: fadeIn 0.3s ease;
  `;
  
  // إضافة الاقتراحات
  const reasonField = document.getElementById('reason');
  if (reasonField && !document.querySelector('.reason-suggestions')) {
    reasonField.parentNode.appendChild(suggestionBox);
    
    // أحداث العناصر المقترحة
    const suggestionItems = suggestionBox.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
      item.style.cssText = `
        padding: 8px 12px;
        margin: 5px 0;
        background-color: rgba(40, 40, 40, 0.8);
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-right: 3px solid transparent;
      `;
      
      item.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(196, 8, 8, 0.1)';
        this.style.borderRightColor = 'var(--primary-red)';
        this.style.transform = 'translateX(-3px)';
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'rgba(40, 40, 40, 0.8)';
        this.style.borderRightColor = 'transparent';
        this.style.transform = 'translateX(0)';
      });
      
      item.addEventListener('click', function() {
        reasonField.value = this.textContent;
        
        // إطلاق حدث التغيير
        reasonField.dispatchEvent(new Event('input', { bubbles: true }));
        
        // إزالة الاقتراحات
        suggestionBox.remove();
      });
    });
    
    // إزالة الاقتراحات عند الكتابة
    reasonField.addEventListener('input', function() {
      if (this.value.length > 20 && suggestionBox.parentNode) {
        suggestionBox.style.opacity = '0';
        suggestionBox.style.transform = 'translateY(-10px)';
        suggestionBox.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
          if (suggestionBox.parentNode) {
            suggestionBox.remove();
          }
        }, 300);
      }
    });
  }
}

/**
 * إعداد التحقق المباشر
 */
function setupLiveValidation() {
  const form = document.getElementById('applyForm');
  if (!form) return;
  
  const fields = form.querySelectorAll('input, select, textarea');
  
  fields.forEach(field => {
    // التحقق عند الخروج من الحقل
    field.addEventListener('blur', function() {
      validateField(this);
    });
    
    // التحقق أثناء الكتابة (بعد توقف)
    let timeout;
    field.addEventListener('input', function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (this.value.trim().length > 0) {
          validateField(this);
        }
      }, 500);
    });
  });
}

/**
 * تهيئة المحاكاة والاختبار
 */
function initSimulation() {
  // زر ملء النموذج تلقائياً (للتطوير والاختبار)
  const testBtn = document.createElement('button');
  testBtn.id = 'fillTestData';
  testBtn.innerHTML = '<i class="fas fa-vial"></i> ملء بيانات تجريبية';
  testBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #444;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 999;
    font-size: 0.8rem;
    opacity: 0.3;
    transition: opacity 0.3s;
  `;
  
  testBtn.addEventListener('mouseenter', function() {
    this.style.opacity = '1';
  });
  
  testBtn.addEventListener('mouseleave', function() {
    this.style.opacity = '0.3';
  });
  
  testBtn.addEventListener('click', fillTestData);
  
  // إضافة الزر فقط في وضع التطوير
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.body.appendChild(testBtn);
  }
}

/**
 * ملء بيانات تجريبية
 */
function fillTestData() {
  const testData = {
    rpName: 'VENOM.SHADOW',
    age: '22',
    discord: 'venomshadow#1234',
    experience: 'intermediate',
    playtime: 'medium',
    reason: 'أبحث عن مجتمع RP جاد ومنظم حيث يمكنني تطوير مهاراتي في لعب الأدوار. أعجبتني قوانين OG VAGOS والانضباط الذي تتبناه العصابة. لدي خبرة سابقة في عصابة أخرى وأريد الانضمام لمجتمع أكثر تنظيماً وتحدياً.',
    previousGangs: 'كنت عضوًا في عصابة BLOODS لمدة 3 أشهر، غادرتها بسبب قلة الانضباط وتكرار المخالفات.',
    agreeTerms: true
  };
  
  // تعبئة الحقول
  document.getElementById('rpName').value = testData.rpName;
  document.getElementById('age').value = testData.age;
  document.getElementById('discord').value = testData.discord;
  document.getElementById('experience').value = testData.experience;
  document.getElementById('playtime').value = testData.playtime;
  document.getElementById('reason').value = testData.reason;
  document.getElementById('previousGangs').value = testData.previousGangs;
  document.getElementById('agreeTerms').checked = testData.agreeTerms;
  
  // إطلاق أحداث التغيير
  const fields = document.querySelectorAll('#applyForm input, #applyForm select, #applyForm textarea');
  fields.forEach(field => {
    field.dispatchEvent(new Event('change', { bubbles: true }));
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });
  
  // رسالة تأكيد
  const notification = document.createElement('div');
  notification.innerHTML = '<i class="fas fa-check"></i> تم تعبئة البيانات التجريبية';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #00aa00;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    animation: fadeIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translate(-50%, -10px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 2000);
}

/**
 * تهيئة التأثيرات البصرية
 */
function initFormEffects() {
  // تأثيرات الحقول
  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    // تأثير التركيز
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateY(-2px)';
      this.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'translateY(0)';
    });
    
    // تأثير الكتابة (لحقول النص)
    if (input.type === 'text' || input.type === 'textarea') {
      input.addEventListener('input', function() {
        if (this.value.length > 0) {
          this.style.borderColor = 'var(--primary-red)';
        } else {
          this.style.borderColor = '';
        }
      });
    }
  });
  
  // تأثير تحميل الصفحة
  window.addEventListener('load', function() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
      formContainer.style.opacity = '0';
      formContainer.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
        formContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }, 300);
    }
  });
}

/**
 * إعادة تعيين النموذج
 */
function resetForm() {
  const form = document.getElementById('applyForm');
  if (!form) return;
  
  form.reset();
  
  // إعادة تعيين أخطاء الحقول
  const errors = document.querySelectorAll('.field-error, .form-error, .terms-error');
  errors.forEach(error => {
    if (error.parentNode) {
      error.remove();
    }
  });
  
  // إعادة تعيين تمييز الحقول
  const highlightedFields = document.querySelectorAll('.field-error-highlight');
  highlightedFields.forEach(field => {
    field.classList.remove('field-error-highlight');
  });
  
  // إعادة تعيين عداد الأحرف
  resetCharacterCounter();
  
  // رسالة تأكيد
  console.log('تم إعادة تعيين النموذج');
}

/**
 * تشغيل صوت النجاح
 */
function playSuccessSound() {
  // إنشاء عنصر صوتي
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

/**
 * إضافة أنماط CSS ديناميكية
 */
const applyStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fieldShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.field-error-highlight {
  border-color: #ff4444 !important;
  box-shadow: 0 0 5px rgba(255, 68, 68, 0.3) !important;
}

.age-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: var(--primary-red);
  border-radius: 50%;
  cursor: pointer;
}

.age-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--primary-red);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: var(--primary-red);
  font-weight: bold;
}

.suggestion-header i {
  font-size: 1.2rem;
}

.suggestion-item:hover {
  background-color: rgba(196, 8, 8, 0.1) !important;
  border-right-color: var(--primary-red) !important;
  transform: translateX(-3px) !important;
}

.name-suggestion:hover {
  background-color: var(--primary-red) !important;
}

/* أنماط خاصة بصفحة التقديم */
.form-container {
  animation: fadeIn 0.5s ease;
}

.success-message {
  animation: fadeIn 0.5s ease;
}

.application-id {
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}
`;

// إضافة الأنماط إلى المستند
const styleSheet = document.createElement('style');
styleSheet.textContent = applyStyles;
document.head.appendChild(styleSheet);

// جعل الدوال متاحة عالمياً للاستخدام من قبل ملفات أخرى
window.OGVAGOS_APPLY = {
  validateApplyForm,
  submitApplication,
  fillTestData,
  resetForm
};