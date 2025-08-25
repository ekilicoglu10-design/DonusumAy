// Customer Representative Dashboard JavaScript

// Authentication Check
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('customer_rep_logged_in');
    const userRole = localStorage.getItem('user_role');
    
    if (!isLoggedIn || isLoggedIn !== 'true' || userRole !== 'customer_representative') {
        // Oturum yoksa giriş sayfasına yönlendir
        window.location.href = 'customer-representative-auth.html';
        return;
    }
    
    // Kullanıcı bilgilerini yükle
    loadUserInfo();
}

function loadUserInfo() {
    const userName = localStorage.getItem('user_name');
    const userDepartment = localStorage.getItem('user_department');
    const userLevel = localStorage.getItem('user_level');
    
    // Header'da kullanıcı bilgilerini göster
    const userNameElement = document.querySelector('.user-name');
    const userDepartmentElement = document.querySelector('.user-department');
    
    if (userNameElement) userNameElement.textContent = userName || 'Müşteri Temsilcisi';
    if (userDepartmentElement) userDepartmentElement.textContent = userDepartment || 'Müşteri Hizmetleri';
}

function logout() {
    // Oturum bilgilerini temizle
    localStorage.removeItem('customer_rep_logged_in');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_department');
    localStorage.removeItem('user_level');
    localStorage.removeItem('user_permissions');
    localStorage.removeItem('customer_rep_remember');
    
    // Giriş sayfasına yönlendir
    window.location.href = 'customer-representative-auth.html';
}

// Global Variables
let currentTicket = null;
let allTickets = [];
let filteredTickets = [];
let currentFilter = 'all';
let messageHistory = {};
let typingTimeout = null;

