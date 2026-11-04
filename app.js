/* =====================================================================
   INTERN — application logic
   Public site + four role dashboards. Hash routed, no dependencies.
   ===================================================================== */

/* ---------------- data ---------------- */
const ORGS = [
  {id:"o1", name:"Ministry of ICT and National Guidance", type:"Government", sector:"Public sector", loc:"Kampala", seal:"MIC",
   about:"National ministry responsible for digital government services, ICT policy and public-sector innovation."},
  {id:"o2", name:"National Information Technology Authority", type:"Government", sector:"Public sector", loc:"Kampala", seal:"NITA",
   about:"Statutory body delivering national ICT infrastructure, e-government systems and digital skills programmes."},
  {id:"o3", name:"Kampala Capital City Authority", type:"Government", sector:"Public services", loc:"Kampala", seal:"KCCA",
   about:"City authority responsible for urban planning, transport, sanitation and municipal digital services."},
  {id:"o4", name:"Lumen Labs", type:"Company", sector:"Design & software", loc:"Remote, Europe", seal:"LL",
   about:"Product studio building design tooling used by 40,000 teams. Small, senior team, ships weekly."},
  {id:"o5", name:"Northwind", type:"Company", sector:"Financial technology", loc:"Berlin, hybrid", seal:"NW",
   about:"Payments infrastructure for small merchants across East Africa and Europe."},
  {id:"o6", name:"Atlas Health", type:"Company", sector:"Health", loc:"Nairobi", seal:"AH",
   about:"Primary-care network digitising patient records across 120 clinics."},
  {id:"o7", name:"Kite Mobility", type:"Company", sector:"Transport", loc:"Kampala", seal:"KM",
   about:"Route planning and fare payments for minibus operators."},
  {id:"o8", name:"Twaweza Foundation", type:"NGO", sector:"Civic research", loc:"Dar es Salaam", seal:"TW",
   about:"Research and advocacy on public service delivery in East Africa."},
  {id:"o9", name:"Brac Uganda", type:"NGO", sector:"Development", loc:"Kampala", seal:"BU",
   about:"Development organisation working on livelihoods, education and financial inclusion."},
  {id:"o10", name:"Makerere University — School of Computing", type:"University", sector:"Research", loc:"Kampala", seal:"MU",
   about:"Research group on human-computer interaction and public-interest technology."},
  {id:"o11", name:"Meridian Bank", type:"Company", sector:"Financial services", loc:"London", seal:"MB",
   about:"Mid-sized UK bank with a structured internship pipeline into risk and analytics."},
  {id:"o12", name:"Orbital AI", type:"Company", sector:"Software", loc:"Remote", seal:"OA",
   about:"Distributed product team building analysis tools for research institutions."},
  {id:"o13", name:"Fieldnote", type:"NGO", sector:"Research", loc:"Remote", seal:"FN",
   about:"Research collective studying work, health and public services."}
];

const COURSES = ["Computer Science","Information Technology","Design","Economics","Public Health","Law","Engineering","Statistics","Mass Communication","Business"];

const PLACEMENTS = [
  {id:"p1", title:"Product Design Intern", orgId:"o4", courses:["Design","Computer Science"], grade:"CGPA 3.0+",
   country:"Netherlands", region:"Europe", loc:"Amsterdam, hybrid", mode:"Hybrid", duration:"12 weeks",
   stipendLocal:"€2,200 / month", usd:2390, currency:"EUR", visa:"sponsorship", deadline:"12 Mar 2026", slots:4, status:"Open", applicants:41,
   docs:["Transcript","Student ID","Portfolio"], testimonial:true,
   about:"You will own one workstream from brief to handover, review weekly with a named mentor and present at the end-of-term critique.",
   duties:["Own one end-to-end product workstream","Join weekly critiques and ship to production","Present at the end-of-term review"]},
  {id:"p2", title:"Data Analyst Intern", orgId:"o2", courses:["Statistics","Computer Science","Economics"], grade:"Second Class Upper",
   country:"Uganda", region:"East Africa", loc:"Kampala, on-site", mode:"On-site", duration:"6 months",
   stipendLocal:"UGX 1,200,000 / month", usd:320, currency:"UGX", visa:"right-to-work", deadline:"28 Feb 2026", slots:6, status:"Open", applicants:87,
   docs:["Transcript","National ID","Recommendation letter"], testimonial:true,
   about:"Placement within the national data office, supporting dashboards used by ministries and district offices.",
   duties:["Maintain national indicator dashboards","Clean and reconcile district datasets","Prepare monthly briefings"]},
  {id:"p3", title:"Software Engineering Intern", orgId:"o5", courses:["Computer Science","Information Technology","Engineering"], grade:"CGPA 3.4+",
   country:"Germany", region:"Europe", loc:"Berlin, hybrid", mode:"Hybrid", duration:"6 months",
   stipendLocal:"€1,900 / month", usd:2065, currency:"EUR", visa:"sponsorship", deadline:"09 Mar 2026", slots:3, status:"Open", applicants:120,
   docs:["Transcript","CV","Portfolio"], testimonial:false,
   about:"Payments engineering team. You will work on merchant onboarding flows and internal tooling.",
   duties:["Ship features in a two-week cycle","Write tests for onboarding flows","Join incident reviews"]},
  {id:"p4", title:"Health Records Intern", orgId:"o6", courses:["Public Health","Statistics","Information Technology"], grade:"Second Class Lower",
   country:"Kenya", region:"East Africa", loc:"Nairobi, on-site", mode:"On-site", duration:"4 months",
   stipendLocal:"KSh 75,000 / month", usd:580, currency:"KES", visa:"right-to-work", deadline:"21 Feb 2026", slots:8, status:"Closing", applicants:64,
   docs:["Transcript","Student ID","Immunisation card"], testimonial:true,
   about:"Support the digitisation of patient records across a 120-clinic network.",
   duties:["Digitise and validate patient files","Flag incomplete records","Support clinic audits"]},
  {id:"p5", title:"Frontend Intern", orgId:"o7", courses:["Computer Science","Design","Information Technology"], grade:"CGPA 3.0+",
   country:"Uganda", region:"East Africa", loc:"Kampala, hybrid", mode:"Hybrid", duration:"6 months",
   stipendLocal:"UGX 900,000 / month", usd:240, currency:"UGX", visa:"right-to-work", deadline:"05 Mar 2026", slots:2, status:"Open", applicants:33,
   docs:["Transcript","Portfolio"], testimonial:false,
   about:"Build the passenger-facing experience for route planning and fare payment.",
   duties:["Build accessible booking flows","Improve offline behaviour","Test with conductors in the field"]},
  {id:"p6", title:"Policy Research Assistant", orgId:"o1", courses:["Law","Economics","Mass Communication"], grade:"Second Class Upper",
   country:"Uganda", region:"East Africa", loc:"Kampala, on-site", mode:"On-site", duration:"5 months",
   stipendLocal:"UGX 1,000,000 / month", usd:267, currency:"UGX", visa:"right-to-work", deadline:"18 Mar 2026", slots:5, status:"Open", applicants:52,
   docs:["Transcript","Recommendation letter","Writing sample"], testimonial:true,
   about:"Support the ICT policy unit with comparative research, briefings and stakeholder mapping.",
   duties:["Draft policy briefs","Map stakeholder positions","Support consultation workshops"]},
  {id:"p7", title:"Civic Data Intern", orgId:"o8", courses:["Statistics","Economics","Public Health"], grade:"CGPA 3.0+",
   country:"Tanzania", region:"East Africa", loc:"Dar es Salaam, hybrid", mode:"Hybrid", duration:"3 months",
   stipendLocal:"TZS 700,000 / month", usd:270, currency:"TZS", visa:"right-to-work", deadline:"02 Apr 2026", slots:4, status:"Open", applicants:29,
   docs:["Transcript","Student ID","Writing sample"], testimonial:false,
   about:"Work with the survey team on public service delivery data used in national advocacy.",
   duties:["Clean survey data","Produce district summaries","Support field enumerators"]},
  {id:"p8", title:"Urban Planning Intern", orgId:"o3", courses:["Engineering","Economics","Design"], grade:"Second Class Lower",
   country:"Uganda", region:"East Africa", loc:"Kampala, on-site", mode:"On-site", duration:"6 months",
   stipendLocal:"UGX 850,000 / month", usd:227, currency:"UGX", visa:"right-to-work", deadline:"25 Feb 2026", slots:3, status:"Closing", applicants:47,
   docs:["Transcript","Student ID","Recommendation letter"], testimonial:true,
   about:"Support the planning directorate on transport corridors and market redevelopment.",
   duties:["Survey corridor usage","Draft planning notes","Support community consultations"]},
  {id:"p9", title:"Development Programmes Intern", orgId:"o9", courses:["Business","Economics","Public Health"], grade:"Second Class Lower",
   country:"Uganda", region:"East Africa", loc:"Kampala, on-site", mode:"On-site", duration:"4 months",
   stipendLocal:"UGX 750,000 / month", usd:200, currency:"UGX", visa:"right-to-work", deadline:"30 Mar 2026", slots:7, status:"Open", applicants:71,
   docs:["Transcript","National ID","Recommendation letter"], testimonial:true,
   about:"Support field programme delivery and monitoring across three districts.",
   duties:["Support monitoring visits","Maintain programme records","Draft field notes"]},
  {id:"p10", title:"HCI Research Assistant", orgId:"o10", courses:["Computer Science","Design","Statistics"], grade:"CGPA 3.6+",
   country:"Uganda", region:"East Africa", loc:"Kampala, on-site", mode:"On-site", duration:"10 weeks",
   stipendLocal:"UGX 700,000 / month", usd:187, currency:"UGX", visa:"right-to-work", deadline:"15 Mar 2026", slots:2, status:"Open", applicants:18,
   docs:["Transcript","Recommendation letter","Writing sample"], testimonial:true,
   about:"Join a research group studying public-interest technology in Kampala.",
   duties:["Run interview studies","Code and synthesise transcripts","Co-author a short paper"]},
  {id:"p11", title:"Brand Design Intern", orgId:"o4", courses:["Design","Mass Communication"], grade:"CGPA 3.0+",
   country:"Global", region:"Remote", loc:"Remote, worldwide", mode:"Remote", duration:"8 weeks",
   stipendLocal:"$1,200 / month", usd:1200, currency:"USD", visa:"remote", deadline:"20 Apr 2026", slots:2, status:"Open", applicants:26,
   docs:["Portfolio","CV"], testimonial:false,
   about:"Identity and campaign design for a studio launch, delivered remotely across three time zones.",
   duties:["Build identity variants","Produce campaign assets","Document the system"]},
  {id:"p12", title:"Risk Analyst Intern", orgId:"o11", courses:["Economics","Statistics","Business"], grade:"Second Class Upper",
   country:"United Kingdom", region:"Europe", loc:"London, on-site", mode:"On-site", duration:"3 months",
   stipendLocal:"£2,100 / month", usd:2660, currency:"GBP", visa:"sponsorship", deadline:"05 Mar 2026", slots:2, status:"Open", applicants:96,
   docs:["Transcript","CV","Right-to-work evidence"], testimonial:false,
   about:"Risk modelling for a mid-sized bank, working alongside the credit analytics team.",
   duties:["Build and validate models","Prepare risk summaries","Support audit requests"]},
  {id:"p13", title:"Product Intern", orgId:"o12", courses:["Business","Computer Science","Design"], grade:"CGPA 3.0+",
   country:"Global", region:"Remote", loc:"Remote, worldwide", mode:"Remote", duration:"10 weeks",
   stipendLocal:"$2,000 / month", usd:2000, currency:"USD", visa:"remote", deadline:"15 Apr 2026", slots:3, status:"Open", applicants:58,
   docs:["CV","Portfolio","Writing sample"], testimonial:true,
   about:"Work with a distributed product team on onboarding and activation experiments.",
   duties:["Run activation experiments","Write specs for small features","Analyse funnel data"]},
  {id:"p14", title:"Research Assistant", orgId:"o13", courses:["Public Health","Statistics","Research"], grade:"CGPA 3.4+",
   country:"Global", region:"Remote", loc:"Remote, worldwide", mode:"Remote", duration:"10 weeks",
   stipendLocal:"$1,600 / month", usd:1600, currency:"USD", visa:"remote", deadline:"11 Apr 2026", slots:2, status:"Open", applicants:22,
   docs:["CV","Writing sample","Recommendation letter"], testimonial:true,
   about:"Qualitative research on remote work and public health services.",
   duties:["Run interview studies","Synthesise transcripts","Co-author findings"]}
];

const GRADE_EQ = {
  "CGPA 3.6+":"UK First · ECTS A · US 3.6",
  "CGPA 3.4+":"UK 2:1 high · ECTS B+ · US 3.4",
  "CGPA 3.0+":"UK 2:1 · ECTS B · US 3.0",
  "Second Class Upper":"US GPA 3.3 · ECTS B",
  "Second Class Lower":"US GPA 2.7 · ECTS C"
};
const VISA = {
  sponsorship:"Visa sponsorship",
  "right-to-work":"Right to work required",
  remote:"Remote, worldwide"
};

const GRAD_ROLES = [
  {id:"g1", title:"Junior Product Designer", org:"Lumen Labs", loc:"Remote", pay:"$34,000 / yr", type:"Full time", closes:"18 Mar"},
  {id:"g2", title:"Associate Data Analyst", org:"Northwind", loc:"Berlin", pay:"€42,000 / yr", type:"Full time", closes:"02 Apr"},
  {id:"g3", title:"Programme Officer", org:"Brac Uganda", loc:"Kampala", pay:"UGX 3.2M / mo", type:"Full time", closes:"27 Mar"},
  {id:"g4", title:"Policy Associate", org:"Ministry of ICT", loc:"Kampala", pay:"UGX 2.9M / mo", type:"Contract", closes:"11 Apr"}
];

const STUDENT = {name:"Amina Nakato", course:"Design", year:"Year 3", cgpa:3.7, uni:"Makerere University"};

const GRADE_RANK = {"CGPA 3.6+":3.6,"CGPA 3.4+":3.4,"CGPA 3.0+":3.0,"Second Class Upper":3.3,"Second Class Lower":2.7};

