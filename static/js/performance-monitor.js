/**
 * SafeNest Performance Monitoring Script
 * Tracks Core Web Vitals, Performance Metrics, and User Interactions
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      timing: {},
      webVitals: {},
      userInteractions: {},
      errors: [],
      pageLoads: 0
    };
    
    this.init();
  }
  
  init() {
    // Track page load
    this.metrics.pageLoads++;
    
    // Initialize performance monitoring
    if ('PerformanceObserver' in window) {
      this.setupObservers();
    }
    
    // Track initial page load timing
    window.addEventListener('load', () => {
      this.trackPageLoadTiming();
    });
    
    // Track errors
    window.addEventListener('error', (event) => {
      this.trackError(event);
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: 'Unhandled Promise Rejection',
        error: event.reason,
        timestamp: Date.now()
      });
    });
    
    // Track user interactions
    this.trackUserInteractions();
    
    // Send initial metrics
    setTimeout(() => {
      this.sendMetrics();
    }, 5000);
  }
  
  setupObservers() {
    // Track largest contentful paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.webVitals.lcp = lastEntry.startTime;
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Track first input delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.metrics.webVitals.fid = entry.processingStart - entry.startTime;
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    
    // Track cumulative layout shift
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      entryList.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.webVitals.cls = clsValue;
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    
    // Track first contentful paint
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      this.metrics.webVitals.fcp = entries[0].startTime;
      console.log('FCP:', entries[0].startTime);
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
  }
  
  trackPageLoadTiming() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.timing = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        server: navigation.responseEnd - navigation.requestStart,
        domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        pageLoad: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.fetchStart
      };
    }
  }
  
  trackError(event) {
    this.metrics.errors.push({
      message: event.message || 'Unknown error',
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    console.error('Error tracked:', event);
  }
  
  trackUserInteractions() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      
      if (tagName === 'a') {
        this.metrics.userInteractions.links = (this.metrics.userInteractions.links || 0) + 1;
      } else if (tagName === 'button') {
        this.metrics.userInteractions.buttons = (this.metrics.userInteractions.buttons || 0) + 1;
      } else {
        this.metrics.userInteractions.others = (this.metrics.userInteractions.others || 0) + 1;
      }
    }, { passive: true });
    
    // Track form interactions
    document.addEventListener('change', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA') {
        this.metrics.userInteractions.formInputs = (this.metrics.userInteractions.formInputs || 0) + 1;
      }
    }, { passive: true });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      maxScroll = Math.max(maxScroll, scrollPercent);
      
      this.metrics.userInteractions.maxScrollDepth = maxScroll;
    }, { passive: true });
  }
  
  sendMetrics() {
    // In a real implementation, this would send data to your analytics service
    const payload = {
      ...this.metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
    
    console.log('Performance Metrics:', payload);
    
    // Send to analytics endpoint (if configured)
    if (typeof this.sendToAnalytics === 'function') {
      this.sendToAnalytics(payload);
    }
    
    // Continue monitoring
    setTimeout(() => {
      this.sendMetrics();
    }, 30000); // Send metrics every 30 seconds
  }
  
  // Performance scoring
  calculatePerformanceScore() {
    const webVitals = this.metrics.webVitals;
    let score = 100;
    
    // LCP scoring (0-100)
    if (webVitals.lcp) {
      if (webVitals.lcp < 2500) score -= 0;
      else if (webVitals.lcp < 4000) score -= 30;
      else score -= 90;
    }
    
    // FID scoring (0-100)
    if (webVitals.fid) {
      if (webVitals.fid < 100) score -= 0;
      else if (webVitals.fid < 300) score -= 30;
      else score -= 90;
    }
    
    // CLS scoring (0-100)
    if (webVitals.cls) {
      if (webVitals.cls < 0.1) score -= 0;
      else if (webVitals.cls < 0.25) score -= 30;
      else score -= 90;
    }
    
    // FCP scoring (0-100)
    if (webVitals.fcp) {
      if (webVitals.fcp < 1800) score -= 0;
      else if (webVitals.fcp < 3000) score -= 30;
      else score -= 90;
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  // Get performance insights
  getInsights() {
    const score = this.calculatePerformanceScore();
    const insights = {
      overall: score,
      status: score >= 90 ? 'Excellent' : score >= 50 ? 'Needs Improvement' : 'Poor',
      recommendations: []
    };
    
    // Generate recommendations based on metrics
    const webVitals = this.metrics.webVitals;
    
    if (webVitals.lcp && webVitals.lcp > 2500) {
      insights.recommendations.push('Optimize images and reduce render-blocking resources to improve Largest Contentful Paint');
    }
    
    if (webVitals.fid && webVitals.fid > 100) {
      insights.recommendations.push('Reduce JavaScript execution time to improve First Input Delay');
    }
    
    if (webVitals.cls && webVitals.cls > 0.1) {
      insights.recommendations.push('Reserve space for ads and dynamic content to reduce Cumulative Layout Shift');
    }
    
    if (this.metrics.errors.length > 0) {
      insights.recommendations.push(`Fix ${this.metrics.errors.length} JavaScript error(s) detected on the page`);
    }
    
    return insights;
  }
}

// Initialize performance monitoring when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
  });
} else {
  window.performanceMonitor = new PerformanceMonitor();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor;
}