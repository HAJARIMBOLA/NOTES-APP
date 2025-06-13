 class NotesApp {
            constructor() {
                this.notes = this.loadNotes();
                this.currentNoteId = null;
                this.noteToDelete = null;
                this.autoSaveEnabled = true;
                this.init();
            }

            init() {
                this.renderNotes();
                this.setupEventListeners();
                this.loadTheme();
                this.updateStats();
                this.setupAutoSave();
            }

            setupEventListeners() {
                document.getElementById('searchInput').addEventListener('input', () => this.searchNotes());
                document.getElementById('noteForm').addEventListener('submit', (e) => this.handleNoteSubmit(e));
                
                // Fermer les modales en cliquant à l'extérieur
                document.getElementById('noteModal').addEventListener('click', (e) => {
                    if (e.target.id === 'noteModal') this.closeNoteModal();
                });
                document.getElementById('confirmModal').addEventListener('click', (e) => {
                    if (e.target.id === 'confirmModal') this.closeConfirmModal();
                });

                // Sauvegarde automatique avant fermeture
                window.addEventListener('beforeunload', () => {
                    this.saveNotes();
                });
            }

            // === GESTION DU STOCKAGE ===
            loadNotes() {
                try {
                    const notes = localStorage.getItem('notes');
                    return notes ? JSON.parse(notes) : [];
                } catch (error) {
                    console.error('Erreur lors du chargement des notes:', error);
                    this.showNotification('Erreur lors du chargement des notes', 'error');
                    return [];
                }
            }

            saveNotes() {
                try {
                    localStorage.setItem('notes', JSON.stringify(this.notes));
                    localStorage.setItem('lastBackup', new Date().toISOString());
                    this.updateStats();
                    return true;
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                    this.showNotification('Erreur lors de la sauvegarde', 'error');
                    return false;
                }
            }

            exportNotes() {
                try {
                    const data = {
                        notes: this.notes,
                        exportDate: new Date().toISOString(),
                        version: '1.0'
                    };
                    
                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: 'application/json'
                    });
                    
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `notes_backup_${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    this.showNotification('Notes exportées avec succès', 'success');
                } catch (error) {
                    console.error('Erreur lors de l\'export:', error);
                    this.showNotification('Erreur lors de l\'export', 'error');
                }
            }

            importNotes(event) {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // Validation des données
                        if (!data.notes || !Array.isArray(data.notes)) {
                            throw new Error('Format de fichier invalide');
                        }

                        // Demander confirmation si des notes existent déjà
                        if (this.notes.length > 0) {
                            if (!confirm('Voulez-vous remplacer vos notes actuelles ? Cette action est irréversible.')) {
                                return;
                            }
                        }

                        this.notes = data.notes;
                        this.saveNotes();
                        this.renderNotes();
                        this.showNotification(`${data.notes.length} notes importées avec succès`, 'success');
                        
                    } catch (error) {
                        console.error('Erreur lors de l\'import:', error);
                        this.showNotification('Erreur lors de l\'import: fichier invalide', 'error');
                    }
                };
                
                reader.readAsText(file);
                event.target.value = ''; // Reset input
            }

            // Sauvegarde automatique
            setupAutoSave() {
                setInterval(() => {
                    if (this.autoSaveEnabled) {
                        this.saveNotes();
                    }
                }, 30000); // Sauvegarde toutes les 30 secondes
            }

            // Calcul de la taille du stockage
            getStorageSize() {
                let total = 0;
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        total += localStorage[key].length + key.length;
                    }
                }
                return total;
            }

            formatStorageSize(bytes) {
                if (bytes < 1024) return bytes + ' B';
                if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
                return Math.round(bytes / (1024 * 1024)) + ' MB';
            }

            updateStats() {
                document.getElementById('notesCount').textContent = 
                    `${this.notes.length} note${this.notes.length !== 1 ? 's' : ''}`;
                
                document.getElementById('storageInfo').textContent = 
                    `Stockage: ${this.formatStorageSize(this.getStorageSize())} utilisés`;
                
                const lastBackup = localStorage.getItem('lastBackup');
                document.getElementById('lastBackup').textContent = 
                    `Dernière sauvegarde: ${lastBackup ? this.formatDate(lastBackup) : 'Jamais'}`;
            }

            showNotification(message, type = 'success') {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;
                document.body.appendChild(notification);
                
                setTimeout(() => notification.classList.add('show'), 100);
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => document.body.removeChild(notification), 300);
                }, 3000);
            }

            // === GESTION DU THÈME ===
            loadTheme() {
                const theme = localStorage.getItem('theme') || 'light';
                document.body.setAttribute('data-theme', theme);
                this.updateThemeButton();
            }

            toggleTheme() {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeButton();
            }

            updateThemeButton() {
                const theme = document.body.getAttribute('data-theme');
                const button = document.querySelector('.theme-toggle');
                const icon = button.querySelector('i');
                const text = button.querySelector('span');
                
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun';
                    text.textContent = 'Mode Clair';
                } else {
                    icon.className = 'fas fa-moon';
                    text.textContent = 'Mode Sombre';
                }
            }

            // === GESTION DES NOTES ===
            generateId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            }

            createNote(title, content, tags) {
                const note = {
                    id: this.generateId(),
                    title: title.trim(),
                    content: content.trim(),
                    tags: this.parseTags(tags),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                this.notes.unshift(note);
                this.saveNotes();
                return note;
            }

            updateNote(id, title, content, tags) {
                const noteIndex = this.notes.findIndex(note => note.id === id);
                if (noteIndex !== -1) {
                    this.notes[noteIndex] = {
                        ...this.notes[noteIndex],
                        title: title.trim(),
                        content: content.trim(),
                        tags: this.parseTags(tags),
                        updatedAt: new Date().toISOString()
                    };
                    this.saveNotes();
                    return this.notes[noteIndex];
                }
                return null;
            }

            deleteNote(id) {
                this.notes = this.notes.filter(note => note.id !== id);
                this.saveNotes();
            }

            parseTags(tagsString) {
                if (!tagsString) return [];
                return tagsString
                    .split(/\s+/)
                    .filter(tag => tag.trim())
                    .map(tag => tag.startsWith('#') ? tag : '#' + tag)
                    .filter((tag, index, arr) => arr.indexOf(tag) === index);
            }

            formatDate(dateString) {
                const date = new Date(dateString);
                const now = new Date();
                const diff = now - date;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                
                if (days === 0) {
                    return 'Aujourd\'hui';
                } else if (days === 1) {
                    return 'Hier';
                } else if (days < 7) {
                    return `Il y a ${days} jours`;
                } else {
                    return date.toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            }

            formatMarkdown(text) {
                return text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')
                    .replace(/\n/g, '<br>');
            }

            renderNotes(notesToRender = this.notes) {
                const container = document.getElementById('notesContainer');
                
                if (notesToRender.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">📝</div>
                            <div class="empty-state-text">Aucune note trouvée</div>
                            <div>Commencez par créer votre première note !</div>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = notesToRender.map(note => `
                    <div class="note-card">
                        <div class="note-header">
                            <div>
                                <div class="note-title">${this.escapeHtml(note.title)}</div>
                                <div class="note-date">${this.formatDate(note.createdAt)}</div>
                            </div>
                            <div class="note-actions">
                                <button class="btn-icon btn-edit" onclick="app.openNoteModal('${note.id}')" title="Modifier">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon btn-delete" onclick="app.openConfirmModal('${note.id}')" title="Supprimer">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="note-content">${this.formatMarkdown(this.escapeHtml(note.content))}</div>
                        <div class="note-tags">
                            ${note.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    </div>
                `).join('');
            }

            escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            searchNotes() {
                const query = document.getElementById('searchInput').value.toLowerCase();
                if (!query) {
                    this.renderNotes();
                    return;
                }

                const filteredNotes = this.notes.filter(note => {
                    return note.title.toLowerCase().includes(query) ||
                           note.content.toLowerCase().includes(query) ||
                           note.tags.some(tag => tag.toLowerCase().includes(query));
                });

                this.renderNotes(filteredNotes);
            }

            sortNotes() {
                const sortType = document.getElementById('sortSelect').value;
                let sortedNotes = [...this.notes];

                switch (sortType) {
                    case 'date-asc':
                        sortedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                        break;
                    case 'date-desc':
                        sortedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        break;
                    case 'title-asc':
                        sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    case 'title-desc':
                        sortedNotes.sort((a, b) => b.title.localeCompare(a.title));
                        break;
                }

                this.renderNotes(sortedNotes);
            }

            openNoteModal(noteId = null) {
                this.currentNoteId = noteId;
                const modal = document.getElementById('noteModal');
                const modalTitle = document.getElementById('modalTitle');
                const form = document.getElementById('noteForm');

                if (noteId) {
                    const note = this.notes.find(n => n.id === noteId);
                    if (note) {
                        modalTitle.textContent = 'Modifier la note';
                        document.getElementById('noteTitle').value = note.title;
                        document.getElementById('noteContent').value = note.content;
                        document.getElementById('noteTags').value = note.tags.join(' ');
                    }
                } else {
                    modalTitle.textContent = 'Nouvelle note';
                    form.reset();
                }

                modal.classList.add('active');
                document.getElementById('noteTitle').focus();
            }

            closeNoteModal() {
                document.getElementById('noteModal').classList.remove('active');
                this.currentNoteId = null;
            }

            handleNoteSubmit(e) {
                e.preventDefault();
                
                const title = document.getElementById('noteTitle').value;
                const content = document.getElementById('noteContent').value;
                const tags = document.getElementById('noteTags').value;

                if (!title.trim()) {
                    this.showNotification('Le titre est obligatoire', 'error');
                    return;
                }

                if (this.currentNoteId) {
                    this.updateNote(this.currentNoteId, title, content, tags);
                    this.showNotification('Note modifiée avec succès', 'success');
                } else {
                    this.createNote(title, content, tags);
                    this.showNotification('Note créée avec succès', 'success');
                }

                this.closeNoteModal();
                this.renderNotes();
                this.searchNotes(); // Re-apply current search
            }

            openConfirmModal(noteId) {
                this.noteToDelete = noteId;
                document.getElementById('confirmModal').classList.add('active');
            }

            closeConfirmModal() {
                document.getElementById('confirmModal').classList.remove('active');
                this.noteToDelete = null;
            }

            confirmDelete() {
                if (this.noteToDelete) {
                    this.deleteNote(this.noteToDelete);
                    this.closeConfirmModal();
                    this.renderNotes();
                    this.searchNotes(); // Re-apply current search
                    this.showNotification('Note supprimée avec succès', 'success');
                }
            }

            clearSearch() {
                document.getElementById('searchInput').value = '';
                this.renderNotes();
            }
        }

        // Fonctions globales pour les événements inline
        let app;

        function toggleTheme() {
            app.toggleTheme();
        }

        function clearSearch() {
            app.clearSearch();
        }

        function sortNotes() {
            app.sortNotes();
        }

        function openNoteModal(noteId) {
            app.openNoteModal(noteId);
        }

        function closeNoteModal() {
            app.closeNoteModal();
        }

        function closeConfirmModal() {
            app.closeConfirmModal();
        }

        function confirmDelete() {
            app.confirmDelete();
        }

        function exportNotes() {
            app.exportNotes();
        }

        function importNotes(event) {
            app.importNotes(event);
        }

        // Initialisation de l'application
        document.addEventListener('DOMContentLoaded', () => {
            app = new NotesApp();
        });