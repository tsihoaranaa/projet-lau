// ==========================================================================
// MADECAF — Apple-Inspired Interactive Engine
// Smooth view transitions, cinematic canvas video player,
// dynamic cart state, and AI blend sommelier.
// ==========================================================================

// Catalog data adapted for B2B Malagasy Robusta Green Coffee for Malaysian Roasters
// Currency: Malaysian Ringgit (RM)
const products = [
    {
        id: "mc-01",
        name: "Madagascar Fine Robusta (Mananjary)",
        region: "Vatovavy Terroir, Madagascar",
        process: "Wet-Processed (Washed)",
        grade: "Screen 18 | Specialty Grade",
        price: 85.00,
        category: "green-beans",
        notes: "Heavy syrupy body, deep dark cocoa, roasted macadamia nuts, and a remarkably clean finish with zero bitterness. Ideal for bold espresso crema and modern specialty roasts in Malaysia.",
        badge: "Flagship Origin",
        icon: "☕",
        gradient: "linear-gradient(135deg, #2F3630 0%, #3D4433 50%, #7A4B2A 100%)"
    },
    {
        id: "mc-02",
        name: "Wild Canopy Robusta (East Coast)",
        region: "Atsinanana Rainforest Corridor",
        process: "Natural Sun-Dried",
        grade: "Screen 16/17 | High Grown",
        price: 78.00,
        category: "green-beans",
        notes: "Harvested wild beneath native tropical forest canopies. Imparts raw cacao nibs, cedarwood, subtle clove spice, and intense velvety mouthfeel.",
        badge: "Wild Agroforestry",
        icon: "🌿",
        gradient: "linear-gradient(135deg, #363F32 0%, #505540 50%, #8A7A6E 100%)"
    },
    {
        id: "mc-03",
        name: "Sambirano Valley Robusta (Cacao Terroir)",
        region: "Ambanja River Basin, Madagascar",
        process: "Honey Processed",
        grade: "Screen 18 | Micro-Lot",
        price: 98.00,
        category: "micro-lot",
        notes: "Cultivated alongside Madagascar's world-renowned fine cocoa plantations. Transmits notes of warm molasses, dark chocolate shavings, and dried plums.",
        badge: "Micro-Lot Reserve",
        icon: "🍫",
        gradient: "linear-gradient(135deg, #505540 0%, #7A4B2A 50%, #A48866 100%)"
    },
    {
        id: "mc-04",
        name: "Malaysian Roaster Discovery Sample Kit",
        region: "Curated 3-Terroir Cupping Set",
        process: "Washed & Natural Samples",
        grade: "3x 500g Roaster Lab Pouches",
        price: 210.00,
        category: "samples",
        notes: "The definitive sample starter kit for Malaysian roasters: 500g of Mananjary Washed, 500g of Wild Canopy Natural, and 500g of Sambirano Honey with green bean density & moisture logs.",
        badge: "Complete Set",
        icon: "📦",
        gradient: "linear-gradient(135deg, #2F3630 0%, #71755E 50%, #7A4B2A 100%)"
    }
];

// Shopping Cart State
let cart = JSON.parse(localStorage.getItem('madecaf_cart')) || [];
let activePromo = null;

// Apple Video Cinema State
let videoAnimationId = null;
let isVideoPlaying = true;
let videoFrame = 0;

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initScrollReveal();
    renderProducts('all');
    updateCartUI();
    setupEventListeners();
    initHeroCinema();
});

