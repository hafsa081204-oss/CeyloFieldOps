// ─── Role Types ───────────────────────────────────────────────────────
export type Role = 'admin' | 'worker' | 'hr' | 'client'
export type JobStatus   = 'pending' | 'in-progress' | 'completed' | 'cancelled'
export type JobPriority = 'low' | 'medium' | 'high' | 'critical'

// ─── Role Config Interface ────────────────────────────────────────────
export interface RoleConfig {
  label:    string
  glyph:    string
  description: string
  email:    string
  gradient: string
  glow:     string
  orb:      string
  color:    string
}

// ─── Roles ────────────────────────────────────────────────────────────
export const ROLES: Record<Role, RoleConfig> = {
  admin: {
    label:       'Administrator',
    glyph:       'A',
    description: 'Full system control',
    email:       'admin@ceylofield.lk',
    gradient:    'linear-gradient(135deg, #1a6cf6, #7c3aed)',
    glow:        'rgba(99, 102, 241, 0.5)',
    orb:         'radial-gradient(circle at 30% 40%, #3b82f6 0%, #7c3aed 50%, #1e1b4b 100%)',
    color:       '#6366f1',
  },
  worker: {
    label:       'Field Worker',
    glyph:       'W',
    description: 'View & update jobs',
    email:       'worker@ceylofield.lk',
    gradient:    'linear-gradient(135deg, #059669, #0d9488)',
    glow:        'rgba(16, 185, 129, 0.5)',
    orb:         'radial-gradient(circle at 30% 40%, #10b981 0%, #0d9488 50%, #022c22 100%)',
    color:       '#10b981',
  },
  hr: {
    label:       'HR Manager',
    glyph:       'H',
    description: 'Team management',
    email:       'hr@ceylofield.lk',
    gradient:    'linear-gradient(135deg, #9333ea, #db2777)',
    glow:        'rgba(168, 85, 247, 0.5)',
    orb:         'radial-gradient(circle at 30% 40%, #a855f7 0%, #ec4899 50%, #2d1b69 100%)',
    color:       '#a855f7',
  },
  client: {
    label:       'Client',
    glyph:       'C',
    description: 'Submit service requests',
    email:       'client@ceylofield.lk',
    gradient:    'linear-gradient(135deg, #d97706, #ea580c)',
    glow:        'rgba(245, 158, 11, 0.5)',
    orb:         'radial-gradient(circle at 30% 40%, #f59e0b 0%, #ea580c 50%, #431407 100%)',
    color:       '#f59e0b',
  },
}

// ─── Status & Priority Styles ─────────────────────────────────────────
export const STATUS_STYLE: Record<JobStatus, { bg: string; color: string; label: string }> = {
  'pending':      { bg: 'rgba(245, 158, 11, 0.12)',  color: '#f59e0b', label: 'Pending'     },
  'in-progress':  { bg: 'rgba(59, 130, 246, 0.12)',  color: '#60a5fa', label: 'In Progress' },
  'completed':    { bg: 'rgba(16, 185, 129, 0.12)',  color: '#34d399', label: 'Completed'   },
  'cancelled':    { bg: 'rgba(239, 68, 68, 0.12)',   color: '#f87171', label: 'Cancelled'   },
}

export const PRIORITY_STYLE: Record<JobPriority, { color: string; bg: string }> = {
  'low':      { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.12)' },
  'medium':   { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)'  },
  'high':     { color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)'  },
  'critical': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)'   },
}

// ─── Nav Items ────────────────────────────────────────────────────────
export interface NavItem {
  icon:  string
  label: string
  href:  string
}

export const NAV_ITEMS: NavItem[] = [
  { icon: '◈', label: 'Dashboard',    href: '/dashboard' },
  { icon: '◉', label: 'Jobs',         href: '/jobs'      },
  { icon: '◐', label: 'Workers',      href: '/workers'   },
  { icon: '▣', label: 'HR & Payroll', href: '/hr'        },
  { icon: '◆', label: 'Analytics',    href: '/analytics' },
  { icon: '⬡', label: 'Live Map',     href: '/map'       },
  { icon: '✦', label: 'Invoices',     href: '/invoices'  },
  { icon: '⊕', label: 'Settings',     href: '/settings'  },
]

// ─── Dashboard Stats ──────────────────────────────────────────────────
export interface StatCard {
  label:    string
  value:    string
  change:   string
  up:       boolean
  icon:     string
  gradient: string
}

