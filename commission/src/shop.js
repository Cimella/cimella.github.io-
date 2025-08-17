document.addEventListener('alpine:init', () => {
    Alpine.data('shop', () => ({
        shopItems: [
            { id: 101, name: 'Brush', img: '1.png', price: 1 },
            { id: 102, name: 'Brush2', img: '2.png', price: 1 },
            { id: 103, name: 'Adoption', img: '3.png', price: 35 }
        ],
    usd(price) {
    return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
        }).format(price);
    }
    }));
    

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            const cartItem = this.items.find((item) => item.id === newItem.id);

            if(!cartItem) {
            this.items.push({...newItem, quantity: 1, total: newItem.price });
            this.quantity++;
            this.total += newItem.price;
            } else {
                this.items = this.items.map((item) => {
                    if(item.id !== newItem.id) {
                        return item;
                    } else {
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
        },
        remove(id) {
            //ambil item yg akan diremove berdasarkan id
            const cartItem = this.items.find((item)=> item.id === id);
            //jika item lebih dari 1
            if(cartItem.quantity > 1) {
                //telusuri satu persatu
                this.items = this.items.map((item)=>{
                    //jika bukan item yang diklik
                    if(item.id !== id){
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
        } else if(cartItem.quantity === 1) {
            //jika item sisa 1
            this.items = this.items.filter((item)=> item.id !== id);
            this.quantity--;
            this.total -= cartItem.price;
        }
    },       
    });
});



//form validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    for(let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

//kirim data ketika tombol pay diklik
checkoutButton.addEventListener('click', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open('http://wa.me/6283871537478?text=' + encodeURIComponent(message));



});



// Fix the formatMessage function (add .join())
const formatMessage = (obj) => {
    return `Data Customer
    Nama : ${obj.name}
    Email : ${obj.email}
    No HP : ${obj.sosmed}
    
    Data Pesanan
    ${JSON.parse(obj.items).map((item)=> `${item.name} (${item.quantity} x ${usd(item.total)})`).join('\n')}
    Total: ${usd(obj.total)}
    Terima Kasih ya`;
};

// Change the rupiah function to usd (proper USD formatting)
const USD = (number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(number);
};