// Apple-style View Transition Curtain
function initPageTransitions() {
    const curtain = document.createElement('div');
    curtain.className = 'page-transition-curtain';
    document.body.appendChild(curtain);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === 'javascript:void(0)') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                // Smooth scroll with Apple ease
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Apple-style Scroll Observer for Fade-in & Scale Reveal
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// Render Apple-style Hardware/Product Cards
function renderProducts(category = 'all') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    grid.innerHTML = filtered.map(p => `
        <article class="product-apple-card reveal-on-scroll is-visible" data-category="${p.category}">
            <div class="product-hero-visual" style="background: ${p.gradient};">
                <span style="font-size: 3.8rem; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.3));">${p.icon}</span>
                <span class="product-chip-badge">${p.badge}</span>
                <span class="product-process-badge">${p.process}</span>
            </div>
            <div class="product-apple-body">
                <span class="product-region-label">${p.region}</span>
                <h3>${p.name}</h3>
                <p>${p.notes}</p>

                <div class="apple-select-box">
                    <label for="format-${p.id}">Sample & Order Format</label>
                    <select id="format-${p.id}" onchange="updateProductPriceDisplay('${p.id}')">
                        <option value="1kg Roaster Cupping Sample" data-price="${p.price}">1kg Cupping Sample Pouch — RM ${p.price.toFixed(2)}</option>
                        <option value="5kg Pilot Test Bag" data-price="${(p.price * 4.2).toFixed(2)}">5kg Pilot Test Bag — RM ${(p.price * 4.2).toFixed(2)}</option>
                        <option value="60kg Jute Bag (B2B Sourcing Quote)" data-price="0">60kg Wholesale Sourcing (Contact for Quote)</option>
                    </select>
                </div>

                <div class="product-apple-footer">
                    <span class="product-price-apple" id="price-display-${p.id}">RM ${p.price.toFixed(2)}</span>
                    <button class="btn btn-dark" style="padding: 8px 18px; font-size: 0.84rem;" onclick="addToCart('${p.id}')">
                        Add Sample
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

function updateProductPriceDisplay(productId) {
    const select = document.getElementById(`format-${productId}`);
    const display = document.getElementById(`price-display-${productId}`);
    if (!select || !display) return;
    const opt = select.options[select.selectedIndex];
    const price = parseFloat(opt.dataset.price);
    display.textContent = price === 0 ? 'Quote' : `RM ${price.toFixed(2)}`;
}

// Shopping Cart Logic
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn-apple').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn-apple').forEach(b => b.classList.remove('active'));
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

    // AI Sommelier Quiz
    const quizForm = document.getElementById('coffee-quiz-form');
    if (quizForm) quizForm.addEventListener('submit', runAISommelier);

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("✨ Inquiry sent! Our sourcing team will connect with your roastery.");
            contactForm.reset();
        });
    }

    // Promo Code
    const promoBtn = document.getElementById('apply-promo-btn');
    if (promoBtn) promoBtn.addEventListener('click', applyPromoCode);

    // Mobile nav
    const mobileBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const select = document.getElementById(`format-${productId}`);
    let format = '1kg Roaster Cupping Sample';
    let unitPrice = product.price;

    if (select) {
        const opt = select.options[select.selectedIndex];
        format = opt.value;
        const parsedPrice = parseFloat(opt.dataset.price);
        if (parsedPrice === 0) {
            window.location.href = "#contact";
            showToast("Redirecting to Contact for 60kg wholesale container quote.");
            return;
        }
        unitPrice = parsedPrice;
    }

    const existing = cart.find(item => item.id === productId && item.format === format);
    if (existing) {
        existing.qty += 1;
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
    showToast(`Added: ${product.name} (${format})`);
    
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
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showToast("Sample removed from cart");
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
            <div style="text-align: center; color: var(--color-text-muted); padding: 50px 0;">
                <p style="font-size: 2.8rem; margin-bottom: 12px;">☕</p>
                <p style="font-size: 1.05rem; font-weight: 600; color: var(--color-primary);">Your sample cart is empty</p>
                <p style="font-size: 0.84rem; margin-top: 6px;">Explore our Malagasy Robusta green coffee sample options above.</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = 'RM 0.00';
        if (discountEl) discountEl.textContent = '-RM 0.00';
        if (totalEl) totalEl.textContent = 'RM 0.00';
        return;
    }

    container.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
            <div class="cart-item-img">📦</div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-grind">${item.format}</div>
                <div class="cart-item-price">RM ${(item.price * item.qty).toFixed(2)} <span style="font-size:0.75rem; color:#8F877D;">(RM ${item.price.toFixed(2)}/unit)</span></div>
                <div class="cart-qty-ctrl">
                    <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
                    <span style="font-size: 0.88rem; font-weight:700; min-width:20px; text-align:center;">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
                    <button class="cart-remove-btn" onclick="removeItem(${idx})" title="Remove">✕</button>
                </div>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let discount = 0;
    if (activePromo === 'WELCOME15') discount = subtotal * 0.15;
    if (activePromo === 'MADAGASCAR') discount = subtotal * 0.10;

    const total = Math.max(0, subtotal - discount);

    if (subtotalEl) subtotalEl.textContent = `RM ${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-RM ${discount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `RM ${total.toFixed(2)}`;
}

function applyPromoCode() {
    const input = document.getElementById('promo-code-input');
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    if (code === 'WELCOME15') {
        activePromo = 'WELCOME15';
        showToast("🎉 15% sample roaster discount applied!");
    } else if (code === 'MADAGASCAR') {
        activePromo = 'MADAGASCAR';
        showToast("🌴 10% origin discount applied!");
    } else {
        showToast("⚠️ Invalid promo code. Try 'WELCOME15'");
        return;
    }
    updateCartUI();
}

function initiateCheckout() {
    if (cart.length === 0) {
        showToast("Your sample cart is empty!");
        return;
    }
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
}

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
    setTimeout(() => toast.classList.remove('show'), 3400);
}

// AI Matchmaker (Apple Genius Bar Concept)
function runAISommelier(e) {
    e.preventDefault();
    const roast = document.getElementById('quiz-roast').value;
    const brew = document.getElementById('quiz-brew').value;
    const flavor = document.getElementById('quiz-flavor').value;

    let match = products[0]; // Mananjary
    if (flavor === 'fruity' || roast === 'light') match = products[2]; // Sambirano
    if (flavor === 'rare' || brew === 'french') match = products[3]; // Discovery Kit

    const resultBox = document.getElementById('quiz-result');
    if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = `
            <div style="background: #FAF8F5; border-radius: var(--radius-md); padding: 24px; border: 1px solid var(--apple-border); margin-top: 20px;">
                <span class="eyebrow">Match Found for Your Roastery</span>
                <h4 style="font-size: 1.4rem; color: var(--color-primary); margin-bottom: 6px;">${match.name}</h4>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 16px;">${match.notes}</p>
                <div style="display: flex; gap: 14px; align-items: center;">
                    <span style="font-size: 1.3rem; font-weight:800; color:var(--color-primary);">RM ${match.price.toFixed(2)}</span>
                    <button class="btn btn-primary" onclick="addToCart('${match.id}')">Add Recommended Sample to Cart</button>
                </div>
            </div>
        `;
    }
}

