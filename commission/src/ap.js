document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Chibi Dessert/Food', img: '1.png', price: 46 },
            { id: 2, name: 'YCH #1', img: '2.png', price: 15 },
            { id: 3, name: 'Chibi Custom', img: '3.png', price: 25 },
            { id: 4, name: 'YCH #4', img: '4.png', price: 15 },
            { id: 5, name: 'YCH #3', img: '5.png', price: 15 },
            { id: 6, name: 'Design Character/Outfit', img: '6.png', price: 66 },
            { id: 7, name: 'YCH Xmas', img: '7.png', price: 15 },
            { id: 8, name: 'Additional', img: '8.png', price: 0 },
        ],

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


//kode untuk whatsapp
const formatMessage = (obj) => {
    return `Data Customer
    Nama : ${obj.name}
    Email : ${obj.email}
    No HP : ${obj.sosmed}
    
    Data Pesanan
    ${JSON.parse(obj.items).map((item)=> `${item.name} (${item.quantity} x ${usd(item.total)}) \n`)}
    Total: ${usd(obj.total)}
    Terima Kasih ya`;
}

// konversi ke rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(number);
};