export const DASHBOARD_STATS: StatCard[] = [
  { label: 'Total Jobs',      value: '248',  change: '+12%', up: true,  icon: '◈', gradient: 'linear-gradient(135deg, #1a6cf6, #7c3aed)' },
  { label: 'Active Workers',  value: '34',   change: '+3',   up: true,  icon: '◉', gradient: 'linear-gradient(135deg, #059669, #0d9488)' },
  { label: 'Completed Today', value: '18',   change: '+5',   up: true,  icon: '✓', gradient: 'linear-gradient(135deg, #9333ea, #db2777)' },
  { label: 'Revenue (Month)', value: '2.4M', change: '+18%', up: true,  icon: '◆', gradient: 'linear-gradient(135deg, #d97706, #ea580c)' },
]

// ─── Job Interfaces ───────────────────────────────────────────────────
export interface Job {
  id:       string
  title:    string
  client:   string
  worker:   string
  location: string
  status:   JobStatus
  priority: JobPriority
  date:     string
  amount:   string
}

export interface JobDetail extends Job {
  description:    string
  category:       string
  estimatedHours: number
  actualHours?:   number
  notes:          string
  createdAt:      string
  updatedAt:      string
}

// ─── Mock Jobs ────────────────────────────────────────────────────────
export const MOCK_JOBS: Job[] = [
  { id: 'JOB-001', title: 'Electrical Panel Repair',  client: 'CEB Kandy',         worker: 'Ashan Perera',     location: 'Kandy, Central',   status: 'in-progress', priority: 'critical', date: '2026-04-20', amount: 'LKR 45,000'  },
  { id: 'JOB-002', title: 'Fiber Optic Installation', client: 'Dialog Axiata',     worker: 'Nuwan Silva',      location: 'Colombo 03',       status: 'completed',   priority: 'high',     date: '2026-04-19', amount: 'LKR 82,000'  },
  { id: 'JOB-003', title: 'HVAC Maintenance',         client: 'Lanka Hospitals',   worker: 'Kasun Fernando',   location: 'Borella, Colombo', status: 'pending',     priority: 'medium',   date: '2026-04-21', amount: 'LKR 28,500'  },
  { id: 'JOB-004', title: 'Network Infrastructure',   client: 'SLIATE HQ',         worker: 'Dinesh Rajapaksa', location: 'Maradana',         status: 'pending',     priority: 'high',     date: '2026-04-22', amount: 'LKR 120,000' },
  { id: 'JOB-005', title: 'Solar Panel Setup',        client: 'Hayleys Group',     worker: 'Tharindu Wijekon', location: 'Ekala, Ja-Ela',    status: 'in-progress', priority: 'medium',   date: '2026-04-20', amount: 'LKR 95,000'  },
  { id: 'JOB-006', title: 'Plumbing Emergency',       client: 'John Keells HQ',    worker: 'Malith Gamage',    location: 'Union Place',      status: 'cancelled',   priority: 'low',      date: '2026-04-18', amount: 'LKR 15,000'  },
  { id: 'JOB-007', title: 'Generator Servicing',      client: 'SLT Telecom',       worker: 'Ruwan Bandara',    location: 'Pita Kotte',       status: 'completed',   priority: 'high',     date: '2026-04-17', amount: 'LKR 67,500'  },
  { id: 'JOB-008', title: 'Fire Alarm Installation',  client: 'Arpico Supercentre',worker: 'Ashan Perera',     location: 'Nugegoda',         status: 'pending',     priority: 'critical', date: '2026-04-23', amount: 'LKR 210,000' },
]

