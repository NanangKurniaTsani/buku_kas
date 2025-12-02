// ============================================
// DATA STORAGE & INITIALIZATION
// ============================================

// Data Aplikasi
let children = JSON.parse(localStorage.getItem('children')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let settings = JSON.parse(localStorage.getItem('settings')) || {
    kasAmount: 10000,
    theme: 'blue',
    backupAuto: false,
    notifications: true,
    autoCalculateBalance: true,
    monthlyReminder: true,
    lastBackup: null,
    lastMonthCheck: null
};
let initialBalance = JSON.parse(localStorage.getItem('initialBalance')) || {
    amount: 0,
    month: null,
    year: null,
    note: 'Saldo awal bulan',
    fromPreviousMonth: false
};
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

// State Aplikasi
let currentFilter = {
    month: 'all',
    year: 'all',
    search: '',
    sortBy: 'date-desc',
    transactionType: 'all'
};
let currentPage = 1;
const ITEMS_PER_PAGE = 10;
let confirmCallback = null;

// Chart Instances
let kasChart = null;
let expenseChart = null;

// ============================================
// DOM ELEMENTS
// ============================================

// Header Elements
const currentMonthYearElement = document.getElementById('currentMonthYear');
const kasAmountDisplay = document.getElementById('kasAmountDisplay');
const kasAmountText = document.getElementById('kasAmountText');
const saldoAwalBadge = document.getElementById('saldoAwalBadge');
const saldoAwalAmount = document.getElementById('saldoAwalAmount');
const notificationCount = document.getElementById('notificationCount');

// Progress Elements
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const paidCount = document.getElementById('paidCount');
const totalChildren = document.getElementById('totalChildren');

// Filter Elements
const searchInput = document.getElementById('searchInput');
const filterMonth = document.getElementById('filterMonth');
const filterYear = document.getElementById('filterYear');
const sortBy = document.getElementById('sortBy');
const applyFilter = document.getElementById('applyFilter');
const resetFilter = document.getElementById('resetFilter');

// Form Elements
const childForm = document.getElementById('childForm');
const childNameInput = document.getElementById('childNameInput');
const childClassInput = document.getElementById('childClassInput');
const expenseForm = document.getElementById('expenseForm');
const expenseAmount = document.getElementById('expenseAmount');
const expenseDate = document.getElementById('expenseDate');
const expenseCategory = document.getElementById('expenseCategory');
const expenseNote = document.getElementById('expenseNote');
const otherIncomeForm = document.getElementById('otherIncomeForm');
const otherIncomeAmount = document.getElementById('otherIncomeAmount');
const otherIncomeDate = document.getElementById('otherIncomeDate');
const otherIncomeCategory = document.getElementById('otherIncomeCategory');
const otherIncomeNote = document.getElementById('otherIncomeNote');

// Action Buttons
const settingsBtn = document.getElementById('settingsBtn');
const quickIncomeBtn = document.getElementById('quickIncomeBtn');
const notificationBell = document.getElementById('notificationBell');
const payAllKas = document.getElementById('payAllKas');

// Transaction Filter Buttons
const showAllTransactions = document.getElementById('showAllTransactions');
const showKasOnly = document.getElementById('showKasOnly');
const showIncomeOnly = document.getElementById('showIncomeOnly');
const showExpenseOnly = document.getElementById('showExpenseOnly');
const clearAll = document.getElementById('clearAll');

// Export Buttons
const exportExcel = document.getElementById('exportExcel');
const exportPDF = document.getElementById('exportPDF');
const exportWord = document.getElementById('exportWord');
const sendWA = document.getElementById('sendWA');

// Summary Elements
const totalKasIncome = document.getElementById('totalKasIncome');
const totalOtherIncome = document.getElementById('totalOtherIncome');
const totalExpense = document.getElementById('totalExpense');
const totalIncome = document.getElementById('totalIncome');
const balance = document.getElementById('balance');
const kasChildCount = document.getElementById('kasChildCount');
const otherIncomeCount = document.getElementById('otherIncomeCount');
const expenseCount = document.getElementById('expenseCount');
const totalIncomeCount = document.getElementById('totalIncomeCount');
const balanceStatus = document.getElementById('balanceStatus');
const summaryMonth = document.getElementById('summaryMonth');
const summaryInfo = document.getElementById('summaryInfo');
const saldoWarning = document.getElementById('saldoWarning');
const saldoHealthy = document.getElementById('saldoHealthy');

// Children Elements
const childrenListContainer = document.getElementById('childrenListContainer');
const emptyChildren = document.getElementById('emptyChildren');
const childCount = document.getElementById('childCount');

// Monthly Data Elements
const monthlyData = document.getElementById('monthlyData');
const emptyMonthly = document.getElementById('emptyMonthly');
const monthlyDataInfo = document.getElementById('monthlyDataInfo');

// Transaction Elements
const transactionList = document.getElementById('transactionList');
const emptyState = document.getElementById('emptyState');
const transactionInfo = document.getElementById('transactionInfo');
const transactionCount = document.getElementById('transactionCount');
const paginationInfo = document.getElementById('paginationInfo');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageNumbers = document.getElementById('pageNumbers');

// Initial Balance Elements
const initialBalanceContainer = document.getElementById('initialBalanceContainer');
const initialBalanceAmount = document.getElementById('initialBalanceAmount');
const initialBalanceMonth = document.getElementById('initialBalanceMonth');
const initialBalanceNote = document.getElementById('initialBalanceNote');

// Chart Stats
const averageKas = document.getElementById('averageKas');
const highestMonth = document.getElementById('highestMonth');
const largestExpense = document.getElementById('largestExpense');

// Footer Stats
const footerStats = document.getElementById('footerStats');

// Modal Elements
const editChildModal = document.getElementById('editChildModal');
const editChildForm = document.getElementById('editChildForm');
const editChildId = document.getElementById('editChildId');
const editChildName = document.getElementById('editChildName');
const editChildClass = document.getElementById('editChildClass');

const editTransactionModal = document.getElementById('editTransactionModal');
const editTransactionForm = document.getElementById('editTransactionForm');
const editTransactionId = document.getElementById('editTransactionId');
const editTransactionType = document.getElementById('editTransactionType');
const editTransactionAmount = document.getElementById('editTransactionAmount');
const editTransactionDate = document.getElementById('editTransactionDate');
const editTransactionNote = document.getElementById('editTransactionNote');
const editTransactionCategory = document.getElementById('editTransactionCategory');

const initialBalanceModal = document.getElementById('initialBalanceModal');
const initialBalanceForm = document.getElementById('initialBalanceForm');
const initialBalanceAmountInput = document.getElementById('initialBalanceAmountInput');
const initialBalanceMonthInput = document.getElementById('initialBalanceMonthInput');
const initialBalanceYear = document.getElementById('initialBalanceYear');
const initialBalanceNoteInput = document.getElementById('initialBalanceNoteInput');

const settingsModal = document.getElementById('settingsModal');
const settingsForm = document.getElementById('settingsForm');
const kasAmountSetting = document.getElementById('kasAmountSetting');
const themeSetting = document.getElementById('themeSetting');
const backupAuto = document.getElementById('backupAuto');
const notificationsSetting = document.getElementById('notifications');
const autoCalculateBalance = document.getElementById('autoCalculateBalance');
const monthlyReminder = document.getElementById('monthlyReminder');

const notificationsModal = document.getElementById('notificationsModal');
const notificationsList = document.getElementById('notificationsList');
const unreadCount = document.getElementById('unreadCount');

const confirmModal = document.getElementById('confirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const confirmAction = document.getElementById('confirmAction');

const loadingOverlay = document.getElementById('loadingOverlay');
const notificationPopup = document.getElementById('notificationPopup');
const headerNotification = document.getElementById('headerNotification');

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format Date
function formatDate(dateString, includeTime = false) {
    const date = new Date(dateString);
    if (includeTime) {
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Get Month from Date
function getMonthFromDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', { month: 'long' });
}

// Get Year from Date
function getYearFromDate(dateString) {
    const date = new Date(dateString);
    return date.getFullYear();
}

// Get Previous Month
function getPreviousMonth(currentMonth, currentYear) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    let monthIndex = months.indexOf(currentMonth);
    let year = currentYear;
    
    if (monthIndex === 0) {
        monthIndex = 11;
        year--;
    } else {
        monthIndex--;
    }
    
    return {
        month: months[monthIndex],
        year: year
    };
}

// Highlight Text
function highlightText(text, search) {
    if (!search) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

// Show Loading
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

// Hide Loading
function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// Show Toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type} animate-slide-in-right`;
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'} mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show Confirmation Modal
function showConfirm(title, message, actionText, callback) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmAction.textContent = actionText;
    confirmCallback = callback;
    confirmModal.classList.remove('hidden');
}

// Close Confirmation Modal
function closeConfirmModal() {
    confirmModal.classList.add('hidden');
    confirmCallback = null;
}

// Process Confirmation
function processConfirmation() {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmModal();
}

// Save Data to LocalStorage
function saveData() {
    localStorage.setItem('children', JSON.stringify(children));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('settings', JSON.stringify(settings));
    localStorage.setItem('initialBalance', JSON.stringify(initialBalance));
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

// Add Notification
function addNotification(title, message, type = 'info', data = {}) {
    const notification = {
        id: Date.now().toString(),
        type: type,
        title: title,
        message: message,
        date: new Date().toISOString(),
        read: false,
        data: data
    };
    
    notifications.unshift(notification);
    saveData();
    updateNotificationBadge();
    
    if (settings.notifications) {
        showNotificationPopup(notification);
    }
    
    return notification;
}

// Update Notification Badge
function updateNotificationBadge() {
    const unread = notifications.filter(n => !n.read).length;
    notificationCount.textContent = unread > 99 ? '99+' : unread;
    
    if (unread > 0) {
        notificationCount.classList.remove('hidden');
        unreadCount.textContent = unread > 99 ? '99+' : unread;
    } else {
        notificationCount.classList.add('hidden');
        unreadCount.textContent = '0';
    }
}

// Show Notification Popup
function showNotificationPopup(notification) {
    const popup = document.createElement('div');
    popup.className = 'bg-white rounded-xl shadow-2xl p-4 mb-3 border-l-4 animate-slide-in-right';
    popup.style.borderLeftColor = getNotificationColor(notification.type);
    
    popup.innerHTML = `
        <div class="flex items-start justify-between">
            <div class="flex items-start space-x-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center mt-1" 
                     style="background: ${getNotificationColor(notification.type)}20">
                    <i class="fas ${getNotificationIcon(notification.type)}" 
                       style="color: ${getNotificationColor(notification.type)}"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800">${notification.title}</h4>
                    <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
                    <p class="text-xs text-gray-500 mt-2">${formatDate(notification.date, true)}</p>
                </div>
            </div>
            <button onclick="markNotificationAsRead('${notification.id}', this)" 
                    class="text-gray-400 hover:text-gray-600 ml-2">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notificationPopup.appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 5000);
}

// Get Notification Icon
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'reminder': return 'fa-bell';
        case 'payment': return 'fa-money-bill-wave';
        case 'balance': return 'fa-piggy-bank';
        default: return 'fa-info-circle';
    }
}

// Get Notification Color
function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        case 'reminder': return '#3b82f6';
        case 'payment': return '#8b5cf6';
        case 'balance': return '#ec4899';
        default: return '#6b7280';
    }
}

// Mark Notification as Read
function markNotificationAsRead(id, element = null) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        saveData();
        updateNotificationBadge();
        
        if (element) {
            element.closest('.animate-slide-in-right').remove();
        }
    }
}

// Mark All Notifications as Read
function markAllNotificationsAsRead() {
    notifications.forEach(n => n.read = true);
    saveData();
    updateNotificationBadge();
    showToast('Semua notifikasi ditandai sudah dibaca', 'success');
    displayNotifications();
}

// Clear All Notifications
function clearAllNotifications() {
    notifications = [];
    saveData();
    updateNotificationBadge();
    showToast('Semua notifikasi dihapus', 'success');
    displayNotifications();
}

// Display Notifications
function displayNotifications() {
    if (!notificationsList) return;
    
    if (notifications.length === 0) {
        notificationsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-bell-slash text-4xl mb-3 text-gray-300"></i>
                <p>Tidak ada notifikasi</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    notifications.forEach(notification => {
        const isUnread = !notification.read;
        html += `
            <div class="notification-item ${isUnread ? 'unread' : 'read'} mb-3 p-4 rounded-xl border-l-4" 
                 style="border-left-color: ${getNotificationColor(notification.type)}">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                            <i class="fas ${getNotificationIcon(notification.type)}" 
                               style="color: ${getNotificationColor(notification.type)}"></i>
                            <h4 class="font-bold ${isUnread ? 'text-gray-800' : 'text-gray-600'}">${notification.title}</h4>
                            ${isUnread ? '<span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">BARU</span>' : ''}
                        </div>
                        <p class="text-sm text-gray-600 mb-2">${notification.message}</p>
                        <p class="text-xs text-gray-500">${formatDate(notification.date, true)}</p>
                        
                        ${notification.data.month ? `
                            <div class="mt-3">
                                <button onclick="viewMonthDetail('${notification.data.month}', ${notification.data.year || 'all'})" 
                                        class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200">
                                    <i class="fas fa-eye mr-1"></i> Lihat Detail
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    ${isUnread ? `
                        <button onclick="markNotificationAsRead('${notification.id}')" 
                                class="text-gray-400 hover:text-gray-600 ml-3">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    notificationsList.innerHTML = html;
}

// Open Notifications Modal
function openNotificationsModal() {
    displayNotifications();
    notificationsModal.classList.remove('hidden');
}

// Close Notifications Modal
function closeNotificationsModal() {
    notificationsModal.classList.add('hidden');
}

// Show Header Notification
function showHeaderNotification(message, type = 'info') {
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.textContent = message;
    
    headerNotification.classList.remove('hidden');
    setTimeout(() => {
        headerNotification.classList.remove('-translate-y-full');
    }, 10);
    
    setTimeout(() => {
        hideHeaderNotification();
    }, 5000);
}

// Hide Header Notification
function hideHeaderNotification() {
    headerNotification.classList.add('-translate-y-full');
    setTimeout(() => {
        headerNotification.classList.add('hidden');
    }, 500);
}

// ============================================
// INITIAL BALANCE SYSTEM
// ============================================

// Check Previous Month Balance
function checkPreviousMonthBalance() {
    if (!settings.autoCalculateBalance) return;
    
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long' });
    const currentYear = now.getFullYear();
    
    // Skip if already has initial balance for this month
    if (initialBalance.month === currentMonth && initialBalance.year === currentYear) {
        return;
    }
    
    const previousMonth = getPreviousMonth(currentMonth, currentYear);
    const lastMonthBalance = calculateLastMonthBalance(previousMonth.month, previousMonth.year);
    
    if (lastMonthBalance > 0) {
        // Show notification
        showHeaderNotification(`Saldo bulan ${previousMonth.month} ${previousMonth.year}: ${formatRupiah(lastMonthBalance)}`, 'balance');
        
        // Add reminder notification
        addNotification(
            'Saldo Bulan Lalu Tersedia',
            `Terdapat saldo sebesar ${formatRupiah(lastMonthBalance)} dari bulan ${previousMonth.month} ${previousMonth.year}. Ingin tambahkan sebagai saldo awal?`,
            'balance',
            { month: currentMonth, year: currentYear, amount: lastMonthBalance, previousMonth: previousMonth.month, previousYear: previousMonth.year }
        );
    }
}

// Calculate Last Month Balance
function calculateLastMonthBalance(month, year) {
    const monthTransactions = transactions.filter(t => 
        t.month === month && t.year === year
    );
    
    let income = 0;
    let expense = 0;
    
    monthTransactions.forEach(transaction => {
        if (transaction.type === 'kas' || transaction.type === 'other_income') {
            income += parseInt(transaction.amount);
        } else if (transaction.type === 'expense') {
            expense += parseInt(transaction.amount);
        }
    });
    
    // Add initial balance if exists
    if (initialBalance.month === month && initialBalance.year === year) {
        income += initialBalance.amount;
    }
    
    return income - expense;
}

// Update Initial Balance Display
function updateInitialBalanceDisplay() {
    if (initialBalance.amount > 0 && initialBalance.month && initialBalance.year) {
        initialBalanceContainer.classList.remove('hidden');
        saldoAwalBadge.classList.remove('hidden');
        
        initialBalanceAmount.textContent = formatRupiah(initialBalance.amount);
        initialBalanceMonth.textContent = `${initialBalance.month} ${initialBalance.year}`;
        initialBalanceNote.textContent = initialBalance.note;
        
        saldoAwalAmount.textContent = formatRupiah(initialBalance.amount);
    } else {
        initialBalanceContainer.classList.add('hidden');
        saldoAwalBadge.classList.add('hidden');
    }
}

// Edit Initial Balance
function editInitialBalance() {
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long' });
    const currentYear = now.getFullYear();
    
    initialBalanceAmountInput.value = initialBalance.amount || '';
    initialBalanceMonthInput.value = initialBalance.month || currentMonth;
    initialBalanceYear.value = initialBalance.year || currentYear;
    initialBalanceNoteInput.value = initialBalance.note || 'Saldo awal bulan';
    
    initialBalanceModal.classList.remove('hidden');
}

// Close Initial Balance Modal
function closeInitialBalanceModal() {
    initialBalanceModal.classList.add('hidden');
    initialBalanceForm.reset();
}

// Save Initial Balance
function saveInitialBalance(data) {
    initialBalance.amount = parseInt(data.amount);
    initialBalance.month = data.month;
    initialBalance.year = parseInt(data.year);
    initialBalance.note = data.note || 'Saldo awal bulan';
    
    // Check if this is from previous month
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long' });
    const currentYear = now.getFullYear();
    
    if (data.fromPreviousMonth) {
        initialBalance.fromPreviousMonth = true;
        initialBalance.previousMonth = data.previousMonth;
        initialBalance.previousYear = data.previousYear;
        
        // Add as transaction
        transactions.push({
            id: Date.now().toString(),
            type: 'initial_balance',
            amount: parseInt(data.amount),
            month: data.month,
            year: parseInt(data.year),
            date: new Date().toISOString().split('T')[0],
            note: `Saldo awal dari ${data.previousMonth} ${data.previousYear}`,
            fromPreviousMonth: true,
            previousMonth: data.previousMonth,
            previousYear: data.previousYear
        });
    }
    
    saveData();
    updateInitialBalanceDisplay();
    
    showToast('Saldo awal berhasil disimpan', 'success');
    closeInitialBalanceModal();
}

// ============================================
// CHILDREN MANAGEMENT
// ============================================

// Add Child
function addChild(name, className = null) {
    const child = {
        id: Date.now().toString(),
        name: name,
        class: className,
        joinedDate: new Date().toISOString(),
        status: 'active'
    };
    
    children.push(child);
    saveData();
    
    // Notification
    addNotification(
        'Anak Baru Ditambahkan',
        `${name} berhasil ditambahkan ke sistem.`,
        'success',
        { childName: name, className: className }
    );
    
    return child;
}

// Edit Child
function editChild(id, name, className = null) {
    const childIndex = children.findIndex(c => c.id === id);
    if (childIndex !== -1) {
        const oldName = children[childIndex].name;
        children[childIndex].name = name;
        children[childIndex].class = className;
        
        // Update related transactions
        transactions.forEach(t => {
            if (t.childId === id) {
                t.childName = name;
            }
        });
        
        saveData();
        
        // Notification
        addNotification(
            'Data Anak Diperbarui',
            `${oldName} berhasil diperbarui menjadi ${name}.`,
            'success',
            { oldName: oldName, newName: name }
        );
        
        return true;
    }
    return false;
}

// Delete Child
function deleteChild(id) {
    const child = children.find(c => c.id === id);
    if (!child) return false;
    
    // Check for transactions
    const hasTransactions = transactions.some(t => t.childId === id);
    
    showConfirm(
        'Hapus Anak?',
        `Anda akan menghapus ${child.name} dari sistem.${hasTransactions ? '<br><small>Semua transaksi terkait juga akan dihapus.</small>' : ''}`,
        'Hapus',
        () => {
            children = children.filter(c => c.id !== id);
            
            // Remove related transactions
            if (hasTransactions) {
                transactions = transactions.filter(t => t.childId !== id);
            }
            
            saveData();
            displayAllData();
            
            addNotification(
                'Anak Dihapus',
                `${child.name} berhasil dihapus dari sistem.`,
                'warning',
                { childName: child.name }
            );
            
            showToast(`${child.name} berhasil dihapus`, 'success');
        }
    );
    
    return true;
}

// Pay Kas for Child
function payKasForChild(childId, month = null, year = null) {
    const child = children.find(c => c.id === childId);
    if (!child) return false;
    
    const targetMonth = month || currentFilter.month;
    const targetYear = year || currentFilter.year;
    
    if (targetMonth === 'all' || targetYear === 'all') {
        showToast('Pilih bulan dan tahun tertentu untuk bayar kas', 'warning');
        return false;
    }
    
    // Check if already paid
    const alreadyPaid = transactions.some(t => 
        t.type === 'kas' && 
        t.childId === childId && 
        t.month === targetMonth && 
        t.year === targetYear
    );
    
    if (alreadyPaid) {
        showToast(`${child.name} sudah membayar kas bulan ini`, 'info');
        return false;
    }
    
    // Add transaction
    const transaction = {
        id: Date.now().toString(),
        type: 'kas',
        childId: childId,
        childName: child.name,
        amount: settings.kasAmount,
        month: targetMonth,
        year: targetYear,
        date: new Date().toISOString().split('T')[0],
        note: `Bayar kas bulan ${targetMonth} ${targetYear}`,
        category: 'Kas'
    };
    
    transactions.push(transaction);
    saveData();
    
    // Notification
    addNotification(
        'Pembayaran Kas Berhasil',
        `${child.name} berhasil membayar kas ${formatRupiah(settings.kasAmount)} untuk ${targetMonth} ${targetYear}.`,
        'payment',
        { childName: child.name, amount: settings.kasAmount, month: targetMonth, year: targetYear }
    );
    
    showToast(`${child.name} berhasil membayar kas`, 'success');
    return true;
}

// Pay Kas for All Children
function payKasForAllChildren() {
    if (children.length === 0) {
        showToast('Tidak ada anak terdaftar', 'warning');
        return;
    }
    
    if (currentFilter.month === 'all' || currentFilter.year === 'all') {
        showToast('Pilih bulan dan tahun tertentu untuk bayar kas', 'warning');
        return;
    }
    
    const targetMonth = currentFilter.month;
    const targetYear = currentFilter.year;
    
    let paidCount = 0;
    children.forEach(child => {
        const alreadyPaid = transactions.some(t => 
            t.type === 'kas' && 
            t.childId === child.id && 
            t.month === targetMonth && 
            t.year === targetYear
        );
        
        if (!alreadyPaid) {
            transactions.push({
                id: Date.now().toString() + paidCount,
                type: 'kas',
                childId: child.id,
                childName: child.name,
                amount: settings.kasAmount,
                month: targetMonth,
                year: targetYear,
                date: new Date().toISOString().split('T')[0],
                note: `Bayar kas bulan ${targetMonth} ${targetYear} (semua anak)`,
                category: 'Kas'
            });
            paidCount++;
        }
    });
    
    if (paidCount > 0) {
        saveData();
        
        addNotification(
            'Pembayaran Kas Massal Berhasil',
            `${paidCount} anak berhasil membayar kas untuk ${targetMonth} ${targetYear}.`,
            'payment',
            { count: paidCount, amount: paidCount * settings.kasAmount, month: targetMonth, year: targetYear }
        );
        
        showToast(`${paidCount} anak berhasil membayar kas`, 'success');
    } else {
        showToast('Semua anak sudah membayar kas bulan ini', 'info');
    }
}

// ============================================
// TRANSACTIONS MANAGEMENT
// ============================================

// Add Expense
function addExpense(amount, date, category, note) {
    const transaction = {
        id: Date.now().toString(),
        type: 'expense',
        amount: parseInt(amount),
        date: date,
        category: category,
        note: note,
        month: getMonthFromDate(date),
        year: getYearFromDate(date)
    };
    
    transactions.push(transaction);
    saveData();
    
    addNotification(
        'Pengeluaran Dicatat',
        `Pengeluaran ${formatRupiah(amount)} untuk ${note} berhasil dicatat.`,
        'warning',
        { amount: amount, category: category, note: note }
    );
    
    return transaction;
}

// Add Other Income
function addOtherIncome(amount, date, category, note) {
    const transaction = {
        id: Date.now().toString(),
        type: 'other_income',
        amount: parseInt(amount),
        date: date,
        category: category,
        note: note,
        month: getMonthFromDate(date),
        year: getYearFromDate(date)
    };
    
    transactions.push(transaction);
    saveData();
    
    addNotification(
        'Pemasukan Lain Dicatat',
        `Pemasukan ${formatRupiah(amount)} dari ${note} berhasil dicatat.`,
        'success',
        { amount: amount, category: category, note: note }
    );
    
    return transaction;
}

// Edit Transaction
function editTransaction(id, type, amount, date, note, category = '') {
    const transactionIndex = transactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) return false;
    
    transactions[transactionIndex] = {
        ...transactions[transactionIndex],
        type: type,
        amount: parseInt(amount),
        date: date,
        note: note,
        category: category,
        month: getMonthFromDate(date),
        year: getYearFromDate(date)
    };
    
    saveData();
    
    addNotification(
        'Transaksi Diperbarui',
        `Transaksi ${formatRupiah(amount)} berhasil diperbarui.`,
        'success',
        { amount: amount, type: type, note: note }
    );
    
    return true;
}

// Delete Transaction
function deleteTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return false;
    
    showConfirm(
        'Hapus Transaksi?',
        `Anda akan menghapus transaksi ${formatRupiah(transaction.amount)} untuk ${transaction.note}.`,
        'Hapus',
        () => {
            transactions = transactions.filter(t => t.id !== id);
            saveData();
            displayAllData();
            
            addNotification(
                'Transaksi Dihapus',
                `Transaksi ${formatRupiah(transaction.amount)} berhasil dihapus.`,
                'warning',
                { amount: transaction.amount, note: transaction.note }
            );
            
            showToast('Transaksi berhasil dihapus', 'success');
        }
    );
    
    return true;
}

// Clear All Transactions
function clearAllTransactions() {
    if (transactions.length === 0) {
        showToast('Tidak ada transaksi untuk dihapus', 'info');
        return;
    }
    
    showConfirm(
        'Hapus Semua Transaksi?',
        'Semua transaksi akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
        'Hapus Semua',
        () => {
            const count = transactions.length;
            transactions = [];
            saveData();
            displayAllData();
            
            addNotification(
                'Semua Transaksi Dihapus',
                `${count} transaksi berhasil dihapus dari sistem.`,
                'warning',
                { count: count }
            );
            
            showToast(`${count} transaksi berhasil dihapus`, 'success');
        }
    );
}

// Filter Transactions
function filterTransactions() {
    let filtered = [...transactions];
    
    // Filter by month
    if (currentFilter.month !== 'all') {
        filtered = filtered.filter(t => t.month === currentFilter.month);
    }
    
    // Filter by year
    if (currentFilter.year !== 'all') {
        filtered = filtered.filter(t => t.year === currentFilter.year);
    }
    
    // Filter by search
    if (currentFilter.search) {
        const searchLower = currentFilter.search.toLowerCase();
        filtered = filtered.filter(t => {
            const childName = t.childName ? t.childName.toLowerCase() : '';
            const note = t.note ? t.note.toLowerCase() : '';
            const category = t.category ? t.category.toLowerCase() : '';
            const amount = t.amount.toString();
            
            return childName.includes(searchLower) || 
                   note.includes(searchLower) ||
                   category.includes(searchLower) ||
                   amount.includes(searchLower);
        });
    }
    
    // Filter by transaction type
    if (currentFilter.transactionType !== 'all') {
        switch(currentFilter.transactionType) {
            case 'kas':
                filtered = filtered.filter(t => t.type === 'kas');
                break;
            case 'income':
                filtered = filtered.filter(t => t.type === 'kas' || t.type === 'other_income' || t.type === 'initial_balance');
                break;
            case 'expense':
                filtered = filtered.filter(t => t.type === 'expense');
                break;
        }
    }
    
    // Sort transactions
    filtered.sort((a, b) => {
        switch(currentFilter.sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'amount-desc':
                return b.amount - a.amount;
            case 'amount-asc':
                return a.amount - b.amount;
            case 'name-asc':
                return (a.childName || '').localeCompare(b.childName || '');
            case 'name-desc':
                return (b.childName || '').localeCompare(a.childName || '');
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });
    
    return filtered;
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

// Display Children
function displayChildren() {
    if (children.length === 0) {
        childrenListContainer.innerHTML = emptyChildren.outerHTML;
        childCount.textContent = '0 Anak';
        payAllKas.disabled = true;
        payAllKas.classList.add('opacity-50', 'cursor-not-allowed');
        return;
    }
    
    emptyChildren.classList.add('hidden');
    childCount.textContent = `${children.length} Anak`;
    payAllKas.disabled = false;
    payAllKas.classList.remove('opacity-50', 'cursor-not-allowed');
    
    let html = '';
    children.forEach((child, index) => {
        // Check if child has paid for current month
        let hasPaid = false;
        if (currentFilter.month !== 'all' && currentFilter.year !== 'all') {
            hasPaid = transactions.some(t => 
                t.type === 'kas' && 
                t.childId === child.id && 
                t.month === currentFilter.month && 
                t.year === currentFilter.year
            );
        }
        
        html += `
            <div class="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                            <span class="text-blue-600 font-bold">${index + 1}</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">${child.name}</h4>
                            <div class="flex items-center space-x-2 mt-1">
                                <span class="px-2 py-1 text-xs rounded-full ${hasPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                    ${currentFilter.month === 'all' || currentFilter.year === 'all' ? 'Pilih bulan' : (hasPaid ? '✓ Sudah bayar' : '✗ Belum bayar')}
                                </span>
                                ${child.class ? `<span class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">${child.class}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="openEditChildModal('${child.id}')" 
                                class="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteChild('${child.id}')" 
                                class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button onclick="payKasForChild('${child.id}', '${currentFilter.month}', ${currentFilter.year})" 
                                class="${hasPaid || currentFilter.month === 'all' || currentFilter.year === 'all' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'} px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                ${hasPaid || currentFilter.month === 'all' || currentFilter.year === 'all' ? 'disabled' : ''}>
                            ${hasPaid ? 'Sudah Bayar' : 'Bayar Kas'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    childrenListContainer.innerHTML = html;
}

// Display Monthly Data
function displayMonthlyData() {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    let hasData = false;
    let html = '';
    
    months.forEach(month => {
        // Filter transactions for this month
        let monthKas = transactions.filter(t => t.type === 'kas' && t.month === month);
        let monthOtherIncome = transactions.filter(t => t.type === 'other_income' && t.month === month);
        let monthInitialBalance = transactions.filter(t => t.type === 'initial_balance' && t.month === month);
        
        if (currentFilter.year !== 'all') {
            monthKas = monthKas.filter(t => t.year === currentFilter.year);
            monthOtherIncome = monthOtherIncome.filter(t => t.year === currentFilter.year);
            monthInitialBalance = monthInitialBalance.filter(t => t.year === currentFilter.year);
        }
        
        // Calculate totals
        const totalKas = monthKas.reduce((sum, t) => sum + t.amount, 0);
        const totalOtherIncome = monthOtherIncome.reduce((sum, t) => sum + t.amount, 0);
        const totalInitialBalance = monthInitialBalance.reduce((sum, t) => sum + t.amount, 0);
        const totalIncome = totalKas + totalOtherIncome + totalInitialBalance;
        
        // Calculate expenses
        let monthExpenses = transactions.filter(t => t.type === 'expense' && t.month === month);
        if (currentFilter.year !== 'all') {
            monthExpenses = monthExpenses.filter(t => t.year === currentFilter.year);
        }
        const totalExpense = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpense;
        
        // Count children
        const paidChildren = [...new Set(monthKas.map(t => t.childId))];
        const paidCount = paidChildren.length;
        const totalCount = children.length;
        const percentage = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
        
        if (totalKas > 0 || totalOtherIncome > 0 || totalInitialBalance > 0) {
            hasData = true;
            const year = currentFilter.year !== 'all' ? currentFilter.year : 'Semua Tahun';
            
            html += `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="py-4 px-6">
                        <div class="font-medium text-gray-800">${month} ${year}</div>
                        <div class="text-sm text-gray-500">Saldo: <span class="${balance >= 0 ? 'text-green-600' : 'text-red-600'}">${formatRupiah(balance)}</span></div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="font-medium">${paidCount}/${totalCount}</div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div class="bg-green-500 h-2 rounded-full" style="width: ${percentage}%"></div>
                        </div>
                    </td>
                    <td class="py-4 px-6 font-medium text-green-600">${formatRupiah(totalKas)}</td>
                    <td class="py-4 px-6 font-medium text-blue-600">${formatRupiah(totalOtherIncome)}</td>
                    <td class="py-4 px-6 font-medium text-purple-600">${formatRupiah(totalInitialBalance)}</td>
                    <td class="py-4 px-6 font-bold text-gray-800">${formatRupiah(totalIncome)}</td>
                    <td class="py-4 px-6">
                        <span class="px-3 py-1 text-xs font-medium rounded-full ${percentage === 100 ? 'bg-green-100 text-green-800' : percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                            ${percentage === 100 ? 'Lengkap' : percentage >= 50 ? 'Cukup' : 'Kurang'}
                        </span>
                    </td>
                    <td class="py-4 px-6">
                        <div class="flex items-center space-x-2">
                            <button onclick="addOtherIncome('${month}', ${currentFilter.year !== 'all' ? currentFilter.year : 'all'})" 
                                    class="text-green-500 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button onclick="viewMonthDetail('${month}', ${currentFilter.year !== 'all' ? currentFilter.year : 'all'})" 
                                    class="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    });
    
    if (!hasData) {
        monthlyData.innerHTML = emptyMonthly.outerHTML;
        monthlyDataInfo.textContent = 'Tidak ada data kas untuk filter yang dipilih';
    } else {
        emptyMonthly.classList.add('hidden');
        monthlyData.innerHTML = html;
        monthlyDataInfo.textContent = currentFilter.year === 'all' ? 
            'Menampilkan semua tahun' : 
            `Menampilkan tahun ${currentFilter.year}`;
    }
}

// Display Transactions
function displayTransactions() {
    const filteredTransactions = filterTransactions();
    const totalTransactions = filteredTransactions.length;
    const totalPages = Math.ceil(totalTransactions / ITEMS_PER_PAGE);
    
    // Update pagination
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    
    // Get current page transactions
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    // Update transaction info
    transactionCount.textContent = `${totalTransactions} transaksi`;
    paginationInfo.textContent = `Menampilkan ${startIndex + 1}-${Math.min(endIndex, totalTransactions)} dari ${totalTransactions} transaksi`;
    
    // Update pagination buttons
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
    
    // Update page numbers
    let pageNumbersHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pageNumbersHtml += `
                <button onclick="goToPage(${i})" 
                        class="px-3 py-2 rounded-lg ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pageNumbersHtml += `<span class="px-3 py-2">...</span>`;
        }
    }
    pageNumbers.innerHTML = pageNumbersHtml;
    
    // Display transactions
    if (pageTransactions.length === 0) {
        transactionList.innerHTML = emptyState.outerHTML;
        
        let message = 'Tidak ada transaksi untuk ditampilkan';
        if (currentFilter.search) {
            message = `Tidak ada transaksi untuk "${currentFilter.search}"`;
        } else if (currentFilter.month !== 'all' || currentFilter.year !== 'all') {
            message = `Tidak ada transaksi pada filter yang dipilih`;
        }
        transactionInfo.textContent = message;
        
        return;
    }
    
    emptyState.classList.add('hidden');
    
    let transactionInfoText = '';
    if (currentFilter.search) {
        transactionInfoText = `Menampilkan ${totalTransactions} transaksi untuk "${currentFilter.search}"`;
    } else if (currentFilter.month === 'all' && currentFilter.year === 'all') {
        transactionInfoText = 'Menampilkan semua transaksi';
    } else if (currentFilter.month === 'all') {
        transactionInfoText = `Menampilkan transaksi tahun ${currentFilter.year}`;
    } else if (currentFilter.year === 'all') {
        transactionInfoText = `Menampilkan transaksi bulan ${currentFilter.month}`;
    } else {
        transactionInfoText = `Menampilkan transaksi ${currentFilter.month} ${currentFilter.year}`;
    }
    transactionInfo.textContent = transactionInfoText;
    
    let html = '';
    pageTransactions.forEach(transaction => {
        const typeConfig = getTransactionTypeConfig(transaction.type);
        
        html += `
            <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100">
                <td class="py-4 px-6">
                    <div class="font-medium">${formatDate(transaction.date)}</div>
                    <div class="text-sm text-gray-500">${transaction.month} ${transaction.year}</div>
                </td>
                <td class="py-4 px-6">
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${typeConfig.bgColor} ${typeConfig.textColor}">
                        <i class="${typeConfig.icon} mr-1"></i> ${typeConfig.label}
                    </span>
                </td>
                <td class="py-4 px-6 font-bold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}">
                    ${formatRupiah(transaction.amount)}
                </td>
                <td class="py-4 px-6">
                    <div class="text-gray-800">${highlightText(transaction.note, currentFilter.search)}</div>
                    ${transaction.childName ? `
                        <div class="text-sm text-gray-500 mt-1">
                            <i class="fas fa-user mr-1"></i> ${transaction.childName}
                        </div>
                    ` : ''}
                </td>
                <td class="py-4 px-6">
                    <span class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        ${transaction.category || 'Umum'}
                    </span>
                </td>
                <td class="py-4 px-6">
                    <div class="flex items-center space-x-2">
                        <button onclick="openEditTransactionModal('${transaction.id}')" 
                                class="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteTransaction('${transaction.id}')" 
                                class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    transactionList.innerHTML = html;
}

// Go to Page
function goToPage(page) {
    currentPage = page;
    displayTransactions();
}

// View Month Detail
function viewMonthDetail(month, year) {
    // Filter transactions for this month
    let monthTransactions = transactions.filter(t => t.month === month);
    if (year !== 'all') {
        monthTransactions = monthTransactions.filter(t => t.year === year);
    }
    
    // Calculate totals
    const kasTransactions = monthTransactions.filter(t => t.type === 'kas');
    const otherIncomeTransactions = monthTransactions.filter(t => t.type === 'other_income');
    const expenseTransactions = monthTransactions.filter(t => t.type === 'expense');
    const initialBalanceTransactions = monthTransactions.filter(t => t.type === 'initial_balance');
    
    const totalKas = kasTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalOtherIncome = otherIncomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalInitialBalance = initialBalanceTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = totalKas + totalOtherIncome + totalInitialBalance;
    const balance = totalIncome - totalExpense;
    
    // Get paid children
    const paidChildrenIds = [...new Set(kasTransactions.map(t => t.childId))];
    const paidChildren = children.filter(c => paidChildrenIds.includes(c.id));
    const unpaidChildren = children.filter(c => !paidChildrenIds.includes(c.id));
    
    let html = `
        <div class="space-y-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-blue-50 p-4 rounded-xl">
                    <div class="text-sm text-blue-700">Kas Masuk</div>
                    <div class="text-2xl font-bold text-blue-800">${formatRupiah(totalKas)}</div>
                    <div class="text-xs text-blue-600">${paidChildren.length} anak</div>
                </div>
                <div class="bg-green-50 p-4 rounded-xl">
                    <div class="text-sm text-green-700">Pemasukan Lain</div>
                    <div class="text-2xl font-bold text-green-800">${formatRupiah(totalOtherIncome)}</div>
                    <div class="text-xs text-green-600">${otherIncomeTransactions.length} transaksi</div>
                </div>
                <div class="bg-red-50 p-4 rounded-xl">
                    <div class="text-sm text-red-700">Pengeluaran</div>
                    <div class="text-2xl font-bold text-red-800">${formatRupiah(totalExpense)}</div>
                    <div class="text-xs text-red-600">${expenseTransactions.length} transaksi</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-xl">
                    <div class="text-sm text-purple-700">Saldo Akhir</div>
                    <div class="text-2xl font-bold ${balance >= 0 ? 'text-purple-800' : 'text-red-800'}">${formatRupiah(balance)}</div>
                    <div class="text-xs ${balance >= 0 ? 'text-purple-600' : 'text-red-600'}">${balance >= 0 ? 'Surplus' : 'Defisit'}</div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-xl">
                <h4 class="font-semibold text-gray-800 mb-3">Status Pembayaran Kas</h4>
                <div class="space-y-2">
    `;
    
    // Paid children
    if (paidChildren.length > 0) {
        html += `
            <div class="mb-4">
                <div class="text-sm text-green-700 font-medium mb-2">Sudah Bayar (${paidChildren.length}):</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        `;
        paidChildren.forEach(child => {
            html += `
                <div class="bg-green-100 p-3 rounded-lg flex items-center justify-between">
                    <span class="text-green-800">${child.name}</span>
                    <span class="text-green-600 text-sm">${child.class || ''}</span>
                </div>
            `;
        });
        html += `</div></div>`;
    }
    
    // Unpaid children
    if (unpaidChildren.length > 0) {
        html += `
            <div>
                <div class="text-sm text-red-700 font-medium mb-2">Belum Bayar (${unpaidChildren.length}):</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        `;
        unpaidChildren.forEach(child => {
            html += `
                <div class="bg-red-100 p-3 rounded-lg flex items-center justify-between">
                    <span class="text-red-800">${child.name}</span>
                    <span class="text-red-600 text-sm">${child.class || ''}</span>
                </div>
            `;
        });
        html += `</div></div>`;
    }
    
    html += `
                </div>
            </div>
            
            <div class="flex space-x-3">
                <button onclick="addOtherIncome('${month}', ${year})" 
                        class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium">
                    <i class="fas fa-plus mr-2"></i> Tambah Pemasukan
                </button>
                <button onclick="payKasForAllChildren('${month}', ${year})" 
                        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium">
                    <i class="fas fa-money-bill-wave mr-2"></i> Bayar Semua
                </button>
            </div>
        </div>
    `;
    
    Swal.fire({
        title: `Detail Bulan ${month} ${year}`,
        html: html,
        width: 800,
        showConfirmButton: false,
        showCloseButton: true
    });
}

// Get Transaction Type Config
function getTransactionTypeConfig(type) {
    switch(type) {
        case 'kas':
            return {
                label: 'Kas Masuk',
                icon: 'fas fa-money-bill-wave',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800'
            };
        case 'other_income':
            return {
                label: 'Pemasukan Lain',
                icon: 'fas fa-plus-circle',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-800'
            };
        case 'expense':
            return {
                label: 'Pengeluaran',
                icon: 'fas fa-money-bill-transfer',
                bgColor: 'bg-red-100',
                textColor: 'text-red-800'
            };
        case 'initial_balance':
            return {
                label: 'Saldo Awal',
                icon: 'fas fa-piggy-bank',
                bgColor: 'bg-purple-100',
                textColor: 'text-purple-800'
            };
        default:
            return {
                label: 'Lainnya',
                icon: 'fas fa-wallet',
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-800'
            };
    }
}

// ============================================
// CALCULATIONS & STATISTICS
// ============================================

// Calculate Summary
function calculateSummary() {
    const filteredTransactions = filterTransactions();
    
    let kasIncome = 0;
    let otherIncome = 0;
    let expense = 0;
    let initialBalanceAmount = 0;
    
    let kasCount = 0;
    let otherIncomeCount = 0;
    let expenseCount = 0;
    
    filteredTransactions.forEach(transaction => {
        switch(transaction.type) {
            case 'kas':
                kasIncome += transaction.amount;
                kasCount++;
                break;
            case 'other_income':
                otherIncome += transaction.amount;
                otherIncomeCount++;
                break;
            case 'expense':
                expense += transaction.amount;
                expenseCount++;
                break;
            case 'initial_balance':
                initialBalanceAmount += transaction.amount;
                break;
        }
    });
    
    const totalIncome = kasIncome + otherIncome + initialBalanceAmount;
    const balanceAmount = totalIncome - expense;
    
    // Update summary display
    totalKasIncome.textContent = formatRupiah(kasIncome);
    totalOtherIncome.textContent = formatRupiah(otherIncome);
    totalExpense.textContent = formatRupiah(expense);
    totalIncome.textContent = formatRupiah(totalIncome);
    balance.textContent = formatRupiah(balanceAmount);
    
    kasChildCount.textContent = `${kasCount} transaksi`;
    otherIncomeCount.textContent = `${otherIncomeCount} transaksi`;
    expenseCount.textContent = `${expenseCount} transaksi`;
    totalIncomeCount.textContent = `${kasCount + otherIncomeCount} transaksi`;
    
    // Update balance status
    if (balanceAmount < 0) {
        saldoWarning.classList.remove('hidden');
        saldoHealthy.classList.add('hidden');
        balanceStatus.innerHTML = '<span class="text-red-600">Defisit</span>';
    } else {
        saldoWarning.classList.add('hidden');
        saldoHealthy.classList.remove('hidden');
        balanceStatus.innerHTML = '<span class="text-green-600">Sehat</span>';
    }
    
    // Update summary info
    if (currentFilter.month === 'all' && currentFilter.year === 'all') {
        summaryMonth.textContent = 'Semua Bulan';
        summaryInfo.textContent = 'Data untuk semua bulan dan tahun';
    } else if (currentFilter.month === 'all') {
        summaryMonth.textContent = `Tahun ${currentFilter.year}`;
        summaryInfo.textContent = `Data untuk semua bulan tahun ${currentFilter.year}`;
    } else if (currentFilter.year === 'all') {
        summaryMonth.textContent = `Bulan ${currentFilter.month}`;
        summaryInfo.textContent = `Data untuk bulan ${currentFilter.month} semua tahun`;
    } else {
        summaryMonth.textContent = `${currentFilter.month} ${currentFilter.year}`;
        
        let saldoAwalText = '';
        if (initialBalanceAmount > 0) {
            saldoAwalText = ` (Termasuk saldo awal ${formatRupiah(initialBalanceAmount)})`;
        }
        
        summaryInfo.textContent = `Data untuk ${currentFilter.month} ${currentFilter.year}${saldoAwalText}`;
    }
}

// Calculate Progress
function calculateProgress() {
    if (currentFilter.month === 'all' || currentFilter.year === 'all') {
        progressBar.style.width = '0%';
        progressPercentage.textContent = '0%';
        paidCount.textContent = '0 anak sudah bayar';
        totalChildren.textContent = `Total: ${children.length} anak`;
        return;
    }
    
    const paidChildrenIds = transactions
        .filter(t => 
            t.type === 'kas' && 
            t.month === currentFilter.month && 
            t.year === currentFilter.year
        )
        .map(t => t.childId);
    
    const paidCountNum = [...new Set(paidChildrenIds)].length;
    const totalChildrenNum = children.length;
    const percentage = totalChildrenNum > 0 ? Math.round((paidCountNum / totalChildrenNum) * 100) : 0;
    
    progressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;
    paidCount.textContent = `${paidCountNum} anak sudah bayar`;
    totalChildren.textContent = `Total: ${totalChildrenNum} anak`;
}

// Calculate Chart Stats
function calculateChartStats() {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    let monthlyKas = [];
    let maxKas = 0;
    let maxMonth = '-';
    let totalKas = 0;
    let kasCount = 0;
    
    months.forEach(month => {
        let monthKas = transactions.filter(t => 
            t.type === 'kas' && 
            t.month === month &&
            (currentFilter.year === 'all' || t.year === currentFilter.year)
        );
        
        const total = monthKas.reduce((sum, t) => sum + t.amount, 0);
        monthlyKas.push(total);
        
        if (total > maxKas) {
            maxKas = total;
            maxMonth = month;
        }
        
        totalKas += total;
        kasCount += monthKas.length;
    });
    
    // Find largest expense
    const expenses = transactions.filter(t => t.type === 'expense');
    const largestExpenseObj = expenses.reduce((max, t) => t.amount > (max?.amount || 0) ? t : max, null);
    
    // Update stats
    averageKas.textContent = formatRupiah(kasCount > 0 ? totalKas / kasCount : 0);
    highestMonth.textContent = maxMonth;
    largestExpense.textContent = largestExpenseObj ? formatRupiah(largestExpenseObj.amount) : 'Rp 0';
}

// ============================================
// CHARTS
// ============================================

// Update Charts
function updateCharts() {
    updateKasChart();
    updateExpenseChart();
    calculateChartStats();
}

// Update Kas Chart
function updateKasChart() {
    const ctx = document.getElementById('kasChart')?.getContext('2d');
    if (!ctx) return;
    
    if (kasChart) {
        kasChart.destroy();
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const fullMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const currentYear = currentFilter.year !== 'all' ? currentFilter.year : new Date().getFullYear();
    
    const monthlyData = fullMonths.map((month, index) => {
        let monthKas = transactions.filter(t => 
            t.type === 'kas' && 
            t.month === month
        );
        
        if (currentFilter.year !== 'all') {
            monthKas = monthKas.filter(t => t.year === currentYear);
        }
        
        return monthKas.reduce((sum, t) => sum + t.amount, 0);
    });
    
    kasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Kas Masuk',
                data: monthlyData,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Kas: ${formatRupiah(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + value.toLocaleString('id-ID');
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Update Expense Chart
function updateExpenseChart() {
    const ctx = document.getElementById('expenseChart')?.getContext('2d');
    if (!ctx) return;
    
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories = {};
    
    expenses.forEach(expense => {
        const category = expense.category || 'Lainnya';
        categories[category] = (categories[category] || 0) + expense.amount;
    });
    
    const backgroundColors = [
        'rgba(239, 68, 68, 0.6)',
        'rgba(249, 115, 22, 0.6)',
        'rgba(234, 179, 8, 0.6)',
        'rgba(34, 197, 94, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(139, 92, 246, 0.6)'
    ];
    
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: backgroundColors.slice(0, Object.keys(categories).length),
                borderWidth: 1,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${formatRupiah(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

// Export to Excel
function exportToExcel() {
    showLoading();
    
    setTimeout(() => {
        try {
            const filteredTransactions = filterTransactions();
            
            if (filteredTransactions.length === 0) {
                showToast('Tidak ada data untuk diexport', 'warning');
                hideLoading();
                return;
            }
            
            const data = filteredTransactions.map(transaction => {
                const typeConfig = getTransactionTypeConfig(transaction.type);
                return {
                    'Tanggal': formatDate(transaction.date),
                    'Jenis': typeConfig.label,
                    'Jumlah': transaction.amount,
                    'Keterangan': transaction.note,
                    'Anak': transaction.childName || '',
                    'Kategori': transaction.category || '',
                    'Bulan': transaction.month,
                    'Tahun': transaction.year
                };
            });
            
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi');
            
            const fileName = `buku_kas_${currentFilter.month}_${currentFilter.year}_${Date.now()}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            
            addNotification(
                'Export Berhasil',
                `Data berhasil diexport ke file Excel (${filteredTransactions.length} transaksi).`,
                'success',
                { count: filteredTransactions.length, format: 'Excel' }
            );
            
            showToast('Data berhasil diexport ke Excel', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showToast('Gagal mengexport data', 'error');
        } finally {
            hideLoading();
        }
    }, 500);
}

// Export to PDF
function exportToPDF() {
    showLoading();
    
    setTimeout(() => {
        try {
            const filteredTransactions = filterTransactions();
            
            if (filteredTransactions.length === 0) {
                showToast('Tidak ada data untuk diexport', 'warning');
                hideLoading();
                return;
            }
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(20);
            doc.text('LAPORAN BUKU KAS', 105, 20, { align: 'center' });
            
            doc.setFontSize(12);
            let filterInfo = 'Semua Data';
            if (currentFilter.month !== 'all' && currentFilter.year !== 'all') {
                filterInfo = `Bulan: ${currentFilter.month} ${currentFilter.year}`;
            } else if (currentFilter.month !== 'all') {
                filterInfo = `Bulan: ${currentFilter.month} (Semua Tahun)`;
            } else if (currentFilter.year !== 'all') {
                filterInfo = `Tahun: ${currentFilter.year} (Semua Bulan)`;
            }
            doc.text(filterInfo, 105, 30, { align: 'center' });
            
            doc.setFontSize(10);
            doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 105, 38, { align: 'center' });
            
            // Prepare table data
            const tableData = filteredTransactions.map(transaction => {
                const typeConfig = getTransactionTypeConfig(transaction.type);
                return [
                    formatDate(transaction.date),
                    typeConfig.label,
                    formatRupiah(transaction.amount),
                    transaction.childName || '',
                    transaction.note
                ];
            });
            
            // Add table
            doc.autoTable({
                head: [['Tanggal', 'Jenis', 'Jumlah', 'Anak', 'Keterangan']],
                body: tableData,
                startY: 45,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [59, 130, 246] }
            });
            
            // Summary
            const finalY = doc.lastAutoTable.finalY + 10;
            
            // Calculate totals
            let kasIncome = 0;
            let otherIncome = 0;
            let expense = 0;
            
            filteredTransactions.forEach(transaction => {
                switch(transaction.type) {
                    case 'kas': kasIncome += transaction.amount; break;
                    case 'other_income': otherIncome += transaction.amount; break;
                    case 'expense': expense += transaction.amount; break;
                }
            });
            
            const totalIncome = kasIncome + otherIncome;
            const balance = totalIncome - expense;
            
            doc.setFontSize(10);
            doc.text(`Total Kas Masuk: ${formatRupiah(kasIncome)}`, 14, finalY);
            doc.text(`Total Pemasukan Lain: ${formatRupiah(otherIncome)}`, 14, finalY + 6);
            doc.text(`Total Pengeluaran: ${formatRupiah(expense)}`, 14, finalY + 12);
            doc.text(`Saldo: ${formatRupiah(balance)}`, 14, finalY + 18);
            
            // Save PDF
            const fileName = `buku_kas_${currentFilter.month}_${currentFilter.year}_${Date.now()}.pdf`;
            doc.save(fileName);
            
            addNotification(
                'Export Berhasil',
                `Data berhasil diexport ke file PDF (${filteredTransactions.length} transaksi).`,
                'success',
                { count: filteredTransactions.length, format: 'PDF' }
            );
            
            showToast('Data berhasil diexport ke PDF', 'success');
        } catch (error) {
            console.error('PDF export error:', error);
            showToast('Gagal mengexport data ke PDF', 'error');
        } finally {
            hideLoading();
        }
    }, 500);
}

// Send to WhatsApp
function sendToWhatsApp() {
    const filteredTransactions = filterTransactions();
    
    if (filteredTransactions.length === 0) {
        showToast('Tidak ada data untuk dikirim', 'warning');
        return;
    }
    
    let message = `*LAPORAN BUKU KAS*\n\n`;
    
    // Filter info
    if (currentFilter.month !== 'all' && currentFilter.year !== 'all') {
        message += `Bulan: ${currentFilter.month} ${currentFilter.year}\n`;
    } else if (currentFilter.month !== 'all') {
        message += `Bulan: ${currentFilter.month} (Semua Tahun)\n`;
    } else if (currentFilter.year !== 'all') {
        message += `Tahun: ${currentFilter.year} (Semua Bulan)\n`;
    } else {
        message += `Semua Data\n`;
    }
    
    message += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n\n`;
    message += `*Ringkasan:*\n`;
    
    // Calculate totals
    let kasIncome = 0;
    let otherIncome = 0;
    let expense = 0;
    let initialBalanceAmount = 0;
    
    filteredTransactions.forEach(transaction => {
        switch(transaction.type) {
            case 'kas': kasIncome += transaction.amount; break;
            case 'other_income': otherIncome += transaction.amount; break;
            case 'expense': expense += transaction.amount; break;
            case 'initial_balance': initialBalanceAmount += transaction.amount; break;
        }
    });
    
    const totalIncome = kasIncome + otherIncome + initialBalanceAmount;
    const balance = totalIncome - expense;
    
    message += `💰 Kas Masuk: ${formatRupiah(kasIncome)}\n`;
    message += `💵 Pemasukan Lain: ${formatRupiah(otherIncome)}\n`;
    message += `🏦 Saldo Awal: ${formatRupiah(initialBalanceAmount)}\n`;
    message += `💸 Pengeluaran: ${formatRupiah(expense)}\n`;
    message += `📊 Total Pemasukan: ${formatRupiah(totalIncome)}\n`;
    message += `⚖️ Saldo: ${formatRupiah(balance)}\n\n`;
    
    message += `*Transaksi Terbaru:*\n`;
    filteredTransactions.slice(0, 10).forEach((transaction, index) => {
        const typeIcon = transaction.type === 'kas' ? '💰' : 
                        transaction.type === 'expense' ? '💸' : 
                        transaction.type === 'other_income' ? '💵' : '🏦';
        
        message += `\n${index + 1}. ${formatDate(transaction.date)}\n`;
        message += `   ${typeIcon} ${formatRupiah(transaction.amount)}\n`;
        message += `   📝 ${transaction.note}\n`;
    });
    
    if (filteredTransactions.length > 10) {
        message += `\n... dan ${filteredTransactions.length - 10} transaksi lainnya\n`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    addNotification(
        'Laporan Dikirim',
        'Laporan berhasil disiapkan untuk WhatsApp.',
        'success',
        { count: filteredTransactions.length }
    );
    
    showToast('Laporan berhasil disiapkan untuk WhatsApp', 'success');
}

// ============================================
// SETTINGS & THEME
// ============================================

// Apply Theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update header gradient
    const header = document.querySelector('header');
    if (header) {
        const gradients = {
            blue: 'from-blue-600 via-blue-700 to-indigo-800',
            green: 'from-emerald-600 via-emerald-700 to-green-800',
            purple: 'from-purple-600 via-purple-700 to-violet-800',
            red: 'from-red-600 via-red-700 to-rose-800'
        };
        
        header.className = header.className.replace(/from-\w+-\d+ via-\w+-\d+ to-\w+-\d+/, gradients[theme] || gradients.blue);
    }
}

// Update Settings Display
function updateSettingsDisplay() {
    kasAmountSetting.value = settings.kasAmount;
    themeSetting.value = settings.theme;
    backupAuto.checked = settings.backupAuto;
    notificationsSetting.checked = settings.notifications;
    autoCalculateBalance.checked = settings.autoCalculateBalance;
    monthlyReminder.checked = settings.monthlyReminder;
}

// Save Settings
function saveSettings() {
    settings.kasAmount = parseInt(kasAmountSetting.value);
    settings.theme = themeSetting.value;
    settings.backupAuto = backupAuto.checked;
    settings.notifications = notificationsSetting.checked;
    settings.autoCalculateBalance = autoCalculateBalance.checked;
    settings.monthlyReminder = monthlyReminder.checked;
    
    saveData();
    updateKasDisplay();
    applyTheme(settings.theme);
    
    showToast('Pengaturan berhasil disimpan', 'success');
}

// Update Kas Display
function updateKasDisplay() {
    kasAmountDisplay.textContent = formatRupiah(settings.kasAmount);
    kasAmountText.textContent = `${formatRupiah(settings.kasAmount)} per anak per bulan`;
}

// Backup Data
function backupData() {
    showLoading();
    
    setTimeout(() => {
        try {
            const backup = {
                children: children,
                transactions: transactions,
                settings: settings,
                initialBalance: initialBalance,
                notifications: notifications,
                backupDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(backup, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `backup_buku_kas_${Date.now()}.json`;
            link.click();
            
            settings.lastBackup = new Date().toISOString();
            saveData();
            
            addNotification(
                'Backup Berhasil',
                'Data berhasil di-backup ke file JSON.',
                'success',
                { type: 'backup' }
            );
            
            showToast('Data berhasil di-backup', 'success');
        } catch (error) {
            console.error('Backup error:', error);
            showToast('Gagal melakukan backup', 'error');
        } finally {
            hideLoading();
        }
    }, 500);
}

// Restore Data
function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const backup = JSON.parse(e.target.result);
                
                // Validate backup
                if (!backup.children || !backup.transactions || !backup.settings) {
                    throw new Error('File backup tidak valid');
                }
                
                showConfirm(
                    'Restore Data?',
                    'Data saat ini akan diganti dengan data dari backup. Pastikan Anda telah melakukan backup data terbaru.',
                    'Restore',
                    () => {
                        children = backup.children || [];
                        transactions = backup.transactions || [];
                        settings = backup.settings || {};
                        initialBalance = backup.initialBalance || { amount: 0, month: null, year: null, note: 'Saldo awal bulan', fromPreviousMonth: false };
                        notifications = backup.notifications || [];
                        
                        saveData();
                        initializeApp();
                        
                        addNotification(
                            'Restore Berhasil',
                            'Data berhasil direstore dari backup.',
                            'success',
                            { type: 'restore' }
                        );
                        
                        showToast('Data berhasil direstore', 'success');
                    }
                );
            } catch (error) {
                console.error('Restore error:', error);
                showToast('File backup tidak valid', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// ============================================
// MODAL FUNCTIONS
// ============================================

// Open Edit Child Modal
function openEditChildModal(childId) {
    const child = children.find(c => c.id === childId);
    if (!child) return;
    
    editChildId.value = childId;
    editChildName.value = child.name;
    editChildClass.value = child.class || '';
    
    editChildModal.classList.remove('hidden');
}

// Close Edit Child Modal
function closeEditChildModal() {
    editChildModal.classList.add('hidden');
    editChildForm.reset();
}

// Open Edit Transaction Modal
function openEditTransactionModal(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    editTransactionId.value = transactionId;
    editTransactionType.value = transaction.type;
    editTransactionAmount.value = transaction.amount;
    editTransactionDate.value = transaction.date;
    editTransactionNote.value = transaction.note;
    editTransactionCategory.value = transaction.category || '';
    
    editTransactionModal.classList.remove('hidden');
}

// Close Edit Transaction Modal
function closeEditTransactionModal() {
    editTransactionModal.classList.add('hidden');
    editTransactionForm.reset();
}

// Open Settings Modal
function openSettingsModal() {
    updateSettingsDisplay();
    settingsModal.classList.remove('hidden');
}

// Close Settings Modal
function closeSettingsModal() {
    settingsModal.classList.add('hidden');
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize App
function initializeApp() {
    // Set current date
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long' });
    const currentYear = now.getFullYear();
    
    currentMonthYearElement.textContent = `${currentMonth} ${currentYear}`;
    
    // Set filter defaults
    filterMonth.value = currentMonth;
    filterYear.value = currentYear;
    currentFilter.month = currentMonth;
    currentFilter.year = currentYear;
    
    // Initialize year filter
    initializeYearFilter();
    
    // Set form dates to today
    expenseDate.valueAsDate = now;
    otherIncomeDate.valueAsDate = now;
    
    // Apply theme
    applyTheme(settings.theme);
    
    // Update displays
    updateKasDisplay();
    updateInitialBalanceDisplay();
    updateNotificationBadge();
    
    // Display data
    displayAllData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for notifications
    checkMonthlyReminder();
    checkPreviousMonthBalance();
    
    // Update footer stats
    updateFooterStats();
    
    // Show welcome tutorial on first visit
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
        setTimeout(() => showTutorial(), 1000);
        localStorage.setItem('hasSeenTutorial', 'true');
    }
}

// Initialize Year Filter
function initializeYearFilter() {
    filterYear.innerHTML = '';
    
    // Get unique years from transactions
    const yearsFromTransactions = [...new Set(transactions.map(t => t.year))];
    const currentYear = new Date().getFullYear();
    
    // Combine with current and next year
    const years = [...new Set([...yearsFromTransactions, currentYear - 1, currentYear, currentYear + 1])];
    years.sort((a, b) => a - b);
    
    // Add options
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        filterYear.appendChild(option);
    });
    
    // Add "all" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Semua Tahun';
    filterYear.insertBefore(allOption, filterYear.firstChild);
}

// Update Footer Stats
function updateFooterStats() {
    footerStats.textContent = `${children.length} Anak • ${transactions.length} Transaksi`;
}

// Display All Data
function displayAllData() {
    displayChildren();
    displayMonthlyData();
    displayTransactions();
    calculateSummary();
    calculateProgress();
    updateCharts();
    updateFooterStats();
}

// Check Monthly Reminder
function checkMonthlyReminder() {
    if (!settings.monthlyReminder) return;
    
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long' });
    const currentYear = now.getFullYear();
    
    // Check if we've already checked this month
    const lastCheck = settings.lastMonthCheck ? new Date(settings.lastMonthCheck) : null;
    
    if (lastCheck) {
        const lastCheckMonth = lastCheck.toLocaleString('id-ID', { month: 'long' });
        const lastCheckYear = lastCheck.getFullYear();
        
        if (lastCheckMonth === currentMonth && lastCheckYear === currentYear) {
            return;
        }
    }
    
    // Update last check
    settings.lastMonthCheck = now.toISOString();
    saveData();
    
    // Check for unpaid children
    const paidChildrenIds = transactions
        .filter(t => t.type === 'kas' && t.month === currentMonth && t.year === currentYear)
        .map(t => t.childId);
    
    const unpaidChildren = children.filter(c => !paidChildrenIds.includes(c.id));
    
    if (unpaidChildren.length > 0 && children.length > 0) {
        // Show header notification
        showHeaderNotification(`${unpaidChildren.length} anak belum bayar kas bulan ${currentMonth}`, 'warning');
        
        // Add notification
        addNotification(
            'Reminder Bayar Kas',
            `${unpaidChildren.length} dari ${children.length} anak belum membayar kas bulan ${currentMonth}.`,
            'reminder',
            { month: currentMonth, year: currentYear, unpaidCount: unpaidChildren.length, totalCount: children.length }
        );
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Setup Event Listeners
function setupEventListeners() {
    // Form submissions
    childForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = childNameInput.value.trim();
        const className = childClassInput.value.trim();
        
        if (!name) {
            showToast('Nama anak harus diisi', 'warning');
            return;
        }
        
        // Check for duplicate name
        if (children.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            showToast('Nama anak sudah terdaftar', 'warning');
            return;
        }
        
        addChild(name, className || null);
        childForm.reset();
        displayAllData();
        
        showToast(`${name} berhasil ditambahkan`, 'success');
    });
    
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = expenseAmount.value;
        const date = expenseDate.value;
        const category = expenseCategory.value;
        const note = expenseNote.value.trim();
        
        if (!amount || amount <= 0) {
            showToast('Jumlah pengeluaran harus lebih dari 0', 'warning');
            return;
        }
        
        if (!note) {
            showToast('Keterangan pengeluaran harus diisi', 'warning');
            return;
        }
        
        addExpense(amount, date, category, note);
        expenseForm.reset();
        expenseDate.valueAsDate = new Date();
        displayAllData();
        
        showToast('Pengeluaran berhasil dicatat', 'success');
    });
    
    otherIncomeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = otherIncomeAmount.value;
        const date = otherIncomeDate.value;
        const category = otherIncomeCategory.value;
        const note = otherIncomeNote.value.trim();
        
        if (!amount || amount <= 0) {
            showToast('Jumlah pemasukan harus lebih dari 0', 'warning');
            return;
        }
        
        if (!note) {
            showToast('Keterangan pemasukan harus diisi', 'warning');
            return;
        }
        
        addOtherIncome(amount, date, category, note);
        otherIncomeForm.reset();
        otherIncomeDate.valueAsDate = new Date();
        displayAllData();
        
        showToast('Pemasukan berhasil ditambahkan', 'success');
    });
    
    editChildForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const childId = editChildId.value;
        const name = editChildName.value.trim();
        const className = editChildClass.value.trim();
        
        if (editChild(id, name, className || null)) {
            closeEditChildModal();
            displayAllData();
            showToast('Data anak berhasil diperbarui', 'success');
        }
    });
    
    editTransactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const transactionId = editTransactionId.value;
        const type = editTransactionType.value;
        const amount = editTransactionAmount.value;
        const date = editTransactionDate.value;
        const note = editTransactionNote.value.trim();
        const category = editTransactionCategory.value.trim();
        
        if (editTransaction(transactionId, type, amount, date, note, category)) {
            closeEditTransactionModal();
            displayAllData();
            showToast('Transaksi berhasil diperbarui', 'success');
        }
    });
    
    initialBalanceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = initialBalanceAmountInput.value;
        const month = initialBalanceMonthInput.value;
        const year = initialBalanceYear.value;
        const note = initialBalanceNoteInput.value.trim();
        
        if (!amount || amount <= 0) {
            showToast('Jumlah saldo awal harus lebih dari 0', 'warning');
            return;
        }
        
        saveInitialBalance({
            amount: amount,
            month: month,
            year: year,
            note: note
        });
        
        displayAllData();
    });
    
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
        closeSettingsModal();
    });
    
    // Search input
    searchInput.addEventListener('input', function(e) {
        currentFilter.search = e.target.value;
        currentPage = 1;
        displayAllData();
    });
    
    // Filter changes
    applyFilter.addEventListener('click', function() {
        currentFilter.month = filterMonth.value;
        currentFilter.year = filterYear.value === 'all' ? 'all' : parseInt(filterYear.value);
        currentPage = 1;
        displayAllData();
        
        showToast('Filter diterapkan', 'success');
    });
    
    resetFilter.addEventListener('click', function() {
        const now = new Date();
        const currentMonth = now.toLocaleString('id-ID', { month: 'long' });
        const currentYear = now.getFullYear();
        
        filterMonth.value = currentMonth;
        filterYear.value = currentYear;
        sortBy.value = 'date-desc';
        searchInput.value = '';
        
        currentFilter.month = currentMonth;
        currentFilter.year = currentYear;
        currentFilter.search = '';
        currentFilter.sortBy = 'date-desc';
        currentFilter.transactionType = 'all';
        currentPage = 1;
        
        displayAllData();
        
        showToast('Filter direset ke bulan berjalan', 'info');
    });
    
    sortBy.addEventListener('change', function(e) {
        currentFilter.sortBy = e.target.value;
        displayAllData();
    });
    
    // Transaction type filters
    showAllTransactions.addEventListener('click', function() {
        currentFilter.transactionType = 'all';
        currentPage = 1;
        displayAllData();
    });
    
    showKasOnly.addEventListener('click', function() {
        currentFilter.transactionType = 'kas';
        currentPage = 1;
        displayAllData();
    });
    
    showIncomeOnly.addEventListener('click', function() {
        currentFilter.transactionType = 'income';
        currentPage = 1;
        displayAllData();
    });
    
    showExpenseOnly.addEventListener('click', function() {
        currentFilter.transactionType = 'expense';
        currentPage = 1;
        displayAllData();
    });
    
    // Clear all transactions
    clearAll.addEventListener('click', clearAllTransactions);
    
    // Pay all kas
    payAllKas.addEventListener('click', payKasForAllChildren);
    
    // Export buttons
    exportExcel.addEventListener('click', exportToExcel);
    exportPDF.addEventListener('click', exportToPDF);
    exportWord.addEventListener('click', exportToExcel); // Same as Excel for now
    sendWA.addEventListener('click', sendToWhatsApp);
    
    // Action buttons
    settingsBtn.addEventListener('click', openSettingsModal);
    quickIncomeBtn.addEventListener('click', function() {
        const now = new Date();
        const currentMonth = now.toLocaleString('id-ID', { month: 'long' });
        const currentYear = now.getFullYear();
        // This would open a quick income modal or form
        showToast('Fitur pemasukan cepat sedang dikembangkan', 'info');
    });
    
    notificationBell.addEventListener('click', openNotificationsModal);
    
    // Pagination
    prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayTransactions();
        }
    });
    
    nextPage.addEventListener('click', function() {
        const filteredTransactions = filterTransactions();
        const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
        
        if (currentPage < totalPages) {
            currentPage++;
            displayTransactions();
        }
    });
    
    // Modal close buttons
    document.addEventListener('click', function(e) {
        if (e.target === editChildModal) closeEditChildModal();
        if (e.target === editTransactionModal) closeEditTransactionModal();
        if (e.target === initialBalanceModal) closeInitialBalanceModal();
        if (e.target === settingsModal) closeSettingsModal();
        if (e.target === notificationsModal) closeNotificationsModal();
        if (e.target === confirmModal) closeConfirmModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key closes modals
        if (e.key === 'Escape') {
            closeEditChildModal();
            closeEditTransactionModal();
            closeInitialBalanceModal();
            closeSettingsModal();
            closeNotificationsModal();
            closeConfirmModal();
        }
        
        // Ctrl+S for save/backup
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            backupData();
        }
        
        // F1 for tutorial
        if (e.key === 'F1') {
            e.preventDefault();
            showTutorial();
        }
        
        // Alt+N for notifications
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            openNotificationsModal();
        }
    });
    
    // Print transactions
    window.printTransactions = function() {
        window.print();
    };
    
    // Refresh monthly data
    window.refreshMonthlyData = function() {
        displayMonthlyData();
        showToast('Data bulanan diperbarui', 'success');
    };
}

// Show Tutorial
function showTutorial() {
    Swal.fire({
        title: 'Panduan Penggunaan Buku Kas',
        html: `
            <div class="text-left space-y-4">
                <div>
                    <h3 class="font-bold text-blue-600 mb-2">🎯 Fitur Utama:</h3>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><strong>Tambah Anak</strong> - Kelola data anak yang membayar kas</li>
                        <li><strong>Bayar Kas</strong> - Pencatatan pembayaran kas bulanan</li>
                        <li><strong>Pengeluaran</strong> - Catat semua pengeluaran kas</li>
                        <li><strong>Pemasukan Lain</strong> - Tambah pemasukan selain kas anak</li>
                        <li><strong>Saldo Awal</strong> - Otomatis hitung saldo bulan sebelumnya</li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="font-bold text-green-600 mb-2">📊 Fitur Lanjutan:</h3>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><strong>Grafik & Statistik</strong> - Visualisasi data keuangan</li>
                        <li><strong>Notifikasi</strong> - Reminder bayar kas otomatis</li>
                        <li><strong>Export Data</strong> - Export ke Excel, PDF, WhatsApp</li>
                        <li><strong>Filter & Pencarian</strong> - Temukan data dengan cepat</li>
                        <li><strong>Backup Data</strong> - Cadangkan data ke file JSON</li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="font-bold text-purple-600 mb-2">⚡ Shortcut Keyboard:</h3>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><strong>F1</strong> - Buka panduan ini</li>
                        <li><strong>Alt + N</strong> - Buka notifikasi</li>
                        <li><strong>Ctrl + S</strong> - Backup data</li>
                        <li><strong>Escape</strong> - Tutup semua modal</li>
                    </ul>
                </div>
                
                <div class="bg-blue-50 p-3 rounded-lg">
                    <p class="text-sm text-blue-700">
                        <i class="fas fa-lightbulb mr-2"></i>
                        <strong>Tips:</strong> Aktifkan notifikasi untuk mendapatkan reminder bayar kas otomatis setiap bulan!
                    </p>
                </div>
            </div>
        `,
        width: 700,
        confirmButtonText: 'Mengerti, Mulai!',
        confirmButtonColor: '#3b82f6',
        icon: 'info'
    });
}

// ============================================
// START APPLICATION
// ============================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Make functions available globally
window.payKasForChild = payKasForChild;
window.openEditChildModal = openEditChildModal;
window.closeEditChildModal = closeEditChildModal;
window.openEditTransactionModal = openEditTransactionModal;
window.closeEditTransactionModal = closeEditTransactionModal;
window.editInitialBalance = editInitialBalance;
window.closeInitialBalanceModal = closeInitialBalanceModal;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.openNotificationsModal = openNotificationsModal;
window.closeNotificationsModal = closeNotificationsModal;
window.closeConfirmModal = closeConfirmModal;
window.processConfirmation = processConfirmation;
window.markNotificationAsRead = markNotificationAsRead;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.clearAllNotifications = clearAllNotifications;
window.viewMonthDetail = viewMonthDetail;
window.goToPage = goToPage;
window.hideHeaderNotification = hideHeaderNotification;
window.backupData = backupData;
window.restoreData = restoreData;
window.showTutorial = showTutorial;
window.deleteChild = deleteChild;
window.deleteTransaction = deleteTransaction;
window.payKasForAllChildren = payKasForAllChildren;
window.exportToExcel = exportToExcel;
window.exportToPDF = exportToPDF;
window.sendToWhatsApp = sendToWhatsApp;
window.clearAllTransactions = clearAllTransactions;

// Quick income function (placeholder)
window.addOtherIncome = function(month, year) {
    Swal.fire({
        title: 'Tambah Pemasukan Lain',
        html: `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Pemasukan</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2 text-gray-500">Rp</span>
                        <input type="number" id="swalIncomeAmount" placeholder="0" class="w-full pl-10 p-2 border rounded-lg" required>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                    <textarea id="swalIncomeNote" placeholder="Sumber pemasukan" class="w-full p-2 border rounded-lg" rows="2" required></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select id="swalIncomeCategory" class="w-full p-2 border rounded-lg">
                        <option value="Donasi">Donasi</option>
                        <option value="Sponsor">Sponsor</option>
                        <option value="Bantuan">Bantuan</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Tambah',
        cancelButtonText: 'Batal',
        preConfirm: () => {
            const amount = document.getElementById('swalIncomeAmount').value;
            const note = document.getElementById('swalIncomeNote').value;
            const category = document.getElementById('swalIncomeCategory').value;
            
            if (!amount || amount <= 0) {
                Swal.showValidationMessage('Jumlah harus lebih dari 0');
                return false;
            }
            
            if (!note) {
                Swal.showValidationMessage('Keterangan harus diisi');
                return false;
            }
            
            return { amount, note, category };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { amount, note, category } = result.value;
            const date = new Date().toISOString().split('T')[0];
            
            addOtherIncome(amount, date, category, note);
            displayAllData();
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: `Pemasukan ${formatRupiah(amount)} berhasil ditambahkan`,
                timer: 2000
            });
        }
    });
};