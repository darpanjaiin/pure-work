// Replace with your actual Clerk publishable key
const CLERK_PUBLISHABLE_KEY = 'pk_test_dHJ1c3Rpbmctd2FzcC0zNy5jbGVyay5hY2NvdW50cy5kZXYk';

let isInitializing = false;
let isRedirecting = false;

// Function to clear any stale session data
function clearStaleSessionData() {
  try {
    // Clear localStorage items that might contain stale Clerk data
    Object.keys(localStorage).forEach(key => {
      if (key.includes('clerk') || key.includes('__clerk')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage items
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('clerk') || key.includes('__clerk')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('Cleared potential stale session data');
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
}

// Function to safely check authentication status
async function checkAuthStatus() {
  try {
    // Wait for Clerk to be fully loaded
    let attempts = 0;
    while (!window.Clerk && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!window.Clerk) {
      console.error('Clerk failed to load');
      return false;
    }
    
    // Wait for session to be resolved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if we have a valid session
    const isAuthenticated = Clerk.session && Clerk.user;
    console.log('Auth check result:', {
      hasClerk: !!window.Clerk,
      hasSession: !!Clerk.session,
      hasUser: !!Clerk.user,
      sessionId: Clerk.session?.id,
      isAuthenticated
    });
    
    return isAuthenticated;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
}

// Simple and reliable authentication handler
let authInitialized = false;

console.log('🚀 Auth script loaded');

window.addEventListener('load', function() {
  if (authInitialized) {
    console.log('⚠️ Auth already initialized, skipping');
    return;
  }
  authInitialized = true;
  
  console.log('📄 Homepage loaded, starting auth setup...');
  
  // Wait for Clerk to be available
  function waitForClerk() {
    return new Promise((resolve) => {
      let attempts = 0;
      const checkClerk = () => {
        attempts++;
        console.log(`🔍 Checking for Clerk... attempt ${attempts}`);
        
        if (window.Clerk) {
          console.log('✅ Clerk found!');
          resolve();
        } else if (attempts < 50) {
          setTimeout(checkClerk, 200);
        } else {
          console.error('❌ Clerk failed to load after 50 attempts');
          alert('Authentication service failed to load. Please refresh the page.');
          resolve();
        }
      };
      checkClerk();
    });
  }
  
  // Initialize authentication
  async function initAuth() {
    try {
      console.log('⏳ Waiting for Clerk...');
      await waitForClerk();
      
      if (!window.Clerk) {
        console.error('❌ Clerk not available');
        return;
      }
      
      console.log('⏳ Loading Clerk...');
      await Clerk.load();
      
      console.log('📊 Checking current auth state...');
      
      // Simple session check - wait a bit for session to be ready
      setTimeout(async () => {
        const user = Clerk.user;
        const session = Clerk.session;
        
        console.log('🔐 Auth State:', {
          hasUser: !!user,
          hasSession: !!session,
          userId: user?.id,
          sessionId: session?.id
        });
        
        // If user is logged in, redirect to editor
        if (user && session) {
          console.log('✅ User is authenticated, redirecting to editor...');
          window.location.href = 'editor.html';
          return;
        }
        
        console.log('👤 No authenticated user, setting up login...');
        setupLoginButton();
        
      }, 1500); // Give Clerk time to resolve session
      
    } catch (error) {
      console.error('❌ Error initializing auth:', error);
      alert('Error loading authentication. Please refresh the page.');
    }
  }
  
  // Setup login button functionality
  function setupLoginButton() {
    const btn = document.getElementById('create-website-btn');
    const authDiv = document.getElementById('clerk-auth');
    
    if (!btn || !authDiv) {
      console.error('❌ Required elements not found');
      return;
    }
    
    console.log('🔘 Setting up login button...');
    
    btn.addEventListener('click', function() {
      console.log('🖱️ Login button clicked');
      
      btn.style.display = 'none';
      authDiv.style.display = 'block';
      
      try {
        Clerk.mountSignIn(authDiv, {
          afterSignInUrl: '/editor.html',
          afterSignUpUrl: '/editor.html'
        });
        
        console.log('📱 Login form mounted');
        
        // Listen for successful authentication
        Clerk.addListener((event) => {
          console.log('🎉 Clerk event:', event.type);
          if (event.type === 'session:created') {
            console.log('✅ Session created! Redirecting...');
            setTimeout(() => {
              window.location.href = 'editor.html';
            }, 1000);
          }
        });
        
      } catch (error) {
        console.error('❌ Error mounting login form:', error);
        btn.style.display = 'block';
        authDiv.style.display = 'none';
        alert('Login form failed to load. Please try again.');
      }
    });
  }
  
  // Start the authentication process
  initAuth();
}); 