export const MOCK_JOBS_DETAIL: JobDetail[] = [
  {
    id: 'JOB-001', title: 'Electrical Panel Repair',
    client: 'CEB Kandy', worker: 'Ashan Perera',
    location: 'Kandy, Central Province',
    status: 'in-progress', priority: 'critical',
    date: '2026-04-20', amount: 'LKR 45,000',
    description: 'Emergency repair of main distribution panel at CEB Kandy substation. Panel tripped due to overload. Requires full inspection and component replacement.',
    category: 'Electrical', estimatedHours: 6, actualHours: 4,
    notes: 'Worker on-site. Replacement parts sourced from Kandy branch.',
    createdAt: '2026-04-19T08:30:00', updatedAt: '2026-04-20T10:15:00',
  },
  {
    id: 'JOB-002', title: 'Fiber Optic Installation',
    client: 'Dialog Axiata', worker: 'Nuwan Silva',
    location: 'Colombo 03',
    status: 'completed', priority: 'high',
    date: '2026-04-19', amount: 'LKR 82,000',
    description: 'Full fiber optic backbone installation across 3 floors of Dialog HQ. 48-core cable with termination and testing.',
    category: 'Networking', estimatedHours: 12, actualHours: 11,
    notes: 'Completed ahead of schedule. Client signed off on all 48 terminations.',
    createdAt: '2026-04-17T09:00:00', updatedAt: '2026-04-19T17:00:00',
  },
  {
    id: 'JOB-003', title: 'HVAC Maintenance',
    client: 'Lanka Hospitals', worker: 'Kasun Fernando',
    location: 'Borella, Colombo',
    status: 'pending', priority: 'medium',
    date: '2026-04-21', amount: 'LKR 28,500',
    description: 'Quarterly HVAC maintenance for ICU and operating theatre units. Includes filter replacement and refrigerant top-up.',
    category: 'HVAC', estimatedHours: 5,
    notes: 'Scheduled for early morning to avoid disrupting patient care.',
    createdAt: '2026-04-18T14:00:00', updatedAt: '2026-04-18T14:00:00',
  },
  {
    id: 'JOB-004', title: 'Network Infrastructure',
    client: 'SLIATE HQ', worker: 'Dinesh Rajapaksa',
    location: 'Maradana, Colombo',
    status: 'pending', priority: 'high',
    date: '2026-04-22', amount: 'LKR 120,000',
    description: 'Complete network overhaul for SLIATE headquarters. Install 48-port managed switch, patch panel, and structured cabling for 60 workstations.',
    category: 'Networking', estimatedHours: 16,
    notes: 'Equipment delivered. Awaiting IT manager access clearance.',
    createdAt: '2026-04-15T11:00:00', updatedAt: '2026-04-20T09:00:00',
  },
  {
    id: 'JOB-005', title: 'Solar Panel Setup',
    client: 'Hayleys Group', worker: 'Tharindu Wijekon',
    location: 'Ekala, Ja-Ela',
    status: 'in-progress', priority: 'medium',
    date: '2026-04-20', amount: 'LKR 95,000',
    description: '30-panel rooftop solar array installation with 10kW inverter. Grid-tied system with net metering setup.',
    category: 'Solar', estimatedHours: 14, actualHours: 8,
    notes: 'Panel mounting complete. Wiring and inverter installation ongoing.',
    createdAt: '2026-04-18T07:00:00', updatedAt: '2026-04-20T13:00:00',
  },
  {
    id: 'JOB-006', title: 'Plumbing Emergency',
    client: 'John Keells HQ', worker: 'Malith Gamage',
    location: 'Union Place, Colombo',
    status: 'cancelled', priority: 'low',
    date: '2026-04-18', amount: 'LKR 15,000',
    description: 'Burst pipe repair on floor 4. Client resolved internally.',
    category: 'Plumbing', estimatedHours: 3,
    notes: 'Cancelled by client. Internal maintenance team handled.',
    createdAt: '2026-04-18T06:00:00', updatedAt: '2026-04-18T08:30:00',
  },
  {
    id: 'JOB-007', title: 'Generator Servicing',
    client: 'SLT Telecom', worker: 'Ruwan Bandara',
    location: 'Pita Kotte',
    status: 'completed', priority: 'high',
    date: '2026-04-17', amount: 'LKR 67,500',
    description: 'Annual service of 3 backup generators at SLT Pita Kotte exchange. Oil change, filter replacement, load test.',
    category: 'Mechanical', estimatedHours: 8, actualHours: 9,
    notes: 'All 3 generators passed load test. One required additional fuel injector cleaning.',
    createdAt: '2026-04-14T10:00:00', updatedAt: '2026-04-17T18:00:00',
  },
  {
    id: 'JOB-008', title: 'Fire Alarm Installation',
    client: 'Arpico Supercentre', worker: 'Ashan Perera',
    location: 'Nugegoda',
    status: 'pending', priority: 'critical',
    date: '2026-04-23', amount: 'LKR 210,000',
    description: 'Full fire alarm system installation across 4 floors. Includes smoke detectors, heat detectors, manual call points, and central control panel.',
    category: 'Safety Systems', estimatedHours: 20,
    notes: 'Fire safety compliance deadline is April 30. Critical priority.',
    createdAt: '2026-04-16T13:00:00', updatedAt: '2026-04-20T11:00:00',
  },
]

