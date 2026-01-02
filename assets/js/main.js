// === نظام الإحصائيات المتطور ===

document.addEventListener('DOMContentLoaded', function() {
  // تهيئة العدادات المتحركة
  initAdvancedCounters();
  
  // تهيئة الرسم البياني
  initGrowthChart();
  
  // تفعيل تحديث الإحصائيات
  initLiveUpdates();
  
  // تفعيل التفاعلات
  initStatInteractions();
});

// تهيئة العدادات المتطورة
function initAdvancedCounters() {
  const counters = [
    { id: 'memberCount', target: 180, duration: 3000, prefix: '', suffix: '' },
    { id: 'territoryCount', target: 12, duration: 2500, prefix: '', suffix: '' },
    { id: 'yearCount', target: 5, duration: 2000, prefix: '', suffix: '' },
    { id: 'missionCount', target: 347, duration: 3500, prefix: '', suffix: '' },
    { id: 'defenseCount', target: 42, duration: 1500, prefix: '', suffix: '' },
    { id: 'revenueCount', target: 2.5, duration: 3000, prefix: '$', suffix: 'M' },
    { id: 'vehicleCount', target: 87, duration: 2000, prefix: '', suffix: '' },
    { id: 'leaderCount', target: 15, duration: 1800, prefix: '', suffix: '' }
  ];
  
  // تأخير بدء العدادات حتى يصل المستخدم للقسم
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          animateCounterAdvanced(counter.id, counter.target, counter.duration, counter.prefix, counter.suffix);
        });
        
        // تفعيل أشرطة التقدم
        animateProgressBars();
        
        // تفعيل الرسوم البيانية الصغيرة
        animateMiniCharts();
        
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
}

// عداد متطور مع تأثيرات
function animateCounterAdvanced(elementId, target, duration = 2000, prefix = '', suffix = '') {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let start = 0;
  const increment = target / (duration / 16);
  const isDecimal = target % 1 !== 0;
  
  const timer = setInterval(() => {
    start += increment;
    
    if (start >= target) {
      const finalValue = isDecimal ? target.toFixed(1) : Math.floor(target);
      element.innerHTML = `${prefix}${finalValue}${suffix}`;
      element.style.animation = 'countUp 0.5s ease';
      clearInterval(timer);
      
      // تأثير النهاية
      setTimeout(() => {
        element.style.animation = '';
        element.style.color = 'var(--primary-yellow)';
        element.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
        
        // إرجاع اللون بعد ثانية
        setTimeout(() => {
          element.style.color = '';
          element.style.textShadow = '';
        }, 1000);
      }, 500);
    } else {
      const currentValue = isDecimal ? start.toFixed(1) : Math.floor(start);
      element.innerHTML = `${prefix}${currentValue}${suffix}`;
    }
  }, 16);
}

// أشرطة التقدم المتحركة
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach(bar => {
    const currentWidth = bar.style.width;
    bar.style.width = '0%';
    
    setTimeout(() => {
      bar.style.transition = 'width 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      bar.style.width = currentWidth;
    }, 300);
  });
}

// الرسوم البيانية المصغرة المتحركة
function animateMiniCharts() {
  const chartBars = document.querySelectorAll('.chart-bar');
  chartBars.forEach((bar, index) => {
    const currentHeight = bar.style.height;
    bar.style.height = '0%';
    
    setTimeout(() => {
      bar.style.transition = 'height 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      bar.style.height = currentHeight;
    }, index * 200);
  });
}

// تهيئة الرسم البياني
function initGrowthChart() {
  const ctx = document.getElementById('statsChart');
  if (!ctx) return;
  
  const chart = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [{
        label: 'نمو الأعضاء',
        data: [120, 135, 150, 165, 175, 180],
        borderColor: 'rgba(255, 215, 0, 1)',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }, {
        label: 'المهام الناجحة',
        data: [45, 52, 60, 75, 85, 98],
        borderColor: 'rgba(52, 152, 219, 1)',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: 'rgba(255, 255, 255, 0.8)',
            font: {
              family: 'Cairo',
              size: 14
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    }
  });
  
  // تفعيل أزرار التحكم
  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // إزالة النشاط من جميع الأزرار
      document.querySelectorAll('.chart-btn').forEach(b => {
        b.classList.remove('active');
      });
      
      // إضافة النشاط للزر المحدد
      this.classList.add('active');
      
      const period = this.dataset.period;
      updateChartData(chart, period);
    });
  });
}