// Sample Data - In real application, this would come from a backend
const sampleTickets = [
    {
        id: 1,
        user: {
            name: 'Ali Veli',
            email: 'ali.veli@email.com',
            type: 'customer',
            avatar: 'AV',
            online: true,
            lastSeen: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
        },
        subject: 'İlan Yayınlama Sorunu',
        category: 'technical',
        priority: 'high',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        lastMessage: 'İlanımı yayınlayamıyorum, sürekli hata alıyorum.',
        unreadCount: 2,
        assignedTo: 'Mehmet Temsilci',
        tags: ['ilan', 'teknik', 'acil']
    },
    {
        id: 2,
        user: {
            name: 'Ayşe Yılmaz',
            email: 'ayse.yilmaz@email.com',
            type: 'contractor',
            avatar: 'AY',
            online: false,
            lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        },
        subject: 'Teklif Gönderememe',
        category: 'functional',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        lastMessage: 'Projelere teklif göndermeye çalışıyorum ama buton çalışmıyor.',
        unreadCount: 1,
        assignedTo: null,
        tags: ['teklif', 'müteahhit']
    },
    {
        id: 3,
        user: {
            name: 'Mehmet Kaya',
            email: 'mehmet.kaya@email.com',
            type: 'architect',
            avatar: 'MK',
            online: true,
            lastSeen: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        },
        subject: 'Çizim Yükleme Hatası',
        category: 'technical',
        priority: 'low',
        status: 'resolved',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        lastMessage: 'Teşekkürler, sorun çözüldü.',
        unreadCount: 0,
        assignedTo: 'Mehmet Temsilci',
        tags: ['çizim', 'mimar', 'çözüldü']
    },
    {
        id: 4,
        user: {
            name: 'Fatma Demir',
            email: 'fatma.demir@email.com',
            type: 'notary',
            avatar: 'FD',
            online: true,
            lastSeen: new Date(Date.now() - 1 * 60 * 1000) // 1 minute ago
        },
        subject: 'Belge Onaylama Süreci',
        category: 'process',
        priority: 'medium',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        lastMessage: 'Belgeleri nasıl onaylayacağım konusunda yardıma ihtiyacım var.',
        unreadCount: 3,
        assignedTo: 'Mehmet Temsilci',
        tags: ['belge', 'noter', 'süreç']
    },
    {
        id: 5,
        user: {
            name: 'Can Özkan',
            email: 'can.ozkan@email.com',
            type: 'customer',
            avatar: 'CO',
            online: false,
            lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        subject: 'Hesap Güvenliği',
        category: 'security',
        priority: 'high',
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        lastMessage: 'Hesabımda şüpheli aktivite gözlemliyorum.',
        unreadCount: 1,
        assignedTo: null,
        tags: ['güvenlik', 'hesap']
    }
];

// Sample message history
const sampleMessages = {
    1: [
        {
            id: 1,
            sender: 'user',
            message: 'Merhaba, ilanımı yayınlamaya çalışıyorum ama sürekli hata alıyorum.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true
        },
        {
            id: 2,
            sender: 'support',
            message: 'Merhaba Ali Bey, sorununuzu anlıyorum. Hangi aşamada hata alıyorsunuz?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
            read: true
        },
        {
            id: 3,
            sender: 'user',
            message: 'İlan bilgilerini doldurduktan sonra "Yayınla" butonuna bastığımda sayfa yenileniyor ama ilan yayınlanmıyor.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
            read: true
        },
        {
            id: 4,
            sender: 'support',
            message: 'Bu durumu kontrol ediyorum. Tarayıcınızın konsolunda herhangi bir hata mesajı görüyor musunuz? F12 tuşuna basarak kontrol edebilirsiniz.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
            read: true
        },
        {
            id: 5,
            sender: 'user',
            message: 'Evet, "Network Error" yazıyor.',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            read: false
        }
    ],
    2: [
        {
            id: 1,
            sender: 'user',
            message: 'Projelere teklif göndermeye çalışıyorum ama teklif gönder butonu çalışmıyor.',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            read: false
        }
    ],
    3: [
        {
            id: 1,
            sender: 'user',
            message: 'Çizim dosyalarımı yüklemeye çalışıyorum ama hata alıyorum.',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            read: true
        },
        {
            id: 2,
            sender: 'support',
            message: 'Hangi format dosya yüklemeye çalışıyorsunuz?',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000 + 5 * 60 * 1000),
            read: true
        },
        {
            id: 3,
            sender: 'user',
            message: 'AutoCAD DWG dosyası.',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000 + 10 * 60 * 1000),
            read: true
        },
        {
            id: 4,
            sender: 'support',
            message: 'DWG dosyaları için önce PDF formatına çevirmeniz gerekiyor. Size rehber gönderiyorum.',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000 + 15 * 60 * 1000),
            read: true
        },
        {
            id: 5,
            sender: 'user',
            message: 'Teşekkürler, sorun çözüldü.',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            read: true
        }
    ],
    4: [
        {
            id: 1,
            sender: 'user',
            message: 'Belgeleri nasıl onaylayacağım konusunda yardıma ihtiyacım var.',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            read: false
        },
        {
            id: 2,
            sender: 'user',
            message: 'Acil bir durumum var, lütfen yardım edin.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            read: false
        },
        {
            id: 3,
            sender: 'user',
            message: 'Hala bekliyor, ne zaman cevap alacağım?',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            read: false
        }
    ],
    5: [
        {
            id: 1,
            sender: 'user',
            message: 'Hesabımda şüpheli aktivite gözlemliyorum. Bilinmeyen IP adreslerinden giriş yapıldığını görüyorum.',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            read: false
        }
    ]
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    allTickets = [...sampleTickets];
    filteredTickets = [...allTickets];
    messageHistory = {...sampleMessages};
    
    updateTicketCounts();
    renderTicketsList();
    
    // Select first ticket by default
    if (filteredTickets.length > 0) {
        selectTicket(filteredTickets[0].id);
    }
    
    // Start real-time updates simulation
    startRealTimeUpdates();
}

