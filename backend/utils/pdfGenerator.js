const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.jpg');
const BLUE = '#0B4DA2';
const YELLOW_BG = '#FFF3CD';
const LIGHT_BLUE = '#E8F0FE';
const BORDER = '#333333';

// ─── Draw bordered box ───
function box(doc, x, y, w, h, opts = {}) {
    if (opts.fill) { doc.rect(x, y, w, h).fill(opts.fill); }
    doc.rect(x, y, w, h).lineWidth(opts.lineWidth || 0.5).stroke(opts.stroke || BORDER);
}

// ─── Company header matching SMG PDFs ───
function smgHeader(doc, title, formCode) {
    const headerY = 40;
    // Logo on left
    if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, 50, headerY, { width: 70, height: 50 });
    }
    // Center title box
    box(doc, 130, headerY, 280, 50, { fill: LIGHT_BLUE });
    box(doc, 130, headerY, 280, 50);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(BLUE).text('SMG ELECTRIC SCOOTERS LTD', 130, headerY + 8, { width: 280, align: 'center' });
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text(title, 130, headerY + 28, { width: 280, align: 'center' });
    // Yellow metadata box on right
    box(doc, 420, headerY, 125, 50, { fill: YELLOW_BG });
    box(doc, 420, headerY, 125, 50);
    doc.fontSize(7).font('Helvetica').fillColor('#000');
    doc.text(`Form Code: ${formCode || '-'}`, 425, headerY + 5);
    doc.text('Revision Status: -', 425, headerY + 18);
    doc.text(`Revision Date: -`, 425, headerY + 31);
    doc.y = headerY + 60;
    doc.fillColor('#000');
}

// ─── Field row with border ───
function fieldBox(doc, x, y, w, h, label, value, labelWidth) {
    box(doc, x, y, w, h);
    labelWidth = labelWidth || 100;
    doc.fontSize(8).font('Helvetica-Bold').text(label, x + 4, y + 4, { width: labelWidth });
    doc.fontSize(9).font('Helvetica').text(value || '', x + labelWidth + 2, y + 4, { width: w - labelWidth - 6 });
}

// ─── Section heading ───
function sectionHead(doc, text, y) {
    box(doc, 50, y, 495, 18, { fill: BLUE });
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff').text(text, 55, y + 4);
    doc.fillColor('#000');
    return y + 18;
}

// ─── Footer with signatures ───
function signatureFooter(doc, leftLabel, rightLabel) {
    const y = doc.y + 30;
    doc.moveTo(50, y).lineTo(200, y).stroke(BORDER);
    doc.moveTo(395, y).lineTo(545, y).stroke(BORDER);
    doc.fontSize(8).font('Helvetica-Bold');
    doc.text(leftLabel || 'Signature of Employee', 50, y + 5);
    doc.text(rightLabel || 'Signature of HOD', 395, y + 5);
}

function autoGenFooter(doc) {
    doc.moveDown(1);
    doc.fontSize(7).fillColor('#999').font('Helvetica-Oblique')
       .text(`Auto-generated from SMG Employee Cloud Portal on ${new Date().toLocaleString('en-IN')}`, 50, doc.page.height - 40, { align: 'center', width: 495 });
}

