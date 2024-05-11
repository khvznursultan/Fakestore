let box = document.querySelector('.box')
fetch(`https://fakestoreapi.com/products/${location.hash.slice(1)}`)
.then((res) => res.json())
.then((one) => {
    box.innerHTML += `
    <h1>${one.category}</h1>
    <img src="${one.image}">
    <h2>${one.title}</h2>
    <p>${one.description}</p>
    `
})