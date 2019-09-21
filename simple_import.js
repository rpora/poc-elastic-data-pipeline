const { Client } = require("@elastic/elasticsearch");

/** @type {Array} */
const gotData = require("./samples/got");

(async function main() {

    try {

        const client = new Client({
            node: 'http://localhost:9200'
        });

        const indicesResult = await client.indices.create({
            index: 'got',
            body: {
                mappings: {
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'text' },
                        quote: { type: 'text' },
                        createdAt: { type: 'date' }
                    }
                }
            }
        }, { ignore: [400] });


        const bulkBody = [];
        const items = gotData.map( item => ({
            ...item,
            createdAt: new Date()
        }));

        items.forEach(item => {
            bulkBody.push({ index: { _index: "got",  _id: item.id }});
            bulkBody.push(item);
        });

        try {
            const { body: bulkResponse } = await client.bulk({ refresh: true, body: bulkBody });

            let errorCount = 0;
            bulkResponse.items.forEach(item => {
                if( item.index && item.index.error){
                    console.log(++errorCount, item.index.error);
                }
            });

        } catch(err){
            console.error(err);
        }



    } catch (error) {
        console.error(error);
        process.exit(1);
    }

})();
