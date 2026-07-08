/* ==========================================
   GrowItWithHR V8
   pdf.js
   PDF Report Actions
========================================== */

let activePDFReportData = null;

function openPDFModal(reportData) {
    activePDFReportData = reportData;

    const modal = document.getElementById("pdfModal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function closePDFModal() {
    const modal = document.getElementById("pdfModal");

    if (modal) {
        modal.style.display = "none";
    }
}

function bindPDFEvents() {
    const cancel = document.getElementById("cancelReportBtn");
    const generate = document.getElementById("generateReportBtn");

    if (cancel) {
        cancel.addEventListener("click", closePDFModal);
    }

    if (generate) {
        generate.addEventListener("click", generatePDFReport);
    }
}

async function generatePDFReport() {
    const dashboard = document.getElementById("executiveDashboard");

    if (!dashboard || !window.html2canvas || !window.jspdf) {
        window.print();
        closePDFModal();
        return;
    }

    const canvas = await html2canvas(dashboard, {
        scale: 2,
        backgroundColor: "#0b1120"
    });

    const image = canvas.toDataURL("image/png");
    const pdf = new window.jspdf.jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageHeight = canvas.height * pageWidth / canvas.width;
    let heightLeft = imageHeight;
    let position = 0;

    pdf.addImage(image, "PNG", 0, position, pageWidth, imageHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position = heightLeft - imageHeight;
        pdf.addPage();
        pdf.addImage(image, "PNG", 0, position, pageWidth, imageHeight);
        heightLeft -= pageHeight;
    }

    pdf.save("GrowItWithHR-Advisory-Report.pdf");
    closePDFModal();

    if (activePDFReportData) {
        localStorage.setItem("growitwithhrLastReportDownload", new Date().toISOString());
    }
}
