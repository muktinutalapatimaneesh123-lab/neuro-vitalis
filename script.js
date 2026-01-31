// Digital Mental Twin - Main Application Logic

// ============================================
// APPLICATION STATE & CONFIGURATION
// ============================================

const AppState = {
    isLoggedIn: false,
    currentPage: 'login',
    pages: ['login', 'dashboard', 'history', 'mindfulness', 'analytics', 'settings'],
    userData: {
        username: 'DemoUser',
        email: 'demo@example.com',
        mood: 'Optimistic',
        wellnessScore: 87,
        conversationCount: 24,
        insightsCount: 42
    },
    isVoiceListening: false,
    isExerciseActive: false,
    currentExercise: null,
    exerciseTimer: null,
    remainingTime: 300, // 5 minutes in seconds
    notifications: []
};

// ============================================
// DOM ELEMENT REFERENCES
// ============================================

// Pages
const pages = {
    login: document.getElementById('loginPage'),
    dashboard: document.getElementById('dashboardPage'),
    history: document.getElementById('historyPage'),
    mindfulness: document.getElementById('mindfulnessPage'),
    analytics: document.getElementById('analyticsPage'),
    settings: document.getElementById('settingsPage')
};

// Navigation Elements
const navBtns = document.querySelectorAll('.nav-btn');
const pageDots = document.querySelectorAll('.page-dot');
const nextBtns = document.querySelectorAll('.next');
const backBtns = document.querySelectorAll('.back');

// Login Elements
const loginSubmitBtn = document.getElementById('loginSubmit');

// Chat Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const quickActionBtns = document.querySelectorAll('.quick-action-btn');
const voiceInputBtn = document.getElementById('voiceInputBtn');
const startVoiceBtn = document.getElementById('startVoiceBtn');
const voiceFeedback = document.getElementById('voiceFeedback');

// Exercise Elements
const exerciseCards = document.querySelectorAll('.exercise-card');
const exercisePlayer = document.getElementById('exercisePlayer');
const playerExerciseTitle = document.getElementById('playerExerciseTitle');
const playerExerciseDesc = document.getElementById('playerExerciseDesc');
const timerDisplay = document.getElementById('timerDisplay');
const playerInstructions = document.getElementById('playerInstructions');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');

// UI Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const notificationContainer = document.getElementById('notificationContainer');
const voiceAccuracy = document.getElementById('voiceAccuracy');
const accuracyFill = document.getElementById('accuracyFill');
const accuracyValue = document.getElementById('accuracyValue');

// ============================================
// INITIALIZATION FUNCTIONS
// ============================================

/**
 * Initialize the application
 */
function initApp() {
    console.log('🚀 Digital Mental Twin Initializing...');

    // Initialize particles
    createParticles();

    // Set up event listeners
    setupEventListeners();

    // Initialize user data
    updateDashboardStats();

    // Auto-resize textarea
    setupAutoResize();

    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to Digital Mental Twin!', 'Your AI-powered mental health companion is ready to support you.', 'success');
    }, 1000);

    console.log('✅ App initialized successfully!');
}

