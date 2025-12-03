document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.querySelector('.btn-generate');
  
  if (generateBtn) {
    generateBtn.addEventListener('click', (e) => {
      // Gather data
      // Select the first input which is the title
      const titleInput = document.querySelector('.form-column input.form-input');
      const title = titleInput ? titleInput.value : "Mi Reporte Vocacional";
      
      const includeLogoSelect = document.querySelector('.form-select');
      const includeLogo = includeLogoSelect ? includeLogoSelect.value : "Sin logo";
      
      const messageInput = document.querySelector('.form-textarea');
      const message = messageInput ? messageInput.value : "";
      
      // Checkboxes
      const sections = {};
      const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
      checkboxes.forEach(cb => {
        const label = cb.nextElementSibling.textContent.trim();
        sections[label] = cb.checked;
      });

      const config = {
        title,
        includeLogo,
        message,
        sections
      };

      localStorage.setItem('reportConfig', JSON.stringify(config));
    });
  }
});