// Data aplikasi
let children = JSON.parse(localStorage.getItem('children')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let settings = JSON.parse(localStorage.getItem('settings')) || {
    kasAmount: 10000,
    theme: 'blue',
    backupAuto: false,
    notifications: true,
    lastBackup: null
};

// State aplikasi
let currentFilter = {
    month: 'all',
    year: 'all',
    search: '',
    sortBy: 'date-desc'
};

// Chart instances
let kasChart = null;
let expenseChart = null;

// Elemen DOM
const currentMonthYearElement = document.getElementById('currentMonthYear');
const kasAmountDisplay = document.getElementById('kasAmountDisplay');
const kasAmountText = document.getElementById('kasAmountText');
const settingsBtn = document.getElementById('settingsBtn');
const searchInput = document.getElementById('searchInput');
const filterMonthElement = document.getElementById('filterMonth');
const filterYearElement = document.getElementById('filterYear');
const sortByElement = document.getElementById('sortBy');
const applyFilterBtn = document.getElementById('applyFilter');
const resetFilterBtn = document.getElementById('resetFilter');
const childForm = document.getElementById('childForm');
const childNameInput = document.getElementById('childNameInput');
const childClassInput = document.getElementById('childClassInput');
const childrenListContainer = document.getElementById('childrenListContainer');
const emptyChildren = document.getElementById('emptyChildren');
const childCount = document.getElementById('childCount');
const payAllKasBtn = document.getElementById('payAllKas');
const expenseForm = document.getElementById('expenseForm');
const expenseAmount = document.getElementById('expenseAmount');
const expenseDate = document.getElementById('expenseDate');
const expenseCategory = document.getElementById('expenseCategory');
const expenseNote = document.getElementById('expenseNote');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const balance = document.getElementById('balance');
const summaryMonth = document.getElementById('summaryMonth');
const summaryInfo = document.getElementById('summaryInfo');
const saldoWarning = document.getElementById('saldoWarning');
const monthlyData = document.getElementById('monthlyData');
const emptyMonthly = document.getElementById('emptyMonthly');
const monthlyDataInfo = document.getElementById('monthlyDataInfo');
const transactionList = document.getElementById('transactionList');
const emptyState = document.getElementById('emptyState');
const transactionInfo = document.getElementById('transactionInfo');
const transactionCount = document.getElementById('transactionCount');
const clearAllBtn = document.getElementById('clearAll');
const exportExcelBtn = document.getElementById('exportExcel');
const exportPDFBtn = document.getElementById('exportPDF');
const exportWordBtn = document.getElementById('exportWord');
const sendWABtn = document.getElementById('sendWA');

// Modal elements
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

const settingsModal = document.getElementById('settingsModal');
const settingsForm = document.getElementById('settingsForm');
const kasAmountSetting = document.getElementById('kasAmountSetting');
const themeSetting = document.getElementById('themeSetting');
const backupAuto = document.getElementById('backupAuto');
const notifications = document.getElementById('notifications');

const loadingOverlay = document.getElementById('loadingOverlay');

// ==================== INISIALISASI ====================

function initializeApp() {
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long' });
    const currentYear = now.getFullYear();
    
    currentMonthYearElement.textContent = `${currentMonth} ${currentYear}`;
    
    // Set filter default
    filterMonthElement.value = currentMonth;
    filterYearElement.value = currentYear;
    currentFilter.month = currentMonth;
    currentFilter.year = currentYear;
    
    initializeYearFilter();
    setExpenseDateToToday();
    applyTheme(settings.theme);
    updateKasDisplay();
    displayAllData();
    setupEventListeners();
    checkBackupReminder();
    showWelcomeTutorial();
}

function setExpenseDateToToday() {
    expenseDate.valueAsDate = new Date();
}

function initializeYearFilter() {
    filterYearElement.innerHTML = '';
    const currentYear = new Date().getFullYear();
    
    const years = [currentYear - 1, currentYear, currentYear + 1];
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        filterYearElement.appendChild(option);
    });
    
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Semua Tahun';
    filterYearElement.insertBefore(allOption, filterYearElement.firstChild);
}

function updateKasDisplay() {
    const formattedAmount = formatRupiah(settings.kasAmount);
    kasAmountDisplay.textContent = formattedAmount;
    kasAmountText.textContent = `${formattedAmount} per anak per bulan`;
}

// ==================== FORMATTING FUNCTIONS ====================

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getMonthFromDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', { month: 'long' });
}

function getYearFromDate(dateString) {
    const date = new Date(dateString);
    return date.getFullYear();
}

// ==================== DATA MANAGEMENT ====================

function saveData() {
    localStorage.setItem('children', JSON.stringify(children));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('settings', JSON.stringify(settings));
}

function showLoading() {
    loadingOverlay.classList.remove('hidden');
    document.body.classList.add('cursor-loading');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
    document.body.classList.remove('cursor-loading');
}

// ==================== FILTER & SEARCH ====================