/**
 * Create animated particles in background
 */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random size and position
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Random color from theme
        const colors = ['#2D5BFF', '#5B7FFF', '#00D4AA', '#FF6B9D', '#FFB800'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 20}s`;

        particlesContainer.appendChild(particle);
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Login
    loginSubmitBtn.addEventListener('click', handleLogin);

    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    pageDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const page = dot.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextPage = btn.getAttribute('data-next');
            navigateToPage(nextPage);
        });
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const backPage = btn.getAttribute('data-back');
            if (backPage) navigateToPage(backPage);
        });
    });

    // Chat
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.getAttribute('data-message');
            messageInput.value = message;
            sendMessage();
        });
    });

    // Voice input
    voiceInputBtn.addEventListener('click', toggleVoiceInput);
    startVoiceBtn.addEventListener('click', startVoiceRecognition);

    // Exercises
    exerciseCards.forEach(card => {
        const startBtn = card.querySelector('.exercise-btn.start');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const exerciseName = startBtn.getAttribute('data-exercise');
                startExercise(exerciseName);
            });
        }

        // Add filter functionality to history page
        const filterBtns = document.querySelectorAll('.history-filters .category-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterHistory(btn.getAttribute('data-filter'));
            });
        });

        // Add filter functionality to mindfulness page
        const categoryBtns = document.querySelectorAll('.exercises-categories .category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterExercises(btn.getAttribute('data-category'));
            });
        });
    });

    // Exercise player controls
    pauseBtn.addEventListener('click', toggleExercisePause);
    stopBtn.addEventListener('click', stopExercise);

    // Settings
    document.getElementById('saveSettingsBtn')?.addEventListener('click', saveSettings);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

    // Profile button
    document.getElementById('profileBtn')?.addEventListener('click', () => {
        showNotification('Profile', 'Profile features coming soon!', 'info');
    });
}

/**
 * Setup auto-resize for textarea
 */
function setupAutoResize() {
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

// ============================================
// PAGE NAVIGATION
// ============================================

/**
 * Navigate to a specific page
 * @param {string} pageId - Page to navigate to
 */
function navigateToPage(pageId) {
    if (!AppState.pages.includes(pageId)) return;

    // Hide all pages
    Object.values(pages).forEach(page => {
        if (page) {
            page.classList.remove('active');
        }
    });

    // Show target page
    if (pages[pageId]) {
        pages[pageId].classList.add('active');
        AppState.currentPage = pageId;

        // Update page dots
        updatePageDots(pageId);

        // Update navigation buttons
        updateNavButtons(pageId);

        // Update page title in header
        updatePageTitle(pageId);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        console.log(`📄 Navigated to: ${pageId}`);
    }
}

/**
 * Update active page dots
 * @param {string} pageId - Current page
 */
function updatePageDots(pageId) {
    pageDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-page') === pageId) {
            dot.classList.add('active');
        }
    });
}

/**
 * Update navigation buttons state
 * @param {string} pageId - Current page
 */
function updateNavButtons(pageId) {
    // Update main navigation buttons
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        }
    });

    // Update next/back buttons based on page
    const pageIndex = AppState.pages.indexOf(pageId);

    // Disable back button on first page (dashboard)
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        if (pageId === 'dashboard') {
            backBtn.classList.add('disabled');
        } else {
            backBtn.classList.remove('disabled');
        }
    }

    // Disable next button on last page (settings)
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        if (pageId === 'settings') {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
}

/**
 * Update page title based on current page
 * @param {string} pageId - Current page
 */
function updatePageTitle(pageId) {
    const titles = {
        dashboard: 'Dashboard',
        history: 'History',
        mindfulness: 'Mindfulness',
        analytics: 'Analytics',
        settings: 'Settings'
    };

    // This would update the document title
    if (titles[pageId]) {
        document.title = `Digital Mental Twin - ${titles[pageId]}`;
    }
}

// ============================================
// LOGIN & AUTHENTICATION
// ============================================

/**
 * Handle user login
 */
function handleLogin() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!username || !email || !password) {
        showNotification('Login Error', 'Please fill in all fields', 'error');
        return;
    }

    // Show loading
    showLoading(true);

    // Simulate API call
    setTimeout(() => {
        // Update user data
        AppState.userData.username = username;
        AppState.userData.email = email;
        AppState.isLoggedIn = true;

        // Update dashboard with user data
        updateDashboardStats();

        // Navigate to dashboard
        navigateToPage('dashboard');

        // Hide loading
        showLoading(false);

        // Show welcome message
        showNotification('Login Successful', `Welcome back, ${username}!`, 'success');

        // Add welcome message to chat
        addMessageToChat('ai', `Welcome back, ${username}! I'm here to support your mental wellbeing journey. How are you feeling today?`);

        console.log(`👤 User logged in: ${username}`);
    }, 1500);
}

