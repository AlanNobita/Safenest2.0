// Notification System for SafeNest
class NotificationSystem {
    constructor() {
        this.container = null;
        this.activityFeed = null;
        this.activities = [];
        this.maxNotifications = 5;
        this.maxActivities = 20;
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.createActivityFeed();
        this.setupEventListeners();
        this.loadActivities();
    }

    // Notification Container Management
    createNotificationContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    // Activity Feed Management
    createActivityFeed() {
        // Check if activity feed already exists
        const existingFeed = document.getElementById('activity-feed');
        if (existingFeed) {
            this.activityFeed = existingFeed;
            return;
        }

        // Create activity feed component
        const activityFeedHTML = `
            <div class="activity-feed" id="activity-feed">
                <div class="activity-feed-header">
                    <h3 class="activity-feed-title">Recent Activity</h3>
                    <button class="activity-feed-clear" onclick="notificationSystem.clearActivities()">
                        <i class="fas fa-trash-alt"></i> Clear
                    </button>
                </div>
                <div class="activity-list" id="activity-list">
                    <!-- Activities will be added here -->
                </div>
            </div>
        `;

        // Create a floating activity feed button
        const feedButton = document.createElement('button');
        feedButton.className = 'theme-toggle';
        feedButton.style.position = 'fixed';
        feedButton.style.bottom = '20px';
        feedButton.style.right = '20px';
        feedButton.style.zIndex = '9999';
        feedButton.innerHTML = '<i class="fas fa-bell"></i>';
        feedButton.title = 'View Activity Feed';
        
        feedButton.addEventListener('click', () => {
            this.toggleActivityFeed();
        });

        document.body.appendChild(feedButton);
    }

