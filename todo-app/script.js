// Task Manager Class
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentCategories = ['personal', 'work', 'shopping', 'health', 'other'];
        this.currentSort = 'newest';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTasks();
        this.updateStats();
        this.loadNotes();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Edit form submission
        document.getElementById('editTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditedTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
                this.updateFilterButtons(btn);
            });
        });

        // Category checkboxes
        document.querySelectorAll('.category-label input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateCategoryFilter();
            });
        });

        // Sort dropdown
        document.getElementById('sortTasks').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });

        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderTasks();
        });

        // Notes
        document.getElementById('saveNotes').addEventListener('click', () => {
            this.saveNotes();
        });

        // Modal controls
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.modal-cancel').addEventListener('click', () => {
            this.closeModal();
        });

        // Click outside modal to close
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Auto-save notes
        let notesTimeout;
        document.getElementById('quickNotes').addEventListener('input', () => {
            clearTimeout(notesTimeout);
            notesTimeout = setTimeout(() => {
                this.saveNotes();
            }, 1000);
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const category = document.getElementById('taskCategory').value;

        if (!title) return;

        const task = {
            id: this.generateId(),
            title,
            description,
            priority,
            dueDate,
            category,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.resetForm();
        this.showToast('Task added successfully!');
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description;
        document.getElementById('editTaskPriority').value = task.priority;
        document.getElementById('editTaskDueDate').value = task.dueDate;
        document.getElementById('editTaskCategory').value = task.category;

        this.openModal();
    }

    saveEditedTask() {
        const id = document.getElementById('editTaskId').value;
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        
        if (taskIndex === -1) return;

        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            title: document.getElementById('editTaskTitle').value.trim(),
            description: document.getElementById('editTaskDescription').value.trim(),
            priority: document.getElementById('editTaskPriority').value,
            dueDate: document.getElementById('editTaskDueDate').value,
            category: document.getElementById('editTaskCategory').value
        };

        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.closeModal();
        this.showToast('Task updated successfully!');
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showToast('Task deleted successfully!');
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showToast(task.completed ? 'Task completed!' : 'Task marked as pending');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderTasks();
    }

    updateFilterButtons(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    updateCategoryFilter() {
        const checkboxes = document.querySelectorAll('.category-label input:checked');
        this.currentCategories = Array.from(checkboxes).map(cb => cb.value);
        this.renderTasks();
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];

        // Apply status filter
        if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        } else if (this.currentFilter === 'pending') {
            filtered = filtered.filter(t => !t.completed);
        } else if (this.currentFilter === 'today') {
            const today = new Date().toDateString();
            filtered = filtered.filter(t => {
                if (!t.dueDate) return false;
                return new Date(t.dueDate).toDateString() === today;
            });
        }

        // Apply category filter
        filtered = filtered.filter(t => this.currentCategories.includes(t.category));

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(this.searchQuery) ||
                t.description.toLowerCase().includes(this.searchQuery)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'priority':
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'dueDate':
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'newest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return filtered;
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');

        // Add event listeners to task buttons
        tasksList.querySelectorAll('.task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = btn.dataset.taskId;
                const action = btn.dataset.action;

                switch (action) {
                    case 'complete':
                        this.toggleTask(taskId);
                        break;
                    case 'edit':
                        this.editTask(taskId);
                        break;
                    case 'delete':
                        this.deleteTask(taskId);
                        break;
                }
            });
        });
    }

    createTaskHTML(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        
        return `
            <div class="task-card priority-${task.priority} category-${task.category} ${task.completed ? 'completed' : ''} fade-in">
                <div class="task-header">
                    <div>
                        <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                        ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                    </div>
                </div>
                <div class="task-meta">
                    <span class="task-meta-item">
                        <i class="fas fa-flag"></i>
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span class="task-meta-item">
                        <i class="fas fa-folder"></i>
                        ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                    ${dueDate ? `
                        <span class="task-meta-item ${isOverdue ? 'overdue' : ''}">
                            <i class="fas fa-calendar"></i>
                            ${dueDate}
                        </span>
                    ` : ''}
                </div>
                <div class="task-actions">
                    <button class="task-btn complete" data-task-id="${task.id}" data-action="complete">
                        <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="task-btn edit" data-task-id="${task.id}" data-action="edit">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="task-btn delete" data-task-id="${task.id}" data-action="delete">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    resetForm() {
        document.getElementById('taskForm').reset();
        document.getElementById('taskPriority').value = 'medium';
        document.getElementById('taskCategory').value = 'personal';
    }

    openModal() {
        document.getElementById('taskModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('taskModal').classList.remove('active');
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    }

    saveNotes() {
        const notes = document.getElementById('quickNotes').value;
        localStorage.setItem('quickNotes', notes);
        this.showToast('Notes saved!');
    }

    loadNotes() {
        const saved = localStorage.getItem('quickNotes');
        if (saved) {
            document.getElementById('quickNotes').value = saved;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();

    // Add some animation to the background
    const createFloatingParticle = () => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 6 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.6)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '-1';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        const duration = Math.random() * 10000 + 10000;
        const horizontalMovement = (Math.random() - 0.5) * 200;
        
        particle.animate([
            { transform: 'translateY(0) translateX(0)', opacity: 0.6 },
            { transform: `translateY(-${window.innerHeight + 100}px) translateX(${horizontalMovement}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => particle.remove();
    };

    // Create particles periodically
    setInterval(createFloatingParticle, 2000);

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('taskModal');
            if (modal.classList.contains('active')) {
                taskManager.closeModal();
            }
        }
    });

    // Add drag and drop functionality for task reordering (future enhancement)
    console.log('TaskFlow app initialized successfully! 🚀');
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
