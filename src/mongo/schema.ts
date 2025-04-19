import { Collection, Document } from "mongodb";

export type FieldType = "string" | "number" | "boolean" | "object" | "array" | "date" | "null" | "unknown";

export interface FieldSchema {
  field: string;
  type: FieldType | FieldType[]; 
  isRequired: boolean;
}

export async function getCollectionSchema(
  collection: Collection<Document>,
  sampleSize = 100
): Promise<FieldSchema[]> {
  const docs = await collection.find({}).limit(sampleSize).toArray();

  const fieldTypes: Map<string, Set<FieldType>> = new Map();
  const fieldPresence: Map<string, number> = new Map();

  for (const doc of docs) {
    for (const [key, value] of Object.entries(doc)) {
      const type = inferType(value);

      if (!fieldTypes.has(key)) {
        fieldTypes.set(key, new Set());
      }

      fieldTypes.get(key)!.add(type);

      fieldPresence.set(key, (fieldPresence.get(key) || 0) + 1);
    }
  }

  const totalDocs = docs.length;

  return Array.from(fieldTypes.entries()).map(([field, types]) => ({
    field,
    type: types.size === 1 ? Array.from(types)[0] : Array.from(types),
    isRequired: fieldPresence.get(field)! === totalDocs,
  }));
}

function inferType(value: any): FieldType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  return typeof value as FieldType;
}
