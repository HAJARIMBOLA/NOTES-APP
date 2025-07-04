        // ================ Variables globales ================
let notes = [];
let currentSort = 'recent';
let currentFilter = '';
let noteCounter = 0;
let isEditing = false;
let editingNoteId = null;

// ================ Initialisation ================
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    initializeApp();
});

function initializeApp() {
    try {
        loadFromStorage();
        initializeTheme();
        initializeEventListeners();
        setTimeout(() => {
            renderNotes();
            updateNoteCount();
        }, 100);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showNotification('Erreur lors du chargement', 'error');
    }
}

function loadFromStorage() {
    try {
        // Utiliser des variables temporaires au lieu de localStorage
        notes = [];
        noteCounter = 0;
        console.log(`${notes.length} notes chargées`);
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        notes = [];
        noteCounter = 0;
    }
}

function saveToStorage() {
    try {
        // Simulation de sauvegarde - dans un vrai environnement, 
        // ceci serait remplacé par une API ou une base de données
        console.log('Notes sauvegardées:', notes.length);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showNotification('Erreur lors de la sauvegarde', 'error');
    }
}

// ================ Gestion du thème ================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    let currentTheme = 'dark';
    
    applyTheme(currentTheme);
    
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
        
        // Animation
        const icon = themeToggle.querySelector('.theme-icon');
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            icon.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