// ═══════════════════════════════════════════
//  GATE PASS / LEAVE APPLICATION PDF
// ═══════════════════════════════════════════
function generateGatePassPDF(gatePass, user) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    smgHeader(doc, 'GATE PASS FOR LEAVE', 'SMG/HR/GP');
    let y = doc.y + 10;

    // Row 1: Dept + Ledger No
    fieldBox(doc, 50, y, 250, 22, 'Deptt:', user.dept); 
    fieldBox(doc, 300, y, 245, 22, 'Ledger No:', user.empId);
    y += 22;
    // Row 2: Name + Employee Code
    fieldBox(doc, 50, y, 250, 22, 'Name:', user.name);
    fieldBox(doc, 300, y, 245, 22, 'Employee Code:', user.empId);
    y += 22;
    // Row 3: From + To + Days
    fieldBox(doc, 50, y, 170, 22, 'From:', gatePass.outTime);
    fieldBox(doc, 220, y, 170, 22, 'To:', gatePass.inTime || 'N/A');
    fieldBox(doc, 390, y, 155, 22, 'Date:', new Date(gatePass.date).toLocaleDateString('en-IN'));
    y += 22;
    // Row 4: Nature / Type
    fieldBox(doc, 50, y, 495, 22, 'Nature:', `${gatePass.type} Gate Pass`);
    y += 22;
    // Row 5: Reason
    box(doc, 50, y, 495, 50);
    doc.fontSize(8).font('Helvetica-Bold').text('Reason:', 54, y + 4);
    doc.fontSize(9).font('Helvetica').text(gatePass.reason, 54, y + 16, { width: 485 });
    y += 50;
    // Status
    fieldBox(doc, 50, y, 250, 22, 'Status:', gatePass.status);
    fieldBox(doc, 300, y, 245, 22, 'Approved By:', gatePass.approver || 'Pending');
    doc.y = y + 22;

    // Leave Pass (bottom section)
    doc.y += 20;
    const passY = doc.y;
    doc.moveTo(50, passY).lineTo(545, passY).dash(3, { space: 3 }).stroke(BORDER);
    doc.undash();
    doc.y = passY + 10;
    y = sectionHead(doc, 'LEAVE PASS', doc.y);
    fieldBox(doc, 50, y, 170, 22, 'Name:', user.name);
    fieldBox(doc, 220, y, 170, 22, 'Employee Code:', user.empId);
    fieldBox(doc, 390, y, 155, 22, 'Deptt:', user.dept);
    y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Entry Time:', gatePass.inTime || '');
    fieldBox(doc, 300, y, 245, 22, 'Exit Time:', gatePass.outTime);
    doc.y = y + 30;

    signatureFooter(doc, 'Signature of Employee', 'Signature of Deptt Head / Personnel');
    autoGenFooter(doc);
    doc.end();
    return doc;
}

// ═══════════════════════════════════════════
//  ATTENDANCE MISS SLIP PDF
// ═══════════════════════════════════════════
function generateMissSlipPDF(slip, user) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    smgHeader(doc, 'ATTENDANCE MISS SLIP', 'SMG/HR/AMS');
    
    let y = doc.y + 5;
    // Blue subtitle box
    y = sectionHead(doc, 'Gate Pass (for those who missed or forgot their punching card)', y);
    y += 5;
    
    // Date top-right
    fieldBox(doc, 370, y, 175, 22, 'Date:', new Date(slip.date).toLocaleDateString('en-IN'));
    y += 28;
    // Fields
    fieldBox(doc, 50, y, 495, 22, 'NAME:', user.name); y += 22;
    fieldBox(doc, 50, y, 495, 22, 'EMPLOYEE CODE:', user.empId); y += 22;
    fieldBox(doc, 50, y, 495, 22, 'DEPARTMENT:', user.dept); y += 22;
    fieldBox(doc, 50, y, 495, 22, 'MISS TYPE:', slip.missType); y += 22;
    fieldBox(doc, 50, y, 495, 55, 'PURPOSE:', slip.reason, 80); y += 55;
    // In/Out time
    y += 5;
    fieldBox(doc, 50, y, 245, 30, 'IN TIME:', slip.actualCheckIn || '');
    fieldBox(doc, 300, y, 245, 30, 'OUT TIME:', slip.actualCheckOut || '');
    y += 30;
    doc.fontSize(7).font('Helvetica-Oblique').text('(Time to be filled by personnel department at the time of exit with sign)', 50, y + 3, { width: 495, align: 'center' });
    y += 15;
    // Status
    fieldBox(doc, 50, y, 250, 22, 'Status:', slip.status);
    fieldBox(doc, 300, y, 245, 22, 'Approved By:', slip.approver || 'Pending');
    doc.y = y + 30;

    signatureFooter(doc, 'SIGN OF EMPLOYEE', 'SIGN OF THE HOD');
    autoGenFooter(doc);
    doc.end();
    return doc;
}

