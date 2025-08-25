// Municipality Dashboard JavaScript

// Authentication Check
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('municipality_logged_in');
    const userRole = localStorage.getItem('user_role');
    
    if (!isLoggedIn || isLoggedIn !== 'true' || userRole !== 'municipality') {
        // Oturum yoksa giriş sayfasına yönlendir
        window.location.href = 'municipality-auth.html';
        return;
    }
    
    // Kullanıcı bilgilerini yükle
    loadUserInfo();
}

function loadUserInfo() {
    const userName = localStorage.getItem('user_name');
    const userMunicipality = localStorage.getItem('user_municipality');
    const userDistrict = localStorage.getItem('user_district');
    
    // Header'da kullanıcı bilgilerini göster
    const userNameElement = document.querySelector('.user-name');
    const userMunicipalityElement = document.querySelector('.user-municipality');
    
    if (userNameElement) userNameElement.textContent = userName || 'Belediye Kullanıcısı';
    if (userMunicipalityElement) userMunicipalityElement.textContent = userMunicipality || 'Belediye';
}

function logout() {
    // Oturum bilgilerini temizle
    localStorage.removeItem('municipality_logged_in');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_municipality');
    localStorage.removeItem('user_district');
    localStorage.removeItem('user_permissions');
    localStorage.removeItem('municipality_remember');
    
    // Giriş sayfasına yönlendir
    window.location.href = 'municipality-auth.html';
}

// Global Variables
let currentSection = 'dashboard';
let allAnnouncements = [];
let allProjects = [];
let filteredAnnouncements = [];
let filteredProjects = [];
let currentProject = null;

// Sample Data - In real application, this would come from a backend
const sampleAnnouncements = [
    {
        id: 1,
        title: 'Kadıköy Merkez Kentsel Dönüşüm Projesi',
        description: 'Kadıköy merkez bölgesinde 150 konutluk kentsel dönüşüm projesi başlatıldı.',
        district: 'kadikoy',
        neighborhood: 'Caferağa',
        type: 'urban-transformation',
        status: 'active',
        priority: 'high',
        createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        applicantCount: 45,
        estimatedCost: '25,000,000',
        supportEligible: true,
        governmentSupport: false
    },
    {
        id: 2,
        title: 'Üsküdar Sahil Yenileme Projesi',
        description: 'Üsküdar sahil şeridinde bina yenileme ve güçlendirme çalışmaları.',
        district: 'uskudar',
        neighborhood: 'Salacak',
        type: 'renovation',
        status: 'active',
        priority: 'medium',
        createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        applicantCount: 28,
        estimatedCost: '18,500,000',
        supportEligible: true,
        governmentSupport: true
    },
    {
        id: 3,
        title: 'Beşiktaş Arsa Geliştirme İhalesi',
        description: 'Beşiktaş bölgesinde boş arsaların değerlendirilmesi için ihale duyurusu.',
        district: 'besiktas',
        neighborhood: 'Ortaköy',
        type: 'development',
        status: 'pending',
        priority: 'low',
        createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        applicantCount: 12,
        estimatedCost: '32,000,000',
        supportEligible: false,
        governmentSupport: false
    },
    {
        id: 4,
        title: 'Kadıköy Riskli Yapı Dönüşümü',
        description: 'Deprem riski taşıyan binaların acil dönüşüm projesi.',
        district: 'kadikoy',
        neighborhood: 'Moda',
        type: 'urban-transformation',
        status: 'active',
        priority: 'high',
        createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        applicantCount: 67,
        estimatedCost: '45,000,000',
        supportEligible: true,
        governmentSupport: true
    },
    {
        id: 5,
        title: 'Üsküdar Mahalle Yenileme',
        description: 'Geleneksel mahalle dokusunun korunarak yenilenmesi projesi.',
        district: 'uskudar',
        neighborhood: 'Kuzguncuk',
        type: 'renovation',
        status: 'completed',
        priority: 'medium',
        createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        applicantCount: 89,
        estimatedCost: '22,000,000',
        supportEligible: false,
        governmentSupport: false
    }
];