const DOCS = [
  {name:"Transcript", status:"verified", file:"transcript-2026.pdf", size:"1.2 MB"},
  {name:"Student ID", status:"verified", file:"student-id.jpg", size:"480 KB"},
  {name:"National ID", status:"verified", file:"national-id.jpg", size:"390 KB"},
  {name:"Portfolio", status:"pending", file:"portfolio-2025.pdf", size:"8.4 MB"},
  {name:"Recommendation letter", status:"missing", file:"", size:""},
  {name:"Testimonial", status:"missing", file:"", size:""}
];

const ADMIN_QUEUE = [
  {n:"Brian Ssekandi", i:"BS", c:"Computer Science", y:"Year 4", p:"Software Engineering Intern", d:"2 of 3", st:"Review"},
  {n:"Grace Achieng", i:"GA", c:"Statistics", y:"Year 3", p:"Data Analyst Intern", d:"3 of 3", st:"Ready"},
  {n:"Moses Kato", i:"MK", c:"Public Health", y:"Year 2", p:"Health Records Intern", d:"1 of 3", st:"Incomplete"},
  {n:"Sarah Namutebi", i:"SN", c:"Design", y:"Year 3", p:"Product Design Intern", d:"3 of 3", st:"Ready"},
  {n:"Daniel Okello", i:"DO", c:"Law", y:"Year 4", p:"Policy Research Assistant", d:"2 of 3", st:"Review"}
];

const ACTIVITY = [
  ["Ministry of ICT", "posted 2 placements", "today, 09:12"],
  ["Grace Achieng", "uploaded recommendation letter", "today, 08:40"],
  ["Kite Mobility", "approved 3 candidates", "yesterday"],
  ["Twaweza Foundation", "added requirements", "yesterday"],
  ["Amina Nakato", "submitted application", "2 days ago"]
];

const state = {route:"home", type:"All", sector:"All", course:"All", region:"All", visa:"All", q:"", role:null, dash:"overview", pid:null, modal:null, currency:"local"};

const FX = {USD:1, EUR:0.92, GBP:0.79};
const SYM = {USD:"$", EUR:"€", GBP:"£"};
function money(p){
  if(state.currency === "local") return p.stipendLocal;
  return SYM[state.currency] + Math.round(p.usd * FX[state.currency]).toLocaleString("en-US");
}
function moneyNote(p){
  return state.currency === "local" ? "≈ $" + p.usd.toLocaleString("en-US") : "≈ " + p.stipendLocal;
}
function visaTag(p){
  const cls = p.visa==="sponsorship" ? "blue" : p.visa==="remote" ? "green" : "";
  return `<span class="tg ${cls}">${VISA[p.visa]}</span>`;
}
function setCurrency(v){ state.currency = v; go(state.route); }

/* ---------------- helpers ---------------- */
const $ = (s)=>document.querySelector(s);
const esc = (s)=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const ic = (n,w=14)=>`<svg class="ic" width="${w}" height="${w}"><use href="#i-${n}"/></svg>`;
const org = (id)=>ORGS.find(o=>o.id===id);
const place = (id)=>PLACEMENTS.find(p=>p.id===id);
const rank = (g)=>GRADE_RANK[g]||0;
const eligible = (p)=> p.courses.includes(STUDENT.course) && STUDENT.cgpa >= rank(p.grade);

let toastTimer;
function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove("on"), 2800);
}
function openMenu(){ $("#mmenu").classList.add("on"); document.body.style.overflow="hidden"; }
function closeMenu(){ $("#mmenu").classList.remove("on"); document.body.style.overflow=""; }
function openSide(){ $("#sideDrawer").classList.add("on"); $("#veil").classList.add("on"); }
function closeSide(){ $("#sideDrawer").classList.remove("on"); $("#veil").classList.remove("on"); }

function openModal(title, body, okLabel, onOk){
  $("#modalTitle").textContent = title;
  $("#modalBody").innerHTML = body;
  $("#modalOk").textContent = okLabel || "Save";
  $("#modalOk").style.display = onOk ? "" : "none";
  state.modal = onOk || null;
  $("#modal").classList.add("on");
}
function closeModal(){ $("#modal").classList.remove("on"); state.modal = null; }
function modalConfirm(){
  if(state.modal) state.modal();
  closeModal();
}

/* ---------------- router ---------------- */
function go(route){
  if(route === "placements" && state.type === undefined) state.type = "All";
  state.route = route;
  closeMenu();
  const isDash = ["dashboard"].includes(route);
  $("#site").classList.toggle("on", !isDash);
  $("#app").classList.toggle("on", isDash);
  document.body.style.background = isDash ? "#FAF9F5" : "var(--paper)";
  if(isDash){ renderSide(); renderDash(); }
  else { renderSite(); }
  window.scrollTo({top:0,behavior:"instant"});
}

function openPlacement(id){ state.pid = id; state.route = "placement"; go("placement"); }
function setType(t){ state.type = t; state.route = "placements"; go("placements"); }

function signIn(role){
  state.role = role;
  state.dash = "overview";
  if(role === "student"){ STUDENT.name = "Amina Nakato"; }
  go("dashboard");
}

/* ---------------- public site ---------------- */
function renderSite(){
  const m = $("#siteMain");
  const r = state.route;
  if(r === "home") m.innerHTML = viewHome();
  else if(r === "placements") m.innerHTML = viewPlacements();
  else if(r === "placement") m.innerHTML = viewPlacement(state.pid);
  else if(r === "plans") m.innerHTML = viewPlans();
  else if(r === "about") m.innerHTML = viewAbout();
  else if(r === "universities") m.innerHTML = viewUniversities();
  else if(r === "employers") m.innerHTML = viewEmployers();
  else if(r === "contact") m.innerHTML = viewContact();
  else if(r === "signin") m.innerHTML = viewSignin();
  else m.innerHTML = viewHome();
}

function typeLabel(t){ return t; }

function viewHome(){
  const latest = PLACEMENTS.slice(0,6).map(placementRow).join("");
  return `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
          <span class="lbl blue">The placement office, in software</span>
        </div>
        <h1>Placement,<br>not <em>pot luck</em>.</h1>
        <p class="lede">Universities list internships from companies, government agencies and NGOs in one place — with the required courses, the minimum grade and the exact documents stated before anyone applies.</p>

        <form class="searchcard" onsubmit="runSearch(event)">
          <div class="searchgrid">
            <div class="sf">
              <label class="lbl">Placement type</label>
              <select id="hType">
                <option value="All">All organisations</option>
                <option value="Company">Companies</option>
                <option value="Government">Government agencies</option>
                <option value="NGO">NGOs and foundations</option>
                <option value="University">University departments</option>
              </select>
            </div>
            <div class="sf">
              <label class="lbl">Course</label>
              <select id="hCourse">
                <option value="All">Any course</option>
                ${COURSES.map(c=>`<option>${c}</option>`).join("")}
              </select>
            </div>
            <div class="sf">
              <label class="lbl">Location</label>
              <select id="hLoc"><option>Anywhere</option><option>Kampala</option><option>Nairobi</option><option>Remote</option></select>
            </div>
            <button type="submit" aria-label="Search">${ic("search",16)}</button>
          </div>
          <div class="search-meta">
            <span>No account needed to browse.</span>
            <span><b>1,284</b> open placements this term</span>
            <span><b>100%</b> state their requirements</span>
          </div>
        </form>
      </div>

      <div>
        <div class="arch-photo hero-photo">
          <img src="img/hero.jpg" alt="Students working together on a laptop in a university library" loading="eager">
          <div class="cap">Makerere University · placement briefing</div>
        </div>
        <div class="counts">
          <div><b>620</b><span>Companies</span></div>
          <div><b>214</b><span>Government</span></div>
          <div><b>96</b><span>NGOs</span></div>
          <div><b>38</b><span>University</span></div>
        </div>
      </div>
    </div>
    <div class="wrap">
      <div class="trust">
        <span>Makerere</span><span>Nairobi</span><span>TU Berlin</span>
        <span>Amsterdam</span><span>Ashesi</span><span>Addis Ababa</span>
      </div>
      <div class="freebar">
        <div><b>Free for students</b><span>Applications, pack and verified documents — forever.</span></div>
        <div><b>First three placements free</b><span>Companies and agencies, before any invoice.</span></div>
        <div><b>Public universities start free</b><span>A full campus term, no card.</span></div>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="lbl">01 — Who lists with INTERN</span>
          <h2>Three kinds of host,<br>one <em>stated</em> standard.</h2>
        </div>
        <p>Every organisation is verified before a placement goes live. Government agencies and NGOs publish the same requirement fields as companies.</p>
      </div>
      <div class="orgs">
        <div class="orgcard">
          <div class="shape"></div><span class="num">01</span>
          <h3>Companies</h3>
          <p>Studios, banks and technology firms posting paid internships with named mentors and a defined workstream.</p>
          <a href="#" onclick="setType('Companies');return false">620 placements ${ic("arrow",11)}</a>
        </div>
        <div class="orgcard">
          <div class="shape"></div><span class="num">02</span>
          <h3>Government agencies</h3>
          <p>Ministries, authorities and city offices running attachment programmes with public-sector supervision.</p>
          <a href="#" onclick="setType('Government');return false">214 placements ${ic("arrow",11)}</a>
        </div>
        <div class="orgcard">
          <div class="shape"></div><span class="num">03</span>
          <h3>NGOs and universities</h3>
          <p>Foundations, research groups and university departments with fieldwork or lab-based placements.</p>
          <a href="#" onclick="setType('NGO');return false">134 placements ${ic("arrow",11)}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" style="padding-top:0">
    <div class="wrap placed">
      <div class="photo-frame wide">
        <img src="img/students.jpg" alt="Five students sitting together on campus" loading="lazy">
      </div>
      <div>
        <span class="lbl">Students</span>
        <h2 class="serif" style="font-size:clamp(26px,3vw,38px);line-height:1.05;margin:12px 0 14px">186 students started<br>a placement this term.</h2>
        <p style="font-size:13.5px;line-height:1.7;color:var(--ink-2);max-width:420px">Each one applied with a verified record and a stated eligibility check. The index shows the requirement before the application, not after the rejection.</p>
        <div class="mini-quote">
          <p>“I knew I qualified before I applied. That had never happened.”</p>
          <div class="who"><span class="av"><img src="img/portrait.jpg" alt=""></span><span>Amina Nakato · Design · Lumen Labs</span></div>
        </div>
        <div class="mini-quote">
          <p>“The office verified my transcript in a day and the ministry called that week.”</p>
          <div class="who"><span class="av"><img src="img/hero.jpg" alt=""></span><span>Joel Mwangi · Statistics · NITA</span></div>
        </div>
        <button class="btn btn-sm" style="margin-top:16px" onclick="go('placements')">See who is listing ${ic("arrow",12)}</button>
      </div>
    </div>
  </section>

  <section class="sec" style="padding-top:0">
    <div class="wrap">
      <div class="spec">
        <div>
          <span class="lbl">02 — Requirements</span>
          <h2 class="serif" style="font-size:clamp(28px,3.2vw,44px);line-height:1.03;margin:14px 0 16px">The bar is published,<br>not discovered later.</h2>
          <p style="font-size:14px;color:var(--ink-2);line-height:1.7;max-width:430px">
            Each placement carries its eligible courses, minimum grade, required documents and whether a supervisor testimonial is needed. Students see their own eligibility before they apply; the placement office sees every submission against the same fields.
          </p>
          <div style="display:flex;gap:22px;margin-top:24px;flex-wrap:wrap">
            <div><div class="serif" style="font-size:28px">6</div><div class="lbl">requirement fields</div></div>
            <div><div class="serif" style="font-size:28px">48h</div><div class="lbl">verification window</div></div>
            <div><div class="serif" style="font-size:28px">100%</div><div class="lbl">documents tracked</div></div>
          </div>
        </div>

        <div class="reqcard">
          <div class="rh">
            <div>
              <span class="lbl">Government agency · Kampala</span>
              <h3 style="margin-top:6px">Data Analyst Intern</h3>
              <div style="font-size:12px;color:var(--muted);margin-top:3px">National Information Technology Authority</div>
            </div>
            <span class="seal blue">Open<br>12 Mar</span>
          </div>
          <div style="margin-top:10px">
            <div class="reqrow"><div class="k">Courses</div><div class="doclist">${["Statistics","Computer Science","Economics"].map(c=>`<span class="doc">${c}</span>`).join("")}</div></div>
            <div class="reqrow"><div class="k">Minimum grade</div><div><b style="font-size:12.5px">Second Class Upper</b> <span style="color:var(--muted);font-size:11px">· CGPA 3.3 and above</span></div></div>
            <div class="reqrow"><div class="k">Documents</div><div class="doclist">${["Transcript","National ID","Recommendation"].map(c=>`<span class="doc">${ic("doc",10)} ${c}</span>`).join("")}</div></div>
            <div class="reqrow"><div class="k">Testimonial</div><div>Required from a previous supervisor</div></div>
            <div class="reqrow" style="border-bottom:0"><div class="k">Eligibility</div><div><span class="tg green">You qualify</span></div></div>
          </div>
          <div class="reqfoot">
            <span class="lbl">6 months · UGX 1,200,000 / month</span>
            <button class="btn btn-sm btn-solid" onclick="openPlacement('p2')">Open placement</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" style="padding-top:0">
    <div class="wrap">
      <div class="sec-h">
        <div><span class="lbl">03 — Latest</span>
          <h2 style="margin-top:14px">Listed in the last seven days.</h2>
        </div>
        <p>Every row shows the organisation type, the eligible courses and the closing date. Nothing is hidden behind a sign-up.</p>
      </div>
      <table class="ptable">
        <thead><tr><th>Placement</th><th>Organisation</th><th>Type</th><th>Stipend</th><th>Closes</th><th></th></tr></thead>
        <tbody>${latest}</tbody>
      </table>
      <div style="display:flex;justify-content:space-between;margin-top:16px;flex-wrap:wrap;gap:10px">
        <span class="lbl">Showing 6 of 1,284</span>
        <button class="btn btn-sm" onclick="go('placements')">Open the index ${ic("arrow",12)}</button>
      </div>
    </div>
  </section>

  <section class="band-dark">
    <div class="wrap band-grid">
      <div>
        <span class="lbl">04 — For universities</span>
        <h2 style="margin-top:12px">Your placement office,<br>with a <em>record</em>.</h2>
        <p>Publish placements, set requirements once, verify documents and see which students are actually placed. Government and NGO listings feed the same index.</p>
        <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
          <button class="btn" style="border-color:#4A5D77;color:#EDEAE0" onclick="go('universities')">How it works</button>
          <button class="btn" style="border-color:transparent;color:#9DBBB2" onclick="go('signin')">Open a dashboard</button>
        </div>
      </div>
      <div class="mini">
        <div class="mh"><span class="lbl">Placements this term</span><span class="lbl">42 open</span></div>
        <div class="mrow"><div><b>Ministry of ICT</b><span>Government · 12 applicants</span></div><span class="v">Open</span><span class="v">6 slots</span></div>
        <div class="mrow"><div><b>Lumen Labs</b><span>Company · 41 applicants</span></div><span class="v">Open</span><span class="v">4 slots</span></div>
        <div class="mrow"><div><b>Atlas Health</b><span>Company · 64 applicants</span></div><span class="v">Closing</span><span class="v">8 slots</span></div>
        <div class="mrow"><div><b>Twaweza</b><span>NGO · 29 applicants</span></div><span class="v">Open</span><span class="v">4 slots</span></div>
      </div>
    </div>
  </section>

  <div class="wrap">
    <div class="quote">
      <div>
        <div class="portrait" style="width:96px;height:96px"><img src="img/portrait.jpg" alt="Portrait of Amina Nakato"></div>
        <div class="seal" style="margin-top:14px">Verified<br>placement<br>2026</div>
      </div>
      <blockquote>“I applied to eleven places through email and heard from two. INTERN told me the grade requirement before I applied — so I only applied to four, and <em>three</em> replied.”</blockquote>
      <div class="who"><b>Amina Nakato</b><span>Year 3, Design<br>Makerere University<br>Placed at Lumen Labs</span></div>
    </div>
  </div>

  <section class="cta">
    <div class="wrap">
      <h2>List a placement. State the requirements.<br>Let the index do the rest.</h2>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-blue" onclick="go('signin')">Sign in</button>
        <button class="btn" style="border-color:#5A6058;color:#EDEAE0" onclick="go('contact')">Talk to the office</button>
      </div>
    </div>
  </section>`;
}