function filterTransactions() {
    let filtered = transactions;
    
    // Filter by month
    if (currentFilter.month !== 'all') {
        filtered = filtered.filter(transaction => 
            transaction.month === currentFilter.month
        );
    }
    
    // Filter by year
    if (currentFilter.year !== 'all') {
        filtered = filtered.filter(transaction => 
            transaction.year === currentFilter.year
        );
    }
    
    // Filter by search
    if (currentFilter.search) {
        const searchLower = currentFilter.search.toLowerCase();
        filtered = filtered.filter(transaction => {
            const childName = transaction.childName ? transaction.childName.toLowerCase() : '';
            const note = transaction.note ? transaction.note.toLowerCase() : '';
            const amount = transaction.amount.toString();
            const date = formatDate(transaction.date).toLowerCase();
            
            return childName.includes(searchLower) || 
                   note.includes(searchLower) ||
                   amount.includes(searchLower) ||
                   date.includes(searchLower);
        });
    }
    
    // Sort data
    filtered.sort((a, b) => {
        switch (currentFilter.sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'amount-desc':
                return parseInt(b.amount) - parseInt(a.amount);
            case 'amount-asc':
                return parseInt(a.amount) - parseInt(b.amount);
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

function highlightText(text, search) {
    if (!search) return text;
    
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
}

// ==================== CALCULATIONS ====================

function calculateTotals() {
    const filteredTransactions = filterTransactions();
    
    let income = 0;
    let expense = 0;
    
    filteredTransactions.forEach(transaction => {
        if (transaction.type === 'kas') {
            income += parseInt(transaction.amount);
        } else if (transaction.type === 'expense') {
            expense += parseInt(transaction.amount);
        }
    });
    
    totalIncome.textContent = formatRupiah(income);
    totalExpense.textContent = formatRupiah(expense);
    balance.textContent = formatRupiah(income - expense);
    
    // Show warning if balance is negative
    if (income - expense < 0) {
        saldoWarning.classList.remove('hidden');
    } else {
        saldoWarning.classList.add('hidden');
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
        summaryInfo.textContent = `Data untuk ${currentFilter.month} ${currentFilter.year}`;
    }
}

// ==================== DISPLAY FUNCTIONS ====================

function displayChildren() {
    childrenListContainer.innerHTML = '';
    
    if (children.length === 0) {
        childrenListContainer.appendChild(emptyChildren);
        emptyChildren.classList.remove('hidden');
        childCount.textContent = '0 Anak';
        payAllKasBtn.disabled = true;
        payAllKasBtn.classList.add('opacity-50');
        return;
    }
    
    emptyChildren.classList.add('hidden');
    childCount.textContent = `${children.length} Anak`;
    payAllKasBtn.disabled = false;
    payAllKasBtn.classList.remove('opacity-50');
    
    children.forEach((child, index) => {
        const childElement = document.createElement('div');
        childElement.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 slide-down';
        
        // Hitung status bayar kas berdasarkan filter
        let hasPaid = false;
        if (currentFilter.month !== 'all' && currentFilter.year !== 'all') {
            hasPaid = transactions.some(t => 
                t.type === 'kas' && 
                t.childId === child.id && 
                t.month === currentFilter.month && 
                t.year === currentFilter.year
            );
        }
        
        childElement.innerHTML = `
            <div class="flex items-center flex-1">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600 font-medium text-sm">${index + 1}</span>
                </div>
                <div class="flex-1">
                    <p class="font-medium text-gray-800">${child.name}</p>
                    <div class="flex items-center space-x-2">
                        <p class="text-xs ${hasPaid ? 'text-green-600' : 'text-red-600'}">
                            ${currentFilter.month === 'all' || currentFilter.year === 'all' 
                                ? 'Pilih bulan & tahun' 
                                : (hasPaid ? '✓ Sudah bayar kas' : '✗ Belum bayar kas')}
                        </p>
                        ${child.class ? `<span class="badge badge-info">${child.class}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="flex space-x-1">
                <button onclick="editChild('${child.id}')" class="text-blue-500 hover:text-blue-700 p-1 transition duration-200" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteChild('${child.id}')" class="text-red-500 hover:text-red-700 p-1 transition duration-200" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
                <button onclick="payKas('${child.id}')" class="${hasPaid || currentFilter.month === 'all' || currentFilter.year === 'all' ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 hover:bg-blue-700 text-white'} text-sm px-3 py-1 rounded-md transition duration-200" ${hasPaid || currentFilter.month === 'all' || currentFilter.year === 'all' ? 'disabled' : ''}>
                    ${hasPaid ? 'Sudah Bayar' : 'Bayar Kas'}
                </button>
            </div>
        `;
        
        childrenListContainer.appendChild(childElement);
    });
}

function displayMonthlyData() {
    monthlyData.innerHTML = '';
    
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    let hasData = false;
    
    months.forEach(month => {
        let monthKas = transactions.filter(t => t.type === 'kas' && t.month === month);
        
        if (currentFilter.year !== 'all') {
            monthKas = monthKas.filter(t => t.year === currentFilter.year);
        }
        
        if (monthKas.length > 0) {
            hasData = true;
            const totalKas = monthKas.reduce((sum, t) => sum + parseInt(t.amount), 0);
            const childCount = [...new Set(monthKas.map(t => t.childId))].length;
            const totalChildren = children.length;
            const percentage = Math.round((childCount / totalChildren) * 100);
            const year = currentFilter.year !== 'all' ? currentFilter.year : 'Semua Tahun';
            
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-50 slide-down';
            row.innerHTML = `
                <td class="py-3 px-4 font-medium">${month} ${year}</td>
                <td class="py-3 px-4">${childCount}/${totalChildren} anak (${percentage}%)</td>
                <td class="py-3 px-4 font-bold text-green-600">${formatRupiah(totalKas)}</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 ${percentage === 100 ? 'bg-green-100 text-green-800' : percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} rounded-full text-xs font-medium">
                        ${percentage === 100 ? 'Lengkap' : percentage >= 50 ? 'Cukup' : 'Kurang'}
                    </span>
                </td>
                <td class="py-3 px-4">
                    <button onclick="viewMonthDetail('${month}', ${currentFilter.year !== 'all' ? currentFilter.year : 'all'})" class="text-blue-500 hover:text-blue-700 text-sm">
                        <i class="fas fa-eye mr-1"></i> Lihat
                    </button>
                </td>
            `;
            monthlyData.appendChild(row);
        }
    });
    
    if (!hasData) {
        monthlyData.appendChild(emptyMonthly);
        emptyMonthly.classList.remove('hidden');
        monthlyDataInfo.textContent = 'Tidak ada data kas untuk filter yang dipilih';
    } else {
        emptyMonthly.classList.add('hidden');
        if (currentFilter.year === 'all') {
            monthlyDataInfo.textContent = 'Menampilkan data semua tahun';
        } else {
            monthlyDataInfo.textContent = `Menampilkan data tahun ${currentFilter.year}`;
        }
    }
}

function displayTransactions() {
    transactionList.innerHTML = '';
    
    const filteredTransactions = filterTransactions();
    const totalTransactions = filteredTransactions.length;
    
    transactionCount.textContent = `${totalTransactions} transaksi`;
    
    if (totalTransactions === 0) {
        transactionList.appendChild(emptyState);
        emptyState.classList.remove('hidden');
        
        if (currentFilter.search) {
            transactionInfo.textContent = `Tidak ada transaksi untuk "${currentFilter.search}"`;
        } else if (currentFilter.month === 'all' && currentFilter.year === 'all') {
            transactionInfo.textContent = 'Tidak ada transaksi untuk ditampilkan';
        } else if (currentFilter.month === 'all') {
            transactionInfo.textContent = `Tidak ada transaksi pada tahun ${currentFilter.year}`;
        } else if (currentFilter.year === 'all') {
            transactionInfo.textContent = `Tidak ada transaksi pada bulan ${currentFilter.month}`;
        } else {
            transactionInfo.textContent = `Tidak ada transaksi pada ${currentFilter.month} ${currentFilter.year}`;
        }
        return;
    }
    
    emptyState.classList.add('hidden');
    
    // Update transaction info
    let infoText = '';
    if (currentFilter.search) {
        infoText = `Menampilkan ${totalTransactions} transaksi untuk "${currentFilter.search}"`;
    } else if (currentFilter.month === 'all' && currentFilter.year === 'all') {
        infoText = 'Menampilkan semua transaksi';
    } else if (currentFilter.month === 'all') {
        infoText = `Menampilkan transaksi tahun ${currentFilter.year}`;
    } else if (currentFilter.year === 'all') {
        infoText = `Menampilkan transaksi bulan ${currentFilter.month} semua tahun`;
    } else {
        infoText = `Menampilkan transaksi ${currentFilter.month} ${currentFilter.year}`;
    }
    transactionInfo.textContent = infoText;
    
    filteredTransactions.forEach((transaction) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50 slide-down';
        
        const typeClass = transaction.type === 'kas' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800';
        
        const typeText = transaction.type === 'kas' 
            ? 'Kas Masuk' 
            : 'Pengeluaran';
        
        const amountClass = transaction.type === 'kas' 
            ? 'text-green-600 font-bold' 
            : 'text-red-600 font-bold';
        
        // Highlight search results
        const displayDate = currentFilter.search ? 
            highlightText(formatDate(transaction.date), currentFilter.search) : 
            formatDate(transaction.date);
            
        const displayNote = currentFilter.search ? 
            highlightText(transaction.type === 'kas' ? 
                `${transaction.childName} - ${transaction.note}` : 
                transaction.note, currentFilter.search) :
            (transaction.type === 'kas' ? 
                `${transaction.childName} - ${transaction.note}` : 
                transaction.note);
        
        row.innerHTML = `
            <td class="py-3 px-4">${displayDate}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${typeClass}">
                    ${typeText}
                </span>
            </td>
            <td class="py-3 px-4 ${amountClass}">
                ${formatRupiah(parseInt(transaction.amount))}
            </td>
            <td class="py-3 px-4">${displayNote}</td>
            <td class="py-3 px-4">
                <div class="flex space-x-2">
                    <button onclick="editTransaction('${transaction.id}')" class="text-blue-500 hover:text-blue-700 transition duration-200" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTransaction('${transaction.id}')" class="text-red-500 hover:text-red-700 transition duration-200" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        transactionList.appendChild(row);
    });
}

// ==================== CHART FUNCTIONS ====================

function updateCharts() {
    updateKasChart();
    updateExpenseChart();
}

function updateKasChart() {
    const ctx = document.getElementById('kasChart').getContext('2d');
    
    if (kasChart) {
        kasChart.destroy();
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentYear = currentFilter.year !== 'all' ? currentFilter.year : new Date().getFullYear();
    
    const monthlyData = months.map((month, index) => {
        const fullMonthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                              'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][index];
        
        const monthKas = transactions.filter(t => 
            t.type === 'kas' && 
            t.month === fullMonthName && 
            (currentFilter.year === 'all' || t.year === currentYear)
        );
        
        return monthKas.reduce((sum, t) => sum + parseInt(t.amount), 0);
    });
    
    kasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Kas Masuk',
                data: monthlyData,
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + value.toLocaleString('id-ID');
                        }
                    }
                }
            }
        }
    });
}

function updateExpenseChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories = {};
    
    expenses.forEach(expense => {
        const category = expense.category || 'Lainnya';
        categories[category] = (categories[category] || 0) + parseInt(expense.amount);
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
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ==================== KAS FUNCTIONS ====================

function payKas(childId) {
    const child = children.find(c => c.id === childId);
    if (!child) return;
    
    const alreadyPaid = transactions.some(t => 
        t.type === 'kas' && 
        t.childId === childId && 
        t.month === currentFilter.month && 
        t.year === currentFilter.year
    );
    
    if (alreadyPaid) {
        Swal.fire({
            icon: 'info',
            title: 'Sudah Bayar',
            text: `${child.name} sudah membayar kas bulan ${currentFilter.month} ${currentFilter.year}`,
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    Swal.fire({
        title: 'Bayar Kas',
        html: `Konfirmasi pembayaran kas untuk <b>${child.name}</b>?<br>
              Bulan: <b>${currentFilter.month} ${currentFilter.year}</b><br>
              Jumlah: <b>${formatRupiah(settings.kasAmount)}</b>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Bayar',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444'
    }).then((result) => {
        if (result.isConfirmed) {
            transactions.push({
                id: Date.now().toString(),
                type: 'kas',
                childId: childId,
                childName: child.name,
                amount: settings.kasAmount,
                month: currentFilter.month,
                year: currentFilter.year,
                date: new Date().toISOString().split('T')[0],
                note: `Bayar kas bulan ${currentFilter.month} ${currentFilter.year}`
            });
            
            saveData();
            displayAllData();
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: `${child.name} berhasil membayar kas ${formatRupiah(settings.kasAmount)}`,
                confirmButtonColor: '#10b981',
                timer: 2000
            });
        }
    });
}

function payAllKas() {
    if (children.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Tidak Ada Anak',
            text: 'Tambahkan anak terlebih dahulu!',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    if (currentFilter.month === 'all' || currentFilter.year === 'all') {
        Swal.fire({
            icon: 'warning',
            title: 'Pilih Bulan & Tahun',
            text: 'Pilih bulan dan tahun tertentu untuk bayar kas!',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    const totalAmount = children.length * settings.kasAmount;
    
    Swal.fire({
        title: 'Bayar Kas Semua Anak',
        html: `Konfirmasi pembayaran kas untuk <b>${children.length} anak</b>?<br>
              Bulan: <b>${currentFilter.month} ${currentFilter.year}</b><br>
              Total: <b>${formatRupiah(totalAmount)}</b>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Bayar Semua',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444'
    }).then((result) => {
        if (result.isConfirmed) {
            showLoading();
            
            setTimeout(() => {
                let paidCount = 0;
                
                children.forEach(child => {
                    const alreadyPaid = transactions.some(t => 
                        t.type === 'kas' && 
                        t.childId === child.id && 
                        t.month === currentFilter.month && 
                        t.year === currentFilter.year
                    );
                    
                    if (!alreadyPaid) {
                        transactions.push({
                            id: Date.now().toString() + paidCount,
                            type: 'kas',
                            childId: child.id,
                            childName: child.name,
                            amount: settings.kasAmount,
                            month: currentFilter.month,
                            year: currentFilter.year,
                            date: new Date().toISOString().split('T')[0],
                            note: `Bayar kas bulan ${currentFilter.month} ${currentFilter.year}`
                        });
                        paidCount++;
                    }
                });
                
                saveData();
                displayAllData();
                hideLoading();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    html: `<b>${paidCount} anak</b> berhasil membayar kas<br>
                          Bulan: <b>${currentFilter.month} ${currentFilter.year}</b><br>
                          Total: <b>${formatRupiah(paidCount * settings.kasAmount)}</b>`,
                    confirmButtonColor: '#10b981',
                    timer: 3000
                });
            }, 1000);
        }
    });
}

// ==================== EDIT FUNCTIONS ====================

function editChild(childId) {
    const child = children.find(c => c.id === childId);
    if (!child) return;
    
    editChildId.value = childId;
    editChildName.value = child.name;
    editChildClass.value = child.class || '';
    
    editChildModal.classList.remove('hidden');
    editChildModal.classList.add('modal-enter');
}

function closeEditChildModal() {
    editChildModal.classList.add('hidden');
    editChildForm.reset();
}

function editTransaction(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    editTransactionId.value = transactionId;
    editTransactionType.value = transaction.type;
    editTransactionAmount.value = transaction.amount;
    editTransactionDate.value = transaction.date;
    editTransactionNote.value = transaction.note;
    
    editTransactionModal.classList.remove('hidden');
    editTransactionModal.classList.add('modal-enter');
}

function closeEditTransactionModal() {
    editTransactionModal.classList.add('hidden');
    editTransactionForm.reset();
}

// ==================== DELETE FUNCTIONS ====================

function deleteChild(childId) {
    const child = children.find(c => c.id === childId);
    if (!child) return;
    
    // Cek apakah anak punya transaksi
    const hasTransactions = transactions.some(t => t.childId === childId);
    
    Swal.fire({
        title: 'Hapus Anak?',
        html: `Anda akan menghapus <b>${child.name}</b> dari sistem.${hasTransactions ? '<br><small class="text-red-600">Anak ini memiliki riwayat transaksi yang juga akan dihapus!</small>' : ''}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280'
    }).then((result) => {
        if (result.isConfirmed) {
            // Hapus anak
            children = children.filter(c => c.id !== childId);
            
            // Hapus transaksi terkait anak
            if (hasTransactions) {
                transactions = transactions.filter(t => t.childId !== childId);
            }
            
            saveData();
            displayAllData();
            
            Swal.fire({
                icon: 'success',
                title: 'Terhapus!',
                text: 'Anak berhasil dihapus dari sistem.',
                confirmButtonColor: '#10b981',
                timer: 1500
            });
        }
    });
}

function deleteTransaction(transactionId) {
    Swal.fire({
        title: 'Hapus Transaksi?',
        text: "Transaksi yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const index = transactions.findIndex(t => t.id === transactionId);
            if (index !== -1) {
                transactions.splice(index, 1);
                saveData();
                displayAllData();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Terhapus!',
                    text: 'Transaksi berhasil dihapus.',
                    confirmButtonColor: '#10b981',
                    timer: 1500
                });
            }
        }
    });
}

function clearAllTransactions() {
    let transactionsToDelete = transactions;
    
    if (currentFilter.month !== 'all' || currentFilter.year !== 'all' || currentFilter.search) {
        transactionsToDelete = filterTransactions();
    }
    
    if (transactionsToDelete.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Tidak Ada Data',
            text: 'Tidak ada transaksi untuk dihapus.',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    const filterText = currentFilter.month === 'all' && currentFilter.year === 'all' && !currentFilter.search
        ? 'semua transaksi' 
        : `transaksi yang difilter (${transactionsToDelete.length} data)`;
    
    Swal.fire({
        title: `Hapus ${filterText}?`,
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            if (currentFilter.month === 'all' && currentFilter.year === 'all' && !currentFilter.search) {
                transactions = [];
            } else {
                transactions = transactions.filter(t => !transactionsToDelete.includes(t));
            }
            
            saveData();
            displayAllData();
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: `${transactionsToDelete.length} transaksi berhasil dihapus.`,
                confirmButtonColor: '#10b981',
                timer: 2000
            });
        }
    });
}

// ==================== SETTINGS FUNCTIONS ====================

function openSettingsModal() {
    kasAmountSetting.value = settings.kasAmount;
    themeSetting.value = settings.theme;
    backupAuto.checked = settings.backupAuto;
    notifications.checked = settings.notifications;
    
    settingsModal.classList.remove('hidden');
    settingsModal.classList.add('modal-enter');
}

function closeSettingsModal() {
    settingsModal.classList.add('hidden');
}

function applyTheme(theme) {
    document.documentElement.className = `theme-${theme}`;
    
    // Update header gradient based on theme
    const header = document.querySelector('header');
    const gradients = {
        blue: 'from-blue-600 to-indigo-800',
        green: 'from-green-600 to-emerald-800',
        purple: 'from-purple-600 to-violet-800',
        red: 'from-red-600 to-rose-800'
    };
    
    header.className = header.className.replace(/from-\w+-\d+ to-\w+-\d+/, gradients[theme]);
}

function backupData() {
    showLoading();
    
    setTimeout(() => {
        const backup = {
            children: children,
            transactions: transactions,
            settings: settings,
            backupDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `backup_buku_kas_${new Date().getTime()}.json`;
        link.click();
        
        settings.lastBackup = new Date().toISOString();
        saveData();
        hideLoading();
        
        Swal.fire({
            icon: 'success',
            title: 'Backup Berhasil!',
            text: 'Data berhasil di-backup ke file JSON.',
            confirmButtonColor: '#10b981',
            timer: 2000
        });
    }, 1000);
}

function checkBackupReminder() {
    if (!settings.lastBackup) return;
    
    const lastBackup = new Date(settings.lastBackup);
    const now = new Date();
    const diffTime = Math.abs(now - lastBackup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) {
        Swal.fire({
            icon: 'info',
            title: 'Pengingat Backup',
            text: `Sudah ${diffDays} hari sejak backup terakhir. Disarankan untuk melakukan backup data.`,
            confirmButtonText: 'Backup Sekarang',
            showCancelButton: true,
            cancelButtonText: 'Nanti'
        }).then((result) => {
            if (result.isConfirmed) {
                backupData();
            }
        });
    }
}

// ==================== TUTORIAL ====================

function showWelcomeTutorial() {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    
    if (!hasSeenTutorial) {
        Swal.fire({
            title: 'Selamat Datang di Buku Kas!',
            html: `
                <div class="text-left space-y-3">
                    <p><strong>Fitur Utama:</strong></p>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>📝 Kelola data anak dan pembayaran kas</li>
                        <li>💰 Catat pengeluaran dengan kategori</li>
                        <li>📊 Lihat grafik dan statistik keuangan</li>
                        <li>🔍 Filter dan pencarian data</li>
                        <li>📤 Export data ke Excel, PDF, Word</li>
                        <li>📱 Kirim laporan ke WhatsApp</li>
                    </ul>
                    <p class="text-sm text-gray-600 mt-3">Tekan F1 kapan saja untuk melihat tutorial ini kembali.</p>
                </div>
            `,
            icon: 'info',
            width: 600,
            confirmButtonText: 'Mulai Menggunakan',
            confirmButtonColor: '#3b82f6'
        });
        
        localStorage.setItem('hasSeenTutorial', 'true');
    }
}

function showTutorial() {
    Swal.fire({
        title: 'Panduan Penggunaan',
        html: `
            <div class="text-left space-y-4 max-h-96 overflow-y-auto">
                <div>
                    <h3 class="font-bold text-blue-600">1. Tambah Anak</h3>
                    <p>Isi nama anak dan kelas/group (opsional) di form "Manajemen Anak"</p>
                </div>
                
                <div>
                    <h3 class="font-bold text-green-600">2. Bayar Kas</h3>
                    <p>Pilih bulan & tahun, lalu klik "Bayar Kas" di samping nama anak atau "Bayar Kas Semua Anak"</p>
                </div>
                
                <div>
                    <h3 class="font-bold text-red-600">3. Catat Pengeluaran</h3>
                    <p>Isi form "Pengeluaran Kas" dengan jumlah, tanggal, kategori, dan keterangan</p>
                </div>
                
                <div>
                    <h3 class="font-bold text-purple-600">4. Filter & Pencarian</h3>
                    <p>Gunakan filter bulan/tahun dan kotak pencarian untuk menemukan data spesifik</p>
                </div>
                
                <div>
                    <h3 class="font-bold text-yellow-600">5. Export Data</h3>
                    <p>Gunakan tombol export untuk mengunduh data dalam format Excel, PDF, Word, atau kirim ke WhatsApp</p>
                </div>
                
                <div>
                    <h3 class="font-bold text-indigo-600">6. Edit & Hapus</h3>
                    <p>Klik ikon edit (✏️) atau hapus (🗑️) di samping data untuk mengubah atau menghapus</p>
                </div>
            </div>
        `,
        width: 700,
        confirmButtonText: 'Mengerti',
        confirmButtonColor: '#10b981'
    });
}

// ==================== EXPORT FUNCTIONS ====================

function exportToExcel() {
    const filteredTransactions = filterTransactions();
    
    if (filteredTransactions.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Tidak Ada Data',
            text: 'Tidak ada data untuk diexport!',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        const excelData = filteredTransactions.map(transaction => ({
            'Tanggal': formatDate(transaction.date),
            'Jenis': transaction.type === 'kas' ? 'Kas Masuk' : 'Pengeluaran',
            'Jumlah': parseInt(transaction.amount),
            'Keterangan': transaction.type === 'kas' ? 
                `${transaction.childName} - ${transaction.note}` : 
                transaction.note,
            'Bulan': transaction.month,
            'Tahun': transaction.year,
            'Kategori': transaction.category || '-'
        }));
        
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data Kas');
        
        const fileName = `buku_kas_${currentFilter.month}_${currentFilter.year}_${new Date().getTime()}.xlsx`;
        XLSX.writeFile(wb, fileName);
        hideLoading();
        
        Swal.fire({
            icon: 'success',
            title: 'Export Berhasil!',
            text: `Data berhasil diexport ke ${fileName}`,
            confirmButtonColor: '#10b981',
            timer: 2000
        });
    }, 1000);
}

function exportToPDF() {
    const filteredTransactions = filterTransactions();
    
    if (filteredTransactions.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Tidak Ada Data',
            text: 'Tidak ada data untuk diexport!',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('LAPORAN BUKU KAS', 105, 15, { align: 'center' });
        
        doc.setFontSize(10);
        let filterInfo = 'Semua Data';
        if (currentFilter.month !== 'all' && currentFilter.year !== 'all') {
            filterInfo = `Bulan: ${currentFilter.month} ${currentFilter.year}`;
        } else if (currentFilter.month !== 'all') {
            filterInfo = `Bulan: ${currentFilter.month} (Semua Tahun)`;
        } else if (currentFilter.year !== 'all') {
            filterInfo = `Tahun: ${currentFilter.year} (Semua Bulan)`;
        }
        doc.text(filterInfo, 105, 22, { align: 'center' });
        doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 105, 28, { align: 'center' });
        
        const tableData = filteredTransactions.map(transaction => [
            formatDate(transaction.date),
            transaction.type === 'kas' ? 'Kas Masuk' : 'Pengeluaran',
            formatRupiah(parseInt(transaction.amount)),
            transaction.type === 'kas' ? 
                `${transaction.childName} - ${transaction.note}` : 
                transaction.note
        ]);
        
        doc.autoTable({
            head: [['Tanggal', 'Jenis', 'Jumlah', 'Keterangan']],
            body: tableData,
            startY: 35,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [59, 130, 246] }
        });
        
        const totalKas = filteredTransactions
            .filter(t => t.type === 'kas')
            .reduce((sum, t) => sum + parseInt(t.amount), 0);
        
        const totalPengeluaran = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseInt(t.amount), 0);
        
        const saldo = totalKas - totalPengeluaran;
        
        const finalY = doc.lastAutoTable.finalY + 10;
        
        doc.setFontSize(10);
        doc.text(`Total Kas Masuk: ${formatRupiah(totalKas)}`, 14, finalY);
        doc.text(`Total Pengeluaran: ${formatRupiah(totalPengeluaran)}`, 14, finalY + 6);
        doc.text(`Saldo: ${formatRupiah(saldo)}`, 14, finalY + 12);
        
        const fileName = `buku_kas_${currentFilter.month}_${currentFilter.year}_${new Date().getTime()}.pdf`;
        doc.save(fileName);
        hideLoading();
        
        Swal.fire({
            icon: 'success',
            title: 'Export Berhasil!',
            text: `Data berhasil diexport ke ${fileName}`,
            confirmButtonColor: '#10b981',
            timer: 2000
        });
    }, 1000);
}

function exportToWord() {
    const filteredTransactions = filterTransactions();
    
    if (filteredTransactions.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Tidak Ada Data',
            text: 'Tidak ada data untuk diexport!',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        let wordContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" 
                  xmlns:w="urn:schemas-microsoft-com:office:word" 
                  xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <title>Laporan Buku Kas</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { text-align: center; color: #2c3e50; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background-color: #3b82f6; color: white; padding: 8px; text-align: left; }
                    td { padding: 8px; border: 1px solid #ddd; }
                    .total { font-weight: bold; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1>LAPORAN BUKU KAS</h1>
        `;
        
        let filterInfo = 'Semua Data';
        if (currentFilter.month !== 'all' && currentFilter.year !== 'all') {
            filterInfo = `Bulan: ${currentFilter.month} ${currentFilter.year}`;
        } else if (currentFilter.month !== 'all') {
            filterInfo = `Bulan: ${currentFilter.month} (Semua Tahun)`;
        } else if (currentFilter.year !== 'all') {
            filterInfo = `Tahun: ${currentFilter.year} (Semua Bulan)`;
        }
        
        wordContent += `<p><strong>${filterInfo}</strong></p>`;
        wordContent += `<p>Tanggal Export: ${new Date().toLocaleDateString('id-ID')}</p>`;
        
        wordContent += `
            <table>
                <tr>
                    <th>Tanggal</th>
                    <th>Jenis</th>
                    <th>Jumlah</th>
                    <th>Keterangan</th>
                </tr>
        `;
        
        filteredTransactions.forEach(transaction => {
            wordContent += `
                <tr>
                    <td>${formatDate(transaction.date)}</td>
                    <td>${transaction.type === 'kas' ? 'Kas Masuk' : 'Pengeluaran'}</td>
                    <td>${formatRupiah(parseInt(transaction.amount))}</td>
                    <td>${transaction.type === 'kas' ? 
                        `${transaction.childName} - ${transaction.note}` : 
                        transaction.note}</td>
                </tr>
            `;
        });
        
        wordContent += `</table>`;
        
        const totalKas = filteredTransactions
            .filter(t => t.type === 'kas')
            .reduce((sum, t) => sum + parseInt(t.amount), 0);
        
        const totalPengeluaran = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseInt(t.amount), 0);
        
        const saldo = totalKas - totalPengeluaran;
        
        wordContent += `
            <div class="total">
                <p>Total Kas Masuk: ${formatRupiah(totalKas)}</p>
                <p>Total Pengeluaran: ${formatRupiah(totalPengeluaran)}</p>
                <p>Saldo: ${formatRupiah(saldo)}</p>
            </div>
        `;
        
        wordContent += `</body></html>`;
        
        const blob = new Blob([wordContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `buku_kas_${currentFilter.month}_${currentFilter.year}_${new Date().getTime()}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        hideLoading();
        
        Swal.fire({
            icon: 'success',
            title: 'Export Berhasil!',
            text: 'Data berhasil diexport ke format Word',
            confirmButtonColor: '#10b981',
            timer: 2000
        });
    }, 1000);
}

function sendToWhatsApp() {
    const filteredTransactions = filterTransactions();
    
    if (filteredTransactions.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Tidak Ada Data',
            text: 'Tidak ada data untuk dikirim!',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    let message = `*LAPORAN BUKU KAS*\n\n`;
    
    let filterInfo = 'Semua Data';
    if (currentFilter.month !== 'all' && currentFilter.year !== 'all') {
        filterInfo = `Bulan: ${currentFilter.month} ${currentFilter.year}`;
    } else if (currentFilter.month !== 'all') {
        filterInfo = `Bulan: ${currentFilter.month} (Semua Tahun)`;
    } else if (currentFilter.year !== 'all') {
        filterInfo = `Tahun: ${currentFilter.year} (Semua Bulan)`;
    }
    
    message += `${filterInfo}\n`;
    message += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n\n`;
    message += `*Daftar Transaksi:*\n`;
    
    filteredTransactions.slice(0, 20).forEach((transaction, index) => {
        message += `\n${index + 1}. ${formatDate(transaction.date)}\n`;
        message += `   💰 ${transaction.type === 'kas' ? 'Kas Masuk' : 'Pengeluaran'}: ${formatRupiah(parseInt(transaction.amount))}\n`;
        message += `   📝 ${transaction.type === 'kas' ? 
            `${transaction.childName} - ${transaction.note}` : 
            transaction.note}\n`;
    });
    
    if (filteredTransactions.length > 20) {
        message += `\n... dan ${filteredTransactions.length - 20} transaksi lainnya\n`;
    }
    
    const totalKas = filteredTransactions
        .filter(t => t.type === 'kas')
        .reduce((sum, t) => sum + parseInt(t.amount), 0);
    
    const totalPengeluaran = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseInt(t.amount), 0);
    
    const saldo = totalKas - totalPengeluaran;
    
    message += `\n*Ringkasan:*\n`;
    message += `✅ Total Kas Masuk: ${formatRupiah(totalKas)}\n`;
    message += `💸 Total Pengeluaran: ${formatRupiah(totalPengeluaran)}\n`;
    message += `💰 Saldo: ${formatRupiah(saldo)}\n`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pesan telah disiapkan untuk WhatsApp',
        confirmButtonColor: '#10b981',
        timer: 2000
    });
}

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
    // Form tambah anak
    childForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const childName = childNameInput.value.trim();
        const childClass = childClassInput.value.trim();
        
        if (!childName) {
            Swal.fire({
                icon: 'error',
                title: 'Nama Kosong',
                text: 'Nama anak harus diisi!',
                confirmButtonColor: '#ef4444'
            });
            return;
        }
        
        if (children.some(child => child.name.toLowerCase() === childName.toLowerCase())) {
            Swal.fire({
                icon: 'warning',
                title: 'Nama Sudah Ada',
                text: 'Nama anak sudah terdaftar!',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }
        
        const newChild = {
            id: Date.now().toString(),
            name: childName,
            class: childClass || null,
            joinedDate: new Date().toISOString()
        };
        
        children.push(newChild);
        saveData();
        displayChildren();
        childForm.reset();
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            html: `Anak <b>${childName}</b> berhasil ditambahkan!`,
            confirmButtonColor: '#10b981',
            timer: 2000
        });
    });
    
    // Form edit anak
    editChildForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const childId = editChildId.value;
        const childName = editChildName.value.trim();
        const childClass = editChildClass.value.trim();
        
        const childIndex = children.findIndex(c => c.id === childId);
        if (childIndex !== -1) {
            children[childIndex].name = childName;
            children[childIndex].class = childClass || null;
            
            // Update transaksi yang terkait
            transactions.forEach(t => {
                if (t.childId === childId) {
                    t.childName = childName;
                }
            });
            
            saveData();
            displayAllData();
            closeEditChildModal();
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data anak berhasil diperbarui.',
                confirmButtonColor: '#10b981',
                timer: 1500
            });
        }
    });
    
    // Form pengeluaran
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = expenseAmount.value;
        const date = expenseDate.value;
        const category = expenseCategory.value;
        const note = expenseNote.value.trim();
        
        if (!amount || amount <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Jumlah Invalid',
                text: 'Jumlah pengeluaran harus lebih dari 0!',
                confirmButtonColor: '#ef4444'
            });
            return;
        }
        
        if (!note) {
            Swal.fire({
                icon: 'error',
                title: 'Keterangan Kosong',
                text: 'Keterangan pengeluaran harus diisi!',
                confirmButtonColor: '#ef4444'
            });
            return;
        }
        
        const expenseMonth = getMonthFromDate(date);
        const expenseYear = getYearFromDate(date);
        
        transactions.push({
            id: Date.now().toString(),
            type: 'expense',
            amount: parseInt(amount),
            date: date,
            category: category,
            note: note,
            month: expenseMonth,
            year: expenseYear
        });
        
        saveData();
        displayAllData();
        expenseForm.reset();
        setExpenseDateToToday();
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            html: `Pengeluaran <b>${formatRupiah(amount)}</b> berhasil dicatat!`,
            confirmButtonColor: '#10b981',
            timer: 2000
        });
    });
    
    // Form edit transaksi
    editTransactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const transactionId = editTransactionId.value;
        const type = editTransactionType.value;
        const amount = editTransactionAmount.value;
        const date = editTransactionDate.value;
        const note = editTransactionNote.value.trim();
        
        const transactionIndex = transactions.findIndex(t => t.id === transactionId);
        if (transactionIndex !== -1) {
            transactions[transactionIndex].type = type;
            transactions[transactionIndex].amount = parseInt(amount);
            transactions[transactionIndex].date = date;
            transactions[transactionIndex].note = note;
            transactions[transactionIndex].month = getMonthFromDate(date);
            transactions[transactionIndex].year = getYearFromDate(date);
            
            saveData();
            displayAllData();
            closeEditTransactionModal();
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Transaksi berhasil diperbarui.',
                confirmButtonColor: '#10b981',
                timer: 1500
            });
        }
    });
    
    // Form settings
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        settings.kasAmount = parseInt(kasAmountSetting.value);
        settings.theme = themeSetting.value;
        settings.backupAuto = backupAuto.checked;
        settings.notifications = notifications.checked;
        
        saveData();
        updateKasDisplay();
        applyTheme(settings.theme);
        closeSettingsModal();
        
        Swal.fire({
            icon: 'success',
            title: 'Pengaturan Disimpan!',
            text: 'Perubahan pengaturan berhasil disimpan.',
            confirmButtonColor: '#10b981',
            timer: 1500
        });
    });
    
    // Pencarian
    searchInput.addEventListener('input', function(e) {
        currentFilter.search = e.target.value;
        displayAllData();
    });
    
    // Filter
    applyFilterBtn.addEventListener('click', applyFilter);
    resetFilterBtn.addEventListener('click', resetFilter);
    
    // Sort
    sortByElement.addEventListener('change', function(e) {
        currentFilter.sortBy = e.target.value;
        displayAllData();
    });
    
    // Export
    exportExcelBtn.addEventListener('click', exportToExcel);
    exportPDFBtn.addEventListener('click', exportToPDF);
    exportWordBtn.addEventListener('click', exportToWord);
    sendWABtn.addEventListener('click', sendToWhatsApp);
    
    // Settings
    settingsBtn.addEventListener('click', openSettingsModal);
    
    // Hapus data
    clearAllBtn.addEventListener('click', clearAllTransactions);
    
    // Bayar kas semua
    payAllKasBtn.addEventListener('click', payAllKas);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F1') {
            e.preventDefault();
            showTutorial();
        }
        
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            backupData();
        }
    });
    
    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target === editChildModal) {
            closeEditChildModal();
        }
        if (e.target === editTransactionModal) {
            closeEditTransactionModal();
        }
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });
}

