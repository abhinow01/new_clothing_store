document.addEventListener("DOMContentLoaded", function(){
    fetchProducts();
});

async function fetchProducts() {
    try {
        const response = await axios.get('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        const data = response.data;
        displayProducts(data.categories);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(categories) {
    categories.forEach(category => {
        const categoryProducts = category.category_products;
        const productCardContainer = document.querySelector(`.product-card.${category.category_name.toLowerCase()}`);
        productCardContainer.innerHTML = ''; // Clear existing content
        
        categoryProducts.forEach(product => {
            const productCard = createProductCard(product);
            productCardContainer.appendChild(productCard);
        });
    });
}

const createProductCard = (product) => {
    const productCard = document.createElement('div');
    productCard.className = 'product';

    const productImageContainer = document.createElement('div');
    productImageContainer.className = 'product-image-container';

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.title;

    const productBadge = document.createElement('div');
    productBadge.className = 'badge';
    if (product.badge_text === null) {
        productBadge.style.display = 'none';
    } else {
        productBadge.textContent = product.badge_text;
    }

    // Apply CSS to position the badge at the top left corner
    productImageContainer.style.position = 'relative';
    productBadge.style.position = 'absolute';
    productBadge.style.top = '0';
    productBadge.style.left = '0';

    const maxFontSize = 12;
    const badgeTextLength = productBadge.textContent.length;
    const fontSize = Math.min(maxFontSize, Math.floor(300 / badgeTextLength)); 
    productBadge.style.fontSize = `${fontSize}px`;


    productImageContainer.appendChild(productImage);
    productImageContainer.appendChild(productBadge);

    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';

    // Container for title and vendor
    const titleVendorContainer = document.createElement('div');
    titleVendorContainer.className = 'title-vendor-container';

    const productTitle = document.createElement('div');
    productTitle.className = 'title';
    
    if (product.title.length > 10) {
        productTitle.textContent = product.title.substring(0, 10) + '...';
    } else {
        productTitle.textContent = product.title;
    }

    const productVendor = document.createElement('div');
    productVendor.className = 'vendor';
    productVendor.textContent = product.vendor;

    titleVendorContainer.appendChild(productTitle);
    titleVendorContainer.appendChild(productVendor);

    // Container for price information
    const priceContainer = document.createElement('div');
    priceContainer.className = 'price-container';

    const productPrice = document.createElement('div');
    productPrice.className = 'price';
    productPrice.textContent = `Rs.${product.price}`;

    const compareAtPrice = document.createElement('div');
    compareAtPrice.className = 'compare-at-price';
    compareAtPrice.textContent = `$${product.compare_at_price}`;

    const discount = document.createElement('div');
    discount.className = 'discount';
    const discountValue = calculateDiscount(product.price, product.compare_at_price);
    discount.textContent = `${discountValue}% off`;

    priceContainer.appendChild(productPrice);
    priceContainer.appendChild(compareAtPrice);
    priceContainer.appendChild(discount);

    productInfo.appendChild(titleVendorContainer);
    productInfo.appendChild(priceContainer);

    const addToCartButton = document.createElement('button');
    addToCartButton.className = 'add-to-cart';
    addToCartButton.textContent = 'Add to Cart';

    productCard.appendChild(productImageContainer);
    productCard.appendChild(productInfo);
    productCard.appendChild(addToCartButton);

    return productCard;
};

function calculateDiscount(price, compareAtPrice) {
    const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
    return Math.round(discount);
}

function toggleTab(tabName) {
    // Remove 'active' class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Add 'active' class to the selected tab
    const selectedTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Hide all product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'none';
    });

    // Show the product cards corresponding to the selected tab
    const selectedProductCard = document.querySelector(`.product-card.${tabName}`);
    if (selectedProductCard) {
        selectedProductCard.style.display = 'flex';
    }
}
