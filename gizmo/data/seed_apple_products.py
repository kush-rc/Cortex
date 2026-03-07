"""
Cortex — Apple Product Data Import Script
Imports real Apple product data into MongoDB

Usage:
  1. Make sure MongoDB is running locally (or update MONGO_URI)
  2. Run: python gizmo/data/seed_apple_products.py
"""

from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")

products = [
    {
        "name": "iPhone 17 Pro",
        "category": "iphone",
        "tagline": "Innovative design for ultimate performance and battery life.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b95000.00 instant cashback on selected iPhone models with eligible cards.",
        "price": 134900,
        "financing": "From \u20b921650.00/mo. with instant cashback and No Cost EMI",
        "models": [
            {
                "name": "iPhone 17 Pro",
                "display": "15.9 cm (6.3\u2033) display",
                "price": 134900,
                "financing": "From \u20b921650.00/mo. with instant cashback and No Cost EMI"
            },
            {
                "name": "iPhone 17 Pro Max",
                "display": "17.4 cm (6.9\u2033) display",
                "price": 149900,
                "financing": "From \u20b924150.00/mo. with instant cashback and No Cost EMI"
            }
        ],
        "colors": [
            "Silver",
            "Cosmic Orange",
            "Deep Blue"
        ],
        "display": "Super Retina XDR display with ProMotion, Always-On display, Dynamic Island",
        "chip": "A19 Pro chip",
        "camera": "48MP Pro Fusion camera system \u2014 48MP Fusion Main | 48MP Fusion Ultra Wide | 48MP Fusion Telephoto",
        "front_camera": "18MP Center Stage front camera",
        "battery": "Up to 37 hours video playback",
        "storage": [
            "256GB",
            "512GB",
            "1TB",
            "2TB"
        ],
        "storage_prices": {
            "256GB": 0,
            "512GB": 20000,
            "1TB": 40000,
            "2TB": 95000
        },
        "applecare": 20900,
        "trade_in": "\u20b93350.00\u2013\u20b964000.00",
        "os": "iOS 19",
        "highlight": "A19 Pro. Pro Fusion camera. Apple Intelligence.",
        "description": "The iPhone 17 Pro features the powerful A19 Pro chip and a pro-grade triple 48MP Pro Fusion camera system for stunning detail in every shot. With an aluminium unibody design, Action button, Camera Control, and the brightest Super Retina XDR display ever with Dynamic Island, it resets the bar for what a smartphone can do.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_1.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_2.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_3.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_4.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_5.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_6.jpg"
        ]
    },
    {
        "name": "iPhone 17 Pro Max",
        "category": "iphone",
        "tagline": "Innovative design for ultimate performance and battery life.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b95000.00 instant cashback on selected iPhone models with eligible cards.",
        "price": 149900,
        "financing": "From \u20b924150.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "Silver",
            "Cosmic Orange",
            "Deep Blue"
        ],
        "display": "17.4 cm (6.9\u2033) Super Retina XDR display with ProMotion, Always-On display, Dynamic Island",
        "chip": "A19 Pro chip",
        "camera": "48MP Pro Fusion camera system \u2014 48MP Fusion Main | 48MP Fusion Ultra Wide | 48MP Fusion Telephoto",
        "front_camera": "18MP Center Stage front camera",
        "battery": "Up to 33 hours video playback",
        "storage": [
            "256GB",
            "512GB",
            "1TB",
            "2TB"
        ],
        "storage_prices": {
            "256GB": 0,
            "512GB": 20000,
            "1TB": 40000,
            "2TB": 95000
        },
        "applecare": 23900,
        "trade_in": "\u20b93350.00\u2013\u20b964000.00",
        "os": "iOS 19",
        "highlight": "A19 Pro. Pro Fusion camera. Apple Intelligence.",
        "description": "The iPhone 17 Pro Max features the powerful A19 Pro chip and a pro-grade triple 48MP Pro Fusion camera system for stunning detail in every shot. With an aluminium unibody design, Action button, Camera Control, and the brightest Super Retina XDR display ever with Dynamic Island, it resets the bar for what a smartphone can do.",
        "inStock": True,
        "featured": False,
        "new": True,
        "images": [
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_1.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_2.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_3.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_4.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_5.jpg",
            "/static/product_images/iphone/iphone_17_pro/iphone17pro_6.jpg"
        ]
    },
    {
        "name": "iPhone Air",
        "category": "iphone",
        "tagline": "The thinnest iPhone ever. With the power of pro inside.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b95000.00 instant cashback on selected iPhone models with eligible cards.",
        "price": 119900,
        "financing": "From \u20b919150.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "Sky Blue",
            "Light Gold",
            "Cloud White",
            "Space Black"
        ],
        "display": "16.63 cm (6.5\u2033) Super Retina XDR display with ProMotion, Always-On display, Dynamic Island",
        "chip": "A19 Pro chip",
        "camera": "48MP Fusion camera system \u2014 48MP Fusion Main",
        "front_camera": "18MP Center Stage front camera",
        "battery": "Up to 27 hours video playback",
        "storage": [
            "256GB",
            "512GB",
            "1TB"
        ],
        "storage_prices": {
            "256GB": 0,
            "512GB": 20000,
            "1TB": 40000
        },
        "applecare": 20900,
        "trade_in": "\u20b93350.00\u2013\u20b964000.00",
        "os": "iOS 19",
        "highlight": "Thinnest iPhone ever. A19 Pro. Titanium frame. Apple Intelligence.",
        "description": "Meet iPhone Air \u2014 the thinnest, lightest iPhone ever made. Powered by the A19 Pro chip with a titanium frame, Action button, and Camera Control. Features a stunning 6.5-inch ProMotion display with Dynamic Island and a powerful 48MP Fusion camera. Built for Apple Intelligence.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/iphone/iphone_air/iphoneair_1.jpg",
            "/static/product_images/iphone/iphone_air/iphoneair_2.jpg",
            "/static/product_images/iphone/iphone_air/iphoneair_3.jpg",
            "/static/product_images/iphone/iphone_air/iphoneair_4.jpg",
            "/static/product_images/iphone/iphone_air/iphoneair_5.jpg",
            "/static/product_images/iphone/iphone_air/iphoneair_6.jpg"
        ]
    },
    {
        "name": "iPhone 17",
        "category": "iphone",
        "tagline": "Even more delightful. Even more durable.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b95000.00 instant cashback on selected iPhone models with eligible cards.",
        "price": 82900,
        "financing": "From \u20b913650.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "Lavender",
            "Sage",
            "Mist Blue",
            "White",
            "Black"
        ],
        "display": "15.93 cm (6.3\u2033) Super Retina XDR display with ProMotion, Always-On display, Dynamic Island",
        "chip": "A19 chip",
        "camera": "48MP Dual Fusion camera system \u2014 48MP Fusion Main | 48MP Fusion Ultra Wide",
        "front_camera": "18MP Center Stage front camera",
        "battery": "Up to 30 hours video playback",
        "storage": [
            "256GB",
            "512GB"
        ],
        "storage_prices": {
            "256GB": 0,
            "512GB": 20000
        },
        "applecare": 14900,
        "trade_in": "\u20b93350.00\u2013\u20b964000.00",
        "os": "iOS 19",
        "highlight": "A19 chip. Dual Fusion camera. ProMotion & Always-On display. Apple Intelligence.",
        "description": "iPhone 17 brings ProMotion and Always-On display to everyone. Powered by the A19 chip with 5-core GPU, it features a 48MP Dual Fusion camera system with Ultra Wide, Action button, Camera Control, and Dynamic Island. Built for Apple Intelligence.",
        "inStock": True,
        "featured": False,
        "new": True,
        "images": [
            "/static/product_images/iphone/iphone17/iphone17_1.jpg",
            "/static/product_images/iphone/iphone17/iphone17_2.jpg",
            "/static/product_images/iphone/iphone17/iphone17_3.jpg",
            "/static/product_images/iphone/iphone17/iphone17_4.jpg",
            "/static/product_images/iphone/iphone17/iphone17_5.jpg",
            "/static/product_images/iphone/iphone17/iphone17_6.jpg",
            "/static/product_images/iphone/iphone17/iphone17_7.jpg"
        ]
    },
    {
        "name": "iPhone 16",
        "category": "iphone",
        "tagline": "Amazing performance. Durable design.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b95000.00 instant cashback on selected iPhone models with eligible cards.",
        "price": 69900,
        "financing": "From \u20b910983.00/mo. with instant cashback and No Cost EMI",
        "models": [
            {
                "name": "iPhone 16",
                "display_size": "15.5 cm (6.1\u2033)",
                "storage_note": "Comes with 128GB storage",
                "price": 69900,
                "financing": "From \u20b910983.00/mo."
            },
            {
                "name": "iPhone 16 Plus",
                "display_size": "17.0 cm (6.7\u2033)",
                "storage_note": "Choice of 128GB or 256GB storage",
                "price": 79900,
                "financing": "From \u20b912650.00/mo."
            }
        ],
        "colors": [
            "Ultramarine",
            "Teal",
            "Pink",
            "White",
            "Black"
        ],
        "display": "15.5 cm (6.1\u2033) or 17.0 cm (6.7\u2033) Super Retina XDR display, Dynamic Island",
        "chip": "A18 chip",
        "camera": "Advanced dual-camera system \u2014 48MP Fusion Main | 12MP Ultra Wide",
        "front_camera": "12MP TrueDepth front camera",
        "battery": "Up to 22 hours video playback",
        "storage": [
            "128GB",
            "256GB"
        ],
        "storage_prices": {
            "128GB": 0,
            "256GB": 20000
        },
        "applecare": 14900,
        "trade_in": "\u20b93350.00\u2013\u20b964000.00",
        "os": "iOS 18",
        "highlight": "A18 chip. Dual-camera system. Camera Control. Action button. Apple Intelligence.",
        "description": "iPhone 16. Built for Apple Intelligence. Featuring Camera Control, a 48MP Fusion camera with 12MP Ultra Wide, Action button, Dynamic Island, and the powerful A18 chip with 5-core GPU. Available in five vibrant colours.",
        "inStock": True,
        "featured": False,
        "new": False,
        "images": [
            "/static/product_images/iphone/iphone16/iphone16_1.jpg",
            "/static/product_images/iphone/iphone16/iphone16_2.jpg",
            "/static/product_images/iphone/iphone16/iphone16_3.jpg",
            "/static/product_images/iphone/iphone16/iphone16_4.jpg",
            "/static/product_images/iphone/iphone16/iphone16_5.jpg",
            "/static/product_images/iphone/iphone16/iphone16_6.jpg",
            "/static/product_images/iphone/iphone16/iphone16_7.jpg",
            "/static/product_images/iphone/iphone16/iphone16_8.jpg"
        ]
    },
    {
        "name": "iPhone 16 Plus",
        "category": "iphone",
        "tagline": "Amazing performance. Durable design.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b95000.00 instant cashback on selected iPhone models with eligible cards.",
        "price": 79900,
        "financing": "From \u20b912650.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "Ultramarine",
            "Teal",
            "Pink",
            "White",
            "Black"
        ],
        "display": "17.0 cm (6.7\u2033) Super Retina XDR display, Dynamic Island",
        "chip": "A18 chip",
        "camera": "Advanced dual-camera system \u2014 48MP Fusion Main | 12MP Ultra Wide",
        "front_camera": "12MP TrueDepth front camera",
        "battery": "Up to 27 hours video playback",
        "storage": [
            "128GB",
            "256GB"
        ],
        "storage_prices": {
            "128GB": 0,
            "256GB": 20000
        },
        "applecare": 14900,
        "trade_in": "\u20b93350.00\u2013\u20b964000.00",
        "os": "iOS 18",
        "highlight": "A18 chip. Dual-camera system. Camera Control. Action button. Apple Intelligence.",
        "description": "iPhone 16 Plus. Built for Apple Intelligence. Featuring an expansive 6.7-inch display, Camera Control, a 48MP Fusion camera with 12MP Ultra Wide, Action button, Dynamic Island, and the powerful A18 chip with 5-core GPU. Available in five vibrant colours.",
        "inStock": True,
        "featured": False,
        "new": False,
        "images": [
            "/static/product_images/iphone/iphone16/iphone16_1.jpg",
            "/static/product_images/iphone/iphone16/iphone16_2.jpg",
            "/static/product_images/iphone/iphone16/iphone16_3.jpg",
            "/static/product_images/iphone/iphone16/iphone16_4.jpg",
            "/static/product_images/iphone/iphone16/iphone16_5.jpg",
            "/static/product_images/iphone/iphone16/iphone16_6.jpg",
            "/static/product_images/iphone/iphone16/iphone16_7.jpg",
            "/static/product_images/iphone/iphone16/iphone16_8.jpg"
        ]
    },
    {
        "name": "iPhone 16e",
        "category": "iphone",
        "tagline": "Everything you love. Including the price.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b95000.00 instant cashback on selected iPhone models with eligible cards.",
        "price": 59900,
        "financing": "From \u20b99317.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "White",
            "Black"
        ],
        "display": "15.40 cm (6.1\u2033) Super Retina XDR display",
        "chip": "A18 chip",
        "camera": "2-in-1 camera system \u2014 48MP Fusion Main",
        "front_camera": "12MP TrueDepth front camera",
        "battery": "Up to 26 hours video playback",
        "storage": [
            "128GB",
            "256GB",
            "512GB"
        ],
        "storage_prices": {
            "128GB": 0,
            "256GB": 10000,
            "512GB": 30000
        },
        "applecare": 10900,
        "trade_in": "\u20b93350.00\u2013\u20b964000.00",
        "os": "iOS 18",
        "highlight": "A18 chip. 48MP camera. Action button. Apple Intelligence. Great value.",
        "description": "iPhone 16e delivers the essential iPhone experience. Powered by the A18 chip with 4-core GPU, it features a 15.40 cm Super Retina XDR display, 48MP Fusion camera, Action button, and is built for Apple Intelligence. Available in White and Black.",
        "inStock": True,
        "featured": False,
        "new": True,
        "images": [
            "/static/product_images/iphone/iphone16e/iphone16e_1.jpg",
            "/static/product_images/iphone/iphone16e/iphone16e_2.jpg",
            "/static/product_images/iphone/iphone16e/iphone16e_3.jpg",
            "/static/product_images/iphone/iphone16e/iphone16e_4.jpg"
        ]
    },
    {
        "name": "MacBook Air 13\" and 15\"",
        "category": "mac",
        "tagline": "M4. Lean. Mean. Machine.",
        "price": 99900,
        "pricing": {
            "34.46cm - 13\u201d": 99900,
            "38.91cm - 15\u201d": 124900
        },
        "sizes": [
            {
                "name": "34.46cm - 13\u201d",
                "footnote": "1"
            },
            {
                "name": "38.91cm - 15\u201d",
                "footnote": "1"
            }
        ],
        "colors": [
            "Sky Blue",
            "Silver",
            "Starlight",
            "Midnight"
        ],
        "display": "Liquid Retina display with True Tone",
        "chips": [
            {
                "name": "10\u2011core CPU, 8\u2011core GPU",
                "price": 0,
                "description": "Brings speed and fluidity to everything you do."
            },
            {
                "name": "10\u2011core CPU, 10\u2011core GPU",
                "price": 20000,
                "description": "Give a boost to intensive tasks like gaming and creative work with more processing and graphics rendering speed."
            }
        ],
        "memory": [
            "16GB",
            "24GB",
            "32GB"
        ],
        "storage": [
            "256GB",
            "512GB",
            "1TB",
            "2TB"
        ],
        "software": [
            {
                "name": "Final Cut Pro Licence",
                "price": 29900
            },
            {
                "name": "Logic Pro Licence",
                "price": 19900
            }
        ],
        "camera": "12MP Center Stage camera",
        "battery": "Up to 18 hours",
        "os": "macOS Sequoia",
        "highlight": "M4 chip. Impossibly thin. All-day battery.",
        "description": "MacBook Air, now with the M4 chip. Faster performance for AI and creative workflows. Available in 13- and 15-inch models with a stunning Liquid Retina display and up to 18 hours of battery life.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_1.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_2.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_3.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_4.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_5.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_6.jpg"
        ]
    },
    {
        "name": "MacBook Pro 14\" and 16\"",
        "category": "mac",
        "tagline": "Pro at its peak.",
        "price": 169900,
        "pricing": {
            "35.97cm - 14\u201d": 169900,
            "41.05cm - 16\u201d": 249900
        },
        "sizes": [
            {
                "name": "35.97cm - 14\u201d",
                "subheading": "Available with M5, M4 Pro or M4 Max chip.",
                "footnote": "1"
            },
            {
                "name": "41.05cm - 16\u201d",
                "subheading": "Available with M4 Pro or M4 Max chip.",
                "footnote": "1"
            }
        ],
        "display_finishes": [
            {
                "name": "Standard display",
                "description": "Engineered for low reflectivity to reduce glare in your environment."
            },
            {
                "name": "Nano-texture display",
                "description": "Further reduces glare and reflections in bright lighting conditions."
            }
        ],
        "colors": [
            "Space Black",
            "Silver"
        ],
        "display": "Liquid Retina XDR, ProMotion, 1600 nits",
        "chips": [
            {
                "name": "M5 chip",
                "price": 0,
                "description": "Next-generation speed and powerful on-device AI for the personal, professional and creative tasks you do every day."
            },
            {
                "name": "M4 Pro chip",
                "price": 30000,
                "description": "Provides more performance and higher memory options for more demanding workflows."
            },
            {
                "name": "M4 Max chip",
                "price": 150000,
                "description": "Our most advanced chip ever built for a pro laptop powers the most extreme workflows."
            }
        ],
        "camera": "12MP Center Stage camera",
        "battery": "Up to 24 hours",
        "storage": [
            "512GB",
            "1TB",
            "2TB",
            "4TB",
            "8TB"
        ],
        "memory": [
            "16GB",
            "24GB",
            "32GB",
            "48GB",
            "64GB",
            "128GB"
        ],
        "software": [
            {
                "name": "Final Cut Pro Licence",
                "price": 29900
            },
            {
                "name": "Logic Pro Licence",
                "price": 19900
            }
        ],
        "os": "macOS Sequoia",
        "highlight": "M5/M4 Pro/Max. The ultimate pro laptop.",
        "description": "The new MacBook Pro. Powered by the next-generation M5, M4 Pro, and M4 Max chips. Featuring the world's best laptop display, up to 24 hours of battery life, and a pro connectivity array.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/Mac/MacBook_Pro/macpro_1.webp",
            "/static/product_images/Mac/MacBook_Pro/macpro_2.webp",
            "/static/product_images/Mac/MacBook_Pro/macpro_3.webp",
            "/static/product_images/Mac/MacBook_Pro/macpro_7.webp"
        ]
    },
    {
        "name": "iMac",
        "category": "mac",
        "tagline": "Built for Apple Intelligence.",
        "price": 134900,
        "pricing": {
            "M4 chip with two Thunderbolt ports": 134900,
            "M4 chip with four Thunderbolt ports": 154900
        },
        "colors": [
            "Blue",
            "Purple",
            "Pink",
            "Orange",
            "Yellow",
            "Green",
            "Silver"
        ],
        "display": "24-inch 4.5K Retina display",
        "display_finishes": [
            {
                "name": "Standard glass",
                "description": "Engineered for low reflectivity to reduce glare in your environment."
            },
            {
                "name": "Nano-texture glass",
                "description": "Further reduces glare and reflections in bright lighting conditions."
            }
        ],
        "chips": [
            {
                "name": "M4 chip with two Thunderbolt ports",
                "price": 0,
                "description": "8\u2011core CPU, 8\u2011core GPU, 16\u2011core Neural Engine. Two Thunderbolt / USB 4 ports."
            },
            {
                "name": "M4 chip with four Thunderbolt ports",
                "price": 20000,
                "description": "10-core CPU, 10\u2011core GPU, 16\u2011core Neural Engine. Four Thunderbolt / USB 4 ports, Gigabit Ethernet and Magic Keyboard with Touch ID."
            }
        ],
        "memory": [
            "16GB",
            "24GB",
            "32GB"
        ],
        "storage": [
            "256GB",
            "512GB",
            "1TB",
            "2TB"
        ],
        "software": [
            {
                "name": "Final Cut Pro Licence",
                "price": 29900
            },
            {
                "name": "Logic Pro Licence",
                "price": 19900
            }
        ],
        "camera": "12MP Center Stage camera",
        "battery": "N/A",
        "os": "macOS Sequoia",
        "highlight": "M4 chip. 12MP Center Stage camera. Apple Intelligence.",
        "description": "The world\u2019s best all-in-one desktop, now supercharged by the M4 chip. With a stunning 24\u2011inch 4.5K Retina display in a thin, colorful design, iMac is the ultimate way to work and play.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/Mac/imac/imac_1.jpg",
            "/static/product_images/Mac/imac/imac_2.webp",
            "/static/product_images/Mac/imac/imac_3.webp",
            "/static/product_images/Mac/imac/imac_4.webp",
            "/static/product_images/Mac/imac/imac_5.webp",
            "/static/product_images/Mac/imac/imac_6.webp",
            "/static/product_images/Mac/imac/imac_7.webp",
            "/static/product_images/Mac/imac/imac_8.webp",
            "/static/product_images/Mac/imac/imac_9.webp",
            "/static/product_images/Mac/imac/imac_h.jpg"
        ]
    },
    {
        "name": "Mac mini",
        "category": "mac",
        "tagline": "Built for Apple Intelligence.",
        "price": 59900,
        "pricing": {
            "M4 chip": 59900,
            "M4 Pro chip": 149900
        },
        "colors": [
            "Silver"
        ],
        "display": "N/A",
        "chips": [
            {
                "name": "M4 chip",
                "price": 0,
                "description": "10\u2011core CPU, 10\u2011core GPU, 16\u2011core Neural Engine."
            },
            {
                "name": "M4 Pro chip",
                "price": 90000,
                "description": "12-core CPU, 16\u2011core GPU, 16\u2011core Neural Engine."
            }
        ],
        "memory": [
            "16GB",
            "24GB",
            "32GB",
            "48GB",
            "64GB"
        ],
        "storage": [
            "256GB",
            "512GB",
            "1TB",
            "2TB",
            "4TB",
            "8TB"
        ],
        "ethernet_options": [
            {
                "name": "Gigabit Ethernet",
                "price": 0,
                "description": "Standard networking, up to 1Gb link speed."
            },
            {
                "name": "10 Gigabit Ethernet",
                "price": 10000,
                "description": "Higher connectivity bandwidth, up to 10Gb link speeds."
            }
        ],
        "software": [
            {
                "name": "Final Cut Pro Licence",
                "price": 29900
            },
            {
                "name": "Logic Pro Licence",
                "price": 19900
            }
        ],
        "camera": "N/A",
        "battery": "N/A",
        "os": "macOS Sequoia",
        "highlight": "M4 or M4 Pro chip. Built for Apple Intelligence. 5x5 inch design.",
        "description": "Mac mini is now smaller and mightier than ever. Powered by M4 and M4 Pro chips for pro-level performance in a 5x5 inch design.",
        "inStock": True,
        "featured": False,
        "new": True,
        "images": [
            "/static/product_images/Mac/Macmini/macmini_1.jpg",
            "/static/product_images/Mac/Macmini/macmini_2.webp",
            "/static/product_images/Mac/Macmini/macmini_3.webp",
            "/static/product_images/Mac/Macmini/macmini_4.webp",
            "/static/product_images/Mac/Macmini/macmini_5.webp",
            "/static/product_images/Mac/Macmini/macmini_h.jpg"
        ]
    },
    {
        "name": "Mac Studio",
        "category": "mac",
        "tagline": "Built for Apple Intelligence.",
        "price": 214900,
        "pricing": {
            "M4 Max chip": 214900,
            "M3 Ultra chip": 429900
        },
        "colors": [
            "Silver"
        ],
        "display": "N/A",
        "chips": [
            {
                "name": "M4 Max chip (14-core CPU)",
                "price": 0,
                "description": "14-core CPU, 32-core GPU, 16-core Neural Engine."
            },
            {
                "name": "M4 Max chip (16-core CPU)",
                "price": 50000,
                "description": "16-core CPU, 40-core GPU, 16-core Neural Engine."
            },
            {
                "name": "M3 Ultra chip (24-core CPU)",
                "price": 215000,
                "description": "24-core CPU, 60-core GPU, 32-core Neural Engine."
            },
            {
                "name": "M3 Ultra chip (28-core CPU)",
                "price": 315000,
                "description": "28-core CPU, 76-core GPU, 32-core Neural Engine."
            }
        ],
        "memory": [
            "36GB",
            "48GB",
            "64GB",
            "96GB",
            "128GB",
            "256GB",
            "512GB"
        ],
        "storage": [
            "512GB",
            "1TB",
            "2TB",
            "4TB",
            "8TB",
            "16TB"
        ],
        "software": [
            {
                "name": "Final Cut Pro Licence",
                "price": 29900
            },
            {
                "name": "Logic Pro Licence",
                "price": 19900
            }
        ],
        "camera": "N/A",
        "battery": "N/A",
        "os": "macOS Sequoia",
        "highlight": "M4 Max or M3 Ultra chip. Built for Apple Intelligence. Outrageous performance.",
        "description": "Mac Studio. A compact powerhouse that fits on your desk. Driven by the M4 Max and M3 Ultra chips for extreme workflow capabilities.",
        "inStock": True,
        "featured": True,
        "new": False,
        "images": [
            "/static/product_images/Mac/Macstudio/macs_1.jpg",
            "/static/product_images/Mac/Macstudio/macs_2.webp",
            "/static/product_images/Mac/Macstudio/macs_3.webp",
            "/static/product_images/Mac/Macstudio/macs_4.webp",
            "/static/product_images/Mac/Macstudio/macs_5.webp",
            "/static/product_images/Mac/Macstudio/macs_6.webp",
            "/static/product_images/Mac/Macstudio/macs_h.jpg"
        ]
    },
    {
        "name": "Mac Pro",
        "category": "mac",
        "tagline": "Transformed by Apple silicon.",
        "price": 729900,
        "pricing": {
            "Tower": 729900
        },
        "colors": [
            "Silver"
        ],
        "display": "N/A",
        "enclosure_options": [
            {
                "name": "Tower",
                "price": 0,
                "description": "Arrange it to sit on or under your desk."
            },
            {
                "name": "Rack",
                "price": 50000,
                "description": "Optimised for rack mounting in server rooms."
            }
        ],
        "chips": [
            {
                "name": "M2 Ultra with 60-core GPU",
                "price": 0,
                "description": "24\u2011core CPU, 60\u2011core GPU, 32\u2011core Neural Engine. Incredible performance comes standard."
            },
            {
                "name": "M2 Ultra with 76-core GPU",
                "price": 100000,
                "description": "24\u2011core CPU, 76\u2011core GPU, 32\u2011core Neural Engine. Greater speed for graphics-intensive tasks."
            }
        ],
        "memory": [
            "64GB",
            "128GB",
            "192GB"
        ],
        "storage": [
            "1TB",
            "2TB",
            "4TB",
            "8TB"
        ],
        "software": [
            {
                "name": "Final Cut Pro Licence",
                "price": 29900
            },
            {
                "name": "Logic Pro Licence",
                "price": 19900
            }
        ],
        "camera": "N/A",
        "battery": "N/A",
        "os": "macOS Sequoia",
        "highlight": "M2 Ultra chip. Workstation-class PCIe expansion. Apple silicon power.",
        "description": "Mac Pro is the ultimate workstation. Featuring the M2 Ultra chip and PCIe expansion for specialized workflows.",
        "inStock": True,
        "featured": False,
        "new": False,
        "images": [
            "/static/product_images/Mac/Macpro/macpro_1.jpg",
            "/static/product_images/Mac/Macpro/macpro_2.webp",
            "/static/product_images/Mac/Macpro/macpro_3.webp",
            "/static/product_images/Mac/Macpro/macpro_4.webp",
            "/static/product_images/Mac/Macpro/macpro_5.webp"
        ]
    },
    {
        "name": "iPad Pro",
        "category": "ipad",
        "tagline": "The thinnest Apple product ever. Built for Apple Intelligence.",
        "ribbon_text": "Last chance to get up to \u20b94000.00 instant cashback on iPad with eligible cards. Plus up to 12 months of No Cost EMI.",
        "price": 99900,
        "pricing": {
            "11-inch model": 99900,
            "13-inch model": 129900
        },
        "colors": [
            "Space Black",
            "Silver"
        ],
        "display": "Ultra Retina XDR display (Tandem OLED)",
        "sizes": [
            {
                "name": "28.22 cm (11\u2033)",
                "price": 0,
                "description": "Ultra Retina XDR display",
                "subheading": "Ultra Retina XDR display"
            },
            {
                "name": "33.02 cm (13\u2033)",
                "price": 30000,
                "description": "Ultra Retina XDR display",
                "subheading": "Ultra Retina XDR display"
            }
        ],
        "chips": [
            {
                "name": "M5 chip (9-core CPU)",
                "price": 0,
                "description": "9\u2011core CPU, 10\u2011core GPU, 16\u2011core Neural Engine. (Available with 256GB/512GB storage)"
            },
            {
                "name": "M5 chip (10-core CPU)",
                "price": 60000,
                "description": "10-core CPU, 10-core GPU, 16-core Neural Engine. (Available with 1TB/2TB storage)"
            }
        ],
        "memory_configs": {
            "256GB": "12GB",
            "512GB": "12GB",
            "1TB": "16GB",
            "2TB": "16GB"
        },
        "storage": [
            "256GB",
            "512GB",
            "1TB",
            "2TB"
        ],
        "storage_prices": {
            "256GB": 0,
            "512GB": 20000,
            "1TB": 60000,
            "2TB": 100000
        },
        "display_glass": [
            {
                "name": "Standard glass",
                "price": 0
            },
            {
                "name": "Nano-texture glass",
                "price": 10000,
                "description": "Available for 1TB and 2TB models"
            }
        ],
        "connectivity": [
            {
                "name": "Wi-Fi",
                "price": 0
            },
            {
                "name": "Wi-Fi + Cellular",
                "price": 20000
            }
        ],
        "accessories": [
            {
                "name": "Apple Pencil Pro",
                "price": 11900
            },
            {
                "name": "Apple Pencil (USB-C)",
                "price": 7900
            },
            {
                "name": "Magic Keyboard (11-inch)",
                "price": 29900
            },
            {
                "name": "Magic Keyboard (13-inch)",
                "price": 33900
            }
        ],
        "camera": "12MP Wide camera, Landscape 12MP Ultra Wide front camera",
        "battery": "Up to 10 hours of surfing the web on Wi\u2011Fi",
        "os": "iPadOS 18",
        "highlight": "M5 chip. Ultra Retina XDR. Thinnest Apple product. Built for Apple Intelligence.",
        "description": "The new iPad Pro. The thinnest Apple product ever. Powered by the M5 chip for pro performance and the groundbreaking Ultra Retina XDR display.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/ipad/ipadpro/ipadpro_1.jpg",
            "/static/product_images/ipad/ipadpro/ipadpro_2.jpg",
            "/static/product_images/ipad/ipadpro/ipadpro_3.jpg",
            "/static/product_images/ipad/ipadpro/ipadpro_4.jpg"
        ]
    },
    {
        "name": "iPad Air",
        "category": "ipad",
        "tagline": "Two sizes. Faster chip. Built for Apple Intelligence.",
        "ribbon_text": "Last chance to get up to \u20b94000.00 instant cashback on iPad with eligible cards. Plus up to 12 months of No Cost EMI.",
        "price": 59900,
        "pricing": {
            "11-inch model": 59900,
            "13-inch model": 79900
        },
        "colors": [
            "Space Grey",
            "Blue",
            "Purple",
            "Starlight"
        ],
        "display": "Liquid Retina display",
        "sizes": [
            {
                "name": "27.59 cm (11\u2033)",
                "price": 0,
                "description": "Liquid Retina display",
                "subheading": "Liquid Retina display"
            },
            {
                "name": "32.78 cm (13\u2033)",
                "price": 20000,
                "description": "Liquid Retina display",
                "subheading": "Liquid Retina display"
            }
        ],
        "chips": [
            {
                "name": "M2 chip",
                "price": 0,
                "description": "8\u2011core CPU, 9\u2011core GPU, 16\u2011core Neural Engine."
            }
        ],
        "storage": [
            "128GB",
            "256GB",
            "512GB",
            "1TB"
        ],
        "storage_prices": {
            "128GB": 0,
            "256GB": 10000,
            "512GB": 30000,
            "1TB": 50000
        },
        "connectivity": [
            {
                "name": "Wi-Fi",
                "price": 0
            },
            {
                "name": "Wi-Fi + Cellular",
                "price": 15000
            }
        ],
        "accessories": [
            {
                "name": "Apple Pencil Pro",
                "price": 11900
            },
            {
                "name": "Apple Pencil (USB-C)",
                "price": 7900
            },
            {
                "name": "Magic Keyboard (11-inch)",
                "price": 26900
            },
            {
                "name": "Magic Keyboard (13-inch)",
                "price": 29900
            }
        ],
        "camera": "12MP Wide camera, Landscape 12MP Ultra Wide front camera",
        "battery": "Up to 10 hours of surfing the web on Wi\u2011Fi",
        "os": "iPadOS 18",
        "highlight": "M2 chip. Two sizes. Landscape camera. Built for Apple Intelligence.",
        "description": "iPad Air. Now available in 11-inch and 13-inch models. Powered by the M2 chip for incredible performance and the Liquid Retina display.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/ipad/ipadair/ipadair_1.jpg",
            "/static/product_images/ipad/ipadair/ipadair_2.webp",
            "/static/product_images/ipad/ipadair/ipadair_3.webp",
            "/static/product_images/ipad/ipadair/ipadair_4.jpg",
            "/static/product_images/ipad/ipadair/ipadair_5.jpg",
            "/static/product_images/ipad/ipadair/ipadair_6.jpg",
            "/static/product_images/ipad/ipadair/ipadair_7.jpg"
        ]
    },
    {
        "name": "iPad",
        "category": "ipad",
        "tagline": "Lovable. Drawable. Magical.",
        "ribbon_text": "Last chance to get up to \u20b94000.00 instant cashback on iPad with eligible cards. Plus up to 12 months of No Cost EMI.",
        "price": 34900,
        "financing": "From \u20b95317.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "Blue",
            "Pink",
            "Yellow",
            "Silver"
        ],
        "display": "10.9-inch Liquid Retina display",
        "chip": "A14 Bionic chip",
        "camera": "12MP Wide camera",
        "battery": "Up to 10 hours of surfing the web on Wi\u2011Fi",
        "storage": [
            "128GB",
            "256GB",
            "512GB"
        ],
        "storage_prices": {
            "128GB": 0,
            "256GB": 10000,
            "512GB": 30000
        },
        "connectivity": [
            {
                "name": "Wi-Fi",
                "price": 0
            },
            {
                "name": "Wi-Fi + Cellular",
                "price": 15000
            }
        ],
        "accessories": [
            {
                "name": "Apple Pencil (USB-C)",
                "price": 7900
            },
            {
                "name": "Apple Pencil (1st generation)",
                "price": 9500
            },
            {
                "name": "Magic Keyboard Folio",
                "price": 24900
            }
        ],
        "applecare": 6900,
        "os": "iPadOS 18",
        "highlight": "All-screen design. A14 Bionic. USB-C.",
        "description": "Colorfully reimagined to be more capable, more intuitive, and even more fun.",
        "inStock": True,
        "featured": True,
        "new": False,
        "images": [
            "/static/product_images/ipad/ipad_1.jpg",
            "/static/product_images/ipad/ipad_2.webp",
            "/static/product_images/ipad/ipad_3.webp",
            "/static/product_images/ipad/ipad_4.webp",
            "/static/product_images/ipad/ipad_5.webp",
            "/static/product_images/ipad/ipad_6.webp"
        ]
    },
    {
        "name": "iPad mini",
        "category": "ipad",
        "tagline": "Portable powerhouse with Apple Intelligence.",
        "ribbon_text": "Last chance to get up to \u20b94000.00 instant cashback on iPad with eligible cards. Plus up to 12 months of No Cost EMI.",
        "price": 49900,
        "financing": "From \u20b97817.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "Space Grey",
            "Blue",
            "Purple",
            "Starlight"
        ],
        "display": "8.3-inch Liquid Retina display",
        "chip": "A17 Pro chip",
        "camera": "12MP Wide camera",
        "battery": "Up to 10 hours of surfing the web on Wi\u2011Fi",
        "storage": [
            "128GB",
            "256GB",
            "512GB"
        ],
        "storage_prices": {
            "128GB": 0,
            "256GB": 10000,
            "512GB": 30000
        },
        "connectivity": [
            {
                "name": "Wi-Fi",
                "price": 0
            },
            {
                "name": "Wi-Fi + Cellular",
                "price": 15000
            }
        ],
        "accessories": [
            {
                "name": "Apple Pencil Pro",
                "price": 11900
            },
            {
                "name": "Apple Pencil (USB-C)",
                "price": 7900
            },
            {
                "name": "Smart Folio",
                "price": 6500
            }
        ],
        "applecare": 6900,
        "os": "iPadOS 18",
        "highlight": "A17 Pro. Apple Intelligence. Ultra portable.",
        "description": "The new iPad mini. Powered by the A17 Pro chip for Apple Intelligence. Small enough to fit in your palm, powerful enough for your biggest ideas.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/ipad/ipadmini/ipadmini_1.jpg",
            "/static/product_images/ipad/ipadmini/ipadmini_2.jpg",
            "/static/product_images/ipad/ipadmini/ipadmini_3.jpg",
            "/static/product_images/ipad/ipadmini/ipadmini_4.jpg",
            "/static/product_images/ipad/ipadmini/ipadmini_5.jpg",
            "/static/product_images/ipad/ipadmini/ipadmini_6.jpg"
        ]
    },
    {
        "name": "Apple Watch Series 11",
        "category": "watch",
        "tagline": "Thin and lightweight design with a big, advanced display.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b96000.00 instant cashback on selected Apple Watch models with eligible cards.",
        "price": 46900,
        "financing": "From \u20b97150.00/mo. with instant cashback and No Cost EMI",
        "pricing": {
            "42mm": 46900,
            "46mm": 49900
        },
        "materials": [
            {
                "name": "Aluminium",
                "price": 0,
                "description": "Matt and polished finishes with a durable Ion-X glass display."
            },
            {
                "name": "Titanium",
                "price": 33000,
                "description": "Polished aerospace-grade titanium with a durable sapphire crystal display."
            }
        ],
        "sizes": [
            {
                "name": "42mm",
                "price": 0
            },
            {
                "name": "46mm",
                "price": 3000
            }
        ],
        "connectivity": [
            {
                "name": "GPS",
                "price": 0,
                "description": "Make calls and send texts with your iPhone nearby."
            },
            {
                "name": "GPS + Cellular",
                "price": 10000,
                "description": "Make calls and send messages with just your Apple Watch."
            }
        ],
        "bands": [
            {
                "name": "Sport Band",
                "price": 0,
                "description": "Durable, pin-and-tuck closure, adjustable"
            },
            {
                "name": "Milanese Loop",
                "price": 0,
                "description": "Smooth mesh design, magnetic closure, infinitely adjustable"
            }
        ],
        "colors": [
            "Space Grey",
            "Silver",
            "Rose Gold",
            "Jet Black",
            "Natural",
            "Gold",
            "Slate"
        ],
        "display": "Always-On Retina display, up to 2,000 nits, Wide-angle OLED, LTPO3",
        "chip": "S10 chip",
        "camera": "N/A",
        "battery": "Up to 24 hours (up to 38 hours in Low Power Mode)",
        "storage": [
            "64GB"
        ],
        "applecare": 7900,
        "os": "watchOS 26",
        "highlight": "S10 chip. Always-On Retina. ECG. Blood Oxygen. Hypertension notifications. 24h Battery.",
        "description": "Apple Watch Series 11 features a thin and lightweight design with an advanced Always-On Retina display up to 2,000 nits. The S10 chip powers health features including ECG, Blood Oxygen, hypertension notifications, temperature sensing, and the Vitals app. Water resistant to 50m with depth gauge to 6m. Up to 24 hours battery life with fast charging.",
        "health": [
            "Hypertension notifications",
            "ECG app",
            "Heart rate notifications",
            "Irregular rhythm notifications",
            "Blood Oxygen app",
            "Temperature sensing",
            "Cycle Tracking",
            "Vitals app",
            "Sleep Tracking",
            "Sleep score"
        ],
        "safety": [
            "Emergency SOS",
            "International Emergency Calling",
            "Fall Detection",
            "Crash Detection"
        ],
        "water_resistance": "Water resistant 50m \u2014 Swim, snorkel, depth gauge to 6m, water temperature sensor",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/watch/watchseries11/watch11_1.png",
            "/static/product_images/watch/watchseries11/watch11_2.png",
            "/static/product_images/watch/watchseries11/watch11_3.png"
        ]
    },
    {
        "name": "Apple Watch SE 3",
        "category": "watch",
        "tagline": "100% recycled aluminium. Great for everyday activities and any type of workout.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b96000.00 instant cashback on selected Apple Watch models with eligible cards.",
        "price": 25900,
        "financing": "From \u20b93983.00/mo. with instant cashback and No Cost EMI",
        "pricing": {
            "40mm": 25900,
            "44mm": 28900
        },
        "materials": [
            {
                "name": "Aluminium",
                "price": 0,
                "description": "100% recycled aluminium. Great for everyday activities and any type of workout."
            }
        ],
        "sizes": [
            {
                "name": "40mm",
                "price": 0
            },
            {
                "name": "44mm",
                "price": 3000
            }
        ],
        "connectivity": [
            {
                "name": "GPS",
                "price": 0,
                "description": "Make calls and send texts with your iPhone nearby."
            },
            {
                "name": "GPS + Cellular",
                "price": 5000,
                "description": "Make calls and send messages with just your Apple Watch. Works with Apple Watch For Your Kids."
            }
        ],
        "bands": [
            {
                "name": "Sport Band",
                "price": 0,
                "description": "Durable, pin-and-tuck closure, adjustable"
            }
        ],
        "colors": [
            "Midnight",
            "Starlight"
        ],
        "display": "Always-On Retina display, Up to 1,000 nits, OLED, LTPO",
        "chip": "S10 chip",
        "camera": "N/A",
        "battery": "Up to 18 hours (up to 32 hours in Low Power Mode)",
        "storage": [
            "32GB"
        ],
        "applecare": 4900,
        "os": "watchOS 26",
        "highlight": "S10 chip. Sleep Tracking. Crash Detection. Temperature sensing. Great value.",
        "description": "Apple Watch SE 3 delivers essential health and safety features at a great value. With an Always-On Retina display up to 1,000 nits, S10 chip, temperature sensing, sleep tracking, Crash Detection, and Fall Detection. Water resistant to 50m. Up to 18 hours battery life with fast charging.",
        "health": [
            "High and low heart rate notifications",
            "Irregular rhythm notifications",
            "Low cardio fitness notifications",
            "Temperature sensing",
            "Cycle Tracking",
            "Vitals app",
            "Sleep Tracking",
            "Sleep score"
        ],
        "safety": [
            "Emergency SOS",
            "International Emergency Calling",
            "Fall Detection",
            "Crash Detection"
        ],
        "water_resistance": "Water resistant 50m \u2014 Swim",
        "inStock": True,
        "featured": False,
        "new": True,
        "images": [
            "/static/product_images/watch/watch_SE_3/watchse3_1.png",
            "/static/product_images/watch/watch_SE_3/watchse3_2.png",
            "/static/product_images/watch/watch_SE_3/watchse3_3.png",
            "/static/product_images/watch/watch_SE_3/watchse3_4.png"
        ]
    },
    {
        "name": "Apple Watch Ultra 3",
        "category": "watch",
        "tagline": "The rugged 49 mm aerospace-grade titanium case comes with precision dual-frequency GPS + Cellular connectivity.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b96000.00 instant cashback on selected Apple Watch models with eligible cards.",
        "price": 89900,
        "financing": "From \u20b913983.00/mo. with instant cashback and No Cost EMI",
        "pricing": {
            "49mm": 89900
        },
        "materials": [
            {
                "name": "Natural Titanium",
                "price": 0,
                "description": "Aerospace-grade titanium. Rugged and corrosion resistant."
            },
            {
                "name": "Black Titanium",
                "price": 0,
                "description": "Aerospace-grade titanium with a striking dark finish."
            }
        ],
        "sizes": [
            {
                "name": "49mm",
                "price": 0
            }
        ],
        "connectivity": [
            {
                "name": "GPS + Cellular",
                "price": 0,
                "description": "Precision dual-frequency GPS with cellular connectivity built in."
            }
        ],
        "bands": [
            {
                "name": "Alpine Loop",
                "price": 0,
                "description": "For outdoor adventure and hiking."
            },
            {
                "name": "Trail Loop",
                "price": 0,
                "description": "For all sports and workouts."
            },
            {
                "name": "Ocean Band",
                "price": 0,
                "description": "For water sports and recreational diving."
            },
            {
                "name": "Titanium Milanese Loop",
                "price": 0,
                "description": "Designed for the ocean, yet elegant for any occasion."
            }
        ],
        "colors": [
            "Natural",
            "Black"
        ],
        "display": "Always-On Retina display, Up to 3,000 nits, Wide-angle OLED, LTPO3",
        "chip": "S10 chip",
        "camera": "N/A",
        "battery": "Up to 42 hours (up to 72 hours in Low Power Mode)",
        "storage": [
            "64GB"
        ],
        "applecare": 9900,
        "os": "watchOS 26",
        "highlight": "49mm Titanium. S10 Chip. Precision dual-frequency GPS. 100m water resistant.",
        "description": "The ultimate sports and adventure watch. Apple Watch Ultra 3 features aerospace-grade titanium in Natural and Black, S10 chip, precision dual-frequency GPS, Always-On Retina display up to 3,000 nits, and up to 42 hours of battery life. Water resistant to 100m with depth gauge to 40m. Built for extreme conditions.",
        "health": [
            "Hypertension notifications",
            "ECG app",
            "High and low heart rate notifications",
            "Irregular rhythm notifications",
            "Low cardio fitness notifications",
            "Blood Oxygen app",
            "Temperature sensing",
            "Cycle Tracking",
            "Vitals app",
            "Sleep Tracking",
            "Sleep score"
        ],
        "safety": [
            "Emergency SOS",
            "International Emergency Calling",
            "Fall Detection",
            "Crash Detection",
            "Siren"
        ],
        "water_resistance": "Water resistant 100m \u2014 Swim, snorkel, scuba, high-speed water sports, depth gauge to 40m, water temperature sensor",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/watch/watch_ultra3/watchultra3_1.png",
            "/static/product_images/watch/watch_ultra3/watchultra3_2.png",
            "/static/product_images/watch/watch_ultra3/watchultra3_3.png",
            "/static/product_images/watch/watch_ultra3/watchultra3_4.png"
        ]
    },
    {
        "name": "AirPods Pro 3",
        "category": "airpods",
        "tagline": "Now with the world's best in\u2011ear Active Noise Cancellation, all\u2011new heart rate sensing, and up to 8 hours of battery life.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b94000.00 instant cashback on AirPods with eligible cards.",
        "price": 25900,
        "financing": "From \u20b94150.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "White"
        ],
        "features": [
            "Up to 4x more Active Noise Cancellation than original AirPods Pro",
            "Adaptive Audio and Transparency mode",
            "Personalised Spatial Audio with dynamic head tracking",
            "Heart rate sensing during workouts",
            "Loud Sound Reduction",
            "Live Translation powered by Apple Intelligence",
            "MagSafe Charging Case (USB-C) with speaker and lanyard loop for Find My",
            "IP57 dust, sweat and water resistant",
            "Free Engraving"
        ],
        "chip": "H2 chip",
        "battery": "Up to 8 hours of listening time with ANC on a single charge",
        "storage": "N/A",
        "applecare": 4900,
        "os": "N/A",
        "highlight": "H2 Chip. 4x ANC. Heart Rate Sensing. IP57. Live Translation.",
        "description": "AirPods Pro 3 deliver breathtaking sound quality with the world's best in\u2011ear Active Noise Cancellation \u2014 up to 4x more than original AirPods Pro. Built\u2011in heart rate sensing tracks your heart rate and calories burned during workouts. Live Translation powered by Apple Intelligence. Completely rebuilt internal architecture for better acoustic performance and redesigned for a more secure fit. Up to 8 hours of listening with ANC. First AirPods with IP57 rating for improved dust, sweat and water resistance. MagSafe Charging Case (USB\u2011C) with speaker, lanyard loop, and 5 silicone ear tip sizes.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/airpods/airpods_3/airpods3_1.jpg",
            "/static/product_images/airpods/airpods_3/airpods3_2.jpg"
        ]
    },
    {
        "name": "AirPods 4 with Active Noise Cancellation",
        "category": "airpods",
        "tagline": "The next evolution of sound, comfort and noise control.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b94000.00 instant cashback on AirPods with eligible cards.",
        "price": 17900,
        "financing": "From \u20b92817.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "White"
        ],
        "features": [
            "Active Noise Cancellation",
            "Adaptive Audio and Transparency mode",
            "Personalised Spatial Audio with dynamic head tracking",
            "Voice Isolation and Conversation Awareness",
            "Live Translation powered by Apple Intelligence",
            "Wireless Charging Case (USB-C) with speaker for Find My",
            "Works with Apple Watch charger and Qi-certified chargers",
            "IP54 dust, sweat and water resistant",
            "Free Engraving"
        ],
        "chip": "H2 chip",
        "battery": "Up to 5 hours of listening (4 hours with ANC), up to 30 hours total with case",
        "storage": "N/A",
        "applecare": 2900,
        "os": "N/A",
        "highlight": "Open-ear ANC. H2 Chip. Adaptive Audio. Live Translation.",
        "description": "Redesigned for exceptional fit and audio performance \u2014 and available with Active Noise Cancellation, Adaptive Audio and Transparency mode for the first time in this design. The powerful H2 chip delivers clearer calls with Voice Isolation, Conversation Awareness and a hands-free way to interact with Siri. Personalised Spatial Audio with dynamic head tracking. IP54 rated. USB-C charging and up to 30 hours of listening time using the case. Wireless Charging Case includes speaker for Find My and supports Apple Watch and Qi-certified chargers. Also features Live Translation powered by Apple Intelligence.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/airpods/airpods_4/airpods4_1.jpg"
        ]
    },
    {
        "name": "AirPods 4",
        "category": "airpods",
        "tagline": "The next evolution of sound and comfort.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b94000.00 instant cashback on AirPods with eligible cards.",
        "price": 12900,
        "financing": "From \u20b91983.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "White"
        ],
        "features": [
            "Personalised Spatial Audio with dynamic head tracking",
            "Voice Isolation for clearer calls",
            "Hey Siri and Siri Interactions",
            "Charging Case (USB-C)",
            "Find My to help locate your AirPods",
            "IP54 dust, sweat and water resistant",
            "Free Engraving"
        ],
        "chip": "H2 chip",
        "battery": "Up to 5 hours of listening time, up to 30 hours total with case",
        "storage": "N/A",
        "applecare": 2900,
        "os": "N/A",
        "highlight": "H2 Chip. Personalised Spatial Audio. IP54. Find My.",
        "description": "Redesigned for exceptional fit and audio performance. The powerful H2 chip delivers clearer calls with Voice Isolation and a hands-free way to interact with Siri. Personalised Spatial Audio with dynamic head tracking places sound all around you. Rated IP54 dust, sweat and water resistant. USB-C charging and up to 30 hours of listening time using the case. And Find My to help you locate your AirPods 4.",
        "inStock": True,
        "featured": False,
        "new": True,
        "images": [
            "/static/product_images/airpods/airpods_4/airpods4_1.jpg"
        ]
    },
    {
        "name": "AirPods Max",
        "category": "airpods",
        "tagline": "The ultimate over\u2011ear listening experience.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus up to \u20b94000.00 instant cashback on AirPods with eligible cards.",
        "price": 59900,
        "financing": "From \u20b99317.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "Blue",
            "Purple",
            "Midnight",
            "Starlight",
            "Orange"
        ],
        "features": [
            "Pro-level Active Noise Cancellation",
            "Transparency mode",
            "Personalised Spatial Audio with dynamic head tracking",
            "Lossless Audio via USB-C",
            "USB-C charging with included cable",
            "Smart Case included",
            "On-head detection for effortless setup"
        ],
        "chip": "H1 chip",
        "battery": "Up to 20 hours of listening time with ANC on a single charge",
        "storage": "N/A",
        "applecare": 6900,
        "os": "N/A",
        "highlight": "Pro ANC. Lossless Audio. USB-C. Smart Case. 5 Colours.",
        "description": "The ultimate over-ear personal listening experience in a variety of fresh colours. AirPods Max deliver stunningly detailed, high-fidelity audio. Personalised Spatial Audio with dynamic head tracking for sound that surrounds you. Pro-level Active Noise Cancellation to remove unwanted noise. Transparency mode to comfortably hear the world around you. USB-C that enables Lossless Audio and easy charging. Up to 20 hours of battery life on a single charge. And effortless setup and on-head detection for a magical listening experience.",
        "inStock": True,
        "featured": True,
        "new": True,
        "images": [
            "/static/product_images/airpods/airpods_max/airpodsmax_1.png",
            "/static/product_images/airpods/airpods_max/airpodsmax_2.png",
            "/static/product_images/airpods/airpods_max/airpodsmax_3.png",
            "/static/product_images/airpods/airpods_max/airpodsmax_4.png",
            "/static/product_images/airpods/airpods_max/airpodsmax_5.png",
            "/static/product_images/airpods/airpods_max/airpodsmax_6.png",
            "/static/product_images/airpods/airpods_max/airpodsmax_7.png"
        ]
    },
    {
        "name": "HomePod mini",
        "category": "tv-home",
        "tagline": "Surprising sound for its size.",
        "price": 10900,
        "financing": "From \u20b91902.00/mo. with EMI",
        "colors": [
            "Blue",
            "Yellow",
            "Midnight",
            "White",
            "Orange"
        ],
        "features": [
            "Full-range driver",
            "Dual force-cancelling passive radiators",
            "Stereo pair capable",
            "Multi-room audio",
            "Siri with voice recognition",
            "Smart home hub",
            "Sound Recognition",
            "Temperature and humidity sensor"
        ],
        "audio": [
            "Surprising sound for its size",
            "Full-range driver",
            "Dual force-cancelling passive radiators",
            "Stereo pair capable",
            "Multi-room audio"
        ],
        "assistant": [
            "Siri",
            "Intelligent assistant",
            "Voice recognition"
        ],
        "smart_home": [
            "Smart home hub",
            "Sound Recognition",
            "Temperature and humidity sensor",
            "Private and secure"
        ],
        "display": "N/A",
        "chip": "S5 chip",
        "camera": "N/A",
        "battery": "N/A",
        "storage": "N/A",
        "applecare": 1600,
        "os": "HomePod Software",
        "highlight": "Surprising sound. Smart home hub. 5 Colours.",
        "description": "Jam-packed with innovation, HomePod mini delivers unexpectedly big sound for its size. Full-range driver and dual force-cancelling passive radiators produce rich, detailed audio. Create a stereo pair or use multi-room audio and Intercom throughout your home. Siri with voice recognition acts as an intelligent assistant. Works as a smart home hub with Sound Recognition and temperature and humidity sensor. Available in five colours. Add another to create a stereo pair or even more to use multi-room audio and Intercom throughout your home.",
        "inStock": True,
        "featured": False,
        "new": False,
        "images": [
            "/static/product_images/TV_and_home/homepod_mini/homepodmini_1.jpg",
            "/static/product_images/TV_and_home/homepod_mini/homepodmini_2.jpg",
            "/static/product_images/TV_and_home/homepod_mini/homepodmini_3.jpg",
            "/static/product_images/TV_and_home/homepod_mini/homepodmini_4.jpg",
            "/static/product_images/TV_and_home/homepod_mini/homepodmini_5.jpg",
            "/static/product_images/TV_and_home/homepod_mini/homepodmini_6.jpg",
            "/static/product_images/TV_and_home/homepod_mini/homepodmini_7.jpg"
        ]
    },
    {
        "name": "HomePod",
        "category": "tv-home",
        "tagline": "Immersive, high\u2011fidelity audio.",
        "ribbon_text": "Get up to 6 months of No Cost EMI plus \u20b92000.00 instant cashback on HomePod with eligible cards.",
        "price": 32900,
        "financing": "From \u20b95150.00/mo. with instant cashback and No Cost EMI",
        "colors": [
            "Midnight",
            "White"
        ],
        "features": [
            "High-excursion woofer",
            "Beamforming array of five tweeters",
            "Spatial Audio",
            "Room sensing technology",
            "Stereo pair capable",
            "Multi-room audio",
            "Siri with voice recognition",
            "Smart home hub",
            "Sound Recognition",
            "Temperature and humidity sensor"
        ],
        "audio": [
            "Immersive, high-fidelity audio",
            "High-excursion woofer",
            "Beamforming array of five tweeters",
            "Spatial Audio",
            "Room sensing",
            "Stereo pair capable",
            "Multi-room audio"
        ],
        "assistant": [
            "Siri",
            "Intelligent assistant",
            "Voice recognition"
        ],
        "smart_home": [
            "Smart home hub",
            "Sound Recognition",
            "Temperature and humidity sensor",
            "Private and secure"
        ],
        "display": "N/A",
        "chip": "S7 chip",
        "camera": "N/A",
        "battery": "N/A",
        "storage": "N/A",
        "applecare": 3900,
        "os": "HomePod Software",
        "highlight": "High-fidelity audio. Spatial Audio. Room sensing. Smart home hub.",
        "description": "HomePod delivers immersive, high-fidelity audio with a high-excursion woofer and beamforming array of five tweeters. Spatial Audio and room sensing technology adapt the sound to your space. Use it as a smart home hub with Sound Recognition, temperature and humidity sensor. Siri with voice recognition. Create a stereo pair or use multi-room audio throughout your home. Add another to create a stereo pair or even more to use multi-room audio and Intercom throughout your home.",
        "inStock": True,
        "featured": False,
        "new": False,
        "images": [
            "/static/product_images/TV_and_home/homepod/homepod_1.jpg",
            "/static/product_images/TV_and_home/homepod/homepod_2.jpg",
            "/static/product_images/TV_and_home/homepod/homepod_3.jpg",
            "/static/product_images/TV_and_home/homepod/homepod_4.jpg"
        ]
    },
    {
        "name": "Apple TV 4K",
        "category": "tv-home",
        "tagline": "The Apple experience. Cinematic in every sense.",
        "ribbon_text": "See all the flexible ways to pay and save on your new Apple TV.",
        "price": 14900,
        "financing": "From \u20b92600.00/mo. with EMI",
        "colors": [
            "Black"
        ],
        "models": [
            {
                "name": "Wi-Fi",
                "subtitle": "with 64GB storage",
                "price": 14900,
                "financing": "From \u20b92600.00/mo. with EMI"
            },
            {
                "name": "Wi-Fi + Ethernet",
                "subtitle": "with 128GB storage",
                "price": 16900,
                "financing": "From \u20b92949.00/mo. with EMI"
            }
        ],
        "features": [
            "4K Dolby Vision",
            "HDR10+",
            "Dolby Atmos",
            "FaceTime on TV",
            "Siri Remote (3rd generation) with USB-C",
            "Smart home hub",
            "Apple TV+, Apple Music, Apple Arcade, Photos",
            "3 months Apple TV+ free with purchase"
        ],
        "video": [
            "4K Dolby Vision",
            "HDR10+"
        ],
        "audio": [
            "Dolby Atmos"
        ],
        "remote": [
            "Siri Remote (3rd generation) with USB-C"
        ],
        "smart_home": [
            "Smart home hub",
            "Thread networking (Ethernet model)"
        ],
        "display": "N/A",
        "chip": "A15 Bionic chip",
        "camera": "N/A",
        "battery": "N/A",
        "storage": [
            "64GB",
            "128GB"
        ],
        "applecare": 2900,
        "os": "tvOS 18",
        "highlight": "4K Dolby Vision. HDR10+. Dolby Atmos. A15 Bionic. Siri Remote with USB-C.",
        "description": "Apple TV 4K (3rd generation) brings the best of TV together with your favourite Apple devices and services \u2014 including FaceTime on TV. With 4K Dolby Vision, HDR10+ and Dolby Atmos, it delivers a truly cinematic experience to your screen. Enjoy content from Apple TV, Apple Music, Apple Arcade and Photos. The included Siri Remote (3rd generation) with USB-C makes it easy to control Apple TV 4K using the touch-enabled clickpad or just your voice. Apple TV 4K also works as a smart home hub, letting you connect and control all your favourite smart home accessories. Wi-Fi model comes with 64GB storage, Wi-Fi + Ethernet model comes with 128GB storage and Thread networking support. Compatible with HD and 4K HDR TVs with HDMI.",
        "inStock": True,
        "featured": False,
        "new": False,
        "images": [
            "/static/product_images/TV_and_home/Apple_TV/appletv_1.jpg",
            "/static/product_images/TV_and_home/Apple_TV/appletv_2.jpg",
            "/static/product_images/TV_and_home/Apple_TV/appletv_3.jpg",
            "/static/product_images/TV_and_home/Apple_TV/appletv_4.jpg",
            "/static/product_images/TV_and_home/Apple_TV/appletv_5.jpg"
        ]
    },
    {
        "name": "MacBook Air 15\"",
        "category": "mac",
        "tagline": "M4. Lean. Mean. Machine.",
        "price": 124900,
        "pricing": {
            "38.91cm - 15\u201d": 124900
        },
        "sizes": [
            {
                "name": "38.91cm - 15\u201d",
                "footnote": "1"
            }
        ],
        "colors": [
            "Sky Blue",
            "Silver",
            "Starlight",
            "Midnight"
        ],
        "display": "15-inch Liquid Retina display with True Tone",
        "chips": [
            {
                "name": "10\u2011core CPU, 10\u2011core GPU",
                "price": 0,
                "description": "Give a boost to intensive tasks like gaming and creative work with more processing and graphics rendering speed."
            }
        ],
        "memory": [
            "16GB",
            "24GB",
            "32GB"
        ],
        "storage": [
            "256GB",
            "512GB",
            "1TB",
            "2TB"
        ],
        "software": [
            {
                "name": "Final Cut Pro Licence",
                "price": 29900
            },
            {
                "name": "Logic Pro Licence",
                "price": 19900
            }
        ],
        "camera": "12MP Center Stage camera",
        "battery": "Up to 18 hours",
        "os": "macOS Sequoia",
        "highlight": "M4 chip. Impossibly thin. All-day battery.",
        "description": "MacBook Air 15-inch, now with the M4 chip. Faster performance for AI and creative workflows. Features a stunning Liquid Retina display and up to 18 hours of battery life.",
        "inStock": True,
        "featured": False,
        "new": True,
        "images": [
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_1.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_2.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_3.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_4.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_5.jpg",
            "/static/product_images/Mac/Macbook_Air_13''_and_15''/mac13&15_6.jpg"
        ]
    },
    {
        "name": "MacBook Pro 16\"",
        "category": "mac",
        "tagline": "Pro at its peak.",
        "price": 249900,
        "pricing": {
            "41.05cm - 16\u201d": 249900
        },
        "sizes": [
            {
                "name": "41.05cm - 16\u201d",
                "subheading": "Available with M4 Pro or M4 Max chip.",
                "footnote": "1"
            }
        ],
        "display_finishes": [
            {
                "name": "Standard display",
                "description": "Engineered for low reflectivity to reduce glare in your environment."
            },
            {
                "name": "Nano-texture display",
                "description": "Further reduces glare and reflections in bright lighting conditions."
            }
        ],
        "colors": [
            "Space Black",
            "Silver"
        ],
        "display": "16-inch Liquid Retina XDR, ProMotion, 1600 nits",
        "chips": [
            {
                "name": "M4 Pro chip",
                "price": 0,
                "description": "Provides more performance and higher memory options for more demanding workflows."
            },
            {
                "name": "M4 Max chip",
                "price": 100000,
                "description": "Our most advanced chip ever built for a pro laptop powers the most extreme workflows."
            }
        ],
        "camera": "12MP Center Stage camera",
        "battery": "Up to 24 hours",
        "storage": [
            "512GB",
            "1TB",
            "2TB",
            "4TB",
            "8TB"
        ],
        "memory": [
            "24GB",
            "36GB",
            "48GB",
            "64GB",
            "128GB"
        ],
        "software": [
            {
                "name": "Final Cut Pro Licence",
                "price": 29900
            },
            {
                "name": "Logic Pro Licence",
                "price": 19900
            }
        ],
        "os": "macOS Sequoia",
        "highlight": "M4 Pro/Max. The ultimate pro 16-inch laptop.",
        "description": "The new 16-inch MacBook Pro. Powered by the M4 Pro, and M4 Max chips. Featuring the world's best laptop display, up to 24 hours of battery life, and a pro connectivity array.",
        "inStock": True,
        "featured": False,
        "new": True,
        "images": [
            "/static/product_images/Mac/MacBook_Pro/macpro_1.webp",
            "/static/product_images/Mac/MacBook_Pro/macpro_2.webp",
            "/static/product_images/Mac/MacBook_Pro/macpro_3.webp",
            "/static/product_images/Mac/MacBook_Pro/macpro_7.webp"
        ]
    }
]

def seed_db():
    print("🔌 Connecting to MongoDB...")
    try:
        client = MongoClient(MONGO_URI)
        db = client["cortex"]
        collection = db["products"]
        
        # Clear existing data
        deleted = collection.delete_many({})
        print(f"🗑️  Cleared {deleted.deleted_count} existing products")
        
        # Pre-process image fields so frontend cards don't break
        for p in products:
            if 'image' not in p and 'images' in p and len(p['images']) > 0:
                p['image'] = p['images'][0]

        # Insert new data
        result = collection.insert_many(products)
        print(f"✅ Imported {len(result.inserted_ids)} Apple products!")
        
        # Check categories
        categories = collection.distinct("category")
        print("\n📊 Products by category:")
        for cat in sorted(categories):
            count = collection.count_documents({"category": cat})
            print(f"   {cat}: {count} products")
            
        print(f"\n🎉 Total: {collection.count_documents({})}")
        print(f"📦 Database: {db.name}")
        print(f"📋 Collection: {collection.name}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    seed_db()