// ==================== UTILITY FUNCTIONS ====================

function applyFilter() {
    currentFilter.month = filterMonthElement.value;
    currentFilter.year = filterYearElement.value === 'all' ? 'all' : parseInt(filterYearElement.value);
    displayAllData();
    
    const filterText = currentFilter.month === 'all' && currentFilter.year === 'all' 
        ? 'Semua Data' 
        : `${currentFilter.month !== 'all' ? currentFilter.month : 'Semua Bulan'} ${currentFilter.year !== 'all' ? currentFilter.year : 'Semua Tahun'}`;
    
    Swal.fire({
        icon: 'success',
        title: 'Filter Diterapkan',
        text: `Menampilkan: ${filterText}`,
        confirmButtonColor: '#10b981',
        timer: 1500
    });
}

function resetFilter() {
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long' });
    const currentYear = now.getFullYear();
    
    filterMonthElement.value = currentMonth;
    filterYearElement.value = currentYear;
    sortByElement.value = 'date-desc';
    searchInput.value = '';
    
    currentFilter.month = currentMonth;
    currentFilter.year = currentYear;
    currentFilter.search = '';
    currentFilter.sortBy = 'date-desc';
    
    displayAllData();
    
    Swal.fire({
        icon: 'info',
        title: 'Filter Direset',
        text: 'Menampilkan data bulan dan tahun berjalan',
        confirmButtonColor: '#3b82f6',
        timer: 1500
    });
}