function refreshList(){
  const list = PLACEMENTS.filter(p=>{
    const o = org(p.orgId);
    const t = state.type === "All" || o.type === state.type;
    const s = state.sector === "All" || o.sector === state.sector;
    const c = state.course === "All" || p.courses.includes(state.course);
    const rg = state.region === "All" || p.region === state.region;
    const vs = state.visa === "All" || p.visa === state.visa;
    const q = !state.q || (p.title+" "+o.name+" "+p.country).toLowerCase().includes(state.q.toLowerCase());
    return t && s && c && rg && vs && q;
  });
  const tb = $("#plistBody");
  if(tb) tb.innerHTML = list.map(placementRow).join("") || `<tr><td colspan="6" style="padding:30px;text-align:center;color:var(--muted)">No placements match these filters.</td></tr>`;
  const c = $("#pcount"); if(c) c.textContent = `${list.length} of 1,284 open placements. Government and NGO listings carry the same requirement fields as companies.`;
}

function placementRow(p){
  const o = org(p.orgId);
  return `
  <tr onclick="openPlacement('${p.id}')">
    <td class="r"><b>${esc(p.title)}</b><span>${p.duration} · ${VISA[p.visa]}</span></td>
    <td>${esc(o.name)}<div style="font-size:10.5px;color:var(--muted);margin-top:1px">${esc(p.country)}</div></td>
    <td class="type">${o.type}</td>
    <td style="font-size:11.5px;color:var(--ink-2);white-space:nowrap">${money(p)}<div style="font-size:10px;color:var(--muted);margin-top:1px">${moneyNote(p)}</div></td>
    <td class="dead">${esc(p.deadline)}</td>
    <td style="text-align:right" class="arr">${ic("arrow",13)}</td>
  </tr>`;
}

function viewPlacements(){
  const sectors = ["All",...new Set(PLACEMENTS.map(p=>org(p.orgId).sector))];
  let list = PLACEMENTS.filter(p=>{
    const o = org(p.orgId);
    const t = state.type === "All" || o.type === state.type;
    const s = state.sector === "All" || o.sector === state.sector;
    const c = state.course === "All" || p.courses.includes(state.course);
    const rg = state.region === "All" || p.region === state.region;
    const vs = state.visa === "All" || p.visa === state.visa;
    const q = !state.q || (p.title+" "+o.name+" "+p.country).toLowerCase().includes(state.q.toLowerCase());
    return t && s && c && rg && vs && q;
  });
  return `
  <div class="phead">
    <div class="wrap">
      <div class="crumb"><a href="#" onclick="go('home');return false" class="lbl">Home</a><span class="lbl">/</span><span class="lbl ink">Placements</span></div>
      <h1>Placements</h1>
      <p id="pcount">${list.length} of 1,284 open placements. Government and NGO listings carry the same requirement fields as companies.</p>
    </div>
  </div>
  <div class="wrap">
    <div class="fbar">
      <div class="fld"><label class="lbl">Organisation type</label>
        <select onchange="state.type=this.value;go('placements')">
          ${["All","Company","Government","NGO","University"].map(t=>`<option ${state.type===t?"selected":""} value="${t}">${t==="All"?"All organisations":t==="NGO"?"NGOs":t+"s"}</option>`).join("")}
        </select>
      </div>
      <div class="fld"><label class="lbl">Sector</label>
        <select onchange="state.sector=this.value;go('placements')">
          ${sectors.map(s=>`<option ${state.sector===s?"selected":""}>${s==="All"?"All sectors":s}</option>`).join("")}
        </select>
      </div>
      <div class="fld"><label class="lbl">Course</label>
        <select onchange="state.course=this.value;go('placements')">
          ${["All",...COURSES].map(c=>`<option ${state.course===c?"selected":""}>${c==="All"?"Any course":c}</option>`).join("")}
        </select>
      </div>
      <div class="fld"><label class="lbl">Region</label>
        <select onchange="state.region=this.value;go('placements')">
          ${["All","East Africa","Europe","Remote"].map(r=>`<option ${state.region===r?"selected":""}>${r==="All"?"All regions":r}</option>`).join("")}
        </select>
      </div>
      <div class="fld"><label class="lbl">Work authorisation</label>
        <select onchange="state.visa=this.value;go('placements')">
          ${["All","sponsorship","right-to-work","remote"].map(v=>`<option value="${v}" ${state.visa===v?"selected":""}>${v==="All"?"Any":VISA[v]}</option>`).join("")}
        </select>
      </div>
      <div class="fld" style="min-width:200px"><label class="lbl">Search</label>
        <input id="pq" placeholder="Role or organisation" value="${esc(state.q)}" oninput="state.q=this.value;refreshList()">
      </div>
      <div class="spacer"></div>
      <button class="btn btn-sm" onclick="state.type='All';state.sector='All';state.course='All';state.region='All';state.visa='All';state.q='';go('placements')">Reset</button>
    </div>

    <div class="dgrid" style="padding-top:0">
      <div>
        <table class="ptable">
          <thead><tr><th>Placement</th><th>Organisation</th><th>Type</th><th>Stipend</th><th>Closes</th><th></th></tr></thead>
          <tbody id="plistBody">${list.map(placementRow).join("") || `<tr><td colspan="6" style="padding:30px;text-align:center;color:var(--muted)">No placements match these filters.</td></tr>`}</tbody>
        </table>
      </div>
      <aside class="side">
        <div class="sbox">
          <div class="sh"><span class="lbl">How eligibility works</span></div>
          <div class="sb">
            <p style="font-size:12px;color:var(--ink-2);line-height:1.65">A placement is open to you when your course is listed <b>and</b> your grade meets the stated minimum. Both fields are set by the university and the host organisation.</p>
            <div class="rule" style="margin:12px 0"></div>
            <div class="lbl" style="margin-bottom:8px">Your record</div>
            <div style="font-size:12px">Design · Year 3 · CGPA 3.7</div>
            <a href="#" class="btn btn-sm btn-block" style="margin-top:12px" onclick="signIn('student');return false">Check my eligibility</a>
          </div>
        </div>
        <div class="sbox">
          <div class="sh"><span class="lbl">Documents usually asked for</span></div>
          <div class="sb">
            <div class="doclist">
              <span class="doc">${ic("doc",10)} Transcript</span>
              <span class="doc">${ic("doc",10)} Student ID</span>
              <span class="doc">${ic("doc",10)} Recommendation</span>
              <span class="doc">${ic("doc",10)} Testimonial</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>`;
}

function viewPlacement(id){
  const p = place(id) || PLACEMENTS[0];
  const o = org(p.orgId);
  const ok = eligible(p);
  return `
  <div class="phead">
    <div class="wrap">
      <div class="crumb"><a href="#" onclick="go('home');return false" class="lbl">Home</a><span class="lbl">/</span>
        <a href="#" onclick="go('placements');return false" class="lbl">Placements</a><span class="lbl">/</span><span class="lbl ink">${esc(o.type)}</span></div>
      <h1>${esc(p.title)}</h1>
      <p>${esc(o.name)} · ${esc(p.loc)} · ${esc(p.country)} · ${esc(p.duration)} · closes ${esc(p.deadline)}</p>
    </div>
  </div>
  <div class="wrap">
    <div class="dgrid">
      <div class="dcard">
        <div class="dhead">
          <div style="display:flex;gap:16px;align-items:flex-start">
            <div class="seal blue" style="width:64px;height:64px">${esc(o.seal)}<br>${esc(o.type)}</div>
            <div>
              <h1>${esc(p.title)}</h1>
              <div style="font-size:12.5px;color:var(--muted);margin-top:5px">${esc(o.name)} · ${esc(o.sector)}</div>
            </div>
          </div>
          <span class="tg ${ok?"green":"red"}">${ok?"You qualify":"Not eligible"}</span>
        </div>
        <div class="dbody">
          <h3>About the placement</h3>
          <p>${esc(p.about)}</p>
          <h3>What you will do</h3>
          <ul>${p.duties.map(d=>`<li>${esc(d)}</li>`).join("")}</ul>

          <h3>Requirements</h3>
          <div style="border:1px solid var(--rule)">
            <div class="reqrow" style="padding:11px 12px"><div class="k">Courses</div><div class="doclist">${p.courses.map(c=>`<span class="doc">${c}</span>`).join("")}</div></div>
            <div class="reqrow" style="padding:11px 12px"><div class="k">Minimum grade</div><div><b>${esc(p.grade)}</b><div style="font-size:10.5px;color:var(--muted);margin-top:2px">${GRADE_EQ[p.grade]||""}</div></div></div>
            <div class="reqrow" style="padding:11px 12px"><div class="k">Documents</div><div class="doclist">${p.docs.map(d=>`<span class="doc">${ic("doc",10)} ${d}</span>`).join("")}</div></div>
            <div class="reqrow" style="padding:11px 12px"><div class="k">Testimonial</div><div>${p.testimonial?"Required from a previous supervisor":"Not required"}</div></div>
            <div class="reqrow" style="padding:11px 12px;border-bottom:0"><div class="k">Work authorisation</div><div>${visaTag(p)} <span style="font-size:10.5px;color:var(--muted);margin-left:6px">${p.visa==="sponsorship"?"the employer sponsors the visa":p.visa==="remote"?"no relocation required":"you must already hold the right to work"}</span></div></div>
          </div>

          <h3>Testimonials from past placements</h3>
          <div style="display:flex;gap:14px;align-items:flex-start;padding:14px;border:1px solid var(--rule);background:#FBFAF6">
            <div class="seal" style="width:56px;height:56px;font-size:6.5px">Class of<br>2025</div>
            <div>
              <p style="font-size:13px;line-height:1.65">“The work was real from the second week. I owned a data pipeline that is still running in the ministry.”</p>
              <div class="lbl" style="margin-top:8px">Joel Mwangi · Statistics · placed 2025</div>
            </div>
          </div>
        </div>
      </div>

      <aside class="side">
        <div class="ticket" style="padding:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span class="lbl">Placement</span><span class="tg ${p.status==="Open"?"green":"gold"}">${p.status}</span>
          </div>
          <div class="serif" style="font-size:28px;line-height:1.1">${money(p)}</div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:2px">${moneyNote(p)} · ${esc(p.duration)} · ${esc(p.mode)}</div>
          <div style="margin:14px 0 12px;border-top:1px dashed var(--rule-2)"></div>
          <div style="display:grid;gap:7px;font-size:12px">
            <div style="display:flex;justify-content:space-between"><span class="muted">Slots</span><b>${p.slots}</b></div>
            <div style="display:flex;justify-content:space-between"><span class="muted">Applicants</span><b>${p.applicants}</b></div>
            <div style="display:flex;justify-content:space-between"><span class="muted">Country</span><b>${esc(p.country)}</b></div>
            <div style="display:flex;justify-content:space-between"><span class="muted">Closes</span><b>${esc(p.deadline)}</b></div>
            <div style="display:flex;justify-content:space-between"><span class="muted">Your grade</span><b>${STUDENT.cgpa} · ${esc(STUDENT.course)}</b></div>
          </div>
          <button class="btn btn-blue btn-block" style="margin-top:14px" onclick="applyTo('${p.id}')">${ok?"Apply with my pack":"Request an exception"}</button>
          <button class="btn btn-block" style="margin-top:8px" onclick="signIn('student')">Open my documents</button>
        </div>

        <div class="sbox">
          <div class="sh"><span class="lbl">Your documents</span><span class="lbl">${p.docs.filter(d=>{const h=DOCS.find(x=>x.name===d);return h&&h.status!=="missing"}).length} of ${p.docs.length}</span></div>
          <div class="sb">
            ${p.docs.map(d=>{const have=DOCS.find(x=>x.name===d);return `<div class="file" style="padding:7px 0"><span class="fi">${have&&have.status!=="missing"?"✓":"!"}</span><div><b>${d}</b><span>${have?have.status:"not uploaded"}</span></div></div>`}).join("")}
            <button class="btn btn-sm btn-block" style="margin-top:10px" onclick="signIn('student')">Upload missing</button>
          </div>
        </div>
      </aside>
    </div>
  </div>`;
}