/**
 * Handle user logout
 */
function handleLogout() {
    showLoading(true);

    setTimeout(() => {
        AppState.isLoggedIn = false;
        AppState.currentPage = 'login';

        // Reset to login page
        navigateToPage('login');

        // Clear chat
        chatMessages.innerHTML = `
            <div class="message ai">
                <div class="message-avatar ai">AI</div>
                <div class="message-content">
                    <div class="message-bubble">
                        Hello! I'm your Digital Mental Twin - a personalized AI companion designed to support your mental wellbeing. I use advanced natural language understanding and evidence-based therapeutic frameworks to provide meaningful support.
                        <br><br>
                        How are you feeling today? You can type or use voice input for a more natural conversation.
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            </div>
        `;

        showLoading(false);
        showNotification('Logged Out', 'You have been successfully logged out.', 'info');

        console.log('👤 User logged out');
    }, 1000);
}

// ============================================
// CHAT FUNCTIONALITY
// ============================================

/**
 * Send a message in the chat
 */
function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) return;

    // Add user message to chat
    addMessageToChat('user', message);

    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response after delay
    setTimeout(() => {
        // Remove typing indicator
        removeTypingIndicator();

        // Generate AI response
        const aiResponse = generateAIResponse(message);

        // Add AI response to chat
        addMessageToChat('ai', aiResponse);

        // Update conversation count
        updateConversationCount();

        // Scroll to bottom
        scrollChatToBottom();
    }, 1500 + Math.random() * 1000);
}

/**
 * Add a message to the chat
 * @param {string} sender - 'user' or 'ai'
 * @param {string} message - Message text
 */
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-avatar ${sender}">${sender === 'ai' ? 'AI' : 'You'}</div>
        <div class="message-content">
            <div class="message-bubble">${message}</div>
            <div class="message-time">${time}</div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);

    // Animate message entry
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0) scale(1)';
    }, 10);

    // Scroll to bottom
    scrollChatToBottom();
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai typing';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
        <div class="message-avatar ai">AI</div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;

    // Add typing indicator styles
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .typing-dots span {
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typingAnimation {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    chatMessages.appendChild(typingDiv);
    scrollChatToBottom();
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Scroll chat to bottom
 */
function scrollChatToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Generate AI response based on user input
 * @param {string} userMessage - User's message
 * @returns {string} AI response
 */
function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Define response patterns
    const responses = {
        greetings: [
            "Hello! I'm here to listen. How has your day been so far?",
            "Hi there! I'm glad you're here. What's on your mind today?",
            "Welcome! I'm ready to support you. How are you feeling?"
        ],
        anxious: [
            "It sounds like you're feeling anxious. Remember to take deep breaths - try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8.",
            "Anxiety can feel overwhelming. Would you like to try a quick grounding exercise? Focus on 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
            "I hear that you're feeling anxious. This is completely normal. Let's work through this together - what specifically is causing these feelings?"
        ],
        stressed: [
            "Stress can really take a toll. Let's break down what's overwhelming you into smaller, manageable pieces.",
            "When stress feels heavy, remember to prioritize self-care. Even 5 minutes of mindful breathing can make a difference.",
            "I understand you're feeling stressed. Would it help to talk through what's specifically causing this stress?"
        ],
        sad: [
            "I'm sorry to hear you're feeling down. Remember that emotions are temporary, and it's okay to not be okay.",
            "Would you like to try a gratitude exercise? Sometimes focusing on small positive things can help shift perspective.",
            "Your feelings are valid. Is there something specific that's contributing to these feelings that you'd like to discuss?"
        ],
        motivation: [
            "Sometimes starting is the hardest part. Try committing to just 5 minutes of activity - you might find momentum builds from there.",
            "What's one small step you could take right now toward your goal? Even tiny progress is still progress.",
            "Remember why this is important to you. Visualize how you'll feel after you've accomplished it."
        ],
        sleep: [
            "Sleep issues are common. Have you tried establishing a consistent bedtime routine? Avoiding screens an hour before bed can really help.",
            "A body scan meditation before bed might help you relax. Would you like me to guide you through one?",
            "Sleep patterns can affect our mental health. What specifically about your sleep would you like to improve?"
        ],
        default: [
            "Thank you for sharing that with me. Can you tell me more about how that makes you feel?",
            "I appreciate you opening up about this. What would be most helpful for you right now?",
            "I'm here to listen and support you. Is there a specific aspect you'd like to explore further?"
        ]
    };

    // Determine which response category to use
    let category = 'default';

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        category = 'greetings';
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('nervous')) {
        category = 'anxious';
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm') || lowerMessage.includes('pressure')) {
        category = 'stressed';
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('depress') || lowerMessage.includes('down')) {
        category = 'sad';
    } else if (lowerMessage.includes('motivat') || lowerMessage.includes('energy') || lowerMessage.includes('tired')) {
        category = 'motivation';
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('exhaust')) {
        category = 'sleep';
    }

    // Select random response from category
    const categoryResponses = responses[category];
    const randomIndex = Math.floor(Math.random() * categoryResponses.length);

    return categoryResponses[randomIndex];
}

