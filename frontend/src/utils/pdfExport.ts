// PDF Export Utility
// This utility helps generate and download PDFs across the application

export const generatePDF = (content: string, filename: string) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  // Write HTML content with styles
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 20mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          h1 {
            color: #0B4DA2;
            border-bottom: 3px solid #0B4DA2;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          h2 {
            color: #042A5B;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #0B4DA2;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0B4DA2;
          }
          .meta {
            color: #666;
            margin: 10px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .badge-success {
            background-color: #d4edda;
            color: #155724;
          }
          .badge-warning {
            background-color: #fff3cd;
            color: #856404;
          }
          .badge-danger {
            background-color: #f8d7da;
            color: #721c24;
          }
          .badge-info {
            background-color: #d1ecf1;
            color: #0c5460;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SMG Scooters Pvt Ltd</div>
          <div class="meta">Generated on ${new Date().toLocaleString('en-IN')}</div>
        </div>
        ${content}
        <div class="footer">
          <p>This is a computer-generated document from SMG Employee Portal</p>
          <p>© ${new Date().getFullYear()} SMG Scooters Pvt Ltd. All rights reserved.</p>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load, then trigger print dialog
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    // Close window after printing (user can cancel)
    setTimeout(() => {
      printWindow.close();
    }, 100);
  }, 250);
};

// Generate visitor log PDF
export const generateVisitorLogPDF = (visitors: any[]) => {
  const tableRows = visitors.map(visitor => `
    <tr>
      <td>${visitor.name}</td>
      <td>${visitor.company}</td>
      <td>${visitor.phone}</td>
      <td>${visitor.visitDate}</td>
      <td>${visitor.checkIn || '-'}</td>
      <td>${visitor.checkOut || '-'}</td>
      <td><span class="badge badge-${visitor.status === 'checked-in' ? 'success' : visitor.status === 'checked-out' ? 'info' : 'warning'}">${visitor.status}</span></td>
    </tr>
  `).join('');

  const content = `
    <h1>Visitor Log Report</h1>
    <table>
      <thead>
        <tr>
          <th>Visitor Name</th>
          <th>Company</th>
          <th>Phone</th>
          <th>Visit Date</th>
          <th>Check-In</th>
          <th>Check-Out</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <p><strong>Total Visitors:</strong> ${visitors.length}</p>
  `;

  generatePDF(content, 'Visitor_Log_Report.pdf');
};

// Generate attendance report PDF
export const generateAttendanceReportPDF = (records: any[]) => {
  const tableRows = records.map(record => `
    <tr>
      <td>${record.employeeId}</td>
      <td>${record.employeeName}</td>
      <td>${record.date}</td>
      <td>${record.checkIn || '-'}</td>
      <td>${record.checkOut || '-'}</td>
      <td>${record.workHours || '-'}</td>
      <td><span class="badge badge-${record.status === 'present' ? 'success' : record.status === 'absent' ? 'danger' : 'warning'}">${record.status}</span></td>
    </tr>
  `).join('');

  const content = `
    <h1>Attendance Report</h1>
    <table>
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>Name</th>
          <th>Date</th>
          <th>Check-In</th>
          <th>Check-Out</th>
          <th>Work Hours</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <p><strong>Total Records:</strong> ${records.length}</p>
  `;

  generatePDF(content, 'Attendance_Report.pdf');
};

// Generate canteen orders PDF
export const generateCanteenOrdersPDF = (orders: any[]) => {
  const tableRows = orders.map(order => `
    <tr>
      <td>${order.id}</td>
      <td>${order.employeeName}</td>
      <td>${order.items}</td>
      <td>₹${order.amount}</td>
      <td>${order.date}</td>
      <td><span class="badge badge-${order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'info'}">${order.status}</span></td>
    </tr>
  `).join('');

  const content = `
    <h1>Canteen Orders Report</h1>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Employee</th>
          <th>Items</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <p><strong>Total Orders:</strong> ${orders.length}</p>
    <p><strong>Total Revenue:</strong> ₹${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}</p>
  `;

  generatePDF(content, 'Canteen_Orders_Report.pdf');
};

// Generate transport report PDF
export const generateTransportReportPDF = (requests: any[]) => {
  const tableRows = requests.map(req => `
    <tr>
      <td>${req.id}</td>
      <td>${req.employeeName}</td>
      <td>${req.type}</td>
      <td>${req.details?.route || req.details?.vehicleNumber || '-'}</td>
      <td>${req.requestDate}</td>
      <td><span class="badge badge-${req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}">${req.status}</span></td>
    </tr>
  `).join('');

  const content = `
    <h1>Transport Requests Report</h1>
    <table>
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Employee</th>
          <th>Type</th>
          <th>Details</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <p><strong>Total Requests:</strong> ${requests.length}</p>
  `;

  generatePDF(content, 'Transport_Report.pdf');
};

// Generate finance report PDF
export const generateFinanceReportPDF = (requests: any[]) => {
  const tableRows = requests.map(req => `
    <tr>
      <td>${req.id}</td>
      <td>${req.employeeName}</td>
      <td>${req.type}</td>
      <td>₹${req.amount?.toLocaleString('en-IN')}</td>
      <td>${req.requestDate}</td>
      <td><span class="badge badge-${req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}">${req.status}</span></td>
    </tr>
  `).join('');

  const totalAmount = requests.reduce((sum, req) => sum + (req.amount || 0), 0);

  const content = `
    <h1>Finance Requests Report</h1>
    <table>
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Employee</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <p><strong>Total Requests:</strong> ${requests.length}</p>
    <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString('en-IN')}</p>
  `;

  generatePDF(content, 'Finance_Report.pdf');
};

// Generic list export to PDF
export const generateGenericListPDF = (title: string, data: any[], columns: {key: string, label: string}[]) => {
  const tableRows = data.map(item => `
    <tr>
      ${columns.map(col => `<td>${item[col.key] || '-'}</td>`).join('')}
    </tr>
  `).join('');

  const content = `
    <h1>${title}</h1>
    <table>
      <thead>
        <tr>
          ${columns.map(col => `<th>${col.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <p><strong>Total Records:</strong> ${data.length}</p>
  `;

  generatePDF(content, `${title.replace(/\s+/g, '_')}.pdf`);
};