// ─── Mock Workers ─────────────────────────────────────────────────────
export type WorkerStatus = 'active' | 'on-job' | 'off-duty'

export interface Worker {
  id:            string
  name:          string
  role:          string
  status:        WorkerStatus
  completedJobs: number
  rating:        number
  location:      string
}

export const MOCK_WORKERS: Worker[] = [
  { id: 'W-001', name: 'Ashan Perera',     role: 'Electrical Engineer', status: 'on-job',   completedJobs: 142, rating: 4.9, location: 'Kandy'   },
  { id: 'W-002', name: 'Nuwan Silva',      role: 'Fiber Technician',    status: 'active',   completedJobs: 98,  rating: 4.7, location: 'Colombo' },
  { id: 'W-003', name: 'Kasun Fernando',   role: 'HVAC Specialist',     status: 'active',   completedJobs: 76,  rating: 4.8, location: 'Colombo' },
  { id: 'W-004', name: 'Dinesh Rajapaksa', role: 'Network Engineer',    status: 'off-duty', completedJobs: 54,  rating: 4.6, location: 'Colombo' },
  { id: 'W-005', name: 'Tharindu Wijekon', role: 'Solar Technician',    status: 'on-job',   completedJobs: 87,  rating: 4.5, location: 'Ja-Ela'  },
]

// ─── Job Categories ───────────────────────────────────────────────────
export const JOB_CATEGORIES: string[] = [
  'Electrical', 'Networking', 'HVAC', 'Solar',
  'Plumbing', 'Mechanical', 'Safety Systems', 'Civil',
]
// ─── Extended Worker Data ─────────────────────────────────────────────
export type WorkerAvailability = 'available' | 'busy' | 'leave' | 'off-duty'

export interface WorkerDetail extends Worker {
  phone:        string
  email:        string
  nic:          string
  address:      string
  joinedDate:   string
  availability: WorkerAvailability
  skills:       string[]
  certifications: string[]
  totalEarnings: string
  currentJob?:  string
  avatar:       string
}

