// MADECAF - B2B Green Coffee Sourcing & Sample Orders
// Connecting Madagascar's Robusta Origin with Malaysian Roasters

// Product catalog data tailored to Malaysian B2B Coffee Businesses
const products = [
    {
        id: "mc-01",
        name: "Madagascar Fine Robusta (Mananjary Origin)",
        region: "Vatovavy-Fitovinany, Madagascar",
        process: "Wet-Processed (Washed)",
        grade: "Screen 18 | Specialty Grade",
        price: 18.00,
        samplePrice: 18.00,
        kgPrice: 8.50,
        category: "green-beans",
        notes: "Heavy syrupy body, deep dark cocoa, roasted macadamia nuts, and a remarkably clean finish with low acidity. Ideal for bold espresso blends and traditional kopitiam craft roasts.",
        badge: "Flagship Origin",
        icon: "☕",
        gradient: "linear-gradient(135deg, #2B1E16, #BD7E4A)"
    },
    {
        id: "mc-02",
        name: "Wild Canopy Robusta (East Coast Forest)",
        region: "Atsinanana Rainforest Corridor, Madagascar",
        process: "Natural Sun-Dried",
        grade: "Screen 16/17 | High Grown",
        price: 16.50,
        samplePrice: 16.50,
        kgPrice: 7.80,
        category: "green-beans",
        notes: "Grown wild under endemic tropical forest canopy. Notes of raw cacao nibs, cedarwood, subtle spices, and rich crema formation.",
        badge: "Wild Agroforestry",
        icon: "🌿",
        gradient: "linear-gradient(135deg, #1f140d, #8F877D)"
    },
    {
        id: "mc-03",
        name: "Sambirano Valley Robusta (Cacao Terroir)",
        region: "Sambirano River Basin, Madagascar",
        process: "Honey Processed",
        grade: "Screen 18 | Micro-Lot",
        price: 21.00,
        samplePrice: 21.00,
        kgPrice: 9.80,
        category: "micro-lot",
        notes: "Cultivated alongside Madagascar's world-famous Sambirano fine cocoa. Imparts distinct sweet fruit notes, brown sugar, and molten dark chocolate undertones.",
        badge: "Micro-Lot Reserve",
        icon: "🍫",
        gradient: "linear-gradient(135deg, #BD7E4A, #E86315)"
    },
    {
        id: "mc-04",
        name: "Malaysian Roaster Discovery Sample Kit",
        region: "Multi-Terroir Madagascar Curated Pack",
        process: "Washed & Natural Samples",
        grade: "3x 500g Roaster Cupping Samples",
        price: 45.00,
        samplePrice: 45.00,
        kgPrice: 45.00,
        category: "samples",
        notes: "The ideal starting point for Malaysian roasters: contains 500g of Mananjary Washed, 500g of Wild Canopy Natural, and 500g of Sambirano Honey with full cupping analysis sheets.",
        badge: "Sample Kit",
        icon: "📦",
        gradient: "linear-gradient(135deg, #38251a, #E86315)"
    }
];

// Shopping Cart State (saved in localStorage for persistence)
let cart = JSON.parse(localStorage.getItem('madecaf_cart')) || [];
let activePromo = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
    updateCartUI();
    setupEventListeners();
});

