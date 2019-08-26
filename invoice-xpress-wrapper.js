const axios = require('axios');

const HEADER = {
    'accept': 'application/json',
    'content-type': 'application/json'
};
class InvoiceXpressWrapper {
    /**
     * 
     * @param {String} accountName 
     * @param {String} apiKey 
     */
    constructor(accountName, apiKey) {
        if (!accountName || accountName == void 0) {
            throw 'Invalid Account Name';
        }
        if (!apiKey || apiKey == void 0) {
            throw 'Invalid Api Key';
        }
        this.accountName = accountName;
        this.apiKey = apiKey;
    }

    //WIP
    listAllInvoices() {
        console.log('Getting ask');
        return new Promise((resolve, reject) => {
            axios
                .get(`https://${this.accountName}.app.invoicexpress.com/invoice_receipts.json?api_key=${this.apiKey}`, HEADER)
                .then(result => {
                    if (result.status == 200)
                        resolve(result.data);
                    else
                        resolve('something');

                })
                .catch(err => {
                    reject(err);
                });
        });

    }
    /**
     * Checks if a client with the id sent by parameter exists, returning the found user...
     * @param {String} clientId 
     */
    checkClient(clientId) {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://${this.accountName}.app.invoicexpress.com/clients/find-by-code.json?client_code=${clientId}&api_key=${this.apiKey}`, header)
                .then(result => {
                    resolve(result.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    /**
     * Creates a new client with the client object sent by arguments. Object format must comply to InvoiceXpress API.
     * @param {Object} client 
     */
    createClient(client) {
        return new Promise((resolve, reject) => {
            axios.post(`https://${accountName}.app.invoicexpress.com/clients.json?api_key=${apiKey}`, { client }, header)
                .then(response => {
                    if (response.status == 201) {
                        resolve(response.data);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    /**
     * WIP
     * @param {Object} order 
     * @param {Object} user 
     * @param {Boolean} isFinal 
     * @param {Boolean} sendEmail 
     */
    createInvoiceReceipt(order, user, isFinal, sendEmail) {

    }
}

module.exports = InvoiceXpressWrapper;