function applyTheme(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    const burgerMenu = document.getElementById('burgerMenu');
    const header = document.querySelector('header');
    
    if (theme === 'light') {
        // Mode clair
        document.body.className = 'h-full bg-gray-100 text-gray-900 font-sans';
        
        // Icône et texte du thème
        themeIcon.className = 'fas fa-sun w-5 text-center theme-icon';
        themeText.textContent = 'Mode clair';
        
        // Menu burger - Mode clair
        if (burgerMenu) {
            burgerMenu.className = 'burger-menu bg-white/95 backdrop-blur-sm text-gray-900 border-r border-gray-200';
            
            // Modifier les éléments du menu burger
            const menuItems = burgerMenu.querySelectorAll('a');
            menuItems.forEach(item => {
                if (item.id === 'themeToggle') {
                    item.className = 'flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200';
                } else if (item.classList.contains('text-blue-400')) {
                    item.className = 'flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-600 bg-blue-50 backdrop-blur';
                } else {
                    item.className = 'flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200';
                }
            });
            
            // Bordures et séparateurs
            const borders = burgerMenu.querySelectorAll('.border-gray-700');
            borders.forEach(border => {
                border.className = border.className.replace('border-gray-700', 'border-gray-200');
            });
            
            // Texte secondaire
            const secondaryText = burgerMenu.querySelectorAll('.text-gray-400');
            secondaryText.forEach(text => {
                text.className = text.className.replace('text-gray-400', 'text-gray-600');
            });
        }
        
        // Header - Mode clair
        if (header) {
            header.className = 'bg-white/90 backdrop-blur-sm p-4 md:p-6 border-b border-gray-200 sticky top-0 z-50';
            
            // Modifier les éléments du header
            const searchInput = header.querySelector('#searchInput');
            if (searchInput) {
                searchInput.className = 'bg-gray-100 text-gray-900 px-4 py-2 pl-10 pr-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border border-gray-300 focus:border-blue-500';
            }
            
            const burgerButton = header.querySelector('#burgerButton');
            if (burgerButton) {
                burgerButton.className = 'burger-button text-gray-600 hover:text-gray-900 text-xl md:text-2xl transition-all duration-200 hover:scale-110';
            }
        }
        
        // Modal - Mode clair
        const noteModal = document.getElementById('noteModal');
        if (noteModal) {
            const modalContent = noteModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.className = 'modal-content bg-white/95 backdrop-blur w-full max-w-lg rounded-xl shadow-2xl border border-gray-300';
            }
            
            // Champs de formulaire dans la modal
            const formInputs = noteModal.querySelectorAll('input, textarea, select');
            formInputs.forEach(input => {
                if (input.type === 'text' || input.type === 'datetime-local' || input.tagName === 'TEXTAREA') {
                    input.className = input.className.replace(/bg-gray-\d+/g, 'bg-gray-100').replace(/border-gray-\d+/g, 'border-gray-300').replace(/text-white/g, 'text-gray-900');
                }
            });
            
            // Labels dans la modal
            const labels = noteModal.querySelectorAll('label');
            labels.forEach(label => {
                label.className = label.className.replace(/text-gray-\d+/g, 'text-gray-700');
            });
        }
        
        // Dropdown de tri - Mode clair
        const sortDropdown = document.querySelector('.sort-dropdown');
        if (sortDropdown) {
            sortDropdown.className = 'sort-dropdown absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur rounded-lg shadow-xl border border-gray-300 z-50';
            
            // Options de tri
            const sortOptions = sortDropdown.querySelectorAll('.sort-option');
            sortOptions.forEach(option => {
                option.className = 'sort-option block px-4 py-2 hover:bg-gray-100 transition-colors duration-200 text-gray-900';
            });
        }
        
    } else {
        // Mode sombre
        document.body.className = 'h-full bg-gray-900 text-white font-sans';
        
        // Icône et texte du thème
        themeIcon.className = 'fas fa-moon w-5 text-center theme-icon';
        themeText.textContent = 'Mode sombre';
        
        // Menu burger - Mode sombre
        if (burgerMenu) {
            burgerMenu.className = 'burger-menu bg-gray-800/95 backdrop-blur-sm text-white border-r border-gray-700';
            
            // Rétablir les styles originaux du menu burger
            const menuItems = burgerMenu.querySelectorAll('a');
            menuItems.forEach(item => {
                if (item.id === 'themeToggle') {
                    item.className = 'flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200';
                } else if (item.querySelector('.bg-blue-500')) {
                    item.className = 'flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-400 bg-gray-700/50 backdrop-blur';
                } else {
                    item.className = 'flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200';
                }
            });
            
            // Rétablir les bordures originales
            const borders = burgerMenu.querySelectorAll('.border-gray-200');
            borders.forEach(border => {
                border.className = border.className.replace('border-gray-200', 'border-gray-700');
            });
            
            // Rétablir le texte secondaire
            const secondaryText = burgerMenu.querySelectorAll('.text-gray-600');
            secondaryText.forEach(text => {
                text.className = text.className.replace('text-gray-600', 'text-gray-400');
            });
        }
        
        // Header - Mode sombre
        if (header) {
            header.className = 'bg-gray-800/90 backdrop-blur-sm p-4 md:p-6 border-b border-gray-700 sticky top-0 z-50';
            
            // Rétablir les styles originaux du header
            const searchInput = header.querySelector('#searchInput');
            if (searchInput) {
                searchInput.className = 'bg-gray-700/50 backdrop-blur text-white px-4 py-2 pl-10 pr-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border border-gray-600 focus:border-blue-500';
            }
            
            const burgerButton = header.querySelector('#burgerButton');
            if (burgerButton) {
                burgerButton.className = 'burger-button text-gray-300 hover:text-white text-xl md:text-2xl transition-all duration-200 hover:scale-110';
            }
        }
        
        // Modal - Mode sombre
        const noteModal = document.getElementById('noteModal');
        if (noteModal) {
            const modalContent = noteModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.className = 'modal-content bg-gray-800/95 backdrop-blur w-full max-w-lg rounded-xl shadow-2xl border border-gray-700';
            }
            
            // Champs de formulaire dans la modal
            const formInputs = noteModal.querySelectorAll('input, textarea, select');
            formInputs.forEach(input => {
                if (input.type === 'text' || input.type === 'datetime-local' || input.tagName === 'TEXTAREA') {
                    input.className = input.className.replace(/bg-gray-\d+/g, 'bg-gray-700/50').replace(/border-gray-\d+/g, 'border-gray-600').replace(/text-gray-\d+/g, 'text-white');
                }
            });
            
            // Labels dans la modal
            const labels = noteModal.querySelectorAll('label');
            labels.forEach(label => {
                label.className = label.className.replace(/text-gray-\d+/g, 'text-gray-300');
            });
        }
        
        // Dropdown de tri - Mode sombre
        const sortDropdown = document.querySelector('.sort-dropdown');
        if (sortDropdown) {
            sortDropdown.className = 'sort-dropdown absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur rounded-lg shadow-xl border border-gray-700 z-50';
            
            // Options de tri
            const sortOptions = sortDropdown.querySelectorAll('.sort-option');
            sortOptions.forEach(option => {
                option.className = 'sort-option block px-4 py-2 hover:bg-gray-700 transition-colors duration-200 text-white';
            });
        }
    }
}