// Render products dynamically
function renderProducts(categoryFilter = 'all') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const filtered = categoryFilter === 'all' 
        ? products 
        : products.filter(p => p.category === categoryFilter);

    grid.innerHTML = filtered.map(p => `
        <article class="product-card" data-category="${p.category}">
            <div class="product-img-wrapper" style="background: ${p.gradient};">
                <span style="font-size: 3.5rem;">${p.icon}</span>
                <span class="product-badge">${p.badge}</span>
                <span class="product-roast-level">${p.process}</span>
            </div>
            <div class="product-info">
                <span class="product-region">${p.region}</span>
                <h3 class="product-title">${p.name}</h3>
                <p class="product-notes">${p.notes}</p>
                <div class="product-options">
                    <label for="format-${p.id}">Sample & Order Format</label>
                    <select id="format-${p.id}" onchange="updateProductPriceDisplay('${p.id}')">
                        <option value="1kg Roaster Cupping Sample" data-price="${p.price}">1kg Cupping Sample Pouch — €${p.price.toFixed(2)}</option>
                        <option value="5kg Pilot Test Bag" data-price="${(p.price * 4.2).toFixed(2)}">5kg Pilot Test Bag — €${(p.price * 4.2).toFixed(2)}</option>
                        <option value="60kg Jute Bag (B2B Sourcing Quote)" data-price="0">60kg Wholesale Sourcing (Contact for Quote)</option>
                    </select>
                </div>
                <div class="product-bottom">
                    <span class="product-price" id="price-display-${p.id}">€${p.price.toFixed(2)}</span>
                    <button class="btn-add-cart" onclick="addToCart('${p.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Add Sample
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// Filter buttons click
function setupEventListeners() {
    // Filter click
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            renderProducts(e.currentTarget.dataset.filter);
        });
    });

    // Cart toggles
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const closeCartBtn = document.getElementById('cart-close-btn');
    const overlay = document.getElementById('cart-overlay');

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);

    // AI Sommelier Quiz Trigger
    const quizForm = document.getElementById('coffee-quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', runAISommelier);
    }

    // Video modal handlers
    const videoBtn = document.getElementById('watch-promo-video-btn');
    if (videoBtn) {
        videoBtn.addEventListener('click', openVideoModal);
    }

    // Contact form submit simulation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("✨ Thank you! Your inquiry was sent to MADECAF Antananarivo.");
            contactForm.reset();
        });
    }

    // Promo code apply
    const promoBtn = document.getElementById('apply-promo-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', applyPromoCode);
    }

    // Mobile nav toggle
    const mobileBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

// Cart Management Logic
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

function updateProductPriceDisplay(productId) {
    const formatSelect = document.getElementById(`format-${productId}`);
    const priceDisplay = document.getElementById(`price-display-${productId}`);
    if (!formatSelect || !priceDisplay) return;
    const selectedOpt = formatSelect.options[formatSelect.selectedIndex];
    const price = parseFloat(selectedOpt.dataset.price);
    if (price === 0) {
        priceDisplay.textContent = 'Quote';
    } else {
        priceDisplay.textContent = `€${price.toFixed(2)}`;
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const formatSelect = document.getElementById(`format-${productId}`);
    let format = '1kg Roaster Cupping Sample';
    let unitPrice = product.price;

    if (formatSelect) {
        const selectedOpt = formatSelect.options[formatSelect.selectedIndex];
        format = selectedOpt.value;
        const parsedPrice = parseFloat(selectedOpt.dataset.price);
        if (parsedPrice === 0) {
            // It's a wholesale request -> scroll to contact
            window.location.href = "#contact";
            showToast("Redirected to Contact: Inquire for 60kg wholesale container lots.");
            return;
        }
        unitPrice = parsedPrice;
    }

    const existingIndex = cart.findIndex(item => item.id === productId && item.format === format);

    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: unitPrice,
            format: format,
            qty: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast(`Added 1× "${product.name}" (${format}) to cart`);
    
    // Auto open drawer to provide clear visual feedback
    const drawer = document.getElementById('cart-drawer');
    if (drawer && !drawer.classList.contains('open')) {
        toggleCart();
    }
}

function changeQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

function removeItem(index) {
    if (!cart[index]) return;
    const removedName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showToast(`Removed "${removedName}" from cart`);
}

function saveCart() {
    localStorage.setItem('madecaf_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const countBadge = document.getElementById('cart-badge');
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');

    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    if (countBadge) countBadge.textContent = totalCount;

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty-msg">
                <p style="font-size: 2.5rem; margin-bottom: 10px;">☕</p>
                <p>Your sample cart is currently empty.</p>
                <p style="font-size: 0.8rem; margin-top: 6px;">Explore our Malagasy Robusta green coffee sample options above.</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = '€0.00';
        if (discountEl) discountEl.textContent = '-€0.00';
        if (totalEl) totalEl.textContent = '€0.00';
        return;
    }

    container.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
            <div class="cart-item-img">📦</div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-grind">${item.format}</div>
                <div class="cart-item-price">€${(item.price * item.qty).toFixed(2)} <span style="font-size:0.75rem; color:#8F877D;">(€${item.price.toFixed(2)}/unit)</span></div>
                <div class="cart-qty-ctrl">
                    <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
                    <span style="font-size: 0.85rem; font-weight:600; min-width:18px; text-align:center;">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
                    <button class="cart-remove-btn" onclick="removeItem(${idx})" title="Remove">✕</button>
                </div>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let discount = 0;

    if (activePromo === 'WELCOME15') {
        discount = subtotal * 0.15;
    } else if (activePromo === 'MADAGASCAR') {
        discount = subtotal * 0.10;
    }

    const total = Math.max(0, subtotal - discount);

    if (subtotalEl) subtotalEl.textContent = `€${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-€${discount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;
}

// Promo Code validation
function applyPromoCode() {
    const input = document.getElementById('promo-code-input');
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    if (code === 'WELCOME15') {
        activePromo = 'WELCOME15';
        showToast("🎉 Promo code applied! 15% discount deducted.");
    } else if (code === 'MADAGASCAR') {
        activePromo = 'MADAGASCAR';
        showToast("🌴 Madagascar promo code applied! 10% discount.");
    } else {
        showToast("⚠️ Invalid promo code. Try 'WELCOME15'");
        return;
    }
    updateCartUI();
}

// Checkout simulation modal
function initiateCheckout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.add('open');
    }
}

