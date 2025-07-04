       let selectedUsage = '';

        function switchTab(tab) {
            // Mise à jour des boutons d'onglet
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Mise à jour des formulaires
            document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
            document.getElementById(tab + '-form').classList.add('active');
            
            // Effacer les messages
            clearMessages();
        }

        // Gestion du select personnalisé
        document.getElementById('usage-select').addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('open');
        });

        document.querySelectorAll('.select-option').forEach(option => {
            option.addEventListener('click', function() {
                const value = this.dataset.value;
                const text = this.textContent.trim();
                const icon = this.querySelector('i').className;
                
                selectedUsage = value;
                
                // Mettre à jour l'affichage du select
                const selectText = document.querySelector('.select-text');
                selectText.innerHTML = `<i class="${icon}" style="position: static; margin-right: 15px;"></i>${text}`;
                
                // Fermer le dropdown
                document.getElementById('usage-select').classList.remove('open');
                
                // Gérer l'affichage du champ entreprise
                const companyField = document.getElementById('company-field');
                const companyInput = document.getElementById('company-name');
                
                if (value === 'entreprise') {
                    companyField.classList.remove('hidden');
                    companyField.classList.add('visible');
                    companyInput.required = true;
                } else {
                    companyField.classList.remove('visible');
                    companyField.classList.add('hidden');
                    companyInput.required = false;
                    companyInput.value = '';
                }
                
                // Marquer l'option comme sélectionnée
                document.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Fermer le dropdown en cliquant ailleurs
        document.addEventListener('click', function() {
            document.getElementById('usage-select').classList.remove('open');
        });

        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const icon = event.target;
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        function showMessage(type, message, formType) {
            const messageEl = document.getElementById(formType + '-' + type);
            messageEl.textContent = message;
            messageEl.style.display = 'block';
            
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }

        function clearMessages() {
            document.querySelectorAll('.success-message, .error-message').forEach(msg => {
                msg.style.display = 'none';
            });
        }

        function setButtonLoading(button, loading) {
            if (loading) {
                button.classList.add('loading');
                button.disabled = true;
            } else {
                button.classList.remove('loading');
                button.disabled = false;
            }
        }

        // Gestionnaire de soumission du formulaire d'inscription
        document.getElementById('signup-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const button = this.querySelector('.btn-primary');
            setButtonLoading(button, true);
            clearMessages();
            
            // Validation de l'usage
            if (!selectedUsage) {
                showMessage('error', 'Veuillez sélectionner un type d\'usage', 'signup');
                setButtonLoading(button, false);
                return;
            }
            
            // Validation des mots de passe
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                showMessage('error', 'Les mots de passe ne correspondent pas', 'signup');
                setButtonLoading(button, false);
                return;
            }
            
            // Validation du nom d'entreprise si nécessaire
            if (selectedUsage === 'entreprise' && !document.getElementById('company-name').value.trim()) {
                showMessage('error', 'Le nom de l\'entreprise est requis', 'signup');
                setButtonLoading(button, false);
                return;
            }
            
            // Simulation d'un appel API
            setTimeout(() => {
                // Simuler une réponse réussie
                if (Math.random() > 0.3) {
                    showMessage('success', 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'signup');
                    this.reset();
                    selectedUsage = '';
                    document.querySelector('.select-text').innerHTML = '<i class="fas fa-briefcase" style="position: static; margin-right: 15px;"></i>Usage';
                    document.getElementById('company-field').classList.add('hidden');
                    document.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
                } else {
                    showMessage('error', 'Une erreur est survenue. Veuillez réessayer.', 'signup');
                }
                setButtonLoading(button, false);
            }, 2000);
        });

        // Gestionnaire de soumission du formulaire de connexion
        document.getElementById('signin-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const button = this.querySelector('.btn-primary');
            setButtonLoading(button, true);
            clearMessages();
            
            // Simulation d'un appel API
            setTimeout(() => {
                // Simuler une réponse réussie
                if (Math.random() > 0.3) {
                    showMessage('success', 'Connexion réussie ! Redirection en cours...', 'signin');
                    setTimeout(() => {
                        console.log('Redirection vers le tableau de bord...');
                    }, 1500);
                } else {
                    showMessage('error', 'Email ou mot de passe incorrect.', 'signin');
                }
                setButtonLoading(button, false);
            }, 2000);
        });

        function signupWithGoogle() {
            const button = event.target.closest('.btn');
            setButtonLoading(button, true);
            clearMessages();
            
            setTimeout(() => {
                if (Math.random() > 0.2) {
                    showMessage('success', 'Inscription avec Google réussie !', 'signup');
                } else {
                    showMessage('error', 'Erreur lors de l\'authentification Google.', 'signup');
                }
                setButtonLoading(button, false);
            }, 1500);
        }

        function signinWithGoogle() {
        const button = event.target.closest('.btn');
        setButtonLoading(button, true);
        clearMessages();

        setTimeout(() => {
            if (Math.random() > 0.2) {
                showMessage('success', 'Connexion avec Google réussie !', 'signin');
            
            // Redirection après un petit délai pour que le message soit visible
                setTimeout(() => {
                window.location.href = 'interface.html';
            }, 1000); // 1 seconde d'attente
        } else {
            showMessage('error', 'Erreur lors de l\'authentification Google.', 'signin');
        }
        setButtonLoading(button, false);
    }, 1500);
}


        // Animation des champs au focus
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', function() {
                this.closest('.form-group').style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.closest('.form-group').style.transform = 'scale(1)';
            });
        });

        // Effet de ripple sur les boutons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Initialiser l'état du champ entreprise
        document.getElementById('company-field').classList.add('hidden');
        
        // Ajouter l'animation de ripple CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);