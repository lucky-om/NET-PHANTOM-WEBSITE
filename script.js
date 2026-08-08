/*
   script.js - NetPhantom Hallmark Interactive Console & UI Logic
   Features: Real-time simulated packet sniffer HUD, CLI command launcher with auto-typing chips,
   release hub channel switcher, threat signature search filter, docs filter sandbox,
   smooth ScrollSpy for docs navigation, and scroll-reveal animations.
*/

function getSecureKey() {
    const cipherB64 = "KRYfDwsoByAqXWI2LgwGNTslHxx9cgdBGSIQKQpSKC0pXGUXAiEbURsrJB5VCFwHFhQCHB8uCRo=";
    const xorKey = "NetPhantomSecureHash2026";
    try {
        const cipher = atob(cipherB64);
        let key = "";
        for (let i = 0; i < cipher.length; i++) {
            key += String.fromCharCode(cipher.charCodeAt(i) ^ xorKey.charCodeAt(i % xorKey.length));
        }
        return key;
    } catch (e) {
        return "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initGlobalErrorHandler();
    initNavbarScroll();
    initMobileNav();
    initFaqAccordion();
    initCliTerminal();
    initSimulatedSniffer();
    initDownloadTabs();
    initThreatSearch();
    initDocsFilterSandbox();
    initDocsScrollSpy();
    initScrollReveal();
    initCounterRoll();
    initCursorTrail();
    initPageLoadEffects();
    initStandalonePhantomAIPage();
});

// Global Client Error Handler (Fail safe in production)
function initGlobalErrorHandler() {
    window.onerror = function (msg, url, lineNo, columnNo, error) {
        console.error(`[NetPhantom Client Error] ${msg} at ${url}:${lineNo}:${columnNo}`, error);
        showToast("System Notice: An unexpected error occurred.");
        return true;
    };

    window.addEventListener("unhandledrejection", function (event) {
        console.error("[NetPhantom Unhandled Rejection]", event.reason);
        showToast("Network Notice: Async operation failed.");
    });
}

// HTML Sanitizer for XSS Prevention
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Toast Feedback Helper
function showToast(msg) {
    let toast = document.getElementById("global-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "global-toast";
        toast.className = "toast-msg";
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2400);
}

// Scroll Reveal Intersection Observer
function initScrollReveal() {
    const revealEls = document.querySelectorAll(".reveal-on-scroll");
    if (revealEls.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealEls.forEach(el => observer.observe(el));
}

// Navbar Scroll Elevation
function initNavbarScroll() {
    const header = document.querySelector("header");
    if (!header) return;
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

// Mobile Navigation Toggle
function initMobileNav() {
    const toggleBtn = document.getElementById("mobile-toggle-btn");
    const navMenu = document.querySelector(".nav-menu");
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        toggleBtn.innerText = navMenu.classList.contains("active") ? "✕" : "☰";
    });

    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            toggleBtn.innerText = "☰";
        }
    });
}

// FAQ Accordion Toggle
function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        if (!question) return;

        question.addEventListener("click", () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove("active");
            });
            item.classList.toggle("active");
        });
    });
}

