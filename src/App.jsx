import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import Tesseract from 'tesseract.js';
import { QRCodeSVG } from 'qrcode.react';

// Supabase Initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/* ============================================================
   INLINE SVG ICONS
   ============================================================ */
const Icons = {
  Search: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Folder: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/></svg>
  ),
  Camera: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
  ),
  Home: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  ChevronLeft: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2.5} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  X: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  Check: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  ),
  Plus: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Trash: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
  ),
  Image: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ),
  Tag: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l7.29-7.29a1 1 0 0 0 0-1.42z"/><path d="M7 7h.01"/></svg>
  ),
  // Category icons
  Wifi: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
  ),
  Monitor: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  ),
  Server: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
  ),
  Shield: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Users: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Mail: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Globe: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  Cloud: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
  ),
  Printer: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
  ),
  User: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Settings: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Moon: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  ),
  Sun: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  ),
  Edit: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Trash: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
  ),
  Grid: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
  Copy: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  ),
  Scan: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>
  ),
  Cpu: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
  ),
  Database: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
  ),
  Key: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/><path d="m14 11 2 2"/></svg>
  ),
  Zap: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  Smartphone: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
  ),
  Lock: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Code: (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.sw||2} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ),
};

const Icon = ({ name, size = 24, sw }) => {
  const Comp = Icons[name];
  return Comp ? <Comp size={size} sw={sw} /> : null;
};

/* ============================================================
   DATA MODEL
   ============================================================ */
// Categories from DB will replace this constant in logic, but keeping as fallback for iconography
const CATEGORY_MAP = {
  networking: { label: 'Networking', icon: 'Wifi', color: '#00d2ff' },
  os: { label: 'Operating Systems', icon: 'Monitor', color: '#4ade80' },
  hardware: { label: 'Hardware', icon: 'Server', color: '#fb923c' },
  security: { label: 'Security', icon: 'Shield', color: '#f87171' },
  activedirectory: { label: 'Active Directory', icon: 'Users', color: '#c084fc' },
  email: { label: 'Email & SMTP', icon: 'Mail', color: '#fbbf24' },
  web: { label: 'Web Services', icon: 'Globe', color: '#38bdf8' },
  cloud: { label: 'Cloud & SaaS', icon: 'Cloud', color: '#2dd4bf' },
  printing: { label: 'Printing', icon: 'Printer', color: '#fb7185' },
  software: { label: 'Software', icon: 'Code', color: '#10b981' },
  vpn: { label: 'VPN', icon: 'Shield', color: '#ef4444' },
  mobile: { label: 'Mobile', icon: 'Smartphone', color: '#ec4899' },
};

const getCategoryIcon = (cat, overrides) => {
  if (overrides && cat && overrides[cat.id]) return overrides[cat.id];
  if (cat?.icon) return cat.icon;
  return CATEGORY_MAP[cat?.name?.toLowerCase()]?.icon || 'Folder';
};

const INITIAL_FIXES = [
  {
    id: 1,
    title: 'VPN Connection Drop',
    tags: ['Networking', 'Windows'],
    category: 'networking',
    summary: 'Users report intermittent VPN disconnects. Flush DNS, check MTU settings, and verify gateway configuration to stabilize the tunnel.',
    steps: [
      'Open Command Prompt as Administrator',
      'Run `ipconfig /flushdns` to clear cached DNS records',
      'Run `netsh interface ipv4 show subinterfaces` — check MTU values',
      'If MTU is >1400, lower it: `netsh interface ipv4 set subinterface "VPN" mtu=1400 store=persistent`',
      'Verify VPN gateway address and pre-shared key in client settings',
      'Restart VPN service: `net stop "VPN Service" && net start "VPN Service"`',
      'Test stability with `ping -t <gateway_ip>` for 5 minutes',
    ],
    updatedAgo: '3 hours ago',
  },
  {
    id: 2,
    title: 'AD User Account Lockout',
    tags: ['Active Directory', 'Security'],
    category: 'activedirectory',
    summary: 'User locked out of Active Directory. Examine event logs, check bad password count, and confirm Group Policy settings.',
    steps: [
      'Open Active Directory Users and Computers (ADUC)',
      'Locate user → Properties → Account tab',
      'Check if "Account is locked out" checkbox is set',
      'On the DC, open Event Viewer → Security → Filter for Event ID `4740`',
      'Identify the source machine name from the lockout event details',
      'Run `net user <username> /domain` — review Bad Password Count',
      'Review Group Policy: Account Lockout Threshold & Duration',
      'Clear cached credentials on the source machine and reboot',
    ],
    updatedAgo: '5 hours ago',
  },
  {
    id: 3,
    title: 'Outlook Error 0x8004210B',
    tags: ['Email', 'SMTP', 'Windows'],
    category: 'email',
    summary: 'Outlook fails to send email with timeout error 0x8004210B. Verify SMTP settings, repair PST, and check firewall rules.',
    steps: [
      'Open Outlook → File → Account Settings → Email tab',
      'Verify SMTP server and port (usually `587` with STARTTLS)',
      'Ensure outgoing server authentication is enabled',
      'Run `ScanPST.exe` from the Office installation directory',
      'Check Windows Firewall → Allow Outlook through firewall',
      'Test SMTP connectivity: `telnet smtp.server.com 587`',
      'If still failing, create a new Outlook profile and re-add the account',
    ],
    updatedAgo: '2 hours ago',
  },
  {
    id: 4,
    title: 'Nginx 502 Bad Gateway',
    tags: ['Linux', 'Web', 'Nginx'],
    category: 'web',
    summary: 'Nginx returns 502 Bad Gateway. Check upstream service health, review error logs, and verify proxy configuration.',
    steps: [
      'Check upstream service status: `systemctl status <service>`',
      'Tail the error log: `tail -f /var/log/nginx/error.log`',
      'Verify `upstream` block in `nginx.conf` points to the correct port',
      'Test upstream directly: `curl http://127.0.0.1:<port>`',
      'Check system resources: `free -m && df -h`',
      'Reload Nginx config: `nginx -t && systemctl reload nginx`',
      'If using proxy_pass to a socket, verify socket file permissions',
    ],
    updatedAgo: '1 day ago',
  },
  {
    id: 5,
    title: 'BitLocker Recovery Key Not Found',
    tags: ['Security', 'Windows'],
    category: 'security',
    summary: 'BitLocker prompted for recovery key after BIOS update. Check Azure AD, local backup, and Microsoft account for stored keys.',
    steps: [
      'Check Azure AD portal → Devices → select device → BitLocker keys',
      'Check user\'s Microsoft account at `account.microsoft.com/devices`',
      'Search AD for `msFVE-RecoveryPassword` attribute on the computer object',
      'Ask user if the key was backed up to a USB drive or printed',
      'If no key is found, data recovery requires a full disk wipe',
    ],
    updatedAgo: '4 hours ago',
  },
  {
    id: 6,
    title: 'DHCP Scope Exhaustion',
    tags: ['Networking', 'Windows Server'],
    category: 'networking',
    summary: 'No more IP addresses available in the DHCP scope. Expand range, reduce lease duration, and identify rogue devices.',
    steps: [
      'Open DHCP Management Console → check scope statistics',
      'Note the percentage of addresses currently in use',
      'Delete any stale or orphaned leases',
      'Reduce lease duration from 8 days to 4 hours if appropriate',
      'Expand the scope address range if subnet mask allows',
      'List active clients: `netsh dhcp server \\\\<server> scope <ip> show clients`',
      'Look for unknown MAC addresses that may be rogue devices',
    ],
    updatedAgo: '6 hours ago',
  },
  {
    id: 7,
    title: 'Printer Spooler Crash Loop',
    tags: ['Printing', 'Windows'],
    category: 'printing',
    summary: 'Print Spooler service keeps crashing and restarting. Clear stuck jobs, reset spooler, and reinstall problematic drivers.',
    steps: [
      'Stop the Print Spooler service: `net stop spooler`',
      'Delete all files in `C:\\Windows\\System32\\spool\\PRINTERS`',
      'Restart the Print Spooler service: `net start spooler`',
      'If crashing persists, open Event Viewer → System log for crash details',
      'Remove the offending printer driver via Print Management (`printmanagement.msc`)',
      'Reinstall the printer driver from the manufacturer website',
      'Test with a simple text print job',
    ],
    updatedAgo: '1 day ago',
  },
  {
    id: 8,
    title: 'BSOD — IRQL_NOT_LESS_OR_EQUAL',
    tags: ['Hardware', 'Windows'],
    category: 'os',
    summary: 'Repeated BSOD with stop code IRQL_NOT_LESS_OR_EQUAL. Usually caused by faulty drivers or bad RAM. Analyze dump files to pinpoint.',
    steps: [
      'Boot into Safe Mode (hold Shift during restart → Troubleshoot)',
      'Open Event Viewer → System log → filter for BugCheck events',
      'Run `verifier /standard /all` to enable Driver Verifier and reboot',
      'After next BSOD, analyze dump: `WinDbg → File → Open Crash Dump → !analyze -v`',
      'Identify the faulting driver module from the stack trace',
      'Update or roll back the faulting driver',
      'Run `sfc /scannow` and `DISM /Online /Cleanup-Image /RestoreHealth`',
      'Test RAM with Windows Memory Diagnostic (`mdsched.exe`)',
    ],
    updatedAgo: '12 hours ago',
  },
  {
    id: 9,
    title: 'Azure / M365 Connectivity Loss',
    tags: ['Cloud', 'Azure', 'Networking'],
    category: 'cloud',
    summary: 'Users unable to reach Microsoft 365 services. Check Azure status page, verify DNS resolution, and inspect proxy/firewall rules.',
    steps: [
      'Check Microsoft Service Health at `status.office.com`',
      'Verify DNS resolves correctly: `nslookup outlook.office365.com`',
      'Test HTTPS connectivity: `curl -I https://outlook.office365.com`',
      'Check proxy or firewall rules — ensure O365 IP ranges are whitelisted',
      'Review Azure AD Conditional Access policies for blocked sign-ins',
      'Flush local DNS and reset network stack on client machines',
      'If using ExpressRoute, verify BGP peering status with ISP',
    ],
    updatedAgo: '30 minutes ago',
  },
  {
    id: 10,
    title: 'SSL Certificate Expired on IIS',
    tags: ['Web', 'Security', 'Windows Server'],
    category: 'web',
    summary: 'Website shows "Not Secure" warning due to expired SSL certificate. Renew the cert, bind it in IIS, and verify the chain.',
    steps: [
      'Open IIS Manager → select the site → Bindings → check cert expiry',
      'Generate a new CSR via IIS or `certreq`',
      'Submit CSR to your Certificate Authority (CA) and obtain the new cert',
      'Import the PFX into the machine\'s Personal certificate store',
      'In IIS Bindings, update the HTTPS binding to use the new cert',
      'Verify the full chain: `openssl s_client -connect yourdomain.com:443`',
      'Restart the IIS site: `iisreset /restart`',
    ],
    updatedAgo: '2 days ago',
  },
];