/**
 * Update conversation count
 */
function updateConversationCount() {
    AppState.userData.conversationCount++;
    document.getElementById('conversationCount').textContent = AppState.userData.conversationCount;

    // Randomly update mood sometimes
    if (Math.random() > 0.7) {
        updateMood();
    }
}

// ============================================
// VOICE RECOGNITION
// ============================================

/**
 * Toggle voice input mode
 */
function toggleVoiceInput() {
    if (AppState.isVoiceListening) {
        stopVoiceRecognition();
    } else {
        startVoiceRecognition();
    }
}

/**
 * Start voice recognition
 */
function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        showNotification('Voice Input', 'Voice recognition is not supported in your browser.', 'warning');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Update UI
    startVoiceBtn.classList.add('listening');
    voiceFeedback.textContent = 'Listening... Speak now.';
    voiceFeedback.classList.add('active');
    AppState.isVoiceListening = true;

    // Show accuracy display
    voiceAccuracy.style.display = 'flex';

    recognition.onstart = function () {
        console.log('🎤 Voice recognition started');
    };

    recognition.onresult = function (event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // Update message input with interim results
        if (interimTranscript) {
            messageInput.value = interimTranscript;
            simulateAccuracy(50 + Math.random() * 50);
        }

        // Process final result
        if (finalTranscript) {
            messageInput.value = finalTranscript;
            simulateAccuracy(95);

            // Auto-send after a short delay
            setTimeout(() => {
                sendMessage();
            }, 1000);
        }
    };

    recognition.onerror = function (event) {
        console.error('Voice recognition error:', event.error);
        showNotification('Voice Input', `Error: ${event.error}`, 'error');
        stopVoiceRecognition();
    };

    recognition.onend = function () {
        console.log('🎤 Voice recognition ended');
        stopVoiceRecognition();
    };

    // Store recognition instance for stopping
    AppState.voiceRecognition = recognition;

    try {
        recognition.start();
    } catch (error) {
        console.error('Failed to start voice recognition:', error);
        showNotification('Voice Input', 'Failed to start voice recognition.', 'error');
        stopVoiceRecognition();
    }
}

/**
 * Stop voice recognition
 */
