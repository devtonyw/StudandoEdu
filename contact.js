// Initialize EmailJS with your public key
(function() {
    emailjs.init("rujjorEmTKLdry08P"); // Replace with your actual public key from EmailJS
})();

// Get the form element
const contactForm = document.getElementById('contactForm');

// Add submit event listener to the form
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Show loading state
    const submitButton = document.querySelector('.submit-btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Prepare template parameters
    const templateParams = {
        to_email: 'studandoofficial@gmail.com',
        from_name: name,
        from_email: email,
        message: message
    };

    // Send email using EmailJS
    emailjs.send('service_dtew8kb', 'template_n97te3m', templateParams)
        .then(function(response) {
            // Show success message
            alert('Mensagem enviada com sucesso!');
            
            // Reset form
            contactForm.reset();
        }, function(error) {
            // Show error message
            alert('Erro ao enviar mensagem. Por favor, tente novamente.');
            console.error('EmailJS Error:', error);
        })
        .finally(function() {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
});