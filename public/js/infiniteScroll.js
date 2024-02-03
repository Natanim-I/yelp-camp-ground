function appendCampground(start, end){
    const content = document.getElementById("main")
    for(let i=start; i < end; i++){
        const container = document.createElement("div")
        container.classList.add("card", "mb-3")
        const row = document.createElement("div")
        row.classList.add("row")
        const imgDiv = document.createElement("div")
        imgDiv.classList.add("col-md-4")
        const img = document.createElement("img")
        img.classList.add("img-fluid")
        img.src =  campgrounds.features[i].images[0].url
        img.alt = "Campground Image"
        const bodyDiv = document.createElement("div")
        bodyDiv.classList.add("col-md-8")
        const body = document.createElement("div")
        body.classList.add("card-body")
        const title = document.createElement("h5")
        title.classList.add("card-title")
        title.textContent = campgrounds.features[i].title
        const description = document.createElement("p")
        description.classList.add("card-text")
        description.textContent = campgrounds.features[i].description
        const location = document.createElement("p")
        location.classList.add("card-text")
        const small = document.createElement("small")
        small.classList.add("text-muted")
        small.textContent = campgrounds.features[i].location
        const price = document.createElement("h5")
        price.classList.add("card-text")
        price.textContent = `Price: $${campgrounds.features[i].price}`
        const view = document.createElement("a")
        view.classList.add("btn", "btn-primary")
        view.textContent = `View ${campgrounds.features[i].title}`
        view.href = `/campgrounds/${campgrounds.features[i]._id}`
        imgDiv.appendChild(img)
        location.appendChild(small)
        body.append(title, description, location, price, view)
        bodyDiv.appendChild(body)
        row.appendChild(imgDiv)
        row.appendChild(bodyDiv)
        container.appendChild(row)
        content.appendChild(container)
    }
}
const itemsPerLoad = 10;
let loadedItem = 0;

appendCampground(loadedItem, loadedItem + itemsPerLoad)
loadedItem += itemsPerLoad
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= documentHeight - 100) {
        
        if (loadedItem < campgrounds.features.length) {
            const end = loadedItem + itemsPerLoad;
            appendCampground(loadedItem, end);
            loadedItem = end;
        }
    }
});