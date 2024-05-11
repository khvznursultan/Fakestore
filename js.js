let cards = document.querySelector('.cards'),
    li = document.querySelectorAll('header li'),
    boxCart = document.querySelector('.boxCart'),
    btnCart = document.querySelector('.cart'),
    countCart = document.querySelector('.countCart')

let category = ''

let arrCart = []



function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(arrCart));
}
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        arrCart = JSON.parse(savedCart);
        renderCart();
    }
}


let renderCart = () => {
    boxCart.innerHTML = '<h1 class="cart__close">X</h1> <h4 class="priceCart">0</h4>'
    
    arrCart.forEach((el) => {
        boxCart.innerHTML += `
        <div class="oneCart">
            <img src="${el.image}">
            <h4>${el.title}</h4>
            <h5>Price: ${el.price}</h5>
            <div class="cartItemController">
                <button class="decrease" data-id=${el.id}>-</button>
                <h6>${el.counter}</h6>
                <button class="increase" data-id=${el.id}>+</button>
            </div>
        </div>
        `
        saveCartToLocalStorage();
       
    })


    let priceCart = document.querySelector('.priceCart')
        priceCart.textContent = "Total: " + arrCart.reduce((acc, rec) => {
            if(rec.counter === 'max'){
                return acc + rec.price * 15
            }
            else{
                return acc + rec.price * rec.counter
            }
        },0)


    let increaseItemCart = document.querySelectorAll('.increase')
        increaseItemCart.forEach((el) => {
            el.addEventListener('click', () => {
                arrCart.forEach((item) => {
                    if (item.id === +el.dataset.id) {
                        if(item.counter >= 14 || item.counter === 'max'){
                           return  item.counter = 'max'
                        }
                        else{   
                            item.counter += 1
                        }
                    }
  
                    
                })
                renderCart()
            })
        })
    
    
    let decreaseItemCart = document.querySelectorAll('.decrease')
    decreaseItemCart.forEach((el) => {
        el.addEventListener('click', () => {
            arrCart.forEach((item, index) => {
                if (item.id === +el.dataset.id) {
                    if (item.counter <= 1) {
                        arrCart.splice(index, 1)
                        let btnsCart = document.querySelectorAll('.btn__cart')
                        btnsCart.forEach((item)=>{
                            item.textContent = 'В корзину'
                        })
                    }
                    else if(item.counter === 'max'){
                        return item.counter = 14
                    }
                    item.counter -= 1
                }
                
                countCart.textContent = arrCart.length
            })    
            renderCart()
        })
    })

    let closeCart = document.querySelector('.cart__close')
    closeCart.addEventListener('click', () => {
        boxCart.classList.contains('active')
        boxCart.classList.remove('active')
    })
}


let showProduct = () => {
    cards.innerHTML = ''
    fetch(`https://fakestoreapi.com/products/${category === 'jewelery'?'category/jewelery'
        :category === "men's clothing"?"category/men's clothing"
        :category === 'electronics'?'category/electronics'
        :category === "women's clothing"?"category/women's clothing":''}`)
    
    .then((res) => res.json())
    .then((data) => {
        data.forEach((el) => {
            cards.innerHTML += `
            <div class="card">
                <div class="card__info">
                    <a href="oneProduct/oneProduct.html#${el.id}">
                    <img src="${el.image}" alt="">
                    </a>
                    <h4 >${el.title}</h4>
                    <h3 >Price: ${el.price}</h3>
                    <p class="des" data-id="${el.id}">${el.isactive?el.description:el.description.slice(0, 30)}</p>
                    <button class="btnMore" data-id="${el.id}">(...)</button>
                    
                </div>
                <button class="btn__cart" data-id="${el.id}">В корзину</button>
            </div>
            `
        })
       
        let btnsMore = document.querySelectorAll('.btnMore')
            btnsMore.forEach((el) => {
                el.addEventListener('click', () => {
                   let card = el.closest('.card')
                   let cardDes = card.querySelector('.des')

                   if(el.textContent === '(...)'){
                    el.textContent = 'Скрыть'
                    el.style.background = 'white'
                    el.style.zIndex = 100

                    data.forEach((item)=>{
                        if(item.id === +el.dataset.id){
                            cardDes.textContent = item.description
                            cardDes.style.zIndex = 100
                            cardDes.style.color = 'blue'
                        }
                       })
                   }
                   else{
                        el.textContent = '(...)'
                        el.style.background = 'rgb(208, 255, 0)'
                        cardDes.style.color = 'black'

                        data.forEach((item)=>{
                            if(item.id === +el.dataset.id){
                                cardDes.textContent = item.description.slice(0,30)
                            }
                        })
                    }

                   

                })   
            })

            
        let btnsCart = document.querySelectorAll('.btn__cart')
        btnsCart.forEach((el) => {
            el.addEventListener('click', () => { 
                el.classList.toggle('active')   
                if(el.classList.contains('active')){
                    let find = data.find((item) => item.id === +el.dataset.id),
                    sameId = arrCart.find((item) => item.id === find.id)
                    if(sameId) {
                        sameId.counter = sameId.counter + 1  
                    } 
                    else {
                        find.counter = 1
                        arrCart.push(find)
                    }
                    if (arrCart.length > 9) {
                        countCart.textContent = '9+'
                    }else {
                        countCart.textContent = arrCart.length
                    }
                    
                    el.textContent = 'Убрать из корзины'
                    
                }
                else{
                    arrCart.forEach((item, idx)=>{
                        if(item.id === +el.dataset.id){
                            if (item.counter <= 1) {
                                arrCart.splice(idx ,1)

                            }
                           
                        }
                    })
                    el.textContent = 'В корзину'
                    countCart.textContent = arrCart.length

                }                            
                renderCart()
                    
                    
            })
        })
                  
    })
}


li.forEach((el) => {
    el.addEventListener('click', (event) => {
    category = el.textContent
    li.forEach(el => el.classList.remove('actived'))
    event.target.classList.add('actived')
        showProduct()
    })
})

btnCart.addEventListener('click', () => {
    boxCart.classList.toggle('active')  
})
loadCartFromLocalStorage()
showProduct()