/* ============================================================
   HELPER — tag color
   ============================================================ */
const tagColor = (tag) => {
  const lower = tag.toLowerCase();
  for (const catKey in CATEGORY_MAP) {
    const cat = CATEGORY_MAP[catKey];
    if (cat.label.toLowerCase().includes(lower) || catKey.includes(lower)) return cat.color;
  }
  const map = {
    windows: '#4ade80', linux: '#fb923c', nginx: '#38bdf8',
    smtp: '#fbbf24', outlook: '#fbbf24', azure: '#2dd4bf',
    'windows server': '#4ade80',
  };
  return map[lower] || '#00e5ff';
};

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

const Tag = ({ label }) => {
  const isNetworking = label.toLowerCase() === 'vpn' || label.toLowerCase() === 'dns';
  const c = tagColor(label);
  return (
    <span className="tag" style={{ color: c, background: `${c}12`, border: `1px solid ${c}25` }}>
      {label}
    </span>
  );
};

const FixCard = ({ fix, index, onClick, categories, overrides }) => {
  const cat = (categories || []).find(c => c.id === fix.category_id);
  const icon = getCategoryIcon(cat, overrides);
  const color = cat?.color || CATEGORY_MAP[cat?.name?.toLowerCase()]?.color || 'var(--accent)';

  return (
    <div className="card fix-card" onClick={onClick}>
      <div className="card-header">
        <div className="card-cat" style={{ background: `${color}15`, color: color }}>
          <Icon name={icon} size={14} sw={2.5} />
          {cat?.name || 'Uncategorized'}
        </div>
        <div className="card-date">#0{index}</div>
      </div>
      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="fix-title">{fix.title}</div>
          <div className="fix-summary">{fix.summary}</div>
          <div className="fix-tags">
            {fix.tags.map((t) => <Tag key={t} label={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const FixList = ({ fixes, onSelect, categories, overrides }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {fixes.map((fix, i) => (
      <FixCard key={fix.id} fix={fix} index={i + 1} onClick={() => onSelect(fix)} categories={categories} overrides={overrides} />
    ))}
  </div>
);

const CategoryCard = ({ cat, count, onClick, overrides }) => {
  const icon = getCategoryIcon(cat, overrides);
  const color = cat?.color || CATEGORY_MAP[cat?.name?.toLowerCase()]?.color || 'var(--accent)';
  
  return (
    <div className="cat-card" onClick={onClick}>
      <div
        className="cat-icon"
        style={{ background: `${color}15`, color: color, boxShadow: `0 0 12px ${color}18` }}
      >
        <Icon name={icon} size={22} sw={2.5} />
      </div>
      <div className="cat-name">{cat.name}</div>
      <div className="cat-count">{count} {count === 1 ? 'fix' : 'fixes'}</div>
    </div>
  );
};

/* ============================================================
   DETAIL VIEW
   ============================================================ */
const DetailView = ({ fix, onBack, onEdit, onDeleteTrigger, categories }) => {
  const [done, setDone] = useState({});
  const toggle = (i) => setDone((prev) => ({ ...prev, [i]: !prev[i] }));

  const cat = (categories || []).find(c => c.id === fix.category_id);
  const iconInfo = CATEGORY_MAP[cat?.name.toLowerCase()] || { icon: 'Folder', color: 'var(--accent)' };

  const renderStep = (text) =>
    (text || '').split(/(\`.+?\`)/g).map((part, idx) =>
      part.startsWith('`') && part.endsWith('`') ? (
        <code key={idx}>{part.slice(1, -1)}</code>
      ) : (
        <span key={idx}>{part}</span>
      )
    );

  return (
    <div className="detail-overlay">
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          <Icon name="ChevronLeft" size={22} />
        </button>
        <h2 style={{ flex: 1, fontSize: '0.9rem', fontFamily: "'Nunito', sans-serif", fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)', letterSpacing: 0, paddingRight: '0.5rem' }}>
          {fix.title}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="action-btn-circle" 
            onClick={() => onEdit(fix)} 
            title="Edit Fix"
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Edit" size={16} sw={2} />
          </button>
          <button 
            className="action-btn-circle" 
            onClick={() => onDeleteTrigger(fix)} 
            title="Delete Fix"
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(248, 113, 113, 0.12)', border: '1px solid rgba(248, 113, 113, 0.2)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Trash" size={16} sw={2} />
          </button>
        </div>
      </div>

      <div className="scroll-area" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
          {/* Category Pill */}
          <span className="tag-pill" style={{ borderColor: iconInfo.color + '44', color: iconInfo.color, background: iconInfo.color + '11' }}>
            <Icon name={iconInfo.icon} size={10} sw={3} /> {cat?.name || 'Uncategorized'}
          </span>
          {(fix.tags || []).map((t) => <Tag key={t} label={t} />)}
        </div>
        <div className="detail-summary">{fix.summary}</div>

        {/* Error attachments (if any) */}
        {fix.attachments && fix.attachments.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <div className="steps-header" style={{ marginBottom: '0.75rem' }}>
              <Icon name="Image" size={14} sw={2} /> ERROR SCREENSHOTS
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {fix.attachments.map((att, i) => (
                <img
                  key={i}
                  src={att.file_path}
                  alt={att.file_name}
                  style={{
                    height: '140px',
                    borderRadius: '0.65rem',
                    border: '1px solid var(--border)',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="steps-header">
          <Icon name="Check" size={14} sw={3} /> STEPS TO RESOLVE
        </div>
        {fix.steps.map((step, i) => (
          <div
            key={i}
            className={`step-item${done[i] ? ' done' : ''}`}
            onClick={() => toggle(i)}
          >
            <div
              className="step-num"
              style={{
                background: done[i] ? 'var(--accent)' : 'var(--accent-dim)',
                color: done[i] ? 'var(--bg-primary)' : 'var(--accent)',
              }}
            >
              {done[i] ? <Icon name="Check" size={12} sw={3.5} /> : i + 1}
            </div>
            <div className="step-text">{renderStep(step)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   CAMERA SCREEN
   ============================================================ */
/* ============================================================
   SMART OCR ERROR EXTRACTION
   Extracts error codes, HTTP status codes, and technical keywords
   from raw OCR text to produce a focused search query.
   ============================================================ */
const extractErrorTerms = (rawText) => {
  const text = rawText.replace(/\s+/g, ' ').trim();
  const found = [];

  // 1. "Error <code>" patterns (Error 500, Error 0x80070005)
  const errorCode = text.match(/error\s+(?:code\s*[:.]?\s*)?([0-9]+|0x[0-9a-f]+)/gi);
  if (errorCode) found.push(...errorCode.map(m => m.trim()));

  // 2. "STOP 0x..." patterns (BSOD stop codes)
  const stopCode = text.match(/stop\s+0x[0-9a-f]+/gi);
  if (stopCode) found.push(...stopCode.map(m => m.trim()));

  // 3. Windows hex error codes standalone (0x80070005)
  const hexCode = text.match(/\b0x[0-9a-f]{4,}/gi);
  if (hexCode) found.push(...hexCode.map(m => m.trim()));

  // 4. HTTP status codes in context ("500 Internal", "404 Not Found")
  const httpStatus = text.match(/\b(4[0-9]{2}|5[0-9]{2})\s+[a-z]+/gi);
  if (httpStatus) found.push(...httpStatus.map(m => m.trim().split(/\s+/).slice(0, 3).join(' ')));

  // 5. Standalone HTTP status codes (just 500, 404, etc.)
  const statusOnly = text.match(/\b(4[0-9]{2}|5[0-9]{2})\b/g);
  if (statusOnly) found.push(...statusOnly);

  // 6. "<Service> Error" patterns (Cloudflare Error, DNS Error)
  const svcError = text.match(/\b\w+\s+error\b/gi);
  if (svcError) found.push(...svcError.map(m => m.trim()));

  // 7. Common technical error keywords
  const keywords = ['BSOD', 'timeout', 'timed out', 'connection refused',
    'access denied', 'permission denied', 'not found', 'unauthorized',
    'forbidden', 'bad gateway', 'service unavailable', 'internal server',
    'certificate', 'SSL', 'TLS', 'DNS', 'DHCP', 'firewall', 'proxy',
    'authentication failed', 'login failed', 'crash', 'fatal',
    'segmentation fault', 'stack overflow', 'out of memory', 'disk full',
    'blue screen', 'kernel panic'];
  const lower = text.toLowerCase();
  keywords.forEach(kw => {
    if (lower.includes(kw.toLowerCase())) found.push(kw);
  });

  // Deduplicate (case-insensitive)
  const seen = new Set();
  const unique = found.filter(term => {
    const key = term.toLowerCase().trim();
    if (seen.has(key) || key.length < 2) return false;
    seen.add(key);
    return true;
  });

  // Return extracted terms joined, or fallback to first 60 chars of cleaned text
  return unique.length > 0 ? unique.join(' ') : text.slice(0, 60);
};

const CameraScreen = ({ onBack, onScan }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [flash, setFlash] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      } catch (err) { console.warn('Camera unavailable:', err); }
    })();
    return () => { cancelled = true; streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const performOCR = async (imageSource) => {
    setScanning(true);
    setProgress(0);
    try {
      const { data: { text } } = await Tesseract.recognize(imageSource, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') setProgress(Math.floor(m.progress * 100));
        }
      });
      
      // Clean up text — remove noise, keep alphanumeric and common symbols
      const clean = text.replace(/[^a-zA-Z0-9\s.,\-:()]/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean) {
        // Extract error codes and keywords instead of dumping raw text
        const extracted = extractErrorTerms(clean);
        console.log('[OCR] Raw:', clean.slice(0, 100), '...');
        console.log('[OCR] Extracted:', extracted);
        onScan(extracted);
      } else {
        alert("Could not read any text. Try better lighting or a clearer shot.");
      }
    } catch (err) {
      console.error('OCR Error:', err);
      alert("Scanning failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    performOCR(canvas.toDataURL('image/png'));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => performOCR(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBack = () => { streamRef.current?.getTracks().forEach((t) => t.stop()); onBack(); };

  return (
    <div className="camera-screen">
      <video ref={videoRef} className="camera-viewfinder" autoPlay playsInline muted />
      {flash && <div style={{ position: 'absolute', inset: 0, background: 'white', opacity: 0.3, zIndex: 10 }} />}
      
      {scanning && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20, backdropFilter: 'blur(10px)' }}>
          <div className="nav-dot" style={{ width: '60px', height: '60px', background: 'var(--accent)', boxShadow: '0 0 30px var(--accent)', borderRadius: '50%', animation: 'pulse 1.5s infinite alternate', marginBottom: '2rem' }} />
          <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.9rem', letterSpacing: '0.2em', fontWeight: 800 }}>SCANNING... {progress}%</div>
          <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '1rem', borderRadius: '1px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
          </div>
        </div>
      )}

      <div className="camera-overlay">
        <button className="camera-back" onClick={handleBack}><Icon name="ChevronLeft" size={20} /></button>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="bracket-frame"><div className="bl" /><div className="br" /></div>
          <div className="camera-label">POINT AT ERROR SCREEN</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '1.5rem' }}>
          {/* Gallery Button */}
          <button 
            className="action-btn-circle" 
            onClick={() => fileInputRef.current?.click()}
            style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Image" size={22} sw={2} />
          </button>

          {/* Shutter Button */}
          <button className="shutter-ring" onClick={handleCapture} disabled={scanning}>
            <div className="shutter-btn-inner" />
          </button>

          {/* Spacer to keep shutter centered */}
          <div style={{ width: '52px' }} />
        </div>

        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
        />
      </div>
    </div>
  );
};

/* ============================================================
   DELETE CONFIRM MODAL
   ============================================================ */
const DeleteConfirmModal = ({ fix, onConfirm, onCancel }) => (
  <div style={{
    position: 'absolute', inset: 0, background: 'rgba(6,10,16,0.88)',
    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1100, padding: '2rem'
  }}>
    <div className="fade-in" style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '1.25rem', padding: '1.75rem', width: '100%',
      maxWidth: '320px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: 'rgba(248, 113, 113, 0.12)', color: '#f87171',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.25rem'
      }}>
        <Icon name="Trash" size={24} sw={2} />
      </div>
      <h3 style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: "'Nunito', sans-serif" }}>Delete Fix?</h3>
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
        Are you sure you want to delete <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>"{fix?.title}"</span>? This action cannot be undone.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button 
          className="primary-btn" 
          onClick={onConfirm}
          style={{ background: '#f87171', color: 'white', boxShadow: '0 0 16px rgba(248, 113, 113, 0.2)' }}
        >
          DELETE FIX
        </button>
        <button 
          className="secondary-btn" 
          onClick={onCancel}
          style={{ border: 'none', background: 'transparent' }}
        >
          CANCEL
        </button>
      </div>
    </div>
  </div>
);

/* ============================================================
   LOADING OVERLAY
   ============================================================ */
const LoadingOverlay = () => (
  <div style={{
    position: 'absolute', inset: 0, background: 'rgba(6,10,16,0.8)',
    backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  }}>
    <div className="nav-dot" style={{ width: '40px', height: '40px', background: 'var(--accent)', boxShadow: '0 0 20px var(--accent)', borderRadius: '50%', animation: 'pulse 1.5s infinite alternate' }} />
    <div className="mono" style={{ marginTop: '1.5rem', color: 'var(--accent)', fontSize: '0.8rem', letterSpacing: '0.2em' }}>SYNCHRONIZING...</div>
  </div>
);

/* ============================================================
   CREATE FIX FORM
   ============================================================ */
const CreateFixForm = ({ onClose, onSave, categories, initialData = null }) => {
  const [title, setTitle]       = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || categories[0]?.id || '');
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [summary, setSummary]   = useState(initialData?.summary || '');
  const [steps, setSteps]       = useState(initialData?.steps || ['']);
  const [existingScreenshots, setExistingScreenshots] = useState(initialData?.screenshots || []);
  const [newScreenshots, setNewScreenshots] = useState([]); // array of base64 dataURLs
  const [errors, setErrors]     = useState({});
  const fileInputRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => { setTimeout(() => titleRef.current?.focus(), 150); }, []);

  // Steps helpers
  const updateStep    = (i, val) => setSteps((s) => s.map((v, idx) => idx === i ? val : v));
  const addStep       = ()       => setSteps((s) => [...s, '']);
  const removeStep    = (i)      => setSteps((s) => s.filter((_, idx) => idx !== i));

  // Screenshot upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewScreenshots((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };
  const removeExistingScreenshot = (i) => setExistingScreenshots((s) => s.filter((_, idx) => idx !== i));
  const removeNewScreenshot = (i) => setNewScreenshots((s) => s.filter((_, idx) => idx !== i));

  // Validation & save
  const handleSave = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!summary.trim()) errs.summary = 'Summary is required';
    if (steps.every((s) => !s.trim())) errs.steps = 'Add at least one step';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const fixData = {
      title: title.trim(),
      category: category,
      tags: tags.length ? tags : ['General'],
      summary: summary.trim(),
      steps: steps.filter((s) => s.trim()),
    };

    if (initialData) {
      onSave(initialData.id, {
        ...fixData,
        existingScreenshots,
        newScreenshots,
      });
    } else {
      onSave({
        ...fixData,
        screenshots: newScreenshots,
      });
    }
  };

  const selectedCat = categories.find((c) => c.id === category);

  return (
    <div className="detail-overlay">
      {/* Header */}
      <div className="top-bar" style={{ justifyContent: 'space-between' }}>
        <button className="back-btn" onClick={onClose}>
          <Icon name="X" size={20} />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: 0 }}>
          {initialData ? 'EDIT FIX' : 'NEW FIX'}
        </h2>
        <button
          onClick={handleSave}
          style={{
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            border: 'none',
            borderRadius: '0.6rem',
            padding: '0.45rem 0.9rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
          }}
        >
          SAVE
        </button>
      </div>

      {/* Body */}
      <div className="scroll-area" style={{ padding: '1.25rem' }}>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">TITLE</label>
          <input
            ref={titleRef}
            className={`form-input${errors.title ? ' form-input-error' : ''}`}
            type="text"
            placeholder="e.g. VPN Connection Drop"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((err) => ({ ...err, title: '' })); }}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">CATEGORY</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {categories.map((cat) => {
              const iconInfo = CATEGORY_MAP[cat.name.toLowerCase()] || { icon: 'Folder', color: 'var(--accent)' };
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.65rem 0.3rem',
                    borderRadius: '0.75rem',
                    border: `1.5px solid ${isActive ? iconInfo.color : 'var(--border)'}`,
                    background: isActive ? `${iconInfo.color}12` : 'var(--bg-card)',
                    color: isActive ? iconInfo.color : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                  }}
                >
                  <Icon name={iconInfo.icon} size={18} sw={isActive ? 2.5 : 1.8} />
                  <span style={{ lineHeight: 1.2, textAlign: 'center' }}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">
            <Icon name="Tag" size={11} sw={2} /> TAGS
            <span style={{ fontWeight: 400, opacity: 0.6, marginLeft: '0.4rem' }}>(comma-separated)</span>
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Windows, VPN, Networking"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
          {tagsInput && (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {tagsInput.split(',').filter((t) => t.trim()).map((t, i) => <Tag key={i} label={t.trim()} />)}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="form-group">
          <label className="form-label">SUMMARY</label>
          <textarea
            className={`form-input${errors.summary ? ' form-input-error' : ''}`}
            placeholder="1-2 sentence description of the issue and fix..."
            value={summary}
            onChange={(e) => { setSummary(e.target.value); setErrors((err) => ({ ...err, summary: '' })); }}
            rows={3}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
          {errors.summary && <span className="form-error">{errors.summary}</span>}
        </div>

        {/* Steps */}
        <div className="form-group">
          <label className="form-label">
            <Icon name="Check" size={11} sw={3} /> STEPS TO RESOLVE
          </label>
          {errors.steps && <span className="form-error" style={{ display: 'block', marginBottom: '0.5rem' }}>{errors.steps}</span>}
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div
                className="step-num"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)', flexShrink: 0, marginTop: '0.5rem', width: '26px', height: '26px' }}
              >
                {i + 1}
              </div>
              <textarea
                className="form-input"
                placeholder={`Step ${i + 1} — wrap commands in backticks e.g. \`ipconfig\``}
                value={step}
                onChange={(e) => { updateStep(i, e.target.value); setErrors((err) => ({ ...err, steps: '' })); }}
                rows={2}
                style={{ flex: 1, resize: 'vertical', minHeight: '52px' }}
              />
              {steps.length > 1 && (
                <button
                  onClick={() => removeStep(i)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0.5rem', marginTop: '0.25rem', flexShrink: 0, cursor: 'pointer' }}
                >
                  <Icon name="Trash" size={16} sw={2} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addStep}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'var(--accent-dim)', border: '1px dashed rgba(0,229,255,0.25)',
              color: 'var(--accent)', borderRadius: '0.65rem', padding: '0.55rem 0.85rem',
              width: '100%', justifyContent: 'center', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.05em', marginTop: '0.25rem',
            }}
          >
            <Icon name="Plus" size={14} sw={2.5} /> ADD STEP
          </button>
        </div>

        {/* Screenshots */}
        <div className="form-group">
          <label className="form-label">
            <Icon name="Image" size={11} sw={2} /> ERROR SCREENSHOTS
            <span style={{ fontWeight: 400, opacity: 0.6, marginLeft: '0.4rem' }}>(optional)</span>
          </label>

          {/* Existing & New Image previews */}
          {(existingScreenshots.length > 0 || newScreenshots.length > 0) && (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {/* Existing */}
              {existingScreenshots.map((src, i) => (
                <div key={`idx-${i}`} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={src}
                    alt={`Existing Screenshot ${i + 1}`}
                    style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '0.6rem', border: '1px solid var(--border)' }}
                  />
                  <button
                    onClick={() => removeExistingScreenshot(i)}
                    style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: '#f87171', border: 'none', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon name="X" size={11} sw={2.5} />
                  </button>
                </div>
              ))}
              {/* New */}
              {newScreenshots.map((src, i) => (
                <div key={`new-${i}`} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={src}
                    alt={`New Screenshot ${i + 1}`}
                    style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '0.6rem', border: '2px solid var(--accent)' }}
                  />
                  <button
                    onClick={() => removeNewScreenshot(i)}
                    style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: '#f87171', border: 'none', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon name="X" size={11} sw={2.5} />
                  </button>
                  <div style={{ position: 'absolute', bottom: '2px', right: '4px', fontSize: '0.5rem', background: 'var(--accent)', color: 'black', padding: '1px 3px', borderRadius: '2px', fontWeight: 800 }}>NEW</div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.55rem',
              background: 'var(--bg-card)', border: '1px dashed var(--border)',
              color: 'var(--text-secondary)', borderRadius: '0.85rem', padding: '0.85rem 1rem',
              width: '100%', justifyContent: 'center', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600,
            }}
          >
            <Icon name="Image" size={18} sw={1.8} />
            Tap to attach screenshots
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Bottom padding */}
        <div style={{ height: '1rem' }} />
      </div>
    </div>
  );
};

/* ============================================================
   AUTH FORM
   ============================================================ */
const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [message, setMessage]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      alert('Supabase not configured');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (data.session) onAuthSuccess(data.session.user);
      else if (!isLogin) setMessage('Check your email for the confirmation link!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-header">
        <h1>Pocket<span style={{ color: 'var(--accent)' }}>KB</span></h1>
        <p>{isLogin ? 'Sign in to access your knowledge base' : 'Create an account to start saving fixes'}</p>
      </div>

      {/* Google Login Button */}
      <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
        {loading ? 'CONNECTING...' : 'Continue with Google'}
      </button>

      <div className="divider">OR</div>

      <div className="auth-toggle">
        <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
        <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Sign Up</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">EMAIL</label>
          <input
            className="form-input"
            type="email"
            required
            placeholder="technician@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: isLogin ? '0.25rem' : '0.5rem' }}>
          <label className="form-label">PASSWORD</label>
          <input
            className="form-input"
            type="password"
            required={!message} // Not required if just resetting
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {isLogin && (
          <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
            <button 
              type="button"
              onClick={handleForgotPassword}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', opacity: 0.8 }}
            >
              Forgot password?
            </button>
          </div>
        )}

        {error && <div className="form-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ color: 'var(--accent)', fontSize: '0.75rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>{message}</div>}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <div className="auth-footer">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}>{isLogin ? 'Sign up' : 'Log in'}</button>
      </div>
    </div>
  );
};

/* ============================================================
   QR SCANNER EFFECT (lazy loads html5-qrcode)
   ============================================================ */
const QRScannerEffect = ({ containerRef, instanceRef, onDecode }) => {
  useEffect(() => {
    let scanner = null;
    let stopped = false;

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (stopped) return;
        
        scanner = new Html5Qrcode("qr-reader");
        instanceRef.current = scanner;
        
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 200, height: 200 } },
          (decodedText) => {
            scanner.stop().catch(() => {});
            instanceRef.current = null;
            onDecode(decodedText);
          },
          () => {} // ignore errors (no QR found each frame)
        );
      } catch (err) {
        console.error('QR Scanner error:', err);
        alert('Could not start camera. Make sure camera permissions are granted.');
      }
    };

    if (containerRef.current) {
      initScanner();
    }

    return () => {
      stopped = true;
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  return null;
};

/* ============================================================
   COMPONENT: CATEGORY MANAGER & ICON PICKER
   ============================================================ */
const ICON_POOL = [
  'Wifi', 'Monitor', 'Server', 'Shield', 'Users', 'Mail', 'Globe', 'Cloud', 
  'Printer', 'User', 'Settings', 'Image', 'Tag', 'Cpu', 'Database', 'Key', 
  'Zap', 'Smartphone', 'Lock', 'Code', 'Scan', 'Grid', 'Home'
];

const IconPicker = ({ current, onSelect, onBack }) => (
  <div className="category-manager-overlay">
    <div className="top-bar">
      <button className="back-btn" onClick={onBack}><Icon name="ChevronLeft" size={22} /></button>
      <h2>CHOOSE ICON</h2>
    </div>
    <div className="scroll-area" style={{ padding: '1.5rem' }}>
      <div className="icon-grid">
        {ICON_POOL.map(icon => (
          <button 
            key={icon} 
            className={`icon-box ${current === icon ? 'active' : ''}`}
            onClick={() => onSelect(icon)}
          >
            <Icon name={icon} size={24} />
            <div className="icon-label">{icon}</div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const CategoryManager = ({ categories, overrides, onSaveOverride, onCreate, onDelete, onClose, user }) => {
  const [showPicker, setShowPicker] = useState(null); // { id, currentIcon }
  const [showAdd, setShowAdd] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [newIcon, setNewIcon] = useState('Folder');

  const myCount = categories.filter(c => c.created_by_id === user?.id).length;
  const limitReached = myCount >= 5;

  const handleCreate = async () => {
    if (!newName.trim() || limitReached) return;
    await onCreate({ name: newName, color: newColor, icon: newIcon });
    setNewName('');
    setShowAdd(false);
  };

  if (showPicker) {
    return (
      <IconPicker 
        current={showPicker.currentIcon} 
        onSelect={(icon) => { onSaveOverride(showPicker.id, icon); setShowPicker(null); }} 
        onBack={() => setShowPicker(null)} 
      />
    );
  }

  return (
    <div className="category-manager-overlay">
      <div className="top-bar">
        <button className="back-btn" onClick={onClose}><Icon name="ChevronLeft" size={22} /></button>
        <h2>CATEGORIES</h2>
      </div>

      <div className="scroll-area" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            MANAGE CATEGORIES ({categories.length})
          </div>
          {!showAdd && (
            <button 
              className="add-cat-tiny" 
              onClick={() => setShowAdd(true)}
              disabled={limitReached}
              style={{ opacity: limitReached ? 0.5 : 1 }}
            >
              <Icon name="Plus" size={12} /> {limitReached ? 'LIMIT REACHED' : 'ADD NEW'}
            </button>
          )}
        </div>

        {showAdd && (
          <div className="settings-group" style={{ marginBottom: '2rem', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>CATEGORY NAME</label>
              <input 
                className="input-base" 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                placeholder="Legacy, DevOps, etc." 
                style={{ marginTop: '0.5rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>COLOR</label>
                <input 
                  type="color" 
                  value={newColor} 
                  onChange={e => setNewColor(e.target.value)} 
                  style={{ display: 'block', width: '100%', height: '38px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', marginTop: '0.5rem', cursor: 'pointer' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>ICON</label>
                <button 
                  className="input-base" 
                  onClick={() => setShowPicker({ id: 'NEW', currentIcon: newIcon })}
                  style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}
                >
                  <Icon name={newIcon} size={18} /> SELECT
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="primary-btn" onClick={handleCreate} disabled={!newName.trim()} style={{ flex: 1 }}>CREATE</button>
              <button className="secondary-btn" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>CANCEL</button>
            </div>
          </div>
        )}

        <div className="settings-group">
          {categories.map((cat) => {
            const icon = overrides[cat.id] || cat.icon;
            const isCustom = !!cat.created_by_id;
            return (
              <div key={cat.id} className="settings-item">
                <div 
                  className="cat-icon-ring" 
                  style={{ borderColor: cat.color }} 
                  onClick={() => setShowPicker({ id: cat.id, currentIcon: icon })}
                >
                  <Icon name={icon} size={18} color={cat.color} />
                  <div className="edit-badge"><Icon name="Edit" size={10} /></div>
                </div>
                <div className="settings-item-label" style={{ marginLeft: '1rem' }}>
                  {cat.name}
                  {isCustom && <span className="mono" style={{ fontSize: '0.5rem', marginLeft: '0.5rem', color: 'var(--accent)', opacity: 0.7 }}>CREATED BY YOU</span>}
                </div>
                <div className="settings-item-value" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <span style={{ fontSize: '0.7rem' }}>{overrides[cat.id] ? '(LOCAL OVERRIDE)' : ''}</span>
                   {isCustom && (
                     <button 
                       onClick={(e) => { e.stopPropagation(); setCatToDelete(cat); }}
                       style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', opacity: 0.7 }}
                       title="Delete Category"
                     >
                       <Icon name="Trash" size={16} />
                     </button>
                   )}
                </div>
              </div>
            );
          })}
        </div>

        {catToDelete && (
          <div className="modal-overlay" style={{ zIndex: 3000 }}>
            <div className="fade-in modal-content" style={{ maxWidth: '300px', textAlign: 'center' }}>
              <div style={{ marginBottom: '1.5rem', color: '#ef4444' }}>
                <Icon name="Trash" size={40} />
              </div>
              <h3 style={{ marginBottom: '0.75rem' }}>Delete Category?</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
                Are you sure you want to delete "<strong>{catToDelete.name}</strong>"?<br/>
                Linked fixes will become uncategorized.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="primary-btn" style={{ flex: 1, background: '#ef4444' }} onClick={() => { onDelete(catToDelete.id); setCatToDelete(null); }}>DELETE</button>
                <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setCatToDelete(null)}>CANCEL</button>
              </div>
            </div>
          </div>
        )}
        
        <div className="mono" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.55rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Icon changes are stored locally in your browser and<br/>apply only to your account.
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SETTINGS SCREEN
   ============================================================ */
const SettingsScreen = ({ user, currentOrg, memberships, theme, onThemeToggle, onLogout, onSwitchOrg, onJoinOrg, onManageMembers, onManageCategories, pendingMembers, onApproveMember, onRejectMember, onShowQR }) => {
  const currentRole = memberships.find(m => m.org_id === currentOrg?.id)?.role;
  const isAdmin = currentRole === 'owner' || currentRole === 'admin';
  const pendingCount = (pendingMembers || []).length;

  return (
    <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="top-bar">
        <h2 style={{ flex: 1, letterSpacing: '0.15em' }}>SETTINGS</h2>
      </div>

      <div className="scroll-area" style={{ padding: '1.25rem' }}>
        {/* Profile */}
        <div className="profile-header">
          <div className="profile-avatar">
            <Icon name="User" size={32} />
          </div>
          <div className="profile-info">
            <h3>{user?.email?.split('@')[0] || 'Technician'}</h3>
            <p>{user?.email || 'Not signed in'}</p>
          </div>
        </div>

        {/* Workspaces */}
        <div className="settings-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>WORKSPACES</div>
            <button 
              onClick={onJoinOrg}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Icon name="Plus" size={12} sw={3} /> JOIN
            </button>
          </div>
          
          <div className="workspace-list">
            {memberships.map((m) => {
              const isActive = currentOrg?.id === m.org.id;
              const isPending = m.status === 'pending';
              const isAdminRole = m.role === 'owner' || m.role === 'admin';
              return (
                <div 
                  key={m.org.id} 
                  className={`workspace-item${isActive ? ' active' : ''}${isPending ? ' pending' : ''}`} 
                  onClick={() => !isActive && !isPending && onSwitchOrg(m.org)}
                  style={isPending ? { cursor: 'default', opacity: 0.7 } : {}}
                >
                  <div className="workspace-icon">
                    <Icon name="Home" size={18} color={isPending ? '#f59e0b' : isActive ? 'var(--bg-primary)' : 'var(--accent)'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="workspace-name">{m.org.name}</div>
                    <div className="workspace-role">{m.role.toUpperCase()}</div>
                  </div>
                  {/* Role & QR Badges */}
                  <div className="workspace-badges">
                    <div className={`role-badge ${isAdminRole ? 'admin' : 'member'}`} title={isAdminRole ? 'Admin' : 'Member'}>
                      <Icon name={isAdminRole ? 'Shield' : 'User'} size={12} sw={2.5} />
                    </div>
                    {!isPending && (
                      <button 
                        className="qr-badge" 
                        title="Show QR Code"
                        onClick={(e) => { e.stopPropagation(); onShowQR(m.org); }}
                      >
                        <Icon name="Grid" size={12} sw={2.5} />
                      </button>
                    )}
                  </div>
                  {isPending ? (
                    <div className="pending-badge">PENDING</div>
                  ) : isActive ? (
                    <div className="active-badge">ACTIVE</div>
                  ) : (
                    <div className="switch-hint">TAP TO SWITCH</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin: Pending Members Panel */}
        {isAdmin && (
          <div className="settings-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>MEMBERS</div>
              {pendingCount > 0 && (
                <div className="pending-count-badge">{pendingCount} pending</div>
              )}
            </div>
            {pendingCount > 0 ? (
              <div className="members-list">
                {pendingMembers.map((pm) => (
                  <div key={pm.id} className="member-card pending">
                    <div className="member-info">
                      <div className="member-avatar">
                        <Icon name="User" size={16} color="#f59e0b" />
                      </div>
                      <div>
                        <div className="member-name">{pm.user_email || pm.user_id.substring(0, 8) + '...'}</div>
                        <div className="member-status">Awaiting approval</div>
                      </div>
                    </div>
                    <div className="member-actions">
                      <button className="approve-btn" onClick={() => onApproveMember(pm)}>
                        <Icon name="Check" size={14} sw={3} /> Approve
                      </button>
                      <button className="reject-btn" onClick={() => onRejectMember(pm)}>
                        <Icon name="X" size={14} sw={3} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                No pending requests
              </div>
            )}
          </div>
        )}

        {/* Preferences */}
        <div className="settings-section">
          <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>PREFERENCES</div>
          <div className="settings-group">
            <div className="settings-item" onClick={onManageCategories} style={{ cursor: 'pointer' }}>
              <Icon name="Tag" size={18} color="var(--accent)" />
              <div className="settings-item-label">Categories & Icons</div>
              <Icon name="ChevronLeft" size={14} sw={3} style={{ transform: 'rotate(180deg)', opacity: 0.3 }} />
            </div>
            <div className="settings-item">
              <Icon name={theme === 'dark' ? 'Moon' : 'Sun'} size={18} color="var(--accent)" />
              <div className="settings-item-label">Appearance</div>
              <div className="theme-switch">
                <button 
                  className={theme === 'dark' ? 'active' : ''} 
                  onClick={() => onThemeToggle('dark')}
                >
                  <Icon name="Moon" size={16} />
                </button>
                <button 
                  className={theme === 'light' ? 'active' : ''} 
                  onClick={() => onThemeToggle('light')}
                >
                  <Icon name="Sun" size={16} />
                </button>
              </div>
            </div>
            <div className="settings-item">
              <Icon name="Globe" size={18} color="var(--text-muted)" />
              <div className="settings-item-label">Language</div>
              <div className="settings-item-value">English</div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="settings-section">
          <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>ACCOUNT</div>
          <div className="settings-group">
            <div className="settings-item">
              <div className="settings-item-label">Supabase Connection</div>
              <div className="settings-item-value" style={{ color: supabase ? '#4ade80' : '#f87171' }}>
                {supabase ? 'CONNECTED' : 'DISCONNECTED'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <button className="secondary-btn" onClick={onLogout} style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)' }}>
            <Icon name="X" size={16} /> SIGN OUT
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '2rem' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>PocketKB v1.2.0 • Stable Build</p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SCREEN: HOME
   ============================================================ */
const HomeScreen = ({ navigate, onAdd, fixes, categories, overrides }) => {
  return (
    <div className="fade-in scroll-area" style={{ height: '100%', padding: '1.5rem' }}>
      {/* Premium Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
        <div className="home-brand">
          <span className="pocket">Pocket</span>
          <span className="kb">KB</span>
        </div>
        <p className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.75rem', letterSpacing: '0.2em', opacity: 0.8 }}>
          YOUR POCKET-SIZED IT BRAIN
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.15rem', marginBottom: '2.5rem' }}>
        {/* Search Card */}
        <div className="action-card search-glow" onClick={() => navigate('search')}>
          <div className="action-card-icon" style={{ background: 'rgba(0, 229, 255, 0.15)', color: 'var(--accent)' }}>
            <Icon name="Search" size={26} sw={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="action-card-title">Search</div>
            <div className="action-card-desc">Find fixes by error code, keyword, or command</div>
          </div>
        </div>

        {/* Browse Card */}
        <div className="action-card" onClick={() => navigate('browse')}>
          <div className="action-card-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Icon name="Folder" size={26} sw={2.2} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="action-card-title">Browse</div>
            <div className="action-card-desc">Explore fixes organized by category</div>
          </div>
        </div>

        {/* Camera Card */}
        <div className="action-card" onClick={() => navigate('camera')}>
          <div className="action-card-icon" style={{ background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' }}>
            <Icon name="Camera" size={26} sw={2.2} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="action-card-title">Camera</div>
            <div className="action-card-desc">Snap an error screen for instant lookup</div>
          </div>
        </div>

        {/* Create Card */}
        <div className="action-card add-fix-glow" onClick={onAdd} style={{ border: '1px solid rgba(0, 229, 255, 0.25)', background: 'rgba(0, 229, 255, 0.04)' }}>
          <div className="action-card-icon" style={{ background: 'var(--accent)', color: '#000' }}>
            <Icon name="Plus" size={28} sw={3} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="action-card-title" style={{ color: 'var(--accent)' }}>Add Fix</div>
            <div className="action-card-desc" style={{ color: 'rgba(255,255,255,0.6)' }}>Create a new KB entry with steps & screenshots</div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar scroll-area-x" style={{ display: 'flex', gap: '0.85rem', overflowX: 'auto', paddingBottom: '2rem', opacity: 0.6 }}>
        <div className="stat-pill">
          <Icon name="Database" size={12} color="var(--accent)" />
          <span>{fixes.length} ENTRIES</span>
        </div>
        <div className="stat-pill">
          <Icon name="Folder" size={12} color="var(--accent)" />
          <span>{categories.length} CATEGORIES</span>
        </div>
        <div className="stat-pill">
          <Icon name="Shield" size={12} color="var(--accent)" />
          <span>RLS-ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SCREEN: SEARCH
   ============================================================ */
const SearchScreen = ({ onBack, onSelectFix, fixes, categories, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => inputRef.current?.focus(), 100); return () => clearTimeout(t); }, []);

  const results = useMemo(() => {
    if (!query.trim()) return fixes;
    const q = query.toLowerCase().trim();
    
    // Split into individual search terms for OR-matching
    // This makes OCR queries like "Error 500 Internal server" match a fix titled "Error 500"
    const terms = q.split(/\s+/).filter(t => t.length >= 2);
    
    return fixes.filter((f) => {
      const title = f.title.toLowerCase();
      const summary = f.summary.toLowerCase();
      const tags = (f.tags || []).map(t => t.toLowerCase());
      
      // First: try exact full-query match
      if (title.includes(q) || summary.includes(q) || tags.some(t => t.includes(q))) {
        return true;
      }
      
      // Second: OR-match on individual terms (any term match = result)
      return terms.some(term => 
        title.includes(term) || 
        summary.includes(term) || 
        tags.some(t => t.includes(term))
      );
    });
  }, [query, fixes]);

  return (
    <>
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}><Icon name="ChevronLeft" size={22} /></button>
        <h2>SEARCH</h2>
      </div>
      <div style={{ padding: '0.75rem 1.25rem' }}>
        <div className={`search-wrap${focused || query ? ' focused' : ''}`}>
          <Icon name="Search" size={18} sw={2} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Error code, keyword, command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {query && (
            <button className="clear-btn" onClick={() => { setQuery(''); inputRef.current?.focus(); }}>
              <Icon name="X" size={14} sw={2.5} />
            </button>
          )}
        </div>
      </div>
      <div className="scroll-area" style={{ padding: '0.5rem 1.25rem 2rem' }}>
        <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.85rem', letterSpacing: '0.12em' }}>
          {query ? `RESULTS (${results.length})` : `ALL FIXES (${results.length})`}
        </div>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Icon name="Search" size={32} sw={1.5} />
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>No fixes found matching "{query}"</p>
          </div>
        ) : (
          results.map((fix, i) => (
            <FixCard key={fix.id} fix={fix} index={i + 1} onClick={() => onSelectFix(fix)} categories={categories} overrides={initialQuery ? {} : {}} />
          ))
        )}
      </div>
    </>
  );
};

/* ============================================================
   SCREEN: BROWSE
   ============================================================ */
const BrowseScreen = ({ onBack, onSelectFix, fixes, categories, overrides }) => {
  const [selectedCat, setSelectedCat] = useState(null);

  const counts = useMemo(() => {
    const m = {};
    categories.forEach((c) => { m[c.id] = 0; });
    fixes.forEach((f) => { if (m[f.category_id] !== undefined) m[f.category_id]++; });
    return m;
  }, [fixes, categories]);

  const catFixes = useMemo(
    () => (selectedCat ? fixes.filter((f) => f.category_id === selectedCat.id) : []),
    [selectedCat, fixes]
  );

  const recent = (fixes || []).slice(0, 8);

  return (
    <>
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}><Icon name="ChevronLeft" size={22} /></button>
        <h2>BROWSE</h2>
      </div>
      <div className="scroll-area" style={{ padding: '1.25rem 1.25rem 3rem' }}>
        <div className="browse-grid" style={{ marginBottom: '2.5rem' }}>
          {categories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} count={counts[cat.id]} onClick={() => setSelectedCat(cat)} overrides={overrides} />
          ))}
        </div>

        {recent.length > 0 && (
          <div className="fade-in">
            <div className="section-title">
              <span className="mono">RECENT ACTIVITY</span>
              <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--accent) 0%, transparent 100%)', opacity: 0.2 }}></div>
            </div>
            <FixList fixes={recent} onSelect={onSelectFix} categories={categories} />
          </div>
        )}
      </div>

      {selectedCat && (
        <div className="category-list-overlay">
          <div className="top-bar">
            <button className="back-btn" onClick={() => setSelectedCat(null)}><Icon name="ChevronLeft" size={22} /></button>
            <div style={{ width: '1.65rem', height: '1.65rem', borderRadius: '0.45rem', background: `${(selectedCat?.color || CATEGORY_MAP[selectedCat?.name?.toLowerCase()]?.color || 'var(--accent)')}15`, color: selectedCat?.color || CATEGORY_MAP[selectedCat?.name?.toLowerCase()]?.color || 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={getCategoryIcon(selectedCat, overrides)} size={14} sw={2.5} />
            </div>
            <h2 style={{ color: 'var(--text-primary)', letterSpacing: 0, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '1rem' }}>
              {selectedCat.name}
            </h2>
          </div>
          <div className="scroll-area" style={{ padding: '1rem 1.25rem 2rem' }}>
            {catFixes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No fixes in this category yet.
              </div>
            ) : (
              catFixes.map((fix, i) => (
                <FixCard key={fix.id} fix={fix} index={i + 1} onClick={() => onSelectFix(fix)} categories={categories} />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ============================================================
   MAIN APPLICATION
   ============================================================ */
export default function App() {
  const [user, setUser]         = useState(null);
  const [screen, setScreen]     = useState('home');
  const [fixes, setFixes]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [currentOrg, setCurrentOrg]   = useState(null);
  
  const [selectedFix, setSelectedFix] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [theme, setTheme]       = useState(localStorage.getItem('kb-theme') || 'dark');
  const [showCreate, setShowCreate] = useState(false);
  const [editingFix, setEditingFix] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fixToDelete, setFixToDelete] = useState(null);
  const [ocrQuery, setOcrQuery] = useState(''); // Text scanned from camera/upload
  const [showJoinOrg, setShowJoinOrg] = useState(false);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [qrOrg, setQrOrg] = useState(null); // org to show QR for
  const [joinScanMode, setJoinScanMode] = useState(false); // QR scan mode in join dialog
  const qrScannerRef = useRef(null);
  const qrScannerInstance = useRef(null);

  const [iconOverrides, setIconOverrides] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kb-icon-overrides') || '{}');
    } catch { return {}; }
  });
  const [showManageCategories, setShowManageCategories] = useState(false);

  useEffect(() => {
    localStorage.setItem('kb-icon-overrides', JSON.stringify(iconOverrides));
  }, [iconOverrides]);


  const navigate = (s) => setScreen(s);

  // Auth & Session
  useEffect(() => {
    if (!supabase) return;
    
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchOrgData = useCallback(async () => {
    if (!user || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('org_members')
        .select('*, org:orgs(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setMemberships(data || []);
      
      // Only auto-switch to ACTIVE memberships
      const activeMembers = (data || []).filter(m => m.status === 'active');
      if (activeMembers.length > 0) {
        if (!currentOrg || !activeMembers.some(m => m.org_id === currentOrg.id)) {
          setCurrentOrg(activeMembers[0].org);
        }
      }
    } catch (err) {
      console.error('Error fetching orgs:', err);
    }
  }, [user, currentOrg]);

  useEffect(() => {
    fetchOrgData();
  }, [fetchOrgData]);

  // Fetch Categories for current Org
  const fetchCategories = useCallback(async () => {
    if (!currentOrg || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('org_id', currentOrg.id)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [currentOrg]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Theme Logic
  useEffect(() => {
    document.body.classList.remove('light-theme');
    if (theme === 'light') document.body.classList.add('light-theme');
    localStorage.setItem('kb-theme', theme);
  }, [theme]);

  // Fetch fixes for current Org
  const fetchFixes = useCallback(async () => {
    if (!currentOrg || !supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('fixes')
        .select('*, steps:fix_steps(*), attachments:attachments(*), fix_tags(tags:tags(*))')
        .eq('org_id', currentOrg.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map components to match legacy/expected flat format if needed, 
      // but let's just ensure we sort the steps by step_order
      const mapped = (data || []).map(f => ({
        ...f,
        steps: (f.steps || []).sort((a,b) => a.step_order - b.step_order).map(s => s.content),
        tags: (f.fix_tags || []).map(ft => ft.tags?.name).filter(Boolean)
      }));
      
      setFixes(mapped);
    } catch (err) {
      console.error('Error fetching fixes:', err);
    } finally {
      setLoading(false);
    }
  }, [currentOrg]);

  useEffect(() => {
    fetchFixes();
  }, [fetchFixes]);

  // Helper: Convert DataURL to Blob for Supabase Storage
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Create Category
  const handleCreateCategory = async (catData) => {
    if (!currentOrg || !supabase || !user) return;
    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          ...catData,
          org_id: currentOrg.id,
          created_by_id: user.id,
          sort_order: categories.length + 1
        });
      
      if (error) throw error;
      fetchCategories();
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Failed to create category.');
    }
  };

  const handleSaveOverride = (id, icon) => {
    setIconOverrides(prev => ({ ...prev, [id]: icon }));
  };

  const handleDeleteCategory = async (id) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category.');
    }
  };

  const handleAddFix = useCallback(async (fixData) => {
    if (!currentOrg || !supabase) return;
    setLoading(true);
    try {
      let screenshotUrls = [];

      // 1. Upload screenshots to Supabase Storage org-scoped
      if (fixData.screenshots && fixData.screenshots.length > 0) {
        for (let i = 0; i < fixData.screenshots.length; i++) {
          const blob = dataURLtoBlob(fixData.screenshots[i]);
          const fileName = `orgs/${currentOrg.id}/fixes/${Date.now()}_${i}.png`;
          const { error: storageError } = await supabase.storage
            .from('screenshots')
            .upload(fileName, blob);
          
          if (storageError) throw storageError;
          
          const { data: publicUrlData } = supabase.storage
            .from('screenshots')
            .getPublicUrl(fileName);
          
          screenshotUrls.push(publicUrlData.publicUrl);
        }
      }

      const newFix = {
        org_id: currentOrg.id,
        category_id: fixData.category,
        title: fixData.title,
        summary: fixData.summary,
        author_id: user.id,
      };

      // 2. Save to Supabase Table
      const { data: insertedFix, error } = await supabase
        .from('fixes')
        .insert([newFix])
        .select();
      
      if (error) throw error;

      // 3. Save normalized entities (Steps & Screenshots/Attachments)
      if (insertedFix && insertedFix[0]) {
        const fixId = insertedFix[0].id;

        // Steps
        if (fixData.steps && fixData.steps.length > 0) {
          const stepsToInsert = fixData.steps.map((content, idx) => ({
            org_id: currentOrg.id,
            fix_id: fixId,
            step_order: idx + 1,
            content
          }));
          await supabase.from('fix_steps').insert(stepsToInsert);
        }

        // Attachments
        if (screenshotUrls.length > 0) {
          const attachmentsToInsert = screenshotUrls.map(url => ({
            org_id: currentOrg.id,
            fix_id: fixId,
            file_path: url,
            file_name: url.split('/').pop(),
            mime_type: 'image/png',
            uploaded_by_id: user.id
          }));
          await supabase.from('attachments').insert(attachmentsToInsert);
        }

        // Tags logic (Normalized)
        if (fixData.tags && fixData.tags.length > 0) {
          // 1. Ensure tags exist for this org
          const tagsToEnsure = fixData.tags.map(t => ({ org_id: currentOrg.id, name: t }));
          const { data: orgTags, error: tagErr } = await supabase
            .from('tags')
            .upsert(tagsToEnsure, { onConflict: 'org_id, name' })
            .select();
          
          if (!tagErr && orgTags) {
            // 2. Link tags to this fix
            const fixTagsToInsert = orgTags
              .filter(t => fixData.tags.includes(t.name))
              .map(t => ({
                org_id: currentOrg.id,
                fix_id: fixId,
                tag_id: t.id
              }));
            await supabase.from('fix_tags').insert(fixTagsToInsert);
          }
        }
      }

      await fetchFixes();
      setShowCreate(false);
    } catch (err) {
      console.error('Error adding fix:', err);
      alert('Failed to save fix.');
    } finally {
      setLoading(false);
    }
  }, [currentOrg, user, fetchFixes]);

  const handleUpdateFix = useCallback(async (fixId, fixData) => {
    if (!currentOrg || !supabase) return;
    setLoading(true);
    try {
      // 1. Update the main fix row
      const updatedFix = {
        title: fixData.title,
        category_id: fixData.category,
        summary: fixData.summary,
        updated_at: new Date().toISOString(),
        updated_by_id: user.id,
      };

      const { error } = await supabase
        .from('fixes')
        .update(updatedFix)
        .eq('id', fixId)
        .eq('org_id', currentOrg.id); // Guarding with org_id
      
      if (error) throw error;

      // 3. Update Steps (Delete old ones and re-insert for simplicity in this mobile app context)
      await supabase.from('fix_steps').delete().eq('fix_id', fixData.id);
      if (fixData.steps && fixData.steps.length > 0) {
        const stepsToInsert = fixData.steps.map((content, idx) => ({
          org_id: currentOrg.id,
          fix_id: fixData.id,
          step_order: idx + 1,
          content
        }));
        await supabase.from('fix_steps').insert(stepsToInsert);
      }

      // 4. Update Tags (Delete old mappings and re-insert)
      await supabase.from('fix_tags').delete().eq('fix_id', fixData.id);
      if (fixData.tags && fixData.tags.length > 0) {
        const tagsToEnsure = fixData.tags.map(t => ({ org_id: currentOrg.id, name: t }));
        const { data: orgTags, error: tagErr } = await supabase
          .from('tags')
          .upsert(tagsToEnsure, { onConflict: 'org_id, name' })
          .select();
        
        if (!tagErr && orgTags) {
          const fixTagsToInsert = orgTags
            .filter(t => fixData.tags.includes(t.name))
            .map(t => ({
              org_id: currentOrg.id,
              fix_id: fixData.id,
              tag_id: t.id
            }));
          await supabase.from('fix_tags').insert(fixTagsToInsert);
        }
      }

      await fetchFixes();
      setShowCreate(false);
      setEditingFix(null);
    } catch (err) {
      console.error('Error updating fix:', err);
      alert('Failed to update fix.');
    } finally {
      setLoading(false);
    }
  }, [currentOrg, user, fetchFixes]);

  const handleDeleteFix = useCallback(async (fixId) => {
    if (!currentOrg || !supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('fixes')
        .delete()
        .eq('id', fixId)
        .eq('org_id', currentOrg.id);
      
      if (error) throw error;
      setFixes((prev) => prev.filter((f) => f.id !== fixId));
      setSelectedFix(null);
      setShowDeleteConfirm(false);
      setFixToDelete(null);
    } catch (err) {
      console.error('Error deleting fix:', err);
      alert('Failed to delete fix.');
    } finally {
      setLoading(false);
    }
  }, [currentOrg]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setScreen('home');
    setCurrentOrg(null);
    setMemberships([]);
  };

  const handleSwitchOrg = (org) => {
    setCurrentOrg(org);
    setScreen('home');
  };

  const handleJoinOrg = async (inviteCode) => {
    if (!user || !supabase || !inviteCode) return;
    setLoading(true);
    try {
      // First try to find by slug (slugs are strings, never UUIDs)
      let { data: org, error: orgErr } = await supabase
        .from('orgs')
        .select('*')
        .eq('slug', inviteCode)
        .maybeSingle();
      
      // If not found by slug, and it looks like a UUID, try by ID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(inviteCode);
      if (!org && isUUID) {
        const { data: orgById, error: idErr } = await supabase
          .from('orgs')
          .select('*')
          .eq('id', inviteCode)
          .maybeSingle();
        if (orgById) org = orgById;
      }
      
      if (!org) throw new Error("Workspace not found. Please check the ID or slug.");

      // Check if already a member
      const { data: existing } = await supabase
        .from('org_members')
        .select('*')
        .eq('org_id', org.id)
        .eq('user_id', user.id)
        .single();
      
      if (existing) {
        alert(`You are already a member of ${org.name}!`);
        setCurrentOrg(org);
        setShowJoinOrg(false);
        return;
      }

      // Join the org with pending status (default from DB)
      const { error: joinErr } = await supabase
        .from('org_members')
        .insert([{
          org_id: org.id,
          user_id: user.id,
          role: 'member',
          status: 'pending'
        }]);
      
      if (joinErr) throw joinErr;

      await fetchOrgData();
      setShowJoinOrg(false);
      alert(`Request sent to join ${org.name}! An admin will review your request.`);
    } catch (err) {
      console.error('Error joining workspace:', err);
      alert(err.message || "Failed to join workspace.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending members for admin panel
  const fetchPendingMembers = useCallback(async () => {
    if (!currentOrg || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('org_members')
        .select('*')
        .eq('org_id', currentOrg.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      // Try to enrich with profile data
      const enriched = await Promise.all((data || []).map(async (m) => {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, display_name')
            .eq('id', m.user_id)
            .maybeSingle();
          return { ...m, user_email: profile?.email || profile?.display_name || null };
        } catch {
          return { ...m, user_email: null };
        }
      }));
      setPendingMembers(enriched);
    } catch (err) {
      console.error('Error fetching pending members:', err);
      setPendingMembers([]);
    }
  }, [currentOrg]);

  useEffect(() => {
    fetchPendingMembers();
  }, [fetchPendingMembers]);

  const handleApproveMember = async (member) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('org_members')
        .update({ status: 'active' })
        .eq('id', member.id);
      
      if (error) throw error;
      alert(`Member approved!`);
      await fetchPendingMembers();
    } catch (err) {
      console.error('Error approving member:', err);
      alert('Failed to approve member.');
    }
  };

  const handleRejectMember = async (member) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('org_members')
        .delete()
        .eq('id', member.id);
      
      if (error) throw error;
      alert(`Member rejected.`);
      await fetchPendingMembers();
    } catch (err) {
      console.error('Error rejecting member:', err);
      alert('Failed to reject member.');
    }
  };

  // Auth Guard: If not logged in, only show AuthForm
  if (!user && supabase) {
    return (
      <div className="app-shell">
        <AuthForm onAuthSuccess={(u) => setUser(u)} />
        {loading && <LoadingOverlay />}
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Error Banner */}
      {error && (
        <div style={{
          background: '#ef4444', color: 'white', padding: '0.75rem 1.25rem',
          fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace",
          textAlign: 'center', fontWeight: 800, lineHeight: 1.4,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          position: 'sticky', top: 0, zIndex: 2000,
        }}>
          {error}
        </div>
      )}

      {/* Main Screens */}
      {screen === 'home'     && <HomeScreen navigate={navigate} onAdd={() => setShowCreate(true)} fixes={fixes} categories={categories} overrides={iconOverrides} />}
      {screen === 'search'   && (
        <SearchScreen 
          onBack={() => { setScreen('home'); setOcrQuery(''); }} 
          onSelectFix={setSelectedFix} 
          fixes={fixes} 
          categories={categories} 
          initialQuery={ocrQuery}
          overrides={iconOverrides}
        />
      )}
      {screen === 'browse'   && <BrowseScreen onBack={() => setScreen('home')} onSelectFix={setSelectedFix} fixes={fixes} categories={categories} overrides={iconOverrides} />}
      {screen === 'camera'   && <CameraScreen onBack={() => setScreen('home')} onScan={(text) => { setOcrQuery(text); setScreen('search'); }} />}
      {screen === 'settings' && (
        <SettingsScreen 
          user={user} 
          currentOrg={currentOrg}
          memberships={memberships}
          theme={theme} 
          onThemeToggle={setTheme} 
          onLogout={handleLogout} 
          onSwitchOrg={handleSwitchOrg}
          onJoinOrg={() => setShowJoinOrg(true)}
          pendingMembers={pendingMembers}
          onApproveMember={handleApproveMember}
          onRejectMember={handleRejectMember}
          onShowQR={(org) => setQrOrg(org)}
          onManageCategories={() => setShowManageCategories(true)}
        />
      )}

      {/* Bottom nav — hidden on camera */}
      {screen !== 'camera' && (
        <nav className="bottom-nav">
          {[
            { id: 'home',     icon: 'Home',     label: 'Home' },
            { id: 'search',   icon: 'Search',   label: 'Search' },
            { id: 'browse',   icon: 'Folder',   label: 'Browse' },
            { id: 'settings', icon: 'Settings', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-item${screen === item.id ? ' active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <Icon name={item.icon} size={22} sw={screen === item.id ? 2.5 : 1.8} />
              <span>{item.label}</span>
              {screen === item.id && <div className="nav-dot" />}
            </button>
          ))}
        </nav>
      )}

      {/* Detail Overlay */}
      {selectedFix && (
        <DetailView 
          fix={selectedFix} 
          categories={categories}
          onBack={() => setSelectedFix(null)} 
          onEdit={() => { setShowCreate(true); setEditingFix(selectedFix); setSelectedFix(null); }}
          onDeleteTrigger={(fix) => { setFixToDelete(fix); setShowDeleteConfirm(true); }}
        />
      )}

      {/* Create / Edit Fix overlay */}
      {showCreate && (
        <CreateFixForm 
          categories={categories}
          initialData={editingFix}
          onClose={() => { setShowCreate(false); setEditingFix(null); }} 
          onSave={editingFix ? handleUpdateFix : handleAddFix} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal 
          fix={fixToDelete}
          onConfirm={() => handleDeleteFix(fixToDelete.id)}
          onCancel={() => { setShowDeleteConfirm(false); setFixToDelete(null); }}
        />
      )}

      {/* Join Workspace Overlay */}
      {showJoinOrg && (
        <div className="join-overlay">
          <div className="fade-in join-card">
            <div className="join-header">
              <div className="join-icon"><Icon name="Plus" size={24} /></div>
              <h3>Join Workspace</h3>
              <p>Enter a workspace ID, scan a QR code, or ask your admin to share one.</p>
            </div>
            
            {!joinScanMode ? (
              <>
                <input 
                  className="form-input" 
                  placeholder="e.g. acme-corp or UUID" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleJoinOrg(e.target.value);
                  }}
                  autoFocus
                />
                
                <div className="join-actions">
                  <button className="primary-btn" onClick={(e) => {
                    const input = e.target.closest('.join-card').querySelector('.form-input');
                    handleJoinOrg(input?.value);
                  }}>JOIN WORKSPACE</button>
                  <button className="secondary-btn scan-qr-btn" onClick={() => setJoinScanMode(true)}>
                    <Icon name="Scan" size={16} sw={2.5} /> SCAN QR CODE
                  </button>
                  <button className="secondary-btn" onClick={() => setShowJoinOrg(false)}>CANCEL</button>
                </div>
              </>
            ) : (
              <>
                <div 
                  id="qr-reader" 
                  ref={qrScannerRef} 
                  className="qr-scanner-container"
                  style={{ width: '100%', minHeight: '250px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1rem' }}
                />
                <QRScannerEffect 
                  containerRef={qrScannerRef}
                  instanceRef={qrScannerInstance}
                  onDecode={(text) => {
                    setJoinScanMode(false);
                    // Try to parse as JSON (our QR format)
                    try {
                      const payload = JSON.parse(text);
                      handleJoinOrg(payload.slug || payload.id || text);
                    } catch {
                      handleJoinOrg(text);
                    }
                  }}
                />
                <div className="join-actions">
                  <button className="secondary-btn" onClick={() => {
                    setJoinScanMode(false);
                    if (qrScannerInstance.current) {
                      qrScannerInstance.current.stop().catch(() => {});
                      qrScannerInstance.current = null;
                    }
                  }}>BACK TO MANUAL</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Category Management Overlay */}
      {showManageCategories && (
        <CategoryManager
          categories={categories}
          overrides={iconOverrides}
          onSaveOverride={handleSaveOverride}
          onCreate={handleCreateCategory}
          onDelete={handleDeleteCategory}
          onClose={() => setShowManageCategories(false)}
          user={user}
        />
      )}

      {/* QR Code Generation Overlay */}
      {qrOrg && (
        <div className="join-overlay" onClick={() => setQrOrg(null)}>
          <div className="fade-in qr-card" onClick={(e) => e.stopPropagation()}>
            <div className="qr-header">
              <h3>{qrOrg.name}</h3>
              <p className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Share this QR to invite members</p>
            </div>
            <div className="qr-code-container">
              <QRCodeSVG 
                value={JSON.stringify({ workspace: qrOrg.name, slug: qrOrg.slug, id: qrOrg.id })}
                size={200}
                bgColor="#ffffff"
                fgColor="#0a0e17"
                level="M"
                includeMargin={true}
              />
            </div>
            <div className="qr-slug-display">
              <span className="mono">{qrOrg.slug || qrOrg.id}</span>
              <button 
                className="copy-slug-btn" 
                onClick={() => {
                  navigator.clipboard.writeText(qrOrg.slug || qrOrg.id);
                  alert('Copied to clipboard!');
                }}
              >
                <Icon name="Copy" size={14} sw={2} /> Copy
              </button>
            </div>
            <button className="secondary-btn" onClick={() => setQrOrg(null)} style={{ marginTop: '1rem' }}>CLOSE</button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}
    </div>
  );
}