// ═══════════════════════════════════════════
//  SALARY SLIP / PAYSLIP PDF
// ═══════════════════════════════════════════
function generatePayslipPDF(payroll, user) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    smgHeader(doc, 'COMPENSATION PACKAGE (ANNEXURE-1)', 'SMG/HR/SAL');

    let y = doc.y + 5;
    // Employee info
    fieldBox(doc, 50, y, 250, 20, 'Employee:', user.name);
    fieldBox(doc, 300, y, 245, 20, 'Employee ID:', user.empId);
    y += 20;
    fieldBox(doc, 50, y, 250, 20, 'Designation:', user.designation || '-');
    fieldBox(doc, 300, y, 245, 20, 'Department:', user.dept);
    y += 20;
    fieldBox(doc, 50, y, 250, 20, 'Month:', payroll.month);
    fieldBox(doc, 300, y, 245, 20, 'Status:', payroll.status);
    y += 25;

    // Table header
    const colX = [50, 280, 390];
    const colW = [230, 110, 155];
    box(doc, colX[0], y, colW[0], 20, { fill: BLUE });
    box(doc, colX[1], y, colW[1], 20, { fill: BLUE });
    box(doc, colX[2], y, colW[2], 20, { fill: BLUE });
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff');
    doc.text('SALARY HEAD', colX[0] + 5, y + 5);
    doc.text('MONTHLY (₹)', colX[1] + 5, y + 5);
    doc.text('ANNUAL (₹)', colX[2] + 5, y + 5);
    doc.fillColor('#000');
    y += 20;

    // Section A: Earnings
    y = sectionHead(doc, 'A. EARNINGS', y);
    const earnings = [
        ['Basic Salary', payroll.basicSalary],
        ['House Rent Allowance (HRA)', payroll.hra],
        ['Special Allowance', payroll.specialAllowance],
        ['Conveyance Allowance', payroll.conveyance],
        ['Medical Allowance', payroll.medicalAllowance],
        ['Other Allowances', payroll.allowances]
    ];
    earnings.forEach(([label, amt]) => {
        box(doc, colX[0], y, colW[0], 18); box(doc, colX[1], y, colW[1], 18); box(doc, colX[2], y, colW[2], 18);
        doc.fontSize(8).font('Helvetica').text(label, colX[0]+5, y+4);
        doc.text((amt||0).toLocaleString('en-IN'), colX[1]+5, y+4, {width:100, align:'right'});
        doc.text(((amt||0)*12).toLocaleString('en-IN'), colX[2]+5, y+4, {width:140, align:'right'});
        y += 18;
    });
    // Gross total
    box(doc, colX[0], y, colW[0], 20, {fill:LIGHT_BLUE}); box(doc, colX[1], y, colW[1], 20, {fill:LIGHT_BLUE}); box(doc, colX[2], y, colW[2], 20, {fill:LIGHT_BLUE});
    doc.font('Helvetica-Bold').fontSize(9);
    doc.text('GROSS SALARY', colX[0]+5, y+5);
    doc.text(payroll.grossSalary.toLocaleString('en-IN'), colX[1]+5, y+5, {width:100, align:'right'});
    doc.text((payroll.grossSalary*12).toLocaleString('en-IN'), colX[2]+5, y+5, {width:140, align:'right'});
    y += 20;

    // Section B: Deductions
    y = sectionHead(doc, 'B. DEDUCTIONS', y);
    const deductions = [
        ['Provident Fund (EPF)', payroll.pf],
        ['Income Tax (TDS)', payroll.tax],
        ['Professional Tax', payroll.professionalTax],
        ['Other Deductions', payroll.otherDeductions]
    ];
    deductions.forEach(([label, amt]) => {
        box(doc, colX[0], y, colW[0], 18); box(doc, colX[1], y, colW[1], 18); box(doc, colX[2], y, colW[2], 18);
        doc.fontSize(8).font('Helvetica').text(label, colX[0]+5, y+4);
        doc.text((amt||0).toLocaleString('en-IN'), colX[1]+5, y+4, {width:100, align:'right'});
        doc.text(((amt||0)*12).toLocaleString('en-IN'), colX[2]+5, y+4, {width:140, align:'right'});
        y += 18;
    });
    box(doc, colX[0], y, colW[0], 20, {fill:LIGHT_BLUE}); box(doc, colX[1], y, colW[1], 20, {fill:LIGHT_BLUE}); box(doc, colX[2], y, colW[2], 20, {fill:LIGHT_BLUE});
    doc.font('Helvetica-Bold').fontSize(9);
    doc.text('TOTAL DEDUCTIONS', colX[0]+5, y+5);
    doc.text(payroll.totalDeductions.toLocaleString('en-IN'), colX[1]+5, y+5, {width:100, align:'right'});
    doc.text((payroll.totalDeductions*12).toLocaleString('en-IN'), colX[2]+5, y+5, {width:140, align:'right'});
    y += 25;

    // Net Salary
    box(doc, 50, y, 495, 28, { fill: '#E8F5E9' });
    box(doc, 50, y, 495, 28);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#2E7D32');
    doc.text('NET SALARY:', 60, y + 7);
    doc.text(`₹ ${payroll.netSalary.toLocaleString('en-IN')}`, 300, y + 7, { width: 240, align: 'right' });
    doc.fillColor('#000');
    doc.y = y + 35;

    doc.fontSize(7).font('Helvetica').text('Note: Income Tax will be deducted as per the provisions of the Income Tax Act. ESI will be deducted where applicable.', 50, doc.y);
    autoGenFooter(doc);
    doc.end();
    return doc;
}