// ================ Event Listeners ================
function initializeEventListeners() {
    // Menu burger
    const burgerButton = document.getElementById('burgerButton');
    const burgerMenu = document.getElementById('burgerMenu');
    const burgerOverlay = document.getElementById('burgerOverlay');
    const closeBurger = document.getElementById('closeBurger');

    burgerButton.addEventListener('click', toggleBurgerMenu);
    closeBurger.addEventListener('click', closeBurgerMenu);
    burgerOverlay.addEventListener('click', closeBurgerMenu);

    // Modal
    const noteModal = document.getElementById('noteModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const noteForm = document.getElementById('noteForm');

    closeModal.addEventListener('click', closeNoteModal);
    cancelBtn.addEventListener('click', closeNoteModal);
    noteModal.addEventListener('click', (e) => {
        if (e.target === noteModal) closeNoteModal();
    });
    
    // CORRECTION: Retirer la duplication de noteForm
    noteForm.addEventListener('submit', handleNoteSubmission);

    // FAB et création de notes
    const mainFab = document.getElementById('mainFab');
    const floatingButtons = document.querySelectorAll('[data-note-type]');
    const createFirstNote = document.getElementById('createFirstNote');

    mainFab.addEventListener('click', () => openNoteModal());
    floatingButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const noteType = e.currentTarget.dataset.noteType;
            openNoteModal(noteType);
        });
    });
    
    if (createFirstNote) {
        createFirstNote.addEventListener('click', () => openNoteModal());
    }

    // Recherche
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchHandler);
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearchHandler);
    }

    // Tri
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const sortType = e.currentTarget.dataset.sort;
            currentSort = sortType;
            renderNotes();
            showNotification(`Tri par ${getSortLabel(sortType)}`, 'success');
        });
    });

    // Import/Export
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const fileInput = document.getElementById('fileInput');

    importBtn.addEventListener('click', () => fileInput.click());
    exportBtn.addEventListener('click', exportNotes);
    fileInput.addEventListener('change', importNotes);

    // Compteurs de caractères
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const titleCounter = document.getElementById('titleCounter');
    const contentCounter = document.getElementById('contentCounter');

    noteTitle.addEventListener('input', () => {
        titleCounter.textContent = `${noteTitle.value.length}/100`;
    });

    noteContent.addEventListener('input', () => {
        contentCounter.textContent = `${noteContent.value.length}/1000`;
    });

    // Suggestions de tags
    const noteTags = document.getElementById('noteTags');
    noteTags.addEventListener('input', handleTagInput);
    noteTags.addEventListener('focus', showTagSuggestions);
    noteTags.addEventListener('blur', () => {
        setTimeout(() => hideTagSuggestions(), 200);
    });
}

// ================ Gestion du menu burger ================
function toggleBurgerMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const burgerOverlay = document.getElementById('burgerOverlay');
    const burgerButton = document.getElementById('burgerButton');

    burgerMenu.classList.toggle('open');
    burgerOverlay.classList.toggle('open');
    burgerButton.classList.toggle('open');
}

function closeBurgerMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const burgerOverlay = document.getElementById('burgerOverlay');
    const burgerButton = document.getElementById('burgerButton');

    burgerMenu.classList.remove('open');
    burgerOverlay.classList.remove('open');
    burgerButton.classList.remove('open');
}