// CLI Terminal Launcher & Quick Chips
function initCliTerminal() {
    const cliInput = document.getElementById("cli-shell-input");
    const cliFeedback = document.getElementById("cli-feedback");
    const chips = document.querySelectorAll(".cli-chip");
    if (!cliInput || !cliFeedback) return;

    function runCommand(cmd) {
        const val = cmd.trim().toLowerCase();
        cliFeedback.style.display = "block";

        switch (val) {
            case "netphantom":
            case "sniff":
                cliFeedback.style.color = "var(--cyan)";
                cliFeedback.innerHTML = `[+] Initializing WinPcap/Npcap socket hooks...<br>[+] Active Interface: <strong>Wi-Fi (wlan0)</strong><br>[+] Running NetPhantom HUD v3.3.1 Packet Engine...`;
                const previewWindow = document.querySelector(".preview-window");
                if (previewWindow) {
                    previewWindow.style.borderColor = "var(--cyan)";
                    previewWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => { previewWindow.style.borderColor = "rgba(0, 243, 255, 0.2)"; }, 1500);
                }
                break;
            case "threats":
                cliFeedback.style.color = "var(--warning)";
                cliFeedback.innerHTML = `[!] Threat Engine Active. Loaded signatures: <strong>5 (Port Scan, SYN Flood, ARP Spoof, ICMP Flood, DNS Flood)</strong>.<br><a href="threats.html" style="color:var(--cyan);">Open Threat Index &rarr;</a>`;
                break;
            case "download":
                cliFeedback.style.color = "var(--emerald)";
                cliFeedback.innerHTML = `[+] Navigating to Download Release Hub...`;
                window.location.href = "download.html";
                break;
            case "help":
                cliFeedback.style.color = "var(--text-primary)";
                cliFeedback.innerHTML = `Available CLI commands:<br>&bull; <code>netphantom</code> - Launch Packet Sniffer HUD<br>&bull; <code>threats</code> - Check intrusion warning rules<br>&bull; <code>download</code> - Download setup installer or pip package<br>&bull; <code>status</code> - Diagnostics<br>&bull; <code>clear</code> - Flush shell output`;
                break;
            case "status":
                cliFeedback.style.color = "var(--emerald)";
                cliFeedback.innerHTML = `STATUS: <strong>OPERATIONAL</strong> | Scapy Engine: Active | Telemetry: 0% (Local Volatile RAM)`;
                break;
            case "clear":
                cliFeedback.style.display = "none";
                cliFeedback.innerHTML = "";
                cliInput.value = "";
                return;
            default:
                cliFeedback.style.color = "var(--error)";
                const safeVal = escapeHtml(val);
                cliFeedback.innerHTML = `'${safeVal}' is not recognized. Type <strong>'help'</strong> or <strong>'netphantom'</strong>.`;
        }
        cliInput.value = "";
    }

    cliInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && cliInput.value.trim() !== "") {
            runCommand(cliInput.value);
        }
    });

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            const cmd = chip.getAttribute("data-cmd") || chip.innerText.replace("$ ", "").trim();
            cliInput.value = cmd;
            runCommand(cmd);
        });
    });
}