function updateTicketCounts() {
    const pending = allTickets.filter(t => t.status === 'pending').length;
    const inProgress = allTickets.filter(t => t.status === 'in-progress').length;
    const resolved = allTickets.filter(t => t.status === 'resolved').length;
    const total = allTickets.length;
    
    document.getElementById('totalTickets').textContent = total;
    document.getElementById('pendingTickets').textContent = pending;
    document.getElementById('inProgressTickets').textContent = inProgress;
    document.getElementById('resolvedTickets').textContent = resolved;
    document.getElementById('displayedTicketsCount').textContent = filteredTickets.length;
    
    // Update online users (simulate)
    const onlineCount = allTickets.filter(t => t.user.online).length;
    document.getElementById('onlineUsers').textContent = onlineCount;
}

function renderTicketsList() {
    const ticketsList = document.getElementById('ticketsList');
    ticketsList.innerHTML = '';
    
    filteredTickets.forEach(ticket => {
        const ticketCard = createTicketCard(ticket);
        ticketsList.appendChild(ticketCard);
    });
}

function createTicketCard(ticket) {
    const div = document.createElement('div');
    div.className = `ticket-card p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer priority-${ticket.priority}`;
    div.onclick = () => selectTicket(ticket.id);
    
    const timeAgo = getTimeAgo(ticket.createdAt);
    const lastSeenText = ticket.user.online ? 'Çevrimiçi' : `Son görülme: ${getTimeAgo(ticket.user.lastSeen)}`;
    
    div.innerHTML = `
        <div class="flex items-start justify-between mb-2">
            <div class="flex items-center space-x-2">
                <div class="user-avatar user-${ticket.user.type} relative text-xs">
                    ${ticket.user.avatar}
                    ${ticket.user.online ? '<div class="online-indicator"></div>' : ''}
                </div>
                <div>
                    <h4 class="font-medium text-sm text-gray-800">${ticket.user.name}</h4>
                    <p class="text-xs text-gray-500">${lastSeenText}</p>
                </div>
            </div>
            ${ticket.unreadCount > 0 ? `<span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">${ticket.unreadCount}</span>` : ''}
        </div>
        
        <h3 class="font-medium text-gray-800 mb-1 text-sm">${ticket.subject}</h3>
        <p class="text-gray-600 text-xs mb-3 line-clamp-2">${ticket.lastMessage}</p>
        
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <span class="status-badge status-${ticket.status}">
                    ${getStatusText(ticket.status)}
                </span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    ${getPriorityText(ticket.priority)}
                </span>
            </div>
            <span class="text-xs text-gray-400">${timeAgo}</span>
        </div>
        
        ${ticket.assignedTo ? `
            <div class="mt-2 text-xs text-gray-500">
                <i class="fas fa-user mr-1"></i>
                ${ticket.assignedTo}
            </div>
        ` : ''}
    `;
    
    return div;
}

function selectTicket(ticketId) {
    currentTicket = allTickets.find(t => t.id === ticketId);
    
    if (!currentTicket) return;
    
    // Update visual selection
    document.querySelectorAll('.ticket-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    event.currentTarget?.classList.add('selected');
    
    // Update chat header
    updateChatHeader();
    
    // Load messages
    loadMessages(ticketId);
    
    // Mark messages as read
    markMessagesAsRead(ticketId);
}

function updateChatHeader() {
    const chatHeader = document.getElementById('chatHeader');
    const lastSeenText = currentTicket.user.online ? 'Çevrimiçi' : `Son görülme: ${getTimeAgo(currentTicket.user.lastSeen)}`;
    
    chatHeader.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <div class="user-avatar user-${currentTicket.user.type} relative">
                    ${currentTicket.user.avatar}
                    ${currentTicket.user.online ? '<div class="online-indicator"></div>' : ''}
                </div>
                <div>
                    <h3 class="font-medium text-gray-800">${currentTicket.user.name}</h3>
                    <p class="text-sm text-gray-500">${getUserTypeText(currentTicket.user.type)} • ${lastSeenText}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <select class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary" 
                        id="ticketStatus" onchange="updateTicketStatus()">
                    <option value="pending" ${currentTicket.status === 'pending' ? 'selected' : ''}>Bekliyor</option>
                    <option value="in-progress" ${currentTicket.status === 'in-progress' ? 'selected' : ''}>İşlemde</option>
                    <option value="resolved" ${currentTicket.status === 'resolved' ? 'selected' : ''}>Çözümlendi</option>
                    <option value="closed" ${currentTicket.status === 'closed' ? 'selected' : ''}>Kapatıldı</option>
                </select>
                <button onclick="assignTicket()" class="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200">
                    <i class="fas fa-user-plus mr-1"></i>
                    Ata
                </button>
                <button onclick="escalateTicket()" class="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200">
                    <i class="fas fa-exclamation-triangle mr-1"></i>
                    Yükselt
                </button>
            </div>
        </div>
    `;
}

