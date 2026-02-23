// Product Store Class
class ProductStore {
    constructor() {
        this.products = this.generateProducts();
        this.filteredProducts = [...this.products];
        this.cart = [];
        this.wishlist = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.currentSort = 'featured';
        this.filters = {
            categories: ['electronics', 'clothing', 'accessories', 'home', 'sports', 'books'],
            brands: ['apple', 'samsung', 'nike', 'adidas', 'sony', 'lg'],
            minPrice: 0,
            maxPrice: 1000,
            ratings: [1, 2, 3, 4],
            availability: ['instock', 'sale', 'freeshipping'],
            search: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.updateStats();
        this.loadCartFromStorage();
        this.loadWishlistFromStorage();
    }

    generateProducts() {
        const productNames = {
            electronics: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Air M2', 'iPad Pro', 'Sony WH-1000XM5', 'Apple Watch Series 9'],
            clothing: ['Nike Air Max 90', 'Adidas Ultraboost', 'Levi\'s 501 Jeans', 'North Face Jacket', 'Under Armour Shirt', 'Puma Sneakers'],
            accessories: ['Ray-Ban Sunglasses', 'Fossil Watch', 'Coach Wallet', 'Samsonite Backpack', 'JBL Speaker', 'Anker Power Bank'],
            home: ['Dyson Vacuum', 'Instant Pot', 'Philips Hue Lights', 'Nespresso Machine', 'Air Purifier', 'Smart Thermostat'],
            sports: ['Yoga Mat', 'Dumbbells Set', 'Treadmill', 'Mountain Bike', 'Tennis Racket', 'Basketball'],
            books: ['Bestseller Novel', 'Cookbook Collection', 'Science Textbook', 'Art History Book', 'Programming Guide', 'Photography Book']
        };

        const brands = {
            electronics: ['apple', 'samsung', 'sony', 'lg'],
            clothing: ['nike', 'adidas'],
            accessories: ['apple', 'samsung', 'sony'],
            home: ['dyson', 'philips', 'lg'],
            sports: ['nike', 'adidas'],
            books: ['penguin', 'harper']
        };

        const products = [];
        let id = 1;

        Object.keys(productNames).forEach(category => {
            productNames[category].forEach((name, index) => {
                const brand = brands[category]?.[index % brands[category].length] || 'generic';
                const basePrice = Math.floor(Math.random() * 800) + 100;
                const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0;
                const originalPrice = basePrice;
                const currentPrice = discount > 0 ? Math.floor(basePrice * (1 - discount / 100)) : basePrice;
                const rating = (Math.random() * 2 + 3).toFixed(1);
                const reviews = Math.floor(Math.random() * 500) + 10;
                const inStock = Math.random() > 0.1;
                const onSale = discount > 0;
                const freeShipping = Math.random() > 0.5;

                products.push({
                    id: id++,
                    name,
                    category,
                    brand,
                    originalPrice,
                    currentPrice,
                    discount,
                    rating: parseFloat(rating),
                    reviews,
                    inStock,
                    onSale,
                    freeShipping,
                    description: `High-quality ${name} from ${brand.charAt(0).toUpperCase() + brand.slice(1)}. Premium materials and excellent craftsmanship.`,
                    image: `https://picsum.photos/seed/product${id}/400/300`,
                    images: [
                        `https://picsum.photos/seed/product${id}/400/300`,
                        `https://picsum.photos/seed/product${id}a/400/300`,
                        `https://picsum.photos/seed/product${id}b/400/300`
                    ],
                    features: ['Premium Quality', 'Modern Design', '1 Year Warranty'],
                    isNew: Math.random() > 0.8
                });
            });
        });

        return products;
    }

    setupEventListeners() {
        // Search
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Sort
        document.getElementById('sortProducts').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applyFilters();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setView(btn.dataset.view);
                this.updateViewButtons(btn);
            });
        });

        // Filter toggle
        document.getElementById('filterToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });

        // Category filters
        document.querySelectorAll('.category-filters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateCategoryFilters();
            });
        });

        // Brand filters
        document.querySelectorAll('.brand-filters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBrandFilters();
            });
        });

        // Rating filters
        document.querySelectorAll('.rating-filters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateRatingFilters();
            });
        });

        // Availability filters
        document.querySelectorAll('.availability-filters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateAvailabilityFilters();
            });
        });

        // Price range
        document.getElementById('minPrice').addEventListener('input', (e) => {
            this.filters.minPrice = parseInt(e.target.value);
            document.getElementById('minPriceValue').textContent = e.target.value;
            this.applyFilters();
        });

        document.getElementById('maxPrice').addEventListener('input', (e) => {
            this.filters.maxPrice = parseInt(e.target.value);
            document.getElementById('maxPriceValue').textContent = e.target.value;
            this.applyFilters();
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearAllFilters();
        });

        // Cart and wishlist
        document.getElementById('cartBtn').addEventListener('click', () => {
            this.toggleCart();
        });

        document.getElementById('wishlistBtn').addEventListener('click', () => {
            this.toggleWishlist();
        });

        // Modal
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Cart sidebar
        document.querySelector('.sidebar-drawer-close').addEventListener('click', () => {
            this.closeCart();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeCart();
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    }

    updateCategoryFilters() {
        const checkboxes = document.querySelectorAll('.category-filters input:checked');
        this.filters.categories = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
    }

    updateBrandFilters() {
        const checkboxes = document.querySelectorAll('.brand-filters input:checked');
        this.filters.brands = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
    }

    updateRatingFilters() {
        const checkboxes = document.querySelectorAll('.rating-filters input:checked');
        this.filters.ratings = Array.from(checkboxes).map(cb => parseInt(cb.value));
        this.applyFilters();
    }

    updateAvailabilityFilters() {
        const checkboxes = document.querySelectorAll('.availability-filters input:checked');
        this.filters.availability = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (!this.filters.categories.includes(product.category)) return false;

            // Brand filter
            if (!this.filters.brands.includes(product.brand)) return false;

            // Price filter
            if (product.currentPrice < this.filters.minPrice || product.currentPrice > this.filters.maxPrice) return false;

            // Rating filter
            const minRating = Math.min(...this.filters.ratings);
            if (product.rating < minRating) return false;

            // Availability filter
            let hasAvailabilityFilter = false;
            if (this.filters.availability.includes('instock') && product.inStock) hasAvailabilityFilter = true;
            if (this.filters.availability.includes('sale') && product.onSale) hasAvailabilityFilter = true;
            if (this.filters.availability.includes('freeshipping') && product.freeShipping) hasAvailabilityFilter = true;
            if (!hasAvailabilityFilter && this.filters.availability.length > 0) return false;

            // Search filter
            if (this.filters.search && !product.name.toLowerCase().includes(this.filters.search)) return false;

            return true;
        });

        this.sortProducts();
        this.renderProducts();
        this.updateActiveFilters();
    }

    sortProducts() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.currentPrice - b.currentPrice);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.currentPrice - a.currentPrice);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'featured':
            default:
                // Keep original order with featured items first
                this.filteredProducts.sort((a, b) => {
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    if (a.onSale && !b.onSale) return -1;
                    if (!a.onSale && b.onSale) return 1;
                    return 0;
                });
        }
    }

    renderProducts() {
        const productsList = document.getElementById('productsList');
        const emptyState = document.getElementById('emptyState');
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);

        if (paginatedProducts.length === 0) {
            productsList.innerHTML = '';
            emptyState.style.display = 'block';
            this.renderPagination();
            return;
        }

        emptyState.style.display = 'none';
        productsList.innerHTML = paginatedProducts.map(product => this.createProductHTML(product)).join('');
        productsList.className = this.currentView === 'grid' ? 'products-grid' : 'products-list';

        // Add event listeners
        productsList.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addToCart(parseInt(btn.dataset.productId));
            });
        });

        productsList.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showProductModal(parseInt(btn.dataset.productId));
            });
        });

        productsList.querySelectorAll('.product-wishlist').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleWishlistItem(parseInt(btn.dataset.productId));
            });
        });

        this.renderPagination();
        this.updateStats();
    }

    createProductHTML(product) {
        const isInWishlist = this.wishlist.includes(product.id);
        const badges = [];
        if (product.isNew) badges.push('<span class="badge badge-new">New</span>');
        if (product.onSale) badges.push('<span class="badge badge-sale">Sale</span>');
        if (product.freeShipping) badges.push('<span class="badge badge-freeshipping">Free Ship</span>');

        return `
            <div class="product-card fade-in">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-badges">
                        ${badges.join('')}
                    </div>
                    <button class="product-wishlist ${isInWishlist ? 'active' : ''}" data-product-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.createStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.currentPrice}</span>
                        ${product.discount > 0 ? `
                            <span class="original-price">$${product.originalPrice}</span>
                            <span class="discount-percentage">-${product.discount}%</span>
                        ` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="product-btn add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="product-btn quick-view" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i>
                            Quick View
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt star"></i>';
            } else {
                stars += '<i class="far fa-star star empty"></i>';
            }
        }
        return stars;
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += '<span class="page-ellipsis">...</span>';
            }
        }

        // Next button
        paginationHTML += `
            <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = paginationHTML;

        // Add event listeners
        pagination.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderProducts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    updateActiveFilters() {
        const activeFilters = document.getElementById('activeFilters');
        const filters = [];

        // Add category filters
        const allCategories = ['electronics', 'clothing', 'accessories', 'home', 'sports', 'books'];
        if (this.filters.categories.length < allCategories.length) {
            filters.push(...this.filters.categories.map(cat => 
                `<div class="filter-tag">
                    ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                    <button onclick="productStore.removeCategoryFilter('${cat}')">&times;</button>
                </div>`
            ));
        }

        // Add price range filter
        if (this.filters.minPrice > 0 || this.filters.maxPrice < 1000) {
            filters.push(`
                <div class="filter-tag">
                    $${this.filters.minPrice} - $${this.filters.maxPrice}
                    <button onclick="productStore.removePriceFilter()">&times;</button>
                </div>
            `);
        }

        // Add search filter
        if (this.filters.search) {
            filters.push(`
                <div class="filter-tag">
                    Search: "${this.filters.search}"
                    <button onclick="productStore.removeSearchFilter()">&times;</button>
                </div>
            `);
        }

        activeFilters.innerHTML = filters.join('');
    }

    removeCategoryFilter(category) {
        const checkbox = document.querySelector(`.category-filters input[value="${category}"]`);
        if (checkbox) {
            checkbox.checked = false;
            this.updateCategoryFilters();
        }
    }

    removePriceFilter() {
        document.getElementById('minPrice').value = 0;
        document.getElementById('maxPrice').value = 1000;
        document.getElementById('minPriceValue').textContent = '0';
        document.getElementById('maxPriceValue').textContent = '1000';
        this.filters.minPrice = 0;
        this.filters.maxPrice = 1000;
        this.applyFilters();
    }

    removeSearchFilter() {
        document.getElementById('globalSearch').value = '';
        this.filters.search = '';
        this.applyFilters();
    }

    clearAllFilters() {
        // Reset all checkboxes
        document.querySelectorAll('.filter-label input').forEach(checkbox => {
            checkbox.checked = true;
        });

        // Reset price range
        this.removePriceFilter();

        // Reset search
        this.removeSearchFilter();

        // Reset filters object
        this.filters = {
            categories: ['electronics', 'clothing', 'accessories', 'home', 'sports', 'books'],
            brands: ['apple', 'samsung', 'nike', 'adidas', 'sony', 'lg'],
            minPrice: 0,
            maxPrice: 1000,
            ratings: [1, 2, 3, 4],
            availability: ['instock', 'sale', 'freeshipping'],
            search: ''
        };

        this.applyFilters();
    }

    setView(view) {
        this.currentView = view;
        this.renderProducts();
    }

    updateViewButtons(activeBtn) {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductTitle').textContent = product.name;
        document.getElementById('modalProductRating').innerHTML = `
            <div class="stars">
                ${this.createStars(product.rating)}
            </div>
            <span class="rating-count">(${product.reviews} reviews)</span>
        `;
        document.getElementById('modalProductPrice').innerHTML = `
            <span class="current-price">$${product.currentPrice}</span>
            ${product.discount > 0 ? `
                <span class="original-price">$${product.originalPrice}</span>
                <span class="discount-percentage">-${product.discount}%</span>
            ` : ''}
        `;
        document.getElementById('modalProductDescription').textContent = product.description;
        document.getElementById('modalProductMeta').innerHTML = `
            <p><strong>Brand:</strong> ${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</p>
            <p><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <p><strong>Availability:</strong> ${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
            <p><strong>Shipping:</strong> ${product.freeShipping ? 'Free Shipping' : 'Standard Shipping'}</p>
            <ul>
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;

        // Add to cart button
        document.getElementById('addToCartBtn').onclick = () => {
            this.addToCart(productId);
            this.closeModal();
        };

        // Add to wishlist button
        document.getElementById('addToWishlistBtn').onclick = () => {
            this.toggleWishlistItem(productId);
            this.closeModal();
        };

        // Image thumbnails
        const thumbnailsContainer = document.querySelector('.image-thumbnails');
        thumbnailsContainer.innerHTML = product.images.map((img, index) => `
            <img src="${img}" alt="Product ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="productStore.changeModalImage('${img}', this)">
        `).join('');

        document.getElementById('productModal').classList.add('active');
    }

    changeModalImage(imageSrc, thumbnail) {
        document.getElementById('modalProductImage').src = imageSrc;
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
    }

    closeModal() {
        document.getElementById('productModal').classList.remove('active');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartUI();
        this.showToast(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartUI();
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCartToStorage();
            this.updateCartUI();
        }
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div class="cart-item-details" style="flex: 1; margin-left: 1rem;">
                    <h4>${item.name}</h4>
                    <p>$${item.currentPrice} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <input type="number" value="${item.quantity}" min="1" max="10" onchange="productStore.updateCartQuantity(${item.id}, this.value)" style="width: 60px; padding: 0.25rem;">
                    <button onclick="productStore.removeFromCart(${item.id})" style="background: none; border: none; color: var(--danger-color); cursor: pointer; margin-left: 0.5rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    toggleCart() {
        document.getElementById('cartSidebar').classList.toggle('active');
    }

    closeCart() {
        document.getElementById('cartSidebar').classList.remove('active');
    }

    toggleWishlistItem(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showToast('Removed from wishlist');
        } else {
            this.wishlist.push(productId);
            this.showToast('Added to wishlist');
        }

        this.saveWishlistToStorage();
        this.updateWishlistUI();
        this.renderProducts(); // Re-render to update heart icons
    }

    updateWishlistUI() {
        const wishlistCount = document.querySelector('.wishlist-count');
        wishlistCount.textContent = this.wishlist.length;
    }

    toggleWishlist() {
        // This could open a wishlist modal/sidebar
        this.showToast(`You have ${this.wishlist.length} items in your wishlist`);
    }

    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            this.cart = JSON.parse(saved);
            this.updateCartUI();
        }
    }

    saveWishlistToStorage() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    loadWishlistFromStorage() {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            this.wishlist = JSON.parse(saved);
            this.updateWishlistUI();
        }
    }

    updateStats() {
        document.getElementById('productCount').textContent = this.filteredProducts.length;
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the store
let productStore;
document.addEventListener('DOMContentLoaded', () => {
    productStore = new ProductStore();

    // Add floating particles animation
    const createFloatingParticle = () => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 6 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.6)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '-1';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        const duration = Math.random() * 10000 + 10000;
        const horizontalMovement = (Math.random() - 0.5) * 200;
        
        particle.animate([
            { transform: 'translateY(0) translateX(0)', opacity: 0.6 },
            { transform: `translateY(-${window.innerHeight + 100}px) translateX(${horizontalMovement}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => particle.remove();
    };

    // Create particles periodically
    setInterval(createFloatingParticle, 2000);

    console.log('ShopHub product store initialized successfully! 🛍️');
});
