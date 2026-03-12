import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

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
};

const Icon = ({ name, size = 24, sw }) => {
  const Comp = Icons[name];
  return Comp ? <Comp size={size} sw={sw} /> : null;
};

/* ============================================================
   DATA MODEL
   ============================================================ */
const CATEGORIES = [
  { id: 'networking',      label: 'Networking',        icon: 'Wifi',    color: '#00d2ff' },
  { id: 'os',              label: 'Operating Systems', icon: 'Monitor', color: '#4ade80' },
  { id: 'hardware',        label: 'Hardware',          icon: 'Server',  color: '#fb923c' },
  { id: 'security',        label: 'Security',          icon: 'Shield',  color: '#f87171' },
  { id: 'activedirectory', label: 'Active Directory',  icon: 'Users',   color: '#c084fc' },
  { id: 'email',           label: 'Email & SMTP',      icon: 'Mail',    color: '#fbbf24' },
  { id: 'web',             label: 'Web Services',      icon: 'Globe',   color: '#38bdf8' },
  { id: 'cloud',           label: 'Cloud & SaaS',      icon: 'Cloud',   color: '#2dd4bf' },
  { id: 'printing',        label: 'Printing',          icon: 'Printer', color: '#fb7185' },
];

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
  for (const cat of CATEGORIES) {
    if (cat.label.toLowerCase().includes(lower) || cat.id.includes(lower)) return cat.color;
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
  const c = tagColor(label);
  return (
    <span className="tag" style={{ color: c, background: `${c}12`, border: `1px solid ${c}25` }}>
      {label}
    </span>
  );
};

