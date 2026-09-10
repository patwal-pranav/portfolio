/**
 * Interactive RHEL 9 Terminal Engine for Pranav Patwal
 * Realistic Linux Bash CLI with RHCSA commands, auto-completion, history, and systemd outputs.
 */

class LinuxTerminal {
  constructor() {
    this.modal = document.getElementById('terminal-modal');
    this.historyEl = document.getElementById('terminal-history');
    this.input = document.getElementById('terminal-input');
    this.quickButtons = document.querySelectorAll('.quick-cmd-pill');
    this.closeButtons = document.querySelectorAll('.t-btn-close, .terminal-close-icon');
    
    this.commandHistory = [];
    this.historyIndex = -1;
    
    this.commands = {
      help: () => this.cmdHelp(),
      whoami: () => this.cmdWhoami(),
      neofetch: () => this.cmdNeofetch(),
      uname: (args) => this.cmdUname(args),
      skills: () => this.cmdSkills(),
      certs: () => this.cmdCerts(),
      projects: () => this.cmdProjects(),
      systemctl: (args) => this.cmdSystemctl(args),
      contact: () => this.cmdContact(),
      clear: () => this.cmdClear(),
      cat: (args) => this.cmdCat(args),
      ls: () => this.cmdLs(),
      sudo: () => `<span class="t-red">Permission granted: [pranav] is an RHCSA administrator. But with great power comes great responsibility.</span>`,
      date: () => new Date().toUTCString(),
      japan: () => this.cmdJapan(),
      exit: () => { this.close(); return 'Session closed.'; }
    };

    this.init();
  }