function stopVoiceRecognition() {
    if (AppState.voiceRecognition) {
        try {
            AppState.voiceRecognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }

    // Update UI
    startVoiceBtn.classList.remove('listening');
    voiceFeedback.textContent = '';
    voiceFeedback.classList.remove('active');
    voiceAccuracy.style.display = 'none';
    AppState.isVoiceListening = false;
}

/**
 * Simulate voice recognition accuracy
 * @param {number} accuracy - Accuracy percentage
 */
function simulateAccuracy(accuracy) {
    const clampedAccuracy = Math.min(100, Math.max(0, accuracy));
    accuracyFill.style.width = `${clampedAccuracy}%`;
    accuracyValue.textContent = `${Math.round(clampedAccuracy)}%`;

    // Update color based on accuracy
    if (clampedAccuracy >= 80) {
        accuracyValue.className = 'accuracy-value accuracy-high';
    } else if (clampedAccuracy >= 60) {
        accuracyValue.className = 'accuracy-value accuracy-medium';
    } else {
        accuracyValue.className = 'accuracy-value accuracy-low';
    }
}

// ============================================
// MINDFULNESS EXERCISES
// ============================================

/**
 * Start a mindfulness exercise
 * @param {string} exerciseName - Name of the exercise
 */
function startExercise(exerciseName) {
    AppState.currentExercise = exerciseName;
    AppState.isExerciseActive = true;
    AppState.remainingTime = 300; // 5 minutes

    // Update player UI
    playerExerciseTitle.textContent = exerciseName;
    playerExerciseDesc.textContent = `Follow the guided ${exerciseName.toLowerCase()} exercise`;

    // Set exercise-specific instructions
    const instructions = getExerciseInstructions(exerciseName);
    playerInstructions.textContent = instructions.initial;

    // Show player
    exercisePlayer.classList.add('active');

    // Start timer
    startExerciseTimer();

    // Update instructions periodically
    let instructionIndex = 0;
    AppState.instructionInterval = setInterval(() => {
        instructionIndex = (instructionIndex + 1) % instructions.steps.length;
        playerInstructions.textContent = instructions.steps[instructionIndex];
    }, 10000); // Change every 10 seconds

    // Show notification
    showNotification('Exercise Started', `${exerciseName} has begun. Find a comfortable position.`, 'success');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Get instructions for a specific exercise
 * @param {string} exerciseName - Name of the exercise
 * @returns {Object} Exercise instructions
 */
function getExerciseInstructions(exerciseName) {
    const exercises = {
        '4-7-8 Breathing': {
            initial: 'Find a comfortable seated position. Close your eyes if that feels comfortable.',
            steps: [
                'Inhale quietly through your nose for 4 seconds...',
                'Hold your breath for 7 seconds...',
                'Exhale completely through your mouth for 8 seconds...',
                'Repeat this cycle. Focus on the rhythm of your breath.',
                'Notice how your body feels with each breath.',
                'Allow any tension to release with each exhale.'
            ]
        },
        'Body Scan Meditation': {
            initial: 'Lie down or sit comfortably. Close your eyes.',
            steps: [
                'Bring awareness to your feet... Notice any sensations.',
                'Move your attention to your ankles and calves...',
                'Now focus on your knees and thighs...',
                'Bring awareness to your hips and pelvis...',
                'Notice your abdomen and lower back...',
                'Focus on your chest and upper back...',
                'Bring attention to your shoulders and arms...',
                'Notice your hands and fingers...',
                'Focus on your neck and throat...',
                'Bring awareness to your face and head...',
                'Now feel your entire body as a whole...'
            ]
        },
        'Peaceful Beach Visualization': {
            initial: 'Close your eyes and imagine yourself on a beautiful beach.',
            steps: [
                'See the clear blue sky above you...',
                'Notice the gentle waves rolling onto the shore...',
                'Feel the warm sand beneath your feet...',
                'Hear the seagulls calling in the distance...',
                'Smell the fresh ocean air...',
                'Feel the gentle breeze on your skin...',
                'Watch the sunlight sparkling on the water...',
                'Notice how peaceful and relaxed you feel...'
            ]
        },
        'Box Breathing': {
            initial: 'Sit comfortably with your back straight.',
            steps: [
                'Inhale through your nose for 4 seconds...',
                'Hold your breath for 4 seconds...',
                'Exhale slowly for 4 seconds...',
                'Hold empty for 4 seconds, then repeat...',
                'Focus on creating equal lengths for each phase.',
                'Notice how this rhythm calms your nervous system.'
            ]
        },
        '5-4-3-2-1 Grounding': {
            initial: 'Take a moment to notice your surroundings.',
            steps: [
                'Name 5 things you can see around you...',
                'Notice 4 things you can feel (textures, temperature)...',
                'Identify 3 things you can hear...',
                'Notice 2 things you can smell...',
                'Identify 1 thing you can taste...',
                'Take a deep breath. Notice how you feel now.'
            ]
        },
        'Progressive Muscle Relaxation': {
            initial: 'Get comfortable. We\'ll tense and relax each muscle group.',
            steps: [
                'Tense your feet for 5 seconds... then relax.',
                'Tense your calves for 5 seconds... then relax.',
                'Tense your thighs for 5 seconds... then relax.',
                'Tense your glutes for 5 seconds... then relax.',
                'Tense your abdomen for 5 seconds... then relax.',
                'Tense your chest for 5 seconds... then relax.',
                'Tense your back for 5 seconds... then relax.',
                'Tense your shoulders for 5 seconds... then relax.',
                'Tense your arms for 5 seconds... then relax.',
                'Tense your hands for 5 seconds... then relax.',
                'Tense your neck for 5 seconds... then relax.',
                'Tense your face for 5 seconds... then relax.'
            ]
        }
    };

    return exercises[exerciseName] || {
        initial: 'Find a comfortable position and begin the exercise.',
        steps: ['Breathe deeply and focus on the present moment.']
    };
}

/**
 * Start the exercise timer
 */
function startExerciseTimer() {
    updateTimerDisplay();

    AppState.exerciseTimer = setInterval(() => {
        if (AppState.remainingTime > 0) {
            AppState.remainingTime--;
            updateTimerDisplay();
        } else {
            finishExercise();
        }
    }, 1000);
}

/**
 * Update the timer display
 */
function updateTimerDisplay() {
    const minutes = Math.floor(AppState.remainingTime / 60);
    const seconds = AppState.remainingTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Toggle exercise pause/play
 */
function toggleExercisePause() {
    if (AppState.isExercisePaused) {
        // Resume
        AppState.isExercisePaused = false;
        startExerciseTimer();
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        showNotification('Exercise Resumed', 'Exercise has been resumed.', 'info');
    } else {
        // Pause
        AppState.isExercisePaused = true;
        clearInterval(AppState.exerciseTimer);
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        showNotification('Exercise Paused', 'Exercise has been paused.', 'warning');
    }
}

/**
 * Stop the current exercise
 */
function stopExercise() {
    if (AppState.exerciseTimer) {
        clearInterval(AppState.exerciseTimer);
    }

    if (AppState.instructionInterval) {
        clearInterval(AppState.instructionInterval);
    }

    // Reset state
    AppState.isExerciseActive = false;
    AppState.currentExercise = null;
    AppState.isExercisePaused = false;

    // Hide player
    exercisePlayer.classList.remove('active');

    // Allow body scroll
    document.body.style.overflow = '';

    // Show completion notification
    showNotification('Exercise Completed', 'Great job completing your mindfulness practice!', 'success');

    // Update wellness score
    updateWellnessScore(2);
}

/**
 * Finish exercise normally
 */
function finishExercise() {
    stopExercise();

    // Add special completion message
    showNotification('Exercise Completed', 'Excellent work! Regular practice builds resilience.', 'success');

    // Update wellness score more for completion
    updateWellnessScore(5);
}

// ============================================
// FILTERING FUNCTIONALITY
// ============================================

/**
 * Filter history items by category
 * @param {string} filter - Filter category
 */
function filterHistory(filter) {
    const cards = document.querySelectorAll('#historyPage .exercise-card');
    const filterBtns = document.querySelectorAll('.history-filters .category-btn');

    // Update active filter button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });

    // Filter cards
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'flex';
        } else {
            // This is a simplified filter - in a real app, cards would have data attributes
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(filter)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });

    // Show notification
    showNotification('Filter Applied', `Showing ${filter} conversations`, 'info');
}

/**
 * Filter exercises by category
 * @param {string} category - Exercise category
 */
function filterExercises(category) {
    const cards = document.querySelectorAll('#mindfulnessPage .exercise-card');
    const categoryBtns = document.querySelectorAll('.exercises-categories .category-btn');

    // Update active category button
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });

    // Filter cards
    let visibleCount = 0;
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show notification
    showNotification('Filter Applied', `Showing ${visibleCount} ${category} exercises`, 'info');
}