const FixCard = ({ fix, index, onClick }) => (
  <div className="card fix-card" onClick={onClick}>
    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
      <div className="fix-num">{index}</div>
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

const CategoryCard = ({ cat, count, onClick }) => (
  <div className="cat-card" onClick={onClick}>
    <div
      className="cat-icon"
      style={{ background: `${cat.color}15`, color: cat.color, boxShadow: `0 0 12px ${cat.color}18` }}
    >
      <Icon name={cat.icon} size={22} sw={2.5} />
    </div>
    <div className="cat-name">{cat.label}</div>
    <div className="cat-count">{count} {count === 1 ? 'fix' : 'fixes'}</div>
  </div>
);

/* ============================================================
   DETAIL VIEW
   ============================================================ */
const DetailView = ({ fix, onBack }) => {
  const [done, setDone] = useState({});
  const toggle = (i) => setDone((prev) => ({ ...prev, [i]: !prev[i] }));

  const renderStep = (text) =>
    text.split(/(`.+?`)/g).map((part, idx) =>
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
        <h2 style={{ flex: 1, fontSize: '1rem', fontFamily: "'Nunito', sans-serif", fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)', letterSpacing: 0 }}>
          {fix.title}
        </h2>
      </div>
      <div className="scroll-area" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
          {fix.tags.map((t) => <Tag key={t} label={t} />)}
        </div>
        <div className="detail-summary">{fix.summary}</div>

        {/* Error screenshots (if any) */}
        {fix.screenshots && fix.screenshots.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <div className="steps-header" style={{ marginBottom: '0.75rem' }}>
              <Icon name="Image" size={14} sw={2} /> ERROR SCREENSHOTS
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {fix.screenshots.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Screenshot ${i + 1}`}
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
const CameraScreen = ({ onBack }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [flash, setFlash] = useState(false);

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

  const handleCapture = () => { setFlash(true); setTimeout(() => setFlash(false), 300); };
  const handleBack = () => { streamRef.current?.getTracks().forEach((t) => t.stop()); onBack(); };

  return (
    <div className="camera-screen">
      <video ref={videoRef} className="camera-viewfinder" autoPlay playsInline muted />
      {flash && <div style={{ position: 'absolute', inset: 0, background: 'white', opacity: 0.3, zIndex: 5 }} />}
      <div className="camera-overlay">
        <button className="camera-back" onClick={handleBack}><Icon name="ChevronLeft" size={20} /></button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="bracket-frame"><div className="bl" /><div className="br" /></div>
          <div className="camera-label">POINT AT ERROR SCREEN</div>
        </div>
        <button className="shutter-ring" onClick={handleCapture}><div className="shutter-btn-inner" /></button>
      </div>
    </div>
  );
};

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
const CreateFixForm = ({ onClose, onSave }) => {
  const [title, setTitle]       = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [tagsInput, setTagsInput] = useState('');
  const [summary, setSummary]   = useState('');
  const [steps, setSteps]       = useState(['']);
  const [screenshots, setScreenshots] = useState([]); // array of base64 dataURLs
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
      reader.onload = (ev) => setScreenshots((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };
  const removeScreenshot = (i) => setScreenshots((s) => s.filter((_, idx) => idx !== i));

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

    onSave({
      title: title.trim(),
      category,
      tags: tags.length ? tags : [CATEGORIES.find((c) => c.id === category)?.label || 'General'],
      summary: summary.trim(),
      steps: steps.filter((s) => s.trim()),
      screenshots,
      updatedAgo: 'just now',
    });
  };

  const selectedCat = CATEGORIES.find((c) => c.id === category);

  return (
    <div className="detail-overlay">
      {/* Header */}
      <div className="top-bar" style={{ justifyContent: 'space-between' }}>
        <button className="back-btn" onClick={onClose}>
          <Icon name="X" size={20} />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: 0 }}>
          NEW FIX
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
            {CATEGORIES.map((cat) => (
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
                  border: `1.5px solid ${category === cat.id ? cat.color : 'var(--border)'}`,
                  background: category === cat.id ? `${cat.color}12` : 'var(--bg-card)',
                  color: category === cat.id ? cat.color : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                }}
              >
                <Icon name={cat.icon} size={18} sw={category === cat.id ? 2.5 : 1.8} />
                <span style={{ lineHeight: 1.2, textAlign: 'center' }}>{cat.label}</span>
              </button>
            ))}
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

          {/* Image previews */}
          {screenshots.length > 0 && (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {screenshots.map((src, i) => (
                <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={src}
                    alt={`Screenshot ${i + 1}`}
                    style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '0.6rem', border: '1px solid var(--border)' }}
                  />
                  <button
                    onClick={() => removeScreenshot(i)}
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
   SCREEN: HOME
   ============================================================ */
const HomeScreen = ({ navigate, onAdd }) => (
  <div className="scroll-area" style={{ padding: '1.5rem 1.25rem 2rem' }}>
    {/* Logo */}
    <div style={{ textAlign: 'center', marginBottom: '2.5rem', paddingTop: '1.5rem' }}>
      <h1 className="mono" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.4rem' }}>
        Pocket<span style={{ color: 'var(--accent)', textShadow: '0 0 18px var(--accent-glow)' }}>KB</span>
      </h1>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '240px', margin: '0 auto', lineHeight: 1.5 }}>
        Your pocket-sized IT knowledge base
      </p>
    </div>

    {/* Action Buttons */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <button className="action-btn" onClick={() => navigate('search')}>
        <div className="action-icon" style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', boxShadow: '0 0 16px rgba(0,229,255,0.12)' }}>
          <Icon name="Search" size={26} sw={2.5} />
        </div>
        <div>
          <div className="action-label">Search</div>
          <div className="action-desc">Find fixes by error code, keyword, or command</div>
        </div>
      </button>

      <button className="action-btn" onClick={() => navigate('browse')}>
        <div className="action-icon" style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc', boxShadow: '0 0 16px rgba(192,132,252,0.12)' }}>
          <Icon name="Folder" size={26} sw={2.5} />
        </div>
        <div>
          <div className="action-label">Browse</div>
          <div className="action-desc">Explore fixes organized by category</div>
        </div>
      </button>

      <button className="action-btn" onClick={() => navigate('camera')}>
        <div className="action-icon" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', boxShadow: '0 0 16px rgba(251,191,36,0.12)' }}>
          <Icon name="Camera" size={26} sw={2.5} />
        </div>
        <div>
          <div className="action-label">Camera</div>
          <div className="action-desc">Snap an error screen for instant lookup</div>
        </div>
      </button>

      {/* Add New Fix button */}
      <button className="action-btn" onClick={onAdd} style={{ borderColor: 'rgba(0,229,255,0.2)', background: 'rgba(0,229,255,0.04)' }}>
        <div className="action-icon" style={{ background: 'rgba(0,229,255,0.12)', color: 'var(--accent)', boxShadow: '0 0 16px var(--accent-glow)', border: '1px solid rgba(0,229,255,0.2)' }}>
          <Icon name="Plus" size={28} sw={2.5} />
        </div>
        <div>
          <div className="action-label" style={{ color: 'var(--accent)' }}>Add Fix</div>
          <div className="action-desc">Create a new KB entry with steps &amp; screenshots</div>
        </div>
      </button>
    </div>
  </div>
);

/* ============================================================
   SCREEN: SEARCH
   ============================================================ */
const SearchScreen = ({ onBack, onSelectFix, fixes }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => inputRef.current?.focus(), 100); return () => clearTimeout(t); }, []);

  const results = useMemo(() => {
    if (!query.trim()) return fixes;
    const q = query.toLowerCase();
    return fixes.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.summary.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
    );
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
            <FixCard key={fix.id} fix={fix} index={i + 1} onClick={() => onSelectFix(fix)} />
          ))
        )}
      </div>
    </>
  );
};

/* ============================================================
   SCREEN: BROWSE
   ============================================================ */
const BrowseScreen = ({ onBack, onSelectFix, fixes }) => {
  const [selectedCat, setSelectedCat] = useState(null);

  const counts = useMemo(() => {
    const m = {};
    CATEGORIES.forEach((c) => { m[c.id] = 0; });
    fixes.forEach((f) => { if (m[f.category] !== undefined) m[f.category]++; });
    return m;
  }, [fixes]);

  const catFixes = useMemo(
    () => (selectedCat ? fixes.filter((f) => f.category === selectedCat.id) : []),
    [selectedCat, fixes]
  );

  return (
    <>
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}><Icon name="ChevronLeft" size={22} /></button>
        <h2>BROWSE</h2>
      </div>
      <div className="scroll-area" style={{ padding: '1.25rem' }}>
        <div className="browse-grid">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} count={counts[cat.id]} onClick={() => setSelectedCat(cat)} />
          ))}
        </div>
      </div>

      {selectedCat && (
        <div className="category-list-overlay">
          <div className="top-bar">
            <button className="back-btn" onClick={() => setSelectedCat(null)}><Icon name="ChevronLeft" size={22} /></button>
            <div style={{ width: '1.65rem', height: '1.65rem', borderRadius: '0.45rem', background: `${selectedCat.color}15`, color: selectedCat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={selectedCat.icon} size={14} sw={2.5} />
            </div>
            <h2 style={{ color: 'var(--text-primary)', letterSpacing: 0, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '1rem' }}>
              {selectedCat.label}
            </h2>
          </div>
          <div className="scroll-area" style={{ padding: '1rem 1.25rem 2rem' }}>
            {catFixes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No fixes in this category yet.
              </div>
            ) : (
              catFixes.map((fix, i) => (
                <FixCard key={fix.id} fix={fix} index={i + 1} onClick={() => onSelectFix(fix)} />
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
  const [screen, setScreen]         = useState('home');
  const [fixes, setFixes]           = useState(INITIAL_FIXES); // Fallback to initial fixes if Supabase not ready
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [selectedFix, setSelectedFix] = useState(null);
  const [showCreate, setShowCreate]  = useState(false);
  const nextId = useRef(INITIAL_FIXES.length + 1);

  const navigate = useCallback((s) => setScreen(s), []);

  // Fetch fixes on mount
  const fetchFixes = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('fixes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        setFixes(data.length > 0 ? data : INITIAL_FIXES);
      }
    } catch (err) {
      console.error('Error fetching fixes:', err);
      if (err.code === 'PGRST205') {
        setError('DATABASE TABLE MISSING: Please run the SQL script to create the "fixes" table.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleAddFix = useCallback(async (fixData) => {
    setLoading(true);
    try {
      let screenshotUrls = [];

      // 1. Upload screenshots to Supabase Storage if available
      if (supabase && fixData.screenshots && fixData.screenshots.length > 0) {
        for (let i = 0; i < fixData.screenshots.length; i++) {
          const blob = dataURLtoBlob(fixData.screenshots[i]);
          const fileName = `${Date.now()}_${i}.png`;
          const { data: storageData, error: storageError } = await supabase.storage
            .from('screenshots')
            .upload(fileName, blob);
          
          if (storageError) throw storageError;
          
          const { data: publicUrlData } = supabase.storage
            .from('screenshots')
            .getPublicUrl(fileName);
          
          screenshotUrls.push(publicUrlData.publicUrl);
        }
      } else {
        // Fallback to dataURLs if Supabase not available (local only)
        screenshotUrls = fixData.screenshots || [];
      }

      const newFix = {
        title: fixData.title,
        category: fixData.category,
        tags: fixData.tags,
        summary: fixData.summary,
        steps: fixData.steps,
        screenshots: screenshotUrls,
        updated_ago: 'just now',
      };

      if (supabase) {
        // 2. Save to Supabase Table
        const { error } = await supabase.from('fixes').insert([newFix]);
        if (error) throw error;
        await fetchFixes();
      } else {
        // 3. Fallback to local state if Supabase not configured
        setFixes((prev) => [{ ...newFix, id: nextId.current++ }, ...prev]);
      }

      setShowCreate(false);
    } catch (err) {
      console.error('Error adding fix:', err);
      alert('Failed to save fix. Please check console for details.');
    } finally {
      setLoading(false);
    }
  }, [fetchFixes]);

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
      {screen === 'home'   && <HomeScreen navigate={navigate} onAdd={() => setShowCreate(true)} />}
      {screen === 'search' && <SearchScreen onBack={() => setScreen('home')} onSelectFix={setSelectedFix} fixes={fixes} />}
      {screen === 'browse' && <BrowseScreen onBack={() => setScreen('home')} onSelectFix={setSelectedFix} fixes={fixes} />}
      {screen === 'camera' && <CameraScreen onBack={() => setScreen('home')} />}

      {/* Bottom nav — hidden on camera */}
      {screen !== 'camera' && (
        <nav className="bottom-nav">
          {[
            { id: 'home',   icon: 'Home',   label: 'Home' },
            { id: 'search', icon: 'Search', label: 'Search' },
            { id: 'browse', icon: 'Folder', label: 'Browse' },
            { id: 'camera', icon: 'Camera', label: 'Camera' },
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

      {/* Detail overlay */}
      {selectedFix && <DetailView fix={selectedFix} onBack={() => setSelectedFix(null)} />}

      {/* Create Fix overlay */}
      {showCreate && <CreateFixForm onClose={() => setShowCreate(false)} onSave={handleAddFix} />}

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}
    </div>
  );
}