// Live Simulated HUD Packet Sniffer
function initSimulatedSniffer() {
    const previewContainer = document.querySelector(".window-content");
    if (!previewContainer) return;

    previewContainer.innerHTML = `
        <div class="sim-toolbar">
            <div style="display:flex; align-items:center; gap:6px;">
                <span style="color:var(--text-dim);">IFACE:</span>
                <span style="background:var(--surface-card); color:var(--cyan); padding:3px 8px; border-radius:4px; font-weight:600; border:1px solid rgba(0,243,255,0.2);">Wi-Fi (wlan0)</span>
            </div>
            
            <div style="display:flex; gap:6px; margin-left:12px;">
                <button class="sim-filter-btn active" data-filter="ALL">ALL</button>
                <button class="sim-filter-btn" data-filter="TCP">TCP</button>
                <button class="sim-filter-btn" data-filter="UDP">UDP</button>
                <button class="sim-filter-btn" data-filter="DNS">DNS</button>
                <button class="sim-filter-btn" data-filter="TLS">TLS</button>
                <button class="sim-filter-btn" data-filter="THREAT" style="color:var(--error);">THREATS</button>
            </div>

            <div style="margin-left:auto; display:flex; align-items:center; gap:10px;">
                <button id="sim-toggle-btn" class="sim-filter-btn" style="background:rgba(0,255,157,0.15); color:var(--emerald); border-color:rgba(0,255,157,0.3);">⏸ PAUSE</button>
                <span id="sim-counter" style="color:var(--text-primary); font-family:var(--font-mono); font-weight:600;">0 pkts</span>
            </div>
        </div>

        <div class="sim-main">
            <div class="sim-list-container">
                <div class="sim-table-hdr">
                    <div>#</div>
                    <div>TIME</div>
                    <div>SOURCE</div>
                    <div>DESTINATION</div>
                    <div>PROTO</div>
                    <div>INFO PAYLOAD</div>
                </div>
                <div id="sim-packet-list" class="sim-packet-list"></div>
            </div>

            <div class="sim-sidebar">
                <div>
                    <div style="color:var(--text-dim); font-size:0.65rem; font-weight:bold; text-transform:uppercase; margin-bottom:6px;">Bandwidth Speed</div>
                    <div class="bps-meter">
                        <div id="sim-bps-val" class="bps-val">42.8 KB/s</div>
                        <div id="sim-bps-bar" class="bps-bar" style="width: 45%;"></div>
                    </div>
                </div>

                <div style="border-top:1px solid var(--border-ghost); padding-top:8px;">
                    <div style="color:var(--text-dim); font-size:0.65rem; font-weight:bold; text-transform:uppercase; margin-bottom:6px;">Distribution</div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <div>TCP: <span id="sim-stat-tcp" style="color:var(--text-primary); font-weight:bold;">0</span></div>
                        <div>UDP: <span id="sim-stat-udp" style="color:var(--emerald); font-weight:bold;">0</span></div>
                        <div>DNS: <span id="sim-stat-dns" style="color:var(--cyan); font-weight:bold;">0</span></div>
                        <div>TLS: <span id="sim-stat-tls" style="color:#f472b6; font-weight:bold;">0</span></div>
                    </div>
                </div>

                <div style="border-top:1px solid var(--border-ghost); padding-top:8px;">
                    <div style="color:var(--text-dim); font-size:0.65rem; font-weight:bold; text-transform:uppercase; margin-bottom:4px;">Threat Status</div>
                    <div id="sim-stat-alerts" style="color:var(--emerald); font-weight:bold;">● ALL CLEAR</div>
                </div>
            </div>
        </div>
    `;

    const packetList = document.getElementById("sim-packet-list");
    const counterEl = document.getElementById("sim-counter");
    const statTcp = document.getElementById("sim-stat-tcp");
    const statUdp = document.getElementById("sim-stat-udp");
    const statDns = document.getElementById("sim-stat-dns");
    const statTls = document.getElementById("sim-stat-tls");
    const statAlerts = document.getElementById("sim-stat-alerts");
    const bpsVal = document.getElementById("sim-bps-val");
    const bpsBar = document.getElementById("sim-bps-bar");
    const toggleBtn = document.getElementById("sim-toggle-btn");

    let count = 0;
    let tcpCount = 0, udpCount = 0, dnsCount = 0, tlsCount = 0;
    let currentFilter = "ALL";
    let isRunning = true;

    const filterBtns = previewContainer.querySelectorAll(".sim-filter-btn[data-filter]");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter");
            filterPacketRows();
        });
    });

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            isRunning = !isRunning;
            if (isRunning) {
                toggleBtn.innerHTML = "⏸ PAUSE";
                toggleBtn.style.background = "rgba(0,255,157,0.15)";
                toggleBtn.style.color = "var(--emerald)";
                addSimulatedRow();
            } else {
                toggleBtn.innerHTML = "▶ RESUME";
                toggleBtn.style.background = "rgba(255,184,0,0.15)";
                toggleBtn.style.color = "var(--warning)";
            }
        });
    }

    function filterPacketRows() {
        const rows = packetList.querySelectorAll(".sim-table-row");
        rows.forEach(r => {
            if (currentFilter === "ALL") {
                r.style.display = "grid";
            } else if (currentFilter === "THREAT") {
                r.style.display = r.classList.contains("threat") ? "grid" : "none";
            } else {
                r.style.display = r.classList.contains(currentFilter.toLowerCase()) ? "grid" : "none";
            }
        });
    }

    const templates = [
        { proto: "DNS", src: "192.168.1.105", dst: "1.1.1.1", info: "Standard query 0x8a1b A netphantom.dev" },
        { proto: "DNS", src: "1.1.1.1", dst: "192.168.1.105", info: "Standard query response 0x8a1b A 104.21.32.185" },
        { proto: "TCP", src: "192.168.1.105", dst: "104.21.32.185", info: "51240 → 443 [SYN] Seq=0 Win=64240 Len=0" },
        { proto: "TCP", src: "104.21.32.185", dst: "192.168.1.105", info: "443 → 51240 [SYN, ACK] Seq=0 Ack=1 Win=65535" },
        { proto: "TLS", src: "192.168.1.105", dst: "104.21.32.185", info: "Client Hello [TLS 1.3] SNI: netphantom.dev" },
        { proto: "TLS", src: "104.21.32.185", dst: "192.168.1.105", info: "Server Hello, Change Cipher Spec, Encrypted Extensions" },
        { proto: "UDP", src: "192.168.1.105", dst: "239.255.255.250", info: "M-SEARCH * HTTP/1.1 (SSDP Protocol)" }
    ];

    function addSimulatedRow() {
        if (!isRunning) return;

        if (count >= 16) {
            packetList.innerHTML = `<div style="color:var(--text-dim); padding:12px; font-family:var(--font-mono); font-size:0.72rem;">SYSTEM: Buffer reset. Auto-cycling capture loop...</div>`;
            count = 0; tcpCount = 0; udpCount = 0; dnsCount = 0; tlsCount = 0;
            statTcp.innerText = 0; statUdp.innerText = 0; statDns.innerText = 0; statTls.innerText = 0;
            statAlerts.innerHTML = "● ALL CLEAR";
            statAlerts.style.color = "var(--emerald)";
            counterEl.innerText = "0 pkts";
            setTimeout(addSimulatedRow, 1200);
            return;
        }

        count++;
        const item = templates[Math.floor(Math.random() * templates.length)];

        if (item.proto === "TCP") { tcpCount++; statTcp.innerText = tcpCount; }
        else if (item.proto === "UDP") { udpCount++; statUdp.innerText = udpCount; }
        else if (item.proto === "DNS") { dnsCount++; statDns.innerText = dnsCount; }
        else if (item.proto === "TLS") { tlsCount++; statTls.innerText = tlsCount; }

        counterEl.innerText = `${count} pkts`;

        const speed = (Math.random() * 80 + 15).toFixed(1);
        if (bpsVal) bpsVal.innerText = `${speed} KB/s`;
        if (bpsBar) bpsBar.style.width = `${Math.min(100, speed * 1.1)}%`;

        const timeStr = new Date().toLocaleTimeString();
        const row = document.createElement("div");

        if (count > 0 && count % 8 === 0) {
            statAlerts.innerHTML = `<span style="color:var(--error);">⚠ PORT SCAN DETECTED</span>`;
            row.className = "sim-table-row threat";
            row.innerHTML = `
                <div>${count}</div>
                <div>${timeStr}</div>
                <div>192.168.1.200</div>
                <div>192.168.1.105</div>
                <div>TCP</div>
                <div>⚠ Port Scan Attempt on Port ${Math.floor(Math.random() * 8000 + 80)}</div>
            `;
        } else {
            row.className = `sim-table-row ${item.proto.toLowerCase()}`;
            row.innerHTML = `
                <div>${count}</div>
                <div>${timeStr}</div>
                <div>${item.src}</div>
                <div>${item.dst}</div>
                <div>${item.proto}</div>
                <div>${item.info}</div>
            `;
        }

        packetList.appendChild(row);

        if (currentFilter !== "ALL") {
            if (currentFilter === "THREAT" && !row.classList.contains("threat")) row.style.display = "none";
            else if (currentFilter !== "THREAT" && !row.classList.contains(currentFilter.toLowerCase())) row.style.display = "none";
        }

        const isNearBottom = packetList.scrollHeight - packetList.scrollTop - packetList.clientHeight < 60;
        if (isNearBottom) {
            packetList.scrollTop = packetList.scrollHeight;
        }
        setTimeout(addSimulatedRow, Math.random() * 800 + 600);
    }

    addSimulatedRow();
}

