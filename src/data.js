export const CATEGORIES = [
  { id: "networking", label: "Networking", icon: "Wifi", color: "#00d2ff" },
  { id: "os", label: "Operating Systems", icon: "Monitor", color: "#4ade80" },
  { id: "hardware", label: "Server", icon: "Server", color: "#fb923c" },
  { id: "security", label: "Security", icon: "Shield", color: "#f87171" },
  { id: "activedirectory", label: "Active Directory", icon: "Users", color: "#c084fc" },
  { id: "email", label: "Email & SMTP", icon: "Mail", color: "#fde047" },
  { id: "web", label: "Web Services", icon: "Globe", color: "#38bdf8" },
  { id: "cloud", label: "Cloud & SaaS", icon: "Cloud", color: "#34d399" },
];

export const FIXES = [
  {
    id: 1, title: "VPN Connection Drop", pinned: true, starred: true,
    tags: ["Networking"], category: "networking",
    summary: "Flush DNS, check MTU settings, verify gateway config.",
    steps: [
      "Open Command Prompt as Administrator",
      "Run: `ipconfig /flushdns`",
      "Run: `netsh interface ipv4 show subinterfaces` — check MTU",
      "If MTU is >1400, set to 1400: `netsh interface ipv4 set subinterface \"Local Area Connection\" mtu=1400 store=persistent`",
      "Verify VPN gateway config in client settings",
      "Restart VPN service: `net stop \"VPN Service\" && net start \"VPN Service\"`",
      "Test connection with continuous ping: `ping -t <gateway_ip>`"
    ],
    updatedAgo: "3 hours ago"
  },
  {
    id: 2, title: "AD User Account Lockout", pinned: true, starred: true,
    tags: ["ActiveDirectory", "Security"], category: "activedirectory",
    summary: "Examine event logs, check bad password count, confirm GP settings.",
    steps: [
      "Open Active Directory Users and Computers",
      "Locate user → Properties → Account tab",
      "Check 'Account is locked out' checkbox status",
      "Open Event Viewer on DC → Security logs → Filter Event ID 4740",
      "Identify source machine from lockout event",
      "Run: `net user <username> /domain` — check Bad Password Count",
      "Review Group Policy: Account Lockout Threshold & Duration",
      "Clear cached credentials on source machine"
    ],
    updatedAgo: "5 hours ago"
  },
  {
    id: 3, title: "AD IO User Account Lockout", pinned: true, starred: false,
    tags: ["Google Keep", "ActiveDirectory"], category: "activedirectory",
    summary: "Examine event logs, check bad password count, confirm GP settings.",
    steps: [
      "Check Azure AD sign-in logs for failed attempts",
      "Verify hybrid sync status in Azure AD Connect",
      "Review conditional access policies",
      "Check for stale sessions across integrated apps",
      "Reset password if needed via both on-prem and cloud portals"
    ],
    updatedAgo: "1 day ago"
  },
  {
    id: 4, title: "VPN Config Reset", pinned: true, starred: false,
    tags: ["ActiveDirectory", "Networking"], category: "networking",
    summary: "Flush DNS, reset adapter count, and verify config.",
    steps: [
      "Export current VPN config as backup",
      "Remove VPN adapter: `devmgmt.msc` → Network adapters",
      "Reset TCP/IP stack: `netsh int ip reset`",
      "Reset Winsock: `netsh winsock reset`",
      "Reboot and reinstall VPN client",
      "Import saved config and test"
    ],
    updatedAgo: "2 days ago"
  },
  {
    id: 5, title: "Error 0x8004210B: Sending in Outlook", pinned: false, starred: false,
    tags: ["Outlook", "SMTP", "Windows"], category: "email",
    summary: "Verify server settings, repair PST, check firewall.",
    steps: [
      "Open Outlook → File → Account Settings → Email tab",
      "Verify SMTP server and port (usually 587 with STARTTLS)",
      "Check outgoing server authentication is enabled",
      "Run: `ScanPST.exe` from Office install directory",
      "Check Windows Firewall → Allow Outlook through",
      "Test with telnet: `telnet smtp.server.com 587`",
      "If still failing, create new Outlook profile"
    ],
    updatedAgo: "2 hours ago"
  },
  {
    id: 6, title: "Nginx 502 Bad Gateway", pinned: false, starred: false,
    tags: ["Linux", "Nginx", "Web"], category: "web",
    summary: "Check upstream service, reload config, examine error logs.",
    steps: [
      "Check upstream service: `systemctl status <service>`",
      "Review Nginx error log: `tail -f /var/log/nginx/error.log`",
      "Verify upstream block in nginx.conf points to correct port",
      "Test upstream directly: `curl http://127.0.0.1:<port>`",
      "Check for resource exhaustion: `free -m && df -h`",
      "Reload Nginx: `nginx -t && systemctl reload nginx`",
      "If proxy_pass to socket, check socket file permissions"
    ],
    updatedAgo: "1 day ago"
  },
  {
    id: 7, title: "BitLocker Recovery Key Not Found", pinned: false, starred: false,
    tags: ["Windows", "Security"], category: "security",
    summary: "Check Azure AD, local backup, and Microsoft account for recovery key.",
    steps: [
      "Check Azure AD portal → Devices → BitLocker keys",
      "Check user's Microsoft account at account.microsoft.com/devices",
      "Search AD for msFVE-RecoveryPassword attribute",
      "Check if key was backed up to USB or printed",
      "If no key found, data recovery may require disk wipe"
    ],
    updatedAgo: "4 hours ago"
  },
  {
    id: 8, title: "DHCP Scope Exhaustion", pinned: false, starred: false,
    tags: ["Networking", "Windows Server"], category: "networking",
    summary: "Expand scope, reduce lease time, identify rogue devices.",
    steps: [
      "Open DHCP console → check scope statistics",
      "Identify percentage of addresses in use",
      "Check for stale leases and delete them",
      "Reduce lease duration from 8 days to 4 hours if needed",
      "Expand scope range if subnet allows",
      "Run: `dhcp server \\\\<server> scope <scope_ip> show clients`",
      "Look for unknown MAC addresses (rogue devices)"
    ],
    updatedAgo: "6 hours ago"
  }
];
