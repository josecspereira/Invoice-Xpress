const axios = require('axios');
const moment = require('moment');

const HEADER = {
    'accept': 'application/json',
    'content-type': 'application/json'
};
module.exports = class InvoiceXpressWrapper {
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
            axios.post(`https://${this.accountName}.app.invoicexpress.com/clients.json?api_key=${apiKey}`, {
                    client
                }, header)
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

    //TODO: handle errors
    async createInvoiceReceipt(items, order, user, state, sendEmail, type, serie, dueDate) {
        let invoice = {
            date: moment().format('DD/MM/YYYY'),
            due_date: moment().format('DD/MM/YYYY'),
            reference: order._id,
            client: {
                name: user.name,
                code: user.code,
                email: user.email,
                fiscal_id: user.fiscalId,
            },
            items,
        };
        if (!order.isEuMember) {
            invoice.tax_exemption = 'M99';
        }
        if (serie) invoice.sequence = serie;
        let response = await axios.post(`https://${this.accountName}.app.invoicexpress.com/${type}s.json?api_key=${this.apiKey}`, {
            invoice
        }, HEADER);
        response = response.data.invoice;
        if (state) {
            response = await axios.put(`https://${this.accountName}.app.invoicexpress.com/invoice/${response.id}/change-state.json?api_key=${this.apiKey}`, {
                invoice: {
                    state,
                }
            }, HEADER);
        }
        return response;
    }

 	/**
     *
     * @param {String} sequenceId Optional sequenceId, if no value is given then all sequences will be listed
     */
    async getSequences(sequenceId = null) {
        let result;
        if (sequenceId) {
            result = await axios.get(`https://${this.accountName}.app.invoicexpress.com/sequences/${sequenceId}.json?api_key=${this.apiKey}`, HEADER);
        } else {
            result = await axios.get(`https://${this.accountName}.app.invoicexpress.com/sequences.json?api_key=${this.apiKey}`, HEADER);
        }
        result = result.data.sequences;
        return result;
    }
}
