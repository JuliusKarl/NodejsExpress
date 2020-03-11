const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

// GET all products
router.get('/', (req, res, next) => {
    Product
        .find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
});

// GET a single product by ID
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product
        .findById(id)
        .exec()
        .then(doc => {
            const response = {
                name: doc.name,
                price: doc.price,
                _id: doc._id
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
});

// POST a product
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    id: result.id
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err});
        })
});

// PATCH a product by ID
router.patch('/:productId', function(req, res, next) {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product
        .update({ _id: id }, { $set: updateOps})
        .exec()
        .then(result => {
            const response = {
                name: result.name,
                price: result.price,
                _id: result.id
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(400).json({error: err})
        });
});

// DELETE a product by ID
router.delete('/:productId', function(req, res, next) {
    const id = req.params.productId;
    Product
        .remove({ _id: id })
        .exec()
        .then(result => {
            const response = {
                name: result.name,
                price: result.price,
                _id: result.id
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
});

module.exports = router;