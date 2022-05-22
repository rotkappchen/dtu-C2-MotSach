const router = require('express').Router()
const blogCtrl = require ('../controllers/blogCtrl')
const auth = require('../middleware/auth')
const authEditor = require ('../middleware/authEditor')

router.route('/blogs')
    .get(blogCtrl.getBlogs)
    .post(auth, blogCtrl.createBlog)

    router.route('/blogs/:id')
    .delete(auth, blogCtrl.deleteBlog)
    .put(auth, blogCtrl.updateBlog)
    .patch(blogCtrl.reviews)

router.patch('/update_status/:id', auth, authEditor, blogCtrl.updateBlogStatus)

module.exports = router