// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your actual Service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Replace with your actual Template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Replace with your actual Public Key
}

// Auto-reply template (optional)
export const EMAILJS_AUTO_REPLY_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your actual Service ID
  TEMPLATE_ID: 'YOUR_AUTO_REPLY_TEMPLATE_ID', // Replace with your actual Auto-Reply Template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Replace with your actual Public Key
}

// Validation function to check if EmailJS is properly configured
export const isEmailJSConfigured = (): boolean => {
  return !(
    EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' ||
    EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
    EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY'
  )
}

// Get configuration for use in components
export const getEmailJSConfig = () => {
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS is not properly configured. Please set up your credentials in src/config/emailjs.ts')
  }
  return EMAILJS_CONFIG
}