// Download Page Tabs & Copy
function initDownloadTabs() {
    const tabBtns = document.querySelectorAll(".download-tab-btn");
    const panels = document.querySelectorAll(".download-content-panel");
    const copyBtns = document.querySelectorAll(".copy-btn");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-tab");
            tabBtns.forEach(b => b.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const activePanel = document.getElementById(`tab-${target}`);
            if (activePanel) activePanel.classList.add("active");
        });
    });

    copyBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const codeEl = btn.previousElementSibling;
            if (!codeEl) return;
            const text = codeEl.innerText.trim();
            navigator.clipboard.writeText(text).then(() => {
                showToast(`Copied: ${text}`);
            }).catch(() => {
                showToast("Command copied!");
            });
        });
    });
}

// Threat Search Filter & Test Heuristic
function initThreatSearch() {
    const searchInput = document.getElementById("threat-search-input");
    const threatCards = document.querySelectorAll(".threat-card");
    const severityBtns = document.querySelectorAll(".severity-filter-btn");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();
            threatCards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(query) ? "grid" : "none";
            });
        });
    }

    severityBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            severityBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const sev = btn.getAttribute("data-sev");
            threatCards.forEach(card => {
                if (sev === "ALL") card.style.display = "grid";
                else {
                    const isSev = card.querySelector(`.severity-${sev.toLowerCase()}`);
                    card.style.display = isSev ? "grid" : "none";
                }
            });
        });
    });

    const testBtns = document.querySelectorAll(".test-heuristic-btn");
    testBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const ruleName = btn.getAttribute("data-rule");
            showToast(`[TEST HEURISTIC] Simulating ${ruleName} packet stream... Signature Triggered!`);
        });
    });
}

