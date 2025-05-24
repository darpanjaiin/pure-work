// Portfolio Editor JavaScript
console.log('🎨 Portfolio Editor loaded');

let currentSubdomain = null;
let isPublishing = false;

// Initialize the portfolio editor
document.addEventListener('DOMContentLoaded', function() {
  console.log('📝 Initializing portfolio editor...');
  
  // Initialize live preview updates
  initializeLivePreview();
  
  // Initialize form interactions
  initializeFormInteractions();
  
  // Initialize preview controls
  initializePreviewControls();
  
  // Initialize publish functionality
  initializePublishFunctionality();
  
  console.log('✅ Portfolio editor initialized successfully!');
});

// Publish functionality
function initializePublishFunctionality() {
  const publishBtn = document.querySelector('.btn-publish');
  const previewBtn = document.querySelector('.btn-preview');
  
  if (publishBtn) {
    publishBtn.addEventListener('click', handlePublish);
  }
  
  if (previewBtn) {
    previewBtn.addEventListener('click', handlePreview);
  }
}

async function handlePublish() {
  if (isPublishing) return;
  
  const publishBtn = document.querySelector('.btn-publish');
  const originalText = publishBtn.textContent;
  
  try {
    isPublishing = true;
    publishBtn.disabled = true;
    publishBtn.textContent = 'Publishing...';
    
    // Collect all portfolio data
    const portfolioData = collectPortfolioData();
    
    // Validate required fields
    if (!portfolioData.personalInfo.fullName) {
      alert('Please enter your full name before publishing.');
      return;
    }
    
    console.log('📤 Publishing portfolio data:', portfolioData);
    
    // Send to backend (Vercel API)
    const response = await fetch('/api/portfolio/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        portfolioData: portfolioData
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      currentSubdomain = result.subdomain;
      
      // Update the site URL in the nav
      const siteUrlElement = document.querySelector('.site-url');
      if (siteUrlElement) {
        const domain = 'pauseforaminute.xyz'; // or get from env if you bundle it
        siteUrlElement.textContent = `${result.subdomain}.${domain}`;
      }
      
      // Update status
      const statusElement = document.querySelector('.site-status');
      if (statusElement) {
        statusElement.textContent = '✅ Published';
        statusElement.style.background = '#e8f5e8';
        statusElement.style.color = '#2d5a2d';
      }
      
      publishBtn.textContent = 'Update';
      
      // Show success message with link
      showSuccessMessage(result.url, result.subdomain);
      
      console.log('🎉 Portfolio published successfully!', result);
      
    } else {
      console.error('❌ Publish failed:', result.error);
      alert(`Failed to publish: ${result.error}`);
      publishBtn.textContent = originalText;
    }
    
  } catch (error) {
    console.error('❌ Error publishing portfolio:', error);
    alert('Error publishing portfolio. Please try again.');
    publishBtn.textContent = originalText;
  } finally {
    isPublishing = false;
    publishBtn.disabled = false;
  }
}

function handlePreview() {
  // Open a new window with the live portfolio
  if (currentSubdomain) {
    const portfolioUrl = `https://${currentSubdomain}.pauseforaminute.xyz`;
    window.open(portfolioUrl, '_blank');
  } else {
    alert('Please publish your portfolio first to see the live preview.');
  }
}

function collectPortfolioData() {
  // Personal Information
  const personalInfo = {
    fullName: document.getElementById('fullName')?.value || '',
    jobTitle: document.getElementById('jobTitle')?.value || '',
    bio: document.getElementById('bio')?.value || '',
    location: document.getElementById('location')?.value || ''
  };
  
  // Contact Information
  const contactInfo = {
    email: document.getElementById('email')?.value || '',
    phone: document.getElementById('phone')?.value || '',
    linkedin: document.getElementById('linkedin')?.value || '',
    github: document.getElementById('github')?.value || ''
  };
  
  // Education
  const education = [];
  document.querySelectorAll('.education-item').forEach(item => {
    const school = item.querySelector('.edu-school')?.value || '';
    const degree = item.querySelector('.edu-degree')?.value || '';
    const startYear = item.querySelector('.edu-start')?.value || '';
    const endYear = item.querySelector('.edu-end')?.value || '';
    
    if (school || degree) {
      education.push({
        school,
        degree,
        startYear,
        endYear
      });
    }
  });
  
  // Experience
  const experience = [];
  document.querySelectorAll('.experience-item').forEach(item => {
    const company = item.querySelector('.exp-company')?.value || '';
    const position = item.querySelector('.exp-position')?.value || '';
    const startDate = item.querySelector('.exp-start')?.value || '';
    const endDate = item.querySelector('.exp-end')?.value || '';
    const description = item.querySelector('.exp-description')?.value || '';
    
    if (company || position) {
      experience.push({
        company,
        position,
        startDate,
        endDate,
        description
      });
    }
  });
  
  // Skills
  const skillsText = document.getElementById('skills')?.value || '';
  const skills = skillsText ? skillsText.split(',').map(skill => skill.trim()).filter(skill => skill) : [];
  
  return {
    personalInfo,
    contactInfo,
    education,
    experience,
    skills
  };
}