export const WORKER_AVAILABILITY_STYLE: Record<WorkerAvailability, { bg: string; color: string; label: string }> = {
  'available': { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', label: 'Available' },
  'busy':      { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', label: 'On Job'    },
  'leave':     { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', label: 'On Leave'  },
  'off-duty':  { bg: 'rgba(107,114,128,0.12)', color: '#9ca3af', label: 'Off Duty'  },
}

export const MOCK_WORKERS_DETAIL: WorkerDetail[] = [
  {
    id: 'W-001', name: 'Ashan Perera',
    role: 'Electrical Engineer', status: 'on-job',
    availability: 'busy',
    completedJobs: 142, rating: 4.9,
    location: 'Kandy', totalEarnings: 'LKR 1,840,000',
    phone: '+94 77 123 4567', email: 'ashan.perera@ceylofield.lk',
    nic: '921234567V', address: '45/A Peradeniya Rd, Kandy',
    joinedDate: '2021-03-15',
    currentJob: 'JOB-001',
    avatar: 'AP',
    skills: ['High Voltage Systems','Panel Wiring','Load Balancing','PLC Programming','Solar Integration'],
    certifications: ['NVQ Level 5 Electrical','IEEE Certified','CIDA Registered'],
  },
  {
    id: 'W-002', name: 'Nuwan Silva',
    role: 'Fiber Technician', status: 'active',
    availability: 'available',
    completedJobs: 98, rating: 4.7,
    location: 'Colombo', totalEarnings: 'LKR 980,000',
    phone: '+94 71 234 5678', email: 'nuwan.silva@ceylofield.lk',
    nic: '901234567V', address: '12 Galle Rd, Colombo 03',
    joinedDate: '2022-01-10',
    avatar: 'NS',
    skills: ['FTTH Installation','Fusion Splicing','OTDR Testing','Network Termination','Cable Management'],
    certifications: ['Furukawa Certified Technician','EXFO Certified','CompTIA Network+'],
  },
  {
    id: 'W-003', name: 'Kasun Fernando',
    role: 'HVAC Specialist', status: 'active',
    availability: 'available',
    completedJobs: 76, rating: 4.8,
    location: 'Colombo', totalEarnings: 'LKR 760,000',
    phone: '+94 76 345 6789', email: 'kasun.fernando@ceylofield.lk',
    nic: '881234567V', address: '78 Baseline Rd, Borella',
    joinedDate: '2022-06-01',
    avatar: 'KF',
    skills: ['Chiller Maintenance','VRF Systems','Refrigerant Handling','BMS Integration','Energy Auditing'],
    certifications: ['ASHRAE Certified','EPA 608','Sri Lanka Standards Inst.'],
  },
  {
    id: 'W-004', name: 'Dinesh Rajapaksa',
    role: 'Network Engineer', status: 'off-duty',
    availability: 'off-duty',
    completedJobs: 54, rating: 4.6,
    location: 'Colombo', totalEarnings: 'LKR 648,000',
    phone: '+94 70 456 7890', email: 'dinesh.rajapaksa@ceylofield.lk',
    nic: '951234567V', address: '33 Deans Rd, Maradana',
    joinedDate: '2023-02-20',
    avatar: 'DR',
    skills: ['Cisco Routing','Structured Cabling','Firewall Config','VPN Setup','Server Rack Installation'],
    certifications: ['CCNA','CompTIA A+','Microsoft Certified'],
  },
  {
    id: 'W-005', name: 'Tharindu Wijekon',
    role: 'Solar Technician', status: 'on-job',
    availability: 'busy',
    completedJobs: 87, rating: 4.5,
    location: 'Ja-Ela', totalEarnings: 'LKR 870,000',
    phone: '+94 72 567 8901', email: 'tharindu.wijekon@ceylofield.lk',
    nic: '961234567V', address: '22 Negombo Rd, Ja-Ela',
    joinedDate: '2022-09-05',
    currentJob: 'JOB-005',
    avatar: 'TW',
    skills: ['PV System Design','Grid-Tie Installation','Net Metering','Battery Storage','Inverter Programming'],
    certifications: ['SEIA Certified','NABCEP Associate','IEC 62446'],
  },
  {
    id: 'W-006', name: 'Malith Gamage',
    role: 'Plumbing Specialist', status: 'active',
    availability: 'available',
    completedJobs: 63, rating: 4.4,
    location: 'Colombo', totalEarnings: 'LKR 504,000',
    phone: '+94 75 678 9012', email: 'malith.gamage@ceylofield.lk',
    nic: '871234567V', address: '56 Union Place, Colombo 02',
    joinedDate: '2023-05-12',
    avatar: 'MG',
    skills: ['Pipe Fitting','Drain Systems','Water Pumps','Fire Suppression','Sanitary Installation'],
    certifications: ['NVQ Level 4 Plumbing','CIDA Registered'],
  },
  {
    id: 'W-007', name: 'Ruwan Bandara',
    role: 'Mechanical Engineer', status: 'active',
    availability: 'available',
    completedJobs: 119, rating: 4.8,
    location: 'Gampaha', totalEarnings: 'LKR 1,428,000',
    phone: '+94 78 789 0123', email: 'ruwan.bandara@ceylofield.lk',
    nic: '841234567V', address: '14 Negombo Rd, Gampaha',
    joinedDate: '2020-11-01',
    avatar: 'RB',
    skills: ['Generator Servicing','Diesel Engines','Hydraulic Systems','Preventive Maintenance','Welding'],
    certifications: ['B.Sc Mechanical Eng (USJ)','CIMA Certified','ISO 9001 Auditor'],
  },
]

export const WORKER_STATS = [
  { label: 'Total Workers',    value: '34',   change: '+3 this month', up: true,  gradient: 'linear-gradient(135deg,#1a6cf6,#7c3aed)' },
  { label: 'On Job Now',       value: '12',   change: '35% utilization',up: true, gradient: 'linear-gradient(135deg,#059669,#0d9488)' },
  { label: 'Available',        value: '18',   change: 'Ready to assign',up: true, gradient: 'linear-gradient(135deg,#9333ea,#db2777)' },
  { label: 'Avg. Rating',      value: '4.7★', change: '+0.2 this month',up: true, gradient: 'linear-gradient(135deg,#d97706,#ea580c)' },
]