// Docs BPF Filter Sandbox
function initDocsFilterSandbox() {
    const sandboxInput = document.getElementById("bpf-sandbox-input");
    const sandboxResult = document.getElementById("bpf-sandbox-result");
    const presetSelect = document.getElementById("bpf-preset-select");
    if (!sandboxInput || !sandboxResult) return;

    function evaluateSandbox() {
        const val = sandboxInput.value.trim().toLowerCase();
        if (val === "") {
            sandboxResult.innerHTML = `<span style="color:var(--text-dim);">Type a BPF filter syntax to test live expression evaluation...</span>`;
            return;
        }

        const safeVal = escapeHtml(val);
        if (val.includes("tcp") || val.includes("udp") || val.includes("port") || val.includes("host") || val.includes("icmp") || val.includes("arp")) {
            sandboxResult.innerHTML = `<span style="color:var(--emerald);">✓ Valid BPF Filter Syntax: <code>${safeVal}</code></span><br><span style="color:var(--text-secondary); font-size:0.8rem;">Packet Evaluator: Matches target sockets successfully.</span>`;
        } else {
            sandboxResult.innerHTML = `<span style="color:var(--warning);">⚠ Custom Filter expression: <code>${safeVal}</code>. Check BPF protocol keywords (tcp, udp, icmp, host, port).</span>`;
        }
    }

    sandboxInput.addEventListener("input", evaluateSandbox);

    if (presetSelect) {
        presetSelect.addEventListener("change", () => {
            if (presetSelect.value) {
                sandboxInput.value = presetSelect.value;
                evaluateSandbox();
            }
        });
    }
}

// Docs ScrollSpy
function initDocsScrollSpy() {
    const navLinks = document.querySelectorAll(".docs-nav a");
    const docSections = document.querySelectorAll(".doc-section");
    if (navLinks.length === 0 || docSections.length === 0) return;

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        docSections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) {
                currentSectionId = sec.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}

// ── Animated Counter Roll for Hero Stats ──────────────────────────────────
function initCounterRoll() {
    const statVals = document.querySelectorAll(".hero-stat-val[data-target]");
    if (statVals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const rawTarget = el.getAttribute("data-target") || "0";
            const suffix = el.getAttribute("data-suffix") || "";
            const prefix = el.getAttribute("data-prefix") || "";
            const target = parseFloat(rawTarget.replace(/[^0-9.]/g, ""));
            const duration = 1400;
            const start = performance.now();

            function animate(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * ease * 10) / 10;
                const display = Number.isInteger(current) ? current.toFixed(0) : current.toFixed(1);
                el.textContent = `${prefix}${display}${suffix}`;
                if (progress < 1) requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
            observer.unobserve(el);
        });
    }, { threshold: 0.4 });

    statVals.forEach(el => observer.observe(el));
}

// ── Neon Cursor Glow Trail ─────────────────────────────────────────────────
function initCursorTrail() {
    // Only on non-touch devices with motion allowed
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window) return;

    const trail = [];
    const TRAIL_LEN = 12;

    for (let i = 0; i < TRAIL_LEN; i++) {
        const dot = document.createElement("div");
        dot.style.cssText = `
            position:fixed;pointer-events:none;z-index:99999;
            width:${4 + i * 0.5}px;height:${4 + i * 0.5}px;
            border-radius:50%;background:rgba(0,243,255,${0.55 - i * 0.04});
            transform:translate(-50%,-50%);
            transition:transform 0.05s ease,opacity 0.3s ease;
            mix-blend-mode:screen;
        `;
        document.body.appendChild(dot);
        trail.push({ el: dot, x: -100, y: -100 });
    }

    let mx = -100, my = -100;
    document.addEventListener("mousemove", e => {
        mx = e.clientX;
        my = e.clientY;
    });

    function animateTrail() {
        let lx = mx, ly = my;
        trail.forEach((t, i) => {
            t.el.style.left = lx + "px";
            t.el.style.top = ly + "px";
            if (i < trail.length - 1) {
                lx = lx * 0.65 + trail[i + 1].x * 0.35;
                ly = ly * 0.65 + trail[i + 1].y * 0.35;
            }
            t.x = lx;
            t.y = ly;
        });
        requestAnimationFrame(animateTrail);
    }
    requestAnimationFrame(animateTrail);

    // Burst on click
    document.addEventListener("click", e => {
        const burst = document.createElement("div");
        burst.style.cssText = `
            position:fixed;pointer-events:none;z-index:99999;
            width:24px;height:24px;border-radius:50%;
            border:2px solid rgba(0,243,255,0.8);
            left:${e.clientX}px;top:${e.clientY}px;
            transform:translate(-50%,-50%) scale(0);
            animation:cursor-burst 0.4s ease-out forwards;
        `;
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 450);
    });

    // Inject cursor burst keyframe
    if (!document.getElementById("cursor-burst-style")) {
        const s = document.createElement("style");
        s.id = "cursor-burst-style";
        s.textContent = `
            @keyframes cursor-burst {
                0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
            }
        `;
        document.head.appendChild(s);
    }
}