// ═══════════════════════════════════════════
//  LEAVE APPLICATION PDF
// ═══════════════════════════════════════════
function generateLeavePDF(leave, user) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    smgHeader(doc, 'LEAVE APPLICATION FORM', 'SMG/HR/LA');
    let y = doc.y + 10;

    fieldBox(doc, 50, y, 250, 22, 'Deptt:', user.dept);
    fieldBox(doc, 300, y, 245, 22, 'Ledger No:', user.empId); y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Name:', user.name);
    fieldBox(doc, 300, y, 245, 22, 'Employee Code:', user.empId); y += 22;
    fieldBox(doc, 50, y, 165, 22, 'From:', new Date(leave.from).toLocaleDateString('en-IN'));
    fieldBox(doc, 215, y, 165, 22, 'To:', new Date(leave.to).toLocaleDateString('en-IN'));
    fieldBox(doc, 380, y, 165, 22, 'Days:', `${leave.days}`); y += 22;
    // Nature of leave with checkboxes
    const types = ['Annual Leave', 'Casual Leave', 'Sick Leave'];
    box(doc, 50, y, 495, 22);
    doc.fontSize(8).font('Helvetica-Bold').text('Nature Of Leave:', 54, y + 6);
    types.forEach((t, i) => {
        const cx = 170 + i * 110;
        box(doc, cx, y + 3, 12, 12);
        if (leave.type === t) { doc.text('✓', cx + 2, y + 3, { width: 12, align: 'center' }); }
        doc.fontSize(8).font('Helvetica').text(t, cx + 16, y + 6);
    });
    y += 22;
    // Reason
    box(doc, 50, y, 495, 55);
    doc.fontSize(8).font('Helvetica-Bold').text('Reason For Leave:', 54, y + 4);
    doc.fontSize(9).font('Helvetica').text(leave.reason, 54, y + 16, { width: 485 });
    y += 55;
    // Status & Approver
    fieldBox(doc, 50, y, 250, 22, 'Status:', leave.status);
    fieldBox(doc, 300, y, 245, 22, 'Approved By:', leave.approver || 'Pending');
    doc.y = y + 30;

    signatureFooter(doc, 'Signature of Employee', 'Signature of HOD / Personnel');
    autoGenFooter(doc);
    doc.end();
    return doc;
}