const sampleProjects = [
    {
        id: 101,
        title: 'Kadıköy Modern Yaşam Kompleksi',
        description: 'Modern yaşam standartlarında 120 konutluk kentsel dönüşüm projesi.',
        district: 'kadikoy',
        neighborhood: 'Caferağa',
        address: 'Caferağa Mahallesi, Moda Caddesi No:45',
        status: 'planning',
        priority: 'high',
        createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        owner: 'Ali Veli ve Ortakları',
        contractor: 'Mega İnşaat A.Ş.',
        architect: 'Modern Mimarlık Ofisi',
        estimatedCost: '35,000,000',
        landArea: '2,500',
        buildingCount: 2,
        flatCount: 120,
        supportStatus: 'pending-review',
        governmentSupport: false,
        supportReason: '',
        applicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tags: ['kentsel-donusum', 'modern', 'yuksek-oncelik']
    },
    {
        id: 102,
        title: 'Üsküdar Sahil Rezidansı',
        description: 'Boğaz manzaralı lüks konut projesi.',
        district: 'uskudar',
        neighborhood: 'Salacak',
        address: 'Salacak Mahallesi, Sahil Yolu No:12',
        status: 'active',
        priority: 'medium',
        createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        owner: 'Sahil Yapı Kooperatifi',
        contractor: 'Deniz İnşaat Ltd.',
        architect: 'Boğaz Mimarlık',
        estimatedCost: '28,000,000',
        landArea: '1,800',
        buildingCount: 1,
        flatCount: 75,
        supportStatus: 'supported',
        governmentSupport: true,
        supportReason: 'Bölgesel kalkınma programı kapsamında desteklenmektedir.',
        approvalDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        tags: ['sahil', 'lux', 'desteklenen']
    },
    {
        id: 103,
        title: 'Beşiktaş Kültür Merkezi Dönüşümü',
        description: 'Tarihi doku korunarak modern yaşam alanına dönüştürme.',
        district: 'besiktas',
        neighborhood: 'Ortaköy',
        address: 'Ortaköy Mahallesi, Kültür Sokak No:8',
        status: 'construction',
        priority: 'high',
        createdDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        owner: 'Ortaköy Kültür Derneği',
        contractor: 'Kültür İnşaat A.Ş.',
        architect: 'Tarihi Koruma Mimarlık',
        estimatedCost: '42,000,000',
        landArea: '3,200',
        buildingCount: 3,
        flatCount: 95,
        supportStatus: 'supported',
        governmentSupport: true,
        supportReason: 'Kültürel miras koruma projesi olarak desteklenmektedir.',
        approvalDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        tags: ['kultur', 'tarih', 'koruma', 'desteklenen']
    },
    {
        id: 104,
        title: 'Kadıköy Yeşil Dönüşüm',
        description: 'Çevre dostu teknolojilerle sürdürülebilir yaşam projesi.',
        district: 'kadikoy',
        neighborhood: 'Moda',
        address: 'Moda Mahallesi, Yeşil Sokak No:23',
        status: 'planning',
        priority: 'medium',
        createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        owner: 'Yeşil Yaşam Kooperatifi',
        contractor: 'Eko İnşaat Ltd.',
        architect: 'Sürdürülebilir Mimarlık',
        estimatedCost: '31,000,000',
        landArea: '2,100',
        buildingCount: 2,
        flatCount: 85,
        supportStatus: 'pending-review',
        governmentSupport: false,
        supportReason: '',
        applicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['cevre', 'surdurulebilir', 'yesil']
    },
    {
        id: 105,
        title: 'Üsküdar Aile Yaşam Merkezi',
        description: 'Aile odaklı sosyal donatı alanları ile konut projesi.',
        district: 'uskudar',
        neighborhood: 'Kuzguncuk',
        address: 'Kuzguncuk Mahallesi, Aile Caddesi No:67',
        status: 'completed',
        priority: 'low',
        createdDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        owner: 'Kuzguncuk Mahalle Derneği',
        contractor: 'Aile İnşaat A.Ş.',
        architect: 'Sosyal Mimarlık Ofisi',
        estimatedCost: '26,000,000',
        landArea: '1,900',
        buildingCount: 2,
        flatCount: 68,
        supportStatus: 'not-supported',
        governmentSupport: false,
        supportReason: 'Destek kriterleri karşılanmadı.',
        completionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        tags: ['aile', 'sosyal', 'tamamlandi']
    }
];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    allAnnouncements = [...sampleAnnouncements];
    allProjects = [...sampleProjects];
    filteredAnnouncements = [...allAnnouncements];
    filteredProjects = [...allProjects];
    
    updateCounts();
    renderDashboard();
}

function updateCounts() {
    const announcementCount = allAnnouncements.length;
    const projectCount = allProjects.length;
    const supportedCount = allProjects.filter(p => p.governmentSupport).length;
    
    document.getElementById('announcementCount').textContent = announcementCount;
    document.getElementById('projectCount').textContent = projectCount;
    document.getElementById('supportedCount').textContent = supportedCount;
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('[id$="-section"]').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.remove('hidden');
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        item.classList.add('text-gray-600');
    });
    
    // Find and activate the corresponding sidebar item
    document.querySelectorAll('.sidebar-item').forEach(item => {
        if (item.getAttribute('onclick')?.includes(sectionName)) {
            item.classList.add('active');
            item.classList.remove('text-gray-600');
        }
    });
    
    currentSection = sectionName;
    
    // Render section content
    switch(sectionName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'announcements':
            renderAnnouncements();
            break;
        case 'projects':
            renderProjects();
            break;
        case 'support-management':
            renderSupportManagement();
            break;
        case 'districts':
            renderDistricts();
            break;
        case 'reports':
            renderReports();
            break;
        case 'settings':
            // Settings are static, no need to render
            break;
    }
}

function renderDashboard() {
    renderRecentAnnouncements();
    renderPendingSupportProjects();
}

function renderRecentAnnouncements() {
    const container = document.getElementById('recent-announcements');
    const recentAnnouncements = allAnnouncements
        .sort((a, b) => b.createdDate - a.createdDate)
        .slice(0, 3);
    
    container.innerHTML = '';
    
    if (recentAnnouncements.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">Henüz duyuru bulunmamaktadır.</p>';
        return;
    }
    
    recentAnnouncements.forEach(announcement => {
        const announcementDiv = createAnnouncementCard(announcement, true);
        container.appendChild(announcementDiv);
    });
}

function renderPendingSupportProjects() {
    const container = document.getElementById('pending-support-projects');
    const pendingProjects = allProjects.filter(p => p.supportStatus === 'pending-review').slice(0, 3);
    
    container.innerHTML = '';
    
    if (pendingProjects.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">Destek bekleyen proje bulunmamaktadır.</p>';
        return;
    }
    
    pendingProjects.forEach(project => {
        const projectDiv = createSupportProjectCard(project);
        container.appendChild(projectDiv);
    });
}

function renderAnnouncements() {
    const container = document.getElementById('announcements-list');
    container.innerHTML = '';
    
    if (filteredAnnouncements.length === 0) {
        container.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">Filtrelerinize uygun duyuru bulunamadı.</p></div>';
        return;
    }
    
    filteredAnnouncements.forEach(announcement => {
        const announcementDiv = createAnnouncementCard(announcement, false);
        container.appendChild(announcementDiv);
    });
}