function viewUniversities(){
  return `
  <div class="phead">
    <div class="wrap">
      <div class="crumb"><a href="#" onclick="go('home');return false" class="lbl">Home</a><span class="lbl">/</span><span class="lbl ink">Universities</span></div>
      <h1>Run the placement office<br>from one page.</h1>
      <p>Publish placements from companies, government agencies and NGOs. Set requirements once. Verify documents. Report placement rates without a spreadsheet.</p>
      <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
        <button class="btn btn-blue" onclick="signIn('admin')">Open the admin dashboard</button>
        <button class="btn" onclick="go('contact')">Request a demo</button>
      </div>
    </div>
  </div>
  <section class="sec">
    <div class="wrap">
      <div class="orgs" style="border-top:1px solid var(--ink)">
        <div class="orgcard"><div class="shape"></div><span class="num">01</span><h3>Publish</h3><p>Add a placement with the organisation dropdown, eligible courses, minimum grade, document list and testimonial rule.</p></div>
        <div class="orgcard"><div class="shape"></div><span class="num">02</span><h3>Verify</h3><p>Students upload transcripts, IDs and recommendation letters. Your office approves or returns each file with a reason.</p></div>
        <div class="orgcard"><div class="shape"></div><span class="num">03</span><h3>Report</h3><p>Placement rates by faculty, organisation type and course — exported for senate papers and accreditation.</p></div>
      </div>
    </div>
  </section>
  <section class="sec" style="padding-top:0">
    <div class="wrap">
      <div class="spec">
        <div class="reqcard">
          <div class="rh"><div><span class="lbl">Requirement set</span><h3 style="margin-top:6px">Software Engineering Intern</h3></div><span class="tg blue">Company</span></div>
          <div class="reqrow" style="padding:11px 12px"><div class="k">Courses</div><div class="doclist"><span class="doc">Computer Science</span><span class="doc">Engineering</span></div></div>
          <div class="reqrow" style="padding:11px 12px"><div class="k">Grade</div><div><b>CGPA 3.4+</b></div></div>
          <div class="reqrow" style="padding:11px 12px"><div class="k">Documents</div><div class="doclist"><span class="doc">Transcript</span><span class="doc">CV</span><span class="doc">Portfolio</span></div></div>
          <div class="reqrow" style="padding:11px 12px;border-bottom:0"><div class="k">Testimonial</div><div>Not required</div></div>
        </div>
        <div>
          <span class="lbl">Verification queue</span>
          <h2 class="serif" style="font-size:34px;line-height:1.06;margin:12px 0 14px">A record for every<br>submission.</h2>
          <p style="font-size:13.5px;line-height:1.7;color:var(--ink-2);max-width:400px">Every uploaded document is timestamped and tied to a student record. When an employer asks whether a transcript was verified, the answer is one click away.</p>
          <button class="btn btn-sm" style="margin-top:16px" onclick="signIn('admin')">See the dashboard</button>
        </div>
      </div>
    </div>
  </section>`;
}

function viewEmployers(){
  return `
  <div class="phead">
    <div class="wrap">
      <div class="crumb"><a href="#" onclick="go('home');return false" class="lbl">Home</a><span class="lbl">/</span><span class="lbl ink">Employers</span></div>
      <h1>Post a placement.<br>Receive candidates who qualify.</h1>
      <p>Set the courses, the minimum grade and the documents you need. The university verifies every file before it reaches you.</p>
      <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
        <button class="btn btn-blue" onclick="signIn('employer')">Open employer dashboard</button>
        <button class="btn" onclick="go('contact')">Talk to us</button>
      </div>
    </div>
  </div>
  <section class="sec">
    <div class="wrap">
      <div class="orgs">
        <div class="orgcard"><div class="shape"></div><span class="num">01</span><h3>State the bar</h3><p>Courses, grade, documents, testimonial. Written once, applied to every applicant automatically.</p></div>
        <div class="orgcard"><div class="shape"></div><span class="num">02</span><h3>Receive qualified files</h3><p>Only students who meet the published requirements reach your shortlist. No exceptions, no guessing.</p></div>
        <div class="orgcard"><div class="shape"></div><span class="num">03</span><h3>Decide faster</h3><p>Structured scorecards, interview slots and a single record per candidate.</p></div>
      </div>
    </div>
  </section>`;
}

function viewContact(){
  return `
  <div class="phead">
    <div class="wrap">
      <div class="crumb"><a href="#" onclick="go('home');return false" class="lbl">Home</a><span class="lbl">/</span><span class="lbl ink">Contact</span></div>
      <h1>Contact the office</h1>
      <p>For universities onboarding a placement office, or employers listing government and NGO placements.</p>
    </div>
  </div>
  <div class="wrap">
    <div style="display:grid;grid-template-columns:1.2fr .8fr;gap:36px;padding:32px 0 60px" class="contact-grid">
      <div>
        <form class="form" onsubmit="event.preventDefault();toast('Message sent · the office replies within one working day')">
          <div class="row2">
            <div class="field"><label>Full name</label><input placeholder="Amina Nakato" required></div>
            <div class="field"><label>Email</label><input type="email" placeholder="you@university.ac.ug" required></div>
          </div>
          <div class="row2">
            <div class="field"><label>University or organisation</label><input placeholder="Makerere University"></div>
            <div class="field"><label>I am a</label>
              <select><option>Placement officer</option><option>Student</option><option>Employer</option><option>Government agency</option></select>
            </div>
          </div>
          <div class="field"><label>Message</label><textarea placeholder="Tell us how many placements you run each term."></textarea></div>
          <div><button class="btn btn-blue" type="submit">Send message</button></div>
        </form>
      </div>
      <aside>
        <div class="sbox" style="margin-bottom:12px">
          <div class="sh"><span class="lbl">Offices</span></div>
          <div class="sb" style="display:grid;gap:14px">
            <div><b style="font-size:12.5px">Kampala</b><div style="font-size:11.5px;color:var(--muted);line-height:1.6">Plot 9, Nkrumah Road<br>+256 414 000 000</div></div>
            <div><b style="font-size:12.5px">Nairobi</b><div style="font-size:11.5px;color:var(--muted);line-height:1.6">Riverside Drive<br>+254 20 000 0000</div></div>
            <div><b style="font-size:12.5px">Berlin</b><div style="font-size:11.5px;color:var(--muted);line-height:1.6">Torstraße 14<br>+49 30 0000 0000</div></div>
          </div>
        </div>
        <div class="ticket" style="padding:14px">
          <span class="lbl">Office hours</span>
          <div style="font-size:12.5px;margin-top:6px">Monday to Friday<br>08:30 – 17:00 EAT</div>
          <div style="border-top:1px dashed var(--rule-2);margin:12px 0"></div>
          <span class="lbl">Response time</span>
          <div style="font-size:12.5px;margin-top:6px">One working day</div>
        </div>
      </aside>
    </div>
  </div>`;
}

function viewSignin(){
  const roles = [
    ["student","Student","Placements, requirements and documents","user"],
    ["jobseeker","Job seeker","Graduate roles beyond internships","brief"],
    ["employer","Employer","Post placements and review candidates","bldg"],
    ["admin","University admin","Manage placements, requirements, verification","uni"]
  ];
  return `
  <div class="auth">
    <div class="wrap auth-l">
      <div>
        <span class="lbl">Sign in</span>
        <h1 style="margin-top:12px">Choose your<br>role to continue.</h1>
        <p>INTERN runs four separate dashboards on one placement record. Your access is set by the university.</p>
        <div class="roles">
          ${roles.map(([id,label,desc,icon])=>`
            <button class="role" onclick="signIn('${id}')">
              <span class="ric">${ic(icon,15)}</span>
              <span><b>${label}</b><span>${desc}</span></span>
              ${ic("arrow",13)}
            </button>`).join("")}
        </div>
        <div style="margin-top:20px;font-size:11.5px;color:var(--muted)">In production this step is a university email domain check or an SSO handshake. The demo opens the dashboard directly.</div>
      </div>
    </div>
    <div class="auth-r">
      <span class="lbl">What the record holds</span>
      <h2>One student file.<br>Four views of it.</h2>
      <ul>
        <li>${ic("check",12)}<span>Placements with stated courses, grades and documents</span></li>
        <li>${ic("check",12)}<span>Uploaded transcripts, IDs and testimonials, timestamped</span></li>
        <li>${ic("check",12)}<span>Verification decisions with reasons attached</span></li>
        <li>${ic("check",12)}<span>Placement rates by faculty and organisation type</span></li>
      </ul>
      <div style="margin-top:28px;display:flex;gap:10px">
        <a href="#" class="btn" style="border-color:#4A5D77;color:#EDEAE0" onclick="go('home');return false">Back to home</a>
      </div>
    </div>
  </div>`;
}

function runSearch(e){
  e.preventDefault();
  state.type = $("#hType").value;
  state.course = $("#hCourse").value;
  go("placements");
}


function viewAbout(){
  return `
  <div class="phead">
    <div class="wrap">
      <div class="crumb"><a href="#" onclick="go('home');return false" class="lbl">Home</a><span class="lbl">/</span><span class="lbl ink">About</span></div>
      <h1>A placement office,<br>not a job board.</h1>
      <p>INTERN exists because the first rung of a career is decided by information — who tells you the requirement, and whether anyone verifies that you meet it.</p>
    </div>
  </div>

  <div class="wrap">
    <div class="about-lead">
      <div>
        <span class="lbl">Why we built it</span>
        <h2 style="margin-top:12px">Students were applying blind.<br>Universities were tracking in spreadsheets.</h2>
        <p>In most placement offices, requirements live in an email, documents live in a folder, and nobody can answer “does this student qualify?” without opening three files. Meanwhile companies, ministries and NGOs each publish placements in a different format, if at all.</p>
        <p>We built one record: the placement with its stated bar, the student with their verified documents, and the office that sits between them. Government listings are first-class citizens, not an afterthought.</p>
      </div>
      <div class="photo-frame tall">
        <img src="img/classroom.jpg" alt="Students in a lecture room" loading="lazy">
      </div>
    </div>
  </div>

  <section class="sec" style="padding-top:20px">
    <div class="wrap">
      <div class="sec-h">
        <div><span class="lbl">01 — Principles</span><h2 style="margin-top:12px">Four rules we do not trade.</h2></div>
        <p>These decide what gets built and what gets refused, including requests from employers.</p>
      </div>
      <div class="principles">
        <div class="principle"><span class="n">01</span><h3>Requirements are public</h3><p>Courses, grade, documents and testimonial rule are visible before an application. No hidden filters, no “strong preference” language.</p></div>
        <div class="principle"><span class="n">02</span><h3>Documents are verified, not trusted</h3><p>The university approves every transcript, ID and recommendation. An employer never receives an unverified file.</p></div>
        <div class="principle"><span class="n">03</span><h3>Government listings are equal</h3><p>Ministries and agencies use the same fields, the same deadline logic and the same index as companies and NGOs.</p></div>
        <div class="principle"><span class="n">04</span><h3>Students never pay to apply</h3><p>Browsing, applying and document verification are free. Universities and host organisations fund the service.</p></div>
      </div>
    </div>
  </section>

  <section class="sec" style="padding-top:0">
    <div class="wrap placed">
      <div>
        <span class="lbl">02 — How the index works</span>
        <h2 class="serif" style="font-size:clamp(26px,3vw,38px);line-height:1.05;margin:12px 0 14px">Three checks before<br>a placement goes live.</h2>
        <div class="principles" style="border-top:1px solid var(--ink);margin-top:10px">
          <div class="principle" style="grid-template-columns:44px 1fr"><span class="n">01</span><div><h3 style="font-size:18px">Organisation verified</h3><p style="margin-top:6px">Registration or ministry charter, named supervisor, confirmed stipend.</p></div></div>
          <div class="principle" style="grid-template-columns:44px 1fr"><span class="n">02</span><div><h3 style="font-size:18px">Requirements checked</h3><p style="margin-top:6px">Courses exist in the university catalogue; the grade threshold is a real band.</p></div></div>
          <div class="principle" style="grid-template-columns:44px 1fr;border-bottom:0"><span class="n">03</span><div><h3 style="font-size:18px">Deadline and slots confirmed</h3><p style="margin-top:6px">Re-checked every six hours; closed placements leave the index the same day.</p></div></div>
        </div>
      </div>
      <div class="photo-frame wide">
        <img src="img/building.jpg" alt="A university building and lawn" loading="lazy">
      </div>
    </div>
  </section>

  <section class="sec" style="padding-top:0">
    <div class="wrap">
      <div class="sec-h">
        <div><span class="lbl">03 — Global standards</span><h2 style="margin-top:12px">One record, four<br>academic systems.</h2></div>
        <p>A grade means something different in Kampala, Berlin and London. INTERN keeps the local requirement and publishes the equivalence beside it, so an employer in Amsterdam can read a Makerere transcript without a conversion table.</p>
      </div>
      <div class="plan-table">
        <div class="pt-row head"><div>Requirement band</div><div>United Kingdom</div><div>Europe (ECTS)</div><div>United States</div></div>
        <div class="pt-row"><div><b style="font-weight:600">CGPA 3.6+</b></div><div>First</div><div>A</div><div>3.6 and above</div></div>
        <div class="pt-row"><div><b style="font-weight:600">CGPA 3.4+</b></div><div>2:1 high</div><div>B+</div><div>3.4</div></div>
        <div class="pt-row"><div><b style="font-weight:600">CGPA 3.0+</b></div><div>2:1</div><div>B</div><div>3.0</div></div>
        <div class="pt-row"><div><b style="font-weight:600">Second Class Upper</b></div><div>2:1</div><div>B</div><div>3.3</div></div>
        <div class="pt-row"><div><b style="font-weight:600">Second Class Lower</b></div><div>2:2</div><div>C</div><div>2.7</div></div>
      </div>
      <div class="offers" style="margin-top:22px">
        <div class="offer"><b>Work authorisation</b><p>Every placement states one of three: visa sponsorship, right to work required, or remote worldwide. Filter by it before applying.</p></div>
        <div class="offer"><b>Data protection</b><p>GDPR for EU placements; Uganda DPA 2019, Kenya DPA 2019 and Tanzania PDPA 2022 elsewhere. Data residency on Campus and Consortium plans.</p></div>
        <div class="offer"><b>Accessibility</b><p>Built to WCAG 2.2 AA — 4.5:1 contrast, full keyboard paths, visible focus and reduced-motion support.</p></div>
      </div>
    </div>
  </section>

  <section class="band-dark">
    <div class="wrap band-grid">
      <div>
        <span class="lbl">04 — The office</span>
        <h2 style="margin-top:12px">Small team.<br>One <em>record</em>.</h2>
        <p>We are a placement-software team working with universities, employers and agencies in 41 countries, with offices in Kampala, Nairobi and Berlin. We do not sell candidate data and we do not rank students for employers beyond the published criteria.</p>
        <div style="display:flex;gap:10px;margin-top:22px;flex-wrap:wrap">
          <button class="btn" style="border-color:#4A5D77;color:#EDEAE0" onclick="go('contact')">Contact the office</button>
          <button class="btn" style="border-color:transparent;color:#9DBBB2" onclick="go('universities')">For universities</button>
        </div>
      </div>
      <div class="team" style="border-color:#2C3E59">
        <div class="mem" style="border-color:#2C3E59"><span class="seal blue" style="width:56px;height:56px;border-color:#4A5D77;color:#9DBBB2">AK</span><b style="color:#F0EDE4">A. K.</b><span style="color:#8FA2BE">Placement systems</span></div>
        <div class="mem" style="border-color:#2C3E59"><span class="seal blue" style="width:56px;height:56px;border-color:#4A5D77;color:#9DBBB2">JM</span><b style="color:#F0EDE4">J. M.</b><span style="color:#8FA2BE">Verification</span></div>
        <div class="mem" style="border-color:#2C3E59"><span class="seal blue" style="width:56px;height:56px;border-color:#4A5D77;color:#9DBBB2">SN</span><b style="color:#F0EDE4">S. N.</b><span style="color:#8FA2BE">University partnerships</span></div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="wrap">
      <h2>If you run a placement office,<br>we should talk.</h2>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-blue" onclick="go('contact')">Request a demo</button>
        <button class="btn" style="border-color:#5A6058;color:#EDEAE0" onclick="go('signin')">Sign in</button>
      </div>
    </div>
  </section>`;
}