    toggleActivityFeed() {
        if (this.activityFeed) {
            this.activityFeed.style.display = 
                this.activityFeed.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Core Notification Methods
    show(title, message, type = 'info', duration = 5000) {
        const notification = this.createNotification(title, message, type);
        this.addNotification(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }
    }

    createNotification(title, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icons[type] || icons.info}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="notificationSystem.removeNotification(this.parentElement)">
                <i class="fas fa-times"></i>
            </button>
            <div class="notification-progress"></div>
        `;

        return notification;
    }

    addNotification(notification) {
        // Remove oldest notification if we've reached the limit
        if (this.container.children.length >= this.maxNotifications) {
            this.container.removeChild(this.container.firstChild);
        }

        this.container.appendChild(notification);
    }

    removeNotification(notification) {
        notification.style.animation = 'slideOutNotification 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }

    // Activity Feed Methods
    addActivity(type, title, description, icon = null) {
        const activity = {
            id: Date.now(),
            type,
            title,
            description,
            icon: icon || this.getDefaultIcon(type),
            timestamp: new Date()
        };

        this.activities.unshift(activity);
        
        // Keep only the most recent activities
        if (this.activities.length > this.maxActivities) {
            this.activities = this.activities.slice(0, this.maxActivities);
        }

        this.saveActivities();
        this.renderActivities();
        this.showNotificationForActivity(activity);
    }

    getDefaultIcon(type) {
        const icons = {
            'device-control': 'fa-lightbulb',
            'security': 'fa-shield-alt',
            'energy': 'fa-bolt',
            'system': 'fa-cog',
            'user': 'fa-user',
            'ai': 'fa-robot'
        };
        return icons[type] || 'fa-info-circle';
    }

    showNotificationForActivity(activity) {
        // Don't show notification for system activities that are too frequent
        if (activity.type === 'system' && this.isRecentSystemActivity()) {
            return;
        }

        const titles = {
            'device-control': 'Device Control',
            'security': 'Security Alert',
            'energy': 'Energy Update',
            'system': 'System Update',
            'user': 'User Activity',
            'ai': 'AI Assistant'
        };

        this.show(
            titles[activity.type] || 'Activity',
            activity.description,
            activity.type === 'security' ? 'warning' : 'info',
            3000
        );
    }

    isRecentSystemActivity() {
        const now = Date.now();
        const recentThreshold = 5000; // 5 seconds
        
        return this.activities.some(activity => {
            return activity.type === 'system' && 
                   (now - activity.timestamp.getTime()) < recentThreshold;
        });
    }

    renderActivities() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;

        activityList.innerHTML = '';

        if (this.activities.length === 0) {
            activityList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }

        this.activities.forEach((activity, index) => {
            const activityElement = document.createElement('div');
            activityElement.className = `activity-item ${activity.type}`;
            activityElement.style.animationDelay = `${index * 0.05}s`;
            
            activityElement.innerHTML = `
                <div class="activity-item-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-item-content">
                    <div class="activity-item-title">${activity.title}</div>
                    <div class="activity-item-description">${activity.description}</div>
                    <div class="activity-item-time">${this.formatTime(activity.timestamp)}</div>
                </div>
            `;

            activityList.appendChild(activityElement);
        });
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }

    clearActivities() {
        this.activities = [];
        this.saveActivities();
        this.renderActivities();
        this.show('Cleared', 'All activities have been cleared', 'info');
    }

    saveActivities() {
        try {
            localStorage.setItem('safenest_activities', JSON.stringify(this.activities));
        } catch (e) {
            console.error('Failed to save activities:', e);
        }
    }

    loadActivities() {
        try {
            const saved = localStorage.getItem('safenest_activities');
            if (saved) {
                this.activities = JSON.parse(saved);
                this.renderActivities();
            }
        } catch (e) {
            console.error('Failed to load activities:', e);
            this.activities = [];
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Listen for custom events from other parts of the application
        document.addEventListener('safenest:notification', (event) => {
            this.show(event.detail.title, event.detail.message, event.detail.type);
        });

        document.addEventListener('safenest:activity', (event) => {
            this.addActivity(
                event.detail.type,
                event.detail.title,
                event.detail.description,
                event.detail.icon
            );
        });

        // Listen for system events
        window.addEventListener('online', () => {
            this.addActivity('system', 'Connection Restored', 'You are back online');
        });

        window.addEventListener('offline', () => {
            this.addActivity('system', 'Connection Lost', 'You appear to be offline');
        });

        // Listen for visibility changes to pause/resume notifications
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseNotifications = true;
            } else {
                this.pauseNotifications = false;
            }
        });
    }

    // Convenience Methods
    success(title, message, duration) {
        this.show(title, message, 'success', duration);
    }

    warning(title, message, duration) {
        this.show(title, message, 'warning', duration);
    }

    error(title, message, duration) {
        this.show(title, message, 'error', duration);
    }

    info(title, message, duration) {
        this.show(title, message, 'info', duration);
    }

    // Device Control Notifications
    deviceControl(device, action, status = 'success') {
        const messages = {
            on: `${device} turned on`,
            off: `${device} turned off`,
            toggle: `${device} ${action === 'on' ? 'turned on' : 'turned off'}`,
            status: `${device} status updated`,
            error: `Failed to control ${device}`
        };

        this.addActivity('device-control', device, messages[action] || messages.status);
        this.show(device, messages[action] || messages.status, status);
    }

    // Security Notifications
    securityAlert(type, message) {
        const titles = {
            breach: 'Security Breach Detected',
            intrusion: 'Intrusion Alert',
            access: 'Unauthorized Access',
            system: 'Security System Update'
        };

        this.addActivity('security', titles[type] || 'Security Alert', message);
        this.show(titles[type] || 'Security Alert', message, 'warning');
    }

    // Energy Notifications
    energyUpdate(type, data) {
        const messages = {
            high: 'Energy usage is higher than normal',
            optimization: 'Energy optimization applied',
            solar: 'Solar panel efficiency updated',
            cost: 'Energy cost estimate updated'
        };

        this.addActivity('energy', 'Energy Update', messages[type] || data);
        this.show('Energy Update', messages[type] || data, 'info');
    }
}

// Initialize the notification system
const notificationSystem = new NotificationSystem();

// Make it globally available
window.notificationSystem = notificationSystem;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}