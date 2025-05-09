<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';
  import { sendEmail } from '$lib/api';
  export let contact: any;

  // Form data
  let contactForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  };

  let formSubmitting = false;
  let formSuccess = false;
  let formError = false;
  let errorMessage = '';

  // Handle form submission
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    formSubmitting = true;
    formSuccess = false;
    formError = false;
    
    try {
      // Call the API function to send the email
      const response = await sendEmail(
        contactForm.name,
        contactForm.message,
        contactForm.email,
        contactForm.phone,
        contactForm.company
      );
      
      if (response.success) {
        formSuccess = true;
        // Reset form
        contactForm = {
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        };
      } else {
        formError = true;
        errorMessage = response.message || $t('profile.errorSending');
      }
    } catch (error) {
      formError = true;
      errorMessage = $t('profile.errorSending');
      console.error('Error sending email:', error);
    } finally {
      formSubmitting = false;
    }
  };
</script>

<div class="contact-section">
  <h2>
    <Icon name="profile_contact" size="22" />
    <span>{$t('profile.contact')}</span>
  </h2>
  
  <div class="contact-container">
    <div class="contact-form-container">
      <h3>{$t('profile.contactForm')}</h3>
      <form class="contact-form" on:submit={handleSubmit}>
        
        {#if formError}
          <div class="form-message error">
            <Icon name="alert-circle" size="16" />
            <span>{errorMessage}</span>
          </div>
        {/if}

        {#if formSuccess}
          <div class="form-message success">
            <Icon name="check-circle" size="16" />
            <span>{$t('profile.messageSent')}</span>
          </div>
        {/if}
        
        <div class="form-group">
          <label for="name">{$t('profile.name')} *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            placeholder={$t('profile.namePlaceholder')}
            bind:value={contactForm.name}
          />
        </div>
        
        <div class="form-group">
          <label for="email">{$t('profile.email')}</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder={$t('profile.emailPlaceholder')}
            bind:value={contactForm.email}
          />
        </div>
        
        <div class="form-group">
          <label for="phone">{$t('profile.phone')}</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            placeholder={$t('profile.phonePlaceholder')}
            bind:value={contactForm.phone}
          />
        </div>
        
        <div class="form-group">
          <label for="company">{$t('profile.company')}</label>
          <input 
            type="text" 
            id="company" 
            name="company" 
            placeholder={$t('profile.companyPlaceholder')}
            bind:value={contactForm.company}
          />
        </div>
        
        <div class="form-group">
          <label for="message">{$t('profile.message')} *</label>
          <textarea 
            id="message" 
            name="message" 
            rows="6" 
            required 
            placeholder={$t('profile.messagePlaceholder')}
            bind:value={contactForm.message}
          ></textarea>
        </div>
        
        <div class="form-footer">
          <p class="required-fields">{$t('profile.requiredFields')}</p>
          <button type="submit" class="send-button" disabled={formSubmitting}>
            <Icon name="send" size="16" />
            <span>{formSubmitting ? $t('profile.sending') : $t('profile.send')}</span>
          </button>
        </div>
      </form>
    </div>
    
    <div class="social-links-container">
      <h3>{$t('profile.socialNetworks')}</h3>
      {#each contact.rrss as rrss}
        <div class="social-links">
          <a href={rrss.url} target="_blank" rel="noopener noreferrer" class="social-link">
            <div class="social-icon" style="background-color: {rrss.color};">
              <Icon name={rrss.icon} viewBox={rrss.viewBox} size="24" />
            </div>
            <span>{rrss.name}</span>
          </a>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .contact-section {
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 0 10px;
  }
  
  .contact-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  
  .contact-form-container, .social-links-container {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow-light);
  }
  
  .contact-form-container h3, .social-links-container h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--text-primary);
    font-size: 18px;
    border-bottom: 1px solid var(--taskbar-hover);
    padding-bottom: 10px;
  }
  
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .form-group label {
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .form-group input, .form-group textarea {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid var(--taskbar-hover);
    background-color: var(--taskbar-bg);
    color: var(--text-primary);
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  
  .form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: var(--win-accent);
    box-shadow: 0 0 0 2px rgba(0, 120, 215, 0.25);
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  
  .required-fields {
    font-size: 12px;
    color: var(--text-secondary);
    margin: 0;
  }
  
  .send-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: var(--win-accent);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .send-button:hover {
    background-color: var(--win-start-hover);
  }
  
  .form-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    margin-top: 15px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .form-message.success {
    background-color: rgba(16, 137, 62, 0.1);
    color: var(--alert-success);
    border: 1px solid var(--alert-success);
  }
  
  .form-message.error {
    background-color: rgba(232, 17, 35, 0.1);
    color: var(--alert-error);
    border: 1px solid var(--alert-error);
  }
  
  /* Social links styles */
  .social-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 10px;
  }
  
  .social-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background-color: var(--taskbar-bg);
    color: var(--text-primary);
    text-decoration: none;
    transition: transform 0.2s, background-color 0.2s;
  }
  
  .social-link:hover {
    background-color: var(--taskbar-hover);
    transform: translateX(5px);
  }
  
  .social-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  @media (max-width: 768px) {
    .contact-container {
      grid-template-columns: 1fr;
    }
  }
</style>