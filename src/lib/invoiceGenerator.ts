import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface ProductItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface InvoiceData {
    customer: Customer;
    product: ProductItem;
}

export const generateInvoicePDF = async (data: InvoiceData) => {
    const { customer, product } = data;

    // Create new PDF document
    const doc = new jsPDF();

    // Generate invoice number and date
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    const invoiceDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const uniqueCode = `${product.id.slice(0, 8).toUpperCase()}-${product.quantity}`;

    // Colors - properly typed as tuples
    const primaryColor: [number, number, number] = [255, 153, 51]; // Saffron
    const darkColor: [number, number, number] = [51, 51, 51];
    const lightGray: [number, number, number] = [240, 240, 240];

    // Header - Company Name
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('NASHIK CONNECT', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Kumbh Vyapaar Marketplace', 105, 28, { align: 'center' });
    doc.text('Connecting Pilgrims & Merchants', 105, 35, { align: 'center' });

    // Invoice Title
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 20, 55);

    // Invoice Details (Right side)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoiceNumber}`, 150, 50, { align: 'right' });
    doc.text(`Date: ${invoiceDate}`, 150, 56, { align: 'right' });
    doc.text(`Code: ${uniqueCode}`, 150, 62, { align: 'right' });

    // Divider line
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 68, 190, 68);

    // Bill To Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('BILL TO:', 20, 80);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(customer.name, 20, 88);
    doc.text(customer.email, 20, 94);
    doc.text(customer.phone, 20, 100);

    // Address (with word wrap)
    const addressLines = doc.splitTextToSize(customer.address, 80);
    doc.text(addressLines, 20, 106);

    // Product Table
    const tableStartY = 120 + (addressLines.length * 4);

    autoTable(doc, {
        startY: tableStartY,
        head: [['Product Name', 'Unique Code', 'Quantity', 'Unit Price', 'Total']],
        body: [
            [
                product.name,
                uniqueCode,
                product.quantity.toString(),
                `₹${product.price.toLocaleString('en-IN')}`,
                `₹${(product.price * product.quantity).toLocaleString('en-IN')}`
            ]
        ],
        theme: 'striped',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 10,
            textColor: darkColor
        },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 40, halign: 'center' },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 35, halign: 'right' }
        },
        margin: { left: 20, right: 20 }
    });

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 30;

    // Subtotal, Tax, Total Section
    const summaryX = 130;
    let summaryY = finalY + 15;

    const subtotal = product.price * product.quantity;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Subtotal
    doc.text('Subtotal:', summaryX, summaryY);
    doc.text(`₹${subtotal.toLocaleString('en-IN')}`, 190, summaryY, { align: 'right' });

    // Tax
    summaryY += 7;
    doc.text('GST (18%):', summaryX, summaryY);
    doc.text(`₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 190, summaryY, { align: 'right' });

    // Total line
    summaryY += 2;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.3);
    doc.line(summaryX, summaryY, 190, summaryY);

    // Total
    summaryY += 7;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('TOTAL:', summaryX, summaryY);
    doc.text(`₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 190, summaryY, { align: 'right' });

    // Payment Terms
    summaryY += 15;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('Payment Terms: Due upon receipt', 20, summaryY);

    // Footer
    const footerY = 270;
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(0, footerY, 210, 27, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your business!', 105, footerY + 8, { align: 'center' });
    doc.text('For any queries, contact us at: support@nashikconnect.com | +91 XXXXX XXXXX', 105, footerY + 14, { align: 'center' });
    doc.text('Nashik Connect - Empowering Local Businesses', 105, footerY + 20, { align: 'center' });

    // Save the PDF
    doc.save(`Invoice_${invoiceNumber}_${customer.name.replace(/\s+/g, '_')}.pdf`);
};
