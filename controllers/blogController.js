const path = require('path');
const mongoose = require('mongoose');
const url = require('url');
const slugify = require('slugify');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurify(new JSDOM().window );

const Blog = require('./../models/blogModel');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles
const express = require('express');
express().set('view engine', 'ejs');


const LIMIT_RECORDS = 4;
let skipRecords = 0;
exports.getBlogPage = async (req, res, next) => {
    
    let blogAvailability = false;
    let pagesData = {
        prev: false,
        next: false
    };

    try {
        const recordsCount = await Blog.countDocuments();
        
        if(req.url == '/prev') {
            if(recordsCount - skipRecords > LIMIT_RECORDS) {
                skipRecords = skipRecords + LIMIT_RECORDS;
            }
        } else if (req.url == '/next') {
            if(skipRecords - LIMIT_RECORDS >= 0) {
                skipRecords = skipRecords - LIMIT_RECORDS;
            }
        }

        if(recordsCount === 0) {
            res.render('blog', { blogAvailability: false, pagesData: pagesData });
            return;
        } else {
            blogAvailability = true;
        }

        if (recordsCount <= 4) {
            skipRecords = 0;
        } else {
            pagesData.isAvailable = true;
            if(skipRecords >= LIMIT_RECORDS) {
                pagesData.next = true;
            }
            if(recordsCount - skipRecords > LIMIT_RECORDS) {
                pagesData.prev = true;
            }
        }

        const blogData = await Blog
                                .find()
                                .select('_id title datetime subject tags slug')
                                .sort({ datetime: 'desc' })
                                .skip(skipRecords)
                                .limit(LIMIT_RECORDS);

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        res.render('blog', { 
            blogAvailability: blogAvailability,
            blogs: blogData,
            length: blogData.length,
            dateOptions: options,
            pagesData: pagesData 
        
        });
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
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    try {
        const blogData = await Blog
            .find({ tags: tag })
            .select('_id title datetime subject body tags slug')
            .sort({ datetime: 'desc' });
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
    
    let markdown = req.body.body;
    let sanitizedBody = domPurify.sanitize(marked(markdown));

    let newBlog = {
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        subject: req.body.subject,
        markdown: markdown,
        body: sanitizedBody,
        tags: tagsArray,
        slug: '',
        prev: { title: '', slug: '' },
        next: { title: '', slug: '' }
    }

    newBlog.slug = slugify(newBlog.title, { lower: true, strict: true });
    
    try {
        const prevBlog = await Blog
            .findOne()
            .select('title slug')
            .sort({ datetime: 'desc' })
            .limit(1);
        
        if (prevBlog) {
            newBlog.prev.title = prevBlog.title;
            newBlog.prev.slug = prevBlog.slug;
        }

        let blog = new Blog(newBlog);
        await blog.save();

        const prevBlogNextData = {
            title: newBlog.title,
            slug: newBlog.slug
        };

        if(prevBlog) {
            await prevBlog.updateOne({ next: prevBlogNextData });
        }
        
        res.status(200).json({
            message: 'New blog added'
        });

    } catch(err) {
        console.error('Navigation settings error: ' + err);
        res.status(500).render('/error');
    }
    

};