document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', generatePlanPDF);
    }
});

function generatePlanPDF() {
    const { jsPDF } = window.jspdf;
    const content = document.getElementById('plan-content');
    const downloadButton = document.getElementById('download-btn');

    // Ocultar el botón para que no aparezca en la captura
    downloadButton.style.display = 'none';

    html2canvas(content, {
        scale: 2, // Aumentar la escala para mejor calidad
        useCORS: true 
    }).then(canvas => {
        // Volver a mostrar el botón
        downloadButton.style.display = 'inline-flex';

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('plan-de-transicion.pdf');
    }).catch(err => {
        // Asegurarse de que el botón se muestre de nuevo si hay un error
        downloadButton.style.display = 'inline-flex';
        console.error("Error al generar el PDF:", err);
    });
}