// ═══════════════════════════════════════════
//  TRAVEL REIMBURSEMENT PDF
// ═══════════════════════════════════════════
function generateTravelPDF(travel, user) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    smgHeader(doc, 'TRAVELLING REIMBURSEMENT FORM', 'SMG/HR/TRV');
    let y = doc.y + 10;

    fieldBox(doc, 50, y, 250, 22, 'Name:', user.name);
    fieldBox(doc, 300, y, 245, 22, 'Employee Code:', user.empId); y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Department:', user.dept);
    fieldBox(doc, 300, y, 245, 22, 'Designation:', user.designation || '-'); y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Contact:', user.phone || '-');
    fieldBox(doc, 300, y, 245, 22, 'Email:', user.email); y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Travel Type:', travel.travelType);
    fieldBox(doc, 300, y, 245, 22, 'Mode of Travel:', travel.travelMode); y += 22;
    fieldBox(doc, 50, y, 495, 30, 'Purpose:', travel.purpose, 70); y += 35;

    // Yellow section header
    y = sectionHead(doc, 'TRAVEL DETAILS', y);
    fieldBox(doc, 50, y, 250, 22, 'From City:', travel.fromCity);
    fieldBox(doc, 300, y, 245, 22, 'To City:', travel.toCity); y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Departure:', new Date(travel.departureDate).toLocaleDateString('en-IN'));
    fieldBox(doc, 300, y, 245, 22, 'Return:', new Date(travel.returnDate).toLocaleDateString('en-IN')); y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Accommodation:', travel.accommodation ? 'Yes' : 'No');
    fieldBox(doc, 300, y, 245, 22, 'Estimated Cost:', `₹${(travel.estimatedCost||0).toLocaleString('en-IN')}`); y += 27;

    // Expense table
    if (travel.expenses && travel.expenses.length > 0) {
        // Table header
        const ec = [50, 130, 260, 380];
        const ew = [80, 130, 120, 165];
        box(doc, ec[0], y, ew[0], 18, {fill:BLUE}); box(doc, ec[1], y, ew[1], 18, {fill:BLUE});
        box(doc, ec[2], y, ew[2], 18, {fill:BLUE}); box(doc, ec[3], y, ew[3], 18, {fill:BLUE});
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#fff');
        doc.text('Sr No', ec[0]+5, y+4); doc.text('From → To', ec[1]+5, y+4);
        doc.text('Mode Of Travel', ec[2]+5, y+4); doc.text('Amount (₹)', ec[3]+5, y+4);
        doc.fillColor('#000'); y += 18;
        travel.expenses.forEach((exp, i) => {
            box(doc, ec[0], y, ew[0], 18); box(doc, ec[1], y, ew[1], 18);
            box(doc, ec[2], y, ew[2], 18); box(doc, ec[3], y, ew[3], 18);
            doc.fontSize(8).font('Helvetica');
            doc.text(`${i+1}`, ec[0]+5, y+4); doc.text(exp.description || '-', ec[1]+5, y+4);
            doc.text(exp.category || '-', ec[2]+5, y+4); doc.text(`${(exp.amount||0).toLocaleString('en-IN')}`, ec[3]+5, y+4, {width:155, align:'right'});
            y += 18;
        });
        // Total row
        box(doc, ec[0], y, ew[0]+ew[1]+ew[2], 20, {fill:LIGHT_BLUE}); box(doc, ec[3], y, ew[3], 20, {fill:LIGHT_BLUE});
        doc.font('Helvetica-Bold').fontSize(9).text('Total (₹)', ec[0]+5, y+5);
        doc.text(`${(travel.totalExpense||0).toLocaleString('en-IN')}`, ec[3]+5, y+5, {width:155, align:'right'});
        y += 20;
    }

    fieldBox(doc, 50, y + 5, 250, 22, 'Status:', travel.status);
    fieldBox(doc, 300, y + 5, 245, 22, 'Approved By:', travel.approver || 'Pending');
    doc.y = y + 35;

    // Three signature lines
    const sy = doc.y + 20;
    doc.moveTo(50, sy).lineTo(180, sy).stroke(BORDER);
    doc.moveTo(210, sy).lineTo(370, sy).stroke(BORDER);
    doc.moveTo(400, sy).lineTo(545, sy).stroke(BORDER);
    doc.fontSize(7).font('Helvetica-Bold');
    doc.text('Candidate/Employee', 55, sy + 4);
    doc.text('HOD', 270, sy + 4);
    doc.text('Approved By', 445, sy + 4);

    autoGenFooter(doc);
    doc.end();
    return doc;
}