function showSuccessMessage(url, subdomain) {
  // Create and show success modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  modal.innerHTML = `
    <div style="
      background: white;
      padding: 40px;
      border-radius: 12px;
      max-width: 500px;
      margin: 20px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    ">
      <div style="font-size: 3rem; margin-bottom: 20px;">🎉</div>
      <h2 style="margin: 0 0 16px; color: #111;">Portfolio Published Successfully!</h2>
      <p style="color: #666; margin-bottom: 24px;">Your portfolio is now live and accessible to everyone.</p>
      
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-weight: 600;">Your Portfolio URL:</p>
        <a href="${url}" target="_blank" style="
          color: #2563eb;
          text-decoration: none;
          font-family: monospace;
          font-size: 1.1rem;
        ">${url}</a>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button onclick="window.open('${url}', '_blank')" style="
          background: #2563eb;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        ">View Portfolio</button>
        <button onclick="this.closest('div').parentElement.remove()" style="
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        ">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (modal.parentElement) {
      modal.remove();
    }
  }, 10000);
}

// Live Preview Functions
function initializeLivePreview() {
  // Personal Information
  const nameInput = document.getElementById('fullName');
  const jobTitleInput = document.getElementById('jobTitle');
  const bioInput = document.getElementById('bio');
  const locationInput = document.getElementById('location');
  
  // Contact Information
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const linkedinInput = document.getElementById('linkedin');
  const githubInput = document.getElementById('github');
  
  // Skills
  const skillsInput = document.getElementById('skills');
  
  // Add event listeners for real-time updates
  if (nameInput) {
    nameInput.addEventListener('input', updatePreviewName);
    nameInput.addEventListener('input', updateSiteUrl);
  }
  
  if (jobTitleInput) {
    jobTitleInput.addEventListener('input', updatePreviewTitle);
  }
  
  if (bioInput) {
    bioInput.addEventListener('input', updatePreviewBio);
  }
  
  if (emailInput) {
    emailInput.addEventListener('input', updatePreviewContact);
  }
  
  if (phoneInput) {
    phoneInput.addEventListener('input', updatePreviewContact);
  }
  
  if (linkedinInput) {
    linkedinInput.addEventListener('input', updatePreviewContact);
  }
  
  if (githubInput) {
    githubInput.addEventListener('input', updatePreviewContact);
  }
  
  if (skillsInput) {
    skillsInput.addEventListener('input', updatePreviewSkills);
  }
  
  // Add listeners for education and experience
  addEducationExperienceListeners();
}

function updatePreviewName() {
  const nameInput = document.getElementById('fullName');
  const previewName = document.querySelector('.preview-name');
  
  if (nameInput && previewName) {
    const name = nameInput.value.trim() || 'Your Name';
    previewName.textContent = name;
    
    // Update avatar initials
    const avatar = document.querySelector('.avatar-placeholder');
    if (avatar && nameInput.value.trim()) {
      const initials = name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
      avatar.textContent = initials;
    } else {
      avatar.textContent = '👤';
    }
  }
}

function updateSiteUrl() {
  const nameInput = document.getElementById('fullName');
  const siteUrl = document.querySelector('.site-url');
  
  if (nameInput && siteUrl) {
    const name = nameInput.value.trim();
    if (name) {
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      const domain = 'pauseforaminute.xyz'; // or get from env if you bundle it
      siteUrl.textContent = `${slug}.${domain}`;
    } else {
      siteUrl.textContent = 'yourname.pauseforaminute.xyz';
    }
  }
}

function updatePreviewTitle() {
  const titleInput = document.getElementById('jobTitle');
  const previewTitle = document.querySelector('.preview-title');
  
  if (titleInput && previewTitle) {
    const title = titleInput.value.trim() || 'Your Professional Title';
    previewTitle.textContent = title;
  }
}

function updatePreviewBio() {
  const bioInput = document.getElementById('bio');
  const previewBio = document.querySelector('.preview-bio');
  
  if (bioInput && previewBio) {
    const bio = bioInput.value.trim() || 'Your bio will appear here...';
    previewBio.textContent = bio;
  }
}

