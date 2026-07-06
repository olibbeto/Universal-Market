// Mock product catalog for Universal Market
// Each product has: id, name, price, category, rating, reviews, inStock, images (URLs), description, details
//
// Images: Unsplash CDN — stable, high-quality, commercial-grade photography.
// Format: https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=600&h=400&q=90

function svgDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const categoryIcons = {
  electronics: svgDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <polygon points='100,12 178,56 178,144 100,188 22,144 22,56' fill='#0A0D1A' stroke='#00F0FF' stroke-width='2.5'/>
      <g fill='none' stroke='#7CFBFF' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'>
        <rect x='62' y='66' width='76' height='52' rx='8'/>
        <path d='M86 132h28'/>
        <path d='M100 118v14'/>
      </g>
    </svg>`),
  fashion: svgDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <polygon points='100,12 178,56 178,144 100,188 22,144 22,56' fill='#0A0D1A' stroke='#00F0FF' stroke-width='2.5'/>
      <g fill='none' stroke='#7CFBFF' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'>
        <path d='M100 58a8 8 0 1 0 8 8'/>
        <path d='M100 66v8'/>
        <path d='M58 122l42-34 42 34'/>
        <path d='M52 122h96'/>
      </g>
    </svg>`),
  home: svgDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <polygon points='100,12 178,56 178,144 100,188 22,144 22,56' fill='#0A0D1A' stroke='#00F0FF' stroke-width='2.5'/>
      <g fill='none' stroke='#7CFBFF' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'>
        <path d='M54 104l46-40 46 40'/>
        <path d='M66 98v54h68V98'/>
        <path d='M90 152v-32h20v32'/>
      </g>
    </svg>`),
  beauty: svgDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <polygon points='100,12 178,56 178,144 100,188 22,144 22,56' fill='#0A0D1A' stroke='#00F0FF' stroke-width='2.5'/>
      <g fill='none' stroke='#7CFBFF' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'>
        <path d='M90 54h20v14h-20z'/>
        <path d='M83 68h34l7 16v58a8 8 0 0 1-8 8H84a8 8 0 0 1-8-8V84z'/>
        <path d='M76 102h48'/>
      </g>
    </svg>`),
  sports: svgDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <polygon points='100,12 178,56 178,144 100,188 22,144 22,56' fill='#0A0D1A' stroke='#00F0FF' stroke-width='2.5'/>
      <g fill='none' stroke='#7CFBFF' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'>
        <circle cx='100' cy='100' r='42'/>
        <path d='M68 78c22 18 42 18 64 0'/>
        <path d='M68 122c22-18 42-18 64 0'/>
        <path d='M100 58v84'/>
      </g>
    </svg>`),
  kitchen: svgDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <polygon points='100,12 178,56 178,144 100,188 22,144 22,56' fill='#0A0D1A' stroke='#00F0FF' stroke-width='2.5'/>
      <g fill='none' stroke='#7CFBFF' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'>
        <circle cx='86' cy='106' r='34'/>
        <path d='M118 100h36'/>
        <path d='M70 84c6-8 16-12 26-12'/>
      </g>
    </svg>`),
  accessories: svgDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <polygon points='100,12 178,56 178,144 100,188 22,144 22,56' fill='#0A0D1A' stroke='#00F0FF' stroke-width='2.5'/>
      <g fill='none' stroke='#7CFBFF' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'>
        <path d='M62 92h76l-7 62H69z'/>
        <path d='M79 92V78a21 21 0 0 1 42 0v14'/>
      </g>
    </svg>`),
};

// ─── Image helpers ───────────────────────────────────────────────────────────
// u() → Unsplash CDN (requires valid photo ID)
function u(id, w, h) {
  w = w || 600; h = h || 400;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=88`;
}
// p() → Pexels CDN (always public, works from file:// origins)
function p(id, w, h) {
  w = w || 400; h = h || 400;
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}

