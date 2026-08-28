import mongoose from 'mongoose';
import slugify from 'slugify';
import { marked } from 'marked';
import createDomPurify from 'dompurify';
import { JSDOM } from 'jsdom';
const domPurify = createDomPurify(new JSDOM().window);

import Blog from '../models/blogModel.js';

const LIMIT_RECORDS = 4;

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const parseTags = (tagString) => tagString
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

const renderMarkdown = (markdown) => domPurify.sanitize(marked(markdown));

const getSlug = (title) => slugify(title, { lower: true, strict: true });

export const getBlogPage = async (req, res, next) => {
    try {
        const recordsCount = await Blog.countDocuments();
        const requestedPage = Number.parseInt(req.query.page, 10);
        const legacyPage = req.path === '/prev' ? 2 : 1;
        const totalPages = Math.max(1, Math.ceil(recordsCount / LIMIT_RECORDS));
        const currentPage = Math.min(
            Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : legacyPage,
            totalPages
        );
        const skipRecords = (currentPage - 1) * LIMIT_RECORDS;

        const pagesData = {
            newer: currentPage > 1,
            older: currentPage < totalPages,
            newerPage: currentPage - 1,
            olderPage: currentPage + 1
        };

        if(recordsCount === 0) {
            return res.render('blog', { blogAvailability: false, blogs: [], pagesData });
        }

        const blogData = await Blog
                                .find()
                                .select('_id title datetime subject tags slug')
                                .sort({ datetime: 'desc' })
                                .skip(skipRecords)
                                .limit(LIMIT_RECORDS);

        res.render('blog', { 
            blogAvailability: true,
            blogs: blogData,
            length: blogData.length,
            dateOptions,
            pagesData: pagesData 
        
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    
    
};

export const getSpecificBlog = async (req, res, next) => {
    try {
        const receivedBlog = await Blog.findOne({ slug: req.params.slug });

        if (!receivedBlog) {
            return res.status(404).render('ack_error', { errorMessage: 'Blog not found.' });
        }

        const [newerBlog, olderBlog] = await Promise.all([
            Blog.findOne({ datetime: { $gt: receivedBlog.datetime } })
                .select('title slug')
                .sort({ datetime: 'asc' }),
            Blog.findOne({ datetime: { $lt: receivedBlog.datetime } })
                .select('title slug')
                .sort({ datetime: 'desc' })
        ]);

        res.render('viewBlog', {
            blog: receivedBlog,
            dateOptions,
            navigation: {
                newer: newerBlog,
                older: olderBlog
            }
        });

    } catch(err) {
        console.error(err);
        next(err);
    }
};

export const getBlogsWithTag = async (req, res, next) => {
    const tag = req.params.tag;
    
    try {
        const blogData = await Blog
            .find({ tags: tag })
            .select('_id title datetime subject body tags slug')
            .sort({ datetime: 'desc' });
        res.render('searchBlog', { blogs: blogData, property: 'tag', property_value: tag, dateOptions });
    } catch (err) {
        console.error(err);
        next(err);
    }
        
};

export const setNewBlog = async (req, res,  next) => {

    if(req.body.title === '' || req.body.subject == '' || req.body.tags === '' || req.body.markdown === '') {
        return res.status(400).render('ack_error', { errorMessage: 'Some necessary fields are empty!' });
    }
    
    const tagsArray = parseTags(req.body.tags);

    if (tagsArray.length === 0) {
        return res.status(400).render('ack_error', { errorMessage: 'At least one tag is required!' });
    }
    
    const markdown = req.body.markdown;
    const sanitizedBody = renderMarkdown(markdown);
    const slug = getSlug(req.body.title);

    if (!slug) {
        return res.status(400).render('ack_error', { errorMessage: 'Title must contain at least one URL-safe character!' });
    }

    const newBlog = {
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        subject: req.body.subject,
        markdown: markdown,
        body: sanitizedBody,
        tags: tagsArray,
        slug,
        prev: { title: '', slug: '' },
        next: { title: '', slug: '' }
    };
    
    try {
        const blog = new Blog(newBlog);
        await blog.save();
        
        res.status(200).redirect(`/blog/${ newBlog.slug }`);

    } catch(err) {
        if (err.code === 11000) {
            return res.status(409).render('ack_error', { errorMessage: 'A blog with this title already exists.' });
        }

        console.error(err);
        next(err);
    }
    

};

export const createNewBlog = async (req, res, next) => {
    let blog = new Blog();
    res.render('blogTemplate', { blog: blog, pageMode: 'new' });
};

export const editOrDeleteBlog = async (req, res, next) => {
    const reqType = req.url.split('/')[1];
    const slug = req.params.slug;

    try {
        const blog = await Blog.findOne({ slug: slug }).select('_id title subject tags markdown');

        if (!blog) {
            return res.status(404).render('ack_error', { errorMessage: 'Blog not found.' });
        }

        res.render('blogTemplate', { blog: blog, pageMode: reqType });
    } catch(err) {
        console.error(err);
        res.status(500).render('ack_error', { errorMessage: 'Unable to edit the blog!' });
    }

};

export const saveEditedBlog = async (req, res, next) => {
    if (req.body.title === '' || req.body.subject == '' || req.body.tags === '' || req.body.markdown === '') {
        return res.status(400).render('ack_error', { errorMessage: 'Some necessary fields are empty!'});
    }

    try {
        
        const blog = await Blog
            .findOne({ _id: req.body.blogId });

        if (!blog) {
            return res.status(404).render('ack_error', { errorMessage: 'Blog not found.' });
        }
            
        const tagsArray = parseTags(req.body.tags);

        if (tagsArray.length === 0) {
            return res.status(400).render('ack_error', { errorMessage: 'At least one tag is required!' });
        }
        
        const markdown = req.body.markdown;
        const sanitizedBody = renderMarkdown(markdown);

        const title = req.body.title;
        const subject = req.body.subject;
        const tags = tagsArray;
        const slug = getSlug(title);

        if (!slug) {
            return res.status(400).render('ack_error', { errorMessage: 'Title must contain at least one URL-safe character!' });
        }

        await blog.updateOne({
            title,
            subject,
            tags,
            markdown,
            body: sanitizedBody,
            slug
        });

        res.status(200).redirect(`/blog/${ slug }`);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).render('ack_error', { errorMessage: 'A blog with this title already exists.' });
        }

        console.error(err);
        res.status(500).render('ack_error', { errorMessage: 'Unable to update the blog!' });
    }
    
};

export const deleteBlog = async (req, res, next) => {
    const blogId = req.body.blogId;
    
    try {
        const blog = await Blog.findByIdAndDelete(blogId);

        if (!blog) {
            return res.status(404).render('ack_error', { errorMessage: 'Blog not found.' });
        }

        res.redirect('/blog');
    } catch(err) {
        console.error(err);
        res.status(500).render('ack_error', { errorMessage: 'Unable to delete the blog!' });

    }
};