function updatePreviewContact() {
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const linkedinInput = document.getElementById('linkedin');
  const githubInput = document.getElementById('github');
  const previewContact = document.querySelector('.preview-contact');
  
  if (previewContact) {
    let contactHTML = '';
    
    if (emailInput && emailInput.value.trim()) {
      contactHTML += `<a href="mailto:${emailInput.value}" class="contact-item">📧 ${emailInput.value}</a>`;
    }
    
    if (phoneInput && phoneInput.value.trim()) {
      contactHTML += `<a href="tel:${phoneInput.value}" class="contact-item">📱 ${phoneInput.value}</a>`;
    }
    
    if (linkedinInput && linkedinInput.value.trim()) {
      contactHTML += `<a href="${linkedinInput.value}" target="_blank" class="contact-item">💼 LinkedIn</a>`;
    }
    
    if (githubInput && githubInput.value.trim()) {
      contactHTML += `<a href="${githubInput.value}" target="_blank" class="contact-item">💻 GitHub</a>`;
    }
    
    if (contactHTML === '') {
      contactHTML = `
        <a href="#" class="contact-item">📧 Email</a>
        <a href="#" class="contact-item">📱 Phone</a>
        <a href="#" class="contact-item">💼 LinkedIn</a>
        <a href="#" class="contact-item">💻 GitHub</a>
      `;
    }
    
    previewContact.innerHTML = contactHTML;
  }
}

function updatePreviewSkills() {
  const skillsInput = document.getElementById('skills');
  const previewSkills = document.querySelector('.preview-skills');
  
  if (skillsInput && previewSkills) {
    const skills = skillsInput.value.trim();
    
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      const skillsHTML = skillsArray.map(skill => 
        `<span class="skill-tag">${skill}</span>`
      ).join('');
      previewSkills.innerHTML = skillsHTML;
    } else {
      previewSkills.innerHTML = '<span class="skill-tag">Your skills will appear here</span>';
    }
  }
}

function addEducationExperienceListeners() {
  // Add listeners to existing education and experience inputs
  document.querySelectorAll('.edu-school, .edu-degree, .edu-start, .edu-end').forEach(input => {
    input.addEventListener('input', updatePreviewEducation);
  });
  
  document.querySelectorAll('.exp-company, .exp-position, .exp-start, .exp-end, .exp-description').forEach(input => {
    input.addEventListener('input', updatePreviewExperience);
  });
}

function updatePreviewEducation() {
  const educationItems = document.querySelectorAll('.education-item');
  const previewEducation = document.querySelector('.preview-education');
  
  if (previewEducation) {
    let educationHTML = '';
    
    educationItems.forEach(item => {
      const school = item.querySelector('.edu-school')?.value.trim() || '';
      const degree = item.querySelector('.edu-degree')?.value.trim() || '';
      const startYear = item.querySelector('.edu-start')?.value || '';
      const endYear = item.querySelector('.edu-end')?.value || '';
      
      if (school || degree) {
        const years = startYear && endYear ? `${startYear} - ${endYear}` : 
                     startYear ? `${startYear} - Present` : '';
        
        educationHTML += `
          <div class="edu-item">
            <h3>${degree || 'Your Degree'}</h3>
            <p>${school || 'Your School'}${years ? ` • ${years}` : ''}</p>
          </div>
        `;
      }
    });
    
    if (educationHTML === '') {
      educationHTML = `
        <div class="edu-item">
          <h3>Your Degree</h3>
          <p>Your School • Year - Year</p>
        </div>
      `;
    }
    
    previewEducation.innerHTML = educationHTML;
  }
}