function renderProjects() {
    const container = document.getElementById('projects-grid');
    container.innerHTML = '';
    
    if (filteredProjects.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500">Filtrelerinize uygun proje bulunamadı.</p></div>';
        return;
    }
    
    filteredProjects.forEach(project => {
        const projectDiv = createProjectCard(project);
        container.appendChild(projectDiv);
    });
}

function renderSupportManagement() {
    renderPendingReviewProjects();
    renderSupportedProjects();
}

function renderPendingReviewProjects() {
    const container = document.getElementById('pending-review-projects');
    const pendingProjects = allProjects.filter(p => p.supportStatus === 'pending-review');
    
    container.innerHTML = '';
    
    if (pendingProjects.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">İnceleme bekleyen proje bulunmamaktadır.</p>';
        return;
    }
    
    pendingProjects.forEach(project => {
        const projectDiv = createSupportReviewCard(project);
        container.appendChild(projectDiv);
    });
}

function renderSupportedProjects() {
    const container = document.getElementById('supported-projects-list');
    const supportedProjects = allProjects.filter(p => p.governmentSupport);
    
    container.innerHTML = '';
    
    if (supportedProjects.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">Desteklenen proje bulunmamaktadır.</p>';
        return;
    }
    
    supportedProjects.forEach(project => {
        const projectDiv = createSupportedProjectCard(project);
        container.appendChild(projectDiv);
    });
}

function renderDistricts() {
    const container = document.getElementById('district-stats');
    
    const districts = [
        { name: 'Kadıköy', projects: 12, announcements: 8, supported: 5 },
        { name: 'Üsküdar', projects: 9, announcements: 4, supported: 2 },
        { name: 'Beşiktaş', projects: 7, announcements: 3, supported: 1 }
    ];
    
    container.innerHTML = '';
    
    districts.forEach(district => {
        const districtDiv = document.createElement('div');
        districtDiv.className = 'p-4 border border-gray-200 rounded-lg mb-4';
        
        districtDiv.innerHTML = `
            <h4 class="font-semibold text-gray-800 mb-2">${district.name}</h4>
            <div class="grid grid-cols-3 gap-4 text-sm">
                <div class="text-center">
                    <p class="text-2xl font-bold text-purple-600">${district.projects}</p>
                    <p class="text-gray-600">Proje</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-blue-600">${district.announcements}</p>
                    <p class="text-gray-600">Duyuru</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-green-600">${district.supported}</p>
                    <p class="text-gray-600">Desteklenen</p>
                </div>
            </div>
        `;
        
        container.appendChild(districtDiv);
    });
}

