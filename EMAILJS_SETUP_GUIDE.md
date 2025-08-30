# EmailJS Setup Guide for Contact Form

This guide will help you set up EmailJS to enable the contact form functionality in your City College Sustainability Platform.

## What is EmailJS?

EmailJS is a service that allows you to send emails directly from your frontend JavaScript code without requiring a backend server. It's perfect for contact forms and other email functionality.

## Step-by-Step Setup

### 1. Create an EmailJS Account

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Create an Email Service

1. Log in to your EmailJS dashboard
2. Go to "Email Services" in the left sidebar
3. Click "Add New Service"
4. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
5. Follow the authentication steps for your chosen provider
6. Give your service a name (e.g., "City College Contact")
7. Click "Create Service"

### 3. Create an Email Template

1. Go to "Email Templates" in the left sidebar
2. Click "Create New Template"
3. Choose "Blank Template"
4. Configure your template:

#### Template Configuration:

- **Template Name**: "Contact Form Template"
- **Subject**: "New Contact Form Submission - {{name}}"
- **Content**:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>New Contact Form Submission</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2
        style="color: #2c5aa0; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px;"
      >
        New Contact Form Submission
      </h2>

      <div
        style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="margin-top: 0; color: #2c5aa0;">Contact Information</h3>
        <p><strong>Name:</strong> {{name}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
      </div>

      <div
        style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;"
      >
        <h3 style="margin-top: 0; color: #2c5aa0;">Message</h3>
        <p style="white-space: pre-wrap;">{{message}}</p>
      </div>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;"
      >
        <p>
          This message was sent from the City College Sustainability Platform
          contact form.
        </p>
        <p>Submitted on: {{submit_date}}</p>
      </div>
    </div>
  </body>
</html>
```

4. Click "Save Template"

### 4. Get Your Credentials

1. **Service ID**: Go to "Email Services" and copy the Service ID
2. **Template ID**: Go to "Email Templates" and copy the Template ID
3. **Public Key**: Go to "Account" → "API Keys" and copy your Public Key

### 5. Update Your Contact Component

Replace the placeholder values in `src/pages/Contact.tsx`:

```typescript
const result = await emailjs.sendForm(
  "YOUR_SERVICE_ID", // Replace with your actual Service ID
  "YOUR_TEMPLATE_ID", // Replace with your actual Template ID
  formRef.current!,
  "YOUR_PUBLIC_KEY" // Replace with your actual Public Key
);
```

### 6. Test Your Setup

1. Start your development server
2. Go to the contact page
3. Fill out and submit the form
4. Check your email to see if the message was received

## EmailJS Template Variables

The template uses these variables that are automatically populated from your form:

- `{{name}}` - The sender's name
- `{{email}}` - The sender's email
- `{{subject}}` - The message subject
- `{{message}}` - The message content
- `{{submit_date}}` - The submission date (automatically added by EmailJS)

## Customization Options

### Custom Email Template

You can customize the email template to match your brand:

```html
<!-- Add your logo -->
<img
  src="https://your-domain.com/logo.png"
  alt="City College Logo"
  style="max-width: 200px;"
/>

<!-- Add custom styling -->
<style>
  .custom-header {
    background: linear-gradient(135deg, #2c5aa0, #4a90e2);
    color: white;
    padding: 20px;
    border-radius: 8px;
  }
</style>
```

### Auto-Reply Template

Create a second template for auto-replies to users:

1. Create a new template called "Auto-Reply Template"
2. Subject: "Thank you for contacting City College Sustainability"
3. Content:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Thank you for contacting us</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c5aa0;">Thank you for contacting us!</h2>

      <p>Dear {{name}},</p>

      <p>
        Thank you for reaching out to the City College Sustainability Office. We
        have received your message and will get back to you within 24 hours.
      </p>

      <div
        style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;"
      >
        <h4 style="margin-top: 0;">Your Message Summary:</h4>
        <p><strong>Subject:</strong> {{subject}}</p>
        <p><strong>Message:</strong> {{message}}</p>
      </div>

      <p>In the meantime, you can:</p>
      <ul>
        <li>
          Visit our
          <a href="https://your-domain.com/projects">sustainability projects</a>
        </li>
        <li>
          Check out our
          <a href="https://your-domain.com/initiatives">initiatives</a>
        </li>
        <li>Follow us on social media</li>
      </ul>

      <p>
        Best regards,<br />
        City College Sustainability Team
      </p>
    </div>
  </body>
</html>
```

## Security Considerations

1. **Rate Limiting**: EmailJS has built-in rate limiting to prevent spam
2. **Template Validation**: Only allow specific variables in your templates
3. **CORS**: EmailJS handles CORS automatically
4. **API Key Security**: Keep your API keys secure and don't expose them in client-side code for production

## Troubleshooting

### Common Issues:

1. **"Service not found" error**

   - Check that your Service ID is correct
   - Ensure your email service is properly configured

2. **"Template not found" error**

   - Verify your Template ID is correct
   - Make sure the template is published

3. **"Invalid API key" error**

   - Check your Public Key
   - Ensure you're using the correct key type (Public vs Private)

4. **Emails not being sent**
   - Check your email service authentication
   - Verify your email provider settings
   - Check EmailJS dashboard for any error messages

### Debug Mode:

Enable debug mode to see detailed error messages:

```typescript
emailjs.init("YOUR_PUBLIC_KEY");
emailjs
  .sendForm("SERVICE_ID", "TEMPLATE_ID", formRef.current!, "PUBLIC_KEY")
  .then(
    (result) => {
      console.log("SUCCESS!", result.text);
    },
    (error) => {
      console.log("FAILED...", error.text);
    }
  );
```

## Production Deployment

For production deployment:

1. **Environment Variables**: Store your EmailJS credentials in environment variables
2. **Error Handling**: Implement proper error handling and user feedback
3. **Validation**: Add server-side validation if needed
4. **Monitoring**: Set up monitoring for email delivery rates

## Alternative Solutions

If EmailJS doesn't meet your needs, consider these alternatives:

1. **Formspree**: Simple form handling service
2. **Netlify Forms**: Built-in form handling for Netlify sites
3. **Backend API**: Create your own email endpoint
4. **SendGrid**: Professional email service with API

## Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Community: [https://github.com/emailjs-com/emailjs-react](https://github.com/emailjs-com/emailjs-react)
- Contact EmailJS Support: [support@emailjs.com](mailto:support@emailjs.com)
