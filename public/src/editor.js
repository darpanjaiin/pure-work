// Simple and reliable editor authentication
let editorInitialized = false;

console.log('🚀 Editor script loaded');

window.addEventListener('load', function() {
  if (editorInitialized) {
    console.log('⚠️ Editor already initialized, skipping');
    return;
  }
  editorInitialized = true;
  
  console.log('📄 Editor page loaded, starting auth check...');
  
  // Wait for Clerk to be available
  function waitForClerk() {
    return new Promise((resolve) => {
      let attempts = 0;
      const checkClerk = () => {
        attempts++;
        console.log(`🔍 Editor: Checking for Clerk... attempt ${attempts}`);
        
        if (window.Clerk) {
          console.log('✅ Clerk found in editor!');
          resolve();
        } else if (attempts < 50) {
          setTimeout(checkClerk, 200);
        } else {
          console.error('❌ Clerk failed to load in editor after 50 attempts');
          window.location.href = 'index.html';
          resolve();
        }
      };
      checkClerk();
    });
  }
  
  // Initialize editor
  async function initEditor() {
    try {
      console.log('⏳ Editor: Waiting for Clerk...');
      await waitForClerk();
      
      if (!window.Clerk) {
        console.error('❌ Clerk not available in editor');
        window.location.href = 'index.html';
        return;
      }
      
      console.log('⏳ Editor: Loading Clerk...');
      await Clerk.load();
      
      console.log('📊 Editor: Checking auth state...');
      
      // Wait for session to be resolved
      setTimeout(() => {
        const user = Clerk.user;
        const session = Clerk.session;
        
        console.log('🔐 Editor Auth State:', {
          hasUser: !!user,
          hasSession: !!session,
          userId: user?.id,
          sessionId: session?.id,
          userEmail: user?.emailAddresses?.[0]?.emailAddress
        });
        
        // Check if user is authenticated
        if (!user || !session) {
          console.log('❌ No valid session in editor, redirecting to home...');
          window.location.href = 'index.html';
          return;
        }
        
        console.log('✅ User authenticated in editor, setting up UI...');
        setupEditorUI(user);
        
      }, 2000); // Wait longer for session to be fully established
      
    } catch (error) {
      console.error('❌ Error initializing editor:', error);
      window.location.href = 'index.html';
    }
  }
  
  // Setup editor UI
  function setupEditorUI(user) {
    try {
      console.log('🎨 Setting up editor UI...');
      
      // Display user info
      const userInfo = document.getElementById('user-info');
      if (userInfo && user) {
        const firstName = user.firstName || 'User';
        const email = user.emailAddresses?.[0]?.emailAddress || 'No email';
        
        userInfo.innerHTML = `
          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Welcome, ${firstName}! 👋</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>User ID:</strong> ${user.id}</p>
            <p><strong>Session:</strong> Active ✅</p>
          </div>
        `;
        console.log('✅ User info displayed');
      }
      
      // Setup logout button
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          console.log('🚪 Logout button clicked');
          
          try {
            console.log('⏳ Signing out...');
            await Clerk.signOut();
            console.log('✅ Signed out successfully');
            
            // Clear any local storage just in case
            localStorage.clear();
            sessionStorage.clear();
            
            window.location.href = 'index.html';
          } catch (error) {
            console.error('❌ Error signing out:', error);
            alert('Error signing out. Please try refreshing the page.');
          }
        });
        console.log('✅ Logout button setup complete');
      }
      
      console.log('🎉 Editor UI setup complete!');
      
    } catch (error) {
      console.error('❌ Error setting up editor UI:', error);
    }
  }
  
  // Start the editor initialization
  initEditor();
}); 