// Apple-Style Cinematic Video Canvas Player
function initHeroCinema() {
    const canvas = document.getElementById('hero-cinema-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const scenes = [
        { 
            scene: "ORIGIN",
            title: "Pristine Volcanic Canopies", 
            subtitle: "Madagascar's ancient rainforests produce dense, shade-grown Robusta with rare complexity.",
            color: "#BD7E4A",
            accentBg: "#1F140D"
        },
        { 
            scene: "SELECTIVE HARVEST",
            title: "Screen 18 Hand-Picked Quality", 
            subtitle: "Strict density grading and raised-bed sun drying tailored for precision roasting.",
            color: "#BD7E4A",
            accentBg: "#2B1E16"
        },
        { 
            scene: "B2B MALAYSIA LINK",
            title: "Bridging Origin to Malaysian Roasters", 
            subtitle: "Sample-first evaluation: taste 1kg cupping pouches before full container commitments.",
            color: "#BD7E4A",
            accentBg: "#17100B"
        },
        { 
            scene: "EXPERIENCE",
            title: "Discover Madagascar, One bean at a time.", 
            subtitle: "Direct sourcing dialogue. Zero middle-men. Uncompromised terroir.",
            color: "#FFFFFF",
            accentBg: "#261910"
        }
    ];

    function render() {
        if (!isVideoPlaying) {
            videoAnimationId = requestAnimationFrame(render);
            return;
        }

        // Set dimensions cleanly for retina displays
        if (canvas.width !== canvas.parentElement.clientWidth) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }

        const sceneIdx = Math.floor((videoFrame / 150) % scenes.length);
        const cur = scenes[sceneIdx];

        // Deep cinema background gradient
        const bgGrad = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 50,
            canvas.width / 2, canvas.height / 2, canvas.width * 0.7
        );
        bgGrad.addColorStop(0, cur.accentBg);
        bgGrad.addColorStop(1, "#0D0805");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ambient cinematic floating aura
        const time = videoFrame * 0.02;
        const glowX = canvas.width / 2 + Math.sin(time) * 120;
        const glowY = canvas.height / 2 + Math.cos(time) * 60;
        const radialAura = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, 260);
        radialAura.addColorStop(0, "rgba(189, 126, 74, 0.22)");
        radialAura.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = radialAura;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apple minimalist typography overlay
        ctx.textAlign = "center";

        // Scene Pill Tag
        ctx.font = "600 12px 'Chesna Grotesk', -apple-system, sans-serif";
        ctx.fillStyle = cur.color;
        ctx.fillText(cur.scene, canvas.width / 2, canvas.height / 2 - 45);

        // Main Headline
        ctx.font = "700 28px 'Chesna Grotesk', -apple-system, sans-serif";
        ctx.fillStyle = "#FAF8F5";
        ctx.fillText(cur.title, canvas.width / 2, canvas.height / 2);

        // Subtitle
        ctx.font = "400 15px 'Chesna Grotesk', -apple-system, sans-serif";
        ctx.fillStyle = "#A99E94";
        ctx.fillText(cur.subtitle, canvas.width / 2, canvas.height / 2 + 34);

        // Apple-style timeline progress bar
        const totalFrames = 150 * scenes.length;
        const progress = ((videoFrame % totalFrames) / totalFrames) * canvas.width;
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(0, canvas.height - 4, canvas.width, 4);
        ctx.fillStyle = "#BD7E4A";
        ctx.fillRect(0, canvas.height - 4, progress, 4);

        videoFrame++;
        videoAnimationId = requestAnimationFrame(render);
    }

    render();
}

function toggleHeroVideo() {
    isVideoPlaying = !isVideoPlaying;
    const btn = document.getElementById('cinema-play-toggle');
    if (btn) btn.textContent = isVideoPlaying ? "Pause Cinema" : "Resume Cinema";
}