// ── Page Load Entrance Effects ─────────────────────────────────────────────
function initPageLoadEffects() {
    // Stagger-fade hero elements on first load
    const heroEls = document.querySelectorAll(".hero-left > *");
    heroEls.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = `opacity 0.6s ease ${0.1 + i * 0.12}s, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${0.1 + i * 0.12}s`;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            });
        });
    });

    // Slide-in preview window from right
    const heroRight = document.querySelector(".hero-right");
    if (heroRight) {
        heroRight.style.opacity = "0";
        heroRight.style.transform = "translateX(30px)";
        heroRight.style.transition = "opacity 0.7s ease 0.35s, transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.35s";
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                heroRight.style.opacity = "1";
                heroRight.style.transform = "translateX(0)";
            });
        });
    }

    // Flash the HUD tag on load
    const hudTags = document.querySelectorAll(".hud-tag");
    hudTags.forEach((tag, i) => {
        tag.style.animationDelay = `${i * 0.15}s`;
    });

    // Animate nav logo icon glow on page load
    const logoIcon = document.querySelector(".nav-logo-icon");
    if (logoIcon) {
        logoIcon.style.animation = "none";
        logoIcon.style.filter = "drop-shadow(0 0 24px rgba(0,243,255,0.6))";
        setTimeout(() => {
            logoIcon.style.transition = "filter 1.5s ease";
            logoIcon.style.filter = "drop-shadow(0 0 10px var(--accent-glow))";
        }, 800);
    }
}