// ═══════════════════════════════════════════
//  EXPERIENCE / OFFER LETTER PDF
// ═══════════════════════════════════════════
function generateLetterPDF(type, user) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    smgHeader(doc, type === 'experience' ? 'EXPERIENCE CERTIFICATE' : 'OFFER LETTER', 'SMG/HR/DOC');
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Date: ${today}`, { align: 'right' });
    doc.moveDown(1);

    if (type === 'experience') {
        doc.font('Helvetica').fontSize(11).text('To Whom It May Concern,', 50);
        doc.moveDown(1);
        doc.text(`This is to certify that Mr./Ms. ${user.name} (Employee ID: ${user.empId}) has been employed with SMG Electric Scooters Ltd in the ${user.dept} department as ${user.designation || 'an employee'} since ${user.dateOfJoining}.`, 50, doc.y, { width: 495, lineGap: 5 });
        doc.moveDown(0.8);
        doc.text(`During their tenure, they have demonstrated excellent proficiency in ${(user.skills || []).slice(0, 3).join(', ')} and have been a valuable asset to the organization.`, 50, doc.y, { width: 495, lineGap: 5 });
        doc.moveDown(0.8);
        doc.text('We wish them all the best in their future endeavours.', 50);
    } else {
        doc.font('Helvetica').fontSize(11).text(`Dear ${user.name},`, 50);
        doc.moveDown(1);
        doc.text(`We are pleased to offer you the position of ${user.designation || 'Employee'} in the ${user.dept} department at SMG Electric Scooters Ltd, effective from ${user.dateOfJoining}.`, 50, doc.y, { width: 495, lineGap: 5 });
        doc.moveDown(0.8);
        doc.text('Please find the detailed terms and conditions of your employment enclosed.', 50, doc.y, { width: 495, lineGap: 5 });
    }
    doc.moveDown(3);
    doc.font('Helvetica-Bold').text('For SMG Electric Scooters Ltd', 50);
    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(200, doc.y).stroke(BORDER);
    doc.text('Authorized Signatory', 50);
    autoGenFooter(doc);
    doc.end();
    return doc;
}

function generateCanteenOrderPDF(order, user) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    smgHeader(doc, 'CANTEEN ORDER RECEIPT', 'SMG/CN/ORD');
    let y = doc.y + 10;

    // Row 1: Name + Employee Code
    fieldBox(doc, 50, y, 250, 22, 'Name:', user.name);
    fieldBox(doc, 300, y, 245, 22, 'Employee Code:', user.empId);
    y += 22;

    // Row 2: Dept + Date
    fieldBox(doc, 50, y, 250, 22, 'Department:', user.dept);
    const orderDate = new Date(order.date);
    const dateStr = orderDate.toLocaleDateString('en-IN') + ' ' + orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    fieldBox(doc, 300, y, 245, 22, 'Order Date:', dateStr);
    y += 22;

    // Row 3: Order ID + Payment Mode
    fieldBox(doc, 50, y, 250, 22, 'Order ID:', order._id.toString());
    fieldBox(doc, 300, y, 245, 22, 'Payment Mode:', order.paymentMode || 'Wallet');
    y += 27;

    // Section Header: Items
    y = sectionHead(doc, 'ORDER ITEMS & BILL DETAILS', y);

    // Items Table Header
    const colX = [50, 280, 380, 460];
    const colW = [230, 100, 80, 85];
    box(doc, colX[0], y, colW[0], 20, { fill: BLUE });
    box(doc, colX[1], y, colW[1], 20, { fill: BLUE });
    box(doc, colX[2], y, colW[2], 20, { fill: BLUE });
    box(doc, colX[3], y, colW[3], 20, { fill: BLUE });
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff');
    doc.text('ITEM NAME', colX[0] + 5, y + 5);
    doc.text('UNIT PRICE (₹)', colX[1] + 5, y + 5, { width: 90, align: 'right' });
    doc.text('QTY', colX[2] + 5, y + 5, { width: 70, align: 'center' });
    doc.text('AMOUNT (₹)', colX[3] + 5, y + 5, { width: 75, align: 'right' });
    doc.fillColor('#000');
    y += 20;

    // Order items loop
    order.items.forEach((item) => {
        const itemAmt = item.price * item.quantity;
        box(doc, colX[0], y, colW[0], 18);
        box(doc, colX[1], y, colW[1], 18);
        box(doc, colX[2], y, colW[2], 18);
        box(doc, colX[3], y, colW[3], 18);
        doc.fontSize(8).font('Helvetica').text(item.name, colX[0] + 5, y + 4);
        doc.text(item.price.toFixed(2), colX[1] + 5, y + 4, { width: 90, align: 'right' });
        doc.text(item.quantity.toString(), colX[2] + 5, y + 4, { width: 70, align: 'center' });
        doc.text(itemAmt.toFixed(2), colX[3] + 5, y + 4, { width: 75, align: 'right' });
        y += 18;
    });

    // Calculate subtotal & GST based on totalAmount (which is 1.05 times subtotal)
    const subtotal = order.totalAmount / 1.05;
    const gst = order.totalAmount - subtotal;

    // Subtotal Row
    box(doc, colX[0], y, colW[0] + colW[1] + colW[2], 18, { fill: LIGHT_BLUE });
    box(doc, colX[3], y, colW[3], 18, { fill: LIGHT_BLUE });
    doc.fontSize(8).font('Helvetica-Bold').text('SUBTOTAL', colX[0] + 5, y + 4);
    doc.text(subtotal.toFixed(2), colX[3] + 5, y + 4, { width: 75, align: 'right' });
    y += 18;

    // GST Row
    box(doc, colX[0], y, colW[0] + colW[1] + colW[2], 18, { fill: LIGHT_BLUE });
    box(doc, colX[3], y, colW[3], 18, { fill: LIGHT_BLUE });
    doc.fontSize(8).font('Helvetica-Bold').text('GST (5%)', colX[0] + 5, y + 4);
    doc.text(gst.toFixed(2), colX[3] + 5, y + 4, { width: 75, align: 'right' });
    y += 18;

    // Net Total Row
    box(doc, colX[0], y, colW[0] + colW[1] + colW[2], 22, { fill: '#E8F5E9' });
    box(doc, colX[3], y, colW[3], 22, { fill: '#E8F5E9' });
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#2E7D32').text('TOTAL PAID', colX[0] + 5, y + 6);
    doc.text(`₹ ${order.totalAmount.toFixed(2)}`, colX[3] + 5, y + 6, { width: 75, align: 'right' });
    doc.fillColor('#000');
    y += 30;

    doc.y = y;
    signatureFooter(doc, 'Customer Signature', 'Canteen In-charge Sign');
    autoGenFooter(doc);
    doc.end();
    return doc;
}

function generateUniformPDF(request, user) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    smgHeader(doc, 'UNIFORM REQUISITION RECEIPT', 'SMG/HR/UNIFORM');
    let y = doc.y + 10;

    // Row 1: Name + Employee Code
    fieldBox(doc, 50, y, 250, 22, 'Name:', user.name);
    fieldBox(doc, 300, y, 245, 22, 'Employee Code:', user.empId || 'N/A');
    y += 22;

    // Row 2: Department + Designation
    fieldBox(doc, 50, y, 250, 22, 'Department:', user.dept || 'N/A');
    fieldBox(doc, 300, y, 245, 22, 'Designation:', user.designation || 'N/A');
    y += 22;

    // Row 3: Request ID + Status
    fieldBox(doc, 50, y, 250, 22, 'Request ID:', request.requestId);
    fieldBox(doc, 300, y, 245, 22, 'Status:', request.status);
    y += 22;

    // Row 4: Created At + Expected Date
    const reqDate = request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    fieldBox(doc, 50, y, 250, 22, 'Request Date:', reqDate);
    const delDate = request.deliveryDate ? new Date(request.deliveryDate).toLocaleDateString('en-IN') : 'Pending Dispatch';
    fieldBox(doc, 300, y, 245, 22, 'Expected/Delivery Date:', delDate);
    y += 27;

    // Section Header: Items
    y = sectionHead(doc, 'REQUESTED UNIFORM ITEMS', y);

    // Table Header
    const colX = [50, 300, 430];
    const colW = [250, 130, 115];
    box(doc, colX[0], y, colW[0], 20, { fill: BLUE });
    box(doc, colX[1], y, colW[1], 20, { fill: BLUE });
    box(doc, colX[2], y, colW[2], 20, { fill: BLUE });
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff');
    doc.text('ITEM NAME', colX[0] + 5, y + 5);
    doc.text('SIZE', colX[1] + 5, y + 5, { width: 120, align: 'center' });
    doc.text('QTY', colX[2] + 5, y + 5, { width: 105, align: 'center' });
    doc.fillColor('#000');
    y += 20;

    // Items loop
    request.items.forEach((item) => {
        box(doc, colX[0], y, colW[0], 18);
        box(doc, colX[1], y, colW[1], 18);
        box(doc, colX[2], y, colW[2], 18);
        doc.fontSize(8).font('Helvetica').text(item.name || item.itemType || '', colX[0] + 5, y + 4);
        doc.text(item.size || 'N/A', colX[1] + 5, y + 4, { width: 120, align: 'center' });
        doc.text((item.quantity || 1).toString(), colX[2] + 5, y + 4, { width: 105, align: 'center' });
        y += 18;
    });

    y += 10;
    if (request.approver) {
        fieldBox(doc, 50, y, 495, 22, 'Approver Name:', request.approver);
        y += 22;
    }

    doc.y = y;
    signatureFooter(doc, 'Employee Signature', 'Authorized Signatory (P&A)');
    autoGenFooter(doc);
    doc.end();
    return doc;
}

// ═══════════════════════════════════════════
//  EMPLOYEE PROFILE PDF
// ═══════════════════════════════════════════
function generateEmployeeProfilePDF(user, extraData = {}) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    smgHeader(doc, 'EMPLOYEE PROFILE CARD', 'SMG/HR/EPC');
    let y = doc.y + 8;

    // ── Personal Information ──
    y = sectionHead(doc, 'PERSONAL INFORMATION', y);

    fieldBox(doc, 50, y, 250, 22, 'Full Name:', user.name || '-');
    fieldBox(doc, 300, y, 245, 22, 'Employee ID:', user.empId || '-');
    y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Email:', user.email || '-');
    fieldBox(doc, 300, y, 245, 22, 'Phone:', user.phone || '-');
    y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Date of Birth:', user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN') : '-');
    fieldBox(doc, 300, y, 245, 22, 'Blood Group:', user.bloodGroup || '-');
    y += 22;
    fieldBox(doc, 50, y, 495, 22, 'Address:', user.address || '-');
    y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Emergency Contact:', user.emergencyContact || '-');
    fieldBox(doc, 300, y, 245, 22, 'Gender:', user.gender || '-');
    y += 27;

    // ── Employment Details ──
    y = sectionHead(doc, 'EMPLOYMENT DETAILS', y);

    fieldBox(doc, 50, y, 250, 22, 'Department:', user.dept || '-');
    fieldBox(doc, 300, y, 245, 22, 'Designation:', user.designation || '-');
    y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Role:', user.role || '-');
    fieldBox(doc, 300, y, 245, 22, 'Employment Type:', user.employmentType || 'Full-Time');
    y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Date of Joining:', user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString('en-IN') : '-');
    fieldBox(doc, 300, y, 245, 22, 'Status:', user.status || 'Active');
    y += 22;
    fieldBox(doc, 50, y, 250, 22, 'Reporting Manager:', user.reportingManager || '-');
    fieldBox(doc, 300, y, 245, 22, 'Work Location:', user.workLocation || 'Head Office');
    y += 27;

    // ── Skills ──
    if (user.skills && user.skills.length > 0) {
        y = sectionHead(doc, 'SKILLS & EXPERTISE', y);
        const skillText = user.skills.join('  •  ');
        box(doc, 50, y, 495, 28);
        doc.fontSize(9).font('Helvetica').text(skillText, 55, y + 9, { width: 485 });
        y += 33;
    }

    // ── Certifications ──
    if (user.certifications && user.certifications.length > 0) {
        // check if we need a new page
        if (y > 680) { doc.addPage(); y = 50; }
        y = sectionHead(doc, 'CERTIFICATIONS', y);
        const certColX = [50, 230, 390];
        const certColW = [180, 160, 155];
        box(doc, certColX[0], y, certColW[0], 18, { fill: BLUE });
        box(doc, certColX[1], y, certColW[1], 18, { fill: BLUE });
        box(doc, certColX[2], y, certColW[2], 18, { fill: BLUE });
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#fff');
        doc.text('CERTIFICATION', certColX[0]+5, y+4);
        doc.text('ISSUING BODY', certColX[1]+5, y+4);
        doc.text('YEAR', certColX[2]+5, y+4);
        doc.fillColor('#000');
        y += 18;
        user.certifications.forEach(cert => {
            box(doc, certColX[0], y, certColW[0], 18);
            box(doc, certColX[1], y, certColW[1], 18);
            box(doc, certColX[2], y, certColW[2], 18);
            doc.fontSize(8).font('Helvetica');
            doc.text(cert.name || '-', certColX[0]+5, y+4, { width: 170 });
            doc.text(cert.issuer || cert.issuingOrganization || '-', certColX[1]+5, y+4, { width: 150 });
            doc.text(String(cert.year || cert.date || '-'), certColX[2]+5, y+4, { width: 145 });
            y += 18;
        });
        y += 5;
    }

    // ── Education ──
    if (user.education && user.education.length > 0) {
        if (y > 680) { doc.addPage(); y = 50; }
        y = sectionHead(doc, 'EDUCATION', y);
        user.education.forEach(edu => {
            fieldBox(doc, 50, y, 250, 22, edu.degree || 'Degree:', edu.institution || '-');
            fieldBox(doc, 300, y, 245, 22, 'Year:', String(edu.year || '-'));
            y += 22;
        });
        y += 5;
    }

    // ── Languages ──
    if (user.languages && user.languages.length > 0) {
        if (y > 680) { doc.addPage(); y = 50; }
        y = sectionHead(doc, 'LANGUAGES KNOWN', y);
        const langText = user.languages.join('  •  ');
        box(doc, 50, y, 495, 22);
        doc.fontSize(9).font('Helvetica').text(langText, 55, y + 6, { width: 485 });
        y += 27;
    }

    doc.y = y;
    signatureFooter(doc, 'Employee Signature', 'HR Manager / Authorized Signatory');
    autoGenFooter(doc);
    doc.end();
    return doc;
}

module.exports = { generatePayslipPDF, generateGatePassPDF, generateLeavePDF, generateLetterPDF, generateMissSlipPDF, generateTravelPDF, generateCanteenOrderPDF, generateUniformPDF, generateEmployeeProfilePDF };
