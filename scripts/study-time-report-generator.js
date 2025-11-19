document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-report-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', generateStudyTimeReport);
    }
});

function generateStudyTimeReport() {
    const { jsPDF } = window.jspdf;
    const reportContent = document.getElementById('study-time-report');
    const downloadButton = document.getElementById('download-report-btn');
    const resetButton = document.getElementById('reset-btn');

    // Ocultar botones solo si existen
    if (downloadButton) downloadButton.style.display = 'none';
    if (resetButton) resetButton.style.display = 'none';

    html2canvas(reportContent, {
        scale: 2, 
        useCORS: true 
    }).then(canvas => {
        // Volver a mostrar los botones si existen
        if (downloadButton) downloadButton.style.display = 'inline-flex';
        if (resetButton) resetButton.style.display = 'inline-flex';

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.setFontSize(18);
        pdf.text('Reporte de Tiempo de Estudio', pdfWidth / 2, 15, { align: 'center' });

        pdf.addImage(imgData, 'PNG', 10, 25, pdfWidth - 20, pdfHeight > 270 ? 270 : pdfHeight); // Adjust height if too long
        pdf.save('reporte-tiempo-estudio.pdf');

    }).catch(err => {
        // Asegurarse de que los botones se muestren de nuevo si hay un error
        if (downloadButton) downloadButton.style.display = 'inline-flex';
        if (resetButton) resetButton.style.display = 'inline-flex';
        console.error("Error al generar el PDF del reporte:", err);
    });
}