// تحديث بيانات الرسم البياني
function updateChartData(chart, period) {
  let newData;
  
  switch(period) {
    case 'monthly':
      newData = {
        labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
        datasets: [{
          data: [175, 178, 180, 182],
          label: 'نمو الأعضاء'
        }, {
          data: [92, 94, 96, 98],
          label: 'المهام الناجحة'
        }]
      };
      break;
      
    case 'quarterly':
      newData = {
        labels: ['الربع 1', 'الربع 2', 'الربع 3', 'الربع 4'],
        datasets: [{
          data: [150, 165, 175, 185],
          label: 'نمو الأعضاء'
        }, {
          data: [75, 85, 90, 95],
          label: 'المهام الناجحة'
        }]
      };
      break;
      
    case 'yearly':
      newData = {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [{
          data: [50, 100, 140, 175, 200],
          label: 'نمو الأعضاء'
        }, {
          data: [30, 60, 85, 95, 100],
          label: 'المهام الناجحة'
        }]
      };
      break;
  }
  
  chart.data.labels = newData.labels;
  chart.data.datasets[0].data = newData.datasets[0].data;
  chart.data.datasets[1].data = newData.datasets[1].data;
  chart.update();
}

// تحديث الإحصائيات الحي
function initLiveUpdates() {
  const refreshBtn = document.getElementById('refreshStats');
  const lastUpdate = document.getElementById('lastUpdate');
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      // تأثير التدوير
      this.style.transform = 'rotate(360deg)';
      this.style.transition = 'transform 0.5s ease';
      
      // محاكاة تحديث البيانات
      simulateLiveUpdate();
      
      // تحديث وقت التحديث
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      lastUpdate.textContent = `آخر تحديث: ${timeStr}`;
      
      // إرجاع الزر بعد التحديث
      setTimeout(() => {
        this.style.transform = 'rotate(0deg)';
      }, 500);
    });
  }
}

// محاكاة تحديث البيانات الحي
function simulateLiveUpdate() {
  // زيادة عشوائية في الإحصائيات
  const stats = [
    { id: 'memberCount', min: 1, max: 3 },
    { id: 'territoryCount', min: 0, max: 1 },
    { id: 'defenseCount', min: 1, max: 2 },
    { id: 'vehicleCount', min: 1, max: 3 }
  ];
  
  stats.forEach(stat => {
    const element = document.getElementById(stat.id);
    if (element) {
      const current = parseInt(element.textContent.replace(/[^\d]/g, ''));
      const increment = Math.floor(Math.random() * (stat.max - stat.min + 1)) + stat.min;
      const newValue = current + increment;
      
      // تأثير التحديث
      element.style.color = 'var(--success-green)';
      element.style.transition = 'color 0.3s ease';
      
      // تحديث القيمة مع تأثير
      setTimeout(() => {
        element.textContent = newValue + (stat.id === 'memberCount' ? '+' : '');
        element.style.color = '';
      }, 300);
    }
  });
  
  // إشعار التحديث
  showStatNotification('تم تحديث الإحصائيات بنجاح', 'success');
}

