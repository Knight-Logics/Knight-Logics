'use strict';

const Stripe = require('stripe');

/**
 * Stripe client for Node and Cloudflare Workers.
 * Workers have no Node HTTP stack, so the SDK must use its fetch client.
 */
function createStripe(secretKey, config) {
    if (!secretKey) return null;
    const options = Object.assign({}, config);
    if (!options.apiVersion) options.apiVersion = '2025-03-31.basil';
    if (!options.httpClient && typeof Stripe.createFetchHttpClient === 'function') {
        options.httpClient = Stripe.createFetchHttpClient();
    }
    return new Stripe(secretKey, options);
}

module.exports = { createStripe, Stripe };