/* ---------------- plans ---------------- */
const PLANS = {
  companies:{
    label:"Companies", intro:"For studios, banks and technology firms hiring interns.",
    tiers:[
      {name:"Free", price:"$0", per:"forever", desc:"One live placement, enough to test the index.", kind:"line",
       features:[["1 live placement",1],["10 applications a month",1],["Standard review (72h)",1],["Verified candidate files",1],["Featured placement",0],["Talent search",0],["ATS and calendar sync",0],["Branded careers page",0]],
       cta:"Start free"},
      {name:"Premium", price:"$99", per:"per month", desc:"For teams hiring two or more interns a term.", kind:"dark", ribbon:"Most chosen",
       features:[["Unlimited live placements",1],["Unlimited applications",1],["Priority review (24h)",1],["Featured placement",1],["Talent search, 41,208 students",1],["ATS and calendar sync",1],["Branded careers page",1],["Analytics and export",1]],
       cta:"Start 30-day trial"},
      {name:"Enterprise", price:"Custom", per:"annual", desc:"Multi-country hiring with procurement and SSO.", kind:"line",
       features:[["Everything in Premium",1],["SSO and role permissions",1],["Dedicated success manager",1],["Custom data retention",1],["API access",1],["Invoice billing",1]],
       cta:"Talk to sales"}
    ],
    table:[["Live placements","1","Unlimited","Unlimited"],["Applications","10 / month","Unlimited","Unlimited"],["Review time","72 hours","24 hours","24 hours"],["Featured placement","—","Included","Included"],["Talent search","—","Included","Included"],["ATS sync","—","Included","Included"],["Branded page","—","Included","Included"]]
  },
  government:{
    label:"Ministries & agencies", intro:"Public-sector attachment programmes, with the reporting that goes with them.",
    tiers:[
      {name:"Free", price:"$0", per:"forever", desc:"Two listings for a ministry or agency.", kind:"line",
       features:[["2 live placements",1],["Same requirement fields",1],["Standard review (72h)",1],["Cohort report, PDF",1],["Regional dashboards",0],["Bulk listing import",0],["Procurement pack",0]],
       cta:"List two placements"},
      {name:"Agency", price:"$249", per:"per month", desc:"For agencies running attachment programmes each term.", kind:"dark", ribbon:"Most agencies",
       features:[["Unlimited placements",1],["Bulk listing import (CSV)",1],["Regional dashboards",1],["Cohort reporting and M&E export",1],["Named placement officer",1],["Priority review (24h)",1],["Procurement-ready documentation",1]],
       cta:"Request a pilot"},
      {name:"Ministry", price:"Custom", per:"annual", desc:"National coverage across agencies and districts.", kind:"line",
       features:[["Everything in Agency",1],["Multi-agency hierarchy",1],["National dashboard",1],["SSO and audit log",1],["Custom retention policy",1]],
       cta:"Talk to the office"}
    ],
    table:[["Live placements","2","Unlimited","Unlimited"],["Bulk import","—","CSV","CSV + API"],["Regional dashboards","—","Included","Included"],["M&E export","—","Included","Included"],["Procurement pack","—","Included","Included"],["Audit log","—","—","Included"]]
  },
  universities:{
    label:"Universities", intro:"The placement office runs here — requirements, verification, reporting.",
    tiers:[
      {name:"Free", price:"$0", per:"first term", desc:"One faculty, up to 50 students.", kind:"line",
       features:[["1 faculty",1],["50 student records",1],["Requirement builder",1],["Document verification",1],["Placement reporting",0],["Branded portal",0],["SIS integration",0]],
       cta:"Open a free term"},
      {name:"Campus", price:"$1,900", per:"per year", desc:"All faculties, unlimited students.", kind:"dark", ribbon:"Most universities",
       features:[["All faculties",1],["Unlimited student records",1],["Verification SLA (24h)",1],["Placement-rate reporting",1],["Branded student portal",1],["Employer network access",1],["Senate and accreditation exports",1]],
       cta:"Book a walkthrough"},
      {name:"Consortium", price:"Custom", per:"annual", desc:"Several campuses under one office.", kind:"line",
       features:[["Everything in Campus",1],["Multi-campus hierarchy",1],["SIS integration",1],["Single sign-on",1],["Joint placement reporting",1]],
       cta:"Talk to the office"}
    ],
    table:[["Faculties","1","All","All"],["Student records","50","Unlimited","Unlimited"],["Verification SLA","72h","24h","24h"],["Placement reporting","—","Included","Included"],["Branded portal","—","Included","Included"],["SIS integration","—","—","Included"]]
  },
  careersites:{
    label:"Career sites", intro:"Publishers and career platforms carrying INTERN placements.",
    tiers:[
      {name:"Free", price:"$0", per:"forever", desc:"A branded widget with up to 10 roles.", kind:"line",
       features:[["Hosted widget",1],["10 roles",1],["INTERN branding",1],["Embed on one domain",1],["API access",0],["Custom domain",0],["Analytics",0]],
       cta:"Get the widget"},
      {name:"Embed", price:"$149", per:"per month", desc:"Unbranded listings on your own domain.", kind:"dark", ribbon:"Most publishers",
       features:[["Unlimited roles",1],["Unbranded widget",1],["API and webhooks",1],["Custom domain",1],["Click and apply analytics",1],["Priority listing updates",1]],
       cta:"Start embedding"},
      {name:"Network", price:"Revenue share", per:"per application", desc:"For high-traffic publishers and job boards.", kind:"line",
       features:[["Everything in Embed",1],["Co-branded placement pages",1],["Revenue share per hire",1],["Dedicated integration support",1]],
       cta:"Talk to partnerships"}
    ],
    table:[["Roles shown","10","Unlimited","Unlimited"],["Branding","INTERN","Yours","Co-branded"],["API","—","Included","Included"],["Custom domain","—","Included","Included"],["Analytics","—","Included","Included"],["Revenue share","—","—","Per hire"]]
  },
  students:{
    label:"Students", intro:"Free forever. Always. The rest is optional.",
    tiers:[
      {name:"Student", price:"$0", per:"forever", desc:"Everything you need to be placed.", kind:"dark", ribbon:"Everyone",
       features:[["Browse every placement",1],["Unlimited applications",1],["Application pack",1],["Document upload and verification",1],["Eligibility check before applying",1],["Tracker and reminders",1]],
       cta:"Nothing to buy"},
      {name:"Graduate", price:"$0", per:"12 months after graduation", desc:"Then $3 a month, or stop.", kind:"line",
       features:[["Everything in Student",1],["Graduate roles",1],["Salary bands by city",1],["Alumni introductions",1],["CV review once a year",1]],
       cta:"Claim graduate access"},
      {name:"Sponsored", price:"$0", per:"paid by your university or employer", desc:"For cohorts funded by an institution.", kind:"line",
       features:[["Everything in Student",1],["Interview coaching",1],["Relocation support",1],["Priority document review",1]],
       cta:"Ask your placement office"}
    ],
    table:[["Applications","Unlimited","Unlimited","Unlimited"],["Application pack","Included","Included","Included"],["Graduate roles","—","Included","Included"],["Salary bands","—","Included","Included"],["Coaching","—","—","Included"]]
  }
};

function viewPlans(){
  const segs = Object.keys(PLANS);
  const seg = state.planSeg || "companies";
  const data = PLANS[seg];
  const tiers = data.tiers.map(t=>`
    <div class="tier ${t.kind==="dark"?"dark":""}">
      ${t.ribbon?`<span class="ribbon">${t.ribbon}</span>`:""}
      <div class="th"><span class="lbl ${t.kind==="dark"?"":"ink"}">${t.name}</span>${t.price==="$0"?`<span class="tg">Free</span>`:""}</div>
      <div class="price">${t.price} <small>${t.per}</small></div>
      <p class="desc">${t.desc}</p>
      <ul>${t.features.map(([f,on])=>`<li class="${on?"":"off"}">${on?ic("check",11):ic("x",11)}<span>${f}</span></li>`).join("")}</ul>
      <div class="tier-cta"><button class="btn btn-block ${t.kind==="dark"?"btn-green":""}" onclick="planAction('${t.name}')">${t.cta}</button></div>
    </div>`).join("");

  return `
  <div class="phead">
    <div class="wrap">
      <div class="crumb"><a href="#" onclick="go('home');return false" class="lbl">Home</a><span class="lbl">/</span><span class="lbl ink">Plans</span></div>
      <h1>Free where it should be.<br>Paid where it costs us.</h1>
      <p>Students never pay. Companies, agencies, universities and publishers pay for the parts that consume staff time — verification, review, search and reporting.</p>
    </div>
  </div>
  <div class="wrap" style="padding-top:26px">
    <div class="seg">
      ${segs.map((k,i)=>`<button class="${k===seg?"on":""}" onclick="state.planSeg='${k}';go('plans')"><span class="n">0${i+1}</span>${PLANS[k].label}</button>`).join("")}
    </div>
    <p style="font-size:13px;color:var(--ink-2);margin-bottom:20px">${data.intro}</p>

    <div class="tiers">${tiers}</div>

    <div style="margin-top:22px">
      <div class="pt-row head" style="display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;border:1px solid var(--rule)">
        <div>What changes</div><div>${data.tiers[0].name}</div><div>${data.tiers[1].name}</div><div>${data.tiers[2].name}</div>
      </div>
      <div class="plan-table">
        ${data.table.map(([k,a,b,c])=>`<div class="pt-row"><div><b style="font-weight:600">${k}</b></div><div class="${a==="—"?"no":"yes"}">${a}</div><div class="${b==="—"?"no":"yes"}">${b}</div><div class="${c==="—"?"no":"yes"}">${c}</div></div>`).join("")}
      </div>
    </div>

    <div class="offers">
      <div class="offer"><span class="big">$0</span><b>Students never pay</b><p>Browsing, applications, the pack, documents and the tracker are free forever. No card, no trial clock.</p></div>
      <div class="offer"><span class="big">3</span><b>First three placements free</b><p>Companies and agencies can publish three placements and review every applicant before an invoice exists.</p></div>
      <div class="offer"><span class="big">1 term</span><b>Public universities start free</b><p>A full campus plan for one term — all faculties, unlimited students, no card.</p></div>
    </div>

    <div style="display:flex;gap:10px;margin:26px 0 60px;flex-wrap:wrap">
      <button class="btn btn-blue" onclick="go('signin')">Create an account</button>
      <button class="btn" onclick="go('contact')">Ask about procurement</button>
    </div>
  </div>`;
}

function planAction(tier){
  if(tier==="Free" || tier==="Student"){ toast("Free plan · no card required"); go("signin"); return; }
  if(tier==="Enterprise" || tier==="Ministry" || tier==="Consortium" || tier==="Network"){ go("contact"); return; }
  openModal("Start the " + tier + " plan",
    `<div class="form">
      <div class="row2">
        <div class="field"><label>Organisation</label><input placeholder="Lumen Labs"></div>
        <div class="field"><label>Work email</label><input placeholder="you@organisation.org"></div>
      </div>
      <div class="row2">
        <div class="field"><label>Seats</label><input placeholder="3"></div>
        <div class="field"><label>Billing</label><select><option>Card</option><option>Invoice</option></select></div>
      </div>
      <div style="font-size:11.5px;color:var(--muted);line-height:1.6">30-day trial. No charge until day 31, cancel from the dashboard at any time. Document verification is included in the trial.</div>
    </div>`, "Start trial", ()=>toast(tier + " trial started · 30 days"));
  }

/* ---------------- dashboard shell ---------------- */
const NAV = {
  student:[
    ["overview","Overview","01"],["placements","Placements","02"],["documents","Documents","03"],["pack","Application pack","04"],["testimonial","Testimonial","05"]
  ],
  jobseeker:[["overview","Overview","01"],["roles","Graduate roles","02"],["apps","Applications","03"]],
  employer:[["overview","Overview","01"],["placements","My placements","02"],["applicants","Applicants","03"]],
  admin:[["overview","Overview","01"],["placements","Placements","02"],["requirements","Requirements","03"],["students","Students","04"]]
};
const ROLE_META = {
  student:["Student","Amina Nakato","AK","Free record"],
  jobseeker:["Job seeker","Brian Ssekandi","BS","Graduate"],
  employer:["Employer","Lumen Labs","LL","Host organisation"],
  admin:["University admin","Makerere University","MU","Placement office"]
};

