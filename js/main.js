// back tot top

let backToTopBtn = document.querySelector('.back-to-top')

window.onscroll = () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = 'flex'
    } else {
        backToTopBtn.style.display = 'none'
    }
}

// top nav menu

let menuItems = document.getElementsByClassName('menu-item')

Array.from(menuItems).forEach((item, index) => {
    item.onclick = (e) => {
        let currMenu = document.querySelector('.menu-item.active')
        currMenu.classList.remove('active')
        item.classList.add('active')
    }
})

// food category

let foodMenuList = document.querySelector('.food-item-wrap')

let foodCategory = document.querySelector('.food-category')

let categories = foodCategory.querySelectorAll('button')

Array.from(categories).forEach((item, index) => {
    item.onclick = (e) => {
        let currCat = foodCategory.querySelector('button.active')
        currCat.classList.remove('active')
        e.target.classList.add('active')
        foodMenuList.classList ='food-item-wrap '+ e.target.getAttribute('data-food-type')
    }
})

// on scroll animation

let scroll = window.requestAnimationFrame || function(callback) {window.setTimeout(callback, 1000/60)}

let elToShow = document.querySelectorAll('.play-on-scroll')

isElInViewPort = (el) => {
    let rect = el.getBoundingClientRect()

    return (
        (rect.top <= 0 && rect.bottom >= 0)
        ||
        (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) && rect.top <= (window.innerHeight || document.documentElement.clientHeight))
        ||
        (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    )
}

loop = () => {
    elToShow.forEach((item, index) => {
        if (isElInViewPort(item)) {
            item.classList.add('start')
        } else {
            item.classList.remove('start')
        }
    })

    scroll(loop)
}

loop()

// Cart functionality
let cart = []

// DOM Elements
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartCountElement = document.getElementById('cart-count')
const cartTotalElement = document.getElementById('cart-total')
const mainCartBtn = document.getElementById('main-cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.getElementById('clear-cart')
const checkoutBtn = document.getElementById('checkout-btn')
const minimumOrderNotice = document.getElementById('minimum-order-notice')

// Minimum order amount (equivalent to $20 USD in CFA)
const MINIMUM_ORDER_AMOUNT = 20.00
const CFA_CONVERSION_RATE = 600; // 1 USD = 600 CFA (approximate)

// Currency display function for cart
function formatCurrency(amount) {
    const cfaAmount = amount * CFA_CONVERSION_RATE;
    return `${cfaAmount.toLocaleString()} CFA`; // Format with commas
}

// Convert USD price to CFA for display
function convertToCFA(usdAmount) {
    return usdAmount * CFA_CONVERSION_RATE;
}

// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.cart-btn') && e.target.closest('.food-item')) {
        const cartBtn = e.target.closest('.cart-btn')
        const name = cartBtn.getAttribute('data-name')
        const price = parseFloat(cartBtn.getAttribute('data-price'))
        const image = cartBtn.getAttribute('data-image')
        
        if (name && price && image) {
            addToCart(name, price, image)
        }
    }
})

// Open cart modal
mainCartBtn.addEventListener('click', function() {
    cartModal.classList.add('active')
    updateCartDisplay()
})

// Close cart modal
closeCartBtn.addEventListener('click', function() {
    cartModal.classList.remove('active')
})

// Close modal when clicking outside
cartModal.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.classList.remove('active')
    }
})

// Clear cart
clearCartBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = []
        updateCartDisplay()
        updateCartCount()
    }
})

// Checkout functionality
checkoutBtn.addEventListener('click', function() {
    if (checkoutBtn.disabled) {
        return
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    if (total >= MINIMUM_ORDER_AMOUNT) {
        // Simulate checkout process
        const cfaTotal = total * CFA_CONVERSION_RATE;
        alert(`Asante! Thank you for your order!\n\nTotal: ${cfaTotal.toLocaleString()} CFA\n\nYour authentic African feast will be prepared with love and delivered shortly. Karibu tena! (Welcome back!)`)
        
        // Clear cart after successful checkout
        cart = []
        updateCartDisplay()
        updateCartCount()
        
        // Close modal
        cartModal.classList.remove('active')
    } else {
        const cfaMinimum = MINIMUM_ORDER_AMOUNT * CFA_CONVERSION_RATE;
        alert(`Minimum order amount is ${cfaMinimum.toLocaleString()} CFA. Please add more delicious African dishes to your order.`)
    }
})

// Add item to cart
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name)
    
    if (existingItem) {
        existingItem.quantity += 1
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        })
    }
    
    updateCartCount()
    
    // Show notification (optional)
    showNotification(`${name} added to cart!`)
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name)
    updateCartDisplay()
    updateCartCount()
}

