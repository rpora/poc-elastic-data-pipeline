import fs from "fs";
import {Client} from "@elastic/elasticsearch";
import csv from "papaparse";
import {Transform} from "stream";
import {inferTypeFromString} from "./src/types_inferrer";
import {getMostOccuringValue} from "./src/sort_by_occurence_in_array";

const client = new Client({ node: 'http://localhost:9200' });

const MAX_BUCKET_ITEMS = 100000;

class Bucket {

  private items: any[];
  private readonly max: number;

  constructor(max = MAX_BUCKET_ITEMS) {
    this.items = [];
    this.max = max;
  }

  push(item) {
    if (this.items.length < this.max) {
      this.items.push(item);
    }
  }

  getItems(){
    let items = [...this.items];
    this.flush();
    return items;
  }

  flush() {
    this.items = [];
  }

  isFull() {
    return this.items.length === this.max;
  }

}

class RowHandler extends Transform {

  private bucket: Bucket = null;

  private inferedColumns:any = {} ;
  private inferedCount = 0;
  private inferSamplesMax = 100;
  private indexName:string;
  private lastId = 0;
  private bulkDones = 0;

  constructor(indexName) {
    super({objectMode: true});
    this.bucket = new Bucket();
    this.indexName = indexName;
  }

  getHasEnoughSampleToInfer(){
    return this.inferedCount >= this.inferSamplesMax
  }

  async registerIndices(){

    let headersWithType = Object.keys(this.inferedColumns).reduce( (acc, colName) => {
      let type = getMostOccuringValue(this.inferedColumns[colName]);
      if( type === "string") type = "text";
      acc[colName] = { type };
      return acc;
    }, {});

    // TODO: error handling
    await client.indices.create({  // This should belong to elastic
      index: this.indexName,
      body: { mappings: {  properties: headersWithType }  }
    }, {ignore: [400]});

  }

  async handleIndices(obj){

    if( ! this.getHasEnoughSampleToInfer() ){

      Object.keys(obj).forEach(key => {

        if( ! this.inferedColumns[key]){
          this.inferedColumns[key] = [];
        }

        let value = obj[key];
        let {type} = inferTypeFromString(value);
        this.inferedColumns[key].push(type);

      });

      this.inferedCount++;
      if( this.getHasEnoughSampleToInfer()  ){
        await this.registerIndices();
      }

    }
  }

  async bulk(){

    const bulkBody:any = [];

    // Could do flatMap
    this.bucket.getItems().forEach(item => {
        item.si_id =  ++this.lastId;
        bulkBody.push({ index: { _index: this.indexName,  _id: item.si_id }});
        bulkBody.push(item);
    });

    // @ts-ignore
    const { body: bulkResponse } = await client.bulk({ refresh: true, body: bulkBody });

    let errorCount = 0;
    bulkResponse.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
  }

  async _transform(obj, encoding, next) {

    await this.handleIndices(obj);

    if (this.bucket.isFull()) {
      await this.bulk();
      console.log(`Bucket ${this.bulkDones++} handled`);
    }

    this.bucket.push(obj);
    return next();
  }

  async _flush(callback) {
    await this.bulk();
  }

}

(async function main() {

  try {

    const input = fs.createReadStream("./samples/test5m_UTF8_clean.csv");

    const csvParser = csv.parse(csv.NODE_STREAM_INPUT, {
      delimiter: ";",
      header: true,
      skipEmptyLines: true
    });

    input.pipe(csvParser).pipe(new RowHandler("big_data_set"));


  } catch (error) {
    console.error(error);
    process.exit(1);
  }

})();