const PRODUCTS = [
  // ── um-001 · Aurora Wireless Headphones ─────────────────────────────────────
  {
    id: 'um-001',
    name: 'Wireless Headphones',
    images: [
      'https://i5.walmartimages.com/seo/SoundPlay-Foldable-Wireless-Headphones-Bluetooth-Over-Ear-Headset-with-Built-in-Mic_7781a45d-3746-4e57-9448-ed352177f124.e514a94af242606cd9abd487ef2bf27f.png',  // side profile headphones studio
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWo8OEFLWHPATuWWdoBWklhtOFsD2WO9BY50DGWPH9Kg&s=10 ',   // over-ear headphones white background
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuAbxJg56uoWYQxMxXNM_CyOUQvcJ6YYok60flxyb_Sg&s=10',  // exact Amazon product image
    ],
    price: 129.99,
    category: 'electronics',
    rating: 4.7,
    reviews: 1248,
    inStock: true,
    description: 'Immersive sound with active noise cancelling and all-day comfort.',
    details: [
      'Active Noise Cancelling (ANC)',
      '40mm drivers with tuned bass',
      'Up to 30 hours battery life',
      'Bluetooth 5.3 + low-latency mode',
    ],
  },

  // ── um-002 · Nimbus Smart Watch ──────────────────────────────────────────────
  {
    id: 'um-002',
    name: 'Smart Watch',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnjQaEyS_rFA3kzwlGeTGlb6ZbUVc_t88xZAViWekhDBFHcGfv8VzKv1k&s=10',
      'https://images-na.ssl-images-amazon.com/images/I/6110Jv9wqeL._AC_UL375_SR375,375_.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnYuRG9PUOFD_XQ5fmPM9rHkNcnrRo7k-_dDJk_Yt3uTFc93icl6HOlfql&s=10',
      
    ],
    price: 89.5,
    category: 'electronics',
    rating: 4.5,
    reviews: 802,
    inStock: true,
    description: 'Track workouts, sleep, and notifications with a bright always-on display.',
    details: ['Health & fitness tracking', '5-day battery', 'Swim-ready design', 'Custom watch faces'],
  },

  // ── um-003 · CloudSoft Hoodie ────────────────────────────────────────────────
  {
    id: 'um-003',
    name: 'Hoodie',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjn8gUaPMZoK7nbA_XdBDTfEHV1-CCn8U_gMbE83iM8w&s=10',
      p(1183266),  // grey pullover hoodie flat lay
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlzHKziTt9svtHy6xPvlygFPclII16TSYz5rDbgWcCyc6cZZpgvKt4mYub&s=10',  // lifestyle hoodie worn
    ],
    price: 39.0,
    category: 'fashion',
    rating: 4.6,
    reviews: 532,
    inStock: true,
    description: 'A premium cotton blend hoodie—soft, breathable, and built for everyday wear.',
    details: ['Relaxed fit', 'Double-stitched seams', 'Kangaroo pocket', 'Machine washable'],
  },

  // ── um-004 · Stride Running Shoes ───────────────────────────────────────────
  {
    id: 'um-004',
    name: 'Stride Running Shoes',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=82',  // shoe side profile clean background
      p(2529148),  // white running shoe angled studio
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=82',
    ],
    price: 74.99,
    category: 'sports',
    rating: 4.4,
    reviews: 911,
    inStock: true,
    description: 'Lightweight cushioning and responsive grip for daily runs.',
    details: ['Breathable upper', 'Cushioned midsole', 'Durable outsole', 'Secure lace system'],
  },

  // ── um-005 · SatinGlow Skincare Set ─────────────────────────────────────────
  {
    id: 'um-005',
    name: 'Skincare Set',
    images: [
      'https://m.media-amazon.com/images/I/711ySIV-X4L._SL1500_.jpg', // serums and toner set
      'https://m.media-amazon.com/images/I/71jd5jQK3rL._SL1500_.jpg',  // beauty products closeup
      u('1556228578-8c89e6adf883'),  // skincare bottles flat lay white
    ],
    price: 58.25,
    category: 'beauty',
    rating: 4.8,
    reviews: 641,
    inStock: true,
    description: 'Skin Care Set, Cherry Facial kit for women, Skincare Kit Gifts For Teenage Girls, Skin Care Kit, Skincare Sets & Kits with facial wash, Toner, Serum,...',
    details: ['Gentle cleanser', 'Daily moisturizer', 'Brightening serum', 'Soothing finish toner'],
  },
  // ── um-006 · HomeNest Ceramic Vase ──────────────────────────────────────────
  {
    id: 'um-006',
    name: 'HomeNest Ceramic Vase',
    images: [
      p(35082703),  // white ceramic vase on wooden table
      p(4203100),  // white ring-shaped ceramic vase on marble stand
      p(8217302),  // elegant white ceramic vase with candle still life
       
    ],
    price: 24.99,
    category: 'home',
    rating: 4.3,
    reviews: 304,
    inStock: true,
    description: 'Add warmth and style to any room with a timeless ceramic silhouette.',
    details: ['Gloss ceramic glaze', 'Modern shape', 'Easy to style', 'Great gift idea'],
  },
  // ── um-007 · Pulse Mini Bluetooth Speaker ───────────────────────────────────
  {
    id: 'um-007',
    name: 'Bluetooth Speaker',
    images: [
      u('1608043152269-423dbba4e7e1'),  // portable speaker clean bg
      u('1589003077984-894e133dabab'),  // bluetooth speaker side
      p(31341733),  // grey Bluetooth speaker lifestyle
    ],
    price: 34.5,
    category: 'electronics',
    rating: 4.2,
    reviews: 477,
    inStock: true,
    description: 'Punchy bass in a compact design—perfect for desks, picnics, and travel.',
    details: ['Stereo pairing', '6-hour playtime', 'Rugged silicone body', 'Hands-free calls'],
  },
  // ── um-008 · EverWear T-Shirt (2-Pack) ──────────────────────────────────────
 {
    id: 'um-008',
    name: 'EverWear T-Shirt (2-Pack)',
    images: [
      u('1521572163474-6864f9cf17ab'),  // white tshirt flat lay clean
      'https://m.media-amazon.com/images/I/61NxWlAdrpL._AC_SY741_.jpg',  // folded tshirt pair
      u('1562157873-818bc0726f68'),  // tshirt lifestyle worn
    ],
    price: 28.99,
    category: 'fashion',
    rating: 4.6,
    reviews: 1099,
    inStock: true,
    description: 'Soft stretch cotton tees with a clean silhouette—two essentials in one pack.',
    details: ['Comfort stretch fabric', 'Breathable weave', 'Pre-shrunk', 'No-itch seams'],
  },



  // ── um-009 · EcoBloom Indoor Plant Pot ──────────────────────────────────────
  {
    id: 'um-009',
    name: 'EcoBloom Indoor Plant Pot',
    images: [
      p(776656),   // white plant pot minimal clean bg
      p(1029604),  // ceramic pot with indoor plant
      p(3076899),  // plant pot lifestyle interior
    ],
    price: 19.75,
    category: 'home',
    rating: 4.1,
    reviews: 212,
    inStock: true,
    description: 'A modern pot made to elevate greenery while blending with any interior style.',
    details: ['Lightweight ceramic', 'Drainage-ready base', 'Minimal design', 'Easy maintenance'],
  },

  // ── um-010 · AquaSport Water Bottle ─────────────────────────────────────────
  {
    id: 'um-010',
    name: 'AquaSport Water Bottle',
    images: [
      'https://m.media-amazon.com/images/I/61lambTJTvL.jpg',  // water bottle lifestyle
      u('1602143407151-7111542de6e8'),  // insulated water bottle white bg
      'https://d1dg01zqcvdsqu.cloudfront.net/catalogs/2/1/b/f/21bf068687ef10e4c096060d1b58dc47f0d30634_AquaSport_RCS_Recycled_Water_Bottle_1_L_impr_1503499.webp',  // sports bottle studio shot
      
    ],
    price: 16.99,
    category: 'sports',
    rating: 4.5,
    reviews: 588,
    inStock: true,
    description: 'Leakproof, insulated hydration that keeps drinks cool for hours.',
    details: ['Double-wall insulation', 'Leakproof lid', 'Sweat-resistant grip', 'Holds 750ml'],
  },

  // ── um-011 · ProGamer Mechanical Keyboard ───────────────────────────────────
  {
    id: 'um-011',
    name: 'ProGamer Mechanical Keyboard',
    images: [
      'https://m.media-amazon.com/images/I/71aARXewm6L._AC_SL1500_.jpg',  // exact Amazon product image
      'https://m.media-amazon.com/images/I/81FLJzgAnfL._AC_SL1500_.jpg',  // exact Amazon product image
     'https://m.media-amazon.com/images/I/81fGgIKzWyL._AC_SL1500_.jpg',  // exact Amazon product image
    ],
    price: 149.99,
    category: 'electronics',
    rating: 4.9,
    reviews: 2100,
    inStock: true,
    description: 'RGB mechanical switches with custom keycaps—built for performance and style.',
    details: ['Hot-swappable switches', 'RGB lighting', 'Aluminum frame', 'USB-C connection'],
  },

  // ── um-012 · 4K Webcam Pro ───────────────────────────────────────────────────
  {
    id: 'um-012',
    name: '4K Webcam Pro',
    images: [
      'https://depstech.com/cdn/shop/products/depstech-4k-webcam-dw49_1200x1200.jpg?v=1614166614',  // exact DEPSTECH webcam image
      'https://m.media-amazon.com/images/I/61hXp-68Y3L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/51XiUqvzW2L._AC_SL1000_.jpg',
    ],
    price: 79.99,
    category: 'electronics',
    rating: 4.6,
    reviews: 1450,
    inStock: true,
    description: 'Crystal clear 4K video with auto-focus and noise-canceling mic for streaming.',
    details: ['4K resolution at 30fps', 'Auto-focus tech', 'Built-in mic', 'Wide 90° view'],
  },

  // ── um-013 · Premium Yoga Mat ────────────────────────────────────────────────
  {
    id: 'um-013',
    name: 'Premium Yoga Mat',
    images: [
    'https://m.media-amazon.com/images/I/81Lo9SozfQL._AC_SL1500_.jpg', // yoga mat lifestyle shot
      p(4056723),  // rolled yoga mat white background
      p(3822906),  // yoga mat unrolled top view
     
    ],
    price: 42.5,
    category: 'sports',
    rating: 4.7,
    reviews: 819,
    inStock: true,
    description: 'Gaiam Dry-Grip Yoga Mat 5mm Thick Non-Slip Exercise & Fitness Mat for Standard or Hot Yoga, Pilates and Floor Workouts Cushioned Support, Non-Slip and eco-friendly.',
  },

  // ── um-014 · Classic Denim Jacket ───────────────────────────────────────────
  {
    id: 'um-014',
    name: 'Classic Denim Jacket',
    images: [
      'https://m.media-amazon.com/images/I/81tWK67AADL._AC_SX569_.jpg',  // denim jacket studio shot
      'https://m.media-amazon.com/images/I/91-nTsnvQ4L._AC_SY550_.jpg',  // blue denim jacket flat lay
      'https://m.media-amazon.com/images/I/71fXjTl5XOL._AC_SY550_.jpg',  // denim jacket worn lifestyle
      
    ],
    price: 89.99,
    category: 'fashion',
    rating: 4.8,
    reviews: 756,
    inStock: true,
    description: 'Timeless denim with a modern cut—perfect for layering any outfit.',
    details: ['100% cotton denim', 'Adjustable waist', 'Multiple pockets', 'Pre-washed'],
  },

  // ── um-015 · Luxury Face Cleanser ───────────────────────────────────────────
  {
    id: 'um-015',
    name: 'Face Cleanser',
    images: [
      'https://m.media-amazon.com/images/I/51+yNMwODML._SL1000_.jpg', // face wash product shot
      'https://m.media-amazon.com/images/I/618sG1QinaL._SL1500_.jpg',  // exact Amazon product image
      'https://m.media-amazon.com/images/I/81jCWihPECL._SL1500_.jpg',  // cleanser lifestyle bathroom
      
    ],
    price: 45.99,
    category: 'beauty',
    rating: 4.9,
    reviews: 932,
    inStock: true,
    description: 'CeraVe Foaming Facial Cleanser, Daily Face Wash for Oily Skin, Hyaluronic Acid + Ceramides + Niacinamide, Fragrance Free, Non-Drying Oil Control Face Wash, 19 Fluid Ounces',
    details: ['Natural ingredients', 'Hypoallergenic', 'pH balanced', 'Dermatologist tested'],
  },

  // ── um-016 · Marble Desk Organizer ──────────────────────────────────────────
  {
    id: 'um-016',
    name: 'Marble Desk Organizer',
    images: [
      'https://m.media-amazon.com/images/I/51ls5n34GvL._AC_SL1200_.jpg',  // marble desk organizer white bg
      'https://m.media-amazon.com/images/I/51BYRUTb5UL._AC_SL1000_.jpg',  // marble tray and accessories
      'https://m.media-amazon.com/images/I/61TltBFH4xL._AC_SL1000_.jpg',  // styled desk organizer
    ],
    price: 34.75,
    category: 'home',
    rating: 4.4,
    reviews: 421,
    inStock: true,
    description: 'Elegant marble organizer to keep your desk tidy and stylish.',
    details: ['Natural marble', 'Multiple compartments', 'Minimalist design', 'Non-slip base'],
  },

  // ── um-017 · Cargo Shorts (Navy) ────────────────────────────────────────────
  {
    id: 'um-017',
    name: 'Cargo Shorts',
    images: [
      'https://m.media-amazon.com/images/I/71zAD5wxYKL._AC_SX569_.jpg',  // cargo shorts flat lay
      'https://m.media-amazon.com/images/I/71Xa748dpcL._AC_SY550_.jpg',  // Green shorts product shot
      'https://m.media-amazon.com/images/I/61M4vTvVxTL._AC_SX466_.jpg',  // Black shorts 
    ],
    price: 52.99,
    category: 'fashion',
    rating: 4.3,
    reviews: 634,
    inStock: true,
    description: 'Durable cargo shorts with secure pockets—perfect for outdoor adventures.',
    details: ['Water-resistant', 'Multiple pockets', 'Reinforced seams', 'Breathable fabric'],
  },

  // ── um-018 · Anti-Aging Eye Serum ───────────────────────────────────────────
  {
    id: 'um-018',
    name: 'Anti-Aging Face Serum',
    images: [
      'https://m.media-amazon.com/images/I/61Z-MmjbqdL._SL1500_.jpg',  // serum dropper bottle white background
      'https://m.media-amazon.com/images/I/71G91wGZReL._SL1500_.jpg',  // eye serum cosmetic flat lay
      'https://m.media-amazon.com/images/I/71tfHarnW0L._SL1500_.jpg',  // beauty serum closeup
    ],
    price: 62.0,
    category: 'beauty',
    rating: 4.7,
    reviews: 1087,
    inStock: true,
    description: 'L Oreal Paris Revitalift Triple Power Anti-Aging Concentrated Face Serum, Hyaluronic Acid and Pro-Xylane, Reduces Wrinkles 1 oz.',
    details: ['Peptide complex', 'Hyaluronic acid', 'Roll-on applicator', 'Cruelty-free'],
  },

  // ── um-019 · Bamboo Cutting Board Set ───────────────────────────────────────
  {
    id: 'um-019',
    name: 'Bamboo Cutting Board Set',
    images: [
      'https://image.made-in-china.com/365f3j00GPqcsWHhbfkZ/Bamboo-Chopping-Board-for-Kitchen-Fruit-Cut-Board-with-Metal-Handle.webp',  // bamboo cutting board set studio shot
      'https://bambooproducts.in/wp-content/uploads/2021/09/Bamboo-cutting-board-3.jpg',  // bamboo cutting board set lifestyle
      p(2284166),  // kitchen boards lifestyle
    ],
    price: 31.5,
    category: 'home',
    rating: 4.5,
    reviews: 527,
    inStock: true,
    description: 'Bamboo Chopping Board for Kitchen meal prep and serving.',
    details: ['Bamboo wood', '3 different sizes', 'Built-in handles', 'Food-safe finish'],
  },

  // ── um-020 · Titanium Multi-Tool ─────────────────────────────────────────────
  {
    id: 'um-020',
    name: 'Titanium Multi-Tool',
    images: [
      'https://www.werd.com/wp-content/uploads/2022/09/TRUE-TI-POCKET-MULTI-TOOL.jpg',  // multi-tool open studio shot
      'https://colorissimo.com/upload/reiter/cache/1920_mm06t_colors.png',  // folded pocket knife/tool
      'https://colorissimo.com/upload/reiter/cache/400_ofertownik_inserts_2025_nowe_51.png',  // multi-tool lifestyle outdoor
    ],
    price: 59.99,
    category: 'sports',
    rating: 4.8,
    reviews: 743,
    inStock: true,
    description: 'Lightweight titanium multi-tool perfect for camping, hiking, and everyday carry.',
    details: ['Titanium construction', '12 functions', 'Compact folded', 'Lifetime warranty'],
  },

  // ── um-021 · Velora Leather Wallet ──────────────────────────────────────────
  {
    id: 'um-021',
    name: 'Leather Wallet',
    images: [
      'https://img.drz.lazcdn.com/static/bd/p/2a9b8747aab1a0051f6fa189e9e9f857.jpg_720x720q80.jpg_.webp', // black leather bifold wallet white bg
      'https://vonbaer.com/cdn/shop/files/von-baer-classic-bifold-luxurious-leather-brown-color-wallet-stuffed-with-bank-and-credit-cards-like-american-express-and-man-taking-out-dollars-in-porsche.jpg?v=1756723313&width=500',  // leather wallet lifestyle
      'https://m.media-amazon.com/images/I/81cgpw1ceQL._AC_SY300_SX300_QL70_FMwebp_.jpg',  // wallet open showing card slots
      
    ],
    price: 68.0,
    category: 'accessories',
    rating: 4.7,
    reviews: 318,
    inStock: true,
    description: 'Full-grain leather wallet that softens and deepens in color with every year of use.',
    details: ['Full-grain leather', '6 card slots', 'RFID-blocking lining', 'Slim profile'],
  },

  // ── um-022 · Solstice Aviator Sunglasses ────────────────────────────────────
  {
    id: 'um-022',
    name: 'Optical Black Original Pilot Sunglasses',
    images: [
      'https://m.media-amazon.com/images/I/91fycNjCRhL._AC_SX569_.jpg',  // sunglasses lifestyle outdoor
      'https://m.media-amazon.com/images/I/61sHszMVWEL._AC_SX569_.jpg',  // aviator sunglasses white background
      'https://m.media-amazon.com/images/I/61msFexXKEL._AC_SX569_.jpg',   // aviator sunglasses front 
      
    ],
    price: 54.5,
    category: 'accessories',
    rating: 4.5,
    reviews: 276,
    inStock: true,
    description: 'Polarized lenses and a lightweight metal frame.',
    details: ['Polarized UV400 lenses', 'Lightweight alloy frame', 'Spring hinges', 'Includes hard case'],
  },

  // ── um-023 · Heritage Canvas Backpack ───────────────────────────────────────
  {
    id: 'um-023',
    name: 'Waterproof Canvas Backpack for Men',
    images: [
      'https://m.media-amazon.com/images/I/71iCEauuSSL._AC_SL1500_.jpg',  // canvas backpack front view
      'https://m.media-amazon.com/images/I/919utxiFlEL._AC_SL1500_.jpg',  // backpack open interior view
      'https://m.media-amazon.com/images/I/71X+c0tH2lL._AC_SL1500_.jpg',  // backpack lifestyle outdoor
    ],
    price: 95.0,
    category: 'accessories',
    rating: 4.8,
    reviews: 542,
    inStock: true,
    description: 'Waxed canvas and leather trim built for camping and outdoor adventures.',
    details: ['Waxed canvas body', 'Leather trim & straps', 'Padded laptop sleeve', 'Brass hardware'],
  },

  // ── um-024 · Forged Chef's Knife ─────────────────────────────────────────────
  {
    id: 'um-024',
    name: "Forged Chef's Knife",
    images: [
      'https://m.media-amazon.com/images/I/71L959ckhpL._AC_SX679_.jpg',  // chef knife on white marble
      'https://m.media-amazon.com/images/I/81dzc+N5KsL._AC_SL1500_.jpg',  // knife blade profile studio
      'https://m.media-amazon.com/images/I/817R2cT0LtL._AC_SL1500_.jpg',  // kitchen knife lifestyle
    ],
    price: 72.0,
    category: 'kitchen',
    rating: 4.9,
    reviews: 401,
    inStock: false,
    description: 'A single-piece forged blade balanced for precision—the one knife most cooks reach for first.',
    details: ['High-carbon forged steel', 'Full-tang balance', 'Hand-finished edge', 'Walnut handle'],
  },

  // ── um-025 · Pour-Over Coffee Set ───────────────────────────────────────────
  {
    id: 'um-025',
    name: 'Pour-Over Coffee Set',
    images: [
      'https://m.media-amazon.com/images/I/51gtlbVoM9L._AC_SL1200_.jpg',  // coffee set with carafe
      'https://m.media-amazon.com/images/I/71hy0QUt0mL._AC_SL1500_.jpg',  // pour-over lifestyle brewing
      p(302899),   // pour-over coffee dripper white bg
    ],
    price: 48.0,
    category: 'kitchen',
    rating: 4.6,
    reviews: 289,
    inStock: true,
    description: 'A slow-brew ritual: ceramic dripper, glass carafe, and a measuring scoop in one set.',
    details: ['Ceramic dripper', '600ml glass carafe', 'Reusable filter', 'Bamboo coaster base'],
  },

  // ── um-026 · Cast Iron Skillet ───────────────────────────────────────────────
  {
    id: 'um-026',
    name: 'Cast Iron Skillet',
    images: [
      'https://m.media-amazon.com/images/I/81V1S4jvreL._AC_SL1500_.jpg',  // cast iron cooking lifestyle
      'https://m.media-amazon.com/images/I/71mm5J-vJxL._AC_SL1500_.jpg',  // cast iron skillet white background
      'https://m.media-amazon.com/images/I/81CLhg8nB8L._AC_SL1500_.jpg',   // skillet top-down studio
      
    ],
    price: 39.99,
    category: 'kitchen',
    rating: 4.8,
    reviews: 663,
    inStock: true,
    description: 'Pre-seasoned and built to outlast generations—goes from stovetop to oven without worry.',
    details: ['Pre-seasoned finish', 'Oven-safe to 500°F', 'Even heat retention', '10-inch diameter'],
  },

  // ── um-027 · Linen Kitchen Apron ────────────────────────────────────────────
  {
    id: 'um-027',
    name: 'Linen Kitchen Apron',
    images: [
      'https://m.media-amazon.com/images/I/51zytCijqWL._AC_SX569_.jpg',  // apron worn lifestyle kitchen
      'https://m.media-amazon.com/images/I/51irU45AjPL._AC_SX569_.jpg',  // apron worn lifestyle kitchen
      'https://m.media-amazon.com/images/I/51QC+p0MDtL._AC_SX569_.jpg',  // front view apron studio
      
    ],
    price: 32.0,
    category: 'kitchen',
    rating: 4.4,
    reviews: 158,
    inStock: true,
    description: 'Heavyweight stonewashed linen that softens with every wash, with deep front pockets.',
    details: ['Stonewashed linen', 'Adjustable neck strap', 'Two front pockets', 'Machine washable'],
  },

  // ── um-028 · Lumen Articulating Desk Lamp ───────────────────────────────────
  {
    id: 'um-028',
    name: 'Lumen Articulating Desk Lamp',
    images: [
      p(1112598),  // modern articulating desk lamp white bg
      'https://i5.walmartimages.com/seo/LEPOWER-Metal-Desk-Lamp-Adjustable-Gooseneck-Reading-Lamp-for-Home-Office-Bedroom-Black_dceb4fc3-9837-41a0-8823-f4e1fe0847dc.d49bfcf145da1e14ed52d27fbf5457c8.jpeg',  // task lamp studio shot
      'https://m.media-amazon.com/images/I/41zBcislIBL._AC_US750_.jpg',  // lamp on desk lifestyle
    ],
    price: 64.0,
    category: 'electronics',
    rating: 4.6,
    reviews: 372,
    inStock: true,
    description: 'Warm, glare-free task lighting with a fully articulating arm and brass-finished joints.',
    details: ['Stepless dimming', 'Adjustable color temperature', 'Articulating arm', 'USB-C charging port'],
  },

  // ── um-029 · Aria Noise-Isolating Earbuds ───────────────────────────────────
  {
    id: 'um-029',
    name: 'Wireless Noise-Isolating Earbuds',
    images: [
      'https://m.media-amazon.com/images/I/61LxItqjbXL._AC_SL1500_.jpg',  // true wireless earbuds in charging case
      'https://m.media-amazon.com/images/I/71zfmK7JjOL._AC_SL1500_.jpg',  // earbuds white background studio
      'https://m.media-amazon.com/images/I/71xM5sgWiZL._AC_SL1500_.jpg',  // earbuds lifestyle shot
    ],
    price: 99.0,
    category: 'electronics',
    rating: 4.5,
    reviews: 894,
    inStock: true,
    description: 'Wireless Earbuds, 45dB Hybrid Noise Cancelling Earbuds, Hi-Res Audio, Advanced Equaliser, Dual Connect, 6 Mics, 42.5H Playtime Ear Buds Wireless Bluetooth, Black, white',
    details: ['Passive noise isolation', '28-hour total battery', 'IPX4 splash resistance', 'Touch controls'],
  },

  // ── um-030 · Voyage Leather Tote ────────────────────────────────────────────
  {
    id: 'um-030',
    name: 'Leather Bag',
    images: [
      'https://m.media-amazon.com/images/I/61iiXKUfJzL._AC_SX569_.jpg',  // black leather tote clean background
      'https://m.media-amazon.com/images/I/61jX-aH+C3L._AC_SX569_.jpg',  // leather tote top-down view
      'https://m.media-amazon.com/images/I/61WKfC3Z8PL._AC_SX569_.jpg',  // tote bag lifestyle
    ],
    price: 110.0,
    category: 'fashion',
    rating: 4.7,
    reviews: 233,
    inStock: true,
    description: 'A structured everyday tote in vegetable-tanned leather, roomy enough for work or travel.',
    details: ['Vegetable-tanned leather', 'Interior zip pocket', 'Reinforced base', 'Fits 15" laptop'],
  },

  // ── um-031 · Wool Blend Scarf ────────────────────────────────────────────────
  {
    id: 'um-031',
    name: 'Warm winter Scarf',
    images: [
      'https://m.media-amazon.com/images/I/815vSAaOXtL._AC_SX569_.jpg',  // folded black scarf clean background
      'https://i.etsystatic.com/21657310/r/il/1067e4/3555086422/il_570xN.3555086422_onu8.jpg',  // knit scarf texture closeup
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBzQK43GoL-PTJwlpiZX5lBEXZG4zLfr1k6kI-xsoO4oxbshB_irTKmU0&s=10',  // scarf worn lifestyle
    ],
    price: 36.0,
    category: 'fashion',
    rating: 4.6,
    reviews: 197,
    inStock: true,
    description: 'A soft wool-blend scarf with a fine herringbone weave, generously sized for wrapping twice.',
    details: ['Wool-blend weave', 'Fringed edges', '180cm length', 'Dry clean recommended'],
  },

  // ── um-032 · Botanical Hand Cream Trio ──────────────────────────────────────
  {
    id: 'um-032',
    name: 'Suave Lotion, Cocoa Butter Shea',
    images: [
      'https://m.media-amazon.com/images/I/71YnrDZe9ML._SL1500_.jpg',  // hand cream 
      'https://m.media-amazon.com/images/I/81Wt++HMa0L._SL1500_.jpg',  // clear bottle hand cream set
      'https://m.media-amazon.com/images/I/51-4roExsML._SL1000_.jpg',  // cream on skin lifestyle
    ],
    price: 29.0,
    category: 'beauty',
    rating: 4.8,
    reviews: 412,
    inStock: true,
    description: 'Suave Lotion, Cocoa Butter Shea Nourishing Hand & Body Lotion, Travel-Size Lotion for Extremely Dry Skin, Moisturizing Cream for Glowing Skin, 24H.',
    details: ['Shea & cocoa butter base', '3 x 30ml tubes', 'Fast-absorbing finish', 'Paraben-free'],
  },
];

window.UNIVERSAL_MARKET_PRODUCTS = PRODUCTS;