function updatePreviewExperience() {
  const experienceItems = document.querySelectorAll('.experience-item');
  const previewExperience = document.querySelector('.preview-experience');
  
  if (previewExperience) {
    let experienceHTML = '';
    
    experienceItems.forEach(item => {
      const company = item.querySelector('.exp-company')?.value.trim() || '';
      const position = item.querySelector('.exp-position')?.value.trim() || '';
      const startDate = item.querySelector('.exp-start')?.value || '';
      const endDate = item.querySelector('.exp-end')?.value || '';
      const description = item.querySelector('.exp-description')?.value.trim() || '';
      
      if (company || position) {
        const dateRange = startDate && endDate ? 
          `${formatDate(startDate)} - ${formatDate(endDate)}` :
          startDate ? `${formatDate(startDate)} - Present` : '';
        
        experienceHTML += `
          <div class="exp-item">
            <h3>${position || 'Your Position'}</h3>
            <p class="exp-company">${company || 'Your Company'}${dateRange ? ` • ${dateRange}` : ''}</p>
            <p class="exp-desc">${description || 'Your experience description...'}</p>
          </div>
        `;
      }
    });
    
    if (experienceHTML === '') {
      experienceHTML = `
        <div class="exp-item">
          <h3>Your Position</h3>
          <p class="exp-company">Your Company • Date - Date</p>
          <p class="exp-desc">Your experience description...</p>
        </div>
      `;
    }
    
    previewExperience.innerHTML = experienceHTML;
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + '-01');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

// Add Education Function
function addEducation() {
  const educationList = document.getElementById('education-list');
  
  const newEducationItem = document.createElement('div');
  newEducationItem.className = 'education-item';
  newEducationItem.innerHTML = `
    <div class="form-group">
      <label>School/University</label>
      <input type="text" class="edu-school" placeholder="Harvard University" />
    </div>
    <div class="form-group">
      <label>Degree</label>
      <input type="text" class="edu-degree" placeholder="Bachelor of Computer Science" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Start Year</label>
        <input type="number" class="edu-start" placeholder="2018" />
      </div>
      <div class="form-group">
        <label>End Year</label>
        <input type="number" class="edu-end" placeholder="2022" />
      </div>
    </div>
    <button type="button" class="btn-remove" onclick="removeEducation(this)">Remove</button>
  `;
  
  educationList.appendChild(newEducationItem);
  
  // Add event listeners to new inputs
  newEducationItem.querySelectorAll('.edu-school, .edu-degree, .edu-start, .edu-end').forEach(input => {
    input.addEventListener('input', updatePreviewEducation);
  });
  
  console.log('➕ Added new education item');
}

// Add Experience Function
function addExperience() {
  const experienceList = document.getElementById('experience-list');
  
  const newExperienceItem = document.createElement('div');
  newExperienceItem.className = 'experience-item';
  newExperienceItem.innerHTML = `
    <div class="form-group">
      <label>Company</label>
      <input type="text" class="exp-company" placeholder="Google" />
    </div>
    <div class="form-group">
      <label>Position</label>
      <input type="text" class="exp-position" placeholder="Senior Software Engineer" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Start Date</label>
        <input type="month" class="exp-start" />
      </div>
      <div class="form-group">
        <label>End Date</label>
        <input type="month" class="exp-end" />
      </div>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="exp-description" placeholder="Key achievements and responsibilities..." rows="3"></textarea>
    </div>
    <button type="button" class="btn-remove" onclick="removeExperience(this)">Remove</button>
  `;
  
  experienceList.appendChild(newExperienceItem);
  
  // Add event listeners to new inputs
  newExperienceItem.querySelectorAll('.exp-company, .exp-position, .exp-start, .exp-end, .exp-description').forEach(input => {
    input.addEventListener('input', updatePreviewExperience);
  });
  
  console.log('➕ Added new experience item');
}

// Remove Functions
function removeEducation(button) {
  button.parentElement.remove();
  updatePreviewEducation();
  console.log('➖ Removed education item');
}

function removeExperience(button) {
  button.parentElement.remove();
  updatePreviewExperience();
  console.log('➖ Removed experience item');
}

// Form Interactions
function initializeFormInteractions() {
  // Auto-save functionality (localStorage)
  const formInputs = document.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    // Load saved data
    const savedValue = localStorage.getItem(`portfolio_${input.id || input.className}`);
    if (savedValue && input.id) {
      input.value = savedValue;
    }
    
    // Save on input
    input.addEventListener('input', function() {
      if (this.id) {
        localStorage.setItem(`portfolio_${this.id}`, this.value);
      }
    });
  });
  
  console.log('💾 Auto-save functionality initialized');
}

// Preview Controls
function initializePreviewControls() {
  const previewButtons = document.querySelectorAll('.preview-btn');
  const previewFrame = document.getElementById('preview-frame');
  
  previewButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      previewButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Update preview frame size
      const device = this.dataset.device;
      updatePreviewFrameSize(device);
    });
  });
}

function updatePreviewFrameSize(device) {
  const previewFrame = document.getElementById('preview-frame');
  
  if (previewFrame) {
    previewFrame.className = 'preview-frame';
    
    switch(device) {
      case 'tablet':
        previewFrame.style.maxWidth = '768px';
        break;
      case 'mobile':
        previewFrame.style.maxWidth = '375px';
        break;
      default: // desktop
        previewFrame.style.maxWidth = '800px';
    }
  }
}

// Initialize preview with demo data if fields are empty
function initializeDemoData() {
  setTimeout(() => {
    // Only add demo data if fields are completely empty
    const nameInput = document.getElementById('fullName');
    if (nameInput && !nameInput.value.trim()) {
      // Initial update to show placeholder content
      updatePreviewName();
      updatePreviewTitle();
      updatePreviewBio();
      updatePreviewContact();
      updatePreviewSkills();
      updatePreviewEducation();
      updatePreviewExperience();
    }
  }, 100);
}

// Call demo data initialization
initializeDemoData(); 