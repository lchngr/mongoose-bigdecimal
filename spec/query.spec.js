'use strict';

//dependencies
var path = require('path');
var _ = require('lodash');
var async = require('async');
var expect = require('chai').expect;
var BigDecimal = require('big.js');
var mongoose = require('mongoose');

require(path.join(__dirname, '..', 'index'));

var Schema = mongoose.Schema;
var Product;

//prepare fake prices
var prices = [
    new BigDecimal(1.234),
    new BigDecimal(98.993),
    new BigDecimal(949),
    new BigDecimal(8888.7905),
    new BigDecimal(9999.9999)
];

//prepare fake discounts
var discounts = [
    new BigDecimal(1),
    new BigDecimal(2),
    new BigDecimal(3),
    new BigDecimal(4),
    new BigDecimal(5)
];

describe('BigDecimal Schema Type Queries', function() {

    before(function(done) {
        //product schema
        var ProductSchema = new Schema({
            price: {
                type: Schema.Types.BigDecimal,
                required: true,
                index: true
            },
            discounts: [{
                type: Schema.Types.BigDecimal
            }]
        });
        Product = mongoose.model('Product_', ProductSchema);

        async
        .parallel({
            '0': function(next) {
                new Product({
                    price: prices[0],
                    discounts: [discounts[0], discounts[1]]
                }).save(next);
            },
            '1': function(next) {
                new Product({
                    price: prices[1],
                    discounts: [discounts[1], discounts[2]]
                }).save(next);
            },
            '2': function(next) {
                new Product({
                    price: prices[2],
                    discounts: [discounts[2], discounts[3]]
                }).save(next);
            },
            '3': function(next) {
                new Product({
                    price: prices[3],
                    discounts: [discounts[3], discounts[4]]
                }).save(next);
            },
            '4': function(next) {
                new Product({
                    price: prices[4],
                    discounts: [discounts[4]]
                }).save(next);
            }
        }, done);
    });

    it('should be able to save bigdecimal instance', function(done) {
        var price = new BigDecimal(7775.55555);

        async
        .waterfall([
            function(next) {
                Product.create({
                    price: price
                }, next);
            },
            function(product, next) {
                expect(product.price.eq(price)).to.be.true;
                next(null, product);
            },
            function(product, next) {
                product.remove(next);
            }
        ], function(error, result) {
            done(error, result);
        });
    });

    it('should be able to use bigdecimal instance in `eq` query', function(done) {

        var query = Product
            .where('price')
            .equals(prices[0]);

        query.exec(function(error, products) {

            expect(products).to.not.be.null;
            expect(products).to.have.length(1);
            expect(products[0].price.eq(prices[0])).to.be.true;

            done(error, products);
        });
    });

    it('should be able to use bigdecimal instance in `gt` query', function(done) {

        var query = Product
            .where('price')
            .gt(prices[3]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(1);
            expect(_prices).to.contain(prices[4].toString());

            done(error, products);
        });
    });

    it('should be able to use bigdecimal instance in `gte` query', function(done) {

        var query = Product
            .where('price')
            .gte(prices[3]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(2);
            expect(_prices).to.contain(prices[3].toString());
            expect(_prices).to.contain(prices[4].toString());

            done(error, products);
        });
    });


    it('should be able to use bigdecimal instance in `lt` query', function(done) {

        var query = Product
            .where('price')
            .lt(prices[1]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(1);
            expect(_prices).to.contain(prices[0].toString());

            done(error, products);
        });
    });


    it('should be able to use bigdecimal instance in `lte` query', function(done) {

        var query = Product
            .where('price')
            .lte(prices[2]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(3);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[1].toString());
            expect(_prices).to.contain(prices[2].toString());

            done(error, products);
        });
    });


    it('should be able to use bigdecimal instance in `ne` query', function(done) {

        var query = Product
            .where('price')
            .ne(prices[4]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(4);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[1].toString());
            expect(_prices).to.contain(prices[2].toString());
            expect(_prices).to.contain(prices[3].toString());

            done(error, products);
        });
    });

    it('should be able to use bigdecimal instances in `or` query', function(done) {

        var query = Product
            .where('price')
            .or([{
                price: prices[4]
            }, {
                price: prices[3]
            }]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(2);

            expect(_prices).to.contain(prices[4].toString());
            expect(_prices).to.contain(prices[3].toString());

            done(error, products);
        });
    });

    it('should be able to use bigdecimal instances in `nor` query', function(done) {

        var query = Product
            .where('price')
            .nor([{
                price: prices[4]
            }, {
                price: prices[3]
            }]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(3);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[1].toString());
            expect(_prices).to.contain(prices[2].toString());

            done(error, products);
        });
    });

    it('should be able to use bigdecimal instances in `lt` and `gt` range query', function(done) {

        var query = Product
            .where({
                price: {
                    $gt: prices[0],
                    $lt: prices[2]
                }
            });

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(1);

            expect(_prices).to.contain(prices[1].toString());

            done(error, products);
        });
    });


    it('should be able to use bigdecimal instances in `lte` and `gte` range query', function(done) {

        var query = Product
            .where({
                price: {
                    $gte: prices[0],
                    $lte: prices[2]
                }
            });

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(3);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[1].toString());
            expect(_prices).to.contain(prices[2].toString());

            done(error, products);
        });
    });

    it('should be able to use bigdecimal instances in `$in` query', function(done) {

        var query = Product
            .where('discounts')
            .in([discounts[0], discounts[1]]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(2);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[1].toString());

            done(error, products);
        });
    });

    it('should be able to use bigdecimal instances in `$nin` query', function(done) {

        var query = Product
            .where('discounts')
            .nin([discounts[0], discounts[1]]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(3);

            expect(_prices).to.contain(prices[2].toString());
            expect(_prices).to.contain(prices[3].toString());
            expect(_prices).to.contain(prices[4].toString());

            done(error, products);
        });
    });

    it('should be able to use bigdecimal instances in `$all` query', function(done) {

        var query = Product
            .where('discounts')
            .all([discounts[0], discounts[1]]);

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(1);

            expect(_prices).to.contain(prices[0].toString());

            done(error, products);
        });
    });

    it('should be able to use bigdecimal instances in `$mod` query', function(done) {

        var query = Product
            .where({
                price: {
                    $mod: [2, 1]
                }
            });

        query.exec(function(error, products) {

            var _prices = _.map(products, 'price').map(function(bigdecimal) {
                return bigdecimal.toString();
            });

            expect(products).to.not.be.null;
            expect(products).to.have.length(3);

            expect(_prices).to.contain(prices[0].toString());
            expect(_prices).to.contain(prices[2].toString());
            expect(_prices).to.contain(prices[4].toString());

            done(error, products);
        });
    });

});