function renderSide(){
  const role = state.role || "student";
  const meta = ROLE_META[role];
  const items = NAV[role].map(([id,label,n])=>`
    <a class="sitem ${state.dash===id?"on":""}" href="#" onclick="dashGo('${id}');return false">
      <span class="n">${n}</span><span>${label}</span>
      ${id==="students"?'<span class="cnt">7</span>':id==="applicants"?'<span class="cnt">14</span>':""}
    </a>`).join("");
  const html = `
    <div class="logo" style="padding:0 18px 16px"><i></i><span><b>INTERN</b><small>PLACEMENT SYSTEM</small></span></div>
    <div class="rolechip"><span class="rc">${meta[2]}</span><div><b>${meta[1]}</b><span>${meta[0]}</span></div></div>
    <nav class="snav">${items}</nav>
    <div class="sfoot">
      <a class="slink" href="#" onclick="go('home');return false">${ic("home",13)} Back to site</a>
      <a class="slink" href="#" onclick="go('plans');return false">${ic("brief",13)} Plans and billing</a>
      <a class="slink" href="#" onclick="go('signin');return false">${ic("user",13)} Switch role</a>
    </div>`;
  $("#side").innerHTML = html;
  $("#sideDrawer").innerHTML = html;

  $("#meName").textContent = meta[1];
  $("#meRole").textContent = meta[0];
  $("#meAv").textContent = meta[2];
  $("#meAv").style.background = role==="admin"?"var(--red)":role==="employer"?"var(--ink)":"var(--blue)";
}

function dashGo(view){
  state.dash = view;
  closeSide();
  renderSide();
  renderDash();
  window.scrollTo({top:0,behavior:"instant"});
}

function renderDash(){
  const role = state.role || "student";
  const r = state.dash;
  const titles = {overview:"Overview",placements:"Placements",requirements:"Requirements",students:"Students",documents:"Documents",testimonial:"Testimonial",pack:"Application pack",roles:"Graduate roles",apps:"Applications",applicants:"Applicants"};
  $("#dashTitle").textContent = titles[r] || "Overview";
  $("#dashCrumb").textContent = "/ " + (role==="admin"?"placement office":role);

  let html = "";
  if(role==="admin"){
    if(r==="overview") html = adminOverview();
    else if(r==="placements") html = adminPlacements();
    else if(r==="requirements") html = adminRequirements();
    else if(r==="students") html = adminStudents();
    else html = adminOverview();
  } else if(role==="student"){
    if(r==="overview") html = studentOverview();
    else if(r==="placements") html = studentPlacements();
    else if(r==="documents") html = studentDocs();
    else if(r==="pack") html = studentPack();
    else if(r==="testimonial") html = studentTestimonial();
    else html = studentOverview();
  } else if(role==="employer"){
    if(r==="overview") html = employerOverview();
    else if(r==="placements") html = employerPlacements();
    else if(r==="applicants") html = employerApplicants();
    else html = employerOverview();
  } else {
    if(r==="overview") html = seekerOverview();
    else if(r==="roles") html = seekerRoles();
    else if(r==="apps") html = seekerApps();
    else html = seekerOverview();
  }
  $("#dashMain").innerHTML = html;
}

