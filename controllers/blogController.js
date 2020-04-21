const path = require('path');
const mongoose = require('mongoose');
const slugify = require('slugify');

const Blog = require('./../models/blogModel');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles
const express = require('express');
express().set('view engine', 'ejs');


exports.getBlogPage = async (req, res, next) => {
    try {
        const blogData = await Blog
                                .find()
                                .select('_id title datetime subject tags slug')
                                .sort({ datetime: 'desc' });
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        res.render('blog', { blogs: blogData, length: blogData.length, dateOptions: options });
    } catch (err) {
        console.error(err);
        res.status(504).redirect('/error');
    }
    
    
};

exports.getSpecificBlog = async (req, res, next) => {
    try {
        const receivedBlog = await Blog.findOne({ slug: req.params.slug });
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        res.render('viewBlog', { blog: receivedBlog, dateOptions: options });

    } catch(err) {
        console.error(err);
        res.status(504).redirect('/error');
    }
};

exports.getBlogsWithTag = async (req, res, next) => {
    const tag = req.params.tag;
    
    try {
        const blogData = await Blog
            .find({ tags: tag })
            .select('_id title datetime subject body tags slug')
            .sort({ datetime: 'desc' });
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        res.render('searchBlog', { blogs: blogData, property: 'tag', property_value: tag, dateOptions: options });
    } catch (err) {
        console.error(err);
        res.status(504).redirect('/error');
    }
        
};

exports.setNewBlog = async (req, res,  next) => {
    let tagString = req.body.tags;
    tagsArray = tagString.split(',');
    tagsArray = tagsArray.map(tag => tag.toString().trim());
    
    let newBlog = {
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        subject: req.body.subject,
        body: req.body.body,
        tags: tagsArray,
        slug: '',
        prev: { title: '', slug: '' },
        next: { title: '', slug: '' }
    }

    newBlog.slug = slugify(newBlog.title, { lower: true, strict: true });
    
    try {
        const prevBlogData = await Blog
                                    .find()
                                    .select('title slug')
                                    .sort({ datetime: 'desc' })
                                    .limit(1);        

        if (prevBlogData.length > 0) {
            newBlog.prev.title = prevBlogData[0].title;
            newBlog.prev.slug = prevBlogData[0].slug;
        }
        
        let blog = new Blog(newBlog);
        await blog.save();

        const prevBlogNextData = {
            title: newBlog.title,
            slug: newBlog.slug
        };
        
        await Blog
            .findOne({ slug: newBlog.prev.title })
            .updateOne({ next: prevBlogNextData });

        res.status(200).json({
            message: 'New blog added'
        });

    } catch(err) {
        console.error('Navigation settings error: ' + err);
        res.status(500).render('/error');
    }
    

};