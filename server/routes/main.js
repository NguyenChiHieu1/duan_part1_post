const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');


/**
 * GET /
 * HOME
 */
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJS Blog",
            description: " Simple Blog created with NodeJS, Express & MongoDB."
        }

        let perPage = 10;
        let page = req.query.page || 1;


        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }


});

/**
 * GET /
 * Post :id
 */

router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: " Simple Blog created with NodeJS, Express & MongoDb.",
            currentRoute: `/post/${slug}`
        }

        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Post - searchTerm
 */


router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Seach",
            description: " Simple Blog created with NodeJS, Express & MongoDB."
        }

        let searchTerm = req.body.searchTerm;

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        res.render("search", {
            data,
            locals
        });

        // console.log(searchTerm);
        // res.send(searchTerm);

    } catch (error) {
        console.log(error);
    }
});


router.get('/about', (req, res) => {
    res.render('about',
        {
            currentRoute: '/about'
        }
    );
});

// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Thời tiết",
//             body: "Trời hôm nay nắng dịu gió nhẹ"
//         },
//         {
//             title: "Giao thông",
//             body: "Đường thông ngõ thoáng"
//         },
//         {
//             title: "Thực phẩm",
//             body: "Cá, Rau, Thịt, ..."
//         },
//         {
//             title: "Mua sắm",
//             body: "Giảm giá cho các thực phẩm đông lạnh"
//         },
//         {
//             title: "Học tập",
//             body: "Nay học ăn toán hóa lý sinh"
//         },
//     ])
// }
// insertPostData();


module.exports = router;