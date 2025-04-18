export interface MongoFieldSchema {
  field: string;
  type: string;
  isRequired: boolean;
  subFields?: MongoFieldSchema[];
}

export interface MongoCollectionSchema {
  collection: string;
  fields: MongoFieldSchema[];
  count: number;
  indexes?: unknown[];
}