// ================ Gestion de la modal ================
function openNoteModal(noteType = 'Texte', note = null) {
    const modal = document.getElementById('noteModal');
    const modalTitle = document.getElementById('modalTitle');
    const noteForm = document.getElementById('noteForm');

    isEditing = !!note;
    editingNoteId = note ? note.id : null;

    // Reset form
    noteForm.reset();
    
    // Set title
    modalTitle.textContent = isEditing ? 'Modifier la note' : 'Nouvelle note';

    // Set note type
    const typeRadio = document.querySelector(`input[name="noteType"][value="${noteType}"]`);
    if (typeRadio) typeRadio.checked = true;

    // Fill form if editing
    if (note) {
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        document.getElementById('noteDateTime').value = note.dateTime || '';
        document.getElementById('noteTags').value = note.tags.map(tag => `#${tag}`).join(' ');
        
        // Update counters
        updateCharacterCounters();
    }

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus on title
    setTimeout(() => {
        document.getElementById('noteTitle').focus();
    }, 100);
}

function closeNoteModal() {
    const modal = document.getElementById('noteModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Reset editing state
    isEditing = false;
    editingNoteId = null;
}

function updateCharacterCounters() {
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const titleCounter = document.getElementById('titleCounter');
    const contentCounter = document.getElementById('contentCounter');

    titleCounter.textContent = `${noteTitle.value.length}/100`;
    contentCounter.textContent = `${noteContent.value.length}/1000`;
}

// ================ Gestion des notes ================
function handleNoteSubmission(e) {
    e.preventDefault();
    
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    const noteType = document.querySelector('input[name="noteType"]:checked').value;
    const dateTime = document.getElementById('noteDateTime').value;
    const tagsInput = document.getElementById('noteTags').value;

    // Validation
    if (!title && !content) {
        showNotification('Veuillez saisir un titre ou du contenu', 'error');
        return;
    }

    // Parse tags
    const tags = parseTags(tagsInput);

    const noteData = {
        id: isEditing ? editingNoteId : ++noteCounter,
        title: title || `Note ${noteCounter}`,
        content,
        type: noteType,
        dateTime,
        tags,
        createdAt: isEditing ? notes.find(n => n.id === editingNoteId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (isEditing) {
        const index = notes.findIndex(n => n.id === editingNoteId);
        notes[index] = noteData;
        showNotification('Note modifiée avec succès', 'success');
    } else {
        notes.push(noteData);
        showNotification('Note créée avec succès', 'success');
    }

    saveToStorage();
    renderNotes();
    updateNoteCount();
    closeNoteModal();
}

function parseTags(tagsInput) {
    return tagsInput
        .split(/\s+/)
        .filter(tag => tag.startsWith('#') && tag.length > 1)
        .map(tag => tag.substring(1).toLowerCase())
        .filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates
}

function deleteNote(noteId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
        notes = notes.filter(note => note.id !== noteId);
        saveToStorage();
        renderNotes();
        updateNoteCount();
        showNotification('Note supprimée', 'success');
    }
}

function editNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        openNoteModal(note.type, note);
    }
}

function duplicateNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const duplicatedNote = {
            ...note,
            id: ++noteCounter,
            title: `${note.title} (copie)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.push(duplicatedNote);
        saveToStorage();
        renderNotes();
        updateNoteCount();
        showNotification('Note dupliquée', 'success');
    }
}

// ================ Rendu des notes ================
function renderNotes() {
    const notesGrid = document.getElementById('notesGrid');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const noResultsState = document.getElementById('noResultsState');

    // Hide loading
    loadingState.classList.add('hidden');

    // Filter notes
    let filteredNotes = filterNotes();
    
    // Sort notes
    filteredNotes = sortNotes(filteredNotes);

    // Clear grid (except state elements)
    const noteCards = notesGrid.querySelectorAll('.note-card');
    noteCards.forEach(card => card.remove());

    if (notes.length === 0) {
        emptyState.classList.remove('hidden');
        noResultsState.classList.add('hidden');
        return;
    }

    if (filteredNotes.length === 0) {
        emptyState.classList.add('hidden');
        noResultsState.classList.remove('hidden');
        return;
    }

    // Hide empty states
    emptyState.classList.add('hidden');
    noResultsState.classList.add('hidden');

    // Render notes
    filteredNotes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesGrid.appendChild(noteCard);
    });
}

function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 relative group';
    
    const typeColors = {
        'Texte': 'bg-blue-500',
        'Liste': 'bg-yellow-500',
        'Rendez-vous': 'bg-red-500'
    };

    const typeIcons = {
        'Texte': 'fas fa-align-left',
        'Liste': 'fas fa-list',
        'Rendez-vous': 'fas fa-calendar-plus'
    };

    card.innerHTML = `
        <!-- Type badge -->
        <div class="badge ${typeColors[note.type]}">
            <i class="${typeIcons[note.type]}"></i>
        </div>

        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
            <h3 class="text-lg font-semibold text-white line-clamp-2 flex-1 mr-2">
                ${escapeHtml(note.title)}
            </h3>
            <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="editNote(${note.id})" class="text-gray-400 hover:text-blue-400 p-1 rounded transition-colors" title="Modifier">
                    <i class="fas fa-edit text-sm"></i>
                </button>
                <button onclick="duplicateNote(${note.id})" class="text-gray-400 hover:text-green-400 p-1 rounded transition-colors" title="Dupliquer">
                    <i class="fas fa-copy text-sm"></i>
                </button>
                <button onclick="deleteNote(${note.id})" class="text-gray-400 hover:text-red-400 p-1 rounded transition-colors" title="Supprimer">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        </div>

        <!-- Content -->
        <div class="text-gray-300 text-sm mb-4 line-clamp-3">
            ${formatNoteContent(note.content)}
        </div>

        <!-- Tags -->
        ${note.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1 mb-4">
                ${note.tags.map(tag => `
                    <span class="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full text-xs">
                        #${escapeHtml(tag)}
                    </span>
                `).join('')}
            </div>
        ` : ''}

        <!-- Footer -->
        <div class="flex items-center justify-between text-xs text-gray-500">
            <span>${formatDate(note.createdAt)}</span>
            ${note.dateTime ? `
                <span class="flex items-center">
                    <i class="fas fa-clock mr-1"></i>
                    ${formatDateTime(note.dateTime)}
                </span>
            ` : ''}
        </div>
    `;

    return card;
}

function filterNotes() {
    if (!currentFilter) return notes;

    const filter = currentFilter.toLowerCase();
    return notes.filter(note => 
        note.title.toLowerCase().includes(filter) ||
        note.content.toLowerCase().includes(filter) ||
        note.tags.some(tag => tag.toLowerCase().includes(filter))
    );
}

function sortNotes(notesToSort) {
    const sorted = [...notesToSort];
    
    switch (currentSort) {
        case 'recent':
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'az':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'za':
            return sorted.sort((a, b) => b.title.localeCompare(a.title));
        case 'tags':
            return sorted.sort((a, b) => {
                const aHasTags = a.tags.length > 0;
                const bHasTags = b.tags.length > 0;
                if (aHasTags && !bHasTags) return -1;
                if (!aHasTags && bHasTags) return 1;
                return a.tags[0]?.localeCompare(b.tags[0] || '') || 0;
            });
        default:
            return sorted;
    }
}

// ================ Recherche ================
function handleSearch(e) {
    const searchTerm = e.target.value.trim();
    const clearSearchBtn = document.getElementById('clearSearch');
    
    currentFilter = searchTerm;
    
    if (searchTerm) {
        clearSearchBtn.style.opacity = '1';
    } else {
        clearSearchBtn.style.opacity = '0';
    }
    
    renderNotes();
}

function clearSearchHandler() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    searchInput.value = '';
    currentFilter = '';
    clearSearchBtn.style.opacity = '0';
    renderNotes();
    searchInput.focus();
}

// ================ Tags ================
function handleTagInput(e) {
    const input = e.target.value;
    const lastWord = input.split(/\s+/).pop();
    
    if (lastWord.startsWith('#') && lastWord.length > 1) {
        showTagSuggestions(lastWord.substring(1));
    } else {
        hideTagSuggestions();
    }
}