/* ---------------- admin ---------------- */
function adminOverview(){
  return `
  <div class="dpane-h">
    <div><h2>Placement office</h2><p>Makerere University · term 2, 2026 · 42 open placements</p></div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-sm" onclick="dashGo('students')">Review queue</button>
      <button class="btn btn-sm btn-blue" onclick="newPlacement()">${ic("plus",12)} New placement</button>
    </div>
  </div>

  <div class="kpis">
    <div class="kpi"><span class="delta">+6</span><b>42</b><span class="lbl">open placements</span></div>
    <div class="kpi alert"><span class="delta">7 due</span><b>23</b><span class="lbl">documents to verify</span></div>
    <div class="kpi"><span class="delta">+18</span><b>186</b><span class="lbl">students placed</span></div>
    <div class="kpi"><b>94%</b><span class="lbl">placement record complete</span></div>
  </div>

  <div class="dsplit">
    <div class="panel">
      <div class="ph"><span class="lbl">Approval queue</span><button class="lbl blue" onclick="dashGo('students')">View all</button></div>
      <div class="pb" style="padding:0">
        <table class="dtable">
          <thead><tr><th>Student</th><th>Placement</th><th>Docs</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${ADMIN_QUEUE.map(s=>`
              <tr>
                <td class="who"><b>${s.n}</b><span>${s.c} · ${s.y}</span></td>
                <td>${s.p}</td>
                <td class="num">${s.d}</td>
                <td><span class="tg ${s.st==="Ready"?"green":s.st==="Review"?"gold":"red"}">${s.st}</span></td>
                <td class="act"><button class="btn btn-sm" onclick="reviewStudent('${s.n}')">Review</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div style="display:grid;gap:14px">
      <div class="panel">
        <div class="ph"><span class="lbl">Placements by organisation type</span></div>
        <div class="pb bars">
          <div class="bar-row"><span>Companies</span><div class="bar-track"><div class="bar-fill" style="width:64%"></div></div><b>27</b></div>
          <div class="bar-row"><span>Government</span><div class="bar-track"><div class="bar-fill" style="width:38%;background:var(--green)"></div></div><b>9</b></div>
          <div class="bar-row"><span>NGOs</span><div class="bar-track"><div class="bar-fill" style="width:22%;background:var(--red)"></div></div><b>4</b></div>
          <div class="bar-row"><span>Universities</span><div class="bar-track"><div class="bar-fill" style="width:12%;background:var(--gold)"></div></div><b>2</b></div>
        </div>
      </div>
      <div class="panel">
        <div class="ph"><span class="lbl">Recent activity</span></div>
        <div class="pb" style="display:grid;gap:9px">
          ${ACTIVITY.map(([w,a,t])=>`<div style="display:grid;grid-template-columns:1fr auto;gap:8px;font-size:11.5px;border-bottom:1px solid var(--rule);padding-bottom:8px">
            <div><b style="font-weight:600">${w}</b> <span style="color:var(--muted)">${a}</span></div><span style="font-family:var(--mono);font-size:9px;color:var(--faint);white-space:nowrap">${t}</span>
          </div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;
}

function adminPlacements(){
  return `
  <div class="dpane-h">
    <div><h2>Placements</h2><p>${PLACEMENTS.length} listed · companies, government, NGOs and university departments</p></div>
    <button class="btn btn-sm btn-blue" onclick="newPlacement()">${ic("plus",12)} New placement</button>
  </div>
  <div class="panel">
    <div class="pb" style="padding:0">
      <table class="dtable">
        <thead><tr><th>Placement</th><th>Organisation</th><th>Type</th><th class="hide-xs">Courses</th><th>Grade</th><th class="hide-xs">Docs</th><th>Closes</th><th></th></tr></thead>
        <tbody>
          ${PLACEMENTS.slice(0,9).map(p=>{const o=org(p.orgId);return `
            <tr>
              <td class="who"><b>${p.title}</b><span>${p.slots} slots · ${p.duration}</span></td>
              <td>${o.name}<div style="font-size:10px;color:var(--muted)">${p.country}</div></td>
              <td><span class="tg ${o.type==="Government"?"blue":o.type==="NGO"?"green":o.type==="University"?"gold":""}">${o.type}</span></td>
              <td class="hide-xs" style="font-size:11px;color:var(--ink-2)">${p.courses.length} courses</td>
              <td class="num">${p.grade}</td>
              <td class="hide-xs"><span class="num">${p.docs.length} required</span></td>
              <td class="num">${p.deadline}</td>
              <td class="act"><button class="btn btn-sm" onclick="editRequirements('${p.id}')">Requirements</button></td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

function adminRequirements(){
  return `
  <div class="dpane-h">
    <div><h2>Requirements</h2><p>Eligible courses, minimum grade, documents and testimonial rule — per placement</p></div>
    <button class="btn btn-sm" onclick="toast('Requirement template applied to 12 placements')">Apply a template</button>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px" class="reqgrid">
    ${PLACEMENTS.slice(0,4).map(p=>{const o=org(p.orgId);return `
      <div class="fold" style="padding:18px">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
          <div><span class="lbl">${o.type} · ${p.deadline}</span><h3 class="serif" style="font-size:21px;margin-top:5px;line-height:1.1">${p.title}</h3>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${o.name}</div></div>
          <span class="tg ${p.testimonial?"gold":""}">${p.testimonial?"Testimonial":"No testimonial"}</span>
        </div>
        <div style="margin-top:12px">
          <div class="reqrow" style="padding:8px 0"><div class="k">Courses</div><div class="doclist">${p.courses.map(c=>`<span class="doc">${c}</span>`).join("")}</div></div>
          <div class="reqrow" style="padding:8px 0"><div class="k">Grade</div><div><b>${p.grade}</b></div></div>
          <div class="reqrow" style="padding:8px 0;border-bottom:0"><div class="k">Documents</div><div class="doclist">${p.docs.map(d=>`<span class="doc">${d}</span>`).join("")}</div></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
          <span class="lbl">${p.applicants} applicants</span>
          <button class="btn btn-sm" onclick="editRequirements('${p.id}')">Edit</button>
        </div>
      </div>`}).join("")}
  </div>`;
}

function adminStudents(){
  return `
  <div class="dpane-h">
    <div><h2>Students</h2><p>186 records · 23 documents awaiting verification</p></div>
    <div style="display:flex;gap:8px"><button class="btn btn-sm" onclick="toast('CSV exported')">Export CSV</button></div>
  </div>
  <div class="panel">
    <div class="pb" style="padding:0">
      <table class="dtable">
        <thead><tr><th>Student</th><th>Course</th><th class="hide-xs">Placement</th><th>Documents</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${ADMIN_QUEUE.map(s=>`
            <tr>
              <td class="who"><b>${s.n}</b><span>${s.y} · ${s.i}</span></td>
              <td>${s.c}</td>
              <td class="hide-xs">${s.p}</td>
              <td class="num">${s.d} verified</td>
              <td><span class="tg ${s.st==="Ready"?"green":s.st==="Review"?"gold":"red"}">${s.st}</span></td>
              <td class="act"><button class="btn btn-sm" onclick="reviewStudent('${s.n}')">Open record</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ---------------- student ---------------- */
function studentOverview(){
  const p = PLACEMENTS[1];
  const o = org(p.orgId);
  const checklist = [
    ["Course matches", true, "Design is an eligible course"],
    ["Grade threshold", true, "3.7 meets Second Class Upper"],
    ["Transcript", true, "Verified 12 Feb"],
    ["National ID", true, "Verified 12 Feb"],
    ["Recommendation letter", false, "Upload before 28 Feb"],
    ["Supervisor testimonial", false, "Request from your tutor"]
  ];
  return `
  <div class="dpane-h">
    <div><h2>Good morning, Amina</h2><p>One application in review · two requirements outstanding</p></div>
    <button class="btn btn-sm btn-blue" onclick="dashGo('placements')">Find placements</button>
  </div>

  <div class="dsplit">
    <div style="display:grid;gap:14px">
      <div class="ticket" style="padding:18px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px">
          <div>
            <span class="lbl">Current application</span>
            <h3 class="serif" style="font-size:26px;line-height:1.1;margin-top:6px">${p.title}</h3>
            <div style="font-size:12px;color:var(--muted);margin-top:3px">${o.name} · ${p.loc} · closes ${p.deadline}</div>
          </div>
          <span class="tg gold">Under review</span>
        </div>
        <div style="display:flex;gap:0;margin-top:18px;border-top:1px dashed var(--rule-2);padding-top:14px">
          ${["Submitted","Documents","Review","Decision"].map((s,i)=>`
            <div style="flex:1;border-right:${i<3?"1px solid var(--rule)":"0"};padding-right:10px">
              <div class="lbl" style="color:${i<2?"var(--green)":"var(--faint)"}">0${i+1}</div>
              <div style="font-size:11.5px;margin-top:3px;color:${i<2?"var(--ink)":"var(--muted)"}">${s}</div>
            </div>`).join("")}
        </div>
      </div>

      <div class="panel">
        <div class="ph"><span class="lbl">Requirements for this placement</span><span class="lbl">4 of 6</span></div>
        <div class="pb">
          <div class="check">
            ${checklist.map(([t,ok,note])=>`
              <div class="ci ${ok?"done":"todo"}">
                <span class="box">${ok?ic("check",9):""}</span>
                <div class="t"><b>${t}</b><span>${note}</span></div>
                <span class="st">${ok?"Met":"Action"}</span>
              </div>`).join("")}
          </div>
          <button class="btn btn-sm btn-blue" style="margin-top:12px" onclick="dashGo('documents')">Upload missing documents</button>
        </div>
      </div>
    </div>

    <div style="display:grid;gap:14px">
      <div class="panel">
        <div class="ph"><span class="lbl">Deadlines</span></div>
        <div class="pb" style="display:grid;gap:10px">
          <div style="display:flex;justify-content:space-between;font-size:11.5px"><span>Recommendation letter</span><b style="color:var(--red)">28 Feb</b></div>
          <div style="display:flex;justify-content:space-between;font-size:11.5px"><span>Testimonial</span><b style="color:var(--red)">28 Feb</b></div>
          <div style="display:flex;justify-content:space-between;font-size:11.5px"><span>Ministry application</span><b>12 Mar</b></div>
        </div>
      </div>
      <div class="panel">
        <div class="ph"><span class="lbl">My record</span></div>
        <div class="pb" style="display:grid;gap:7px;font-size:11.5px">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Course</span><b>${STUDENT.course}</b></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Year</span><b>${STUDENT.year}</b></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">CGPA</span><b>${STUDENT.cgpa}</b></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">University</span><b>${STUDENT.uni}</b></div>
        </div>
      </div>
    </div>
  </div>`;
}

function studentPlacements(){
  return `
  <div class="dpane-h"><div><h2>Placements open to you</h2><p>Filtered by your course and grade — ${PLACEMENTS.filter(eligible).length} of ${PLACEMENTS.length} match</p></div></div>
  <div class="panel"><div class="pb" style="padding:0">
    <table class="dtable">
      <thead><tr><th>Placement</th><th>Organisation</th><th class="hide-xs">Type</th><th>Grade</th><th>Closes</th><th>Eligibility</th><th></th></tr></thead>
      <tbody>
        ${PLACEMENTS.map(p=>{const o=org(p.orgId);const ok=eligible(p);return `
          <tr>
            <td class="who"><b>${p.title}</b><span>${p.duration} · ${money(p)}</span></td>
            <td>${o.name}<div style="font-size:10px;color:var(--muted)">${p.country}</div></td>
            <td class="hide-xs"><span class="tg ${o.type==="Government"?"blue":o.type==="NGO"?"green":o.type==="University"?"gold":""}">${o.type}</span></td>
            <td class="num">${p.grade}</td>
            <td class="num">${p.deadline}</td>
            <td><span class="tg ${ok?"green":"red"}">${ok?"Eligible":"Not eligible"}</span></td>
            <td class="act">${ok?`<button class="btn btn-sm btn-blue" onclick="applyTo('${p.id}')">Apply</button>`:`<button class="btn btn-sm" onclick="openPlacement('${p.id}')">View</button>`}</td>
          </tr>`}).join("")}
      </tbody>
    </table>
  </div></div>`;
}

function studentDocs(){
  return `
  <div class="dpane-h"><div><h2>Documents</h2><p>Transcripts, IDs, recommendation letters and testimonials</p></div>
    <button class="btn btn-sm btn-blue" onclick="uploadDoc('Recommendation letter')">${ic("upload",12)} Upload</button></div>

  <div class="dsplit">
    <div class="panel">
      <div class="ph"><span class="lbl">My files</span><span class="lbl">${DOCS.filter(d=>d.status!=="missing").length} uploaded</span></div>
      <div class="pb">
        <div class="files">
          ${DOCS.map(d=>`
            <div class="file">
              <span class="fi">${d.name.slice(0,2).toUpperCase()}</span>
              <div><b>${d.name}</b><span>${d.file||"—"} ${d.size?"· "+d.size:""}</span></div>
              <span class="tg ${d.status==="verified"?"green":d.status==="pending"?"gold":"red"}">${d.status}</span>
            </div>`).join("")}
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="ph"><span class="lbl">Upload</span></div>
      <div class="pb">
        <div class="upload" onclick="uploadDoc('Recommendation letter')">
          <div class="ic">${ic("upload",24)}</div>
          <b>Drop a file or click to upload</b>
          <span>PDF or JPG · up to 10 MB</span>
        </div>
        <div style="margin-top:12px;font-size:11.5px;color:var(--muted);line-height:1.6">Files are checked by the placement office within 48 hours. A rejected file keeps its reason, so you can replace it without starting again.</div>
      </div>
    </div>
  </div>`;
}

function studentTestimonial(){
  return `
  <div class="dpane-h"><div><h2>Testimonial</h2><p>Required by 9 of your 12 eligible placements</p></div></div>
  <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:14px" class="reqgrid">
    <div class="panel">
      <div class="ph"><span class="lbl">Submit a testimonial</span></div>
      <div class="pb">
        <div class="form">
          <div class="row2">
            <div class="field"><label>Supervisor name</label><input placeholder="Dr. Sarah Nabukeera"></div>
            <div class="field"><label>Role</label><input placeholder="Senior lecturer"></div>
          </div>
          <div class="field"><label>Placement or project</label><input placeholder="Kite Campus design system"></div>
          <div class="field"><label>Testimonial</label><textarea placeholder="Describe the work and how it was supervised."></textarea></div>
          <div><button class="btn btn-sm btn-blue" onclick="toast('Testimonial submitted for verification')">Submit for verification</button></div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="ph"><span class="lbl">Status</span></div>
      <div class="pb">
        <div class="check">
          <div class="ci todo"><span class="box"></span><div class="t"><b>Not submitted</b><span>Needed for Ministry of ICT</span></div><span class="st">Action</span></div>
          <div class="ci done"><span class="box">${ic("check",9)}</span><div class="t"><b>Transcript verified</b><span>12 Feb 2026</span></div><span class="st">Met</span></div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------------- employer ---------------- */
function employerOverview(){
  return `
  <div class="dpane-h">
    <div><h2>Lumen Labs</h2><p>2 placements listed · 55 applicants · 6 shortlisted</p></div>
    <button class="btn btn-sm btn-blue" onclick="newPlacement()">${ic("plus",12)} New placement</button>
  </div>
  <div class="kpis">
    <div class="kpi"><b>2</b><span class="lbl">placements live</span></div>
    <div class="kpi"><b>55</b><span class="lbl">applicants</span></div>
    <div class="kpi"><b>6</b><span class="lbl">shortlisted</span></div>
    <div class="kpi"><b>9 days</b><span class="lbl">median to hire</span></div>
  </div>

  <div class="panel">
    <div class="ph"><span class="lbl">Recent applicants</span><button class="lbl blue" onclick="dashGo('applicants')">View all</button></div>
    <div class="pb" style="padding:0">
      <table class="dtable">
        <thead><tr><th>Candidate</th><th>Course</th><th class="hide-xs">University</th><th>Documents</th><th>Fit</th><th></th></tr></thead>
        <tbody>
          ${ADMIN_QUEUE.slice(0,4).map((s,i)=>`
            <tr><td class="who"><b>${s.n}</b><span>${s.y}</span></td><td>${s.c}</td><td class="hide-xs">Makerere</td>
            <td><span class="tg green">Verified</span></td><td class="num">${93-i*2}%</td>
            <td class="act"><button class="btn btn-sm" onclick="toast('${s.n} shortlisted')">Shortlist</button></td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div class="dsplit" style="margin-top:14px">
    <div class="panel">
      <div class="ph"><span class="lbl">Plan and usage</span><span class="tg gold">Premium trial · 11 days left</span></div>
      <div class="pb">
        <div style="display:flex;justify-content:space-between;font-size:11.5px"><span>Live placements</span><b>2 of 3 free</b></div>
        <div class="bar" style="height:5px;background:var(--paper-2);position:relative;margin:7px 0 12px"><i style="position:absolute;inset:0 auto 0 0;width:66%;background:var(--blue)"></i></div>
        <div style="display:flex;justify-content:space-between;font-size:11.5px"><span>Review time</span><b class="green">24 hours · priority</b></div>
        <div style="display:flex;justify-content:space-between;font-size:11.5px;margin-top:8px"><span>Applications this month</span><b>55</b></div>
        <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
          <button class="btn btn-sm btn-blue" onclick="go('plans')">Compare plans</button>
          <button class="btn btn-sm" onclick="toast('Invoice request sent')">Request invoice</button>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="ph"><span class="lbl">Premium tools</span></div>
      <div class="pb" style="display:grid;gap:0">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--rule);font-size:11.5px"><span>Featured placement</span><span class="tg green">On</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--rule);font-size:11.5px"><span>Talent search</span><button class="btn btn-sm" onclick="go('plans')">Unlock</button></div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--rule);font-size:11.5px"><span>ATS and calendar sync</span><span class="tg">Off</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;font-size:11.5px"><span>Career page embed</span><button class="btn btn-sm" onclick="showEmbed()">Get code</button></div>
      </div>
    </div>
  </div>`;
}

function employerPlacements(){
  return `
  <div class="dpane-h"><div><h2>My placements</h2><p>2 live · 1 draft</p></div><button class="btn btn-sm btn-blue" onclick="newPlacement()">New placement</button></div>
  <div class="panel"><div class="pb" style="padding:0">
    <table class="dtable">
      <thead><tr><th>Placement</th><th>Type</th><th class="hide-xs">Courses</th><th>Grade</th><th>Applicants</th><th>Closes</th><th></th></tr></thead>
      <tbody>
        ${PLACEMENTS.filter(p=>p.orgId==="o4").map(p=>`
          <tr><td class="who"><b>${p.title}</b><span>${p.slots} slots</span></td><td><span class="tg">Company</span></td>
          <td class="hide-xs" style="font-size:11px">${p.courses.join(", ")}</td><td class="num">${p.grade}</td>
          <td class="num">${p.applicants}</td><td class="num">${p.deadline}</td>
          <td class="act"><button class="btn btn-sm" onclick="editRequirements('${p.id}')">Requirements</button></td></tr>`).join("")}
      </tbody>
    </table>
  </div></div>`;
}

function employerApplicants(){
  return `
  <div class="dpane-h"><div><h2>Applicants</h2><p>55 candidates · only those meeting your stated requirements</p></div>
    <button class="btn btn-sm" onclick="toast('Shortlist exported')">Export</button></div>

  <div class="panel" style="margin-bottom:14px;border-color:var(--ink)">
    <div class="pb" style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">
      <div>
        <span class="lbl">Premium · talent search</span>
        <div style="font-size:12.5px;margin-top:4px">Search 41,208 verified students by course, grade, skill and availability — before a placement exists.</div>
      </div>
      <button class="btn btn-sm btn-blue" onclick="go('plans')">Unlock search</button>
    </div>
  </div>

  <div class="panel"><div class="pb" style="padding:0">
    <table class="dtable">
      <thead><tr><th>Candidate</th><th>Course</th><th>Grade</th><th class="hide-xs">Documents</th><th>Fit</th><th></th></tr></thead>
      <tbody>
        ${ADMIN_QUEUE.map((s,i)=>`
          <tr><td class="who"><b>${s.n}</b><span>${s.y} · Makerere</span></td><td>${s.c}</td>
          <td class="num">${(3.2+i*0.12).toFixed(1)}</td>
          <td class="hide-xs"><span class="tg green">3 of 3 verified</span></td>
          <td class="num">${93-i*2}%</td>
          <td class="act"><button class="btn btn-sm" onclick="toast('${s.n} invited to interview')">Invite</button></td></tr>`).join("")}
      </tbody>
    </table>
  </div></div>`;
}

function seekerOverview(){
  return `
  <div class="dpane-h"><div><h2>Brian, your graduate search</h2><p>4 roles match your record · 1 application in progress</p></div>
    <button class="btn btn-sm btn-blue" onclick="dashGo('roles')">Browse roles</button></div>
  <div class="kpis">
    <div class="kpi"><b>4</b><span class="lbl">matching roles</span></div>
    <div class="kpi"><b>1</b><span class="lbl">application open</span></div>
    <div class="kpi"><b>0</b><span class="lbl">interviews</span></div>
    <div class="kpi"><b>82%</b><span class="lbl">record complete</span></div>
  </div>
  <div class="panel"><div class="ph"><span class="lbl">Your applications</span></div>
    <div class="pb" style="padding:0"><table class="dtable">
      <thead><tr><th>Role</th><th>Organisation</th><th>Applied</th><th>Status</th></tr></thead>
      <tbody><tr><td class="who"><b>Junior Product Designer</b><span>Full time</span></td><td>Lumen Labs</td><td class="num">3 days ago</td><td><span class="tg gold">Screening</span></td></tr></tbody>
    </table></div>
  </div>`;
}

function seekerRoles(){
  return `
  <div class="dpane-h"><div><h2>Graduate roles</h2><p>Beyond internships · verified employers only</p></div></div>
  <div class="panel"><div class="pb" style="padding:0">
    <table class="dtable">
      <thead><tr><th>Role</th><th>Organisation</th><th class="hide-xs">Location</th><th>Pay</th><th>Closes</th><th></th></tr></thead>
      <tbody>
        ${GRAD_ROLES.map(r=>`
          <tr><td class="who"><b>${r.title}</b><span>${r.type}</span></td><td>${r.org}</td><td class="hide-xs">${r.loc}</td>
          <td class="num">${r.pay}</td><td class="num">${r.closes}</td>
          <td class="act"><button class="btn btn-sm btn-blue" onclick="toast('Application started · ${r.title}')">Apply</button></td></tr>`).join("")}
      </tbody>
    </table>
  </div></div>`;
}

function seekerApps(){
  return `
  <div class="dpane-h"><div><h2>Applications</h2><p>1 open · 0 closed</p></div></div>
  <div class="panel"><div class="pb" style="padding:0"><table class="dtable">
    <thead><tr><th>Role</th><th>Organisation</th><th>Applied</th><th>Status</th></tr></thead>
    <tbody><tr><td class="who"><b>Junior Product Designer</b><span>Full time</span></td><td>Lumen Labs</td><td class="num">3 days ago</td><td><span class="tg gold">Screening</span></td></tr></tbody>
  </table></div></div>`;
}


/* ---------------- assistant ---------------- */
function openChat(){ $("#chat").classList.add("on"); $("#chatVeil").classList.add("on"); document.body.style.overflow="hidden"; }
function closeChat(){ $("#chat").classList.remove("on"); $("#chatVeil").classList.remove("on"); document.body.style.overflow=""; }
function askChat(t){ const i=$("#chatText"); i.value=t; sendChat(); }

function sendChat(){
  const input = $("#chatText");
  const text = input.value.trim();
  if(!text) return;
  const log = $("#chatLog");
  log.insertAdjacentHTML("beforeend", `<div class="msg me">${esc(text)}</div>`);
  input.value="";
  log.scrollTop = log.scrollHeight;

  const typing = document.createElement("div");
  typing.className="msg bot";
  typing.innerHTML = `<div class="who">INTERN</div><span style="font-family:var(--mono);font-size:10px;letter-spacing:.25em">···</span>`;
  log.appendChild(typing);
  log.scrollTop = log.scrollHeight;

  setTimeout(()=>{
    typing.remove();
    log.insertAdjacentHTML("beforeend", `<div class="msg bot"><div class="who">INTERN</div>${answerChat(text)}</div>`);
    log.scrollTop = log.scrollHeight;
  }, 650);
}

function answerChat(t){
  const q = t.toLowerCase();

  if(q.includes("eligible") || q.includes("qualify") || q.includes("can i apply")){
    const p = PLACEMENTS.find(x=>q.includes(x.title.toLowerCase().split(" ")[0].toLowerCase())) || place(state.pid) || PLACEMENTS[1];
    const ok = eligible(p);
    const courseOk = p.courses.includes(STUDENT.course);
    return ok
      ? `Yes — for <b>${p.title}</b> at ${org(p.orgId).name}. Your course (${STUDENT.course}) is on the list and your CGPA of ${STUDENT.cgpa} clears ${p.grade}. You still need ${p.docs.filter(d=>{const h=DOCS.find(x=>x.name===d);return !h||h.status==="missing"}).length} document(s) uploaded before the office can forward your file. Closing date is ${p.deadline}.`
      : `Not on paper. <b>${p.title}</b> requires ${p.grade} and the courses ${p.courses.join(", ")}. Your record is ${STUDENT.course} at ${STUDENT.cgpa}${courseOk?"":" — your course is not on their list"}. The university can still request an exception; that goes to the placement office, not the employer.`;
  }

  if(q.includes("document") || q.includes("upload") || q.includes("need")){
    const missing = DOCS.filter(d=>d.status==="missing").map(d=>d.name);
    return `Three states matter: verified, pending and missing. On your record, ${DOCS.filter(d=>d.status==="verified").length} files are verified and ${missing.length} are missing${missing.length?" ("+missing.join(", ")+")":""}. Upload from Documents — PDF or JPG up to 10 MB. The office reviews within 48 hours and a rejection keeps its reason, so you can replace the file without starting again.`;
  }

  if(q.includes("government") || q.includes("ministry") || q.includes("agency")){
    const gov = PLACEMENTS.filter(p=>org(p.orgId).type==="Government");
    return `There are ${gov.length} government placements live, from ${[...new Set(gov.map(p=>org(p.orgId).name))].slice(0,3).join(", ")}. They use the same requirement fields as companies — courses, minimum grade, documents, testimonial. The Data Analyst Intern closes soonest, on 28 February.`;
  }

  if(q.includes("verification") || q.includes("verify") || q.includes("transcript")){
    return `Your transcript and student ID are verified by the placement office, not by the employer. A placement officer opens the file, checks it against the university record and marks it verified or returns it with a reason. Median turnaround is 48 hours. Employers only ever see verified files.`;
  }

  if(q.includes("deadline") || q.includes("closing") || q.includes("close")){
    const soon = PLACEMENTS.slice().sort((a,b)=>new Date(a.deadline)-new Date(b.deadline)).slice(0,3);
    return `The next three deadlines are ${soon.map(p=>`${p.title} (${p.deadline})`).join(", ")}. Atlas Health closes first. I can check your eligibility for any of them before you spend an application.`;
  }

  if(q.includes("cost") || q.includes("pay") || q.includes("free") || q.includes("price")){
    return `Applying is free and always will be. Universities and host organisations fund the service. There is no premium tier for students and no fee to unlock a placement.`;
  }

  if(q.includes("contact") || q.includes("office") || q.includes("phone") || q.includes("email")){
    return `The office is at Plot 9, Nkrumah Road, Kampala — Monday to Friday, 08:30 to 17:00 EAT, with a one working day reply. Nairobi and Berlin offices are listed on the Contact page.`;
  }

  if(q.includes("what is intern") || q.includes("about") || q.includes("how does it work")){
    return `INTERN is a placement system, not a job board. Universities publish placements from companies, government agencies and NGOs; each carries its eligible courses, minimum grade, required documents and testimonial rule. Students see eligibility before applying, the office verifies documents, and employers receive only qualified files.`;
  }

  return `I can check your eligibility against any placement, list the documents you still need, explain verification, or show the next deadlines. Ask about a specific role and I will use its actual requirements.`;
}


const PACK = {
  statement:"I am a third-year Design student at Makerere University. I have shipped a 42-component design system into production, run 18 research interviews, and tested a wayfinding prototype across two iterations. I am looking for a 12-week placement where handoff quality matters.",
  targets:["Product design","Design systems","Research"]
};

function studentPack(){
  const attached = DOCS.filter(d=>d.status!=="missing");
  return `
  <div class="dpane-h">
    <div><h2>Application pack</h2><p>Written once, sent in one click — statement, verified documents and target roles</p></div>
    <button class="btn btn-sm btn-blue" onclick="previewPack()">See what an employer gets</button>
  </div>

  <div class="pack">
    <div class="pack-doc">
      <div class="ph">
        <div><span class="lbl">Pack · version 3</span><h3 style="margin-top:6px">Amina Nakato — Design</h3></div>
        <span class="tg green">Ready to send</span>
      </div>
      <div class="lbl" style="margin-top:16px">Statement</div>
      <p>${esc(PACK.statement)}</p>
      <button class="btn btn-sm" style="margin-top:12px" onclick="editPack()">Edit statement</button>
      <div class="pack-stat">
        <div><b>${attached.length}</b><span>docs attached</span></div>
        <div><b>${PACK.targets.length}</b><span>target roles</span></div>
        <div><b>92%</b><span>avg. match</span></div>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:14px;line-height:1.6">The pack is the same file for every application. Only the role reference and the closing line change — the statement, documents and verified status stay attached.</div>
    </div>

    <div style="display:grid;gap:14px">
      <div class="panel">
        <div class="ph"><span class="lbl">Attachments</span><span class="lbl">verified only</span></div>
        <div class="pb">
          ${DOCS.map(d=>`
            <div class="attach ${d.status!=="missing"?"on":""}" onclick="toast('${d.name}: ${d.status}')">
              <span class="ck">${d.status!=="missing"?ic("check",9):""}</span>
              <span>${d.name}</span>
              <span class="tg ${d.status==="verified"?"green":d.status==="pending"?"gold":"red"}">${d.status}</span>
            </div>`).join("")}
        </div>
      </div>

      <div class="panel">
        <div class="ph"><span class="lbl">Target roles</span><button class="lbl blue" onclick="toast('Role preferences saved')">Edit</button></div>
        <div class="pb">
          <div class="doclist">${PACK.targets.map(t=>`<span class="doc">${t}</span>`).join("")}</div>
          <button class="btn btn-sm btn-block" style="margin-top:12px" onclick="go('placements')">Apply to a placement</button>
        </div>
      </div>

      <div class="panel">
        <div class="ph"><span class="lbl">Sent this term</span></div>
        <div class="pb" style="display:grid;gap:8px;font-size:11.5px">
          <div style="display:flex;justify-content:space-between"><span>Data Analyst Intern</span><b>Under review</b></div>
          <div style="display:flex;justify-content:space-between"><span>Product Design Intern</span><b>Shortlisted</b></div>
          <div style="display:flex;justify-content:space-between"><span>Frontend Intern</span><b>Sent</b></div>
        </div>
      </div>
    </div>
  </div>`;
}

function editPack(){
  openModal("Edit your statement",
    `<div class="form"><div class="field"><label>Statement (max 600 characters)</label><textarea id="packText" style="height:140px">${esc(PACK.statement)}</textarea></div>
    <div style="font-size:11px;color:var(--muted)">Used for every application. The placement title and closing date are appended automatically.</div></div>`,
    "Save statement",
    ()=>{ const v=$("#packText"); if(v){ PACK.statement=v.value; } toast("Statement saved · pack updated"); renderDash(); });
}

function previewPack(){
  const attached = DOCS.filter(d=>d.status!=="missing");
  openModal("What the employer receives",
    `<div style="border:1px solid var(--rule);padding:16px;background:#fff">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div><b style="font-size:14px">Amina Nakato</b><div style="font-size:11.5px;color:var(--muted)">Design · Makerere University · Year 3</div></div>
        <span class="tg green">92% match</span>
      </div>
      <p style="font-size:12.5px;line-height:1.65;margin-top:12px">${esc(PACK.statement)}</p>
      <div style="border-top:1px solid var(--rule);margin-top:12px;padding-top:10px">
        ${attached.map(d=>`<div style="font-size:11px;padding:3px 0">✓ ${d.name} — verified</div>`).join("")}
      </div>
      <div style="font-size:10px;color:var(--muted);margin-top:10px">Sent from INTERN · placement reference appended automatically</div>
    </div>`, null);
}


function showEmbed(){
  openModal("Career page embed",
    `<p style="font-size:12.5px;color:var(--ink-2);line-height:1.65;margin-bottom:12px">Paste this where your careers page should show live INTERN placements. It updates whenever you publish or close a placement.</p>
     <div class="embedpre">&lt;div id="intern-placements"<br>&nbsp;&nbsp;data-org=<b>"lumen-labs"</b><br>&nbsp;&nbsp;data-theme=<b>"light"</b><br>&nbsp;&nbsp;data-limit=<b>"6"</b>&gt;&lt;/div&gt;<br>&lt;script src=<b>"https://embed.intern.africa/v1.js"</b>&gt;&lt;/script&gt;<button class="copybtn" onclick="toast('Snippet copied')">Copy</button></div>
     <div style="font-size:11px;color:var(--muted);margin-top:10px">Included in Premium and Enterprise. The free widget carries INTERN branding and caps at 10 roles.</div>`,
    "Done");
}

/* ---------------- actions ---------------- */
function applyTo(id){
  const p = place(id); const o = org(p.orgId);
  openModal("Apply with your pack — " + p.title,
    `<p style="font-size:13px;color:var(--ink-2);line-height:1.65">One click sends your statement, verified documents and eligibility check to <b>${o.name}</b>. The placement office confirms the record before the employer opens it.</p>
     <div style="margin-top:14px;border:1px solid var(--rule);padding:12px;background:#fff">
       <div class="lbl">Statement</div>
       <p style="font-size:12px;line-height:1.6;margin-top:5px">${esc(PACK.statement)}</p>
     </div>
     <div style="margin-top:12px;border:1px solid var(--rule)">
       ${p.docs.map(d=>{const have=DOCS.find(x=>x.name===d);return `<div class="file" style="padding:9px 11px"><span class="fi">${have&&have.status!=="missing"?"✓":"!"}</span><div><b>${d}</b><span>${have?have.status:"will be requested"}</span></div></div>`}).join("")}
     </div>`,
    "Send application",
    ()=>{ toast("Pack sent to " + o.name); });
}

function reviewStudent(name){
  openModal("Student record — " + name,
    `<div style="display:grid;gap:10px">
      <div style="display:flex;justify-content:space-between;font-size:12.5px"><span style="color:var(--muted)">Course</span><b>Design · Year 3</b></div>
      <div style="display:flex;justify-content:space-between;font-size:12.5px"><span style="color:var(--muted)">CGPA</span><b>3.7</b></div>
      <div style="display:flex;justify-content:space-between;font-size:12.5px"><span style="color:var(--muted)">Placement</span><b>Product Design Intern</b></div>
      <div style="border:1px solid var(--rule);padding:10px;margin-top:6px">
        ${["Transcript — verified","Student ID — verified","Portfolio — pending review"].map(t=>`<div style="font-size:11.5px;padding:4px 0">${t}</div>`).join("")}
      </div>
    </div>`,
    "Approve record",
    ()=>{ toast(name + " approved for placement"); });
}

function editRequirements(id){
  const p = place(id);
  openModal("Requirements — " + p.title,
    `<div class="form">
      <div class="field"><label>Eligible courses</label>
        <div class="checks">${COURSES.map(c=>`<label><input type="checkbox" ${p.courses.includes(c)?"checked":""}>${c}</label>`).join("")}</div>
      </div>
      <div class="row2">
        <div class="field"><label>Minimum grade</label>
          <select>${Object.keys(GRADE_RANK).map(g=>`<option ${p.grade===g?"selected":""}>${g}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Testimonial required</label>
          <select><option>${p.testimonial?"Required":"Not required"}</option><option>${p.testimonial?"Not required":"Required"}</option></select>
        </div>
      </div>
      <div class="field"><label>Required documents</label>
        <div class="checks">${["Transcript","Student ID","National ID","Recommendation letter","Portfolio","CV","Writing sample","Testimonial"].map(d=>`<label><input type="checkbox" ${p.docs.includes(d)?"checked":""}>${d}</label>`).join("")}</div>
      </div>
    </div>`,
    "Save requirements",
    ()=>{ toast("Requirements updated · " + p.title); });
}

function newPlacement(){
  openModal("New placement",
    `<div class="form">
      <div class="row2">
        <div class="field"><label>Organisation type</label>
          <select id="npType">
            <option>Company</option><option>Government agency</option><option>NGO</option><option>University department</option>
          </select>
        </div>
        <div class="field"><label>Organisation</label>
          <select id="npOrg">
            ${ORGS.map(o=>`<option value="${o.id}">${o.name} — ${o.type}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="row2">
        <div class="field"><label>Placement title</label><input placeholder="Data Analyst Intern"></div>
        <div class="field"><label>Location</label><input placeholder="Kampala"></div>
      </div>
      <div class="row3">
        <div class="field"><label>Duration</label><input placeholder="6 months"></div>
        <div class="field"><label>Stipend</label><input placeholder="UGX 1,200,000 / month"></div>
        <div class="field"><label>Slots</label><input type="number" value="4"></div>
      </div>
      <div class="field"><label>Eligible courses</label>
        <div class="checks">${COURSES.map(c=>`<label><input type="checkbox">${c}</label>`).join("")}</div>
      </div>
      <div class="row2">
        <div class="field"><label>Minimum grade</label>
          <select>${Object.keys(GRADE_RANK).map(g=>`<option>${g}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Closing date</label><input type="date"></div>
      </div>
      <div class="field"><label>Required documents</label>
        <div class="checks">${["Transcript","Student ID","National ID","Recommendation letter","Portfolio","CV","Writing sample","Testimonial"].map(d=>`<label><input type="checkbox" ${d==="Transcript"?"checked":""}>${d}</label>`).join("")}</div>
      </div>
    </div>`,
    "Publish placement",
    ()=>{ toast("Placement published · visible to eligible students"); });
}

function uploadDoc(name){
  const d = DOCS.find(x=>x.name===name) || DOCS[3];
  d.status = "pending"; d.file = "recommendation-letter.pdf"; d.size = "640 KB";
  toast(name + " uploaded · pending verification");
  renderDash();
}

/* ---------------- boot ---------------- */
document.getElementById("modal").addEventListener("click", e=>{ if(e.target.id==="modal") closeModal(); });

const hash = location.hash.replace("#","");
if(hash.startsWith("placement-")){ state.pid = hash.split("-")[1]; state.route="placement"; }
else if(hash) state.route = hash;
else state.route = "home";

if(state.route === "ask"){ go("home"); setTimeout(openChat,300); }
else if(state.route.startsWith("dashboard")){
  const parts = state.route.split("-");
  state.role = parts[1] || "student";
  state.dash = parts[2] || "overview";
  go("dashboard");
}
else go(state.route);
