window.addEventListener('DOMContentLoaded', () => {
    // Find all links with the 'secure-email' class
    const emailContainer = document.getElementById('secured-email')
      const user = "this";
      const domain = "is.test";
      const fullEmail = `${user}@${domain}`;
      
      // Automatically reconstruct the mailto link and text
      emailContainer.href = `mailto:${fullEmail}`;
      emailContainer.textContent = fullEmail;
  });