  init() {
    if (!this.input) return;

    this.input.addEventListener('keydown', (e) => this.handleKey(e));

    // Close buttons
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Quick Command Pills
    this.quickButtons.forEach(pill => {
      pill.addEventListener('click', () => {
        const cmd = pill.getAttribute('data-cmd');
        if (cmd) {
          this.executeCommand(cmd);
          this.input.focus();
        }
      });
    });

    // Esc key closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('active');
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    setTimeout(() => {
      this.input.focus();
      this.scrollToBottom();
    }, 100);
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  scrollToBottom() {
    const body = document.querySelector('.terminal-body');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  handleKey(e) {
    if (e.key === 'Enter') {
      const rawCmd = this.input.value.trim();
      if (rawCmd.length > 0) {
        this.commandHistory.push(rawCmd);
        this.historyIndex = this.commandHistory.length;
        this.executeCommand(rawCmd);
      } else {
        this.appendEmptyLine();
      }
      this.input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.commandHistory[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.input.value = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = this.commandHistory.length;
        this.input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autoComplete();
    }
  }

  autoComplete() {
    const val = this.input.value.toLowerCase().trim();
    if (!val) return;
    const available = Object.keys(this.commands);
    const match = available.find(cmd => cmd.startsWith(val));
    if (match) {
      this.input.value = match + ' ';
    }
  }

  appendEmptyLine() {
    const entry = document.createElement('div');
    entry.className = 'terminal-entry';
    entry.innerHTML = `
      <div class="terminal-line">
        <span class="t-prompt">[<span class="user">pranav</span>@<span class="path">rhel9-box</span> ~]$</span>
      </div>
    `;
    this.historyEl.appendChild(entry);
    this.scrollToBottom();
  }

  executeCommand(commandString) {
    const parts = commandString.trim().split(/\s+/);
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const entry = document.createElement('div');
    entry.className = 'terminal-entry';

    let outputHtml = '';

    if (mainCmd === 'clear') {
      this.historyEl.innerHTML = '';
      return;
    }

    if (this.commands[mainCmd]) {
      outputHtml = this.commands[mainCmd](args);
    } else {
      outputHtml = `<span class="t-red">bash: command not found: ${escapeHtml(mainCmd)}</span>. Type <span class="t-green">help</span> for available commands.`;
    }

    entry.innerHTML = `
      <div class="terminal-line">
        <span class="t-prompt">[<span class="user">pranav</span>@<span class="path">rhel9-box</span> ~]$</span>
        <span class="t-cmd">${escapeHtml(commandString)}</span>
      </div>
      <div class="t-output">${outputHtml}</div>
    `;

    this.historyEl.appendChild(entry);
    this.scrollToBottom();
  }

  /* Command Implementations */
  cmdHelp() {
    return `
<span class="t-bold t-cyan">PRANAV PATWAL — RHEL 9 CLI SYSTEM (Version 9.4-x86_64)</span>
----------------------------------------------------------------------
Available commands:
  <span class="t-green">neofetch</span>         Display system architecture & visual profile specs
  <span class="t-green">whoami</span>           Identity overview & Japanese profile highlights
  <span class="t-green">skills</span>           List enterprise Linux, automation & tech competencies
  <span class="t-green">certs</span>            Display RHCSA (#240-166-678), JLPT N4, and NIELIT
  <span class="t-green">projects</span>         Explore RHEL 9 Lab, Python Automation & reporting
  <span class="t-green">systemctl status</span> Inspect career.service daemon status in real-time
  <span class="t-green">uname -a</span>         Display kernel & host configuration
  <span class="t-green">cat &lt;file&gt;</span>       Read files (e.g., 'cat resume.txt', 'cat about.txt')
  <span class="t-green">contact</span>          View email, phone, and LinkedIn channels
  <span class="t-green">japan</span>            Discover Pranav's Japanese journey (JLPT N4)
  <span class="t-green">clear</span>            Clear terminal buffer
  <span class="t-green">exit</span>             Close terminal
----------------------------------------------------------------------
💡 Tip: Click any quick command button at the bottom for instant execution!
`;
  }

  cmdWhoami() {
    return `
<span class="t-pink t-bold">Pranav Patwal (プラナヴ・パトワル)</span>
- <span class="t-cyan">Profession:</span> Red Hat Certified System Administrator (RHCSA)
- <span class="t-cyan">Japanese:</span> JLPT Level N4 Certified (日本語能力試験)
- <span class="t-cyan">Degree:</span> Bachelor of Commerce (Honours), University of Delhi (2022-2026)
- <span class="t-cyan">Specialization:</span> RHEL 9 Infrastructure, Bash/Python Automation, LVM Storage, systemd
- <span class="t-cyan">Mission:</span> Delivering rock-solid Linux infrastructure, zero-downtime operations, and bridges to Japanese-global IT initiatives.
`;
  }

  cmdNeofetch() {
    return `
<div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
<span class="t-red" style="font-family: monospace; font-size: 0.72rem; line-height: 1.15;">
         .---.
        /     \\
       | () () |
        \\  _  /
         /   \\
        /|   |\\
       / |   | \\
      (  |   |  )
       \\_|___|_/
         /   \\
        (_____)
</span>
<div style="font-size: 0.8rem;">
<span class="t-pink t-bold">pranav</span>@<span class="t-cyan t-bold">rhel9-box.pranav.lab</span>
-------------------------
<span class="t-yellow">OS:</span> Red Hat Enterprise Linux 9.4 (Plow) x86_64
<span class="t-yellow">Host:</span> Dell PowerEdge RHEL Virtual Machine
<span class="t-yellow">Kernel:</span> 5.14.0-427.el9.x86_64
<span class="t-yellow">Uptime:</span> RHCSA Active since July 2025
<span class="t-yellow">Shell:</span> bash 5.1.8
<span class="t-yellow">Certifications:</span> Red Hat RHCSA, NIELIT 'O' Level, JLPT N4
<span class="t-yellow">Terminal:</span> Neo-Tokyo RHEL Console v2.0
<span class="t-yellow">CPU:</span> 4 vCPUs @ 2.60GHz
<span class="t-yellow">Memory:</span> 4096MiB / 8192MiB
<span class="t-yellow">Spoken Languages:</span> 日本語 (JLPT N4), English, Hindi
</div>
</div>
`;
  }

  cmdUname(args) {
    return `Linux rhel9-box.pranav.lab 5.14.0-427.el9.x86_64 #1 SMP PREEMPT_DYNAMIC Wed Mar 13 10:43:00 EDT 2024 x86_64 GNU/Linux`;
  }

  cmdSkills() {
    return `
<span class="t-bold t-cyan">ENTERPRISE LINUX & IT INFRASTRUCTURE:</span>
  • <span class="t-green">Operating Systems:</span> Red Hat Enterprise Linux (RHEL 9), CentOS, Windows
  • <span class="t-green">Core SysAdmin:</span> systemd (services/targets), LVM storage, /etc/fstab, permissions & ACLs
  • <span class="t-green">Package Ops:</span> dnf/rpm repository management, local mirror setups
  • <span class="t-green">Hardening & Networking:</span> SSH, SELinux policies, firewall-cmd, user & group governance
  • <span class="t-green">Troubleshooting:</span> journalctl, systemctl, log analysis, runbook authoring

<span class="t-bold t-pink">AUTOMATION & SCRIPTING:</span>
  • <span class="t-yellow">Bash:</span> Shell scripting, automated backup routines, system health checks
  • <span class="t-yellow">Python:</span> Bulk file manipulation, regex log parsing, automated reports
  • <span class="t-yellow">Git:</span> Version control, branch hygiene, descriptive commit workflows

<span class="t-bold t-yellow">DATA & COMMERCE ANALYTICS:</span>
  • <span class="t-cyan">MS Excel:</span> VLOOKUP, INDEX/MATCH, Pivot tables, conditional data sanitization
  • <span class="t-cyan">Tally:</span> Ledger reconciliation, commercial transaction audits
`;
  }

  cmdCerts() {
    return `
<span class="t-bold t-green">OFFICIAL CERTIFICATIONS & CREDENTIALS:</span>
--------------------------------------------------------------------------------
1. <span class="t-red t-bold">[RHCSA] Red Hat Certified System Administrator</span>
   - Issuer: Red Hat
   - Issue Date: July 2025
   - Credential ID: <span class="t-cyan t-bold">240-166-678</span>
   - Focus: RHEL 9 Administration, LVM, systemd, Storage & Security

2. <span class="t-pink t-bold">[JLPT N4] Japanese-Language Proficiency Test (Level N4)</span>
   - Issuer: The Japan Foundation & JEES
   - Issue Date: August 2026
   - Capability: Intermediate daily Japanese reading, listening, kanji & grammar

3. <span class="t-yellow t-bold">['O' Level] Information Technology Certificate</span>
   - Issuer: NIELIT (Govt. of India)
   - Issue Date: May 2025
   - Credential ID: <span class="t-cyan t-bold">AEDLB001605878076063</span>
--------------------------------------------------------------------------------
`;
  }

  cmdProjects() {
    return `
<span class="t-bold t-cyan">TECHNICAL PROJECTS:</span>
1. <span class="t-green t-bold">Linux System Administration Lab (RHEL 9, Bash, systemd, LVM)</span>
   - End-to-end RHEL VM provisioning, network configuration & post-install hardening.
   - User/group ACLs, special permission bits (SUID/SGID/Sticky bit).
   - LVM disk partitioning (PV, VG, LV), /etc/fstab persistence.
   - Deep log diagnosis via journalctl and systemctl runbooks.

2. <span class="t-yellow t-bold">Python Automation Scripts (Python, Bash, Git)</span>
   - Scripted automated bulk renaming, regex log filtering, and data extraction.
   - Drastically reduced multi-step manual sorting from 30+ minutes to under 60 seconds.

3. <span class="t-pink t-bold">Spreadsheet Data Handling & Reporting (MS Excel, Tally)</span>
   - Advanced financial reconciliations and automated data summaries.
`;
  }

  cmdSystemctl(args) {
    const sub = args.join(' ');
    if (sub.includes('status') || args.length === 0) {
      return `
<span class="t-green">●</span> career.service - Pranav Patwal Full-Time System Administrator Daemon
     Loaded: loaded (/etc/systemd/system/career.service; <span class="t-green">enabled</span>; vendor preset: disabled)
     Active: <span class="t-green t-bold">active (running)</span> since Sun 2025-07-01 00:00:00 IST; 1y+ ago
   Main PID: 1337 (sysadmin_grind)
      Tasks: 4 (limit: 4915)
     Memory: 64.0M
        CPU: 420ms
     CGroup: /system.slice/career.service
             ├─1337 /usr/bin/bash /opt/pranav/manage_infrastructure.sh
             ├─1338 /usr/bin/python3 /opt/pranav/automate_logs.py
             └─1339 /usr/bin/nihongo_study --level=N4

<span class="t-cyan">Jul 01 09:00:00 rhel9-box systemd[1]:</span> Started Pranav Patwal Full-Time System Administrator Daemon.
<span class="t-cyan">Jul 01 09:00:01 rhel9-box sysadmin[1337]:</span> [STATUS] RHCSA #240-166-678 verified and ready for deployment.
<span class="t-cyan">Jul 01 09:00:02 rhel9-box sysadmin[1337]:</span> [JAPAN] 日本語能力試験 (JLPT N4) certification active.
<span class="t-cyan">Jul 01 09:00:03 rhel9-box sysadmin[1337]:</span> [READY] Seeking Linux System Administrator & IT Infrastructure roles.
`;
    }
    return `Usage: systemctl status career.service`;
  }

  cmdContact() {
    return `
<span class="t-bold t-cyan">GET IN TOUCH / 連絡先:</span>
- <span class="t-pink">Email:</span> <a href="mailto:patwalpranav@gmail.com" class="t-cyan" style="text-decoration: underline;">patwalpranav@gmail.com</a>
- <span class="t-pink">Phone:</span> +91 96437 92352
- <span class="t-pink">LinkedIn:</span> <a href="https://linkedin.com/in/pranavpatwal" target="_blank" class="t-cyan" style="text-decoration: underline;">linkedin.com/in/pranavpatwal</a>
- <span class="t-pink">Location:</span> New Delhi, India
`;
  }

  cmdCat(args) {
    const filename = args[0] || '';
    if (filename.includes('resume') || filename.includes('about')) {
      return `
# PRANAV PATWAL
RHCSA-certified B.Com (Honours) graduate with hands-on experience administering Red Hat Enterprise Linux systems.
Working knowledge of Python, Bash and Git. JLPT N4 certified in Japanese.
Seeking an entry-level role in Linux system administration, IT infrastructure or technical support.
`;
    } else if (filename.includes('certs')) {
      return this.cmdCerts();
    }
    return `<span class="t-red">cat: ${escapeHtml(filename || 'file')}: No such file or directory. Try 'cat resume.txt'</span>`;
  }

  cmdLs() {
    return `
<span class="t-cyan">certs.txt</span>    <span class="t-cyan">projects/</span>    <span class="t-cyan">resume.txt</span>    <span class="t-green">run_diagnostics.sh*</span>    <span class="t-pink">nihongo_notes.md</span>
`;
  }

  cmdJapan() {
    return `
<span class="t-pink t-bold">日本語 (Japanese Journey):</span>
- JLPT N4 Certified (日本語能力試験 N4合格)
- Strong passion for Japanese engineering culture, precision, and Kaizen (改善 - continuous improvement).
- Ready to collaborate with international Japanese tech organizations or companies operating bilingual IT desks!
`;
  }
}

// Utility to escape HTML
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

// Instantiate terminal globally
document.addEventListener('DOMContentLoaded', () => {
  window.linuxTerminal = new LinuxTerminal();

  // Attach all trigger buttons
  document.querySelectorAll('.btn-terminal-trigger, .btn-terminal-inline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.linuxTerminal.open();
    });
  });
});
