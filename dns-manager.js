const axios = require('axios');

class CloudflareAPI {
    constructor(email, apiKey) {
        this.email = email;
        this.apiKey = apiKey;
        this.headers = this.getHeaders();
    }

    getHeaders() {
        return {
            'X-Auth-Email': this.email,
            'X-Auth-Key': this.apiKey,
            'Content-Type': 'application/json',
        };
    }

    async deleteDnsRecord(zoneId, recordId) {
        if (!zoneId || !recordId) {
            throw { success: false, exception: 'Missing required arguments. Please provide all required arguments.' };
        }

        const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;

        try {
            const response = await axios.delete(apiUrl, { headers: this.headers });

            if (response.status === 200) {
                return { success: true, message: `Deleted DNS records.`, data: response.data };
            } else {
                throw { success: false, exception: `Failed to delete DNS records. Status Code: ${response.status}`, response: response.data };
            }
        } catch (error) {
            throw { success: false, exception: `Error: ${error.message}` };
        }
    }

    async dnsScan(zoneId) {
        if (!zoneId) {
            throw { success: false, exception: 'Missing required argument. Please provide the zoneId.' };
        }

        const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;

        try {
            const response = await axios.get(apiUrl, { headers: this.headers });

            if (response.status === 200) {
                const dnsRecords = response.data.result;
                return { success: true, message: `Scanned DNS records.`, data: dnsRecords };
            } else {
                throw { success: false, exception: `Failed to retrieve DNS records. Status Code: ${response.status}`, response: response.data };
            }
        } catch (error) {
            throw { success: false, exception: `Error: ${error.message}` };
        }
    }

    async addDnsRecord(targetIp, name, recordType, zoneId, comment = 'Added DNS record', ttl = 300) {
        if (!targetIp || !name || !recordType || !zoneId) {
            throw { success: false, exception: 'Missing required arguments. Please provide all required arguments.' };
        }
    
        const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;
    
        const data = {
            content: targetIp,
            name: name,
            proxied: false,
            type: recordType,
            comment: comment,
            ttl: ttl,
        };
    
        try {
            const response = await axios.post(apiUrl, data, { headers: this.headers });
    
            if (response.status === 200) {
                return { success: true, message: 'DNS record created successfully.', data: response.data };
            } else {
                throw { success: false, exception: `Failed to create DNS record. Status Code: ${response.status}`, response: response.data };
            }
        } catch (error) {
            throw { success: false, exception: `Error: ${error.message}` };
        }
    }
    
    async updateDnsRecord(targetIp, name, recordType, zoneId, recordId, comment = 'Updated DNS record', ttl = 300) {
        if (!targetIp || !name || !recordType || !zoneId || !recordId) {
            throw { success: false, exception: 'Missing required arguments. Please provide all required arguments.' };
        }
    
        const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;
    
        const data = {
            content: targetIp,
            name: name,
            proxied: false,
            type: recordType,
            comment: comment,
            ttl: ttl,
        };
    
        try {
            const response = await axios.put(apiUrl, data, { headers: this.headers });
    
            if (response.status === 200) {
                return { success: true, message: 'DNS record updated successfully.', data: response.data };
            } else {
                throw { success: false, exception: `Failed to update DNS record. Status Code: ${response.status}`, response: response.data };
            }
        } catch (error) {
            throw { success: false, exception: `Error: ${error.message}` };
        }
    }
}

module.exports = CloudflareAPI;

