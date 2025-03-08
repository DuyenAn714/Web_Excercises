const mongoose = require('mongoose');
const Fashion = require('./models/Fashion');

mongoose.connect('mongodb://localhost:27017/FashionData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Kết nối MongoDB thành công"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

const sampleData = [
    // Style 1: Casual
    {
        title: "Áo Thun Oversize Đơn Giản",
        details: "<p>Áo thun oversize đơn giản với chất liệu cotton cao cấp, thoáng mát.</p>",
        thumbnail: "ao_thun_oversize.png",
        style: "Casual",
        createdAt: new Date()
    },
    {
        title: "Quần Jeans Rách Gối",
        details: "<p>Quần jeans rách gối phong cách trẻ trung, năng động.</p>",
        thumbnail: "https://example.com/ripped-jeans.jpg",
        style: "Casual",
        createdAt: new Date()
    },
    {
        title: "Giày Sneaker Trắng",
        details: "<p>Giày sneaker trắng đơn giản nhưng không kém phần thanh lịch.</p>",
        thumbnail: "https://example.com/white-sneakers.jpg",
        style: "Casual",
        createdAt: new Date()
    },
    
    // Style 2: Formal
    {
        title: "Áo Sơ Mi Trắng",
        details: "<p>Áo sơ mi trắng trang nhã, phù hợp cho môi trường công sở.</p>",
        thumbnail: "https://example.com/white-shirt.jpg",
        style: "Formal",
        createdAt: new Date()
    },
    {
        title: "Quần Âu Nam",
        details: "<p>Quần âu nam có thiết kế đơn giản, tiện lợi khi di chuyển.</p>",
        thumbnail: "https://example.com/formal-pants.jpg",
        style: "Formal",
        createdAt: new Date()
    },
    {
        title: "Váy Công Sở",
        details: "<p>Váy công sở thanh lịch, tôn dáng cho phái nữ.</p>",
        thumbnail: "https://example.com/office-dress.jpg",
        style: "Formal",
        createdAt: new Date()
    },
    
    // Style 3: Vintage
    {
        title: "Áo Len Oversized",
        details: "<p>Áo len oversized phong cách retro, ấm áp trong mùa đông.</p>",
        thumbnail: "https://example.com/oversized-sweater.jpg",
        style: "Vintage",
        createdAt: new Date()
    },
    {
        title: "Quần Ống Rộng",
        details: "<p>Quần ống rộng mang đậm phong cách thập niên 70.</p>",
        thumbnail: "https://example.com/wide-leg-pants.jpg",
        style: "Vintage",
        createdAt: new Date()
    },
    {
        title: "Mũ Beret",
        details: "<p>Mũ beret phong cách Pháp, điểm nhấn cho outfit hàng ngày.</p>",
        thumbnail: "https://example.com/beret-hat.jpg",
        style: "Vintage",
        createdAt: new Date()
    }
];

Fashion.insertMany(sampleData)
    .then(() => {
        console.log("✅ Dữ liệu mẫu đã được thêm vào MongoDB");
        mongoose.connection.close();
    })
    .catch(err => console.error("❌ Lỗi khi nhập dữ liệu:", err));