function showTagSuggestions(filter = '') {
    const suggestions = document.getElementById('tagSuggestions');
    const allTags = [...new Set(notes.flatMap(note => note.tags))];
    
    let filteredTags = allTags;
    if (filter) {
        filteredTags = allTags.filter(tag => 
            tag.toLowerCase().includes(filter.toLowerCase())
        );
    }

    if (filteredTags.length === 0) {
        hideTagSuggestions();
        return;
    }

    const suggestionsHtml = filteredTags.slice(0, 5).map(tag => `
        <div class="px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors" onclick="selectTag('${tag}')">
            #${escapeHtml(tag)}
        </div>
    `).join('');

    suggestions.innerHTML = suggestionsHtml;
    suggestions.classList.remove('hidden');
}

function hideTagSuggestions() {
    const suggestions = document.getElementById('tagSuggestions');
    suggestions.classList.add('hidden');
}

function selectTag(tag) {
    const tagsInput = document.getElementById('noteTags');
    const words = tagsInput.value.split(/\s+/);
    const lastWord = words[words.length - 1];
    
    if (lastWord.startsWith('#')) {
        words[words.length - 1] = `#${tag}`;
    } else {
        words.push(`#${tag}`);
    }
    
    tagsInput.value = words.join(' ') + ' ';
    hideTagSuggestions();
    tagsInput.focus();
}

// ================ Import/Export ================
function exportNotes() {
    try {
        const dataStr = JSON.stringify(notes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mes-notes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('Notes exportées avec succès', 'success');
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        showNotification('Erreur lors de l\'export', 'error');
    }
}

function importNotes(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedNotes = JSON.parse(event.target.result);
            
            if (!Array.isArray(importedNotes)) {
                throw new Error('Format de fichier invalide');
            }

            // Validation et ajustement des IDs
            const validNotes = importedNotes.filter(note => 
                note.title || note.content
            ).map(note => ({
                ...note,
                id: ++noteCounter,
                createdAt: note.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }));

            notes.push(...validNotes);
            saveToStorage();
            renderNotes();
            updateNoteCount();
            
            showNotification(`${validNotes.length} notes importées`, 'success');
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            showNotification('Erreur lors de l\'import du fichier', 'error');
        }
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
}

// ================ Utilitaires ================
function updateNoteCount() {
    const noteCountElement = document.getElementById('noteCount');
    if (noteCountElement) {
        noteCountElement.textContent = notes.length;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatNoteContent(content) {
    if (!content) return '<em class="text-gray-500">Pas de contenu</em>';
    
    // Convert line breaks to <br> and truncate
    const formatted = escapeHtml(content)
        .replace(/\n/g, '<br>')
        .substring(0, 150);
    
    return content.length > 150 ? formatted + '...' : formatted;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getSortLabel(sortType) {
    const labels = {
        'recent': 'plus récent',
        'oldest': 'plus ancien',
        'az': 'A → Z',
        'za': 'Z → A',
        'tags': 'tags'
    };
    return labels[sortType] || sortType;
}

// ================ Notifications ================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ================ Raccourcis clavier ================
document.addEventListener('keydown', (e) => {
    // Ctrl+N ou Cmd+N : Nouvelle note
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openNoteModal();
    }
    
    // Escape : Fermer modal/menu
    if (e.key === 'Escape') {
        const modal = document.getElementById('noteModal');
        const burgerMenu = document.getElementById('burgerMenu');
        
        if (modal.classList.contains('show')) {
            closeNoteModal();
        } else if (burgerMenu.classList.contains('open')) {
            closeBurgerMenu();
        }
    }
    
    // Ctrl+F ou Cmd+F : Focus sur la recherche
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// ================ Gestion des erreurs globales ================
window.addEventListener('error', (e) => {
    console.error('Erreur globale:', e.error);
    showNotification('Une erreur s\'est produite', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejetée:', e.reason);
    showNotification('Une erreur s\'est produite', 'error');
});