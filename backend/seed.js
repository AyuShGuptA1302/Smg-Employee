const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');
const LeaveBalance = require('./models/LeaveBalance');
const GatePass = require('./models/GatePass');
const Payroll = require('./models/Payroll');
const Training = require('./models/Training');
const Document = require('./models/Document');
const Project = require('./models/Project');
const Announcement = require('./models/Announcement');
const Notification = require('./models/Notification');
const Department = require('./models/Department');
const { CanteenMenu } = require('./models/Canteen');
const GuestHouse = require('./models/GuestHouse');
const Transport = require('./models/Transport');
const UniformRequest = require('./models/UniformRequest');
const SIMRequest = require('./models/SIMRequest');
const { Asset } = require('./models/Asset');
const Meeting = require('./models/Meeting');
const Policy = require('./models/Policy');
const Idea = require('./models/Idea');
const GeneralRequest = require('./models/GeneralRequest');
const Request = require('./models/Request');
const AttendanceMissSlip = require('./models/AttendanceMissSlip');
const Resignation = require('./models/Resignation');
const TravelRequest = require('./models/TravelRequest');
const MRF = require('./models/MRF');
const Interview = require('./models/Interview');
const JobDescription = require('./models/JobDescription');
const KeyRepresentative = require('./models/KeyRepresentative');
const WelfareProgram = require('./models/WelfareProgram');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee-portal');
    console.log('Connected to MongoDB for seeding...');

    // Clear all collections
    const collections = [User, Attendance, Leave, LeaveBalance, GatePass, Payroll, Training, Document, Project, Announcement, Notification, Department, CanteenMenu, GuestHouse, Transport, UniformRequest, SIMRequest, Asset, Meeting, Policy, Idea, GeneralRequest, Request, AttendanceMissSlip, Resignation, TravelRequest, MRF, Interview, JobDescription, KeyRepresentative, WelfareProgram];
    for (const Model of collections) { await Model.deleteMany({}); }
    console.log('Cleared all collections.');

    // Hash password with bcrypt
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password', 10);

    // ── USERS (Team members from SMG Progress Report) ──
    const users = await User.insertMany([
        { name:"Abhishek Kumar", email:"abhishek@smg.com", password:hashedPassword, role:"admin", empId:"SMG-2024-001", dept:"IT", designation:"Technical Lead", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Abhishek&backgroundColor=b6e3f4", shift:"General (9:00 - 18:00)", reportingTo:"Akriti Bhardwaj", phone:"+91 98765 10001", emergencyContact:"+91 98765 10002", dateOfBirth:"12-Mar-1999", dateOfJoining:"01-Jun-2024", bloodGroup:"B+", address:"Flat 305, Skyline Residency, Sector 75, Noida, UP - 201301", education:[{degree:"B.Tech in Computer Science",institution:"ABES Engineering College",year:"2017-2021",grade:"8.5 CGPA"}], certifications:[{name:"AWS Certified Cloud Practitioner",issuer:"AWS",year:"2023"},{name:"MongoDB Developer Certificate",issuer:"MongoDB Inc",year:"2024"},{name:"React Advanced Patterns",issuer:"Meta",year:"2024"}], skills:["React","Node.js","MongoDB","TypeScript","REST APIs","System Architecture","Team Leadership"], languages:["Hindi (Native)","English (Fluent)"] },
        { name:"Akriti Bhardwaj", email:"akriti@smg.com", password:hashedPassword, role:"superadmin", empId:"SMG-2023-001", dept:"Management", designation:"Team Leader / Project Manager", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Akriti&backgroundColor=ffd5dc", shift:"General (9:00 - 18:00)", reportingTo:"CEO", phone:"+91 98765 20001", dateOfBirth:"15-Jul-1995", dateOfJoining:"01-Apr-2023", bloodGroup:"A+", address:"House 12, Sector 44, Gurugram, Haryana", education:[{degree:"MBA in IT Management",institution:"Amity University",year:"2019-2021",grade:"8.8 CGPA"},{degree:"B.Tech in Information Technology",institution:"JIIT Noida",year:"2013-2017",grade:"8.2 CGPA"}], certifications:[{name:"PMP Certified",issuer:"PMI",year:"2022"},{name:"Scrum Master",issuer:"Scrum Alliance",year:"2023"}], skills:["Project Management","Team Leadership","Requirement Analysis","Agile/Scrum","Stakeholder Communication","Documentation"], languages:["Hindi (Native)","English (Fluent)"] },
        { name:"Randhir Singh", email:"randhir@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2024-002", dept:"IT", designation:"Frontend Developer", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Randhir&backgroundColor=c0aede", shift:"General (9:00 - 18:00)", reportingTo:"Abhishek Kumar", phone:"+91 98765 30001", dateOfBirth:"20-Sep-1998", dateOfJoining:"01-Jun-2024", bloodGroup:"O+", address:"B-14, Arun Vihar, Sector 37, Noida", education:[{degree:"B.Tech in Computer Science",institution:"AKTU University",year:"2018-2022",grade:"7.8 CGPA"}], certifications:[{name:"React Developer Certificate",issuer:"Meta",year:"2024"}], skills:["React.js","TypeScript","Tailwind CSS","shadcn/ui","Component Design","Responsive Design"], languages:["Hindi (Native)","English (Fluent)","Punjabi (Conversational)"] },
        { name:"Aman Kumar Singh", email:"aman@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2024-003", dept:"IT", designation:"Database Engineer", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Aman&backgroundColor=b6e3f4", shift:"General (9:00 - 18:00)", reportingTo:"Abhishek Kumar", phone:"+91 98765 40001", dateOfBirth:"08-Jan-2000", dateOfJoining:"01-Jun-2024", bloodGroup:"AB+", address:"C-22, Vasundhara Enclave, Ghaziabad, UP", education:[{degree:"B.Tech in Computer Science",institution:"Galgotias University",year:"2018-2022",grade:"8.0 CGPA"}], certifications:[{name:"MongoDB Certified DBA",issuer:"MongoDB Inc",year:"2024"},{name:"SQL Server Fundamentals",issuer:"Microsoft",year:"2023"}], skills:["MongoDB","Mongoose ODM","Database Design","Data Modelling","Index Optimization","Aggregation Pipelines"], languages:["Hindi (Native)","English (Fluent)"] },
        { name:"Indra Sai", email:"indra@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2024-004", dept:"Quality", designation:"QA & Test Engineer", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Indra&backgroundColor=ffd5dc", shift:"General (9:00 - 18:00)", reportingTo:"Akriti Bhardwaj", phone:"+91 98765 50001", dateOfBirth:"25-May-1999", dateOfJoining:"01-Jun-2024", bloodGroup:"O-", address:"D-5, Sector 62, Noida, UP", education:[{degree:"B.Tech in Electronics & Communication",institution:"SRM University",year:"2017-2021",grade:"8.3 CGPA"}], certifications:[{name:"ISTQB Foundation",issuer:"ISTQB",year:"2023"},{name:"Postman API Testing",issuer:"Postman",year:"2024"}], skills:["API Testing","Postman","Integration Testing","Bug Tracking","Test Case Design","Quality Assurance"], languages:["Hindi","English (Fluent)","Telugu (Native)"] },
        { name:"Ayush Gupta", email:"ayush@smg.com", password:hashedPassword, role:"employee", empId:"SMG-2024-005", dept:"IT", designation:"DevOps & QA Support", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Ayush&backgroundColor=c0aede", shift:"General (9:00 - 18:00)", reportingTo:"Abhishek Kumar", phone:"+91 98765 60001", dateOfBirth:"14-Nov-1999", dateOfJoining:"01-Jun-2024", bloodGroup:"B-", address:"E-Block, Indirapuram, Ghaziabad, UP", education:[{degree:"B.Tech in Computer Science",institution:"Bennett University",year:"2018-2022",grade:"8.1 CGPA"}], certifications:[{name:"AWS Solutions Architect Associate",issuer:"AWS",year:"2024"},{name:"Docker Certified Associate",issuer:"Docker",year:"2023"}], skills:["Git","GitHub Actions","CI/CD","Docker","Linux","Cloud Deployment","Shell Scripting"], languages:["Hindi (Native)","English (Fluent)"] },
        { name:"Department Portal", email:"dept@smg.com", password:hashedPassword, role:"department", empId:"SMG-2024-999", dept:"Management", designation:"Department Portal Access", avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Department&backgroundColor=c0aede", shift:"General (9:00 - 18:00)", dateOfJoining:"01-Jun-2024" }
    ]);
    console.log(`Seeded ${users.length} users.`);
    const abhishek = users[0], akriti = users[1], randhir = users[2], aman = users[3], indra = users[4], ayush = users[5], deptUser = users[6];

    // ── DEPARTMENTS ──
    await Department.insertMany([
        { name:"Assembly", code:"ASSY", head:akriti._id, description:"Vehicle assembly and integration", employeeCount:45, location:"Plant A - Building 1", budget:5000000 },
        { name:"Human Resources", code:"HR", head:randhir._id, description:"People operations and talent management", employeeCount:12, location:"Corporate Office - Floor 2", budget:2000000 },
        { name:"Information Technology", code:"IT", head:abhishek._id, description:"IT infrastructure and digital solutions", employeeCount:18, location:"Corporate Office - Floor 3", budget:4000000 },
        { name:"Quality Control", code:"QC", head:indra._id, description:"Quality assurance and product testing", employeeCount:20, location:"Plant A - Building 2", budget:3000000 },
        { name:"Production", code:"PROD", description:"Manufacturing and production operations", employeeCount:60, location:"Plant A - Main Hall", budget:8000000 },
        { name:"Management", code:"MGMT", head:akriti._id, description:"Senior leadership and strategic planning", employeeCount:5, location:"Corporate Office - Floor 5", budget:1000000 },
        { name:"Training", code:"TRN", description:"Learning and development programs", employeeCount:8, location:"Training Center", budget:1500000 },
        { name:"Finance", code:"FIN", description:"Financial planning and accounting", employeeCount:10, location:"Corporate Office - Floor 1", budget:1200000 }
    ]);
    console.log('Seeded departments.');

    // ── ATTENDANCE (last 10 days for abhishek) ──
    const today = new Date();
    const attData = [];
    for (let i = 0; i < 10; i++) {
        const d = new Date(today); d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('en-US',{weekday:'long'});
        if (dayName === 'Sunday' || dayName === 'Saturday') {
            attData.push({ user:abhishek._id, date:d, day:dayName, checkIn:'-', checkOut:'-', duration:'-', status:'Weekend', isLeave:false, segments:[] });
        } else if (i === 3) {
            attData.push({ user:abhishek._id, date:d, day:dayName, checkIn:'-', checkOut:'-', duration:'-', status:'Leave', isLeave:true, segments:[] });
        } else {
            const late = i === 5;
            const segs = late
                ? [{type:'late',width:'5%',color:'bg-[#EE5D50]'},{type:'work',width:'40%',color:'bg-[#0B4DA2]'},{type:'break',width:'10%',color:'bg-[#05CD99]'},{type:'work',width:'45%',color:'bg-[#0B4DA2]'}]
                : [{type:'work',width:'40%',color:'bg-[#0B4DA2]'},{type:'break',width:'10%',color:'bg-[#05CD99]'},{type:'work',width:'30%',color:'bg-[#0B4DA2]'},{type:'overtime',width:'20%',color:'bg-[#FFB547]'}];
            attData.push({ user:abhishek._id, date:d, day: i===0?'Today':dayName, checkIn:late?'09:15 AM':'08:55 AM', checkOut:'06:12 PM', duration:late?'8h 57m':'9h 17m', status:late?'Late':'Present', isLeave:false, segments:segs, overtimeHours:late?0:1.28, lateMinutes:late?15:0 });
        }
    }
    await Attendance.insertMany(attData);
    console.log('Seeded attendance.');

    // ── LEAVE BALANCE ──
    await LeaveBalance.insertMany([
        { user:abhishek._id, year:2024, annualTotal:20, annualUsed:8, sickTotal:10, sickUsed:2, casualTotal:8, casualUsed:3 },
        { user:akriti._id, year:2024, annualTotal:20, annualUsed:5, sickTotal:10, sickUsed:1, casualTotal:8, casualUsed:2 },
        { user:randhir._id, year:2024, annualTotal:20, annualUsed:6, sickTotal:10, sickUsed:3, casualTotal:8, casualUsed:1 }
    ]);

    // ── LEAVES ──
    await Leave.insertMany([
        { user:abhishek._id, type:'Annual Leave', from:new Date('2024-12-20'), to:new Date('2024-12-24'), days:5, reason:'Diwali Vacation', status:'Approved', approver:'akriti Sharma' },
        { user:abhishek._id, type:'Sick Leave', from:new Date('2024-11-15'), to:new Date('2024-11-15'), days:1, reason:'Fever', status:'Approved', approver:'akriti Sharma' },
        { user:abhishek._id, type:'Casual Leave', from:new Date('2024-12-30'), to:new Date('2024-12-31'), days:2, reason:'Personal Work', status:'Pending', approver:'akriti Sharma' },
        { user:abhishek._id, type:'Annual Leave', from:new Date('2024-10-10'), to:new Date('2024-10-12'), days:3, reason:'Family Function', status:'Rejected', approver:'akriti Sharma' },
        { user:akriti._id, type:'Annual Leave', from:new Date('2024-12-25'), to:new Date('2024-12-27'), days:3, reason:'Christmas Break', status:'Approved', approver:'akriti Singh' }
    ]);
    console.log('Seeded leaves.');

    // ── GATE PASSES ──
    await GatePass.insertMany([
        { user:abhishek._id, passId:'GP-2024-001', type:'Personal', outTime:'11:00 AM', inTime:'01:00 PM', date:new Date('2024-12-10'), reason:'Bank work', status:'Completed', approver:'akriti Sharma' },
        { user:abhishek._id, passId:'GP-2024-002', type:'Medical', outTime:'03:00 PM', inTime:'05:30 PM', date:new Date('2024-12-08'), reason:'Doctor appointment', status:'Completed', approver:'akriti Sharma' },
        { user:abhishek._id, passId:'GP-2024-003', type:'Official', outTime:'10:00 AM', date:new Date('2024-12-12'), reason:'Client meeting at Manesar plant', status:'Approved', approver:'akriti Sharma' }
    ]);

    // ── PAYROLL (last 6 months for abhishek) ──
    const months = ['July 2024','August 2024','September 2024','October 2024','November 2024','December 2024'];
    const payrolls = months.map(m => ({ user:abhishek._id, month:m, year:2024, basicSalary:45000, hra:22500, allowances:12000, specialAllowance:5000, conveyance:3000, medicalAllowance:2500, pf:5400, tax:3500, professionalTax:200, otherDeductions:900, grossSalary:90000, totalDeductions:10000, netSalary:80000, status:'Paid', paidOn:new Date() }));
    await Payroll.insertMany(payrolls);
    console.log('Seeded payroll.');

    // ── TRAININGS ──
    const trainings = await Training.insertMany([
        { title:'React Advanced Patterns', description:'Deep dive into React hooks, context, and performance optimization', date:new Date('2024-12-18'), duration:'4 hours', instructor:'akriti Singh', type:'Required', category:'Technical', department:'All', enrolledUsers:[abhishek._id,aman._id], status:'Upcoming' },
        { title:'AWS Cloud Fundamentals', description:'Introduction to AWS services and cloud architecture', date:new Date('2024-12-25'), duration:'8 hours', instructor:'aman Reddy', type:'Optional', category:'Technical', department:'IT', status:'Upcoming' },
        { title:'Agile & Scrum Workshop', description:'Practical agile methodologies for manufacturing teams', date:new Date('2025-01-05'), duration:'6 hours', instructor:'indra Mehta', type:'Required', category:'Management', department:'All', enrolledUsers:[abhishek._id,akriti._id,indra._id], status:'Upcoming' },
        { title:'Six Sigma Green Belt Training', description:'Comprehensive six sigma methodology', date:new Date('2024-08-15'), duration:'40 hours', instructor:'External', type:'Required', category:'Quality', completedUsers:[abhishek._id,indra._id], status:'Completed' },
        { title:'Industrial Safety Certification', description:'Workplace safety standards and practices', date:new Date('2024-06-20'), duration:'16 hours', instructor:'Safety Officer', type:'Required', category:'Safety', completedUsers:[abhishek._id,akriti._id], status:'Completed' }
    ]);
    console.log('Seeded trainings.');

    // ── DOCUMENTS ──
    await Document.insertMany([
        { user:abhishek._id, title:'Offer Letter', category:'Onboarding', fileType:'PDF', fileSize:'245 KB', uploadedAt:new Date('2020-01-10') },
        { user:abhishek._id, title:'ID Proof - Aadhaar', category:'Identity', fileType:'PDF', fileSize:'180 KB', uploadedAt:new Date('2020-01-12') },
        { user:abhishek._id, title:'PAN Card', category:'Tax Documents', fileType:'PDF', fileSize:'120 KB', uploadedAt:new Date('2020-01-12') },
        { user:abhishek._id, title:'Experience Certificate', category:'Certificates', fileType:'PDF', fileSize:'156 KB', uploadedAt:new Date('2021-02-20') },
        { user:abhishek._id, title:'Payslip - October 2024', category:'Payroll', fileType:'PDF', fileSize:'98 KB', uploadedAt:new Date('2024-11-01') },
        { user:abhishek._id, title:'Tax Declaration Form', category:'Tax Documents', fileType:'PDF', fileSize:'210 KB', uploadedAt:new Date('2024-04-05') },
        { user:abhishek._id, title:'Six Sigma Certificate', category:'Certificates', fileType:'PDF', fileSize:'320 KB', uploadedAt:new Date('2021-09-01') }
    ]);
    console.log('Seeded documents.');

    // ── PROJECTS ──
    await Project.insertMany([
        { name:'EV Scooter Gen-3 Assembly Line', description:'Setup new assembly line for Gen-3 electric scooter', department:'Assembly', status:'In Progress', priority:'Critical', startDate:new Date('2024-10-01'), endDate:new Date('2025-03-31'), progress:42, manager:akriti._id, teamMembers:[abhishek._id,indra._id], budget:15000000, tags:['Manufacturing','EV','Critical'] },
        { name:'Employee Portal Development', description:'Build cloud-based employee management portal', department:'IT', status:'In Progress', priority:'High', startDate:new Date('2024-09-15'), endDate:new Date('2025-01-31'), progress:75, manager:aman._id, teamMembers:[abhishek._id,aman._id], budget:2000000, tags:['Software','Internal','Cloud'] },
        { name:'Quality Audit - Q4 2024', description:'Quarterly quality audit for all production lines', department:'Quality', status:'Completed', priority:'High', startDate:new Date('2024-10-01'), endDate:new Date('2024-12-15'), progress:100, manager:indra._id, budget:500000, tags:['Quality','Audit'] },
        { name:'Safety Training Program 2025', description:'Annual safety training rollout', department:'Training', status:'Planning', priority:'Medium', startDate:new Date('2025-01-15'), endDate:new Date('2025-06-30'), progress:10, budget:800000, tags:['Safety','Training'] }
    ]);
    console.log('Seeded projects.');

    // ── ANNOUNCEMENTS ──
    await Announcement.insertMany([
        { title:'Holiday Announcement - Diwali 2024', content:'Office will remain closed from Dec 20 to Dec 24 for Diwali celebrations. Wishing everyone a Happy Diwali!', priority:'High', department:'All', postedBy:akriti._id },
        { title:'New Cafeteria Menu Launch', content:'We are excited to announce a revamped cafeteria menu with healthier options starting next week.', priority:'Medium', department:'All', postedBy:randhir._id },
        { title:'Safety Drill - December', content:'Mandatory fire and earthquake safety drill scheduled for Dec 15. All employees must participate.', priority:'High', department:'All', postedBy:akriti._id },
        { title:'Year-End Performance Reviews', content:'Performance review cycle begins Jan 5, 2025. Please complete your self-assessments by Dec 31.', priority:'High', department:'All', postedBy:randhir._id },
        { title:'Parking Lot Expansion', content:'New parking area near Building 2 will be operational from Jan 1, 2025.', priority:'Low', department:'All', postedBy:randhir._id }
    ]);
    console.log('Seeded announcements.');

    // ── NOTIFICATIONS ──
    await Notification.insertMany([
        { user:abhishek._id, title:'Leave Approved', message:'Your leave request for Dec 20-24 has been approved by akriti Sharma', type:'success', category:'Leave' },
        { user:abhishek._id, title:'New Training Assigned', message:'React Advanced Patterns training assigned for Dec 18', type:'info', category:'Training' },
        { user:abhishek._id, title:'Payslip Available', message:'October 2024 payslip is ready for download', type:'info', category:'Payroll' },
        { user:abhishek._id, title:'Document Expiring', message:'Your ID proof document needs to be updated', type:'warning', category:'Other' },
        { user:abhishek._id, title:'Project Update', message:'EV Scooter Gen-3 milestone completed - Phase 2 begins', type:'success', category:'Other' },
        { user:abhishek._id, title:'Safety Drill Reminder', message:'Mandatory safety drill on Dec 15 at 3 PM', type:'warning', category:'Announcement' }
    ]);
    console.log('Seeded notifications.');

    // ── REQUESTS ──
    await Request.insertMany([
        { user:abhishek._id, reqId:'REQ001', type:'Leave Application', description:'Annual Leave - Diwali Vacation', status:'Approved', approver:'akriti Sharma' },
        { user:abhishek._id, reqId:'REQ002', type:'Reimbursement', description:'Travel Expense - Client Visit Mumbai', status:'Pending', approver:'randhir Patel' },
        { user:abhishek._id, reqId:'REQ003', type:'Asset Request', description:'New Laptop - MacBook Pro', status:'In Progress', approver:'IT Admin' },
        { user:abhishek._id, reqId:'REQ004', type:'Certificate Request', description:'Experience Certificate', status:'Approved', approver:'HR Team' },
        { user:akriti._id, reqId:'REQ005', type:'Leave Application', description:'Christmas Break', status:'Approved', approver:'akriti Singh' }
    ]);

    // ── CANTEEN MENU ──
    await CanteenMenu.insertMany([
        { name:'Masala Dosa', category:'Breakfast', price:40, description:'Crispy dosa with potato filling', isVeg:true, day:'All' },
        { name:'Poha', category:'Breakfast', price:30, description:'Flattened rice with vegetables', isVeg:true, day:'All' },
        { name:'Paneer Butter Masala', category:'Lunch', price:80, description:'Rich paneer curry', isVeg:true, day:'All' },
        { name:'Chicken Biryani', category:'Lunch', price:120, description:'Hyderabadi style biryani', isVeg:false, day:'Thursday' },
        { name:'Dal Makhani Thali', category:'Lunch', price:90, description:'Complete thali with dal, rice, roti, salad', isVeg:true, day:'All' },
        { name:'Samosa', category:'Snacks', price:15, description:'Crispy potato samosa', isVeg:true, day:'All' },
        { name:'Tea', category:'Beverages', price:10, description:'Masala chai', isVeg:true, day:'All' },
        { name:'Coffee', category:'Beverages', price:20, description:'Filter coffee', isVeg:true, day:'All' }
    ]);
    console.log('Seeded canteen menu.');

    // ── ASSETS ──
    await Asset.insertMany([
        { user:abhishek._id, assetId:'AST-001', name:'Dell Latitude 5520', type:'Laptop', brand:'Dell', serialNumber:'DL5520-2024-001', condition:'Good', assignedDate:new Date('2020-01-15'), status:'Assigned' },
        { user:abhishek._id, assetId:'AST-002', name:'iPhone 13 Pro', type:'Mobile', brand:'Apple', serialNumber:'IP13P-2024-042', condition:'Excellent', assignedDate:new Date('2023-06-01'), status:'Assigned' },
        { user:abhishek._id, assetId:'AST-003', name:'Dell Monitor 24"', type:'Monitor', brand:'Dell', serialNumber:'DLM24-2024-015', condition:'Good', assignedDate:new Date('2020-01-15'), status:'Assigned' },
        { user:abhishek._id, assetId:'AST-004', name:'Logitech MX Keys', type:'Keyboard', brand:'Logitech', serialNumber:'LMK-2024-030', condition:'Fair', assignedDate:new Date('2022-03-10'), status:'Assigned' }
    ]);

    // ── MEETINGS ──
    await Meeting.insertMany([
        { title:'Team Standup', date:today, time:'10:00 AM', duration:'30 min', type:'Conference Room', location:'Conference Room A', organizer:akriti._id, participants:[abhishek._id,indra._id], agenda:'Daily progress update', status:'Scheduled' },
        { title:'Project Review', date:today, time:'02:00 PM', duration:'1 hour', type:'Online', link:'meet.google.com/abc-defg-hij', organizer:aman._id, participants:[abhishek._id,aman._id], agenda:'Sprint review and demo', status:'Scheduled' },
        { title:'Safety Training', date:today, time:'04:00 PM', duration:'45 min', type:'Training Hall', location:'Training Hall B', organizer:akriti._id, participants:[abhishek._id,akriti._id,indra._id], agenda:'Monthly safety briefing', status:'Scheduled' }
    ]);

    // ── POLICIES ──
    await Policy.insertMany([
        { title:'Code of Conduct', category:'Code of Conduct', content:'All employees are expected to maintain professional behavior...', version:'2.1', effectiveDate:new Date('2024-01-01') },
        { title:'Leave Policy', category:'Leave Policy', content:'Annual leave: 20 days, Sick leave: 10 days, Casual leave: 8 days...', version:'3.0', effectiveDate:new Date('2024-04-01') },
        { title:'IT Security Policy', category:'IT Security', content:'All company data must be handled securely. Use VPN for remote access...', version:'1.5', effectiveDate:new Date('2024-06-01') },
        { title:'HR Policies', category:'HR Policies', content:'Recruitment, onboarding, performance management guidelines...', version:'2.0', effectiveDate:new Date('2024-01-01') }
    ]);

    // ── IDEAS ──
    await Idea.insertMany([
        { user:abhishek._id, title:'Solar Panel on Factory Roof', description:'Install solar panels to reduce electricity costs by 30%', category:'Cost Saving', status:'Under Review', votes:15 },
        { user:indra._id, title:'Automated QC Station', description:'Use AI vision for automated quality checks on assembly line', category:'Process', status:'Approved', votes:22 }
    ]);

    // ── GENERAL REQUESTS ──
    await GeneralRequest.insertMany([
        { user:abhishek._id, reqId:'GR-001', category:'IT Support', subject:'VPN Access Issue', description:'Unable to connect to company VPN from home', status:'Resolved', assignedTo:'aman Patel', priority:'High' },
        { user:abhishek._id, reqId:'GR-002', category:'Facilities', subject:'AC Not Working', description:'Air conditioning unit in Bay 3 not functioning', status:'In Progress', assignedTo:'Facilities Team', priority:'Medium' }
    ]);

    // ── ATTENDANCE MISS SLIPS ──
    await AttendanceMissSlip.insertMany([
        { user:abhishek._id, slipId:'AMS-2024-001', date:new Date('2024-12-05'), missType:'Check-Out Missing', actualCheckIn:'08:55 AM', actualCheckOut:'06:10 PM', reason:'Forgot to punch out - was on urgent call', status:'Approved', approver:'akriti Sharma' },
        { user:abhishek._id, slipId:'AMS-2024-002', date:new Date('2024-11-20'), missType:'Check-In Missing', actualCheckIn:'09:00 AM', actualCheckOut:'05:45 PM', reason:'Biometric machine was not working', status:'Approved', approver:'akriti Sharma' }
    ]);

    // ── TRAVEL REQUESTS ──
    await TravelRequest.insertMany([
        { user:abhishek._id, requestId:'TR-2024-001', travelType:'Domestic', purpose:'Client visit for EV Scooter demo', fromCity:'Gurugram', toCity:'Mumbai', departureDate:new Date('2024-11-25'), returnDate:new Date('2024-11-27'), travelMode:'Flight', accommodation:true, estimatedCost:25000, status:'Completed', approver:'akriti Sharma', expenses:[{category:'Travel',description:'Flight tickets',amount:12000,receiptAttached:true},{category:'Hotel',description:'2 nights at Hyatt',amount:8000,receiptAttached:true},{category:'Food',description:'Meals during trip',amount:3000,receiptAttached:false}], totalExpense:23000, reimbursedAmount:23000 },
        { user:abhishek._id, requestId:'TR-2024-002', travelType:'Local', purpose:'Vendor meeting at Manesar', fromCity:'Gurugram', toCity:'Manesar', departureDate:new Date('2024-12-15'), returnDate:new Date('2024-12-15'), travelMode:'Car', accommodation:false, estimatedCost:2000, status:'Pending', approver:'akriti Sharma' }
    ]);

    // ── MRF ──
    const mrfs = await MRF.insertMany([
        { mrfId:'MRF-2024-001', requestedBy:akriti._id, department:'Assembly', jobTitle:'Assembly Technician', numberOfPositions:3, employmentType:'Full-Time', experience:'2-4 years', qualification:'ITI/Diploma in Mechanical', skills:['Assembly','Welding','Quality Check'], budgetRange:{min:25000,max:35000}, justification:'Expansion of Gen-3 production line', expectedJoiningDate:new Date('2025-02-01'), priority:'High', status:'In Recruitment', approver:'akriti Singh' },
        { mrfId:'MRF-2024-002', requestedBy:aman._id, department:'IT', jobTitle:'Full Stack Developer', numberOfPositions:1, employmentType:'Full-Time', experience:'3-5 years', qualification:'B.Tech in CS/IT', skills:['React','Node.js','MongoDB'], budgetRange:{min:60000,max:90000}, justification:'Portal development team expansion', expectedJoiningDate:new Date('2025-01-15'), priority:'Medium', status:'Pending Approval', approver:'akriti Singh' }
    ]);

    // ── INTERVIEWS ──
    await Interview.insertMany([
        { interviewId:'INT-2024-001', candidateName:'Rahul Verma', position:'Assembly Technician', department:'Assembly', interviewDate:new Date('2024-12-18'), interviewers:['akriti Sharma','indra Mehta'], rounds:[{roundName:'Technical',score:7,remarks:'Good practical skills',result:'Pass'},{roundName:'HR',score:8,remarks:'Good communication',result:'Pass'}], overallScore:7.5, recommendation:'Recommend', status:'Completed', mrf:mrfs[0]._id },
        { interviewId:'INT-2024-002', candidateName:'Kavya Iyer', position:'Full Stack Developer', department:'IT', interviewDate:new Date('2024-12-20'), interviewers:['aman Patel'], rounds:[{roundName:'Coding Test',score:9,remarks:'Excellent problem solving',result:'Pass'}], overallScore:9, recommendation:'Strongly Recommend', status:'Scheduled', mrf:mrfs[1]._id }
    ]);

    // ── JOB DESCRIPTIONS ──
    await JobDescription.insertMany([
        { jdId:'JD-2024-001', title:'Assembly Technician', department:'Assembly', reportingTo:'Assembly Manager', location:'Plant A', employmentType:'Full-Time', summary:'Responsible for assembling EV scooter components', responsibilities:['Assemble mechanical and electrical components','Perform quality checks','Follow safety protocols','Report defects'], qualifications:['ITI/Diploma in Mechanical Engineering'], experience:'2-4 years in manufacturing', skillsRequired:['Assembly','Welding','Blueprint Reading'], salaryRange:{min:25000,max:35000}, createdBy:akriti._id },
        { jdId:'JD-2024-002', title:'Full Stack Developer', department:'IT', reportingTo:'IT Lead', location:'Corporate Office', employmentType:'Full-Time', summary:'Develop and maintain internal web applications', responsibilities:['Build React frontends','Develop Node.js APIs','Manage MongoDB databases','Deploy to cloud'], qualifications:['B.Tech/MCA in Computer Science'], experience:'3-5 years', skillsRequired:['React','Node.js','MongoDB','AWS'], salaryRange:{min:60000,max:90000}, createdBy:aman._id }
    ]);

    // ── KEY REPRESENTATIVES ──
    await KeyRepresentative.insertMany([
        { user:randhir._id, department:'HR', role:'HR Manager', responsibilities:['Employee grievances','Recruitment','Policy implementation'], contactNumber:'+91 98765 22222', email:'hr@smg.com', location:'Corporate Office - Floor 2' },
        { user:aman._id, department:'IT', role:'IT Support Lead', responsibilities:['IT infrastructure','Network security','Software support'], contactNumber:'+91 98765 33333', email:'it@smg.com', location:'Corporate Office - Floor 3' },
        { user:akriti._id, department:'Management', role:'VP Operations - Safety Officer', responsibilities:['Workplace safety','Emergency response','Safety audits'], contactNumber:'+91 98765 44444', email:'superadmin@smg.com', location:'Corporate Office - Floor 5' }
    ]);

    // ── WELFARE PROGRAMS ──
    await WelfareProgram.insertMany([
        { title:'Group Health Insurance', category:'Health Insurance', description:'Comprehensive health insurance covering employee, spouse, and 2 children up to ₹5 Lakhs', eligibility:'All confirmed employees', benefits:['Cashless hospitalization','Pre & post hospitalization cover','Maternity benefits','Annual health checkup'], enrolledUsers:[abhishek._id,akriti._id,randhir._id,aman._id], contactPerson:'randhir Kumar', contactEmail:'hr@smg.com' },
        { title:'Wellness Wednesday', category:'Wellness Programs', description:'Weekly wellness sessions including yoga, meditation, and fitness workshops every Wednesday', eligibility:'All employees', benefits:['Free yoga sessions','Mental health counseling','Fitness gym access','Nutrition guidance'], contactPerson:'aman Reddy', contactEmail:'training@smg.com' },
        { title:'Emergency Financial Assistance', category:'Emergency Support', description:'Interest-free emergency loan up to 2 months salary for medical or family emergencies', eligibility:'Employees with 1+ year tenure', benefits:['Interest-free loan','Quick disbursement within 48 hours','Flexible repayment over 12 months'], contactPerson:'randhir Kumar', contactEmail:'hr@smg.com' }
    ]);

    console.log('Seeded all new collections (miss slips, travel, MRF, interviews, JDs, key reps, welfare).');

    console.log('\n✅ Database seeded successfully with comprehensive data!');
    console.log('Login credentials (all passwords: password):');
    console.log('  Technical Lead (Admin) → abhishek@smg.com');
    console.log('  SuperAdmin             → akriti@smg.com');
    console.log('  Frontend Dev           → randhir@smg.com');
    console.log('  Database Engineer      → aman@smg.com');
    console.log('  QA Engineer            → indra@smg.com');
    console.log('  DevOps Support         → ayush@smg.com');
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