// Update item quantity
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name)
    if (item) {
        item.quantity += change
        if (item.quantity <= 0) {
            removeFromCart(name)
        } else {
            updateCartDisplay()
            updateCartCount()
        }
    }
}

// Update cart count in navigation
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCountElement.textContent = totalItems
    
    if (totalItems === 0) {
        cartCountElement.classList.add('hidden')
    } else {
        cartCountElement.classList.remove('hidden')
    }
}

// Update cart display in modal
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>'
        cartTotalElement.textContent = '0 CFA'
        updateCheckoutButton(0)
        return
    }
    
    let cartHTML = ''
    let total = 0
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity
        total += itemTotal
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-left">
                    <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">${formatCurrency(item.price)} each</p>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <div class="cart-item-right">
                    <div class="cart-item-amount">${formatCurrency(itemTotal)}</div>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')" title="Remove item">
                        <i class="bx bx-x"></i>
                    </button>
                </div>
            </div>
        `
    })
    
    cartItemsContainer.innerHTML = cartHTML
    cartTotalElement.textContent = `${(total * CFA_CONVERSION_RATE).toLocaleString()} CFA`
    updateCheckoutButton(total)
}

// Update checkout button state based on total
function updateCheckoutButton(total) {
    if (total < MINIMUM_ORDER_AMOUNT) {
        checkoutBtn.disabled = true
        minimumOrderNotice.style.display = 'block'
    } else {
        checkoutBtn.disabled = false
        minimumOrderNotice.style.display = 'none'
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = 'cart-notification'
    notification.textContent = message
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: black;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        font-weight: 600;
        border: 1px solid rgba(0, 0, 0, 0.1);
    `
    
    document.body.appendChild(notification)
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease'
        setTimeout(() => {
            document.body.removeChild(notification)
        }, 300)
    }, 3000)
}

// Add CSS for notifications
const notificationStyles = document.createElement('style')
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(notificationStyles)

// Initialize cart count on page load
updateCartCount()

// mobile nav

let bottomNavItems = document.querySelectorAll('.mb-nav-item')

let bottomMove = document.querySelector('.mb-move-item')

bottomNavItems.forEach((item, index) => {
    item.onclick = (e) => {
        console.log('object')
        let crrItem = document.querySelector('.mb-nav-item.active')
        crrItem.classList.remove('active')
        item.classList.add('active')
        bottomMove.style.left = index * 25 + '%'
    }
})

// App Screen Animation with sophisticated transitions
let currentScreen = 0;
const screens = ['screen-menu', 'screen-adding', 'screen-tracking'];
let animationInterval;
let isTransitioning = false;
// Promo timer state (prevent multiple overlapping intervals causing jitter)
let promoTimerInterval = null;
let promoEndTime = null; // timestamp in ms
const PROMO_DURATION_MS = (2 * 60 + 45) * 1000; // 2m45s duration

function updatePromoDigits(digits) {
    if (!digits || digits.length < 2) return;
    if (!promoEndTime) return; // not initialized yet
    let remaining = promoEndTime - Date.now();
    if (remaining <= 0) {
        // Auto-loop: reset end time forward by duration
        promoEndTime = Date.now() + PROMO_DURATION_MS;
        remaining = promoEndTime - Date.now();
    }
    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    digits[0].textContent = minutes;
    digits[1].textContent = seconds.toString().padStart(2, '0');
}

