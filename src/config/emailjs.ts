// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_lk3lnjn', // Replace with your actual Service ID
  TEMPLATE_ID: 'template_x4cgoy5', // Replace with your actual Template ID
  PUBLIC_KEY: '6hp8yhMyKLfWMUz9J', // Replace with your actual Public Key
}

// Auto-reply template (optional)
export const EMAILJS_AUTO_REPLY_CONFIG = {
  SERVICE_ID: 'service_lk3lnjn', // Replace with your actual Service ID
  TEMPLATE_ID: 'template_x4cgoy5', // Replace with your actual Auto-Reply Template ID
  PUBLIC_KEY: '6hp8yhMyKLfWMUz9J', // Replace with your actual Public Key
}


// Get configuration for use in components
export const getEmailJSConfig = () => {
  return EMAILJS_CONFIG
}
