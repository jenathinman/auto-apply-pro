/**
 * AutoApply Pro: Content Script
 * This script runs in the context of the job application page.
 * It listens for messages from the React popup and performs DOM manipulation.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autofill") {
    const data = request.data;
    const missing = [];

    // Mapping logic for common ATS field identifiers
    const fieldMapping = {
      name: ['name', 'full_name', 'first_name', 'lastname', 'input-1'],
      email: ['email', 'email_address', 'input-2'],
      phone: ['phone', 'mobile', 'tel', 'contact_number'],
      location: ['location', 'city', 'address'],
      linkedin: ['linkedin', 'social_profile'],
      salary: ['salary', 'expectation', 'compensation'],
      startDate: ['start_date', 'notice_period', 'available']
    };

    // Helper to find and fill inputs
    const fillField = (keys, value) => {
      if (!value) return false;
      
      for (const key of keys) {
        // Try to find by name, id, or placeholder (common in Workday/Greenhouse)
        const selector = `input[name*="${key}" i], input[id*="${key}" i], input[placeholder*="${key}" i], textarea[name*="${key}" i]`;
        const element = document.querySelector(selector);
        
        if (element) {
          element.value = value;
          // Trigger events so the site's React/Angular state updates
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      }
      return false;
    };

    // Execute filling
    Object.keys(fieldMapping).forEach(field => {
      const success = fillField(fieldMapping[field], data[field]);
      if (!success) missing.push(field);
    });

    // Handle standard Work Authorization radio buttons/checkboxes (heuristic)
    if (data.workAuth) {
      const authOptions = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
      authOptions.forEach(opt => {
        const label = opt.parentElement.innerText.toLowerCase();
        if (label.includes('authorized') || label.includes('permit') || label.includes('legal')) {
          // This is a simplified check; custom logic would go here
          // opt.click(); 
        }
      });
    }

    sendResponse({ status: "success", unfilled: missing });
  }
  return true; 
});