function displayAllData() {
    displayChildren();
    displayMonthlyData();
    displayTransactions();
    calculateTotals();
    updateCharts();
}

function viewMonthDetail(month, year) {
    let monthKas = transactions.filter(t => t.type === 'kas' && t.month === month);
    
    if (year !== 'all') {
        monthKas = monthKas.filter(t => t.year === year);
    }
    
    const paidChildren = [...new Set(monthKas.map(t => t.childName))];
    const unpaidChildren = children.filter(child => 
        !paidChildren.includes(child.name)
    ).map(child => child.name);
    
    const totalAmount = monthKas.reduce((sum, t) => sum + parseInt(t.amount), 0);
    const yearText = year === 'all' ? 'Semua Tahun' : year;
    
    let detailHtml = `<div class="text-left">
        <p class="mb-2"><strong>Bulan:</strong> ${month} ${yearText}</p>
        <p class="mb-2"><strong>Total Kas:</strong> ${formatRupiah(totalAmount)}</p>
        <p class="mb-2"><strong>Jumlah Anak:</strong> ${paidChildren.length}/${children.length}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <p class="mb-2 font-medium text-green-700">Sudah Bayar (${paidChildren.length}):</p>
                <ul class="list-disc pl-5 mb-3 max-h-40 overflow-y-auto">`;
    
    paidChildren.forEach(child => {
        detailHtml += `<li>${child}</li>`;
    });
    
    detailHtml += `</ul></div>`;
    
    if (unpaidChildren.length > 0) {
        detailHtml += `
            <div>
                <p class="mb-2 font-medium text-red-700">Belum Bayar (${unpaidChildren.length}):</p>
                <ul class="list-disc pl-5 mb-3 max-h-40 overflow-y-auto">`;
        
        unpaidChildren.forEach(child => {
            detailHtml += `<li>${child}</li>`;
        });
        
        detailHtml += `</ul></div>`;
    }
    
    detailHtml += `</div></div>`;
    
    Swal.fire({
        title: `Detail Kas ${month} ${yearText}`,
        html: detailHtml,
        icon: 'info',
        confirmButtonColor: '#3b82f6',
        width: '600px'
    });
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', initializeApp);