function renderReports() {
    const container = document.getElementById('reports-grid');
    
    const reports = [
        {
            title: 'Aylık Proje Raporu',
            description: 'Bu aydaki proje gelişmeleri ve istatistikler',
            icon: 'fas fa-chart-line',
            color: 'blue'
        },
        {
            title: 'Destek Verimlilik Raporu',
            description: 'Desteklenen projelerin başarı oranları',
            icon: 'fas fa-award',
            color: 'green'
        },
        {
            title: 'Bölgesel Analiz',
            description: 'İlçe bazında kentsel dönüşüm analizi',
            icon: 'fas fa-map',
            color: 'purple'
        },
        {
            title: 'Maliyet Analizi',
            description: 'Proje maliyetleri ve bütçe planlaması',
            icon: 'fas fa-calculator',
            color: 'yellow'
        },
        {
            title: 'Zaman Çizelgesi',
            description: 'Proje tamamlanma süreleri analizi',
            icon: 'fas fa-clock',
            color: 'red'
        },
        {
            title: 'Müteahhit Performansı',
            description: 'Müteahhit firmaların performans değerlendirmesi',
            icon: 'fas fa-users',
            color: 'indigo'
        }
    ];
    
    container.innerHTML = '';
    
    reports.forEach(report => {
        const reportDiv = document.createElement('div');
        reportDiv.className = `bg-${report.color}-50 p-6 rounded-xl border border-${report.color}-200 cursor-pointer hover:shadow-md transition-all`;
        
        reportDiv.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-${report.color}-100 rounded-lg">
                    <i class="${report.icon} text-${report.color}-600 text-xl"></i>
                </div>
                <button class="text-${report.color}-600 hover:text-${report.color}-700">
                    <i class="fas fa-download"></i>
                </button>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">${report.title}</h3>
            <p class="text-sm text-gray-600">${report.description}</p>
        `;
        
        reportDiv.onclick = () => generateReport(report.title);
        container.appendChild(reportDiv);
    });
}

// Card Creation Functions
function createAnnouncementCard(announcement, isCompact = false) {
    const div = document.createElement('div');
    const compactClass = isCompact ? 'p-3' : 'p-4';
    div.className = `bg-white border border-gray-200 rounded-lg ${compactClass} hover:shadow-md transition-all cursor-pointer priority-${announcement.priority}`;
    
    const statusText = getStatusText(announcement.status);
    const typeText = getAnnouncementTypeText(announcement.type);
    const timeAgo = getTimeAgo(announcement.createdDate);
    
    div.innerHTML = `
        <div class="flex items-start justify-between mb-2">
            <div class="flex items-center space-x-2">
                <span class="status-badge status-${announcement.status}">${statusText}</span>
                ${announcement.governmentSupport ? '<span class="supported-badge px-2 py-1 rounded-full text-xs">Desteklenen</span>' : ''}
            </div>
            <span class="text-xs text-gray-500">${timeAgo}</span>
        </div>
        
        <h3 class="font-semibold text-gray-800 mb-2 ${isCompact ? 'text-sm' : 'text-base'}">${announcement.title}</h3>
        <p class="text-gray-600 text-sm mb-3 ${isCompact ? 'line-clamp-2' : ''}">${announcement.description}</p>
        
        <div class="flex items-center justify-between text-xs">
            <div class="flex items-center space-x-4">
                <span class="text-gray-500">
                    <i class="fas fa-map-marker-alt mr-1"></i>
                    ${getDistrictText(announcement.district)}
                </span>
                <span class="text-gray-500">
                    <i class="fas fa-users mr-1"></i>
                    ${announcement.applicantCount} başvuru
                </span>
                <span class="text-gray-500">
                    <i class="fas fa-tag mr-1"></i>
                    ${typeText}
                </span>
            </div>
            ${!isCompact ? `<span class="font-medium text-green-600">₺${announcement.estimatedCost}</span>` : ''}
        </div>
    `;
    
    div.onclick = () => viewAnnouncementDetails(announcement);
    
    return div;
}

function createProjectCard(project) {
    const div = document.createElement('div');
    const supportClass = project.governmentSupport ? 'government-support' : 'priority-' + project.priority;
    div.className = `project-card bg-white border border-gray-200 rounded-lg p-4 ${supportClass}`;
    
    const statusText = getProjectStatusText(project.status);
    const timeAgo = getTimeAgo(project.createdDate);
    
    div.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-2">
                <span class="status-badge status-${project.status === 'planning' ? 'pending' : 'active'}">${statusText}</span>
                ${project.governmentSupport ? '<span class="supported-badge px-2 py-1 rounded-full text-xs">Desteklenen</span>' : ''}
            </div>
            <span class="text-xs text-gray-500">${timeAgo}</span>
        </div>
        
        <h3 class="font-semibold text-gray-800 mb-2">${project.title}</h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${project.description}</p>
        
        <div class="space-y-2 mb-4">
            <div class="flex items-center text-xs text-gray-500">
                <i class="fas fa-map-marker-alt mr-2 w-4"></i>
                <span>${getDistrictText(project.district)} - ${project.neighborhood}</span>
            </div>
            <div class="flex items-center text-xs text-gray-500">
                <i class="fas fa-user mr-2 w-4"></i>
                <span>${project.owner}</span>
            </div>
            <div class="flex items-center text-xs text-gray-500">
                <i class="fas fa-building mr-2 w-4"></i>
                <span>${project.flatCount} konut, ${project.landArea}m²</span>
            </div>
        </div>
        
        <div class="flex items-center justify-between">
            <span class="font-medium text-green-600">₺${project.estimatedCost}</span>
            <div class="flex space-x-2">
                ${!project.governmentSupport && project.supportStatus === 'pending-review' ? 
                    `<button onclick="reviewSupport(${project.id})" class="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded hover:bg-yellow-200">İncele</button>` : ''}
                <button onclick="viewProjectDetails(${project.id})" class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">Detay</button>
            </div>
        </div>
    `;
    
    return div;
}

function createSupportProjectCard(project) {
    const div = document.createElement('div');
    div.className = 'p-3 border border-yellow-200 rounded-lg bg-yellow-50 mb-3';
    
    const timeAgo = getTimeAgo(project.applicationDate);
    
    div.innerHTML = `
        <div class="flex items-start justify-between mb-2">
            <h4 class="font-medium text-gray-800 text-sm">${project.title}</h4>
            <span class="text-xs text-gray-500">${timeAgo}</span>
        </div>
        <p class="text-xs text-gray-600 mb-2">${getDistrictText(project.district)} - ${project.neighborhood}</p>
        <div class="flex items-center justify-between">
            <span class="text-xs text-green-600 font-medium">₺${project.estimatedCost}</span>
            <button onclick="reviewSupport(${project.id})" class="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-dark">
                İncele
            </button>
        </div>
    `;
    
    return div;
}

function createSupportReviewCard(project) {
    const div = document.createElement('div');
    div.className = 'p-4 border border-yellow-200 rounded-lg bg-yellow-50 mb-4';
    
    const timeAgo = getTimeAgo(project.applicationDate);
    
    div.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <div>
                <h4 class="font-medium text-gray-800">${project.title}</h4>
                <p class="text-sm text-gray-600">${getDistrictText(project.district)} - ${project.neighborhood}</p>
                <p class="text-xs text-gray-500 mt-1">Başvuru: ${timeAgo}</p>
            </div>
            <span class="text-sm font-medium text-green-600">₺${project.estimatedCost}</span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
            <div>
                <span class="font-medium">Konut Sayısı:</span> ${project.flatCount}
            </div>
            <div>
                <span class="font-medium">Arsa Alanı:</span> ${project.landArea}m²
            </div>
        </div>
        
        <div class="flex space-x-2">
            <button onclick="approveSupport(${project.id})" class="flex-1 bg-green-600 text-white text-xs py-2 px-3 rounded hover:bg-green-700">
                <i class="fas fa-check mr-1"></i>
                Destekle
            </button>
            <button onclick="rejectSupport(${project.id})" class="flex-1 bg-red-600 text-white text-xs py-2 px-3 rounded hover:bg-red-700">
                <i class="fas fa-times mr-1"></i>
                Reddet
            </button>
            <button onclick="viewProjectDetails(${project.id})" class="bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700">
                <i class="fas fa-eye"></i>
            </button>
        </div>
    `;
    
    return div;
}

function createSupportedProjectCard(project) {
    const div = document.createElement('div');
    div.className = 'p-4 border border-green-200 rounded-lg bg-green-50 mb-4 government-support';
    
    const approvalAgo = getTimeAgo(project.approvalDate);
    
    div.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <div>
                <h4 class="font-medium text-gray-800">${project.title}</h4>
                <p class="text-sm text-gray-600">${getDistrictText(project.district)} - ${project.neighborhood}</p>
                <p class="text-xs text-gray-500 mt-1">Onaylandı: ${approvalAgo}</p>
            </div>
            <span class="supported-badge px-2 py-1 rounded-full text-xs">Desteklenen</span>
        </div>
        
        <p class="text-sm text-green-700 mb-3">${project.supportReason}</p>
        
        <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-green-600">₺${project.estimatedCost}</span>
            <div class="flex space-x-2">
                <button onclick="removeSupportConfirm(${project.id})" class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200">
                    <i class="fas fa-minus mr-1"></i>
                    Desteği Kaldır
                </button>
                <button onclick="viewProjectDetails(${project.id})" class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">
                    Detay
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// Filter Functions
function filterAnnouncements() {
    const districtFilter = document.getElementById('districtFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchTerm = document.getElementById('searchAnnouncements').value.toLowerCase();
    
    filteredAnnouncements = allAnnouncements.filter(announcement => {
        const matchesDistrict = !districtFilter || announcement.district === districtFilter;
        const matchesStatus = !statusFilter || announcement.status === statusFilter;
        const matchesType = !typeFilter || announcement.type === typeFilter;
        const matchesSearch = !searchTerm || 
            announcement.title.toLowerCase().includes(searchTerm) ||
            announcement.description.toLowerCase().includes(searchTerm) ||
            announcement.neighborhood.toLowerCase().includes(searchTerm);
        
        return matchesDistrict && matchesStatus && matchesType && matchesSearch;
    });
    
    renderAnnouncements();
}

function filterProjects() {
    const districtFilter = document.getElementById('projectDistrictFilter').value;
    const statusFilter = document.getElementById('projectStatusFilter').value;
    const supportFilter = document.getElementById('supportStatusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const searchTerm = document.getElementById('searchProjects').value.toLowerCase();
    
    filteredProjects = allProjects.filter(project => {
        const matchesDistrict = !districtFilter || project.district === districtFilter;
        const matchesStatus = !statusFilter || project.status === statusFilter;
        const matchesSupport = !supportFilter || 
            (supportFilter === 'supported' && project.governmentSupport) ||
            (supportFilter === 'not-supported' && !project.governmentSupport && project.supportStatus === 'not-supported') ||
            (supportFilter === 'pending-review' && project.supportStatus === 'pending-review');
        const matchesPriority = !priorityFilter || project.priority === priorityFilter;
        const matchesSearch = !searchTerm || 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.owner.toLowerCase().includes(searchTerm) ||
            project.neighborhood.toLowerCase().includes(searchTerm);
        
        return matchesDistrict && matchesStatus && matchesSupport && matchesPriority && matchesSearch;
    });
    
    renderProjects();
}

// Support Management Functions
function reviewSupport(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    currentProject = project;
    showSupportDecisionModal(project);
}

function showSupportDecisionModal(project) {
    const modal = document.getElementById('supportDecisionModal');
    const content = document.getElementById('supportModalContent');
    
    content.innerHTML = `
        <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">${project.title}</h3>
            <p class="text-gray-600 mb-4">${project.description}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                    <span class="font-medium text-gray-700">Konum:</span>
                    <p class="text-gray-600">${getDistrictText(project.district)} - ${project.neighborhood}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-700">Maliyet:</span>
                    <p class="text-gray-600">₺${project.estimatedCost}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-700">Konut Sayısı:</span>
                    <p class="text-gray-600">${project.flatCount} konut</p>
                </div>
                <div>
                    <span class="font-medium text-gray-700">Arsa Alanı:</span>
                    <p class="text-gray-600">${project.landArea}m²</p>
                </div>
            </div>
        </div>
        
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Destek Kararı Gerekçesi</label>
            <textarea id="supportReason" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" 
                placeholder="Destek kararınızın gerekçesini yazın..."></textarea>
        </div>
        
        <div class="flex space-x-3">
            <button onclick="approveSupport(${project.id})" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                <i class="fas fa-check mr-2"></i>
                Destekle
            </button>
            <button onclick="rejectSupport(${project.id})" class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                <i class="fas fa-times mr-2"></i>
                Reddet
            </button>
            <button onclick="closeSupportModal()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                İptal
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function approveSupport(projectId) {
    const reason = document.getElementById('supportReason')?.value || 'Devlet desteği kapsamında onaylandı.';
    
    if (!reason.trim()) {
        showNotification('Lütfen destek gerekçesini belirtin.', 'warning');
        return;
    }
    
    const projectIndex = allProjects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
        allProjects[projectIndex].governmentSupport = true;
        allProjects[projectIndex].supportStatus = 'supported';
        allProjects[projectIndex].supportReason = reason;
        allProjects[projectIndex].approvalDate = new Date();
        
        updateCounts();
        renderCurrentSection();
        closeSupportModal();
        
        showNotification('Proje başarıyla desteklenen projeler listesine eklendi!', 'success');
        
        // Update other user panels (simulation)
        updateOtherPanels(projectId, true);
    }
}

function rejectSupport(projectId) {
    const reason = document.getElementById('supportReason')?.value || 'Destek kriterleri karşılanmadı.';
    
    const projectIndex = allProjects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
        allProjects[projectIndex].governmentSupport = false;
        allProjects[projectIndex].supportStatus = 'not-supported';
        allProjects[projectIndex].supportReason = reason;
        
        updateCounts();
        renderCurrentSection();
        closeSupportModal();
        
        showNotification('Proje destek talebi reddedildi.', 'info');
    }
}

function removeSupportConfirm(projectId) {
    if (confirm('Bu projenin devlet desteğini kaldırmak istediğinizden emin misiniz?')) {
        removeSupport(projectId);
    }
}

function removeSupport(projectId) {
    const projectIndex = allProjects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
        allProjects[projectIndex].governmentSupport = false;
        allProjects[projectIndex].supportStatus = 'not-supported';
        allProjects[projectIndex].supportReason = 'Destek kaldırıldı.';
        
        updateCounts();
        renderCurrentSection();
        
        showNotification('Proje desteği kaldırıldı.', 'info');
        
        // Update other user panels (simulation)
        updateOtherPanels(projectId, false);
    }
}