// Toast notification trigger
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

// AI Sommelier Quiz Function
function runAISommelier(e) {
    e.preventDefault();
    const roastPref = document.getElementById('quiz-roast').value;
    const brewPref = document.getElementById('quiz-brew').value;
    const flavorPref = document.getElementById('quiz-flavor').value;

    let match = products[0]; // default Laurina

    if (flavorPref === 'cocoa' || roastPref === 'dark') {
        match = products[1]; // Mananjary Robusta
    } else if (flavorPref === 'fruity' || brewPref === 'filter') {
        match = products[2]; // Sambirano Valley
    } else if (flavorPref === 'rare' || brewPref === 'any') {
        match = products[3]; // Peaberry Reserve
    }

    const resultBox = document.getElementById('quiz-result');
    if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = `
            <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 8px;">
                <span style="font-size: 1.8rem;">🤖</span>
                <div>
                    <h4 style="color: var(--color-primary); margin:0;">AI Sommelier Recommendation: <strong>${match.name}</strong></h4>
                    <span style="font-size:0.8rem; color: var(--color-accent); font-weight:700;">Matched based on your profile (${roastPref} roast, ${brewPref} method, ${flavorPref} notes)</span>
                </div>
            </div>
            <p style="font-size: 0.9rem; color: var(--color-primary); margin: 8px 0;">${match.notes}</p>
            <div style="display: flex; gap: 12px; align-items: center; margin-top: 10px;">
                <span style="font-size: 1.1rem; font-weight:700; color:var(--color-primary);">€${match.price.toFixed(2)}</span>
                <button class="btn btn-primary" style="padding: 6px 14px; font-size: 0.85rem;" onclick="addToCart('${match.id}')">Add Recommended Bean to Cart</button>
            </div>
        `;
    }
}

// Video Modal logic
function openVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.classList.add('open');
        playGeneratedVideoSimulation();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('open');
    }
}

// Canvas-based dynamic Promo Video Simulation (30-45s AI coffee cinematic experience)
function playGeneratedVideoSimulation() {
    const canvas = document.getElementById('promo-video-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let animationId;

    const scenes = [
        { title: "MADECAF | Malagasy Robusta for Malaysian Roasters", subtitle: "Connecting pristine origin with Southeast Asian coffee craft", bg: "#2B1E16" },
        { title: "Sample-First Discovery", subtitle: "1kg & 5kg cupping packs with screen 18 grading & moisture data", bg: "#473224" },
        { title: "Direct Business Enquiries", subtitle: "Transparent sourcing dialogue directly with Madagascar origin", bg: "#BD7E4A" },
        { title: "Discover Madagascar, One bean at a time", subtitle: "Start your sourcing journey with MADECAF today", bg: "#E86315" }
    ];

    function draw() {
        if (!document.getElementById('video-modal').classList.contains('open')) {
            cancelAnimationFrame(animationId);
            return;
        }

        const sceneIndex = Math.floor((frame / 120) % scenes.length);
        const currentScene = scenes[sceneIndex];

        ctx.fillStyle = currentScene.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ambient particles (steam/dust effect)
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        for (let i = 0; i < 20; i++) {
            const px = ((frame * (i + 1) * 1.5) % canvas.width);
            const py = ((frame * 2 + i * 25) % canvas.height);
            ctx.beginPath();
            ctx.arc(px, py, (i % 3) + 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw Central Emblem
        ctx.fillStyle = "#F5F2EB";
        ctx.font = "bold 24px 'Chesna Grotesk', 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(currentScene.title, canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = "15px 'Chesna Grotesk', 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FAF8F5";
        ctx.fillText(currentScene.subtitle, canvas.width / 2, canvas.height / 2 + 25);

        // Progress bar at the bottom
        const progress = ((frame % 480) / 480) * canvas.width;
        ctx.fillStyle = "#E86315";
        ctx.fillRect(0, canvas.height - 8, progress, 8);

        frame++;
        animationId = requestAnimationFrame(draw);
    }

    animationId = requestAnimationFrame(draw);
}