function loadMessages(ticketId) {
    const chatMessages = document.getElementById('chatMessages');
    const messages = messageHistory[ticketId] || [];
    
    chatMessages.innerHTML = '';
    
    messages.forEach(message => {
        const messageDiv = createMessageElement(message);
        chatMessages.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'} mb-4`;
    
    const timeStr = formatTime(message.timestamp);
    
    div.innerHTML = `
        <div class="message-bubble ${message.sender === 'support' ? 'message-sent' : 'message-received'}">
            <p class="text-sm">${message.message}</p>
            <p class="text-xs mt-1 opacity-70">${timeStr}</p>
        </div>
    `;
    
    return div;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || !currentTicket) return;
    
    // Add message to history
    if (!messageHistory[currentTicket.id]) {
        messageHistory[currentTicket.id] = [];
    }
    
    const newMessage = {
        id: Date.now(),
        sender: 'support',
        message: message,
        timestamp: new Date(),
        read: true
    };
    
    messageHistory[currentTicket.id].push(newMessage);
    
    // Update UI
    const messageElement = createMessageElement(newMessage);
    document.getElementById('chatMessages').appendChild(messageElement);
    
    // Clear input
    messageInput.value = '';
    
    // Update ticket last message
    currentTicket.lastMessage = message;
    
    // Scroll to bottom
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Refresh tickets list
    renderTicketsList();
    
    // Show typing indicator for user response (simulate)
    simulateUserResponse();
    
    showNotification('Mesaj gönderildi', 'success');
}

function simulateUserResponse() {
    // Show typing indicator
    setTimeout(() => {
        showTypingIndicator();
    }, 2000);
    
    // Send automated response
    setTimeout(() => {
        hideTypingIndicator();
        
        const responses = [
            'Teşekkürler, anlıyorum.',
            'Evet, deneyeceğim.',
            'Bu çözüm işe yaradı, teşekkürler!',
            'Hala aynı sorunu yaşıyorum.',
            'Başka bir yöntem var mı?'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const newMessage = {
            id: Date.now(),
            sender: 'user',
            message: randomResponse,
            timestamp: new Date(),
            read: true
        };
        
        messageHistory[currentTicket.id].push(newMessage);
        
        const messageElement = createMessageElement(newMessage);
        document.getElementById('chatMessages').appendChild(messageElement);
        
        // Update ticket
        currentTicket.lastMessage = randomResponse;
        
        // Scroll to bottom
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        renderTicketsList();
    }, 5000);
}

function showTypingIndicator() {
    document.getElementById('typingIndicator').classList.remove('hidden');
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').classList.add('hidden');
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function insertQuickResponse(response) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = response;
    messageInput.focus();
}

function filterTickets(status) {
    currentFilter = status;
    
    if (status === 'all') {
        filteredTickets = [...allTickets];
    } else {
        filteredTickets = allTickets.filter(ticket => ticket.status === status);
    }
    
    updateTicketCounts();
    renderTicketsList();
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        item.classList.add('text-gray-600');
    });
    
    if (status === 'all') {
        document.querySelector('.sidebar-item').classList.add('active');
        document.querySelector('.sidebar-item').classList.remove('text-gray-600');
    }
}

