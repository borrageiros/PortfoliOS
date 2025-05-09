<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';
  import { sendReview } from '$lib/api';
  export let reviews: any;

  export let isMobileVersion = false;

  // Form data
  let reviewForm = {
    name: '',
    job: '',
    review: '',
    url: '',
    avatar: null as File | null
  };

  let formSubmitting = false;
  let formSuccess = false;
  let formError = false;
  let errorMessage = '';

  // Handle review submission
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    formSubmitting = true;
    formSuccess = false;
    formError = false;
    
    try {
      const formData = new FormData();
      formData.append('name', reviewForm.name);
      formData.append('review', reviewForm.review);
      
      if (reviewForm.job) formData.append('job', reviewForm.job);
      if (reviewForm.url) formData.append('url', reviewForm.url);
      if (reviewForm.avatar) formData.append('avatar', reviewForm.avatar);
      
      // Call the API function to send the review
      const response = await sendReview(formData);
      
      if (response.success) {
        formSuccess = true;
        // Reset form
        reviewForm = {
          name: '',
          job: '',
          review: '',
          url: '',
          avatar: null
        };

        // Clear file input
        const fileInput = document.getElementById('avatar') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        formError = true;
        errorMessage = response.message || $t('profile.errorSending');
      }
    } catch (error) {
      formError = true;
      errorMessage = $t('profile.errorSending');
      console.error('Error sending review:', error);
    } finally {
      formSubmitting = false;
    }
  };

  // Handle file selection
  const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      reviewForm.avatar = input.files[0];
    }
  };
</script>

<div class="reviews-section {isMobileVersion ? 'mobile' : ''}">
  <h2>
    <Icon name="profile_reviews" size="22" />
    <span>{$t('profile.reviews')}</span>
  </h2>
  
  <div class="reviews-container">
    <div class="chat-container">
      {#each reviews.reviews as review, index}
        <div class="chat-message {index % 2 === 0 ? 'chat-received' : 'chat-sent'}">
          <div class="message-avatar">
            <img src={review.avatar} alt={review.name} />
          </div>
          <div class="message-content">
            <div class="message-header">
              <a href={review.url} target="_blank" rel="noopener noreferrer">
                <span class="message-name">{review.name}</span>
              </a>
            </div>
            <span class="message-job">{review.job}</span>
            <div class="message-bubble">
              <p>{review.review}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="review-form-container">
      <h3>{$t('profile.writeReview')}</h3>
      <form class="review-form" on:submit={handleSubmit}>
        
        {#if formError}
          <div class="form-message error">
            <Icon name="alert-circle" size="16" />
            <span>{errorMessage}</span>
          </div>
        {/if}

        {#if formSuccess}
          <div class="form-message success">
            <Icon name="check-circle" size="16" />
            <span>{$t('profile.reviewSent')}</span>
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
            bind:value={reviewForm.name}
          />
        </div>
        
        <div class="form-group">
          <label for="job">{$t('profile.job')}</label>
          <input 
            type="text" 
            id="job" 
            name="job" 
            placeholder={$t('profile.jobPlaceholder')}
            bind:value={reviewForm.job}
          />
        </div>
        
        <div class="form-group">
          <label for="url">{$t('profile.url')}</label>
          <input 
            type="url" 
            id="url" 
            name="url" 
            placeholder="https://www.linkedin.com/in/yourprofile"
            bind:value={reviewForm.url}
          />
        </div>
        
        <div class="form-group">
          <label for="avatar">{$t('profile.avatar')}</label>
          <input 
            type="file" 
            id="avatar" 
            name="avatar" 
            accept="image/*"
            on:change={handleFileSelect}
          />
          <span class="input-help">{$t('profile.avatarHelp')}</span>
        </div>
        
        <div class="form-group">
          <label for="review">{$t('profile.review')} *</label>
          <textarea 
            id="review" 
            name="review" 
            rows="4" 
            required 
            placeholder={$t('profile.reviewPlaceholder')}
            bind:value={reviewForm.review}
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
  </div>
</div>

<style>
  .reviews-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 10px;
  }
  
  .reviews-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .reviews-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .chat-container {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: calc(100vh - 200px);
    overflow-y: auto;
  }
  
  .review-form-container {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow-light);
    height: calc(100vh - 200px);
    overflow-y: auto;
  }
  
  .review-form-container h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--text-primary);
    font-size: 18px;
    border-bottom: 1px solid var(--taskbar-hover);
    padding-bottom: 10px;
  }
  
  .review-form {
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
    min-height: 90px;
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
  
  .send-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: var(--taskbar-hover);
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
  
  .chat-message {
    display: flex;
    gap: 12px;
    max-width: 95%;
  }
  
  .chat-received {
    align-self: flex-start;
  }
  
  .chat-sent {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  
  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .message-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .message-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .message-header {
    padding: 0 8px;
  }

  .message-header a {
    text-decoration: none;
    color: var(--text-primary);
    display: inline-block;
  }
  
  .message-name {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .message-job {
    margin-left: 10px;
    font-size: 0.7rem;
    color: var(--text-secondary);
  }
  
  .chat-received .message-name {
    color: var(--win-accent);
  }
  
  .chat-sent .message-name {
    color: #4caf50;
  }
  
  .message-bubble {
    background-color: var(--taskbar-bg);
    padding: 10px 12px;
    border-radius: 12px;
    position: relative;
  }
  
  .chat-received .message-bubble {
    border-top-left-radius: 4px;
    background-color: var(--taskbar-active);
  }
  
  .chat-sent .message-bubble {
    border-top-right-radius: 4px;
    background-color: var(--win-accent);
    color: white;
  }
  
  .message-bubble p {
    margin: 0;
    line-height: 1.4;
    font-size: 0.95rem;
  }
  
  /* Estilos para versión móvil */
  .mobile .reviews-container {
    grid-template-columns: 1fr;
  }
  
  .mobile .chat-container,
  .mobile .review-form-container {
    height: auto;
    max-height: calc(100vh - 250px);
  }
  
  .mobile .chat-container {
    padding: 10px;
    gap: 12px;
  }
  
  .mobile .chat-message {
    max-width: 95%;
  }
  
  .mobile .message-avatar {
    width: 32px;
    height: 32px;
  }
  
  .mobile .message-name {
    font-size: 0.8rem;
    display: block;
    line-height: 1.1;
  }
  
  .mobile .message-job {
    font-size: 0.65rem;
    display: block;
    line-height: 1;
  }
  
  .mobile .message-bubble {
    padding: 8px 10px;
  }
  
  .mobile .message-bubble p {
    font-size: 0.9rem;
    line-height: 1.3;
  }
  
  .mobile .chat-received, 
  .mobile .chat-sent {
    gap: 8px;
  }
  
  @media (max-width: 768px) {
    .reviews-container {
      grid-template-columns: 1fr;
    }
  }
</style>