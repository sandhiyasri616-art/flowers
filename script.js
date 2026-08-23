document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle hamburger icon
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // --- Floating Petals Animation ---
    function createPetals() {
        const container = document.getElementById('petals-container');
        const petalCount = 15;

        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            
            // Randomize size
            const size = Math.random() * 15 + 5; // 5px to 20px
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            
            // Randomize start position
            petal.style.left = `${Math.random() * 100}vw`;
            
            // Randomize animation duration and delay
            const fallDuration = Math.random() * 10 + 10; // 10s to 20s
            const swayDuration = Math.random() * 3 + 2; // 2s to 5s
            const delay = Math.random() * 10;
            
            petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
            petal.style.animationDelay = `${delay}s, ${delay}s`;
            
            // Randomize rotation
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            container.appendChild(petal);
        }
    }
    
    createPetals();

    // --- Product Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // --- Shopping Cart Logic ---
    let cart = [];
    
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    // Open cart
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
    });

    // Close cart
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    });

    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    });

    // Add to cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const img = e.target.getAttribute('data-img');
            
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    img: img,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Show feedback
            const originalText = e.target.innerText;
            e.target.innerText = 'Added!';
            e.target.style.backgroundColor = '#8c2a3e';
            setTimeout(() => {
                e.target.innerText = originalText;
                e.target.style.backgroundColor = '';
            }, 1000);
        });
    });

    function updateCart() {
        // Clear container
        cartItemsContainer.innerHTML = '';
        
        let totalItems = 0;
        let totalPrice = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; margin-top: 20px;">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                totalItems += item.quantity;
                totalPrice += (item.price * item.quantity);
                
                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                
                cartItemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">₹${item.price.toFixed(2)}</div>
                        <div class="quantity-controls">
                            <button class="qty-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
                `;
                
                cartItemsContainer.appendChild(cartItemEl);
            });
        }
        
        // Update totals
        cartCount.innerText = totalItems;
        cartTotalPrice.innerText = `₹${totalPrice.toFixed(2)}`;
        
        // Add event listeners to new buttons
        attachCartEvents();
    }
    
    function attachCartEvents() {
        // Plus buttons
        const plusBtns = document.querySelectorAll('.qty-btn.plus');
        plusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if(item) {
                    item.quantity += 1;
                    updateCart();
                }
            });
        });
        
        // Minus buttons
        const minusBtns = document.querySelectorAll('.qty-btn.minus');
        minusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if(item) {
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        // Remove if quantity becomes 0
                        cart = cart.filter(i => i.id !== id);
                    }
                    updateCart();
                }
            });
        });
        
        // Remove buttons
        const removeBtns = document.querySelectorAll('.remove-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                cart = cart.filter(i => i.id !== id);
                updateCart();
            });
        });
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        if(cart.length > 0) {
            alert('Thank you for your purchase! This is a demo store.');
            cart = [];
            updateCart();
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
        } else {
            alert('Your cart is empty.');
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message. We will get back to you soon!');
            contactForm.reset();
        });
    }
    
    // Initialize empty cart state
    updateCart();
});