function searchTickets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        if (currentFilter === 'all') {
            filteredTickets = [...allTickets];
        } else {
            filteredTickets = allTickets.filter(ticket => ticket.status === currentFilter);
        }
    } else {
        let baseTickets = currentFilter === 'all' ? allTickets : allTickets.filter(ticket => ticket.status === currentFilter);
        
        filteredTickets = baseTickets.filter(ticket => 
            ticket.subject.toLowerCase().includes(searchTerm) ||
            ticket.user.name.toLowerCase().includes(searchTerm) ||
            ticket.lastMessage.toLowerCase().includes(searchTerm) ||
            ticket.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    updateTicketCounts();
    renderTicketsList();
}

function updateTicketStatus() {
    const newStatus = document.getElementById('ticketStatus').value;
    
    if (!currentTicket) return;
    
    currentTicket.status = newStatus;
    
    // Update ticket in allTickets array
    const ticketIndex = allTickets.findIndex(t => t.id === currentTicket.id);
    if (ticketIndex !== -1) {
        allTickets[ticketIndex].status = newStatus;
    }
    
    updateTicketCounts();
    renderTicketsList();
    
    showNotification(`Destek talebi durumu "${getStatusText(newStatus)}" olarak güncellendi`, 'success');
}

function assignTicket() {
    if (!currentTicket) return;
    
    const assignee = prompt('Destek talebini kime atamak istiyorsunuz?', 'Mehmet Temsilci');
    
    if (assignee) {
        currentTicket.assignedTo = assignee;
        
        // Update in allTickets
        const ticketIndex = allTickets.findIndex(t => t.id === currentTicket.id);
        if (ticketIndex !== -1) {
            allTickets[ticketIndex].assignedTo = assignee;
        }
        
        renderTicketsList();
        showNotification(`Destek talebi ${assignee}'ye atandı`, 'success');
    }
}

function escalateTicket() {
    if (!currentTicket) return;
    
    if (confirm('Bu destek talebini üst seviyeye yükseltmek istediğinizden emin misiniz?')) {
        currentTicket.priority = 'high';
        
        // Update in allTickets
        const ticketIndex = allTickets.findIndex(t => t.id === currentTicket.id);
        if (ticketIndex !== -1) {
            allTickets[ticketIndex].priority = 'high';
        }
        
        renderTicketsList();
        showNotification('Destek talebi yükseltildi', 'warning');
    }
}

function markMessagesAsRead(ticketId) {
    const ticket = allTickets.find(t => t.id === ticketId);
    if (ticket) {
        ticket.unreadCount = 0;
        updateTicketCounts();
        renderTicketsList();
    }
}

function refreshTickets() {
    // Simulate refresh
    showNotification('Destek talepleri güncellendi', 'info');
    
    // Add some random updates
    const randomTicket = allTickets[Math.floor(Math.random() * allTickets.length)];
    randomTicket.user.lastSeen = new Date();
    
    renderTicketsList();
}

function attachFile() {
    // Simulate file attachment
    showNotification('Dosya ekleme özelliği yakında eklenecek', 'info');
}

function showLiveUsers() {
    const modal = document.getElementById('liveUsersModal');
    const usersList = document.getElementById('liveUsersList');
    
    // Get online users
    const onlineUsers = allTickets.filter(t => t.user.online);
    
    usersList.innerHTML = '';
    
    onlineUsers.forEach(ticket => {
        const userDiv = document.createElement('div');
        userDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        
        userDiv.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="user-avatar user-${ticket.user.type} relative">
                    ${ticket.user.avatar}
                    <div class="online-indicator"></div>
                </div>
                <div>
                    <h4 class="font-medium text-gray-800">${ticket.user.name}</h4>
                    <p class="text-sm text-gray-500">${getUserTypeText(ticket.user.type)} • ${ticket.user.email}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="startChatWithUser(${ticket.id})" class="text-sm bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary-dark">
                    <i class="fas fa-comments mr-1"></i>
                    Sohbet
                </button>
            </div>
        `;
        
        usersList.appendChild(userDiv);
    });
    
    modal.classList.remove('hidden');
}

function closeLiveUsersModal() {
    document.getElementById('liveUsersModal').classList.add('hidden');
}

function startChatWithUser(ticketId) {
    closeLiveUsersModal();
    selectTicket(ticketId);
}

function showReports() {
    const modal = document.getElementById('reportsModal');
    const reportsContent = document.getElementById('reportsContent');
    
    // Generate sample reports
    const reports = [
        {
            title: 'Günlük Destek Talepleri',
            value: '24',
            change: '+12%',
            icon: 'fas fa-ticket-alt',
            color: 'blue'
        },
        {
            title: 'Ortalama Yanıt Süresi',
            value: '2.4 dk',
            change: '-8%',
            icon: 'fas fa-clock',
            color: 'green'
        },
        {
            title: 'Çözülme Oranı',
            value: '87%',
            change: '+5%',
            icon: 'fas fa-check-circle',
            color: 'purple'
        },
        {
            title: 'Müşteri Memnuniyeti',
            value: '4.2/5',
            change: '+0.3',
            icon: 'fas fa-star',
            color: 'yellow'
        },
        {
            title: 'Aktif Sohbetler',
            value: '8',
            change: '+2',
            icon: 'fas fa-comments',
            color: 'indigo'
        },
        {
            title: 'Bekleyen Talepler',
            value: '5',
            change: '-3',
            icon: 'fas fa-hourglass-half',
            color: 'red'
        }
    ];
    
    reportsContent.innerHTML = '';
    
    reports.forEach(report => {
        const reportDiv = document.createElement('div');
        reportDiv.className = `bg-${report.color}-50 p-4 rounded-lg border border-${report.color}-200`;
        
        reportDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="p-2 bg-${report.color}-100 rounded-lg">
                    <i class="${report.icon} text-${report.color}-600"></i>
                </div>
                <span class="text-sm font-medium text-${report.color}-600">${report.change}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">${report.value}</h3>
            <p class="text-sm text-gray-600">${report.title}</p>
        `;
        
        reportsContent.appendChild(reportDiv);
    });
    
    modal.classList.remove('hidden');
}

function closeReportsModal() {
    document.getElementById('reportsModal').classList.add('hidden');
}

function openSettings() {
    showNotification('Ayarlar paneli yakında eklenecek', 'info');
}

function logout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        window.location.href = 'auth.html';
    }
}