function closeSupportModal() {
    document.getElementById('supportDecisionModal').classList.add('hidden');
}

// Modal Functions
function viewProjectDetails(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('projectDetailModal');
    const title = document.getElementById('modalProjectTitle');
    const content = document.getElementById('modalProjectContent');
    
    title.textContent = project.title;
    
    const statusText = getProjectStatusText(project.status);
    const createdAgo = getTimeAgo(project.createdDate);
    
    content.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Proje Bilgileri</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Durum:</span>
                            <span class="status-badge status-${project.status === 'planning' ? 'pending' : 'active'}">${statusText}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Konum:</span>
                            <span class="font-medium text-gray-800">${getDistrictText(project.district)} - ${project.neighborhood}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Adres:</span>
                            <span class="font-medium text-gray-800">${project.address}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Arsa Alanı:</span>
                            <span class="font-medium text-gray-800">${project.landArea}m²</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Bina Sayısı:</span>
                            <span class="font-medium text-gray-800">${project.buildingCount}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Konut Sayısı:</span>
                            <span class="font-medium text-gray-800">${project.flatCount}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Oluşturulma:</span>
                            <span class="font-medium text-gray-800">${createdAgo}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-blue-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Proje Ekibi</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Mülk Sahibi:</span>
                            <span class="font-medium text-gray-800">${project.owner}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Müteahhit:</span>
                            <span class="font-medium text-gray-800">${project.contractor}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Mimar:</span>
                            <span class="font-medium text-gray-800">${project.architect}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="space-y-6">
                <div class="bg-green-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Finansal Bilgiler</h3>
                    <div class="text-center">
                        <p class="text-3xl font-bold text-green-600 mb-2">₺${project.estimatedCost}</p>
                        <p class="text-gray-600">Tahmini Maliyet</p>
                    </div>
                </div>
                
                <div class="bg-purple-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Devlet Desteği</h3>
                    <div class="text-center">
                        ${project.governmentSupport ? `
                            <div class="mb-4">
                                <span class="supported-badge px-4 py-2 rounded-full text-sm">Desteklenen Proje</span>
                            </div>
                            <p class="text-sm text-green-700">${project.supportReason}</p>
                            ${project.approvalDate ? `<p class="text-xs text-gray-500 mt-2">Onay: ${getTimeAgo(project.approvalDate)}</p>` : ''}
                        ` : `
                            <p class="text-gray-600 mb-4">Bu proje henüz devlet desteği almamaktadır.</p>
                            ${project.supportStatus === 'pending-review' ? `
                                <button onclick="closeProjectModal(); reviewSupport(${project.id})" 
                                        class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                                    <i class="fas fa-eye mr-2"></i>
                                    Destek İçin İncele
                                </button>
                            ` : project.supportStatus === 'not-supported' ? `
                                <p class="text-sm text-red-600">${project.supportReason}</p>
                            ` : ''}
                        `}
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Proje Açıklaması</h3>
                    <p class="text-gray-700">${project.description}</p>
                </div>
            </div>
        </div>
        
        <div class="mt-8 flex justify-end space-x-3">
            ${!project.governmentSupport && project.supportStatus === 'pending-review' ? `
                <button onclick="closeProjectModal(); reviewSupport(${project.id})" 
                        class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                    <i class="fas fa-award mr-2"></i>
                    Destek Değerlendir
                </button>
            ` : ''}
            ${project.governmentSupport ? `
                <button onclick="removeSupportConfirm(${project.id}); closeProjectModal();" 
                        class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    <i class="fas fa-minus mr-2"></i>
                    Desteği Kaldır
                </button>
            ` : ''}
            <button onclick="closeProjectModal()" 
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                <i class="fas fa-times mr-2"></i>
                Kapat
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeProjectModal() {
    document.getElementById('projectDetailModal').classList.add('hidden');
}

function viewAnnouncementDetails(announcement) {
    const modal = document.getElementById('announcementDetailModal');
    const title = document.getElementById('announcementDetailTitle');
    const content = document.getElementById('announcementDetailContent');
    
    title.textContent = announcement.title;
    
    const statusText = getStatusText(announcement.status);
    const typeText = getAnnouncementTypeText(announcement.type);
    const createdAgo = getTimeAgo(announcement.createdDate);
    const deadlineText = announcement.deadline ? formatDate(announcement.deadline) : 'Belirtilmemiş';
    const daysLeft = announcement.deadline ? Math.ceil((announcement.deadline - new Date()) / (1000 * 60 * 60 * 24)) : 0;
    
    content.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
                <!-- Announcement Header -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <span class="status-badge status-${announcement.status}">${statusText}</span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                ${typeText}
                            </span>
                            ${announcement.governmentSupport ? '<span class="supported-badge px-2 py-1 rounded-full text-xs">Desteklenen</span>' : ''}
                        </div>
                        <span class="text-xs text-gray-500">${createdAgo}</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${announcement.title}</h3>
                    <p class="text-gray-700">${announcement.description}</p>
                </div>
                
                <!-- Location Information -->
                <div class="bg-blue-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-map-marker-alt text-blue-600 mr-2"></i>
                        Konum Bilgileri
                    </h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">İlçe:</span>
                            <span class="font-medium text-gray-800">${getDistrictText(announcement.district)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Mahalle:</span>
                            <span class="font-medium text-gray-800">${announcement.neighborhood}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Öncelik:</span>
                            <span class="font-medium text-gray-800 ${announcement.priority === 'high' ? 'text-red-600' : announcement.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}">
                                ${getPriorityText(announcement.priority)}
                            </span>
                        </div>
                    </div>
                </div>
                
                ${announcement.governmentSupport && announcement.supportReason ? `
                    <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h3 class="text-lg font-semibold text-green-800 mb-2 flex items-center">
                            <i class="fas fa-award text-green-600 mr-2"></i>
                            Devlet Desteği
                        </h3>
                        <p class="text-green-700">${announcement.supportReason}</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="space-y-6">
                <!-- Timeline Information -->
                <div class="bg-purple-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-calendar-alt text-purple-600 mr-2"></i>
                        Zaman Çizelgesi
                    </h3>
                    <div class="space-y-3">
                        <div class="flex items-center space-x-3">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span class="text-sm">Duyuru Yayınlandı - ${createdAgo}</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-3 h-3 ${daysLeft > 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-full"></div>
                            <span class="text-sm">Son Başvuru: ${deadlineText}</span>
                        </div>
                        ${daysLeft > 0 ? `
                            <div class="bg-blue-100 p-3 rounded-md">
                                <p class="text-sm text-blue-800 font-medium">
                                    <i class="fas fa-clock mr-1"></i>
                                    ${daysLeft} gün kaldı
                                </p>
                            </div>
                        ` : `
                            <div class="bg-red-100 p-3 rounded-md">
                                <p class="text-sm text-red-800 font-medium">
                                    <i class="fas fa-exclamation-triangle mr-1"></i>
                                    Başvuru süresi doldu
                                </p>
                            </div>
                        `}
                    </div>
                </div>
                
                <!-- Statistics -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-chart-bar text-gray-600 mr-2"></i>
                        İstatistikler
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-center">
                            <p class="text-2xl font-bold text-blue-600">${announcement.applicantCount}</p>
                            <p class="text-sm text-gray-600">Başvuru</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-green-600">₺${announcement.estimatedCost}</p>
                            <p class="text-sm text-gray-600">Tahmini Maliyet</p>
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">İşlemler</h3>
                    <div class="space-y-3">
                        <button onclick="editAnnouncement(${announcement.id})" 
                                class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-edit mr-2"></i>
                            Duyuruyu Düzenle
                        </button>
                        <button onclick="duplicateAnnouncement(${announcement.id})" 
                                class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            <i class="fas fa-copy mr-2"></i>
                            Kopyala
                        </button>
                        <button onclick="deleteAnnouncementConfirm(${announcement.id})" 
                                class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            <i class="fas fa-trash mr-2"></i>
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeAnnouncementDetailModal() {
    document.getElementById('announcementDetailModal').classList.add('hidden');
}

function editAnnouncement(announcementId) {
    // Implementation for editing announcement
    showNotification('Duyuru düzenleme özelliği yakında eklenecek', 'info');
}

function duplicateAnnouncement(announcementId) {
    const announcement = allAnnouncements.find(a => a.id === announcementId);
    if (announcement) {
        const duplicatedAnnouncement = {
            ...announcement,
            id: Date.now(),
            title: announcement.title + ' (Kopya)',
            createdDate: new Date(),
            applicantCount: 0
        };
        
        allAnnouncements.unshift(duplicatedAnnouncement);
        filteredAnnouncements = [...allAnnouncements];
        
        updateCounts();
        renderCurrentSection();
        closeAnnouncementDetailModal();
        
        showNotification('Duyuru başarıyla kopyalandı!', 'success');
    }
}

function deleteAnnouncementConfirm(announcementId) {
    if (confirm('Bu duyuruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
        const index = allAnnouncements.findIndex(a => a.id === announcementId);
        if (index !== -1) {
            allAnnouncements.splice(index, 1);
            filteredAnnouncements = [...allAnnouncements];
            
            updateCounts();
            renderCurrentSection();
            closeAnnouncementDetailModal();
            
            showNotification('Duyuru başarıyla silindi', 'info');
        }
    }
}

// Utility Functions
function renderCurrentSection() {
    switch(currentSection) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'announcements':
            renderAnnouncements();
            break;
        case 'projects':
            renderProjects();
            break;
        case 'support-management':
            renderSupportManagement();
            break;
        case 'districts':
            renderDistricts();
            break;
        case 'reports':
            renderReports();
            break;
    }
}

function updateOtherPanels(projectId, isSupported) {
    // This function simulates updating other user panels
    // In a real application, this would make API calls to update the backend
    console.log(`Project ${projectId} support status updated to: ${isSupported ? 'Supported' : 'Not Supported'}`);
    
    // Simulate notification to other panels
    if (isSupported) {
        showNotification('Proje tüm kullanıcı panellerinde "Desteklenen" etiketiyle görünecek', 'success');
    }
}

function createAnnouncement() {
    document.getElementById('newAnnouncementModal').classList.remove('hidden');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('announcementDeadline').min = today;
    
    // Add event listener for government support checkbox
    const supportCheckbox = document.getElementById('announcementSupport');
    const supportReasonDiv = document.getElementById('supportReasonDiv');
    
    supportCheckbox.addEventListener('change', function() {
        if (this.checked) {
            supportReasonDiv.classList.remove('hidden');
        } else {
            supportReasonDiv.classList.add('hidden');
        }
    });
}

function closeNewAnnouncementModal() {
    document.getElementById('newAnnouncementModal').classList.add('hidden');
    document.getElementById('newAnnouncementForm').reset();
    document.getElementById('supportReasonDiv').classList.add('hidden');
}

function submitNewAnnouncement(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newAnnouncement = {
        id: Date.now(),
        title: formData.get('title'),
        description: formData.get('description'),
        district: formData.get('district'),
        neighborhood: formData.get('neighborhood') || 'Merkez',
        type: formData.get('type'),
        status: 'active',
        priority: formData.get('priority'),
        createdDate: new Date(),
        deadline: new Date(formData.get('deadline')),
        applicantCount: 0,
        estimatedCost: formData.get('estimatedCost') || '0',
        supportEligible: formData.get('governmentSupport') === 'on',
        governmentSupport: formData.get('governmentSupport') === 'on',
        supportReason: formData.get('supportReason') || ''
    };
    
    // Add to announcements array
    allAnnouncements.unshift(newAnnouncement);
    filteredAnnouncements = [...allAnnouncements];
    
    // Update counts and refresh display
    updateCounts();
    renderCurrentSection();
    
    // Close modal and show success message
    closeNewAnnouncementModal();
    showNotification('Duyuru başarıyla oluşturuldu!', 'success');
}

function generateReport(reportTitle) {
    showNotification(`${reportTitle} indiriliyor...`, 'info');
}

function toggleSetting(toggleElement) {
    toggleElement.classList.toggle('active');
}

function logout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        window.location.href = 'auth.html';
    }
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Az önce';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    return `${Math.floor(diffInSeconds / 86400)} gün önce`;
}

function getStatusText(status) {
    const statusTexts = {
        'pending': 'Beklemede',
        'active': 'Aktif',
        'completed': 'Tamamlandı',
        'cancelled': 'İptal'
    };
    return statusTexts[status] || status;
}

function getProjectStatusText(status) {
    const statusTexts = {
        'planning': 'Planlama',
        'active': 'Aktif',
        'construction': 'İnşaat',
        'completed': 'Tamamlandı',
        'cancelled': 'İptal'
    };
    return statusTexts[status] || status;
}

function getAnnouncementTypeText(type) {
    const typeTexts = {
        'urban-transformation': 'Kentsel Dönüşüm',
        'renovation': 'Yenileme',
        'development': 'Arsa Geliştirme'
    };
    return typeTexts[type] || type;
}

function getDistrictText(district) {
    const districtTexts = {
        'kadikoy': 'Kadıköy',
        'uskudar': 'Üsküdar',
        'besiktas': 'Beşiktaş'
    };
    return districtTexts[district] || district;
}

// Map Functions
function toggleMapLayer(layerType) {
    const button = document.getElementById(layerType + 'LayerBtn');
    const isActive = button.classList.contains('bg-opacity-100');
    
    if (isActive) {
        button.classList.remove('bg-opacity-100');
        button.classList.add('bg-opacity-50');
        hideMapLayer(layerType);
    } else {
        button.classList.add('bg-opacity-100');
        button.classList.remove('bg-opacity-50');
        showMapLayer(layerType);
    }
}

function showMapLayer(layerType) {
    const markers = document.querySelectorAll(`.${layerType.slice(0, -1)}-marker`);
    markers.forEach(marker => {
        marker.style.display = 'block';
    });
}

function hideMapLayer(layerType) {
    const markers = document.querySelectorAll(`.${layerType.slice(0, -1)}-marker`);
    markers.forEach(marker => {
        marker.style.display = 'none';
    });
}

function selectDistrict(districtCode) {
    // Reset all districts
    document.querySelectorAll('.district-area polygon').forEach(polygon => {
        polygon.style.opacity = '0.3';
    });
    
    // Highlight selected district
    const selectedDistrict = document.querySelector(`#${districtCode}-district polygon`);
    if (selectedDistrict) {
        selectedDistrict.style.opacity = '0.6';
    }
    
    // Show district info panel
    const panel = document.getElementById('districtInfoPanel');
    const nameElement = document.getElementById('selectedDistrictName');
    const infoElement = document.getElementById('selectedDistrictInfo');
    
    const districtData = {
        kadikoy: { name: 'Kadıköy', projects: 12, announcements: 8, supported: 5 },
        uskudar: { name: 'Üsküdar', projects: 9, announcements: 4, supported: 2 },
        besiktas: { name: 'Beşiktaş', projects: 7, announcements: 3, supported: 1 }
    };
    
    const data = districtData[districtCode];
    if (data) {
        nameElement.textContent = data.name + ' İlçesi';
        infoElement.innerHTML = `
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="font-medium">Projeler:</span> ${data.projects}
                </div>
                <div>
                    <span class="font-medium">Duyurular:</span> ${data.announcements}
                </div>
                <div>
                    <span class="font-medium">Desteklenen:</span> ${data.supported}
                </div>
                <div>
                    <span class="font-medium">Oran:</span> %${Math.round((data.supported / data.projects) * 100)}
                </div>
            </div>
        `;
        panel.classList.remove('hidden');
    }
}

function zoomMap(direction) {
    const map = document.getElementById('regionalMap');
    const svg = map.querySelector('svg');
    const currentScale = svg.style.transform ? parseFloat(svg.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1) : 1;
    
    let newScale;
    if (direction === 'in') {
        newScale = Math.min(currentScale * 1.2, 3);
    } else {
        newScale = Math.max(currentScale / 1.2, 0.5);
    }
    
    svg.style.transform = `scale(${newScale})`;
    svg.style.transformOrigin = 'center center';
}

function resetMapView() {
    const map = document.getElementById('regionalMap');
    const svg = map.querySelector('svg');
    svg.style.transform = 'scale(1)';
    
    // Reset district selection
    document.querySelectorAll('.district-area polygon').forEach(polygon => {
        polygon.style.opacity = '0.3';
    });
    
    // Hide info panel
    document.getElementById('districtInfoPanel').classList.add('hidden');
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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
