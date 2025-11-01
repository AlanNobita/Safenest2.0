// Dashboard Charts and Data Visualization for SafeNest
class DashboardCharts {
    constructor() {
        this.charts = new Map();
        this.data = {
            energy: [],
            devices: [],
            security: [],
            activity: []
        };
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.initializeCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    // Load dashboard data
    loadDashboardData() {
        // Mock data - in a real implementation, this would come from an API
        this.data.energy = this.generateEnergyData();
        this.data.devices = this.generateDeviceData();
        this.data.security = this.generateSecurityData();
        this.data.activity = this.generateActivityData();
    }

    generateEnergyData() {
        const data = [];
        const now = new Date();
        
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now - i * 60 * 60 * 1000);
            data.push({
                time: time.getHours() + ':00',
                usage: Math.random() * 5 + 2,
                cost: Math.random() * 0.5 + 0.1
            });
        }
        
        return data;
    }

    generateDeviceData() {
        return [
            { name: 'Living Room Lights', status: 'online', usage: 75, efficiency: 92 },
            { name: 'Kitchen Appliances', status: 'online', usage: 60, efficiency: 85 },
            { name: 'HVAC System', status: 'online', usage: 45, efficiency: 78 },
            { name: 'Security Cameras', status: 'online', usage: 30, efficiency: 95 },
            { name: 'Entertainment System', status: 'offline', usage: 0, efficiency: 0 },
            { name: 'Home Office', status: 'online', usage: 40, efficiency: 88 }
        ];
    }

    generateSecurityData() {
        return [
            { time: '00:00', events: 0 },
            { time: '04:00', events: 0 },
            { time: '08:00', events: 2 },
            { time: '12:00', events: 1 },
            { time: '16:00', events: 3 },
            { time: '20:00', events: 5 },
            { time: '24:00', events: 1 }
        ];
    }

    generateActivityData() {
        const activities = [
            { type: 'device', icon: 'fa-lightbulb', title: 'Lights turned on', description: 'Living room lights activated', time: '2 min ago' },
            { type: 'security', icon: 'fa-shield-alt', title: 'Security check', description: 'Front door camera armed', time: '5 min ago' },
            { type: 'energy', icon: 'fa-bolt', title: 'Energy optimization', description: 'AC temperature adjusted', time: '10 min ago' },
            { type: 'ai', icon: 'fa-robot', title: 'AI Assistant', description: 'Answered user question', time: '15 min ago' },
            { type: 'automation', icon: 'fa-cogs', title: 'Automation triggered', description: 'Morning routine started', time: '30 min ago' }
        ];
        
        return activities;
    }

    // Initialize all charts
    initializeCharts() {
        this.createEnergyChart();
        this.createDeviceChart();
        this.createSecurityChart();
        this.renderActivityFeed();
        this.renderDeviceGrid();
        this.renderQuickActions();
    }

    // Create energy usage chart
    createEnergyChart() {
        const container = document.getElementById('energyChart');
        if (!container) return;

        // Create SVG for the chart
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 400 200');
        svg.style.overflow = 'visible';

        // Create gradient
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'energyGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#00ffff');
        stop1.setAttribute('stop-opacity', '0.8');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#00ffff');
        stop2.setAttribute('stop-opacity', '0.1');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);

        // Create chart path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'url(#energyGradient)');
        path.setAttribute('stroke', '#00ffff');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill-opacity', '0.3');

        // Create data points
        const points = this.data.energy.map((d, i) => {
            const x = (i / (this.data.energy.length - 1)) * 380 + 10;
            const y = 200 - (d.usage / 7) * 180;
            return `${x},${y}`;
        }).join(' ');

        path.setAttribute('d', `M10,200 L${points} L390,200 Z`);
        svg.appendChild(path);

        // Add data point circles
        this.data.energy.forEach((d, i) => {
            const x = (i / (this.data.energy.length - 1)) * 380 + 10;
            const y = 200 - (d.usage / 7) * 180;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', '#00ffff');
            circle.setAttribute('stroke', '#ffffff');
            circle.setAttribute('stroke-width', '2');
            circle.style.cursor = 'pointer';
            
            // Add hover effect
            circle.addEventListener('mouseenter', () => {
                circle.setAttribute('r', '6');
                this.showTooltip(x, y, `${d.time}: ${d.usage.toFixed(1)} kWh`);
            });
            
            circle.addEventListener('mouseleave', () => {
                circle.setAttribute('r', '4');
                this.hideTooltip();
            });
            
            svg.appendChild(circle);
        });

        container.appendChild(svg);
        
        // Add chart title
        const title = document.createElement('div');
        title.className = 'chart-title';
        title.textContent = '24-Hour Energy Usage';
        container.parentElement.querySelector('.chart-header').insertBefore(title, container.parentElement.querySelector('.chart-actions'));
    }

    // Create device status chart
    createDeviceChart() {
        const container = document.getElementById('deviceChart');
        if (!container) return;

        // Create device status bars
        const totalDevices = this.data.devices.length;
        const onlineDevices = this.data.devices.filter(d => d.status === 'online').length;
        const offlineDevices = totalDevices - onlineDevices;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '200');
        svg.setAttribute('viewBox', '0 0 400 200');

        // Background bar
        const bgBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bgBar.setAttribute('x', '50');
        bgBar.setAttribute('y', '50');
        bgBar.setAttribute('width', '300');
        bgBar.setAttribute('height', '40');
        bgBar.setAttribute('rx', '20');
        bgBar.setAttribute('fill', 'rgba(255, 255, 255, 0.1)');
        bgBar.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
        svg.appendChild(bgBar);

        // Online devices bar
        const onlineWidth = (onlineDevices / totalDevices) * 300;
        const onlineBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        onlineBar.setAttribute('x', '50');
        onlineBar.setAttribute('y', '50');
        onlineBar.setAttribute('width', onlineWidth);
        onlineBar.setAttribute('height', '40');
        onlineBar.setAttribute('rx', '20');
        onlineBar.setAttribute('fill', '#10b981');
        svg.appendChild(onlineBar);

        // Text labels
        const onlineText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        onlineText.setAttribute('x', '200');
        onlineText.setAttribute('y', '75');
        onlineText.setAttribute('text-anchor', 'middle');
        onlineText.setAttribute('fill', '#ffffff');
        onlineText.setAttribute('font-size', '14');
        onlineText.setAttribute('font-weight', 'bold');
        onlineText.textContent = `${onlineDevices}/${totalDevices} Online`;
        svg.appendChild(onlineText);

        // Device icons
        this.data.devices.forEach((device, i) => {
            const x = 50 + (i * 45);
            const y = 120;
            
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            icon.setAttribute('cx', x);
            icon.setAttribute('cy', y);
            icon.setAttribute('r', '15');
            icon.setAttribute('fill', device.status === 'online' ? '#10b981' : '#ef4444');
            icon.setAttribute('stroke', '#ffffff');
            icon.setAttribute('stroke-width', '2');
            icon.style.cursor = 'pointer';
            
            // Add hover effect
            icon.addEventListener('mouseenter', () => {
                this.showDeviceTooltip(x, y, device);
            });
            
            icon.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
            
            svg.appendChild(icon);
            
            // Device label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', y + 35);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', '#ffffff');
            label.setAttribute('font-size', '10');
            label.textContent = device.name.split(' ')[0];
            svg.appendChild(label);
        });

        container.appendChild(svg);
    }

    // Create security events chart
    createSecurityChart() {
        const container = document.getElementById('securityChart');
        if (!container) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '200');
        svg.setAttribute('viewBox', '0 0 400 200');

        // Find max events for scaling
        const maxEvents = Math.max(...this.data.security.map(d => d.events));

        // Create bars
        this.data.security.forEach((data, i) => {
            const x = 50 + (i * 45);
            const barHeight = maxEvents > 0 ? (data.events / maxEvents) * 120 : 0;
            const y = 150 - barHeight;

            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', x);
            bar.setAttribute('y', y);
            bar.setAttribute('width', '30');
            bar.setAttribute('height', barHeight);
            bar.setAttribute('rx', '4');
            bar.setAttribute('fill', data.events > 0 ? '#ef4444' : '#10b981');
            svg.appendChild(bar);

            // Event count
            const count = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            count.setAttribute('x', x + 15);
            count.setAttribute('y', y - 5);
            count.setAttribute('text-anchor', 'middle');
            count.setAttribute('fill', '#ffffff');
            count.setAttribute('font-size', '12');
            count.setAttribute('font-weight', 'bold');
            count.textContent = data.events;
            svg.appendChild(count);

            // Time label
            const time = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            time.setAttribute('x', x + 15);
            time.setAttribute('y', 175);
            time.setAttribute('text-anchor', 'middle');
            time.setAttribute('fill', '#ffffff');
            time.setAttribute('font-size', '10');
            time.textContent = data.time;
            svg.appendChild(time);
        });

        container.appendChild(svg);
    }

    // Render activity feed
    renderActivityFeed() {
        const container = document.getElementById('activityFeed');
        if (!container) return;

        container.innerHTML = this.data.activity.map(activity => `
            <div class="activity-item ${activity.type}">
                <div class="activity-item-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-item-content">
                    <div class="activity-item-title">${activity.title}</div>
                    <div class="activity-item-description">${activity.description}</div>
                    <div class="activity-item-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    // Render device grid
    renderDeviceGrid() {
        const container = document.getElementById('deviceGrid');
        if (!container) return;

        container.innerHTML = this.data.devices.map(device => `
            <div class="device-status-card">
                <div class="device-header">
                    <div class="device-name">${device.name}</div>
                    <div class="device-status ${device.status}">
                        <span class="status-dot"></span>
                        ${device.status}
                    </div>
                </div>
                <div class="device-metrics">
                    <div class="device-metric">
                        <div class="device-metric-value">${device.usage}%</div>
                        <div class="device-metric-label">Usage</div>
                    </div>
                    <div class="device-metric">
                        <div class="device-metric-value">${device.efficiency}%</div>
                        <div class="device-metric-label">Efficiency</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render quick actions
    renderQuickActions() {
        const container = document.getElementById('quickActions');
        if (!container) return;

        const actions = [
            { icon: 'fa-cube', title: 'AI Architecture', description: 'Generate designs', color: '#00ffff' },
            { icon: 'fa-microphone', title: 'Voice Control', description: 'Smart commands', color: '#10b981' },
            { icon: 'fa-calculator', title: 'Energy Calculator', description: 'Usage analysis', color: '#f59e0b' },
            { icon: 'fa-hammer', title: 'Material Estimation', description: 'Cost planning', color: '#8b5cf6' },
            { icon: 'fa-users', title: 'Find Architects', description: 'Expert help', color: '#ec4899' },
            { icon: 'fa-comments', title: 'Live Consultation', description: 'Expert advice', color: '#6366f1' }
        ];

        container.innerHTML = actions.map(action => `
            <div class="quick-action-card" onclick="handleQuickAction('${action.title}')">
                <div class="quick-action-icon" style="color: ${action.color}">
                    <i class="fas ${action.icon}"></i>
                </div>
                <div class="quick-action-title">${action.title}</div>
                <div class="quick-action-description">${action.description}</div>
            </div>
        `).join('');
    }

    // Show tooltip
    showTooltip(x, y, text) {
        let tooltip = document.getElementById('chartTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'chartTooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--glass-bg);
                backdrop-filter: blur(10px);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-md);
                padding: var(--spacing-sm) var(--spacing-md);
                color: var(--text-primary);
                font-size: var(--font-size-sm);
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
                transition: opacity var(--transition-normal);
            `;
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.left = x + 'px';
        tooltip.style.top = (y - 40) + 'px';
        tooltip.style.opacity = '1';
    }

    // Show device tooltip
    showDeviceTooltip(x, y, device) {
        const text = `${device.name}\nStatus: ${device.status}\nUsage: ${device.usage}%\nEfficiency: ${device.efficiency}%`;
        this.showTooltip(x, y, text);
    }

    // Hide tooltip
    hideTooltip() {
        const tooltip = document.getElementById('chartTooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Chart refresh buttons
        document.querySelectorAll('.chart-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const chartId = btn.closest('.chart-container')?.id;
                if (chartId) {
                    this.refreshChart(chartId);
                }
            });
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Refresh chart data
    refreshChart(chartId) {
        // Simulate data refresh
        notificationSystem.info('Refreshing', `Updating ${chartId} data...`);
        
        // In a real implementation, this would fetch new data from the API
        setTimeout(() => {
            this.loadDashboardData();
            this.initializeCharts();
            notificationSystem.success('Success', `${chartId} data updated`);
        }, 1000);
    }

    // Handle resize
    handleResize() {
        // Reinitialize charts with new dimensions
        this.charts.forEach((chart, id) => {
            if (chart.resize) {
                chart.resize();
            }
        });
    }

    // Start real-time updates
    startRealTimeUpdates() {
        // Update energy data every 30 seconds
        setInterval(() => {
            this.updateEnergyData();
        }, 30000);

        // Update device status every 10 seconds
        setInterval(() => {
            this.updateDeviceStatus();
        }, 10000);

        // Update activity feed every 5 seconds
        setInterval(() => {
            this.updateActivityFeed();
        }, 5000);
    }

    // Update energy data
    updateEnergyData() {
        // Remove oldest data point
        this.data.energy.shift();
        
        // Add new data point
        const now = new Date();
        const newPoint = {
            time: now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0'),
            usage: Math.random() * 5 + 2,
            cost: Math.random() * 0.5 + 0.1
        };
        
        this.data.energy.push(newPoint);
        
        // Update chart
        this.createEnergyChart();
    }

    // Update device status
    updateDeviceStatus() {
        // Randomly update some device statuses
        this.data.devices.forEach(device => {
            if (Math.random() > 0.8) {
                device.status = device.status === 'online' ? 'offline' : 'online';
                device.usage = device.status === 'online' ? Math.floor(Math.random() * 80) + 20 : 0;
            }
        });
        
        // Update chart
        this.createDeviceChart();
        this.renderDeviceGrid();
    }

    // Update activity feed
    updateActivityFeed() {
        // Add new random activity
        const activities = [
            { type: 'device', icon: 'fa-lightbulb', title: 'Device changed', description: 'A device updated its status' },
            { type: 'security', icon: 'fa-shield-alt', title: 'Security check', description: 'System security verified' },
            { type: 'energy', icon: 'fa-bolt', title: 'Energy update', description: 'Energy usage optimized' },
            { type: 'ai', icon: 'fa-robot', title: 'AI activity', description: 'AI processed a request' },
            { type: 'automation', icon: 'fa-cogs', title: 'Automation', description: 'Automation rule triggered' }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const now = new Date();
        const timeAgo = Math.floor(Math.random() * 5) + 1;
        
        const newActivity = {
            ...randomActivity,
            time: `${timeAgo} min ago`
        };
        
        this.data.activity.unshift(newActivity);
        this.data.activity = this.data.activity.slice(0, 5); // Keep only last 5 activities
        
        this.renderActivityFeed();
    }
}

// Handle quick action clicks
function handleQuickAction(action) {
    notificationSystem.info('Action', `Opening ${action}...`);
    
    // In a real implementation, this would navigate to the appropriate page
    console.log('Quick action clicked:', action);
}

// Initialize dashboard charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const dashboardCharts = new DashboardCharts();
    
    // Make it globally accessible for debugging
    window.dashboardCharts = dashboardCharts;
    
    // Show welcome notification
    setTimeout(() => {
        notificationSystem.info('Dashboard Ready', 'Real-time data visualization loaded');
    }, 1000);
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardCharts;
}