// إشعارات الإحصائيات
function showStatNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `stat-notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // أنماط الإشعار
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? 'var(--success-green)' : 'var(--info-blue)'};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 10000;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    animation: slideDown 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // إزالة الإشعار بعد 3 ثواني
  setTimeout(() => {
    notification.style.animation = 'slideDown 0.3s ease reverse';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// تفعيل التفاعلات
function initStatInteractions() {
  // تفعيل بطاقات الإحصاء
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    card.addEventListener('click', function() {
      // تأثير النقر
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
      
      // إظهار تفاصيل إضافية
      showStatDetails(this);
    });
    
    // تأثير التمرير
    card.addEventListener('mouseenter', function() {
      const icon = this.querySelector('.stat-icon i');
      icon.style.transform = 'rotate(15deg) scale(1.2)';
      icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.stat-icon i');
      icon.style.transform = '';
    });
  });
  
  // تفعيل النقاط على الخريطة
  const mapDots = document.querySelectorAll('.map-dot');
  mapDots.forEach(dot => {
    dot.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // تأثير النقر
      this.style.transform = 'translate(-50%, -50%) scale(1.5)';
      this.style.boxShadow = '0 0 20px var(--primary-yellow)';
      
      setTimeout(() => {
        this.style.transform = 'translate(-50%, -50%) scale(1)';
        this.style.boxShadow = '0 0 10px var(--primary-yellow)';
      }, 300);
      
      // إشعار
      showStatNotification('منطقة تحت سيطرة VAGOS', 'info');
    });
  });
  
  // تفعيل السنوات في الخط الزمني
  const timelineYears = document.querySelectorAll('.timeline-year');
  timelineYears.forEach(year => {
    year.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // إزالة النشاط من جميع السنوات
      timelineYears.forEach(y => {
        y.classList.remove('active');
      });
      
      // إضافة النشاط للسنة المحددة
      this.classList.add('active');
      
      // إظهار تفاصيل السنة
      const yearNum = this.dataset.year;
      const description = this.dataset.desc;
      showStatNotification(`سنة ${yearNum}: ${description}`, 'info');
    });
  });
}

// إظهار تفاصيل الإحصاء
function showStatDetails(card) {
  const statType = card.querySelector('.stat-label').textContent;
  const statValue = card.querySelector('.stat-number').textContent;
  
  // إنشاء نافذة التفاصيل
  const detailModal = document.createElement('div');
  detailModal.className = 'stat-detail-modal';
  detailModal.innerHTML = `
    <div class="detail-content">
      <h3>${statType}</h3>
      <div class="detail-value">${statValue}</div>
      <div class="detail-info">
        <p>تفاصيل إضافية حول ${statType.toLowerCase()}</p>
        <div class="detail-chart"></div>
        <p>هذه الإحصائيات يتم تحديثها بشكل دوري وتعكس قوة الإمبراطورية</p>
      </div>
      <button class="detail-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // أنماط النافذة
  detailModal.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    animation: fadeIn 0.3s ease;
  `;
  
  const detailContent = detailModal.querySelector('.detail-content');
  detailContent.style.cssText = `
    background: var(--dark-gray);
    padding: 40px;
    border-radius: 20px;
    border: 3px solid var(--primary-yellow);
    max-width: 500px;
    width: 90%;
    position: relative;
    animation: slideUp 0.3s ease;
  `;
  
  document.body.appendChild(detailModal);
  
  // زر الإغلاق
  const closeBtn = detailModal.querySelector('.detail-close');
  closeBtn.addEventListener('click', function() {
    detailModal.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
      detailModal.remove();
    }, 300);
  });
  
  // إغلاق عند النقر خارج النافذة
  detailModal.addEventListener('click', function(e) {
    if (e.target === this) {
      closeBtn.click();
    }
  });
  
  // إضافة أنماط الحركة إذا لم تكن موجودة
  const style = document.createElement('style');
  if (!document.querySelector('#animations-style')) {
    style.id = 'animations-style';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes slideDown {
        from { transform: translate(-50%, -50px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

// تحديث الإحصائيات بشكل دوري (كل دقيقة)
setInterval(() => {
  // زيادة عشوائية صغيرة
  const memberCount = document.getElementById('memberCount');
  if (memberCount && Math.random() > 0.8) {
    const current = parseInt(memberCount.textContent);
    memberCount.textContent = current + 1;
    memberCount.style.color = 'var(--success-green)';
    setTimeout(() => {
      memberCount.style.color = '';
    }, 1000);
  }
}, 60000);