// Google Analytics utilities
export const initializeAnalytics = () => {
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID
  
  if (!trackingId) {
    console.log('Google Analytics tracking ID not found. Skipping analytics initialization.')
    return
  }
  
  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
  document.head.appendChild(script)
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  
  gtag('js', new Date())
  gtag('config', trackingId)
  
  console.log(`Google Analytics initialized with tracking ID: ${trackingId}`)
}

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}

// Track page views
export const trackPageView = (page_title, page_location) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: page_title,
      page_location: page_location
    })
  }
}