function switchToScreen(screenIndex, direction = 'forward') {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const currentActiveScreen = document.querySelector('.app-screen.active');
    const newScreen = document.getElementById(screens[screenIndex]);
    
    if (currentActiveScreen && newScreen) {
        // Add exit animation to current screen
        currentActiveScreen.classList.add(direction === 'forward' ? 'slide-out-left' : 'slide-out-right');
        currentActiveScreen.classList.remove('active');
        
        // Prepare new screen
        newScreen.classList.add(direction === 'forward' ? 'slide-in-right' : 'slide-in-left');
        
        setTimeout(() => {
            // Activate new screen
            newScreen.classList.add('active');
            
            // Clean up old screen
            setTimeout(() => {
                currentActiveScreen.classList.remove('slide-out-left', 'slide-out-right');
                newScreen.classList.remove('slide-in-right', 'slide-in-left');
                isTransitioning = false;
                
                // Trigger screen-specific animations
                triggerScreenAnimations(screenIndex);
            }, 100);
        }, 50);
    } else if (newScreen) {
        newScreen.classList.add('active');
        isTransitioning = false;
        triggerScreenAnimations(screenIndex);
    }
}

function triggerScreenAnimations(screenIndex) {
    const screen = document.getElementById(screens[screenIndex]);
    
    switch(screenIndex) {
        case 0: // Menu screen
            animateMenuScreen(screen);
            break;
        case 1: // Adding screen
            animateAddingScreen(screen);
            break;
        case 2: // Tracking screen
            animateTrackingScreen(screen);
            break;
    }
}

function animateMenuScreen(screen) {
    // Animate search bar focus
    const searchBar = screen.querySelector('.search-bar');
    setTimeout(() => {
        searchBar.classList.add('focused');
        setTimeout(() => {
            searchBar.classList.remove('focused');
        }, 1500);
    }, 500);
    
    // Animate promo timer
    animatePromoTimer(screen);
    
    // Animate dish card hover
    const dishCard = screen.querySelector('.featured-dish-card');
    setTimeout(() => {
        dishCard.style.transform = 'translateY(-4px)';
        setTimeout(() => {
            dishCard.style.transform = '';
        }, 1000);
    }, 1000);
}

function animateAddingScreen(screen) {
    const addButton = screen.querySelector('.add-to-cart-fancy');
    const progressBar = screen.querySelector('.progress-fill');
    
    // Start progress animation
    setTimeout(() => {
        progressBar.style.animation = 'progress-fill 2s ease-in-out forwards';
    }, 500);
    
    // Simulate button loading
    setTimeout(() => {
        addButton.classList.add('loading');
        
        setTimeout(() => {
            addButton.classList.remove('loading');
            addButton.classList.add('success');
            
            setTimeout(() => {
                addButton.classList.remove('success');
            }, 1000);
        }, 1500);
    }, 1000);
}

// Global timer management to prevent overlapping intervals
let deliveryTimerInterval = null;
let isDeliveryAnimationRunning = false;
let currentCountdownValue = 15; // Fixed: Initialize to 15 instead of 21
let isPersistentTimerRunning = false;

// Persistent delivery timer that runs regardless of active screen
function startPersistentDeliveryTimer() {
    if (isPersistentTimerRunning) {
        console.log('Persistent timer already running');
        return;
    }
    
    // Clear any existing intervals first
    clearDeliveryTimer();
    
    isPersistentTimerRunning = true;
    currentCountdownValue = 15; // Always start fresh at 15
    
    console.log('Starting persistent delivery timer from:', currentCountdownValue);
    
    deliveryTimerInterval = setInterval(() => {
        currentCountdownValue--;
        console.log('Countdown:', currentCountdownValue);
        
        // Update all tracking screens (visible or not)
        updateAllTrackingScreens();
        
        // Handle state transitions
        if (currentCountdownValue === 10) {
            console.log('Switching to Out for Delivery at 10');
            updateDeliveryStatus('out-for-delivery');
        }
        
        if (currentCountdownValue <= 0) {
            console.log('Delivery completed');
            
            // IMPORTANT: Clear the interval immediately to prevent negative numbers
            clearDeliveryTimer();
            isPersistentTimerRunning = false;
            
            // Set final display value to 0
            currentCountdownValue = 0;
            updateAllTrackingScreens();
            
            updateDeliveryStatus('delivered');
            
            // Reset after 5 seconds
            setTimeout(() => {
                resetPersistentTimer();
            }, 5000);
        }
    }, 750);
}

function updateAllTrackingScreens() {
    // Find all tracking screens and update them
    const trackingScreens = document.querySelectorAll('#screen-tracking');
    
    trackingScreens.forEach(screen => {
        const timeNumber = screen.querySelector('.time-number');
        if (timeNumber) {
            timeNumber.textContent = currentCountdownValue;
        }
    });
}