// ============================================
// DASHBOARD UPDATES
// ============================================

/**
 * Update dashboard statistics
 */
function updateDashboardStats() {
    // Update all stat values
    document.getElementById('moodValue').textContent = AppState.userData.mood;
    document.getElementById('conversationCount').textContent = AppState.userData.conversationCount;
    document.getElementById('wellnessScore').textContent = `${AppState.userData.wellnessScore}%`;
    document.getElementById('insightsCount').textContent = AppState.userData.insightsCount;
}

/**
 * Update user mood randomly
 */
function updateMood() {
    const moods = ['Optimistic', 'Calm', 'Focused', 'Content', 'Energized', 'Balanced'];
    const previousMood = AppState.userData.mood;
    const newMood = moods[Math.floor(Math.random() * moods.length)];

    // Only update if different
    if (newMood !== previousMood) {
        AppState.userData.mood = newMood;
        document.getElementById('moodValue').textContent = newMood;

        // Show subtle notification
        showNotification('Mood Update', `Your mood is now ${newMood.toLowerCase()}`, 'info', 3000);
    }
}

/**
 * Update wellness score
 * @param {number} points - Points to add
 */
function updateWellnessScore(points) {
    const newScore = Math.min(100, AppState.userData.wellnessScore + points);

    if (newScore !== AppState.userData.wellnessScore) {
        AppState.userData.wellnessScore = newScore;
        document.getElementById('wellnessScore').textContent = `${newScore}%`;

        // Animate the update
        const wellnessElement = document.getElementById('wellnessScore');
        wellnessElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            wellnessElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// ============================================
// SETTINGS FUNCTIONALITY
// ============================================

/**
 * Save user settings
 */
function saveSettings() {
    showLoading(true);

    // Simulate API call
    setTimeout(() => {
        showLoading(false);
        showNotification('Settings Saved', 'Your preferences have been updated successfully.', 'success');

        // Update UI based on settings
        updateUIBasedOnSettings();
    }, 1500);
}

/**
 * Update UI based on saved settings
 */
function updateUIBasedOnSettings() {
    // This would update the UI based on actual settings
    console.log('UI updated based on settings');
}

// ============================================
// UI UTILITIES
// ============================================

/**
 * Show loading overlay
 * @param {boolean} show - Whether to show or hide
 */
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

/**
 * Show notification
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(title, message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
        type === 'error' ? 'fa-exclamation-circle' :
            type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;

    notificationContainer.appendChild(notification);

    // Add showing class for progress bar animation
    setTimeout(() => {
        notification.classList.add('showing');
    }, 10);

    // Auto-remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%) scale(0.8)';

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);

    // Store notification
    AppState.notifications.push({
        title,
        message,
        type,
        timestamp: new Date()
    });

    // Limit notifications stored
    if (AppState.notifications.length > 50) {
        AppState.notifications.shift();
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Handle page refresh
window.addEventListener('beforeunload', () => {
    if (AppState.isExerciseActive) {
        return 'You have an active mindfulness exercise. Are you sure you want to leave?';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close exercise player
    if (e.key === 'Escape' && AppState.isExerciseActive) {
        stopExercise();
    }

    // Ctrl/Cmd + / to focus chat input
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        messageInput.focus();
    }

    // Ctrl/Cmd + K to start voice input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleVoiceInput();
    }
});