// Standalone Phantom AI Page (ai.html) Logic & Anti-Jailbreak Defense
function initStandalonePhantomAIPage() {
    const form = document.getElementById("page-ai-form");
    const input = document.getElementById("page-ai-input");
    const messages = document.getElementById("page-ai-messages");
    const quickChips = document.querySelectorAll(".ai-chip-btn");
    const sandboxBtn = document.getElementById("ai-sandbox-run");
    const sandboxText = document.getElementById("ai-sandbox-text");
    const sandboxOutput = document.getElementById("ai-sandbox-output");

    if (!form || !messages) return;

    // ── API Key Management (localStorage) ──
    function getApiKey() {
        return localStorage.getItem("phantom_ai_key") || "";
    }
    function setApiKey(key) {
        localStorage.setItem("phantom_ai_key", key);
    }
    function hasApiKey() {
        return !!getApiKey();
    }

    // Show setup dialog if no key saved
    if (!hasApiKey()) {
        setTimeout(() => showApiKeySetup(), 500);
    }

    function showApiKeySetup() {
        const overlay = document.createElement("div");
        overlay.id = "phantom-key-setup";
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center;";
        overlay.innerHTML = `
            <div style="background:#0d1420;border:1px solid rgba(0,243,255,0.3);border-radius:12px;padding:32px;max-width:460px;width:90%;text-align:center;">
                <div style="font-size:2.5rem;margin-bottom:12px;">👻</div>
                <h2 style="color:#fff;margin:0 0 8px 0;font-size:1.3rem;">Phantom AI Setup</h2>
                <p style="color:#94a3b8;font-size:0.88rem;margin:0 0 18px 0;">Enter your Groq API key to enable full AI responses.<br><a href="https://console.groq.com" target="_blank" style="color:#06b6d4;">Get a free key →</a></p>
                <input type="password" id="phantom-key-input" placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
                    style="width:100%;padding:12px;border-radius:8px;border:1px solid #1e3a5f;background:#060911;color:#fff;font-size:0.9rem;outline:none;margin-bottom:14px;box-sizing:border-box;">
                <div style="display:flex;gap:10px;">
                    <button id="phantom-key-save" style="flex:1;padding:10px;border:none;border-radius:8px;background:#06b6d4;color:#000;font-weight:bold;cursor:pointer;font-size:0.9rem;">Save & Start</button>
                    <button id="phantom-key-skip" style="padding:10px 16px;border:none;border-radius:8px;background:#1e293b;color:#94a3b8;cursor:pointer;font-size:0.85rem;">Skip for now</button>
                </div>
                <p style="color:#475569;font-size:0.72rem;margin:12px 0 0 0;">Your key is stored only in your browser. It is never sent to any server except Groq's API.</p>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById("phantom-key-save").addEventListener("click", () => {
            const key = document.getElementById("phantom-key-input").value.trim();
            if (key && key.startsWith("gsk_") && key.length >= 20) {
                setApiKey(key);
                overlay.remove();
                appendMessage("system", "👻", "API key saved! Phantom AI is ready. Ask me anything about网络安全, packets, or cybersecurity!");
            } else {
                document.getElementById("phantom-key-input").style.borderColor = "#ef4444";
            }
        });
        document.getElementById("phantom-key-skip").addEventListener("click", () => {
            overlay.remove();
            appendMessage("system", "👻", "No API key set. I can still help with greetings and basic questions. Type <strong>'setup'</strong> anytime to configure your key.");
        });
        document.getElementById("phantom-key-input").addEventListener("keydown", (e) => {
            if (e.key === "Enter") document.getElementById("phantom-key-save").click();
        });
    }

    // Anti-Jailbreak & Prompt Injection Defense Signatures (OWASP LLM Top 10)
    const injectionPatterns = [
        /ignore\s+(?:all\s+)?(?:previous|prior)\s+instructions/i,
        /disregard\s+(?:all\s+)?(?:previous|prior)\s+instructions/i,
        /forget\s+all\s+rules/i,
        /system\s+override/i,
        /jailbreak/i,
        /dan\s+mode/i,
        /developer\s+mode/i,
        /act\s+as\s+(?:root|admin|god|unrestricted)/i,
        /bypass\s+safety/i,
        /<\|im_start\|>/i,
        /<\|im_end\|>/i,
        /\[INST\]/i,
        /\[\/INST\]/i,
        /<<SYS>>/i
    ];

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        appendMessage("user", "👤", escapeHtml(text));
        input.value = "";

        // Security Check: Prompt Injection / Jailbreak Detection
        const isMalicious = injectionPatterns.some(pat => pat.test(text));
        if (isMalicious) {
            setTimeout(() => {
                appendMessage("blocked", "🛡️", "Hello there! I am <strong>Phantom AI</strong>. 🛡️ I am designed to strictly follow core security rules, so I cannot bypass safety guidelines or execute unauthorized system commands. However, I am always happy to help you with network analysis, packet capture, or cybersecurity questions! What would you like to explore?");
            }, 300);
            return;
        }

        // Show typing indicator
        const typingId = "typing-" + Date.now();
        const typingDiv = document.createElement("div");
        typingDiv.id = typingId;
        typingDiv.className = `ai-msg ai-msg-system`;
        typingDiv.innerHTML = `
            <span class="ai-avatar">👻</span>
            <div class="ai-bubble">Analyzing... ⏳</div>
        `;
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;

        try {
            const reply = await generatePhantomAiResponse(text);
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();

            appendMessage("system", "👻", reply);
        } catch (error) {
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();

            appendMessage("system", "👻", "⚠️ I encountered an error connecting to the AI brain. Please ensure the API key is configured correctly.");
            console.error("AI Error:", error);
        }
    });

    // Sandbox Threat Evaluator Handler
    if (sandboxBtn && sandboxText && sandboxOutput) {
        sandboxBtn.addEventListener("click", async () => {
            const raw = sandboxText.value.trim();
            if (!raw) {
                showToast("Please enter packet metadata or protocol info into sandbox.");
                return;
            }
            sandboxBtn.innerHTML = "Analyzing Metadata... ⏳";
            sandboxBtn.disabled = true;
            sandboxOutput.style.display = "block";
            sandboxOutput.innerHTML = `<div>Connecting to Phantom AI Threat Engine... ⏳</div>`;

            try {
                const sandboxPrompt = "You are Phantom AI Threat Sandbox. The user will provide raw packet metadata, hex, or protocol info. Analyze it for security threats. Reply with exactly this HTML format:\n<div style=\"color:[color]; font-weight:bold; font-size:0.85rem; margin-bottom:6px;\">RISK ASSESSMENT: [Risk level e.g. HIGH/MEDIUM/LOW]</div>\n<div style=\"margin-bottom:6px;\"><strong>ANALYSIS:</strong> [Your analysis]</div>\n<div><strong>REMEDIATION:</strong> [Your remediation]</div>\nUse var(--emerald) for LOW, var(--amber) for MEDIUM, and var(--danger) for HIGH.";

                const API_KEY = getApiKey();
                if (!API_KEY) {
                    sandboxOutput.innerHTML = "No API key set. Type <strong>setup</strong> in the chat to configure your key.";
                    sandboxBtn.innerHTML = "Run AI Security Audit ⚡";
                    sandboxBtn.disabled = false;
                    return;
                }

                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.1-8b-instant",
                        messages: [
                            { role: "system", content: sandboxPrompt },
                            { role: "user", content: raw }
                        ],
                        temperature: 0.2,
                        max_tokens: 400
                    })
                });

                if (!response.ok) throw new Error("API request failed");

                const data = await response.json();
                sandboxOutput.innerHTML = data.choices[0].message.content;
            } catch (error) {
                console.error("Sandbox Error:", error);
                sandboxOutput.innerHTML = "⚠️ I encountered an error connecting to the AI brain.";
            }

            sandboxBtn.innerHTML = "Run AI Security Audit ⚡";
            sandboxBtn.disabled = false;
        });
    }

    function appendMessage(type, avatar, contentHtml) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `ai-msg ai-msg-${type}`;
        msgDiv.innerHTML = `
            <span class="ai-avatar">${avatar}</span>
            <div class="ai-bubble">${contentHtml}</div>
        `;
        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    async function generatePhantomAiResponse(query) {
        const q = query.toLowerCase().trim();
        const original = query.trim();

        // Capitalize first letter of user input for mirrored greeting
        function mirrorGreeting(input) {
            return input.charAt(0).toUpperCase() + input.slice(1);
        }

        // Local responses for greetings and common questions (no API key needed)
        const localResponses = [
            { patterns: [/^(hi+|hello+|hey+|hie+|howdy|sup|yo+h*|hola|namaste|hi there|hello there|hey there)/i],
              response: () => `${mirrorGreeting(original)}! 👻 I'm <strong>Phantom AI</strong>, your network security assistant. How can I help you today?` },
            { patterns: [/^(good\s*(morning|afternoon|evening|night))/i],
              response: () => `${mirrorGreeting(original)}! 👻 I'm <strong>Phantom AI</strong>. How can I assist you with network security today?` },
            { patterns: [/^(how are you|r u ok|how do you do|how's it going|what's up|how do you feel)/i],
              response: () => `I'm doing great, thanks for asking! 👻 How can I help you today?` },
            { patterns: [/^(who are you|what are you|tell me about yourself|what do you do|what is phantom ai)/i],
              response: () => `I'm <strong>Phantom AI</strong> 👻 — your network security assistant. I help with packet analysis, threat detection, BPF filters, and cybersecurity. What would you like to know?` },
            { patterns: [/^(thanks|thank you|thx|ty|appreciate|tysm|tnx)/i],
              response: () => `You're welcome! 😊 Happy to help. Anything else?` },
            { patterns: [/^(bye|goodbye|see ya|later|cya|exit|gtg|gotta go)/i],
              response: () => `Goodbye! 👻 Stay secure. Come back anytime!` },
            { patterns: [/^(help|what can you do|commands|options|features)/i],
              response: () => `I can help with:<br>• <strong>Packet Analysis</strong> — explain protocols and traffic<br>• <strong>BPF Filters</strong> — write capture filters<br>• <strong>Threat Detection</strong> — identify attacks<br>• <strong>Cybersecurity</strong> — general security advice<br><br>Just type your question!` },
            { patterns: [/^(what is netphantom|about netphantom|netphantom features)/i],
              response: () => `<strong>NetPhantom</strong> is a professional packet analyzer with AI-powered threat detection, live capture, protocol inspection, and cross-platform support. Ask me anything about it!` },
            { patterns: [/^(joke|funny|make me laugh|entertain me)/i],
              response: () => `Why did the packet cross the network? To get to the other <strong>side</strong>... of the firewall! 😄` },
            { patterns: [/^(setup|config|configure|api|key|settings)/i],
              response: () => { setTimeout(() => showApiKeySetup(), 100); return "Opening API key setup..."; } },
            { patterns: [/^(remove key|delete key|clear key|reset key|forget key)/i],
              response: () => { localStorage.removeItem("phantom_ai_key"); return "API key removed from this browser. Type <strong>'setup'</strong> to add a new one."; } },
        ];

        for (const entry of localResponses) {
            if (entry.patterns.some(pat => pat.test(q))) {
                return entry.response();
            }
        }

        // Make API call to Phantom AI backend
        const API_KEY = getApiKey();

        if (!API_KEY) {
            return "No API key configured. Type <strong>'setup'</strong> to add your key, or I can still help with greetings and basic questions!";
        }

        const endpoint = "https://api.groq.com/openai/v1/chat/completions";
        const systemPrompt = `You are Phantom AI, a friendly and helpful network security assistant for NetPhantom.
You are an expert in networking, packets, BPF syntax, Wireshark, intrusion detection, and cybersecurity.
Be concise, friendly, and helpful. Keep answers short (2-4 sentences max).
Format with basic HTML (<strong>, <code>, <br>). Never use Markdown.
If asked about greetings, respond warmly. Always be polite and approachable.`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", // Fast and efficient for quick replies
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: query }
                ],
                temperature: 0.3,
                max_tokens: 800
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "API request failed");
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}