function updateDeliveryStatus(status) {
    const trackingScreens = document.querySelectorAll('#screen-tracking');
    
    trackingScreens.forEach(screen => {
        const allTimelineItems = screen.querySelectorAll('.timeline-item');
        const preparingItem = allTimelineItems[1];
        const onTheWayItem = allTimelineItems[2];
        const driverPin = screen.querySelector('.driver-pin');
        const kitchenText = screen.querySelector('.kitchen-text');
        
        if (status === 'out-for-delivery') {
            // Complete "Preparing Food"
            if (preparingItem) {
                preparingItem.classList.remove('active');
                preparingItem.classList.add('completed');
                const prepIcon = preparingItem.querySelector('.timeline-icon');
                if (prepIcon) {
                    prepIcon.style.background = '#10b981';
                    const prepIconElement = prepIcon.querySelector('i');
                    if (prepIconElement) {
                        prepIconElement.className = 'bx bx-check';
                    }
                }
                const prepAnimation = preparingItem.querySelector('.timeline-animation');
                if (prepAnimation) prepAnimation.classList.remove('active');
            }
            
            // Activate "On the Way"
            if (onTheWayItem) {
                onTheWayItem.classList.add('active');
                const wayIcon = onTheWayItem.querySelector('.timeline-icon');
                if (wayIcon) wayIcon.style.background = '#f39c12';
                const wayAnimation = onTheWayItem.querySelector('.timeline-animation');
                if (wayAnimation) wayAnimation.classList.add('active');
            }
            
            // Update kitchen status
            if (kitchenText) {
                kitchenText.textContent = 'Out for Delivery';
                kitchenText.style.background = '#fef3c7';
            }
        }
        
        if (status === 'delivered') {
            // Stop car at destination
            if (driverPin) {
                driverPin.style.left = '270px';
                driverPin.style.opacity = '1';
                driverPin.style.animation = 'none';
                driverPin.style.transform = 'translateY(-50%)';
            }
            
            // Complete "On the Way"
            if (onTheWayItem) {
                onTheWayItem.classList.remove('active');
                onTheWayItem.classList.add('completed');
                const wayIcon = onTheWayItem.querySelector('.timeline-icon');
                if (wayIcon) wayIcon.style.background = '#10b981';
                const wayAnimation = onTheWayItem.querySelector('.timeline-animation');
                if (wayAnimation) wayAnimation.classList.remove('active');
            }
            
            // Update status to delivered
            if (kitchenText) {
                kitchenText.textContent = 'Delivered';
                kitchenText.style.background = '#dcfce7';
            }
        }
    });
}

function resetPersistentTimer() {
    console.log('Resetting persistent timer');
    
    clearDeliveryTimer();
    isPersistentTimerRunning = false;
    currentCountdownValue = 15;
    
    // Reset all tracking screens
    const trackingScreens = document.querySelectorAll('#screen-tracking');
    
    trackingScreens.forEach(screen => {
        const timeNumber = screen.querySelector('.time-number');
        const allTimelineItems = screen.querySelectorAll('.timeline-item');
        const preparingItem = allTimelineItems[1];
        const onTheWayItem = allTimelineItems[2];
        const driverPin = screen.querySelector('.driver-pin');
        const kitchenText = screen.querySelector('.kitchen-text');
        
        // Reset countdown display
        if (timeNumber) timeNumber.textContent = currentCountdownValue;
        
        // Reset timeline
        if (preparingItem) {
            preparingItem.classList.remove('completed');
            preparingItem.classList.add('active');
            const prepIcon = preparingItem.querySelector('.timeline-icon');
            if (prepIcon) {
                prepIcon.style.background = '#f39c12';
                const prepIconElement = prepIcon.querySelector('i');
                if (prepIconElement) {
                    prepIconElement.className = 'bx bx-loader-alt';
                }
            }
            const prepAnimation = preparingItem.querySelector('.timeline-animation');
            if (prepAnimation) prepAnimation.classList.add('active');
        }
        
        if (onTheWayItem) {
            onTheWayItem.classList.remove('completed', 'active');
            const wayIcon = onTheWayItem.querySelector('.timeline-icon');
            if (wayIcon) wayIcon.style.background = '#e5e7eb';
            const wayAnimation = onTheWayItem.querySelector('.timeline-animation');
            if (wayAnimation) wayAnimation.classList.remove('active');
        }
        
        // Reset car
        if (driverPin) {
            driverPin.style.left = '45%';
            driverPin.style.opacity = '1';
            driverPin.style.animation = 'drive 4s ease-in-out infinite';
            driverPin.style.transform = 'translateY(-50%)';
        }
        
        // Reset kitchen status
        if (kitchenText) {
            kitchenText.textContent = 'In Kitchen';
            kitchenText.style.background = '#dcfce7';
        }
    });
    
    // Restart after a short delay
    setTimeout(() => {
        startPersistentDeliveryTimer();
    }, 1000);
}

