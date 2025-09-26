// Check which page we are on
const servicesContainer = document.getElementById("services-container");
const detailContainer = document.getElementById("service-detail-container");

// Fetch JSON data
fetch("data.json")
  .then(response => response.json())
  .then(services => {
    // Render cards on index.html
    if (servicesContainer) {
      services.forEach(service => {
        const card = document.createElement("div");
        card.classList.add("service-card");
        card.innerHTML = `
          <img src="${service.image}" alt="${service.title}">
          <h2>${service.title}</h2>
          <button class="view-btn">READ MORE <span>+</span></button>
        `;
        card.querySelector(".view-btn").addEventListener("click", () => {
          window.location.href = `detail.html?id=${service.id}`;
        });
        servicesContainer.appendChild(card);
      });
    }

    // Render detail page
    if (detailContainer) {
      const params = new URLSearchParams(window.location.search);
      let id = parseInt(params.get("id"));

      // agar koi id nahi hai ya galat hai to default id = pehla service
      if (isNaN(id) || !services.find(s => s.id === id)) {
        id = services[0].id; // first service as default
      }

      const service = services.find(s => s.id === id);

      if (service) {
        detailContainer.innerHTML = `
          <img src="${service.image}" alt="${service.title}">
          <p>${service.description}</p>
          <h2>${service.subHeading}</h2>
          <p>${service.subDescription}</p>
        `;
      }
    }
  })
  .catch(error => console.error("Error loading services.json:", error));





  // ====================index page JS for property Section========================== //

  // let propertySection = document.getElementById("propertysection");
  // let propertyPage = document.getElementById("property");

  // async function loadService(){
  //   const response = await fetch ("property.json") 
  //   const data = await response.json();
  //   return data.property;
  // }

  // function showProperty(properties, category) {
  //   const container = document.getElementById("propertysection");
  //   container.innerHTML = "";

  //  const filtered = properties.filter(property => property.category === category)
   
  //  filtered.forEach(property => {
  //   const card = document.createElement("div")
  //   card.classList.add("property-card")

  //   card.innerHTML = `
  //   <img src="${property.image}" alt="${property.title}">
  //   <h3>${property.title}</h3>
  //   <button onclick="viewProperty(${property.id})">View Property</button>
  //   `;
  //   container.appendChild(card)
  //  });
  // }

  // document.querySelectorAll(".properties-nav button").forEach(btn => {
  //   btn.addEventListener("click", async ()=>{
  //     const category = btn.dataset.category;
  //     const properties = await loadService()
  //     showProperty(property , category)
  //   });
  // });



//========================= Property Page JS ====================//

// function viewProperty(id) {
//   localStorage.setItem("propertyId", id)
//   window.location.href="property.html"
// }

// async function loadPropertyDetail() {
//   const container = document.getElementById("property");
//   if(!container) return;

//   const id = localStorage("propertyId")
//   const services = await loadService();
//   const property = services.find(s => s.id == id)

//   if (property) {
//     container.innerHTML = `
//     <img src="${property.image}" alt="${property.title}">
//     <h2>${property.title}</h2>
//     <p>${property.description}</p>
//     `;
//   }else{
//     container.innerHTML = "<p>Property not found.</p>";
//   }
// }

// window.addEventListener("DOMContentLoaded", loadPropertyDetail);
// Data fetch from JSON
async function loadServices() {
  const response = await fetch("property.json"); // file ka naam
  const data = await response.json();
  return data.services; // JSON me key "services" hai
}

// Show services by category
function showProperty(services, category) {
  const container = document.getElementById("propertysection");
  if (!container) return; // agar property.html pe ho to skip kare

  container.innerHTML = "";

  // ab "All" bhi normal filter category hai
  const filtered = services.filter(service => service.category === category);

  filtered.forEach(service => {
    const card = document.createElement("div");
    card.classList.add("property-card");

    card.innerHTML = `
      <img src="${service.image}" alt="${service.title}">
      <a href="property.html"><h3>${service.title}</h3></a>
      <button onclick="viewProperty(${service.id})">+</button>
    `;

    container.appendChild(card);
  });
}

// Button click event (sirf index.html ke liye)
document.querySelectorAll(".properties-nav button").forEach(btn => {
  btn.addEventListener("click", async () => {
    const category = btn.dataset.category;
    const services = await loadServices();
    showProperty(services, category);
  });
});

// ==================== Property Page ==================== //

function viewProperty(id) {
  localStorage.setItem("propertyId", id);
  window.location.href = "property.html";
}

async function loadPropertyDetail() {
  const container = document.getElementById("property");
  if (!container) return; // agar index.html pe ho to skip kare

  let id = localStorage.getItem("propertyId");

  // 👉 Agar direct property.html open ho to default id=1 set kar do
  if (!id) {
    id = 1;
    localStorage.setItem("propertyId", id);
  }

  const services = await loadServices();
  const property = services.find(s => s.id == id);

  if (property) {
    container.innerHTML = `
      <img src="${property.image}" alt="${property.title}">
      <p>${property.introText1}</p>
      <p>${property.introText2}</p>
      <h2>${property.heading1}</h2>
      <p>${property.detail1}</p>
      <p>${property.detail2}</p>
      <h2>${property.heading2}</h2>
      <p>${property.detail3}</p>
    `;
  } else {
    container.innerHTML = "<p>Property not found.</p>";
  }
}

// ==================== Default Load ==================== //
window.addEventListener("DOMContentLoaded", async () => {
  // agar index.html pe ho
  const container = document.getElementById("propertysection");
  if (container) {
    const services = await loadServices();
    showProperty(services, "All"); // page load hote hi "All" category ke items
  }

  // agar property.html pe ho
  loadPropertyDetail();
});