// Real-time updates simulation
function startRealTimeUpdates() {
    setInterval(() => {
        // Randomly update user online status
        const randomTicket = allTickets[Math.floor(Math.random() * allTickets.length)];
        randomTicket.user.online = Math.random() > 0.5;
        randomTicket.user.lastSeen = new Date();
        
        // Update counts
        updateTicketCounts();
        
        // Update display if this ticket is currently selected
        if (currentTicket && currentTicket.id === randomTicket.id) {
            updateChatHeader();
        }
        
        // Refresh tickets list
        renderTicketsList();
    }, 30000); // Update every 30 seconds
}

// Utility Functions
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Az önce';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    return `${Math.floor(diffInSeconds / 86400)} gün önce`;
}

function formatTime(date) {
    return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function getStatusText(status) {
    const statusTexts = {
        'pending': 'Bekliyor',
        'in-progress': 'İşlemde',
        'resolved': 'Çözümlendi',
        'closed': 'Kapatıldı'
    };
    return statusTexts[status] || status;
}

function getPriorityText(priority) {
    const priorityTexts = {
        'low': 'Düşük',
        'medium': 'Orta',
        'high': 'Yüksek'
    };
    return priorityTexts[priority] || priority;
}

function getUserTypeText(type) {
    const typeTexts = {
        'customer': 'Müşteri',
        'contractor': 'Müteahhit',
        'architect': 'Mimar',
        'notary': 'Noter',
        'admin': 'Admin'
    };
    return typeTexts[type] || type;
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    
    const colors = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'warning': 'bg-yellow-500',
        'info': 'bg-blue-500'
    };
    
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    
    notification.className = `notification ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm`;
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span class="text-sm">${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1">
            <i class="fas fa-times text-xs"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('removing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}