function animateTrackingScreen(screen) {
    // Start persistent timer instead of screen-specific timer
    if (!isPersistentTimerRunning) {
        startPersistentDeliveryTimer();
    } else {
        console.log('Persistent timer already running, syncing screen...');
        updateAllTrackingScreens();
    }
}

function clearDeliveryTimer() {
    if (deliveryTimerInterval) {
        clearInterval(deliveryTimerInterval);
        deliveryTimerInterval = null;
        console.log('Cleared delivery timer');
    }
}

function animatePromoTimer(screen) {
    const digits = screen.querySelectorAll('.digit');
    if (digits.length < 2) return;

    // Initialize end time only once
    if (!promoEndTime) {
        promoEndTime = Date.now() + PROMO_DURATION_MS;
    }

    // Initial render
    updatePromoDigits(digits);

    // Avoid creating multiple intervals
    if (promoTimerInterval) return;
    promoTimerInterval = setInterval(() => {
        if (!document.body.contains(digits[0])) {
            clearInterval(promoTimerInterval);
            promoTimerInterval = null;
            return;
        }
        updatePromoDigits(digits);
    }, 1000);
}

// Manual control functions (no auto-switching)
function startAppAnimation() {
    // This function is now disabled - using manual click navigation instead
    console.log('Auto-animation disabled - using manual click navigation');
}

function pauseAnimation() {
    // Not needed for manual control
}

function resumeAnimation() {
    // Not needed for manual control
}

// Enhanced interaction handlers
document.addEventListener('DOMContentLoaded', function() {
    // Start with menu screen
    switchToScreen(0);
    
    // Don't start automatic animation - we want manual control
    // setTimeout(() => {
    //     startAppAnimation();
    // }, 2000);
    
    // Add interaction handlers
    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        // Add click handler for manual navigation
        phoneMockup.addEventListener('click', () => {
            console.log('Phone clicked - switching to next screen');
            const nextScreen = (currentScreen + 1) % screens.length;
            switchToScreen(nextScreen);
            currentScreen = nextScreen;
        });
        
        // Optional: Add visual feedback on hover
        phoneMockup.style.cursor = 'pointer';
        phoneMockup.addEventListener('mouseenter', () => {
            phoneMockup.style.transform = 'scale(1.02)';
            phoneMockup.style.transition = 'transform 0.2s ease';
        });
        phoneMockup.addEventListener('mouseleave', () => {
            phoneMockup.style.transform = 'scale(1)';
        });
    }
    
    // Add search bar interaction
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchInput.closest('.search-bar').classList.add('focused');
        });
        
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchInput.closest('.search-bar').classList.remove('focused');
            }, 300);
        });
    }
});

// CSS class helpers for enhanced animations
function addTemporaryClass(element, className, duration = 1000) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, duration);
}

// DARK MODE FUNCTIONALITY
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme preference or default to light mode
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

function setTheme(theme) {
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'bx bx-moon';
        localStorage.setItem('theme', 'dark');
    } else {
        body.removeAttribute('data-theme');
        themeIcon.className = 'bx bx-sun';
        localStorage.setItem('theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add rotation animation
    themeToggle.classList.add('rotating');
    setTimeout(() => {
        themeToggle.classList.remove('rotating');
    }, 500);
    
    setTheme(newTheme);
    
    // Show a subtle notification
    showThemeNotification(newTheme);
}

function showThemeNotification(theme) {
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.textContent = `${theme === 'dark' ? 'Dark' : 'Light'} mode activated`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-color);
        padding: 12px 20px;
        border-radius: 25px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 10000;
        font-size: 0.9rem;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Event listener for theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});